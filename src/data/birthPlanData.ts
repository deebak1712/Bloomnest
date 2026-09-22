import { BirthPlanPreference, BirthPlanArchetype } from "../types";

export interface ArchetypeDefinition {
  id: BirthPlanArchetype;
  name: string;
  badge: string;
  shortDesc: string;
  iconType: "leaf" | "sparkles" | "shield" | "lotus";
  colorClass: string;
  borderClass: string;
  preset: Partial<BirthPlanPreference>;
}

export const BIRTH_PLAN_ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: "natural",
    name: "Natural & Physiological Birth",
    badge: "Low Intervention",
    shortDesc: "Freedom of movement, hydrotherapy, upright spontaneous pushing, and minimal routine medical interventions.",
    iconType: "leaf",
    colorClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    borderClass: "border-emerald-300 dark:border-emerald-800",
    preset: {
      deliveryType: "vaginal",
      painManagement: ["breathing", "hydrotherapy", "massage", "tens"],
      skinToSkin: "immediate",
      cordClamping: "delayed-1-3-mins",
      laborEnvironment: {
        lighting: "dim",
        music: "ambient",
        mobility: "free_movement",
        clothing: "own_clothes",
      },
      laborInterventions: {
        episiotomyPreference: "avoid_unless_emergency",
        amniotomyPreference: "spontaneous_only",
        fetalMonitoring: "intermittent_doppler",
        pushingPositions: ["squatting", "all_fours", "side_lying"],
      },
      cSectionContingency: {
        partnerInOT: true,
        loweredDrape: true,
        immediateSkinToSkin: true,
        musicInOT: true,
        clearExplanationOfSteps: true,
      },
      feedingPreference: "exclusive_breastfeeding",
      placentaPreference: "hospital_disposal",
      cordBloodBanking: false,
      newbornProcedures: {
        vitaminK: "shot",
        eyeOintment: true,
        hepBVac: true,
        delayedBathing: true,
        breastfeedingSupport: true,
      },
      specialNotes: "Prefer unmedicated physiological birth. Please protect quiet atmosphere in labor suite.",
    },
  },
  {
    id: "hospital_comfort",
    name: "Supported Hospital Comfort",
    badge: "Epidural Friendly",
    shortDesc: "Structured obstetric care with early access to epidural analgesia, continuous telemetry monitoring, and clinical guidance.",
    iconType: "sparkles",
    colorClass: "bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-200",
    borderClass: "border-purple-300 dark:border-purple-800",
    preset: {
      deliveryType: "vaginal",
      painManagement: ["epidural", "gas-air", "breathing"],
      skinToSkin: "immediate",
      cordClamping: "delayed-1-3-mins",
      laborEnvironment: {
        lighting: "standard",
        music: "playlist",
        mobility: "bed_with_monitoring",
        clothing: "hospital_gown",
      },
      laborInterventions: {
        episiotomyPreference: "perineal_massage_first",
        amniotomyPreference: "discuss_first",
        fetalMonitoring: "continuous_wireless",
        pushingPositions: ["semi_sitting", "side_lying"],
      },
      cSectionContingency: {
        partnerInOT: true,
        loweredDrape: false,
        immediateSkinToSkin: true,
        musicInOT: false,
        clearExplanationOfSteps: true,
      },
      feedingPreference: "exclusive_breastfeeding",
      placentaPreference: "hospital_disposal",
      cordBloodBanking: false,
      newbornProcedures: {
        vitaminK: "shot",
        eyeOintment: true,
        hepBVac: true,
        delayedBathing: true,
        breastfeedingSupport: true,
      },
      specialNotes: "Proactive pain relief requested. Please notify anesthesia team early for epidural consult.",
    },
  },
  {
    id: "hypnobirthing",
    name: "Hypnobirthing & Somatic Calm",
    badge: "Mindful Birth",
    shortDesc: "Sanctuary labor environment with deep relaxation mantras, partner counterpressure, breathing surges, and undisturbed bonding.",
    iconType: "lotus",
    colorClass: "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200",
    borderClass: "border-teal-300 dark:border-teal-800",
    preset: {
      deliveryType: "vaginal",
      painManagement: ["breathing", "massage", "hydrotherapy"],
      skinToSkin: "immediate",
      cordClamping: "delayed-1-3-mins",
      laborEnvironment: {
        lighting: "dark",
        music: "mantras",
        mobility: "free_movement",
        clothing: "own_clothes",
      },
      laborInterventions: {
        episiotomyPreference: "avoid_unless_emergency",
        amniotomyPreference: "spontaneous_only",
        fetalMonitoring: "intermittent_doppler",
        pushingPositions: ["all_fours", "squatting", "side_lying"],
      },
      cSectionContingency: {
        partnerInOT: true,
        loweredDrape: true,
        immediateSkinToSkin: true,
        musicInOT: true,
        clearExplanationOfSteps: true,
      },
      feedingPreference: "exclusive_breastfeeding",
      placentaPreference: "hospital_disposal",
      cordBloodBanking: false,
      newbornProcedures: {
        vitaminK: "shot",
        eyeOintment: true,
        hepBVac: true,
        delayedBathing: true,
        breastfeedingSupport: true,
      },
      specialNotes: "Please refer to contractions as 'surges'. Partner will speak on mother's behalf during deep focus.",
    },
  },
  {
    id: "gentle_c_section",
    name: "Gentle / Family-Centered C-Section",
    badge: "Surgical Bonding",
    shortDesc: "Surgical delivery with partner in the OT, lowered sterile drape to witness birth, immediate skin-to-skin, and soothing audio.",
    iconType: "shield",
    colorClass: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
    borderClass: "border-rose-300 dark:border-rose-800",
    preset: {
      deliveryType: "planned-c-section",
      painManagement: ["epidural"],
      skinToSkin: "immediate",
      cordClamping: "delayed-1-3-mins",
      laborEnvironment: {
        lighting: "dim",
        music: "playlist",
        mobility: "bed_with_monitoring",
        clothing: "hospital_gown",
      },
      laborInterventions: {
        episiotomyPreference: "avoid_unless_emergency",
        amniotomyPreference: "physician_discretion",
        fetalMonitoring: "continuous_wired",
        pushingPositions: [],
      },
      cSectionContingency: {
        partnerInOT: true,
        loweredDrape: true,
        immediateSkinToSkin: true,
        musicInOT: true,
        clearExplanationOfSteps: true,
      },
      feedingPreference: "exclusive_breastfeeding",
      placentaPreference: "hospital_disposal",
      cordBloodBanking: true,
      newbornProcedures: {
        vitaminK: "shot",
        eyeOintment: true,
        hepBVac: true,
        delayedBathing: true,
        breastfeedingSupport: true,
      },
      specialNotes: "Planned gentle cesarean. Lower drape upon delivery so mother can witness baby's first breath.",
    },
  },
];

export const INITIAL_DEFAULT_BIRTH_PLAN: BirthPlanPreference = {
  templateArchetype: "hospital_comfort",
  deliveryType: "vaginal",
  painManagement: ["epidural", "breathing", "hydrotherapy"],
  birthPartnerName: "David Jenkins",
  birthPartnerRole: "Primary Birth Companion & Partner",
  skinToSkin: "immediate",
  cordClamping: "delayed-1-3-mins",
  laborEnvironment: {
    lighting: "dim",
    music: "playlist",
    mobility: "free_movement",
    clothing: "own_clothes",
  },
  laborInterventions: {
    episiotomyPreference: "avoid_unless_emergency",
    amniotomyPreference: "discuss_first",
    fetalMonitoring: "continuous_wireless",
    pushingPositions: ["squatting", "side_lying", "semi_sitting"],
  },
  cSectionContingency: {
    partnerInOT: true,
    loweredDrape: true,
    immediateSkinToSkin: true,
    musicInOT: true,
    clearExplanationOfSteps: true,
  },
  feedingPreference: "exclusive_breastfeeding",
  placentaPreference: "hospital_disposal",
  cordBloodBanking: false,
  newbornProcedures: {
    vitaminK: "shot",
    eyeOintment: true,
    hepBVac: true,
    delayedBathing: true,
    breastfeedingSupport: true,
  },
  specialNotes: "Dim lighting in labor room requested. Partner to cut the umbilical cord after delayed clamping.",
  lastUpdated: new Date().toISOString(),
};

export const LOCAL_STORAGE_KEY_BIRTH_PLAN = "bloomnest_birth_plan_preferences_v2";
