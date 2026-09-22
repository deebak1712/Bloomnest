export type FetalMovementType = "kick" | "roll" | "flutter" | "hiccup";

export interface FetalMovementDefinition {
  id: FetalMovementType;
  label: string;
  emoji: string;
  subLabel: string;
  description: string;
  countsTowardsGoal: boolean;
  colorClass: string;
}

export const FETAL_MOVEMENT_DEFINITIONS: FetalMovementDefinition[] = [
  {
    id: "kick",
    label: "Active Kick / Jab",
    emoji: "🦶",
    subLabel: "Sharp & Distinct",
    description: "Rapid, distinct kick or punch against the uterine wall. Often felt prominently on the sides or near the ribs.",
    countsTowardsGoal: true,
    colorClass: "bg-rose-500 text-white border-rose-600",
  },
  {
    id: "roll",
    label: "Whole-Body Roll",
    emoji: "🌊",
    subLabel: "Slow & Sweeping",
    description: "Slow, wave-like sensation of baby turning from side to side, shifting head position, or arching back.",
    countsTowardsGoal: true,
    colorClass: "bg-indigo-600 text-white border-indigo-700",
  },
  {
    id: "flutter",
    label: "Gentle Flutter",
    emoji: "🦋",
    subLabel: "Light & Soft",
    description: "Soft swishing, butterfly flutter, or tiny stretch. Common lower in the pelvis or when baby is in a lighter sleep cycle.",
    countsTowardsGoal: true,
    colorClass: "bg-pink-500 text-white border-pink-600",
  },
  {
    id: "hiccup",
    label: "Fetal Hiccups",
    emoji: "🫧",
    subLabel: "Rhythmic Spasms (Excluded)",
    description: "Involuntary rhythmic twitching every 2–4 seconds lasting several minutes. Completely normal practice for diaphragmatic breathing, but excluded from the 10 DFMC count.",
    countsTowardsGoal: false,
    colorClass: "bg-amber-500 text-white border-amber-600",
  },
];

export const MATERNAL_POSTURES = [
  {
    id: "left_side" as const,
    label: "Left Lateral (Optimal)",
    description: "Maximizes uterine artery blood flow and oxygen to baby.",
    isRecommended: true,
  },
  {
    id: "semi_reclined" as const,
    label: "Semi-Reclined with Pillows",
    description: "Comfortable angle, reduces heartburn and diaphragm pressure.",
    isRecommended: true,
  },
  {
    id: "sitting" as const,
    label: "Quietly Seated",
    description: "Comfortable chair with hands resting flat on the bump.",
    isRecommended: false,
  },
];

export const LOW_MOVEMENT_TRIAGE_STEPS = [
  {
    step: 1,
    title: "Cold Water or Light Juice",
    action: "Drink a tall glass of ice-cold water or 100% fruit juice. The sudden temperature shift and mild glucose surge naturally stimulate fetal wakefulness.",
    icon: "GlassWater",
  },
  {
    step: 2,
    title: "Lie on Your Left Side",
    action: "Move to a quiet, dimly lit bedroom and lie completely flat on your left side. Rest both warm palms gently over your lower abdomen.",
    icon: "Bed",
  },
  {
    step: 3,
    title: "Gentle Somatic Nudge & Voice",
    action: "Gently rock your belly with soft palm pressure and talk or sing softly to baby. Most babies have 20–40 minute sleep cycles and will stir within 60 minutes.",
    icon: "Sparkles",
  },
  {
    step: 4,
    title: "Immediate Clinical Contact",
    action: "If you still feel fewer than 10 movements after 2 hours on your side, or if movement is drastically reduced from normal, contact your OB-GYN or hospital immediately for a non-stress test (NST).",
    icon: "PhoneCall",
  },
];

export function getCircadianWindow(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}
