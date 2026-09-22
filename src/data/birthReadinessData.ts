import { 
  BirthReadinessCheckItem, 
  ReadinessPillar, 
  TacoDiagnosticResult, 
  AmnioticLeakFluidColor, 
  AmnioticLeakAmount, 
  AmnioticLeakOdor,
  DepartureEvaluationInput,
  DepartureEvaluationResult
} from "../types";

export const LOCAL_STORAGE_KEY_BIRTH_READINESS = "bloomnest_birth_readiness_v2";

export interface ReadinessPillarMeta {
  id: ReadinessPillar;
  name: string;
  shortName: string;
  iconName: string;
  colorClass: string;
  description: string;
}

export const READINESS_PILLARS: ReadinessPillarMeta[] = [
  {
    id: "documents",
    name: "Clinical & Identity Records",
    shortName: "Records & ID",
    iconName: "FileText",
    colorClass: "from-blue-500 to-indigo-600",
    description: "Govt ID, Hospital Registration MRN, TPA Insurance pre-auth, and antenatal MCP files."
  },
  {
    id: "hospital_bag",
    name: "Hospital Bag Readiness",
    shortName: "Hospital Bags",
    iconName: "Briefcase",
    colorClass: "from-rose-500 to-pink-600",
    description: "Labor room essentials, newborn clothing, postpartum pads, and birth partner pouch."
  },
  {
    id: "birth_plan",
    name: "Birth Plan & Provider Alignment",
    shortName: "Birth Plan",
    iconName: "HeartHandshake",
    colorClass: "from-purple-500 to-violet-600",
    description: "Delivery preferences reviewed with Dr. Priya Sharma, partner advocacy, golden hour."
  },
  {
    id: "logistics",
    name: "Transit Route & Emergency Logistics",
    shortName: "Logistics",
    iconName: "Car",
    colorClass: "from-amber-500 to-orange-600",
    description: "Vehicle fuel, 24/7 casualty entrance route drill, emergency cab, labor desk hotline."
  },
  {
    id: "newborn_home",
    name: "Newborn & Home Sanctuary",
    shortName: "Newborn Prep",
    iconName: "Baby",
    colorClass: "from-emerald-500 to-teal-600",
    description: "Pediatrician identified, infant car seat, clean nursery zone, nursing setup."
  },
  {
    id: "medical_triage",
    name: "Labor Ward Clinical Directives",
    shortName: "Clinical Triage",
    iconName: "Stethoscope",
    colorClass: "from-cyan-500 to-blue-600",
    description: "36w GBS swab, Rh antibody status, Hb levels, and previous scar evaluation."
  }
];

export const DEFAULT_READINESS_ITEMS: BirthReadinessCheckItem[] = [
  // ── Documents ──
  {
    id: "doc-1",
    pillar: "documents",
    title: "Aadhaar / Government Photo ID (Original + 3 Xerox Copies)",
    description: "Mandatory for Indian hospital admission desk, birth registry entry, and newborn municipal birth certificate filing.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Keep husband and wife originals together in a waterproof clear ziplock folder at the front of your bag.",
  },
  {
    id: "doc-2",
    pillar: "documents",
    title: "Maternity Health Insurance E-Card & Cashless TPA Pre-Auth Form",
    description: "Keep policy number, cashless TPA ID, and corporate HR/broker emergency desk numbers ready.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Inform hospital TPA desk 48 hours in advance for planned cesarean/induction, or on immediate casualty admission.",
    actionRoute: "medical-profile",
    actionLabel: "View Medical Profile & TPA"
  },
  {
    id: "doc-3",
    pillar: "documents",
    title: "Hospital Registration / UHID / Maternity Booking Docket",
    description: "Initial booking token, OP file barcode slip, and blood bank cross-matching requisition form.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Speeds up casualty admission so labor ward triage nurses can prep the birthing suite without delay."
  },
  {
    id: "doc-4",
    pillar: "documents",
    title: "Antenatal File & Trimester Ultrasound Scans Docket",
    description: "NT scan, Anomaly scan, 32w/36w Growth Doppler, OGTT glucose curve, and Tdap/TT vaccine card.",
    isDone: true,
    priority: "essential",
    clinicalTip: "In case of emergency transfer, the on-duty resident needs your latest placental maturity and amniotic fluid index (AFI)."
  },
  {
    id: "doc-5",
    pillar: "documents",
    title: "Emergency Medical Pass & Scannable QR Code",
    description: "Scannable emergency card showing blood group (B+), Rh status, allergies, and OB-GYN contact.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Print the double-sided wallet cutout from the Medical Profile studio and slip it into your partner's wallet.",
    actionRoute: "medical-profile",
    actionLabel: "Print Emergency QR Pass"
  },
  {
    id: "doc-6",
    pillar: "documents",
    title: "14-Digit National ABHA Health ID & Card",
    description: "Ayushman Bharat Health Account ID for seamless digital health record exchange across Indian medical centers.",
    isDone: false,
    priority: "recommended",
    actionRoute: "medical-profile",
    actionLabel: "Configure ABHA ID"
  },

  // ── Hospital Bag ──
  {
    id: "bag-1",
    pillar: "hospital_bag",
    title: "Mother's Labor & Delivery Gowns / Loose Cotton Nighties",
    description: "Front-button cotton nightwear for easy fetal monitoring belts, IV access, and immediate skin-to-skin.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Pack at least 3 changes of soft, pre-washed breathable cotton gowns.",
    actionRoute: "hospital-bag",
    actionLabel: "Open Hospital Bag Studio"
  },
  {
    id: "bag-2",
    pillar: "hospital_bag",
    title: "Postpartum Heavy Maternity Sanitary Pads & Mesh Panties",
    description: "Absorbent maternity pads (not regular thin pads) designed for initial heavy lochia discharge.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Pack at least 2 packs (20+ pads). High-waisted disposable mesh underwear protects cesarean incisions."
  },
  {
    id: "bag-3",
    pillar: "hospital_bag",
    title: "Newborn Essentials Pouch (Jhablas, Swaddles, Mittens & Cap)",
    description: "Pre-washed 100% organic cotton muslin baby clothes, knotted caps to preserve body heat, and gentle swaddle cloths.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Wash all newborn garments once in mild baby-safe detergent before packing to eliminate fabric irritants."
  },
  {
    id: "bag-4",
    pillar: "hospital_bag",
    title: "Comfort Toolkit (Birthing Ball / Peanut Ball / Massage Oil)",
    description: "Portable counter-pressure aids, lavender aromatherapy, lip balm, and 10-foot long phone charger cord.",
    isDone: false,
    priority: "recommended",
    clinicalTip: "Hospital electrical outlets are frequently far from the labor bed; a 10-foot charging cord is a lifesaver."
  },
  {
    id: "bag-5",
    pillar: "hospital_bag",
    title: "Birth Partner Go-Bag (Change of Clothes, Toiletries, Snacks)",
    description: "High-protein nuts/energy bars, electrolyte drink powder, warm hoodie (hospitals are chilly), and cash for hospital pharmacy.",
    isDone: false,
    priority: "recommended"
  },

  // ── Birth Plan ──
  {
    id: "plan-1",
    pillar: "birth_plan",
    title: "Birth Plan Customized & Printed for Labor Ward Handoff",
    description: "1-page visual summary specifying delivery mode, episiotomy directives, pain relief, and golden hour protocol.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Affix one copy to the labor suite clipboard and hand one copy to the head labor room nurse on triage admission.",
    actionRoute: "birth-plan",
    actionLabel: "Customize Birth Plan"
  },
  {
    id: "plan-2",
    pillar: "birth_plan",
    title: "Birth Plan Reviewed & Countersigned with Dr. Priya Sharma",
    description: "Discuss preferences during your 36-week antenatal checkup to align on hospital policies and emergency protocols.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Doctor sign-off ensures the attending night duty registrar respects your upright pushing and restrictive episiotomy wishes."
  },
  {
    id: "plan-3",
    pillar: "birth_plan",
    title: "Birth Partner Designated as Primary Medical Decision Advocate",
    description: "Empower your partner to speak calmly with nurses and doctors while you focus on somatic breathing and contractions.",
    isDone: true,
    priority: "essential",
    actionRoute: "emergency-contacts",
    actionLabel: "Verify Partner ICE Contact"
  },
  {
    id: "plan-4",
    pillar: "birth_plan",
    title: "Golden Hour Bonding Directives (Skin-to-Skin & DCC)",
    description: "Uninterrupted 60-min maternal-infant skin-to-skin contact, delayed cord clamping (60-180s), and partner cord cutting.",
    isDone: true,
    priority: "recommended",
    clinicalTip: "Delayed cord clamping increases newborn blood volume by up to 30% and improves neonatal iron stores for 6 months."
  },

  // ── Logistics ──
  {
    id: "log-1",
    pillar: "logistics",
    title: "Car Fuel Tank Full & Emergency Vehicle Maintenance Checked",
    description: "Ensure full fuel tank, spare tire inflated, and child locks deactivated for rapid departure at any hour.",
    isDone: true,
    priority: "essential",
    clinicalTip: "Keep a clean plastic sheet and dark towel on the car passenger seat in case membranes rupture during transit."
  },
  {
    id: "log-2",
    pillar: "logistics",
    title: "24/7 Labor Room Casualty Entrance Route Mapped & Driven",
    description: "Perform a practice dry-run to identify the night emergency casualty porch (often separate from the main hospital lobby).",
    isDone: true,
    priority: "essential",
    clinicalTip: "Check traffic patterns between 6 PM - 9 PM and know the quickest alternative backroad route."
  },
  {
    id: "log-3",
    pillar: "logistics",
    title: "Hospital Labor Room Triage Hotline Saved on Speed Dial",
    description: "Call labor ward nurses 20 minutes before arrival so CTG monitor, delivery bed, and attending resident are ready.",
    isDone: true,
    priority: "essential",
    actionRoute: "emergency-contacts",
    actionLabel: "View Emergency Hotlines"
  },
  {
    id: "log-4",
    pillar: "logistics",
    title: "Backup Emergency Transportation (Cab App / Family Driver)",
    description: "Identify 2 backup drivers or ride-hailing accounts with pre-loaded payment methods in case primary vehicle is unavailable.",
    isDone: false,
    priority: "recommended"
  },
  {
    id: "log-5",
    pillar: "logistics",
    title: "Home Security & Appliance Departure Protocol",
    description: "Geyser switches off, LPG gas cylinder valve turned off, windows latched, and spare key given to trusted family member.",
    isDone: false,
    priority: "optional"
  },

  // ── Newborn & Home ──
  {
    id: "home-1",
    pillar: "newborn_home",
    title: "Infant Car Seat / Safe Transport Carrier Installed & Tested",
    description: "Rear-facing infant car seat properly anchored with ISOFIX / seatbelt for safe newborn journey home from hospital.",
    isDone: false,
    priority: "essential",
    clinicalTip: "Indian traffic and hospital discharge guidelines strongly urge rear-facing car seats; holding a newborn in lap during car travel is unsafe."
  },
  {
    id: "home-2",
    pillar: "newborn_home",
    title: "Consultant Pediatrician Identified for Newborn Discharge Care",
    description: "Select the pediatrician who will administer Day 1 vaccines (BCG, OPV, Hep B) and conduct hearing screen and newborn metabolic screen.",
    isDone: true,
    priority: "recommended"
  },
  {
    id: "home-3",
    pillar: "newborn_home",
    title: "Clean, Sanitized Home Bassinet & Sleeping Space Ready",
    description: "Firm flat mattress, fitted sheet, no loose pillows/bumpers (AAP safe sleep protocol to eliminate SIDS risk).",
    isDone: false,
    priority: "recommended"
  },
  {
    id: "home-4",
    pillar: "newborn_home",
    title: "Maternal Home Recovery Station (Pillows, Hydration, Snacks)",
    description: "Nursing pillow, 1-liter bedside water flask, stool softener / high-fiber snacks, and perineal sitz bath salts / peri bottle.",
    isDone: false,
    priority: "recommended"
  },

  // ── Medical Triage ──
  {
    id: "med-1",
    pillar: "medical_triage",
    title: "36-Week Group B Streptococcus (GBS) Screening Status Verified",
    description: "GBS rectovaginal swab test result. If positive, intravenous Penicillin/Ampicillin prophylaxis is mandatory during active labor.",
    isDone: true,
    priority: "essential",
    clinicalTip: "GBS-positive mothers must report to the labor ward immediately upon membrane rupture or contraction onset."
  },
  {
    id: "med-2",
    pillar: "medical_triage",
    title: "Rh-D Negative Status & Anti-D Immunoglobulin Protocol",
    description: "Confirm maternal Rh-negative antibody screen (Indirect Coombs Test) and 28-week Anti-D dose administration record.",
    isDone: true,
    priority: "essential",
    clinicalTip: "If baby is Rh-positive at birth, a 2nd dose of Anti-D (300 mcg) must be administered within 72 hours of delivery.",
    actionRoute: "vaccinations",
    actionLabel: "Check Vaccine Schedule"
  },
  {
    id: "med-3",
    pillar: "medical_triage",
    title: "Hemoglobin (Hb) ≥ 11 g/dL Confirmed for Delivery Safety",
    description: "Ensures adequate oxygen-carrying capacity and safety buffer against normal physiological postpartum blood loss.",
    isDone: true,
    priority: "recommended",
    actionRoute: "medicine",
    actionLabel: "Check Iron Supplements"
  }
];

// ── ACOG Red-Flag Labor Warning Signs ──
export interface LaborWarningSign {
  id: string;
  severity: "emergency" | "urgent" | "normal";
  badgeText: string;
  title: string;
  subtitle: string;
  clinicalExplanation: string;
  actionProtocol: string[];
  callAction: "108" | "doctor" | "monitor";
}

export const LABOR_WARNING_SIGNS: LaborWarningSign[] = [
  {
    id: "ws-1",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Meconium-Stained Amniotic Fluid (Green / Brown Liquor)",
    subtitle: "Baby has passed first stool inside the amniotic sac prior to delivery",
    clinicalExplanation: "Meconium staining indicates potential fetal hypoxic stress and carries risk of Meconium Aspiration Syndrome (MAS). The neonatal pediatric resuscitation team must be scrubbed and present at the delivery bed.",
    actionProtocol: [
      "Note the exact time and color of fluid.",
      "Do NOT delay or wait for contractions to strengthen.",
      "Head directly to the hospital labor casualty immediately.",
      "Notify the triage nurse: 'Amniotic fluid is meconium-stained green.'"
    ],
    callAction: "108"
  },
  {
    id: "ws-2",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Heavy Bright Red Vaginal Bleeding (Soaking a Pad in < 1 Hour)",
    subtitle: "Active bleeding beyond normal gelatinous bloody show mucous",
    clinicalExplanation: "Bright red unprovoked bleeding strongly suggests Placenta Previa, low-lying placental edge separation, or Placental Abruption. Digital vaginal exams are strictly contraindicated.",
    actionProtocol: [
      "Do NOT insert tampons or undergo digital vaginal exam.",
      "Lie down on your left side immediately to maximize uterine perfusion.",
      "Dial 108 Maternal Ambulance or have partner drive urgently to casualty.",
      "Alert hospital emergency desk: 'Active obstetric hemorrhage.'"
    ],
    callAction: "108"
  },
  {
    id: "ws-3",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Severe Constant Abdominal / Uterine Pain ('Board-Like' Rigidity)",
    subtitle: "Agonizing pain without relaxation between uterine surges",
    clinicalExplanation: "Continuous knife-like abdominal pain with a rigid, tender uterus that does not soften between contractions is the hallmark sign of Placental Abruption (premature separation of placenta).",
    actionProtocol: [
      "Immediate emergency hospital departure.",
      "Do NOT take pain medications or food (prepare for potential emergency C-section).",
      "Keep left lateral tilt posture during transit."
    ],
    callAction: "108"
  },
  {
    id: "ws-4",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Preeclampsia Emergency Triad (Severe Headache + Vision Flashes + Rib Pain)",
    subtitle: "Severe frontal throbbing, blurred vision/scotoma, and epigastric right upper quadrant pain",
    clinicalExplanation: "Indicates severe preeclampsia with central nervous system irritability and hepatic capsule stretching. Risk of eclamptic seizure or maternal end-organ complications.",
    actionProtocol: [
      "Immediate blood pressure check and admission to labor casualty for Magnesium Sulfate seizure prophylaxis.",
      "Avoid bright lights or sudden loud stimuli.",
      "Call Dr. Priya Sharma / emergency hotline immediately."
    ],
    callAction: "doctor"
  },
  {
    id: "ws-5",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Marked Decrease or Total Absence of Fetal Movement",
    subtitle: "Fewer than 10 distinct kicks or rolls in 2 hours after cold drink and left-side rest",
    clinicalExplanation: "Reduced fetal movement indicates compromised fetal-placental oxygenation. Urgent Cardiotocography (CTG) non-stress test and biophysical ultrasound score are mandatory.",
    actionProtocol: [
      "Do not wait for morning if movement is absent at night.",
      "Head to the labor ward for 20-minute continuous fetal heart rate monitoring (CTG)."
    ],
    callAction: "doctor"
  },
  {
    id: "ws-6",
    severity: "emergency",
    badgeText: "🚨 Immediate Emergency (Call 108 / Go to Casualty)",
    title: "Umbilical Cord Prolapse (Feeling or Seeing Cord in Vagina)",
    subtitle: "Loop of pulsating umbilical cord slipped ahead of baby's presenting part",
    clinicalExplanation: "Occurs when membranes rupture and baby's head is not fully engaged. Cord compression cuts off oxygen supply to baby within minutes.",
    actionProtocol: [
      "Adopt KNEE-TO-CHEST position immediately (buttocks high in the air, chest on floor) to take pressure off the cord.",
      "Do NOT push the cord back inside.",
      "Dial 108 immediately for emergency ambulance dispatch."
    ],
    callAction: "108"
  },

  // ── Urgent Warning Signs ──
  {
    id: "ws-7",
    severity: "urgent",
    badgeText: "⚠️ Urgent Advisory (Contact Doctor within 1-2 Hours)",
    title: "Regular Contractions Before 37 Gestational Weeks",
    subtitle: "Rhythmic tightenings 4+ times in 1 hour accompanied by lower back pressure",
    clinicalExplanation: "Potential Preterm Labor. Early obstetric evaluation allows administration of tocolytic medications to pause contractions, and antenatal corticosteroid injections (Betamethasone) to mature baby's lungs.",
    actionProtocol: [
      "Drink 2 large glasses of water and lie on left side for 45 minutes.",
      "If contractions continue regularly, call Dr. Priya Sharma immediately for cervical evaluation."
    ],
    callAction: "doctor"
  },
  {
    id: "ws-8",
    severity: "urgent",
    badgeText: "⚠️ Urgent Advisory (Contact Doctor within 1-2 Hours)",
    title: "Persistent Clear Amniotic Fluid Leak (Water Breaking)",
    subtitle: "Trickle or gush of clear fluid without painful contractions",
    clinicalExplanation: "Premature Rupture of Membranes (PROM). The protective barrier against intrauterine infection is compromised. Labor usually starts spontaneously within 24 hours, but CTG monitoring is required.",
    actionProtocol: [
      "Put on a clean white sanitary pad to monitor color and volume.",
      "Do NOT take a bath (showering is safe), do NOT have intercourse.",
      "Contact the labor ward to report rupture time."
    ],
    callAction: "doctor"
  },
  {
    id: "ws-9",
    severity: "urgent",
    badgeText: "⚠️ Urgent Advisory (Contact Doctor within 1-2 Hours)",
    title: "Maternal Fever > 100.4°F (38.0°C) or Rigors",
    subtitle: "Elevated temperature with body chills during the third trimester",
    clinicalExplanation: "Fever near term can indicate chorioamnionitis (uterine infection), urinary tract infection, or systemic illness, which may induce fetal tachycardia.",
    actionProtocol: [
      "Check temperature with digital thermometer.",
      "Do not self-medicate with NSAIDs (Ibuprofen is contraindicated in 3rd trimester).",
      "Notify doctor for maternal-fetal infectious screening."
    ],
    callAction: "doctor"
  },

  // ── Normal Pre-Labor Signs ──
  {
    id: "ws-10",
    severity: "normal",
    badgeText: "🟢 Normal Physiological Pre-Labor (Stay Calm & Rest)",
    title: "Mucous Plug Loss / Bloody Show",
    subtitle: "Thick gelatinous discharge with pink, red, or brownish mucous streaks",
    clinicalExplanation: "As the cervix softens, thins (effaces), and begins to dilate, the protective mucous seal in the cervical canal is dislodged. Labor can still be days or even 1–2 weeks away.",
    actionProtocol: [
      "No emergency hospital departure is needed unless accompanied by regular painful contractions or fluid leaking.",
      "Note the color and notify doctor at your next scheduled visit."
    ],
    callAction: "monitor"
  },
  {
    id: "ws-11",
    severity: "normal",
    badgeText: "🟢 Normal Physiological Pre-Labor (Stay Calm & Rest)",
    title: "Pelvic Pressure & 'Lightening' (Baby Dropping)",
    subtitle: "Baby's presenting head engages deeply into the pelvic brim",
    clinicalExplanation: "Pressure shifts downward. Mothers often notice breathing becomes significantly easier and heartburn decreases, but urinary frequency and pelvic heaviness increase.",
    actionProtocol: [
      "Continue gentle pelvic tilts, walking, and birth ball hip circles.",
      "Rest comfortably with pillow support between knees."
    ],
    callAction: "monitor"
  },
  {
    id: "ws-12",
    severity: "normal",
    badgeText: "🟢 Normal Physiological Pre-Labor (Stay Calm & Rest)",
    title: "Braxton Hicks Practice Tightenings",
    subtitle: "Irregular, painless or mildly tight sensations concentrated in front of belly",
    clinicalExplanation: "Uterine practice contractions that tone the uterine muscle and promote cervical ripening. They do not increase in intensity or follow a strict rhythmic timetable.",
    actionProtocol: [
      "Drink a glass of warm water, change your physical posture, or take a warm shower.",
      "True labor contractions will intensify and get closer together regardless of movement."
    ],
    callAction: "monitor"
  }
];

// ── TACO Test Amniotic Leak Evaluator ──
export function evaluateTacoSymptoms(
  timeOption: string,
  amount: AmnioticLeakAmount,
  color: AmnioticLeakFluidColor,
  odor: AmnioticLeakOdor
): TacoDiagnosticResult {
  // 1. Red Flag Hazard: Green/Brown Meconium or Bright Red Hemorrhage
  if (color === "green_brown") {
    return {
      isLikelyAmniotic: true,
      isEmergency: true,
      urgencyLevel: "immediate_emergency",
      title: "🚨 Emergency: Meconium-Stained Amniotic Fluid Detected",
      guidance: "The green/brown coloration indicates baby has passed meconium in utero due to fetal stress. The baby needs immediate pediatric airway protection at birth.",
      protocolSteps: [
        "Head directly to the hospital labor casualty NOW.",
        "Inform triage nurses immediately: 'Amniotic fluid is meconium green.'",
        "Do NOT eat or drink anything (prep for safe delivery)."
      ]
    };
  }

  if (color === "bright_red") {
    return {
      isLikelyAmniotic: false,
      isEmergency: true,
      urgencyLevel: "immediate_emergency",
      title: "🚨 Emergency: Active Obstetric Bleeding",
      guidance: "Bright red fluid indicates active uterine or placental bleeding. This is NOT normal amniotic liquor.",
      protocolSteps: [
        "Lie on your left side immediately.",
        "Dial 108 or hospital emergency ambulance right away.",
        "Strictly NO internal or digital vaginal exams."
      ]
    };
  }

  // 2. High Probability Amniotic Rupture
  const isAmnioticOdor = odor === "sweet_bleach";
  const isAmnioticFlow = amount === "continuous_trickle" || amount === "sudden_gush";
  const isAmnioticColor = color === "clear_straw" || color === "pink_tinged";

  if (isAmnioticFlow && (isAmnioticOdor || isAmnioticColor)) {
    return {
      isLikelyAmniotic: true,
      isEmergency: false,
      urgencyLevel: "prompt_evaluation",
      title: "💧 High Probability: Membranes Have Ruptured (Water Broken)",
      guidance: "Your symptoms align strongly with true rupture of amniotic membranes. Because the sterile protective seal around baby is now open, infection risk increases over time.",
      protocolSteps: [
        `Leakage started: ${timeOption}. Report this exact start time to the labor room.`,
        "Wear a clean white sanitary pad to monitor fluid clarity.",
        "Avoid baths, swimming, and sexual intercourse.",
        "Call Dr. Priya Sharma / Labor Casualty to inform them you are on your way."
      ]
    };
  }

  // 3. Probable Bladder Leak / Urine Incontinence
  if (odor === "ammonia_urine" && amount === "damp_spot_only") {
    return {
      isLikelyAmniotic: false,
      isEmergency: false,
      urgencyLevel: "likely_normal",
      title: "🟡 Probable Urinary Stress Incontinence",
      guidance: "Third-trimester pelvic floor pressure from baby's head frequently causes mild involuntary urine leaks, especially during coughing, sneezing, or laughing.",
      protocolSteps: [
        "Empty your bladder completely.",
        "Put on a fresh dry pantyliner and lie down on your left side for 30 minutes.",
        "Stand up: If there is a warm gush or continuous trickle, it is amniotic fluid. If the pad stays dry, it was urine.",
        "Practice daily Kegel pelvic floor exercises."
      ]
    };
  }

  // 4. Heavy Cervical Leucorrhea / Vaginal Discharge
  if (odor === "odorless_mild" && amount === "damp_spot_only") {
    return {
      isLikelyAmniotic: false,
      isEmergency: false,
      urgencyLevel: "likely_normal",
      title: "🟢 Probable Physiological Leukorrhea / Cervical Mucous",
      guidance: "High estrogen levels in the 3rd trimester produce thick, milky, odorless discharge designed to keep the birth canal clean and lubricated.",
      protocolSteps: [
        "Normal physiological occurrence.",
        "Wear breathable cotton underwear.",
        "If discharge becomes itchy, foul-smelling, or curd-like, contact doctor to rule out yeast/vaginal infection."
      ]
    };
  }

  // Fallback
  return {
    isLikelyAmniotic: true,
    isEmergency: false,
    urgencyLevel: "prompt_evaluation",
    title: "💧 Indeterminate Fluid Leakage: Clinical Evaluation Advised",
    guidance: "It is challenging to distinguish high membrane leaks from heavy discharge at home without a sterile speculum exam and Nitrazine pH / AmniSure strip test.",
    protocolSteps: [
      "Put on a fresh white pad.",
      "Contact Dr. Priya Sharma's clinic or visit the labor casualty for a quick, painless 5-minute fluid confirmation test."
    ]
  };
}

// ── Hospital Departure Decision Engine ──
export function calculateHospitalDeparture(input: DepartureEvaluationInput): DepartureEvaluationResult {
  // 1. Water Broken Override
  if (input.hasWaterBroken) {
    return {
      status: "leave_immediately",
      badgeText: "🚨 Head to Hospital Now",
      badgeColor: "bg-rose-500 text-white",
      ruleApplied: "Membrane Rupture Protocol",
      headline: "Your water has broken. Time to head to the hospital!",
      description: "Regardless of contraction frequency, ruptured membranes require hospital admission for fetal monitoring (CTG) and infection prevention.",
      actionChecklist: [
        "Grab the hospital bag, medical file docket, and emergency wallet pass.",
        "Place a clean towel on the car passenger seat.",
        "Call the labor room triage desk en route to give an estimated arrival time."
      ]
    };
  }

  // 2. GBS Positive Protocol
  if (input.isGbsPositive && (input.contractionIntervalMinutes <= 8 || input.regularityDurationHours >= 1)) {
    return {
      status: "leave_immediately",
      badgeText: "🚨 GBS+ Immediate Admission",
      badgeColor: "bg-rose-600 text-white",
      ruleApplied: "Group B Strep Antibiotic Protocol",
      headline: "GBS Positive: Intravenous Antibiotics Required at Hospital",
      description: "Because you are GBS positive, you need at least 4 hours of IV Penicillin/Ampicillin before baby is delivered to prevent neonatal infection.",
      actionChecklist: [
        "Do not wait for active 5-1-1 labor.",
        "Leave for the hospital now so IV antibiotic infusion can start promptly."
      ]
    };
  }

  // 3. Multigravida (Second or subsequent baby)
  if (!input.isFirstBaby) {
    const trafficThreshold = input.distanceMinutes > 40 ? 5 : 4;
    if (input.contractionIntervalMinutes <= trafficThreshold && input.contractionDurationSeconds >= 50 && input.regularityDurationHours >= 1) {
      return {
        status: "leave_immediately",
        badgeText: "🚨 Active Labor (Multigravida Rule: 4-1-1)",
        badgeColor: "bg-rose-500 text-white",
        ruleApplied: "Multigravida Rapid Labor Progression Rule",
        headline: "Time to leave! Second labors progress significantly faster.",
        description: `Your contractions are ${input.contractionIntervalMinutes} mins apart and lasting ${input.contractionDurationSeconds}s. Second-stage labor can progress twice as fast as your first delivery.`,
        actionChecklist: [
          "Leave immediately with your birth partner.",
          "Practice deep 4s/6s somatic breathing in the car.",
          "Partner calls labor casualty desk to alert staff."
        ]
      };
    }
  }

  // 4. Primigravida (First baby) Standard 5-1-1 Rule
  const primigravidaThreshold = input.distanceMinutes > 40 ? 6 : 5;
  if (input.contractionIntervalMinutes <= primigravidaThreshold && input.contractionDurationSeconds >= 55 && input.regularityDurationHours >= 1) {
    return {
      status: "leave_immediately",
      badgeText: "🚨 Active Labor Established (5-1-1 Rule)",
      badgeColor: "bg-rose-500 text-white",
      ruleApplied: "ACOG Active Labor 5-1-1 Standard",
      headline: "5-1-1 Rule Met: Time to Head to the Hospital",
      description: `Contractions have been consistently 5 minutes apart (or closer), lasting 60 seconds, for over an hour. You are in active labor!`,
      actionChecklist: [
        "Grab hospital bags & ID file.",
        "Begin journey to hospital with your birth partner.",
        "Alert labor ward desk of your impending arrival."
      ]
    };
  }

  // 5. Early Labor / Preparation Stage
  if (input.contractionIntervalMinutes <= 10 && input.contractionDurationSeconds >= 35) {
    return {
      status: "prepare_and_monitor",
      badgeText: "⚠️ Early Latent Labor (Prepare & Monitor)",
      badgeColor: "bg-amber-500 text-white",
      ruleApplied: "Latent Labor Observation Phase",
      headline: "Early labor has begun. Stay calm and comfortable at home.",
      description: "Contractions are establishing a rhythm. Staying relaxed in your home environment helps labor progress faster than arriving at the hospital too early.",
      actionChecklist: [
        "Rest in comfortable positions; take a warm shower or bath.",
        "Sip electrolyte water, coconut water, or clear broth.",
        "Double-check that all hospital bags and documents are zipped by the door.",
        "Continue tracking surges in the Contraction Timer Studio."
      ]
    };
  }

  // 6. Pre-Labor / Rest
  return {
    status: "early_labor_rest",
    badgeText: "🟢 Pre-Labor / Rest Phase",
    badgeColor: "bg-emerald-500 text-white",
    ruleApplied: "Physiological Rest Protocol",
    headline: "Not yet in active labor. Conserve your energy.",
    description: "Your contractions are irregular or widely spaced. Rest, nap, and nourish your body.",
    actionChecklist: [
      "Prioritize restful sleep on your left side.",
      "Do gentle prenatal yoga or birth ball rocking.",
      "Stay well-hydrated."
    ]
  };
}

// ── Partner 5-Minute Departure Drill ──
export interface PartnerDrillItem {
  id: string;
  task: string;
  detail: string;
  isDone: boolean;
}

export const PARTNER_DEPARTURE_DRILL: PartnerDrillItem[] = [
  {
    id: "pd-1",
    task: "Grab Hospital Bags & Ziplock Document Docket",
    detail: "Take Mother's Bag, Baby's Bag, and the transparent Medical ID file containing Aadhaar, TPA card, and MCP scans.",
    isDone: false
  },
  {
    id: "pd-2",
    task: "Bring Phone Chargers & Charged Power Bank",
    detail: "Labor can last 12-24 hours. Ensure both phones and a power bank are packed.",
    isDone: false
  },
  {
    id: "pd-3",
    task: "Place Passenger Seat Towel & Waterproof Sheet in Car",
    detail: "Protects car seat in case amniotic membranes leak or rupture during the drive.",
    isDone: false
  },
  {
    id: "pd-4",
    task: "Call Hospital Labor Ward Triage Hotline En Route",
    detail: "Tell the on-duty nurse: 'We are 20 mins away. G1P0, 39 weeks, contractions 4 mins apart, Dr. Priya Sharma's patient.'",
    isDone: false
  },
  {
    id: "pd-5",
    task: "Home Safety Lockdown (Gas Cylinder, Geyser, Door Deadbolts)",
    detail: "Turn off LPG valve, switch off water heaters, lock balcony windows and front door.",
    isDone: false
  },
  {
    id: "pd-6",
    task: "Request Wheelchair at Casualty Entrance Upon Arrival",
    detail: "Drop mom at the casualty porch with the security/nurse team while you park the car.",
    isDone: false
  }
];
