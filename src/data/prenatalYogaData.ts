export interface PrenatalYogaPose {
  id: string;
  sanskritName: string;
  englishName: string;
  category: "pelvic_opening" | "back_sciatica" | "stamina_balance" | "restorative";
  categoryLabel: string;
  trimester: "All Trimesters" | "Trimester 2 & 3" | "Trimester 1 & 2";
  durationSec: number;
  durationLabel: string;
  benefits: string;
  stepByStep: string[];
  props: string[];
  acogSafetyTip: string;
  imageUrl: string;
  recommendedFor: string;
}

export const PRENATAL_YOGA_POSES: PrenatalYogaPose[] = [
  {
    id: "baddha-konasana",
    sanskritName: "Baddha Konasana",
    englishName: "Butterfly / Bound Angle Pose",
    category: "pelvic_opening",
    categoryLabel: "Pelvic Hip Opening",
    trimester: "All Trimesters",
    durationSec: 120,
    durationLabel: "2-3 Minutes",
    benefits: "Gently stretches the adductor groin muscles, enhances blood perfusion to the pelvic basin, and encourages optimal pelvic symmetry for birth.",
    stepByStep: [
      "Sit upright with spine supported against a wall if lumbar fatigue is present.",
      "Bring the soles of your feet together, allowing knees to softly fall open to the sides.",
      "Place yoga blocks or folded blankets under outer thighs if inner groins feel tight.",
      "Inhale to lengthen spine upward; exhale and rest hands gently on ankles with relaxed shoulders."
    ],
    props: ["Yoga blocks or cushions under knees", "Wall support for back"],
    acogSafetyTip: "Do not push knees down with your hands. Let gravity gently open the hips without stressing sacroiliac joints.",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Tight hips, pelvic floor preparation, gentle breathing"
  },
  {
    id: "cat-cow",
    sanskritName: "Marjaryasana-Bitilasana",
    englishName: "Cat-Cow Dynamic Spinal Stretch",
    category: "back_sciatica",
    categoryLabel: "Lower Back & Spine Relief",
    trimester: "Trimester 2 & 3",
    durationSec: 90,
    durationLabel: "10-12 Breath Cycles",
    benefits: "Decompresses lumbar lordosis, alleviates pregnancy backaches, and encourages baby into an optimal anterior occiput position.",
    stepByStep: [
      "Come to all fours with wrists under shoulders and knees hip-width apart.",
      "Place a folded blanket under your knees for patellar cushioning.",
      "Inhale: gently lift chest and tailbone, letting the belly softly expand downward without hyper-arching.",
      "Exhale: gently tuck chin and round spine upward toward the sky, drawing baby softly toward spine."
    ],
    props: ["Padded blanket under knees", "Wrist wedges if carpal tunnel is present"],
    acogSafetyTip: "Avoid deep abdominal sinking during the cow phase. Keep abdominal engagement gentle to prevent diastasis recti strain.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Sciatica, lumbar tightness, pelvic ligament realignment"
  },
  {
    id: "malasana",
    sanskritName: "Malasana",
    englishName: "Supported Garland Deep Squat",
    category: "pelvic_opening",
    categoryLabel: "Labor Descent Preparation",
    trimester: "All Trimesters",
    durationSec: 90,
    durationLabel: "1-2 Minutes",
    benefits: "Increases the pelvic outlet diameter by up to 28%, stretches the perineum, and utilizes gravity to aid baby's descent into the birth canal.",
    stepByStep: [
      "Stand with feet wider than shoulder-width, toes turned outward 45 degrees.",
      "Place a sturdy yoga block or stool directly underneath your sitting bones.",
      "Slowly lower hips onto the block. Bring palms together at heart center with elbows gently inside knees.",
      "Lengthen your spine and take slow, deep abdominal breaths down into the pelvic bowl."
    ],
    props: ["Yoga block or low stool under hips", "Chair in front for balance"],
    acogSafetyTip: "If you have diagnosed placenta previa, cervical insufficiency, or hemorrhoids, avoid deep unsupported squats. Always use block support.",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Perineal preparation, pelvic floor relaxation, 3rd trimester labor prep"
  },
  {
    id: "balasana",
    sanskritName: "Supported Balasana",
    englishName: "Wide-Knee Restorative Child's Pose",
    category: "back_sciatica",
    categoryLabel: "Restorative Back Decompression",
    trimester: "All Trimesters",
    durationSec: 180,
    durationLabel: "3-5 Minutes",
    benefits: "Provides deep sacral and lower back decompression while creating ample comfortable space for the growing belly.",
    stepByStep: [
      "Kneel on a soft mat with big toes touching and knees spread wide enough for your belly.",
      "Position a long bolster or two firm pillows lengthwise between your knees.",
      "Walk hands forward and melt your torso onto the bolster, turning your cheek to one side.",
      "Breathe into the back of your lungs and lower sacrum, letting all pelvic tension melt away."
    ],
    props: ["Long yoga bolster or bed pillows", "Folded blanket under knees"],
    acogSafetyTip: "Ensure knees are spread wide enough so there is zero downward compression on the pregnant abdomen.",
    imageUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Fatigue relief, sacral pain, mental calmness"
  },
  {
    id: "utkata-konasana",
    sanskritName: "Utkata Konasana",
    englishName: "Goddess Pose (Supported)",
    category: "stamina_balance",
    categoryLabel: "Pelvic Strength & Stamina",
    trimester: "Trimester 2 & 3",
    durationSec: 60,
    durationLabel: "5-8 Breaths",
    benefits: "Strengthens quadriceps, glutes, and pelvic floor tone required for active upright labor and birth ball rocking.",
    stepByStep: [
      "Step feet wide apart, turning toes outward at 45 degrees.",
      "Place hands on hips or hold onto the back of a sturdy chair for balance.",
      "Exhale and bend knees, lowering hips into a comfortable wide squat while keeping knees tracking over ankles.",
      "Tuck tailbone slightly to keep spine tall and upright; inhale expanding chest."
    ],
    props: ["Sturdy chair or kitchen counter for balance"],
    acogSafetyTip: "Keep stance comfortable; do not squat past a 90-degree knee bend to protect knee ligaments from Relaxin-induced laxity.",
    imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Upright labor stamina, inner thigh strength, pelvic stability"
  },
  {
    id: "virabhadrasana-2",
    sanskritName: "Virabhadrasana II",
    englishName: "Supported Warrior II Pose",
    category: "stamina_balance",
    categoryLabel: "Confidence & Circulation",
    trimester: "Trimester 1 & 2",
    durationSec: 60,
    durationLabel: "30s Each Side",
    benefits: "Stimulates cardiovascular circulation, opens chest for deeper maternal respiration, and builds lower-body endurance.",
    stepByStep: [
      "Step feet wide apart. Turn right foot out 90 degrees and left foot slightly in.",
      "Bend right knee so it sits over the ankle; option to place a chair under right thigh for zero knee strain.",
      "Extend arms out parallel to the floor at shoulder height, relaxing shoulders away from ears.",
      "Gaze softly over right fingertips, breathing steady and deep."
    ],
    props: ["Chair under front thigh", "Wall behind back for balance"],
    acogSafetyTip: "Center of gravity shifts forward in pregnancy. Keep feet slightly wider horizontally to widen your base of support.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Circulatory boost, mental focus, fatigue reduction"
  },
  {
    id: "viparita-karani",
    sanskritName: "Viparita Karani",
    englishName: "Supported Legs-Up-the-Wall / Incline",
    category: "restorative",
    categoryLabel: "Edema & Swelling Drainage",
    trimester: "All Trimesters",
    durationSec: 180,
    durationLabel: "3-5 Minutes",
    benefits: "Assists venous lymphatic return, reduces ankle and foot edema, calms racing pulse, and promotes restorative evening sleep.",
    stepByStep: [
      "Place a bolster or folded blanket about 6 inches away from the wall.",
      "Position an inclined wedge or firm pillows so your upper torso is slightly elevated (not completely flat!).",
      "Swing legs gently up the wall while resting hips on the bolster with upper torso propped at a 15-20 degree incline.",
      "Rest hands softly on your belly and breathe in synchrony with your baby."
    ],
    props: ["Wall support", "Bolster under hips", "Inclined pillows for upper back"],
    acogSafetyTip: "In 2nd and 3rd trimesters, always keep the upper torso elevated at least 15 degrees to prevent vena cava compression.",
    imageUrl: "https://images.unsplash.com/photo-1510894347250-93a9c73367f8?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Swollen ankles, restless legs, varicosities, evening calm"
  },
  {
    id: "parsva-savasana",
    sanskritName: "Parsva Savasana",
    englishName: "Side-Lying Restorative Relaxation",
    category: "restorative",
    categoryLabel: "Deep Autonomic Reset",
    trimester: "All Trimesters",
    durationSec: 240,
    durationLabel: "4-5 Minutes",
    benefits: "The gold standard prenatal relaxation posture. Completely relieves pelvic floor load, improves left-uterine arterial blood flow, and calms maternal cortisol.",
    stepByStep: [
      "Lie comfortably on your left side on a cushioned yoga mat.",
      "Place a firm pillow or bolster between your knees and ankles to keep hips stacked horizontally.",
      "Tuck a small folded blanket under your bump for gentle belly lift support.",
      "Rest head comfortably on a pillow; close your eyes and let the whole body sink into gravity."
    ],
    props: ["Pillow between knees", "Pillow under head", "Small blanket under belly"],
    acogSafetyTip: "Left side-lying position maximizes cardiac output and renal filtration by keeping the vena cava completely free of pressure.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    recommendedFor: "Daily relaxation, lower back relief, sleep induction"
  }
];
