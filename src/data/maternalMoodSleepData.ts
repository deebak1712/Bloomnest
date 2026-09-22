export interface MaternalMoodArchetype {
  id: string;
  label: string;
  emoji: string;
  tone: "joyful" | "grounded" | "sensitive" | "fatigued" | "anxious" | "energized";
  tagline: string;
  description: string;
  somaticTip: string;
  colorClass: string;
}

export interface SleepPositionOption {
  id: "left_side" | "right_side" | "elevated_pillows" | "back_supine";
  label: string;
  subLabel: string;
  acogStatus: "RECOMMENDED_GOLD_STANDARD" | "SAFE_ALTERNATIVE" | "HEARTBURN_RELIEF" | "IVC_COMPRESSION_WARNING";
  description: string;
  isSafe: boolean;
  warningNote?: string;
}

export const MATERNAL_MOOD_ARCHETYPES: MaternalMoodArchetype[] = [
  {
    id: "connected_joy",
    label: "Connected & Joyful",
    emoji: "🌸",
    tone: "joyful",
    tagline: "Deep bonding with baby & maternal warmth",
    description: "Experiencing tender connection to your baby's movements, vitality, and emotional presence.",
    somaticTip: "Place both hands over your bump, take three slow diaphragmatic breaths, and send silent gratitude to your baby.",
    colorClass: "from-pink-500/20 to-rose-500/20 border-pink-300 text-pink-900 dark:text-pink-100",
  },
  {
    id: "calm_grounded",
    label: "Calm & Grounded",
    emoji: "🌿",
    tone: "grounded",
    tagline: "Emotionally balanced & serene",
    description: "Centering in peaceful equilibrium, feeling confident in your body's innate wisdom to nurture life.",
    somaticTip: "Continue gentle somatic pacing and preserve this calm reservoir with mindful herbal hydration.",
    colorClass: "from-emerald-500/20 to-teal-500/20 border-emerald-300 text-emerald-900 dark:text-emerald-100",
  },
  {
    id: "overwhelmed_sensory",
    label: "Sensory Overload / Overwhelmed",
    emoji: "🌪️",
    tone: "sensitive",
    tagline: "Elevated mental noise & sensory sensitivity",
    description: "Heightened sensitivity to loud environments, busy schedules, or an accumulation of pregnancy tasks.",
    somaticTip: "Dim room lighting, unplug from digital screens for 20 minutes, and practice 4s inhale / 6s exhale breathing.",
    colorClass: "from-amber-500/20 to-orange-500/20 border-amber-300 text-amber-900 dark:text-amber-100",
  },
  {
    id: "birth_labor_anxiety",
    label: "Birth & Labor Apprehension",
    emoji: "💭",
    tone: "anxious",
    tagline: "Worries regarding labor, pain, or transition",
    description: "Experiencing tokophobic thoughts, uncertainty about labor sensations, hospital readiness, or delivery day.",
    somaticTip: "Remind yourself: Contractions are not pain without purpose; they are waves of uterine muscular power bringing baby home.",
    colorClass: "from-indigo-500/20 to-purple-500/20 border-indigo-300 text-indigo-900 dark:text-indigo-100",
  },
  {
    id: "pregnancy_brain",
    label: "Pregnancy Brain / Foggy",
    emoji: "☁️",
    tone: "sensitive",
    tagline: "Mild forgetfulness & dreamy state",
    description: "Progesterone and reduced REM sleep redirecting maternal cognitive energy into primal somatic bonding.",
    somaticTip: "Be gentle with your expectations. Use written checklists and BloomNest voice notes instead of mental juggling.",
    colorClass: "from-sky-500/20 to-cyan-500/20 border-sky-300 text-sky-900 dark:text-sky-100",
  },
  {
    id: "deep_fatigue",
    label: "Deep Somatic Exhaustion",
    emoji: "🌙",
    tone: "fatigued",
    tagline: "Heavy bodily fatigue & low battery",
    description: "Profound physiological exhaustion as your metabolic system works overtime synthesizing baby's organs and blood.",
    somaticTip: "Prioritize horizontal rest. A 25-minute side-lying nap before 3:00 PM restores cellular ATP without disturbing night sleep.",
    colorClass: "from-purple-500/20 to-slate-500/20 border-purple-300 text-purple-900 dark:text-purple-100",
  },
  {
    id: "irritable_hormonal",
    label: "Irritable / Hormonal Shift",
    emoji: "⚡",
    tone: "sensitive",
    tagline: "Quick emotional reactivity",
    description: "Surges of placental estrogen and progesterone lowering emotional tolerance thresholds temporarily.",
    somaticTip: "Sip cold infused water with mint or cucumber. Physical coolness rapidly resets sympathetic nervous overdrive.",
    colorClass: "from-rose-500/20 to-red-500/20 border-rose-300 text-rose-900 dark:text-rose-100",
  },
  {
    id: "changing_body_sensitive",
    label: "Changing Body Sensitivity",
    emoji: "🦋",
    tone: "sensitive",
    tagline: "Adjusting to somatic shifts & posture",
    description: "Processing physical belly expansion, stretch marks, swelling, or changes in balance and center of gravity.",
    somaticTip: "Honor your magnificent body for building human life from scratch. Apply warm natural oils to belly and hips.",
    colorClass: "from-teal-500/20 to-indigo-500/20 border-teal-300 text-teal-900 dark:text-teal-100",
  },
  {
    id: "nesting_burst",
    label: "Nesting Surge of Energy",
    emoji: "✨",
    tone: "energized",
    tagline: "Burst of nesting instinct & preparation",
    description: "An evolutionary surge of maternal vitality encouraging organization, nursery preparation, and baby nesting.",
    somaticTip: "Channel this energy in short bursts, but avoid heavy lifting. Sit on a birth ball while sorting baby clothes.",
    colorClass: "from-amber-400/20 to-yellow-500/20 border-amber-300 text-amber-900 dark:text-amber-100",
  },
];

export const SLEEP_POSITIONS: SleepPositionOption[] = [
  {
    id: "left_side",
    label: "Left Lateral Sleep (SOS)",
    subLabel: "ACOG Gold Standard Posture",
    acogStatus: "RECOMMENDED_GOLD_STANDARD",
    description: "Optimizes Inferior Vena Cava (IVC) blood flow, maximizing transplacental oxygen and nutrient delivery to the fetus while aiding maternal kidney filtration.",
    isSafe: true,
  },
  {
    id: "right_side",
    label: "Right Lateral Sleep",
    subLabel: "Safe Alternating Position",
    acogStatus: "SAFE_ALTERNATIVE",
    description: "Safe and comfortable alternative when left hip or shoulder experiences pressure soreness. Still avoids aortic compression.",
    isSafe: true,
  },
  {
    id: "elevated_pillows",
    label: "Semi-Reclined / Pillow Propped",
    subLabel: "Reflux & Diaphragm Relief",
    acogStatus: "HEARTBURN_RELIEF",
    description: "Sleeping tilted at a 30° to 45° angle with pregnancy pillows. Prevents acid reflux / GERD and eases diaphragmatic shortness of breath.",
    isSafe: true,
  },
  {
    id: "back_supine",
    label: "Flat on Back (Supine)",
    subLabel: "ACOG Caution After 20–28 Weeks",
    acogStatus: "IVC_COMPRESSION_WARNING",
    description: "The heavy gravid uterus compresses the Inferior Vena Cava and aorta against the spine, reducing maternal cardiac venous return and placental perfusion.",
    isSafe: false,
    warningNote: "ACOG & RCOG Warning: Avoid prolonged flat back sleep in 2nd & 3rd trimesters. If you wake up on your back, simply gently roll onto your left side.",
  },
];

export const NOCTURNAL_DISTURBANCES: { id: string; label: string; emoji: string; advice: string }[] = [
  {
    id: "nocturia",
    label: "Frequent Urination (Nocturia)",
    emoji: "🚽",
    advice: "Hydrate heavily before 6:00 PM; taper liquid volume 2 hours before bed and double-void (lean forward on toilet) before sleeping.",
  },
  {
    id: "heartburn",
    label: "Heartburn / Acid Reflux (GERD)",
    emoji: "🔥",
    advice: "Eat dinner 3 hours before lying down; elevate upper torso with wedge pillows and avoid trigger foods (spicy, fried, mint).",
  },
  {
    id: "leg_cramps",
    label: "Leg Cramps / Calf Spasms",
    emoji: "🦵",
    advice: "Dorsiflex your foot (pull toes up toward your shin) during a cramp. Ensure adequate magnesium and electrolyte hydration.",
  },
  {
    id: "hip_pelvic_pain",
    label: "Hip & Pelvic Girdle Pain",
    emoji: "🦴",
    advice: "Place a firm pillow between knees and ankles to keep pelvic joints neutrally aligned in side-lying sleep.",
  },
  {
    id: "vivid_dreams",
    label: "Vivid Dreams / Night Sweats",
    emoji: "🌌",
    advice: "Progesterone deepens dream recall. Keep bedroom temperature cool (18–20°C) with breathable cotton bedding.",
  },
  {
    id: "restless_legs",
    label: "Restless Leg Syndrome (RLS)",
    emoji: "⚡",
    advice: "Gentle calf massage with warm sesame oil and a 10-minute warm bath before bed calms peripheral motor nerves.",
  },
  {
    id: "baby_kicking",
    label: "Active Baby Night Kicks",
    emoji: "👶",
    advice: "Babies often wake when maternal rocking ceases. Softly hum or gently stroke your belly to communicate calm somatic presence.",
  },
  {
    id: "nasal_congestion",
    label: "Pregnancy Rhinitis / Stuffy Nose",
    emoji: "💨",
    advice: "Increased estrogen engorges nasal mucosal capillaries. Use a cool-mist bedside humidifier and saline nasal spray.",
  },
];

export const PERINATAL_SUPPORT_RESOURCES = [
  {
    name: "Tele-MANAS (Govt of India)",
    phone: "14416 / 1800-891-4416",
    available: "24/7 Confidential & Free",
    description: "National tele-mental health programme providing supportive counseling in all Indian languages for pregnant and postpartum mothers.",
    badge: "Official 24/7 Helpline",
  },
  {
    name: "Vandrevala Foundation Helpline",
    phone: "+91 9999 666 555",
    available: "24/7 Free Crisis Support",
    description: "Specialized maternal anxiety and depression psychological counseling support across India.",
    badge: "Confidential Support",
  },
  {
    name: "Postpartum Support International (PSI)",
    phone: "Call/Text: 1-800-944-4773",
    available: "Global Perinatal Network",
    description: "Dedicated clinical resources, peer support groups, and perinatal psychiatrists for antenatal and postpartum mood care.",
    badge: "Global Network",
  },
];

export const INITIAL_DEMO_MOOD_LOGS = [
  {
    id: 101,
    date: "2026-09-22",
    mood: "Connected & Joyful",
    intensityScore: 8,
    sleepHours: 7.5,
    sleepQuality: "good" as const,
    sleepPosition: "left_side" as const,
    nightAwakenings: 2,
    sleepDisturbances: ["Frequent Urination (Nocturia)"],
    energyScore: 7,
    stressScore: 3,
    bedtime: "10:30 PM",
    wakeTime: "06:30 AM",
    gratitudePrompt: "Felt baby's active little flutter kicks while reading before sleep. So much love.",
    tags: ["Trimester 2", "Left Side Optimal"],
    notes: "Deep restorative rest on left side with pregnancy pillow between knees.",
  },
  {
    id: 102,
    date: "2026-09-21",
    mood: "Calm & Grounded",
    intensityScore: 7,
    sleepHours: 8.0,
    sleepQuality: "excellent" as const,
    sleepPosition: "left_side" as const,
    nightAwakenings: 1,
    sleepDisturbances: [],
    energyScore: 8,
    stressScore: 2,
    bedtime: "10:15 PM",
    wakeTime: "06:45 AM",
    gratitudePrompt: "Grateful for peaceful evening walk with partner and gentle sunset breeze.",
    tags: ["Trimester 2", "Left Side Optimal"],
    notes: "Best night of sleep this week. Woke up feeling genuinely refreshed.",
  },
  {
    id: 103,
    date: "2026-09-20",
    mood: "Sensory Overload / Overwhelmed",
    intensityScore: 6,
    sleepHours: 6.0,
    sleepQuality: "fair" as const,
    sleepPosition: "elevated_pillows" as const,
    nightAwakenings: 3,
    sleepDisturbances: ["Heartburn / Acid Reflux (GERD)", "Frequent Urination (Nocturia)"],
    energyScore: 5,
    stressScore: 6,
    bedtime: "11:30 PM",
    wakeTime: "06:00 AM",
    gratitudePrompt: "Grateful for a quiet morning cup of warm cumin water.",
    tags: ["Trimester 2", "Reflux Relief"],
    notes: "Late dinner triggered mild heartburn. Elevated head of bed with extra pillows helped.",
  },
  {
    id: 104,
    date: "2026-09-19",
    mood: "Birth & Labor Apprehension",
    intensityScore: 7,
    sleepHours: 6.5,
    sleepQuality: "fair" as const,
    sleepPosition: "left_side" as const,
    nightAwakenings: 2,
    sleepDisturbances: ["Vivid Dreams / Night Sweats"],
    energyScore: 6,
    stressScore: 5,
    bedtime: "11:00 PM",
    wakeTime: "06:00 AM",
    gratitudePrompt: "Grateful for my obstetrician explaining labor stages calmly during checkup.",
    tags: ["Trimester 2"],
    notes: "Had intense delivery dreams. Practiced slow 4-6 somatic breathing to settle back to sleep.",
  },
  {
    id: 105,
    date: "2026-09-18",
    mood: "Connected & Joyful",
    intensityScore: 9,
    sleepHours: 8.5,
    sleepQuality: "excellent" as const,
    sleepPosition: "left_side" as const,
    nightAwakenings: 1,
    sleepDisturbances: [],
    energyScore: 9,
    stressScore: 2,
    bedtime: "10:00 PM",
    wakeTime: "07:00 AM",
    gratitudePrompt: "Baby responded with soft kicks whenever we played the flute raga.",
    tags: ["Trimester 2", "Left Side Optimal"],
    notes: "Slept nearly uninterrupted. Womb and mind felt completely at peace.",
  },
];
