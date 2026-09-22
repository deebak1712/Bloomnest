import QRCode from "qrcode";
import { MedicalProfileData, UserProfile } from "../types";

/**
 * Format an ultra-clear, plain-text emergency summary that standard smartphone
 * cameras and paramedic tablets display immediately upon scanning.
 */
export function generateEmergencyPayload(profile: MedicalProfileData, user: UserProfile): string {
  const lines: string[] = [];

  lines.push("🚨 BLOOMNEST OBSTETRIC EMERGENCY PASS 🚨");
  lines.push(`PATIENT: ${user.fullName} (${user.age || 28}y)`);
  lines.push(`GESTATION: Week ${user.currentWeek} | EDD: ${user.edd || "N/A"}`);
  lines.push(`BLOOD GROUP: ${profile.bloodGroup} (${profile.rhFactor})`);

  if (profile.rhFactor === "Negative") {
    lines.push("⚠️ ALERT: Rh-Negative. Anti-D (RhoGAM 300mcg) required within 72h of trauma/bleeding!");
  }

  // GPAL & Obstetric
  const gpalStr = profile.gpal 
    ? `G${profile.gpal.gravida} P${profile.gpal.para} A${profile.gpal.abortions} L${profile.gpal.living}`
    : `G${profile.gravidaCount} P${profile.paraCount}`;
  lines.push(`OBSTETRIC: ${gpalStr}`);

  if (profile.priorCesareanDetails?.hasPrior || profile.previousCSection) {
    const scar = profile.priorCesareanDetails?.scarType || "Low Transverse";
    lines.push(`PRIOR C-SECTION: Yes (${scar})`);
  }

  if (profile.placentaLocation && profile.placentaLocation !== "Normal (Anterior/Posterior)") {
    lines.push(`PLACENTA: ${profile.placentaLocation} (⚠️ NO DIGITAL VAGINAL EXAM)`);
  }

  // Allergies
  if (profile.allergies && profile.allergies.length > 0) {
    lines.push(`ALLERGIES: ${profile.allergies.join(", ")} 🚫`);
  } else {
    lines.push("ALLERGIES: No Known Drug Allergies (NKDA)");
  }

  // High risk
  const conditions = [
    ...(profile.highRiskConditions || []),
    ...(profile.highRiskNotes || [])
  ];
  if (conditions.length > 0) {
    lines.push(`HIGH RISK: ${Array.from(new Set(conditions)).join(", ")}`);
  }

  // Critical Meds
  if (profile.criticalDailyMedications && profile.criticalDailyMedications.length > 0) {
    const medsList = profile.criticalDailyMedications
      .map(m => `${m.name} ${m.dose}${m.isAnticoagulant ? " (⚠️ Anticoagulant)" : ""}`)
      .join("; ");
    lines.push(`CRITICAL MEDS: ${medsList}`);
  }

  // Contacts
  lines.push(`ICE CONTACT: ${profile.emergencyContactName} (${profile.emergencyContactPhone})`);
  lines.push(`OB-GYN: ${profile.obgynName} (${profile.obgynPhone})`);
  lines.push(`HOSPITAL: ${profile.hospitalName}`);

  // Paramedic Triage Directives
  lines.push("\n🚨 EMT / FIRST RESPONDER CLINICAL DIRECTIVES:");
  lines.push("1. AORTOCAVAL DECOMPRESSION: DO NOT LIE FLAT ON BACK! Maintain 15-30° Left Lateral Tilt (LUD).");
  lines.push("2. Pregnancy airway is narrow/friable; pre-oxygenate before intubation.");

  return lines.join("\n");
}

/**
 * Generate an offline SVG string for the QR code.
 */
export async function generateQrSvg(text: string, size = 220): Promise<string> {
  try {
    const svgString = await QRCode.toString(text, {
      type: "svg",
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#1e1b4b", // deep indigo/slate
        light: "#ffffff",
      },
    });
    return svgString;
  } catch (err) {
    console.error("QR Code SVG generation error:", err);
    return "";
  }
}

/**
 * Generate an offline Data URL (PNG base64) for images or downloads.
 */
export async function generateQrDataUrl(text: string, size = 300): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code DataURL error:", err);
    return "";
  }
}
