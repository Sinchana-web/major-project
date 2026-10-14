import os
import tempfile
from datetime import date
import cv2
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_breed
import gemini_service
import pashudhan_service

app = Flask(__name__)
CORS(app)

IMAGE_EXTENSIONS = {"jpg", "jpeg", "png"}
VIDEO_EXTENSIONS = {"mp4", "mov", "webm", "avi", "mkv"}
ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS

# MySQL Database Configuration (Optional for persistence)
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_mysql_password",
    "database": "cattle_db"
}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def is_video_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in VIDEO_EXTENSIONS

def extract_frame_from_video(video_path):
    """Extracts a clear frame from the uploaded video for computer vision analysis."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError("Could not open uploaded video file.")
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    
    # Target frame at ~1.5s or 25% into the video to skip opening frames
    target_frame_num = min(int(fps * 1.5), max(0, total_frames // 4))
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame_num)
    
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ret, frame = cap.read()
        
    cap.release()
    if not ret or frame is None:
        raise ValueError("Could not read any valid frames from the uploaded video.")
    
    frame_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    cv2.imwrite(frame_tmp.name, frame)
    return frame_tmp.name

def save_prediction_to_db(data):
    """Saves the animal record into MySQL database without any personal owner information."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        query = """
            INSERT INTO animal_records 
            (animal_id, species, breed, confidence, detection_confidence, region, description, scan_date) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data.get("animal_id"),
            data.get("species"),
            data.get("breed"),
            data.get("confidence"),
            data.get("detection_confidence"),
            data.get("region"),
            data.get("description"),
            data.get("date")
        )
        
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Database insertion skipped/failed: {e}")

@app.route("/", methods=["GET"])
def home():
    has_gemini = bool(os.environ.get("GEMINI_API_KEY") or os.path.exists(os.path.join(os.path.dirname(__file__), ".env")))
    return jsonify({
        "status": "running",
        "message": "Pashu Pehchaan - AI Livestock Recognition & National Breed Intelligence API",
        "gemini_vision_enabled": has_gemini,
        "media_supported": ["Photos (JPG/PNG)", "Videos (MP4/MOV/WEBM/AVI)"],
        "endpoint": "/predict (POST, form-data key: image)"
    })

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No media file provided. Use form-data key 'image'."}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported format. Use JPG, PNG, MP4, MOV, or WEBM."}), 400

    suffix = os.path.splitext(file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        file.save(tmp.name)
        raw_media_path = tmp.name

    analysis_image_path = raw_media_path
    extracted_frame_path = None
    media_type = "video" if is_video_file(file.filename) else "image"

    try:
        # If media is a video, extract a key frame for computer vision
        if media_type == "video":
            extracted_frame_path = extract_frame_from_video(raw_media_path)
            analysis_image_path = extracted_frame_path

        # Step 1: Attempt recognition with Google Gemini 3.6 Flash Vision
        gemini_success = False
        gemini_data = None
        
        try:
            gemini_data = gemini_service.analyze_livestock_image(analysis_image_path)
            gemini_success = True
        except Exception as gemini_err:
            print(f"Gemini Vision API fallback triggered: {gemini_err}")

        if gemini_success and gemini_data:
            # Check if Gemini rejected the image as not livestock (e.g. human, pet, object)
            if not gemini_data.get("is_livestock", True):
                rejection_msg = gemini_data.get(
                    "rejection_reason",
                    "This media does not appear to show cattle or buffalo. Please upload a clear photo or video of the animal."
                )
                return jsonify({"error": rejection_msg, "message": rejection_msg, "success": False}), 400

            # Generate pure National Breed & Biological Profile (Zero Owner Info)
            profile = pashudhan_service.generate_national_breed_profile(gemini_data)

            response_data = {
                "animal_id": profile["icar_accession_code"],
                "breed": gemini_data.get("breed"),
                "species": gemini_data.get("species", "Cattle"),
                "animal_gender": gemini_data.get("animal_gender", "Mature Animal"),
                "confidence": gemini_data.get("confidence", 0.95),
                "detection_confidence": 0.98,
                "breed_resemblances": gemini_data.get("breed_resemblances", []),
                "region": gemini_data.get("geographic_distribution") or gemini_data.get("native_region"),
                "description": gemini_data.get("description"),
                "horn_traits": gemini_data.get("horn_traits"),
                "coat_and_build": gemini_data.get("coat_and_build"),
                "purpose": gemini_data.get("purpose"),
                "average_daily_milk_litres": gemini_data.get("average_daily_milk_litres"),
                "fat_percentage": gemini_data.get("fat_percentage"),
                "cultivation_utility": gemini_data.get("cultivation_utility"),
                "rearing_and_care": gemini_data.get("rearing_and_care"),
                "media_type": media_type,
                "date": str(date.today()),
                "engine": "Google Gemini 3.6 Flash (ICAR-NBAGR Grounded)",
                "national_breed_profile": profile,
                "success": True
            }

            save_prediction_to_db(response_data)
            return jsonify(response_data), 200

        # Step 2: Fallback to local YOLO + MobileNetV2 pipeline if Gemini is unavailable
        result = predict_breed(analysis_image_path)
        if result.get("success", False):
            profile = pashudhan_service.generate_national_breed_profile(result)
            response_data = {
                "animal_id": profile["icar_accession_code"],
                "breed": result.get("breed"),
                "species": result.get("species"),
                "animal_gender": "Mature Cattle",
                "confidence": result.get("confidence"),
                "detection_confidence": result.get("detection_confidence"),
                "breed_resemblances": result.get("breed_resemblances", []),
                "region": result.get("region"),
                "description": result.get("description"),
                "media_type": media_type,
                "date": result.get("date"),
                "engine": "MobileNetV2 Local Classifier",
                "national_breed_profile": profile,
                "success": True
            }
            save_prediction_to_db(response_data)
            return jsonify(response_data), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
    finally:
        if os.path.exists(raw_media_path):
            os.remove(raw_media_path)
        if extracted_frame_path and os.path.exists(extracted_frame_path):
            os.remove(extracted_frame_path)

@app.route("/api/search-breed", methods=["GET", "POST"])
def search_breed():
    """
    Looks up any Indian cattle or buffalo breed using Gemini grounded intelligence
    and authentic reference imagery.
    """
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        query = data.get("query", "").strip()
    else:
        query = request.args.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query parameter 'query' is required."}), 400

    try:
        breed_data = gemini_service.search_breed_with_gemini(query)
        return jsonify({"success": True, "breed": breed_data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Breed search failed: {str(e)}"}), 500

if __name__ == "__main__":
    print("Starting Pashu Pehchaan API with Animal Intelligence & Video Support on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)