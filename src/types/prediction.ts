export interface GeographicDistribution {
  primary_states: string;
  key_districts: string;
  population_zone: string;
  agro_climatic_habitat: string;
  concentration_summary: string;
}

export interface HistoryAndOrigin {
  origin_summary: string;
  historical_lineage: string;
  cultural_importance: string;
}

export interface BiologicalTraits {
  horn_morphology: string;
  coat_and_pigmentation: string;
  heat_tolerance: string;
  disease_resistance: string;
}

export interface DairyProfile {
  applicable: boolean;
  average_daily_yield: string;
  lactation_period_yield: string;
  fat_percentage: string;
  milk_quality: string;
  lactation_cycle: string;
}

export interface CultivationProfile {
  applicable: boolean;
  cultivation_suitability: string;
  soil_compatibility: string;
  carting_and_transport: string;
  field_work_endurance: string;
  cultivation_summary: string;
}

export interface RearingAndCare {
  grazing_management: string;
  feeding_requirements: string;
  housing_recommendations: string;
  veterinary_care: string;
}

export interface ConservationStatus {
  icar_registry_status: string;
  population_status: string;
  national_mission: string;
}

export interface NationalBreedProfile {
  profile_id: string;
  species: string;
  breed: string;
  gender_identified: string;
  icar_accession_code: string;
  evaluation_date: string;
  issuing_institute: string;
  geographic_distribution: GeographicDistribution;
  history_and_origin: HistoryAndOrigin;
  biological_traits: BiologicalTraits;
  dairy_profile: DairyProfile;
  cultivation_profile: CultivationProfile;
  rearing_and_care: RearingAndCare;
  conservation_status: ConservationStatus;
}

export interface BreedResemblance {
  breed: string;
  percentage: number;
  reasoning?: string;
}

export interface PredictionResult {
  animal_id: string;
  breed: string;
  species: string;
  animal_gender?: string;
  confidence: number;
  detection_confidence: number;
  breed_resemblances?: BreedResemblance[];
  region: string;
  description: string;
  horn_traits?: string;
  coat_and_build?: string;
  purpose?: string;
  average_daily_milk_litres?: string;
  fat_percentage?: string;
  cultivation_utility?: string;
  rearing_and_care?: string;
  media_type?: "image" | "video";
  date: string;
  engine?: string;
  national_breed_profile?: NationalBreedProfile;
  success?: boolean;
}

export type RecognitionStatus = "idle" | "selected" | "processing" | "success" | "error";

export interface HistoryRecord extends PredictionResult {
  id: string;
  timestamp: number;
  imageUrl?: string;
}
