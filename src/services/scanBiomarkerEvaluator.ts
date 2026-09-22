/**
 * Deterministic Clinical Reference Range Engine for Ultrasound & Lab Biomarkers
 * Matching pattern from healthVitalsService.ts (Plain if/else logic, ACOG / WHO / FOGSI guidelines)
 */

export interface BiomarkerEvaluation {
  parameter: string;
  category: "ultrasound" | "lab";
  label: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: "NORMAL" | "ATTENTION" | "HIGH" | "SEVERE";
  badgeVariant: "emerald" | "amber" | "rose";
  statusText: string;
  clinicalAction: string;
  isAbnormal: boolean;
}

export function evaluateFetalHeartRate(bpm: number): BiomarkerEvaluation {
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal baseline fetal heart rate (110–160 bpm)";
  let clinicalAction = "Optimal fetal cardiac rhythm";
  let isAbnormal = false;

  if (bpm < 100) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Fetal Bradycardia (${bpm} bpm < 100 bpm)`;
    clinicalAction = "Prompt clinical evaluation with your obstetrician recommended.";
    isAbnormal = true;
  } else if (bpm < 110) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Mild low heart rate (${bpm} bpm)`;
    clinicalAction = "Mention to your OB-GYN for repeat auscultation.";
    isAbnormal = true;
  } else if (bpm > 180) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Marked Fetal Tachycardia (${bpm} bpm > 180 bpm)`;
    clinicalAction = "Immediate clinical assessment advised to rule out maternal fever or distress.";
    isAbnormal = true;
  } else if (bpm > 160) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Mild fetal tachycardia (${bpm} bpm)`;
    clinicalAction = "May reflect transient fetal movement or maternal hydration. Discuss with doctor.";
    isAbnormal = true;
  }

  return {
    parameter: "fhr",
    category: "ultrasound",
    label: "Fetal Heart Rate (FHR)",
    value: bpm,
    unit: "bpm",
    referenceRange: "110 – 160 bpm",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluateAmnioticFluid(afiCm: number): BiomarkerEvaluation {
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal amniotic fluid pool (8.0–18.0 cm)";
  let clinicalAction = "Healthy protective fluid volume for fetal development.";
  let isAbnormal = false;

  if (afiCm < 5.0) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Severe Oligohydramnios (${afiCm} cm < 5.0 cm)`;
    clinicalAction = "Consult your obstetrician promptly today for biophysical profile & hydration check.";
    isAbnormal = true;
  } else if (afiCm < 8.0) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Borderline Low Amniotic Fluid (${afiCm} cm)`;
    clinicalAction = "Ensure generous maternal hydration (3–3.5 L/day) and schedule routine follow-up scan.";
    isAbnormal = true;
  } else if (afiCm > 24.0) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Polyhydramnios (${afiCm} cm > 24.0 cm)`;
    clinicalAction = "Consult doctor for glucose screening (OGTT) and targeted structural follow-up.";
    isAbnormal = true;
  } else if (afiCm > 18.0) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Borderline High Fluid Volume (${afiCm} cm)`;
    clinicalAction = "Monitor maternal glucose and review ultrasound findings with your doctor.";
    isAbnormal = true;
  }

  return {
    parameter: "afi",
    category: "ultrasound",
    label: "Amniotic Fluid Index (AFI)",
    value: afiCm,
    unit: "cm",
    referenceRange: "8.0 – 18.0 cm",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluatePlacentaPosition(positionStr: string): BiomarkerEvaluation {
  const lower = (positionStr || "").toLowerCase();
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal physiological upper uterine segment implantation.";
  let clinicalAction = "No special restrictions required.";
  let isAbnormal = false;

  if (lower.includes("previa") || lower.includes("low-lying") || lower.includes("marginal")) {
    status = "HIGH";
    badgeVariant = "rose";
    statusText = "Low-Lying / Placenta Previa noted.";
    clinicalAction = "Consult your doctor for delivery mode planning. Avoid heavy lifting and report any spotting immediately.";
    isAbnormal = true;
  } else if (lower.includes("fundal") || lower.includes("anterior") || lower.includes("posterior")) {
    status = "NORMAL";
    badgeVariant = "emerald";
    statusText = `${positionStr} · Normal anatomical implantation clear of cervix.`;
    clinicalAction = "Normal positioning.";
    isAbnormal = false;
  }

  return {
    parameter: "placenta",
    category: "ultrasound",
    label: "Placenta Position",
    value: positionStr,
    unit: "",
    referenceRange: "Clear of internal cervical os",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluateHemoglobin(hb: number): BiomarkerEvaluation {
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Healthy pregnancy hemoglobin (≥ 11.0 g/dL)";
  let clinicalAction = "Optimal oxygen-carrying capacity for mother and baby.";
  let isAbnormal = false;

  if (hb < 7.0) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Severe Gestational Anemia (${hb} g/dL < 7.0 g/dL)`;
    clinicalAction = "Immediate clinical consultation required for intravenous iron or transfusion review.";
    isAbnormal = true;
  } else if (hb < 10.0) {
    status = "HIGH";
    badgeVariant = "rose";
    statusText = `Moderate Anemia (${hb} g/dL)`;
    clinicalAction = "Consult doctor for therapeutic iron dosage adjustment and dietary enrichment.";
    isAbnormal = true;
  } else if (hb < 11.0) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Mild Gestational Anemia (${hb} g/dL)`;
    clinicalAction = "Continue daily prenatal iron supplement with Vitamin C; separate 2 hours from calcium.";
    isAbnormal = true;
  } else if (hb > 15.0) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Elevated Hemoglobin (${hb} g/dL > 15.0 g/dL)`;
    clinicalAction = "Check maternal hydration levels with your doctor.";
    isAbnormal = true;
  }

  return {
    parameter: "hemoglobin",
    category: "lab",
    label: "Hemoglobin",
    value: hb,
    unit: "g/dL",
    referenceRange: "11.0 – 14.0 g/dL",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluateGlucose(val: number, context: "fasting" | "post_meal" | "random" = "fasting"): BiomarkerEvaluation {
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal pregnancy glycemic target";
  let clinicalAction = "Optimal glucose control.";
  let isAbnormal = false;
  let refRange = context === "fasting" ? "< 95 mg/dL" : "< 140 mg/dL";

  if (context === "fasting") {
    if (val < 65) {
      status = "SEVERE";
      badgeVariant = "rose";
      statusText = `Maternal Hypoglycemia (${val} mg/dL < 65 mg/dL)`;
      clinicalAction = "Consume a fast-acting snack (fruit/milk) and notify your doctor.";
      isAbnormal = true;
    } else if (val > 125) {
      status = "HIGH";
      badgeVariant = "rose";
      statusText = `High Fasting Blood Sugar (${val} mg/dL > 125 mg/dL)`;
      clinicalAction = "Consult your OB-GYN for gestational diabetes mellitus (GDM) evaluation.";
      isAbnormal = true;
    } else if (val >= 95) {
      status = "ATTENTION";
      badgeVariant = "amber";
      statusText = `Elevated Fasting Glucose (${val} mg/dL ≥ 95 mg/dL)`;
      clinicalAction = "Review complex carbohydrate intake and discuss with your physician.";
      isAbnormal = true;
    }
  } else {
    // Post meal (1h/2h)
    if (val > 140) {
      status = "HIGH";
      badgeVariant = "rose";
      statusText = `Elevated Post-Meal Glucose (${val} mg/dL > 140 mg/dL)`;
      clinicalAction = "Consult your healthcare provider for postprandial glycemic management.";
      isAbnormal = true;
    } else if (val > 120) {
      status = "ATTENTION";
      badgeVariant = "amber";
      statusText = `Borderline Postprandial Glucose (${val} mg/dL)`;
      clinicalAction = "Incorporate gentle post-meal walks and review fiber intake.";
      isAbnormal = true;
    }
  }

  return {
    parameter: "glucose",
    category: "lab",
    label: `Blood Glucose (${context})`,
    value: val,
    unit: "mg/dL",
    referenceRange: refRange,
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluateTsh(tshVal: number): BiomarkerEvaluation {
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal pregnancy thyroid function (0.1–2.5 uIU/mL)";
  let clinicalAction = "Thyroid levels optimal for fetal brain & neural development.";
  let isAbnormal = false;

  if (tshVal < 0.1) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Suppressed TSH (${tshVal} uIU/mL < 0.1)`;
    clinicalAction = "Review with endocrinologist or OB-GYN.";
    isAbnormal = true;
  } else if (tshVal > 4.0) {
    status = "HIGH";
    badgeVariant = "rose";
    statusText = `Elevated TSH (${tshVal} uIU/mL > 4.0)`;
    clinicalAction = "Consult doctor promptly. Levothyroxine dose adjustment is standard in pregnancy.";
    isAbnormal = true;
  } else if (tshVal > 2.5) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Mildly elevated TSH (${tshVal} uIU/mL > 2.5)`;
    clinicalAction = "Discuss with doctor to verify trimester-specific thyroid reference goals.";
    isAbnormal = true;
  }

  return {
    parameter: "tsh",
    category: "lab",
    label: "Thyroid Stimulating Hormone (TSH)",
    value: tshVal,
    unit: "uIU/mL",
    referenceRange: "0.1 – 2.5 uIU/mL",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

export function evaluateUrineProtein(proteinVal: string): BiomarkerEvaluation {
  const clean = (proteinVal || "").trim().toLowerCase();
  let status: BiomarkerEvaluation["status"] = "NORMAL";
  let badgeVariant: BiomarkerEvaluation["badgeVariant"] = "emerald";
  let statusText = "Normal urine protein (Nil / Negative / Trace)";
  let clinicalAction = "No significant proteinuria detected.";
  let isAbnormal = false;

  if (clean.includes("3+") || clean.includes("4+")) {
    status = "SEVERE";
    badgeVariant = "rose";
    statusText = `Significant Proteinuria (${proteinVal})`;
    clinicalAction = "Urgent clinical check required. Check blood pressure immediately to rule out preeclampsia.";
    isAbnormal = true;
  } else if (clean.includes("2+")) {
    status = "HIGH";
    badgeVariant = "rose";
    statusText = `Moderate Proteinuria (${proteinVal})`;
    clinicalAction = "Consult doctor today. Check for headache, swelling, or vision changes.";
    isAbnormal = true;
  } else if (clean.includes("1+")) {
    status = "ATTENTION";
    badgeVariant = "amber";
    statusText = `Mild Proteinuria (${proteinVal})`;
    clinicalAction = "Check resting blood pressure and repeat test as advised by your doctor.";
    isAbnormal = true;
  }

  return {
    parameter: "urine_protein",
    category: "lab",
    label: "Urine Protein",
    value: proteinVal,
    unit: "",
    referenceRange: "Nil / Trace",
    status,
    badgeVariant,
    statusText,
    clinicalAction,
    isAbnormal,
  };
}

/**
 * Master evaluation helper for any extracted scan report data
 */
export function evaluateAllExtractedBiomarkers(data: any): BiomarkerEvaluation[] {
  const evaluations: BiomarkerEvaluation[] = [];

  if (data?.ultrasoundBiometrics) {
    const ub = data.ultrasoundBiometrics;
    if (ub.fhr?.value) {
      evaluations.push(evaluateFetalHeartRate(Number(ub.fhr.value)));
    }
    if (ub.afi?.value) {
      evaluations.push(evaluateAmnioticFluid(Number(ub.afi.value)));
    }
    if (ub.placentaPosition) {
      evaluations.push(evaluatePlacentaPosition(String(ub.placentaPosition)));
    }
    if (ub.bpd?.value) {
      evaluations.push({
        parameter: "bpd",
        category: "ultrasound",
        label: "Biparietal Diameter (BPD)",
        value: Number(ub.bpd.value),
        unit: "mm",
        referenceRange: "Expected for GA",
        status: "NORMAL",
        badgeVariant: "emerald",
        statusText: `${ub.bpd.value} mm · Fetal head diameter measurement`,
        clinicalAction: "Appropriate for gestational age",
        isAbnormal: false,
      });
    }
    if (ub.fl?.value) {
      evaluations.push({
        parameter: "fl",
        category: "ultrasound",
        label: "Femur Length (FL)",
        value: Number(ub.fl.value),
        unit: "mm",
        referenceRange: "Expected for GA",
        status: "NORMAL",
        badgeVariant: "emerald",
        statusText: `${ub.fl.value} mm · Fetal thigh bone length measurement`,
        clinicalAction: "Appropriate for gestational age",
        isAbnormal: false,
      });
    }
    if (ub.ac?.value) {
      evaluations.push({
        parameter: "ac",
        category: "ultrasound",
        label: "Abdominal Circumference (AC)",
        value: Number(ub.ac.value),
        unit: "mm",
        referenceRange: "Expected for GA",
        status: "NORMAL",
        badgeVariant: "emerald",
        statusText: `${ub.ac.value} mm · Fetal abdominal circumference`,
        clinicalAction: "Appropriate for gestational age",
        isAbnormal: false,
      });
    }
    if (ub.hc?.value) {
      evaluations.push({
        parameter: "hc",
        category: "ultrasound",
        label: "Head Circumference (HC)",
        value: Number(ub.hc.value),
        unit: "mm",
        referenceRange: "Expected for GA",
        status: "NORMAL",
        badgeVariant: "emerald",
        statusText: `${ub.hc.value} mm · Head circumference measurement`,
        clinicalAction: "Appropriate for gestational age",
        isAbnormal: false,
      });
    }
    if (ub.efw?.value) {
      evaluations.push({
        parameter: "efw",
        category: "ultrasound",
        label: "Estimated Fetal Weight (EFW)",
        value: Number(ub.efw.value),
        unit: "grams",
        referenceRange: "Normal percentile curve",
        status: "NORMAL",
        badgeVariant: "emerald",
        statusText: `${ub.efw.value} g · Estimated fetal weight`,
        clinicalAction: "Healthy intrauterine growth",
        isAbnormal: false,
      });
    }
  }

  if (data?.labBiomarkers) {
    const lb = data.labBiomarkers;
    if (lb.hemoglobin?.value) {
      evaluations.push(evaluateHemoglobin(Number(lb.hemoglobin.value)));
    }
    if (lb.glucose?.value) {
      const ctx = lb.glucose.context === "post_meal" ? "post_meal" : "fasting";
      evaluations.push(evaluateGlucose(Number(lb.glucose.value), ctx));
    }
    if (lb.tsh?.value) {
      evaluations.push(evaluateTsh(Number(lb.tsh.value)));
    }
    if (lb.urineProtein?.value) {
      evaluations.push(evaluateUrineProtein(String(lb.urineProtein.value)));
    }
  }

  return evaluations;
}
