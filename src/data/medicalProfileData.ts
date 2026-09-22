import { MedicalProfileData } from "../types";

export interface HighRiskConditionOption {
  id: string;
  name: string;
  category: "Obstetric" | "Endocrine" | "Hematology" | "Hypertension";
  severity: "high" | "moderate" | "attention";
  paramedicAlert?: string;
  description: string;
}

export const HIGH_RISK_CONDITIONS_CATALOG: HighRiskConditionOption[] = [
  {
    id: "rh_negative",
    name: "Rh-Negative Blood (Sensitization Risk)",
    category: "Hematology",
    severity: "high",
    paramedicAlert: "Anti-D (RhoGAM 300 mcg) required within 72h of abdominal trauma, crash, or bleeding.",
    description: "Mother has Rh-negative blood with potential Rh incompatibility if fetus is Rh-positive.",
  },
  {
    id: "placenta_previa",
    name: "Placenta Previa (Low Placentation)",
    category: "Obstetric",
    severity: "high",
    paramedicAlert: "⚠️ STRICTLY NO DIGITAL VAGINAL EXAM! Risk of fatal torrential hemorrhage.",
    description: "Placenta covers internal cervical os. Speculum and digital exams are contraindicated.",
  },
  {
    id: "preeclampsia",
    name: "Gestational Hypertension / Preeclampsia",
    category: "Hypertension",
    severity: "high",
    paramedicAlert: "Monitor BP, reflexes, and headache/visual aura. Eclampsia seizure protocol: IV Magnesium Sulfate.",
    description: "Elevated maternal blood pressure (>140/90) with proteinuria or end-organ involvement.",
  },
  {
    id: "gdm",
    name: "Gestational Diabetes Mellitus (GDM)",
    category: "Endocrine",
    severity: "moderate",
    paramedicAlert: "Check fingerstick glucose in altered sensorium or syncope (Target: 70-120 mg/dL).",
    description: "Carbohydrate intolerance diagnosed in 2nd/3rd trimester managed via diet or insulin.",
  },
  {
    id: "prior_c_section",
    name: "Previous Cesarean Section / Uterine Scar",
    category: "Obstetric",
    severity: "moderate",
    paramedicAlert: "Extreme caution with uterine stimulants/oxytocin. Assess for signs of uterine scar dehiscence.",
    description: "Prior hysterotomy scar with potential rupture risk during labor surges.",
  },
  {
    id: "thrombophilia_anticoagulation",
    name: "Active Anticoagulant Therapy (LMWH / Aspirin)",
    category: "Hematology",
    severity: "high",
    paramedicAlert: "Active bleeding precaution. Regional anesthesia (epidural/spinal) requires 12-24h heparin withholding.",
    description: "Mother is on therapeutic or prophylactic Heparin (Enoxaparin) or Aspirin.",
  },
  {
    id: "cervical_cerclage",
    name: "Cervical Cerclage (Stitch in situ)",
    category: "Obstetric",
    severity: "moderate",
    paramedicAlert: "If active labor contractions begin, cerclage stitch must be removed promptly by OB-GYN to prevent cervical tear.",
    description: "Surgical suture placed at internal os for cervical insufficiency.",
  },
  {
    id: "hypothyroidism",
    name: "Maternal Hypothyroidism",
    category: "Endocrine",
    severity: "attention",
    paramedicAlert: "Check L-Thyroxine daily compliance; essential for fetal neurological development.",
    description: "Elevated TSH managed with morning fasting Levothyroxine.",
  },
  {
    id: "multiple_gestation",
    name: "Multiple Gestation (Twins / Multiples)",
    category: "Obstetric",
    severity: "moderate",
    paramedicAlert: "High risk of preterm labor and uterine overdistension post-delivery hemorrhage.",
    description: "Carrying twins or higher-order multiples with enhanced surveillance requirements.",
  },
  {
    id: "iugr_oligohydramnios",
    name: "Fetal Growth Restriction (FGR / Oligohydramnios)",
    category: "Obstetric",
    severity: "moderate",
    paramedicAlert: "Reduced fetal reserve during uterine contractions; continuous CTG/FHR monitoring required.",
    description: "Estimated fetal weight < 10th percentile or reduced amniotic fluid volume.",
  },
];

export const COMMON_DRUG_ALLERGIES = [
  "Penicillin",
  "Amoxicillin",
  "Cephalosporins",
  "Sulfa Drugs / Trimethoprim",
  "Aspirin / NSAIDs (Ibuprofen)",
  "Latex",
  "Iodine Contrast Dye",
  "Codeine / Opioids",
  "Ciprofloxacin / Quinolones",
  "Erythromycin / Macrolides",
];

export const INITIAL_DEFAULT_MEDICAL_PROFILE: MedicalProfileData = {
  bloodGroup: "O+",
  rhFactor: "Negative",
  rhOGAMNeeded: true,
  bloodSubtype: "O- (Rh-Negative)",
  allergies: ["Penicillin", "Latex"],
  gravidaCount: 2,
  paraCount: 1,
  gpal: {
    gravida: 2,
    para: 1,
    abortions: 0,
    living: 1,
  },
  conceptionType: "Spontaneous",
  pregnancyType: "Singleton",
  placentaLocation: "Normal (Anterior/Posterior)",
  previousCSection: false,
  previousCSectionNotes: "None (Prior full-term unassisted vaginal delivery at 39 weeks)",
  priorCesareanDetails: {
    hasPrior: false,
    count: 0,
    scarType: "Low Transverse",
    vbacCandidate: true,
    notes: "Prior full-term spontaneous vaginal delivery without complications.",
  },
  highRiskNotes: [
    "Mild Rh-Sensitization Protocol (Scheduled Anti-D at Wk 28)",
    "Gestational Fasting Glucose Monitoring (Diet Controlled)",
  ],
  highRiskConditions: ["rh_negative", "gdm"],
  criticalDailyMedications: [
    {
      id: "med-1",
      name: "L-Thyroxine (Thyronorm)",
      dose: "50 mcg",
      frequency: "Once daily (Morning Fasting)",
      category: "thyroid",
      prescribedFor: "Subclinical Hypothyroidism",
    },
    {
      id: "med-2",
      name: "Low-Dose Aspirin (Ecosprin)",
      dose: "150 mg",
      frequency: "Once daily (Bedtime)",
      isAnticoagulant: true,
      category: "anticoagulant",
      prescribedFor: "Preeclampsia & Uteroplacental Prophylaxis",
    },
    {
      id: "med-3",
      name: "Ferrous Ascorbate + Folic Acid (Orofer-XT)",
      dose: "100 mg",
      frequency: "Once daily (After Lunch)",
      category: "supplement",
      prescribedFor: "Iron Deficiency Prophylaxis",
    },
  ],
  officialIds: {
    abhaNumber: "91-4562-7891-3402",
    hospitalMrn: "UHID-CN-2026-8849",
    insuranceProvider: "Star Health & Allied Insurance",
    policyNumber: "POL-MAT-9942188",
    tpaDeskPhone: "+91 80 4455 6677",
  },
  emergencyContactName: "David Jenkins (Husband)",
  emergencyContactPhone: "+91 98765 43210",
  obgynName: "Dr. Ananya Sharma, MD (OB-GYN)",
  obgynPhone: "+91 98111 22334",
  hospitalName: "Cloudnine Maternal Super-Specialty Hospital",
  hospitalAddress: "42 Healthcare Boulevard, Indiranagar, Bengaluru",
  lastUpdated: new Date().toISOString(),
};

export const LOCAL_STORAGE_KEY_MEDICAL_PROFILE = "bloomnest_medical_profile_data_v2";
