"""
predict.py
Full breed recognition pipeline:
  1. YOLOv8 detects whether the image actually contains a cow/buffalo
     (rejects dogs, cats, people, random objects)
  2. MobileNetV2 classifies the breed (trained on 5 Karnataka breeds)
  3. Output is formatted as a structured record compatible with
     Bharat Pashudhan-style livestock record-keeping

Usage:
    python predict.py path/to/image.jpg
    (or just run `python predict.py` to use the default test image path below)
"""

import os
import sys
import uuid
from datetime import date

import numpy as np
from PIL import Image
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models as keras_models
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ---------------------------------------------------------
# Config
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(BASE_DIR, "models", "breed_classifier_weights.weights.h5")
IMG_SIZE = 224
CONFIDENCE_THRESHOLD = 0.60          # below this, breed result is flagged "uncertain"
YOLO_CONFIDENCE_THRESHOLD = 0.35     # below this, a cattle detection is not trusted
COCO_CATTLE_CLASSES = {19: "Cattle"} # COCO class 19 = "cow". Buffalo has no separate COCO class,
                                      # so buffalo photos are detected under the same "cow" class.

# Common non-cattle classes — if YOLO detects one of these with HIGHER
# confidence than any cattle detection, that's real evidence the image
# isn't cattle/buffalo, so we reject outright rather than falling back.
COCO_REJECT_CLASSES = {
    0: "person", 15: "cat", 16: "dog", 17: "horse", 18: "sheep",
    20: "elephant", 21: "bear", 22: "zebra", 23: "giraffe",
}
REJECT_CONFIDENCE_THRESHOLD = 0.35   # confidence needed on a non-cattle class to trust the rejection

# Must match the EXACT order TensorFlow assigned during training
# (alphabetical order of your breed folder names)
CLASS_NAMES = ["Amritmahal", "Deoni", "Hallikar", "Krishna_Valley", "Malnad_Gidda"]

# Breed metadata — species, native region, short description.
# This is what turns a bare label into an actually useful record.
BREED_INFO = {
    "Amritmahal": {
        "species": "Cattle",
        "region": "Chikmagalur, Chitradurga, Hassan (Karnataka)",
        "description": "A grey draught breed known for strength and endurance, "
                        "traditionally used for agricultural work and cart-pulling."
    },
    "Deoni": {
        "species": "Cattle",
        "region": "Karnataka-Maharashtra-Telangana border belt",
        "description": "A dual-purpose breed typically white with black/dark patches "
                        "on the head and neck, valued for both milk and draught power."
    },
    "Hallikar": {
        "species": "Cattle",
        "region": "Tumkur, Mandya, Hassan, Chitradurga (Karnataka)",
        "description": "A grey draught breed with long upward-curving horns, "
                        "prized for its strength and speed in agricultural work."
    },
    "Krishna_Valley": {
        "species": "Cattle",
        "region": "Krishna river black-soil belt (Karnataka)",
        "description": "A large, light-grey to white breed suited to heavy soil "
                        "cultivation, known for its calm temperament and size."
    },
    "Malnad_Gidda": {
        "species": "Cattle",
        "region": "Western Ghats, Malnad region (Karnataka)",
        "description": "A small dwarf breed adapted to high-rainfall hilly terrain, "
                        "valued for disease resistance and low maintenance needs."
    },
}

# ---------------------------------------------------------
# Load YOLOv8 (pretrained, no training needed for detection)
# ---------------------------------------------------------
print("Loading YOLOv8 detector...")
from ultralytics import YOLO
yolo_model = YOLO(os.path.join(BASE_DIR, "yolov8n.pt"))
print("YOLOv8 ready.")

# ---------------------------------------------------------
# Rebuild breed classifier architecture, load trained weights
# (rebuild + load_weights avoids Keras version mismatch issues
#  between Colab and local environments)
# ---------------------------------------------------------
print("Building breed classifier...")
base_model = MobileNetV2(weights=None, include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
model = keras_models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.3),
    layers.Dense(len(CLASS_NAMES), activation="softmax")
])
model.load_weights(WEIGHTS_PATH)
print("Breed classifier ready.\n")


# ---------------------------------------------------------
# Stage 1: Detect and crop the animal
# ---------------------------------------------------------
def detect_animal(image_path):
    """
    Runs YOLOv8 on the image and picks the SINGLE highest-confidence
    detection among cattle classes AND reject classes combined — this is
    the key fix: cattle no longer wins by default just because it was
    checked first. Whichever class YOLO is most confident about wins.

    Returns (cropped_PIL_image, detection_confidence, species_guess, rejected_as)
      - If cattle/buffalo is the most confident relevant detection:
            (cropped_image, confidence, species, None)
      - If a non-cattle class is the most confident relevant detection:
            (None, 0.0, None, class_name)
      - If nothing relevant was detected at all (genuinely ambiguous):
            (None, 0.0, None, None)
    """
    results = yolo_model(image_path, verbose=False)
    result = results[0]

    best_cattle_box = None
    best_cattle_conf = 0.0
    species_guess = None

    best_reject_class = None
    best_reject_conf = 0.0

    for box in result.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])

        if cls_id in COCO_CATTLE_CLASSES and conf > YOLO_CONFIDENCE_THRESHOLD and conf > best_cattle_conf:
            best_cattle_box = box.xyxy[0].tolist()
            best_cattle_conf = conf
            species_guess = COCO_CATTLE_CLASSES[cls_id]

        if cls_id in COCO_REJECT_CLASSES and conf > REJECT_CONFIDENCE_THRESHOLD and conf > best_reject_conf:
            best_reject_class = COCO_REJECT_CLASSES[cls_id]
            best_reject_conf = conf

    # KEY FIX: decide based on whichever detection is genuinely more confident,
    # not by unconditionally trusting cattle just because it was checked first.
    if best_cattle_box is not None and best_cattle_conf >= best_reject_conf:
        img = Image.open(image_path).convert("RGB")
        x1, y1, x2, y2 = [int(v) for v in best_cattle_box]
        cropped = img.crop((x1, y1, x2, y2))
        return cropped, round(best_cattle_conf, 4), species_guess, None

    if best_reject_class is not None:
        return None, 0.0, None, best_reject_class

    # Nothing relevant detected at all — genuinely ambiguous (likely a close-up
    # crop that doesn't match COCO's typical scene-in-context training), safe
    # to fall back to classifying the full image.
    return None, 0.0, None, None


# ---------------------------------------------------------
# Stage 2 + record building: classify breed, build structured output
# ---------------------------------------------------------
def predict_breed(image_path):
    """
    Full pipeline: detect -> crop -> classify -> structured record.

    Always returns a dict. On any failure (no animal detected, bad file,
    low confidence, unexpected error), returns a dict with "success": False
    and a human-readable "message" — never raises an exception to the caller.
    """
    try:
        cropped_img, detection_confidence, species_guess, rejected_as = detect_animal(image_path)
    except Exception as e:
        return _error_record(f"Could not process image: {str(e)}")

    # Confidently something else (person/dog/cat/etc.) — reject outright, no fallback
    if rejected_as is not None:
        return _error_record(
            f"This image appears to show a {rejected_as}, not cattle or buffalo. "
            f"Please upload a clear photo of the animal."
        )

    # Genuinely ambiguous (nothing detected at all): many breed photos are tight
    # close-ups that COCO-trained YOLO doesn't reliably recognize as "cow" (it
    # expects the animal within a wider scene). Rather than hard-rejecting these,
    # fall back to classifying the full image directly, but mark that detection
    # was skipped so this is visible in the record.
    used_fallback = False
    if cropped_img is None:
        try:
            cropped_img = Image.open(image_path).convert("RGB")
            detection_confidence = None
            used_fallback = True
        except Exception as e:
            return _error_record(f"Could not open image: {str(e)}")

    try:
        img = cropped_img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img).astype("float32")
        img_array = preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)

        preds = model.predict(img_array, verbose=0)[0]
        top_idx = int(np.argmax(preds))
        top_confidence = float(preds[top_idx])
        breed_name = CLASS_NAMES[top_idx]

        top3_idx = preds.argsort()[-3:][::-1]
        top3 = [
            {"breed": CLASS_NAMES[i], "confidence": round(float(preds[i]), 4)}
            for i in top3_idx
        ]

        # Compute breed_resemblances percentages strictly summing to 100%
        sorted_indices = preds.argsort()[::-1]
        resemblances = []
        raw_top_sum = float(sum(preds[sorted_indices[:3]]))
        if raw_top_sum > 0:
            for idx in sorted_indices[:3]:
                b_name = CLASS_NAMES[idx]
                p = round((float(preds[idx]) / raw_top_sum) * 100)
                meta = BREED_INFO.get(b_name, {})
                resemblances.append({
                    "breed": b_name.replace("_", " "),
                    "percentage": p,
                    "reasoning": meta.get("description", f"Conformational resemblance to {b_name.replace('_', ' ')}.")
                })
            diff = 100 - sum(r["percentage"] for r in resemblances)
            resemblances[0]["percentage"] += diff
        else:
            resemblances = [{"breed": breed_name.replace("_", " "), "percentage": 100, "reasoning": "Observed phenotype."}]

        is_confident = top_confidence >= CONFIDENCE_THRESHOLD
        breed_meta = BREED_INFO.get(breed_name, {})

        record = {
            "success": True,
            "animal_id": _generate_animal_id(breed_name),
            "breed": breed_name if is_confident else None,
            "species": breed_meta.get("species", species_guess),
            "region": breed_meta.get("region"),
            "description": breed_meta.get("description"),
            "confidence": round(top_confidence, 4),
            "detection_method": "model_prediction",
            "detection_confidence": detection_confidence,
            "yolo_fallback_used": used_fallback,
            "date": str(date.today()),
            "top3": top3,
            "breed_resemblances": resemblances,
            "is_confident": is_confident,
        }

        if not is_confident:
            record["message"] = (
                "Uncertain prediction — please retake the photo with the animal "
                "centered and well-lit, or verify manually."
            )

        return record

    except Exception as e:
        return _error_record(f"Breed classification failed: {str(e)}")


def _generate_animal_id(breed_name):
    """Generates a short, unique-ish record ID, e.g. KA-HAL-2026-4F2A."""
    breed_code = breed_name[:3].upper() if breed_name else "UNK"
    year = date.today().year
    short_id = uuid.uuid4().hex[:4].upper()
    return f"KA-{breed_code}-{year}-{short_id}"


def _error_record(message):
    """Standard shape for any failed prediction, so the caller (API/UI)
    can always rely on the same fields being present."""
    return {
        "success": False,
        "animal_id": None,
        "breed": None,
        "species": None,
        "region": None,
        "description": None,
        "confidence": 0.0,
        "detection_method": None,
        "date": str(date.today()),
        "top3": [],
        "breed_resemblances": [],
        "is_confident": False,
        "message": message,
    }


# ---------------------------------------------------------
# Manual entry — for breeds not yet covered by the model (e.g. Dharwadi buffalo)
# ---------------------------------------------------------
def create_manual_record(breed_name, species, region=None, description=None):
    """
    Builds a record in the same format as predict_breed(), but for a breed
    entered manually by a field worker/farmer (e.g. Dharwadi buffalo, or any
    breed outside the trained set). Keeps the export format consistent
    regardless of whether detection was automatic or manual.
    """
    return {
        "success": True,
        "animal_id": _generate_animal_id(breed_name),
        "breed": breed_name,
        "species": species,
        "region": region,
        "description": description,
        "confidence": None,
        "detection_method": "manual_entry",
        "detection_confidence": None,
        "date": str(date.today()),
        "top3": [],
        "is_confident": True,
    }


# ---------------------------------------------------------
# Quick local test
# ---------------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_image = sys.argv[1]
    else:
        test_image = "C:/Users/prabh/Downloads/cow1.jpg"

    result = predict_breed(test_image)

    print("\n--- Prediction Result ---")
    if not result["success"]:
        print(f"❌ {result['message']}")
    else:
        print(f"Animal ID:   {result['animal_id']}")
        print(f"Breed:       {result['breed'] or 'Uncertain'}")
        print(f"Species:     {result['species']}")
        print(f"Region:      {result['region']}")
        print(f"Description: {result['description']}")
        print(f"Confidence:  {result['confidence']*100:.2f}%")
        if result.get("detection_confidence") is not None:
            print(f"Detection confidence (YOLO): {result['detection_confidence']*100:.2f}%")
        else:
            print(f"Detection confidence (YOLO): N/A (fallback used — YOLO did not detect the animal, "
                  f"full image was classified directly)")
        print(f"Date:        {result['date']}")
        print("Top 3:")
        for item in result["top3"]:
            print(f"  {item['breed']:20s} {item['confidence']*100:.2f}%")
        if not result["is_confident"]:
            print(f"\n⚠️  {result['message']}")