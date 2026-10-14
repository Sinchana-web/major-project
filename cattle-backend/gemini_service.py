import os
import json
from PIL import Image
from google import genai

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        env_path = os.path.join(os.path.dirname(__file__), ".env")
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    if line.startswith("GEMINI_API_KEY="):
                        api_key = line.strip().split("=", 1)[1].strip()
                        os.environ["GEMINI_API_KEY"] = api_key
                        break
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def analyze_livestock_image(image_path: str):
    """
    Analyzes an animal photo using Google Gemini 3.6 Flash Vision.
    Performs deep biological, historical, geographical, and functional assessment.
    Zero owner information.
    """
    client = get_gemini_client()
    if not client:
        raise ValueError("GEMINI_API_KEY is not configured.")

    img = Image.open(image_path).convert("RGB")
    # Downsample high-resolution images for ultra-fast vision transmission
    max_dim = 1024
    if max(img.size) > max_dim:
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

    prompt = """
You are a senior livestock scientist, veterinary anatomist, and ICAR-NBAGR breed specialist in India.
Analyze this photo (or extracted video frame) of the animal in detail.

1. Verify if the image shows Cattle (Cow, Bull, Ox, Bullock, Calf) or Buffalo.
   If it is a human, household pet (dog/cat), wild animal, or object, set is_livestock to false and provide rejection_reason.

2. If it IS Cattle or Buffalo:
   - Identify the exact Indian indigenous breed (e.g., Hallikar, Gir, Sahiwal, Murrah, Deoni, Amritmahal, Krishna Valley, Malnad Gidda, Kankrej, Ongole, Jaffarabadi, Surti, Tharparkar, Kangayam, Bargur, etc.) or exotic crossbreed.
   - Resemblance Percentage Breakdown: Because indigenous cattle often share physical traits or crossbreeding characteristics, provide a percentage breakdown of how much the observed animal resembles top candidate breeds (e.g., 80% Gir, 12% Sahiwal, 8% Kankrej). The percentages MUST be positive integers that SUM EXACTLY TO 100%. For each breed, explain the observed morphological traits (horns, forehead, ears, hump, coat, dewlap) that justify this resemblance percentage.
   - Determine the gender/role: Is it a Cow/Female, a Bull/Ox/Bullock, or a Calf?
   - Explain WHERE this breed is seen most in India: specific states, key agricultural districts, and native agro-climatic tract.
   - Explain its HISTORY & ORIGIN: how it was developed historically and its cultural heritage in Indian agriculture.
   - Detail its BIOLOGICAL FEATURES: horn shape & direction, coat color/patches, hump size, dewlap, heat tolerance, and tropical disease resistance.
   - If it is a COW/BUFFALO (or female): analyze milk production (average daily yield in litres, lactation cycle yield, milk fat %, A1 vs A2 milk characteristics).
   - If it is an OX/BULL/BULLOCK (or draught/dual breed): analyze its utility for AGRICULTURAL CULTIVATION (ploughing capacity in black/wet soil, endurance, tilling speed, cart-pulling ability, heat stamina).
   - Detail REARING & MANAGEMENT: how the breed is reared, grazing habits vs stall-fed, feeding requirements, and climate care.

Return ONLY a valid raw JSON object (no markdown ```json blocks) with this schema:
{
  "is_livestock": true,
  "rejection_reason": null,
  "species": "Cattle" | "Buffalo",
  "breed": "Exact breed name",
  "animal_gender": "Cow / Female" | "Ox / Bullock" | "Bull" | "Calf",
  "confidence": 0.95,
  "breed_resemblances": [
    {
      "breed": "Primary breed name",
      "percentage": 80,
      "reasoning": "Observed physical markers matching this breed (e.g., convex forehead, pendulous leaf ears, horn curvature)"
    },
    {
      "breed": "Secondary breed candidate",
      "percentage": 15,
      "reasoning": "Secondary resemblance traits (e.g., coat pattern or dewlap fold)"
    },
    {
      "breed": "Tertiary candidate",
      "percentage": 5,
      "reasoning": "Minor anatomical markers"
    }
  ],
  "geographic_distribution": "Primary states and key districts where this breed is found most densely in India",
  "history_and_origin": "Detailed historical background, origins, and heritage of the breed",
  "horn_traits": "Specific horn curvature, length, orientation, and shape",
  "coat_and_build": "Coat pigmentation, forehead shape, hump size, dewlap, and body stature",
  "purpose": "Dairy (Milch)" | "Draught (Cultivation)" | "Dual-Purpose",
  "average_daily_milk_litres": "e.g. 10 - 15 Litres/day (or Draught Support if ox)",
  "fat_percentage": "e.g. 4.5% - 5.0% (Cattle) or 7.0% - 8.5% (Buffalo)",
  "cultivation_utility": "Detailed description of whether and how the oxen/bulls are used for agricultural cultivation, ploughing, soil tilling, and heavy cart pulling",
  "rearing_and_care": "How this animal is reared, feeding habits, roughage intake, grazing vs stall feeding, and climate resilience",
  "description": "2-3 comprehensive sentences summarizing the animal's identity, distribution, and functional importance"
}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[img, prompt]
    )

    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    data = json.loads(text)

    # Normalize breed_resemblances so percentages strictly sum to 100%
    resemblances = data.get("breed_resemblances")
    if isinstance(resemblances, list) and len(resemblances) > 0:
        total_p = sum(float(r.get("percentage", 0)) for r in resemblances)
        if total_p > 0:
            for r in resemblances:
                r["percentage"] = round((float(r.get("percentage", 0)) / total_p) * 100)
            # Adjust rounding difference on the top breed so sum == 100
            diff = 100 - sum(r["percentage"] for r in resemblances)
            resemblances[0]["percentage"] += diff
    else:
        top_conf = round(float(data.get("confidence", 0.95)) * 100)
        data["breed_resemblances"] = [
            {
                "breed": data.get("breed", "Unknown Breed"),
                "percentage": top_conf,
                "reasoning": data.get("description", "Primary diagnostic features observed.")
            }
        ]
        if top_conf < 100:
            data["breed_resemblances"].append({
                "breed": "Other Indigenous/Crossbreed",
                "percentage": 100 - top_conf,
                "reasoning": "Unspecified crossbreed or regional phenotype variation."
            })

    return data


def search_breed_with_gemini(query: str):
    """
    Looks up any Indian cattle/buffalo breed using Gemini grounded intelligence.
    Also retrieves Wikipedia summary and authentic image if available.
    """
    client = get_gemini_client()
    if not client:
        raise ValueError("GEMINI_API_KEY is not configured.")

    prompt = f"""
You are an ICAR-NBAGR livestock taxonomy expert in India.
Provide a complete reference profile for the Indian livestock breed: "{query}".

Return ONLY a valid raw JSON object (no markdown ```json blocks) with this schema:
{{
  "id": "slug-name",
  "name": "Proper Breed Name",
  "icarCode": "INDIA_CATTLE_XXXX or INDIA_BUFFALO_XXXX",
  "species": "Cattle" | "Buffalo",
  "purpose": "Dairy (Milch)" | "Draught (Cultivation)" | "Dual-Purpose",
  "primaryStates": "Primary Indian states",
  "keyDistricts": "Major districts",
  "populationZone": "Agro-ecological habitat zone",
  "wikiTitle": "Exact Wikipedia article title (e.g. Gyr_cattle, Murrah_buffalo, Hallikar)",
  "history": "Historical development, origins, cultural heritage in Indian agriculture",
  "hornTraits": "Detailed horn shape, orientation, curvature",
  "coatAndBuild": "Coat color, forehead, dewlap, hump, body stature",
  "milkYield": "e.g. 10 - 15 Litres/day",
  "fatPercentage": "e.g. 4.5% - 5.0%",
  "cultivationPower": "Ploughing ability, draught stamina, soil suitability",
  "rearingTips": "Feeding, climate care, grazing vs stall fed"
}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[prompt]
    )

    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    data = json.loads(text)

    # Attempt to resolve authentic image from Wikipedia API
    wiki_title = data.get("wikiTitle") or data.get("name").replace(" ", "_")
    image_url = None

    import urllib.request
    try:
        api_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki_title}"
        req = urllib.request.Request(api_url, headers={"User-Agent": "PashuPehchaan/1.0 (contact: admin@pashu.in)"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            wdata = json.loads(resp.read().decode())
            image_url = wdata.get("thumbnail", {}).get("source") or wdata.get("originalimage", {}).get("source")
    except Exception as err:
        print(f"Wikipedia image lookup skipped for {wiki_title}: {err}")

    if not image_url:
        image_url = f"/breeds/{data.get('id', 'hallikar')}.jpg"

    data["referenceImageUrl"] = image_url
    return data
