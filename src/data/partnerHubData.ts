export interface TrimesterPartnerProfile {
  trimester: 1 | 2 | 3;
  weeksRange: string;
  themeTitle: string;
  mamaPhysiology: string;
  mamaEmotionalState: string;
  partnerPrimaryMission: string;
  top3WeeklyActions: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface PartnerChecklistItem {
  id: string;
  trimester: 1 | 2 | 3;
  category: "comfort" | "medical_logistics" | "bonding" | "labor_prep";
  title: string;
  tamilTitle?: string;
  detail: string;
  importance: "essential" | "high" | "recommended";
}

export interface LaborTechnique {
  id: string;
  title: string;
  tamilTitle: string;
  targetArea: string;
  howToPerform: string;
  partnerPosition: string;
  clinicalWhy: string;
  frequency: string;
  icon: string;
}

export interface EmpathyInsight {
  id: string;
  organSystem: string;
  anatomicalChange: string;
  whatShePhysicallyFeels: string;
  whatPartnerShouldDo: string;
  metricComparison: string;
  icon: string;
}

export interface FamilyHarmonyScript {
  id: string;
  scenario: string;
  tamilScenario: string;
  whyItMatters: string;
  whatPartnerCanSay: string;
  practicalAction: string;
}

// 1. Trimester Profiles
export const TRIMESTER_PARTNER_PROFILES: TrimesterPartnerProfile[] = [
  {
    trimester: 1,
    weeksRange: "Weeks 1 – 13",
    themeTitle: "The Foundation & Morning Comfort Protector",
    mamaPhysiology: "Progesterone surges cause extreme fatigue, morning sickness, and heightened olfactory sensitivity. Blood pressure may drop slightly, leading to dizziness.",
    mamaEmotionalState: "May fluctuate between disbelief, excitement, and anxiety about early scan milestones.",
    partnerPrimaryMission: "Protect her rest, handle food aromas, and take charge of clinic logistics.",
    top3WeeklyActions: [
      {
        title: "Kitchen & Odor Defense",
        description: "Take over cooking dishes with strong spices, garlic, or tadka if aromas trigger her nausea. Keep bland crackers & lemon water by the bedside.",
        icon: "🍋",
      },
      {
        title: "Early Clinic Companion",
        description: "Attend the 8-week dating ultrasound scan and Viability check. Take notes on doctor's folic acid & supplement instructions.",
        icon: "🩺",
      },
      {
        title: "Guaranteed 9-Hour Rest",
        description: "Take over evening chores so she can sleep by 9:30 PM. First-trimester exhaustion requires deep cellular restorative sleep.",
        icon: "🌙",
      },
    ],
  },
  {
    trimester: 2,
    weeksRange: "Weeks 14 – 27",
    themeTitle: "The Fetal Bonding & Nesting Co-Pilot",
    mamaPhysiology: "Energy returns as the placenta takes over hormone production. The belly rounds prominently. Relaxin hormone begins softening pelvic ligaments, leading to occasional round ligament twinges.",
    mamaEmotionalState: "Feeling glowing and connected as baby kicks begin ('Quickening'). Dreaming about baby names and nursery setup.",
    partnerPrimaryMission: "Talk to the bump daily (auditory development active), attend the Level-2 TIFFA scan, and plan baby logistics.",
    top3WeeklyActions: [
      {
        title: "Daily Evening Bump Talk",
        description: "Baby can hear outside voices from Week 18. Talk, sing, or read 5 minutes every night to build your vocal recognition bond.",
        icon: "🗣️",
      },
      {
        title: "Level-2 TIFFA Scan Day",
        description: "Do not miss the 20-week anomaly scan. Hold her hand as you both see baby's profile, beating heart chambers, and tiny fingers.",
        icon: "📷",
      },
      {
        title: "Comfort Massage & Hydration",
        description: "Massage her lower back and calves with warm sesame or almond oil. Ensure she drinks 2.5L water to support amniotic fluid volume.",
        icon: "💆‍♂️",
      },
    ],
  },
  {
    trimester: 3,
    weeksRange: "Weeks 28 – 40+",
    themeTitle: "The Guardian & Labor Room Doula Co-Pilot",
    mamaPhysiology: "Baby presses against diaphragm, stomach, and bladder. Shortness of breath, Braxton Hicks contractions, and pelvic pressure increase. Back-sleeping is restricted.",
    mamaEmotionalState: "Eager to meet baby, but feeling physically heavy and apprehensive about labor pain and delivery day.",
    partnerPrimaryMission: "Master hands-on labor counter-pressure, test-drive hospital routes, and pack departure essentials.",
    top3WeeklyActions: [
      {
        title: "Test-Drive Hospital Route",
        description: "Drive to the maternity hospital at peak traffic hours (8 AM & 7 PM). Locate the 24/7 Casualty & L&D emergency elevator entrance.",
        icon: "🚗",
      },
      {
        title: "Practice Sacral Counter-Pressure",
        description: "Learn how to press firmly on her lower sacrum with the heel of your hand during practice Braxton Hicks contractions.",
        icon: "🤲",
      },
      {
        title: "Hospital Bag in Car Boot",
        description: "Ensure all 4 bags (Mother, Baby, Partner, Documents) and infant car seat are inspected and ready for a 5-minute departure.",
        icon: "👜",
      },
    ],
  },
];

// 2. Interactive Checklists
export const PARTNER_CHECKLISTS: PartnerChecklistItem[] = [
  // Trimester 1
  {
    id: "t1_crackers",
    trimester: 1,
    category: "comfort",
    title: "Bedside Morning Sickness Kit",
    tamilTitle: "படுக்கை அருகில் காலை வாந்தி கிட்",
    detail: "Keep salted crackers, roasted almonds, and lemon-infused water by her bedside so she can eat a few bites before rising.",
    importance: "essential",
  },
  {
    id: "t1_insurance",
    trimester: 1,
    category: "medical_logistics",
    title: "Maternity Insurance & ABHA ID Verification",
    tamilTitle: "மருத்துவ காப்பீடு & ABHA அடையாள அட்டை",
    detail: "Verify corporate/personal policy maternity coverage, waiting period, cashless hospital network, and room-rent caps.",
    importance: "essential",
  },
  {
    id: "t1_groceries",
    trimester: 1,
    category: "comfort",
    title: "Take Over Odor-Sensitive Chores",
    tamilTitle: "சமையல் & மளிகை பொறுப்பை ஏற்றல்",
    detail: "Handle kitchen prep, raw meat, or heavy tadka cooking if strong smells trigger her morning sickness.",
    importance: "high",
  },
  {
    id: "t1_dating_scan",
    trimester: 1,
    category: "medical_logistics",
    title: "Accompany to 8-Week Viability Scan",
    tamilTitle: "முதல் அல்ட்ராசவுண்ட் ஸ்கேனில் உடன் செல்லுதல்",
    detail: "Hear the first rapid heartbeat (~140-160 BPM) together and record doctor's dietary warnings.",
    importance: "high",
  },
  {
    id: "t1_supplements",
    trimester: 1,
    category: "medical_logistics",
    title: "Folic Acid Daily Reminder Co-Pilot",
    tamilTitle: "ஃபோலிக் ஆசிட் மாத்திரை நினைவூட்டல்",
    detail: "Ensure she takes 400–500 mcg Folic Acid consistently every morning to safeguard neural tube development.",
    importance: "essential",
  },

  // Trimester 2
  {
    id: "t2_bump_talk",
    trimester: 2,
    category: "bonding",
    title: "Daily 5-Minute Nighttime Bump Talk",
    tamilTitle: "தினமும் இரவு குழந்தையிடம் பேசுதல்",
    detail: "Fetal cochlea and auditory cortex are active. Lean in close to the bump and speak in a calm, low-frequency voice.",
    importance: "essential",
  },
  {
    id: "t2_tiffa_scan",
    trimester: 2,
    category: "medical_logistics",
    title: "Attend Level-2 Anomaly (TIFFA) Scan",
    tamilTitle: "20-வது வார அனோமலி ஸ்கேன்",
    detail: "Crucial anatomical milestone. Ask questions about placental position (anterior/posterior) and cervical length.",
    importance: "essential",
  },
  {
    id: "t2_pediatrician",
    trimester: 2,
    category: "medical_logistics",
    title: "Shortlist Pediatricians & NICU Hospital",
    tamilTitle: "குழந்தை மருத்துவர் & NICU மருத்துவமனை தேர்வு",
    detail: "Verify hospital has a 24/7 in-house neonatologist and Level-III/IV NICU facilities.",
    importance: "high",
  },
  {
    id: "t2_valaikaapu_plan",
    trimester: 2,
    category: "bonding",
    title: "Coordinate Valaikaapu / Seemantham Dates",
    tamilTitle: "வளைகாப்பு / சீமந்தம் ஏற்பாடுகள்",
    detail: "Align dates with both families (usually 7th or 9th month odd weeks) ensuring mother is not physically overtaxed.",
    importance: "high",
  },
  {
    id: "t2_sleep_pillow",
    trimester: 2,
    category: "comfort",
    title: "Set Up Pregnancy U-Pillow (Left Lateral SOS)",
    tamilTitle: "கர்ப்பகால தலையணை அமைத்தல்",
    detail: "Equip her bed with a supportive wedge/U-pillow to promote sleeping on her left side (relieving IVC compression).",
    importance: "high",
  },

  // Trimester 3
  {
    id: "t3_route_drill",
    trimester: 3,
    category: "labor_prep",
    title: "Hospital Route & Parking Emergency Test Run",
    tamilTitle: "மருத்துவமனை அவசர வழி ஓட்டம்",
    detail: "Drive the route at 8 AM and 7 PM. Note speed bumps, detour zones, and the exact ramp to L&D triage.",
    importance: "essential",
  },
  {
    id: "t3_car_seat",
    trimester: 3,
    category: "labor_prep",
    title: "Install & Inspect Infant Car Seat",
    tamilTitle: "காரில் குழந்தை இருக்கை பொருத்துதல்",
    detail: "Rear-facing installation at 45-degree angle in rear passenger seat. Test harness tightness with a stuffed toy.",
    importance: "essential",
  },
  {
    id: "t3_counter_pressure",
    trimester: 3,
    category: "labor_prep",
    title: "Practice Sacral Counter-Pressure & Hip Squeeze",
    tamilTitle: "இடுப்பு வலி குறைக்கும் அழுத்த பயிற்சி",
    detail: "Master the heel-of-hand sacral press and double hip squeeze during practice Braxton Hicks contractions.",
    importance: "essential",
  },
  {
    id: "t3_partner_bag",
    trimester: 3,
    category: "labor_prep",
    title: "Pack Partner Labor Room Go-Bag",
    tamilTitle: "துணைவருக்கான பிரசவ அறை பை",
    detail: "Pack 2 changes of comfortable clothes, slippers, energy snacks, extra-long phone cable, lip balm, and breath mints.",
    importance: "essential",
  },
  {
    id: "t3_emergency_broadcast",
    trimester: 3,
    category: "medical_logistics",
    title: "Prepare Family WhatsApp Broadcast Group",
    tamilTitle: "குடும்ப வாட்ஸ்அப் செய்தி வரைவு",
    detail: "Draft calm broadcast messages so family is kept informed without bombarding the labor room with phone calls.",
    importance: "high",
  },
  {
    id: "t3_birth_plan_copies",
    trimester: 3,
    category: "labor_prep",
    title: "Print 3 Copies of Mother's Birth Plan",
    tamilTitle: "பிரசவ திட்ட நகல்கள் (3 பிரதிகள்)",
    detail: "Keep 1 copy in car, 1 in hospital admission bag, and 1 handy to tape near the L&D bed.",
    importance: "high",
  },
];

// 3. Labor Room Coach Deck
export const LABOR_ROOM_TECHNIQUES: LaborTechnique[] = [
  {
    id: "sacral_press",
    title: "Sacral Counter-Pressure",
    tamilTitle: "இடுப்பு எலும்பு எதிர்-அழுத்தம்",
    targetArea: "Lower back & sacrum (between buttocks)",
    howToPerform: "During a contraction, place the firm heel of your hand (or both hands intertwined) directly against the flat bone at the base of her spine. Lean your full body weight inward with continuous, steady pressure.",
    partnerPosition: "Stand behind or beside her while she leans forward over a birth ball, bed, or your shoulders.",
    clinicalWhy: "Counteracts internal fetal head pressure against maternal sacral nerve plexuses, significantly reducing 'back labor' pain.",
    frequency: "Apply at the exact peak of every active contraction; release gradually as the wave subsides.",
    icon: "🤲",
  },
  {
    id: "double_hip_squeeze",
    title: "Double Hip Squeeze",
    tamilTitle: "இருபுற இடுப்பு அழுத்தம்",
    targetArea: "Outer fleshy sides of hips (posterior iliac crests)",
    howToPerform: "Cup both hands firmly over the outer curve of her hips. Press inward and slightly upward toward her belly button with firm, symmetric force.",
    partnerPosition: "Stand directly behind her as she kneels or leans forward on a birth ball.",
    clinicalWhy: "Relieves sacroiliac joint tension and opens the pelvic inlet/outlet, encouraging optimal fetal head descent.",
    frequency: "Throughout the 60–90 second contraction wave.",
    icon: "👐",
  },
  {
    id: "cool_compress",
    title: "Neck & Forehead Thermal Relief",
    tamilTitle: "கழுத்து & நெற்றி குளிர் ஒத்தடம்",
    targetArea: "Back of neck, forehead, and temples",
    howToPerform: "Keep a bowl of cool ice water and 2 soft hand towels. Wring damp towel and gently press against her forehead or wipe her neck between contraction waves.",
    partnerPosition: "Beside her bed or in front of her.",
    clinicalWhy: "Labor creates intense thermoregulatory heat surges. Cool sensory input down-regulates adrenaline and soothes nervous exhaustion.",
    frequency: "Between contractions (never block her view or touch during peak bearing down unless requested).",
    icon: "🧊",
  },
  {
    id: "somatic_breath_anchor",
    title: "Synchronized Breathing Anchor",
    tamilTitle: "இணைந்த மூச்சு பயிற்சி வழிகாட்டுதல்",
    targetArea: "Lungs, jaw, and pelvic floor",
    howToPerform: "Make eye contact. Breathe loudly and slowly with her: 'In through nose (1-2-3-4)... long soft exhale through loose lips (1-2-3-4-5-6)'. Remind her: 'Keep your jaw soft like jelly'.",
    partnerPosition: "Directly in her eyeline, within 1 foot.",
    clinicalWhy: "Jaw tension is neurologically connected to pelvic floor tightness. When mother exhales with soft lips, her perineum relaxes for fetal descent.",
    frequency: "As each contraction begins to crest.",
    icon: "🌬️",
  },
];

export const LABOR_COMMUNICATION_RULES = {
  whatToSay: [
    { phrase: "You are doing this. Look how strong you are.", why: "Validates her capability without minimizing the effort." },
    { phrase: "Every wave brings our baby closer to your arms.", why: "Reframes contraction pain as purposeful, progressive progress." },
    { phrase: "Inhale peace... exhale and let your jaw go soft.", why: "Directs actionable somatic release to soften the pelvic floor." },
    { phrase: "I am right here with you. You are completely safe.", why: "Oxytocin (the labor hormone) thrives only when mother feels unconditionally safe." },
    { phrase: "Would you like a sip of coconut water or lip balm?", why: "Concrete, supportive care without requiring decision fatigue." },
  ],
  whatNeverToSay: [
    { phrase: "Just relax! / Calm down!", why: "Telling someone in labor to 'just relax' causes frustration and raises cortisol (stress)." },
    { phrase: "Is it really that bad? It can't be that painful.", why: "Invalidates her lived physical experience; destroys labor room trust." },
    { phrase: "The nurse said you're only at 4 centimeters.", why: "Cervical dilation is non-linear. Announcing numbers can induce hopelessness and stall labor." },
    { phrase: "Look how tired I am from sitting here all night.", why: "Partner must remain an uncomplaining rock of support in the delivery suite." },
    { phrase: "Can you stop making those loud sounds?", why: "Low guttural vocalizations are natural and release pelvic floor tension." },
  ],
};

// 4. "Walk in Her Shoes" Maternal Empathy Simulator
export const MATERNAL_EMPATHY_INSIGHTS: EmpathyInsight[] = [
  {
    id: "cardio_blood",
    organSystem: "Cardiovascular System",
    anatomicalChange: "Blood volume expands by 45% to 50% (nearly 1.5 extra liters of plasma).",
    whatShePhysicallyFeels: "Resting heart rate jumps by 15–20 BPM. Even climbing 10 stairs makes her heart pound as if running a 5K sprint.",
    whatPartnerShouldDo: "Never tell her she is 'walking slow'. Carry all heavy bags, groceries, and ensure she has a seat immediately in queues.",
    metricComparison: "Her heart pumps 6–7 liters/min compared to 4.5 liters/min non-pregnant.",
    icon: "💓",
  },
  {
    id: "lungs_diaphragm",
    organSystem: "Respiratory & Lungs",
    anatomicalChange: "Growing uterus pushes her diaphragm upward by 4 cm, compressing lung capacity.",
    whatShePhysicallyFeels: "Sensation of breathless 'air hunger' while talking or sitting. She is breathing with 20% less functional residual lung volume.",
    whatPartnerShouldDo: "Keep living spaces airy and well-ventilated. Prop up her head and back with 2 extra pillows when resting.",
    metricComparison: "Diaphragm displaced upward by 4 cm (~1.6 inches).",
    icon: "🫁",
  },
  {
    id: "relaxin_pelvis",
    organSystem: "Musculoskeletal & Pelvis",
    anatomicalChange: "Placenta releases high levels of Relaxin hormone, softening every tendon and ligament in her pelvic girdle.",
    whatShePhysicallyFeels: "Sharp, clicking pain in the pubic bone (Symphysis Pubis Dysfunction) when turning in bed or stepping out of cars. Pelvic instability.",
    whatPartnerShouldDo: "Remind her to keep knees together when getting out of bed or the car. Assist with gentle pelvic alignment massage.",
    metricComparison: "Pelvic joint laxity increases by over 300% to allow baby's head passage.",
    icon: "🦴",
  },
  {
    id: "ivc_compression",
    organSystem: "Vena Cava & Blood Flow",
    anatomicalChange: "The 3.5 kg uterus compresses the Inferior Vena Cava (IVC) if lying flat on her back (Supine Hypotension).",
    whatShePhysicallyFeels: "Immediate nausea, lightheadedness, cold sweat, and fetal heart rate deceleration within 3 minutes of back-sleeping.",
    whatPartnerShouldDo: "Always position her on her Left Side (Left Lateral SOS position). Place a wedge pillow behind her back to prevent accidental rolling.",
    metricComparison: "Cardiac output drops by 25–30% when lying flat on back.",
    icon: "🔄",
  },
  {
    id: "hormonal_surges",
    organSystem: "Neuroendocrine Hormones",
    anatomicalChange: "Estrogen and progesterone levels are hundreds of times higher than baseline menstrual levels.",
    whatShePhysicallyFeels: "Sudden unexplained tears over small moments, intense maternal protective instincts, and sensory smell overload.",
    whatPartnerShouldDo: "Never say 'it's just hormones'. Offer a warm embrace, validate her feelings, and listen without trying to 'fix' her emotions.",
    metricComparison: "Estrogen produced in 1 pregnancy exceeds total produced in 30 years non-pregnant.",
    icon: "🌊",
  },
];

// 5. Family Harmony & Indian Cultural Coordination
export const FAMILY_HARMONY_SCRIPTS: FamilyHarmonyScript[] = [
  {
    id: "valaikaapu_coord",
    scenario: "Valaikaapu / Seemantham Ceremony Organization",
    tamilScenario: "வளைகாப்பு / சீமந்தம் ஏற்பாடு & சோர்வு தடுப்பு",
    whyItMatters: "Traditional bangle ceremonies bring immense joy and blessings, but standing for hours in heavy silk sarees causes severe maternal exhaustion and swollen ankles.",
    whatPartnerCanSay: "'Amma, let's schedule the main bangle blessing between 10:30 AM and 12:00 PM so she can rest in the afternoon. We will have a comfortable cushioned chair for her throughout.'",
    practicalAction: "Ensure a supportive low-backed sofa/chair with footstool, keep coconut water handy, and gently end photo sessions after 45 minutes.",
  },
  {
    id: "hospital_visitors",
    scenario: "Managing Extended Family Visits at the Hospital",
    tamilScenario: "பிரசவத்திற்கு பின் மருத்துவமனை பார்வையாளர்கள் கட்டுப்பாடு",
    whyItMatters: "First 24 hours postpartum are critical for maternal sleep, perineal healing, and the Golden Hour first breastfeed latch without 15 relatives crowding the room.",
    whatPartnerCanSay: "'Doctor strictly advised that mother and baby need uninterrupted rest for the first 24 hours to establish feeding. We look forward to welcoming everyone tomorrow evening between 5 and 6 PM!'",
    practicalAction: "Act as the loving gatekeeper. Meet guests in the hospital lounge, thank them for their blessings, and protect her recovery sanctuary.",
  },
  {
    id: "unsolicited_diet",
    scenario: "Handling Conflicting Food & Superstition Advice",
    tamilScenario: "உணவு மூடநம்பிக்கைகள் & தேவையற்ற ஆலோசனைகள் கையாளுதல்",
    whyItMatters: "Elders often give well-meaning but conflicting advice ('Eat for two', 'Don't drink water', 'Eat raw ghee').",
    whatPartnerCanSay: "'We really appreciate your concern, Auntie! Dr. Priya reviewed her exact blood test and tailored this balanced diet specifically for her iron and sugar levels.'",
    practicalAction: "Never let the expectant mother argue with in-laws or relatives. Partner steps in and absorbs the conversation politely.",
  },
  {
    id: "thaai_veedu_relocation",
    scenario: "Coordinating 'Thaai Veedu' Maternal Home Relocation",
    tamilScenario: "தாய் வீடு பயணம் & மருத்துவ ஆவணங்கள் பரிமாற்றம்",
    whyItMatters: "Relocating to her mother's home in the 7th or 8th month requires smooth coordination between cities/hospitals.",
    whatPartnerCanSay: "'I have organized all scan reports, blood tests, and doctor referral letters in her BloomNest folder. I will drive slowly with frequent rest stops every 90 minutes.'",
    practicalAction: "Plan highway breaks, check local hospital emergency casualty in the hometown, and pack 3 months of supplements.",
  },
];

// 6. 5-Minute Hospital Departure Checklist for Partner
export const DEPARTURE_DRILL_ITEMS = [
  { id: "d1", item: "Grab Mother Record Card, Aadhaar ID & Insurance Folder", icon: "📁", time: "0:30" },
  { id: "d2", item: "Load 4 Hospital Bags from hallway into car boot", icon: "👜", time: "1:30" },
  { id: "d3", item: "Help mother into front passenger seat with seatbelt below bump", icon: "🤰", time: "2:30" },
  { id: "d4", item: "Turn on AC / gentle music; grab water bottle & barf bag", icon: "🚗", time: "3:30" },
  { id: "d5", item: "Call Maternity Casualty to announce arrival: 'G1P0 arriving in 20 mins'", icon: "📞", time: "4:30" },
  { id: "d6", item: "Send 1-Tap WhatsApp Family Broadcast and drive calmly", icon: "💬", time: "5:00" },
];
