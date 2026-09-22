import { ContractionLog } from "../types";

export interface LaborTriageAssessment {
  status: "PRETERM_LABOR_ALERT" | "ACTIVE_LABOR_511_MET" | "EARLY_LATENT_LABOR" | "PRE_LABOR_PRACTICE";
  title: string;
  badge: string;
  description: string;
  recommendedAction: string;
  isUrgent: boolean;
  colorClass: string;
  avgDurationSec: number;
  avgIntervalSec: number;
}

export const BRAXTON_HICKS_VS_TRUE_LABOR = [
  {
    parameter: "Pattern & Regularity",
    braxtonHicks: "Irregular intervals, unpredictable, do not become closer together over time.",
    trueLabor: "Regular rhythm, get progressively closer (e.g., 10m -> 7m -> 5m -> 3m apart).",
  },
  {
    parameter: "Effect of Movement / Hydration",
    braxtonHicks: "Slow down or stop completely when you walk, change position, or drink water.",
    trueLabor: "Continue and often intensify regardless of walking, resting, or position changes.",
  },
  {
    parameter: "Location of Sensation",
    braxtonHicks: "Felt mainly in the front of the abdomen or groin; localized tightening.",
    trueLabor: "Often begins in the lower back and wraps around like a tight belt into the lower belly.",
  },
  {
    parameter: "Intensity Progression",
    braxtonHicks: "Weak, mild, or variable in intensity; does not progressively peak higher.",
    trueLabor: "Steadily becomes stronger, longer, and more intense; difficult to speak through peaks.",
  },
  {
    parameter: "Cervical Change",
    braxtonHicks: "Does not cause cervical dilation or effacement.",
    trueLabor: "Causes the cervix to thin (efface) and open (dilate) toward 10 cm.",
  },
];

export const LABOR_PHASES_INFO = [
  {
    phase: "Early / Latent Phase (0 – 5 cm)",
    timing: "Contractions 5 – 20 mins apart, lasting 30 – 45 seconds.",
    sensations: "Manageable cramping, menstrual-like backache, excitement, mucus plug discharge.",
    guidance: "Stay home, rest, hydrate with electrolyte water, take warm showers, and conserve energy.",
    tag: "Latent Labor",
  },
  {
    phase: "Active Phase (6 – 8 cm)",
    timing: "Contractions 3 – 5 mins apart, lasting 50 – 70 seconds (5-1-1 Rule met).",
    sensations: "Intense, focused waves requiring full concentration; impossible to talk through contractions.",
    guidance: "Time to head to the maternity hospital or birth center! Begin active down-breathing.",
    tag: "Active Labor — Head to Hospital",
  },
  {
    phase: "Transition Phase (8 – 10 cm)",
    timing: "Contractions 2 – 3 mins apart, lasting 60 – 90 seconds.",
    sensations: "Very intense, shaking legs, nausea, intense rectal pressure, feeling of 'I can't do this'.",
    guidance: "You are almost at complete dilation! Rely on partner counter-pressure and delivery team coaching.",
    tag: "Transition — Delivery Imminent",
  },
];

export const ACOG_RED_FLAGS = [
  {
    title: "Heavy Vaginal Bleeding",
    detail: "Bright red blood soaking a sanitary pad (more than normal pinkish bloody show). Potential sign of placenta previa or placental abruption.",
    urgency: "CRITICAL_EMERGENCY",
  },
  {
    title: "Water Broke with Green or Brown Fluid",
    detail: "Meconium staining (baby's first stool in amniotic fluid). Requires immediate hospital assessment to prevent meconium aspiration.",
    urgency: "CRITICAL_EMERGENCY",
  },
  {
    title: "Severe Constant Unremitting Pain",
    detail: "Intense, continuous uterine pain that does not ease between contractions. Possible uterine hyperstimulation or abruption.",
    urgency: "CRITICAL_EMERGENCY",
  },
  {
    title: "Sudden Cessation of Fetal Movement",
    detail: "Baby stops moving completely during or between contractions.",
    urgency: "HIGH_URGENCY",
  },
];

export const PARTNER_COMFORT_TECHNIQUES = [
  {
    title: "Sacral Counter-Pressure",
    description: "During each contraction peak, press the flat palm of your hand or a tennis ball firmly against her lower back (sacrum) to relieve posterior labor pressure.",
    emoji: "🤲",
  },
  {
    title: "Double Hip Squeeze",
    description: "Stand behind her as she leans on a bed or birth ball. Place your palms on both outer hip bones and squeeze inwards and upwards to open the pelvic outlet.",
    emoji: "👐",
  },
  {
    title: "Relax the Jaw & Shoulders",
    description: "Gently whisper: 'Drop your shoulders, soften your jaw.' The pelvic floor muscles reflexively release when the facial jaw and tongue are relaxed.",
    emoji: "🗣️",
  },
  {
    title: "Cool Cloth & Sips of Water",
    description: "Offer a chilled washcloth for forehead and neck between contractions, and offer small sips of electrolyte water or honey water.",
    emoji: "🧊",
  },
];

export function evaluateLaborTriage(
  contractions: ContractionLog[],
  currentWeek: number = 24
): LaborTriageAssessment {
  const recent = contractions.slice(0, 6);
  const withInterval = recent.filter((c) => c.intervalSeconds > 0);

  const avgDurationSec =
    recent.length > 0
      ? Math.round(recent.reduce((acc, c) => acc + c.durationSeconds, 0) / recent.length)
      : 0;

  const avgIntervalSec =
    withInterval.length > 0
      ? Math.round(withInterval.reduce((acc, c) => acc + c.intervalSeconds, 0) / withInterval.length)
      : 0;

  // 1. PRETERM LABOR CHECK (< 37 WEEKS)
  // If mother is under 37 weeks and having frequent contractions (e.g. interval <= 12 mins and duration >= 30s)
  if (currentWeek < 37) {
    const isFrequentPreterm =
      recent.length >= 3 &&
      withInterval.length >= 2 &&
      withInterval.every((c) => c.intervalSeconds <= 720) && // <= 12 mins apart
      recent.every((c) => c.durationSeconds >= 25);

    if (isFrequentPreterm) {
      return {
        status: "PRETERM_LABOR_ALERT",
        title: "⚠️ Preterm Labor Advisory (Gestation < 37 Weeks)",
        badge: "Preterm Alert",
        description: `You are at Week ${currentWeek}. You are experiencing regular contractions (~${Math.round(avgIntervalSec / 60)} mins apart, lasting ~${avgDurationSec}s). Regular uterine contractions before 37 weeks require prompt obstetric evaluation to prevent preterm birth.`,
        recommendedAction: "Do not wait for 5-1-1. Lie on your left side, drink 2 glasses of water, and call your obstetrician or hospital delivery triage immediately.",
        isUrgent: true,
        colorClass: "bg-red-600 text-white",
        avgDurationSec,
        avgIntervalSec,
      };
    }
  }

  // 2. FULL TERM ACTIVE LABOR (5-1-1 RULE)
  const isRule511Met =
    recent.length >= 3 &&
    withInterval.length >= 2 &&
    recent.every((c) => c.durationSeconds >= 45) &&
    withInterval.every((c) => c.intervalSeconds <= 330); // ~5.5 mins or less

  if (isRule511Met) {
    return {
      status: "ACTIVE_LABOR_511_MET",
      title: "🚨 Active Labor Alert: 5-1-1 Rule Met!",
      badge: "5-1-1 Active Labor",
      description: `Your contractions are consistently ~${Math.round(avgIntervalSec / 60)} minutes apart and lasting ~${avgDurationSec} seconds. Cervical dilation is likely advancing to active labor (6+ cm).`,
      recommendedAction: "Grab your hospital bag and proceed safely to your designated maternity hospital or birth center.",
      isUrgent: true,
      colorClass: "bg-rose-600 text-white",
      avgDurationSec,
      avgIntervalSec,
    };
  }

  // 3. EARLY / LATENT LABOR
  const isEarly =
    recent.length >= 2 &&
    withInterval.some((c) => c.intervalSeconds <= 600); // within 10 mins

  if (isEarly) {
    return {
      status: "EARLY_LATENT_LABOR",
      title: "🌱 Early Latent Labor Approaching",
      badge: "Early Labor",
      description: `Contractions are becoming rhythmic (~${Math.round(avgIntervalSec / 60)} mins apart, averaging ${avgDurationSec}s). Early labor can last several hours to a couple of days.`,
      recommendedAction: "Rest, take a warm bath, stay hydrated, and practice slow diaphragmatic breathing. Monitor until contractions reach the 5-1-1 pattern.",
      isUrgent: false,
      colorClass: "bg-amber-500 text-white",
      avgDurationSec,
      avgIntervalSec,
    };
  }

  // 4. PRE-LABOR / BRAXTON HICKS PRACTICE
  return {
    status: "PRE_LABOR_PRACTICE",
    title: "🌿 Pre-Labor / Practice Contractions (Braxton Hicks)",
    badge: "Rest Phase",
    description: "Contractions are currently irregular or spaced widely apart. Your uterine myometrium is toning and preparing.",
    recommendedAction: "Maintain normal restful activities, drink water, and practice breathing. Tap 'Start Contraction' whenever you feel tightening.",
    isUrgent: false,
    colorClass: "bg-teal-600 text-white",
    avgDurationSec,
    avgIntervalSec,
  };
}
