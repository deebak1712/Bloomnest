export interface DoctorQuestionItem {
  id: string;
  trimester: 1 | 2 | 3;
  category: "fetal_development" | "medication_nutrition" | "symptoms_safety" | "labor_delivery";
  question: string;
  tamilQuestion?: string;
  clinicalContext: string;
}

export interface ObstetricTriageStatus {
  bpLevel: "NORMAL" | "ELEVATED" | "STAGE_1_HTN" | "SEVERE_HTN";
  bpLabel: string;
  mapValue: number; // Mean Arterial Pressure
  gdmRisk: "NORMAL" | "ELEVATED_FASTING" | "ELEVATED_PP" | "PENDING_SCREENING";
  gdmLabel: string;
  rhStatus: "COMPATIBLE" | "RH_NEGATIVE_ACTION_NEEDED";
  rhLabel: string;
  dfmcStatus: "REASSURING" | "SUBOPTIMAL" | "NOT_APPLICABLE";
  dfmcLabel: string;
}

export const DOCTOR_QUESTIONS_CATALOG: DoctorQuestionItem[] = [
  // Trimester 1
  {
    id: "q_t1_meds",
    trimester: 1,
    category: "medication_nutrition",
    question: "Are all my current medications and supplements safe for my baby's organ formation?",
    tamilQuestion: "நான் எடுக்கும் மாத்திரைகள் குழந்தையின் உறுப்பு வளர்ச்சிக்கு பாதுகாப்பானதா?",
    clinicalContext: "Crucial during organogenesis (Weeks 3–10). Verifies Folic Acid (500mcg) and eliminates any Category D/X drugs.",
  },
  {
    id: "q_t1_cramping",
    trimester: 1,
    category: "symptoms_safety",
    question: "How do I distinguish normal uterine stretching cramps from miscarriage or ectopic warning signs?",
    tamilQuestion: "சாதாரண கருப்பை விரிவு வலிக்கும், ஆபத்து வலிக்கும் என்ன வித்தியாசம்?",
    clinicalContext: "Teaches maternal awareness regarding unilateral sharp pelvic pain, spotting, and shoulder tip pain.",
  },
  {
    id: "q_t1_genetic",
    trimester: 1,
    category: "fetal_development",
    question: "Which first-trimester genetic screening (NT Scan + Double Marker vs. NIPT) is recommended for my age?",
    tamilQuestion: "முதல் மும்மாத மரபணு ஸ்கிரீனிங்கில் எனக்கு எது சிறந்தது?",
    clinicalContext: "Evaluates aneuploidy risk (Trisomy 21/18/13) typically scheduled between Weeks 11 and 13+6.",
  },
  {
    id: "q_t1_nausea",
    trimester: 1,
    category: "symptoms_safety",
    question: "At what point does severe morning sickness require medical intervention for dehydration?",
    tamilQuestion: "கடுமையான வாந்தி ஏற்படும் போது எப்போது மருத்துவமனைக்கு வர வேண்டும்?",
    clinicalContext: "Hyperemesis Gravidarum check for urine ketones, weight loss >5%, and electrolyte imbalances.",
  },

  // Trimester 2
  {
    id: "q_t2_placenta",
    trimester: 2,
    category: "fetal_development",
    question: "Is my placenta positioned safely away from the internal cervical os (no placenta previa)?",
    tamilQuestion: "நச்சுக்கொடி கருப்பை வாயில் இருந்து பாதுகாப்பான தூரத்தில் உள்ளதா?",
    clinicalContext: "Evaluated during Level-2 Anomaly Scan (Week 18–22). Identifies low-lying placenta early.",
  },
  {
    id: "q_t2_gdm",
    trimester: 2,
    category: "medication_nutrition",
    question: "When should I complete my 75g Oral Glucose Tolerance Test (OGTT), and what are my target values?",
    tamilQuestion: "75g சர்க்கரை பரிசோதனை எப்போது செய்ய வேண்டும், அளவு என்ன?",
    clinicalContext: "Standard screening at Weeks 24–28. Normal thresholds: Fasting <92 mg/dL, 1h <180, 2h <153 mg/dL (DIPSI/IADPSG).",
  },
  {
    id: "q_t2_travel",
    trimester: 2,
    category: "symptoms_safety",
    question: "Do you clear me for domestic travel or flying, and do I need a Fit-to-Fly certificate?",
    tamilQuestion: "நான் விமானம் அல்லது கார் பயணம் செய்யலாமா, சான்றிதழ் தேவையா?",
    clinicalContext: "Trimester 2 (Weeks 14–27) is the safest travel window before airline third-trimester restrictions apply.",
  },
  {
    id: "q_t2_kicks",
    trimester: 2,
    category: "fetal_development",
    question: "When should I expect regular daily kick patterns, and how should I track them?",
    tamilQuestion: "தினசரி குழந்தை அசைவுகள் எப்போது சீராகும், அதை எப்படி கணக்கிடுவது?",
    clinicalContext: "Quickening starts Weeks 18–22. Cardiff count (>10 movements in 2 hours) becomes reliable from Week 28.",
  },

  // Trimester 3
  {
    id: "q_t3_tdap",
    trimester: 3,
    category: "medication_nutrition",
    question: "Have I received my Tdap vaccine (Weeks 27–36) to pass maternal pertussis antibodies to baby?",
    tamilQuestion: "குழந்தைக்கு கக்குவான் இருமல் பாதுகாப்பு கிடைக்க Tdap தடுப்பூசி போட்டாச்சா?",
    clinicalContext: "ACOG recommends Tdap during every pregnancy between Weeks 27 and 36 for neonatal pertussis immunity.",
  },
  {
    id: "q_t3_labor_signs",
    trimester: 3,
    category: "labor_delivery",
    question: "What exact contraction frequency (e.g. 5-1-1 rule) means I should leave immediately for the hospital?",
    tamilQuestion: "எந்த வலி அல்லது அறிகுறி இருந்தால் உடனே மருத்துவமனைக்கு கிளம்ப வேண்டும்?",
    clinicalContext: "Active labor guidelines: Contractions 5 mins apart, 60 seconds duration, for 1 hour; or membrane rupture (water breaking).",
  },
  {
    id: "q_t3_birth_plan",
    trimester: 3,
    category: "labor_delivery",
    question: "Can we review my Birth Plan regarding upright pushing positions, delayed cord clamping, and skin-to-skin?",
    tamilQuestion: "எனது பிரசவ விருப்பங்கள் (தொப்புள்கொடி தாமத வெட்டு, முதல் தொடுதல்) பற்றி பேசலாமா?",
    clinicalContext: "Aligns patient preferences with hospital labor ward protocols, episiotomy policy, and pediatric Golden Hour.",
  },
  {
    id: "q_t3_gbs",
    trimester: 3,
    category: "symptoms_safety",
    question: "Do I need a Group B Streptococcus (GBS) vaginal-rectal screening swab at Weeks 36–37?",
    tamilQuestion: "36-வது வாரத்தில் GBS பாக்டீரியா பரிசோதனை தேவையா?",
    clinicalContext: "Identifies maternal GBS colonization requiring IV antibiotic prophylaxis during labor to protect newborn.",
  },
  {
    id: "q_t3_bpp_doppler",
    trimester: 3,
    category: "fetal_development",
    question: "How are my baby's estimated fetal weight (EFW), amniotic fluid index (AFI), and umbilical Doppler flow?",
    tamilQuestion: "குழந்தையின் எடை, பனிக்குட நீர் அளவு மற்றும் ரத்த ஓட்டம் எவ்வாறு உள்ளது?",
    clinicalContext: "Evaluates placental sufficiency and monitors for fetal growth restriction (IUGR) or oligohydramnios (AFI < 5cm).",
  },
];

export const evaluateObstetricTriage = (
  systolic: number,
  diastolic: number,
  glucoseFasting?: number,
  glucosePP?: number,
  bloodGroup?: string,
  currentWeek?: number,
  recentKicksCount?: number
): ObstetricTriageStatus => {
  // 1. Mean Arterial Pressure (MAP) = (Systolic + 2*Diastolic) / 3
  const mapValue = Math.round((systolic + 2 * diastolic) / 3);

  let bpLevel: ObstetricTriageStatus["bpLevel"] = "NORMAL";
  let bpLabel = "Normotensive (<120/80 mmHg)";

  if (systolic >= 160 || diastolic >= 110) {
    bpLevel = "SEVERE_HTN";
    bpLabel = "Severe Gestational Hypertension (≥160/110) — Urgent Triage";
  } else if (systolic >= 140 || diastolic >= 90) {
    bpLevel = "STAGE_1_HTN";
    bpLabel = "Hypertension (≥140/90) — Preeclampsia Screening Required";
  } else if (systolic >= 120 || diastolic >= 80) {
    bpLevel = "ELEVATED";
    bpLabel = "Pre-hypertensive / Elevated (MAP: " + mapValue + " mmHg)";
  }

  // 2. Glucose Status
  let gdmRisk: ObstetricTriageStatus["gdmRisk"] = "NORMAL";
  let gdmLabel = "Euglycemic / Normal Glycemic Control";

  if (glucoseFasting && glucoseFasting >= 95) {
    gdmRisk = "ELEVATED_FASTING";
    gdmLabel = `Elevated Fasting (${glucoseFasting} mg/dL ≥ 95 threshold)`;
  } else if (glucosePP && glucosePP >= 140) {
    gdmRisk = "ELEVATED_PP";
    gdmLabel = `Elevated Post-Prandial (${glucosePP} mg/dL ≥ 140 threshold)`;
  } else if ((currentWeek || 20) >= 24 && !glucoseFasting && !glucosePP) {
    gdmRisk = "PENDING_SCREENING";
    gdmLabel = "OGTT 75g Screening Due (Weeks 24–28)";
  }

  // 3. Rh Incompatibility
  let rhStatus: ObstetricTriageStatus["rhStatus"] = "COMPATIBLE";
  let rhLabel = "Rh Positive (Compatible)";
  if (bloodGroup && bloodGroup.includes("-")) {
    rhStatus = "RH_NEGATIVE_ACTION_NEEDED";
    rhLabel = "Rh Negative: Anti-D Immunoglobulin Protocol at 28 Weeks & Postpartum";
  }

  // 4. DFMC Fetal Movement
  let dfmcStatus: ObstetricTriageStatus["dfmcStatus"] = "NOT_APPLICABLE";
  let dfmcLabel = "Fetal Movement Tracking Active from Wk 28";
  if ((currentWeek || 20) >= 28) {
    if (recentKicksCount !== undefined && recentKicksCount < 10) {
      dfmcStatus = "SUBOPTIMAL";
      dfmcLabel = "Decreased Fetal Movement (<10 movements / 2 hrs) — Triage Alert";
    } else {
      dfmcStatus = "REASSURING";
      dfmcLabel = "Cardiff Protocol Compliant (≥10 kicks / 2 hrs Reassuring)";
    }
  }

  return {
    bpLevel,
    bpLabel,
    mapValue,
    gdmRisk,
    gdmLabel,
    rhStatus,
    rhLabel,
    dfmcStatus,
    dfmcLabel,
  };
};
