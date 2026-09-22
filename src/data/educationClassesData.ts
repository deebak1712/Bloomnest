export const LOCAL_STORAGE_KEY_EDUCATION_PROGRESS = "bloomnest_education_progress_v2";

export interface AntenatalChapter {
  id: string;
  title: string;
  durationMins: number;
  summary: string;
  learningPoints: string[];
  partnerCoachingCue: string;
}

export interface AntenatalMasterclass {
  id: string;
  classNumber: string;
  title: string;
  subtitle: string;
  category: "labor_stages" | "comfort_breathing" | "medical_interventions" | "golden_hour" | "postpartum_prep";
  totalDurationMins: number;
  level: "Foundational" | "Comprehensive" | "Advanced";
  instructor: string;
  summary: string;
  chapters: AntenatalChapter[];
  keyTakeaways: string[];
  badgeColor: string;
}

export const ANTENATAL_MASTERCLASSES: AntenatalMasterclass[] = [
  {
    id: "cls-1",
    classNumber: "Masterclass 01",
    title: "Physiology of Labor, Pelvic Dynamics & Cervical Effacement",
    subtitle: "Understanding the biological cascade of labor surges and pelvic opening",
    category: "labor_stages",
    totalDurationMins: 45,
    level: "Foundational",
    instructor: "Dr. Priya Sharma (Senior Obstetrician & Childbirth Educator)",
    badgeColor: "from-rose-500 to-pink-600",
    summary: "Demystifies the 3 stages of labor, cervical softening (effacement) vs opening (dilation), and how gravity and maternal posture widen pelvic diameters by up to 28%.",
    chapters: [
      {
        id: "c1-1",
        title: "The 3 Stages of Labor & The 5-1-1 Active Labor Rule",
        durationMins: 12,
        summary: "Stage 1 covers Latent Phase (0-6 cm) where cervix softens and thins, Active Phase (6-10 cm) where dilation accelerates, and Transition (8-10 cm), the most intense but shortest phase. Stage 2 is pushing and birth; Stage 3 is placental expulsion.",
        learningPoints: [
          "Latent labor can last 12-24 hours for first-time mothers; staying relaxed at home is optimal.",
          "The 5-1-1 rule: Contractions every 5 minutes, lasting 60 seconds, consistent for 1 full hour signifies active labor.",
          "Transition phase brings sudden intense surges, shaking, nausea, and self-doubt ('I can't do this')—a definitive biological sign that birth is minutes away."
        ],
        partnerCoachingCue: "During Transition, stay right by her eye level. Hold her hand firmly, offer sips of water, and say: 'You ARE doing it right now; baby is right at the doorway.'"
      },
      {
        id: "c1-2",
        title: "Cervical Effacement vs Dilation Explained",
        durationMins: 10,
        summary: "Before the cervix can open (dilate 0 to 10 cm), it must first ripen from thick like your nose tip to paper-thin like your eyelid (effacement 0% to 100%).",
        learningPoints: [
          "Effacement is measured in percentages (0% to 100%). High effacement must precede rapid dilation.",
          "Mucous plug ('bloody show') release occurs as the cervical canal thins and tiny capillaries release pink/brown mucous.",
          "Vaginal cervical checks are elective; progress can also be monitored by vocal pitch, posture, and contraction frequency."
        ],
        partnerCoachingCue: "Don't fixate on numbers like 'only 3 cm'. Remind her: 'Your body has done 80% of the softening work already.'"
      },
      {
        id: "c1-3",
        title: "Pelvic Biomechanics: Opening the Pelvic Inlet, Midpelvis & Outlet",
        durationMins: 13,
        summary: "The female pelvis is not a rigid bone; it expands through the hormone Relaxin and maternal positioning.",
        learningPoints: [
          "Pelvic Inlet opens widest when maternal knees are turned outwards and hips extended.",
          "Midpelvis opens during forward-leaning postures, birth ball pelvic circles, and hands-and-knees.",
          "Pelvic Outlet (where baby crowns) expands up to 28% when knees are rolled inward and ankles out (Internal Hip Rotation) during deep squatting or side-lying."
        ],
        partnerCoachingCue: "Support her in upright asymmetrical lunges (one foot on a low stool) during contractions to help baby's head navigate the pelvic bend."
      },
      {
        id: "c1-4",
        title: "Stage 2: Spontaneous Physiological Pushing vs Directed Pushing",
        durationMins: 10,
        summary: "Contrasts coached breath-holding (Valsalva) with spontaneous open-glottis pushing following the Ferguson reflex.",
        learningPoints: [
          "Open-glottis pushing (grunting, roaring, vocal exhalations) preserves oxygenation to baby and lowers perineal tearing.",
          "Side-lying, all-fours, and squatting with bar take maternal weight off the sacrum, allowing the tailbone to flex back.",
          "Crowning ('Ring of Fire') is temporary; short panting breaths prevent explosive delivery and protect the perineum."
        ],
        partnerCoachingCue: "Remind mom to keep her jaw and shoulders soft. Soft jaw = soft pelvic floor."
      }
    ],
    keyTakeaways: [
      "Latent labor is for resting at home; active labor starts around 6 cm.",
      "Upright postures expand pelvic diameters by up to 28%.",
      "Transition self-doubt is the surest sign that delivery is imminent."
    ]
  },
  {
    id: "cls-2",
    classNumber: "Masterclass 02",
    title: "Non-Pharmacological Pain Relief, Somatic Breathing & Water Labor",
    subtitle: "A comprehensive evidence-based toolkit to ride labor surges with calm confidence",
    category: "comfort_breathing",
    totalDurationMins: 50,
    level: "Comprehensive",
    instructor: "Ananya Nair (Certified Lamaze Doula & Somatic Breathwork Coach)",
    badgeColor: "from-purple-500 to-indigo-600",
    summary: "Master the 4 somatic breathing pacing rhythms, Gate Control Theory acupressure (LI-4, SP-6), warm water hydrotherapy, and partner counter-pressure techniques.",
    chapters: [
      {
        id: "c2-1",
        title: "The 4-Tier Somatic Breathing Framework",
        durationMins: 15,
        summary: "Breathing is the only autonomic bodily function under conscious control. Controlled breath waves stop maternal adrenaline from spiking.",
        learningPoints: [
          "Rhythm 1 (Latent Surges): Slow deep abdominal breath. 4s in through nose, 6s sigh out through relaxed lips.",
          "Rhythm 2 (Active Surges): Wave breath. Inhale calm energy, ride the peak with steady slow out-breaths.",
          "Rhythm 3 (Transition / Premature Urge to Push): 'Pant-Pant-Blow' breathing prevents pushing against an incompletely dilated cervix.",
          "Rhythm 4 (Stage 2 Descent): Downward bearing breath, channeling diaphragmatic pressure downward like blowing out a candle slowly."
        ],
        partnerCoachingCue: "Breathe with her audibly. Match her tempo; when she starts speeding up or hyperventilating, slow down your own breath right in front of her."
      },
      {
        id: "c2-2",
        title: "Hydrotherapy: The Natural Labor Epidural",
        durationMins: 12,
        summary: "Warm water immersion (shower or tub) stimulates skin temperature receptors, blocking pain signals along spinal pathways.",
        learningPoints: [
          "Studies show warm water immersion reduces pharmacological epidural requests by up to 30%.",
          "Aim for water temperature between 36.5°C and 37.5°C (not too hot to avoid maternal/fetal tachycardia).",
          "Direct a warm handheld shower nozzle against the sacrum or lower abdomen during contractions."
        ],
        partnerCoachingCue: "Adjust water temperature and hand her cold washcloths for her forehead while she sits under the warm shower stream."
      },
      {
        id: "c2-3",
        title: "Partner Sacral Counter-Pressure & Double Hip Squeeze",
        durationMins: 13,
        summary: "Hands-on physical comfort methods that relieve intense lower back pressure and sacroiliac joint tension.",
        learningPoints: [
          "Sacral Counter-Pressure: Use the heel of your palm or a closed fist to apply continuous, firm inward pressure over the sacrum (tailbone) during a surge.",
          "Double Hip Squeeze: Place palms on the fleshy part behind both hip bones and squeeze inward and slightly upward, widening the pelvic inlet.",
          "Acupressure Gate Control: Squeezing a wooden comb against the palm or firm thumb pressure on Hegu (LI-4) between thumb and index finger triggers endorphin release."
        ],
        partnerCoachingCue: "Ask her: 'More pressure or higher up?' Maintain firm pressure until she exhales at the end of the contraction."
      },
      {
        id: "c2-4",
        title: "Birth Ball & Peanut Ball Positioning",
        durationMins: 10,
        summary: "Dynamic use of inflatable gym balls to keep maternal pelvis mobile, even with an epidural in place.",
        learningPoints: [
          "Seated pelvic figure-8s and gentle bouncing promote fetal head engagement.",
          "The Peanut Ball: When resting in bed (or with an epidural), placing a peanut-shaped ball between ankles and knees opens the midpelvis and shortens labor by an average of 90 minutes."
        ],
        partnerCoachingCue: "Help rotate her from left side-lying with peanut ball to right side-lying every 45 minutes to keep labor progressing."
      }
    ],
    keyTakeaways: [
      "Slow 4s in / 6s out breathing prevents adrenaline from stalling oxytocin.",
      "Warm shower spray directly on sacrum provides instant pain relief.",
      "The peanut ball between knees opens the pelvis even when resting in bed."
    ]
  },
  {
    id: "cls-3",
    classNumber: "Masterclass 03",
    title: "Medical Interventions: Epidurals, Induction Methods & Gentle C-Section",
    subtitle: "Informed decision-making, benefits, risks, and clinical indications for hospital interventions",
    category: "medical_interventions",
    totalDurationMins: 55,
    level: "Comprehensive",
    instructor: "Dr. Rajesh K. (Consultant Obstetric Anesthesiologist)",
    badgeColor: "from-blue-500 to-cyan-600",
    summary: "Clear, balanced clinical explanation of epidural analgesia, labor induction methods (Foley balloon, Pitocin), restrictive episiotomy vs tearing, and gentle cesarean birth protocols.",
    chapters: [
      {
        id: "c3-1",
        title: "Epidural Analgesia: Placement, Mechanics & Expectations",
        durationMins: 15,
        summary: "The most effective medical pain relief available. Covers procedure, test dose, and patient-controlled infusion.",
        learningPoints: [
          "Procedure: Performed in seated or side-curled 'cat-back' posture. A fine catheter is threaded into the epidural space outside the spinal cord.",
          "Takes 15-20 minutes to achieve peak pain relief while preserving motor ability to push.",
          "Side effects to know: Mild maternal hypotension (prevented with IV fluid bolus), shivering, temporary numbness in legs, and catheter urinary drainage."
        ],
        partnerCoachingCue: "Help her hold the still 'curled shrimp' posture while the anesthesiologist places the catheter. Reassure her: 'You're doing fantastic.'"
      },
      {
        id: "c3-2",
        title: "Labor Induction & Augmentation Methods",
        durationMins: 15,
        summary: "When labor needs medical initiation due to post-dates (41+ weeks), gestational diabetes, preeclampsia, or membrane rupture.",
        learningPoints: [
          "Mechanical Cervical Ripening: Foley catheter balloon placed inside the internal os gently expands the cervix to 3-4 cm without medication.",
          "Prostaglandin Gel / Pessary: Softens and ripens the cervix over 12-24 hours.",
          "Artificial Rupture of Membranes (Amniotomy): Using an amnihook to break the water bag, allowing baby's head to press directly on cervix.",
          "Oxytocin (Pitocin) IV Infusion: Gradually titrated up to create regular rhythmic contractions."
        ],
        partnerCoachingCue: "Ask the medical team: 'What is the Bishop score?' (measures how ready the cervix is before starting induction)."
      },
      {
        id: "c3-3",
        title: "ACOG Restrictive Episiotomy vs Spontaneous Tearing",
        durationMins: 12,
        summary: "ACOG Committee Opinion No. 687 explicitly recommends avoiding routine episiotomy in favor of selective use.",
        learningPoints: [
          "Routine surgical cutting of the perineum increases the risk of severe 3rd and 4th-degree anal sphincter tears.",
          "Spontaneous tears heal faster, cause less postpartum blood loss, and have lower dyspareunia (pain during intimacy) rates.",
          "Perineal massage in the final 4 weeks and warm compresses applied by nurses during crowning reduce tearing significantly."
        ],
        partnerCoachingCue: "Remind the labor ward team: 'Our birth plan preference is restrictive episiotomy and warm perineal compresses.'"
      },
      {
        id: "c3-4",
        title: "Gentle Cesarean Protocol (Family-Centered Surgical Birth)",
        durationMins: 13,
        summary: "How surgical births can still be deeply intimate, empowering, and bonding-centered.",
        learningPoints: [
          "Lowered or clear surgical drape allows parents to witness baby's very first breath and crowning.",
          "Immediate skin-to-skin in the operating theater: ECG leads placed on mother's back so baby can rest directly on her chest.",
          "Birth partner remains seated right beside mother's head throughout the procedure holding her hand.",
          "Delayed cord clamping can also be performed in operating rooms."
        ],
        partnerCoachingCue: "Keep your hand on her forehead and describe baby's arrival: 'He is here, he is crying, he looks so beautiful!'"
      }
    ],
    keyTakeaways: [
      "Epidural eliminates pain while keeping you awake and alert for pushing.",
      "ACOG recommends restrictive rather than routine episiotomy.",
      "Gentle C-sections preserve immediate skin-to-skin and partner presence in the OR."
    ]
  },
  {
    id: "cls-4",
    classNumber: "Masterclass 04",
    title: "Newborn Golden Hour, Skin-to-Skin & First Latch Mechanics",
    subtitle: "Protecting the first 60 minutes of life and establishing effortless breastfeeding",
    category: "golden_hour",
    totalDurationMins: 40,
    level: "Foundational",
    instructor: "Lakshmi Sundaram (IBCLC Lactation Consultant)",
    badgeColor: "from-amber-500 to-orange-600",
    summary: "The physiological significance of uninterrupted skin-to-skin, delayed cord clamping, newborn instinctive breast crawl, and mastering the deep asymmetrical latch.",
    chapters: [
      {
        id: "c4-1",
        title: "The Uninterrupted Golden Hour",
        durationMins: 10,
        summary: "The first 60 minutes immediately following birth represent a unique neurobiological sensitive period.",
        learningPoints: [
          "Placing naked baby prone on mother's bare chest stabilizes newborn heart rate, respiration, and body temperature better than a radiant warmer.",
          "Lowers newborn stress hormone cortisol and stimulates maternal surge of bonding hormone oxytocin, contracting the uterus and preventing postpartum hemorrhage.",
          "Non-urgent procedures (weighing, bathing, measurements) should be delayed until after the first breastfeed."
        ],
        partnerCoachingCue: "Advocate for mom and baby: 'Please delay routine weighing and footprints until they finish their golden hour skin-to-skin.'"
      },
      {
        id: "c4-2",
        title: "Delayed Cord Clamping (DCC) Science",
        durationMins: 10,
        summary: "Waiting 60 to 180 seconds until the umbilical cord stops pulsating transfers 80-100 ml of placental blood to baby.",
        learningPoints: [
          "Increases newborn blood volume by up to 30%.",
          "Boosts infant ferritin (iron) stores for up to 6 full months, preventing infant anemia.",
          "Recommended by WHO, ACOG, and Indian Academy of Pediatrics (IAP) for both vaginal and cesarean deliveries."
        ],
        partnerCoachingCue: "Look at the cord: it will transition from thick purple pulsating vessel to thin white limp cord before clamping."
      },
      {
        id: "c4-3",
        title: "The Deep Asymmetrical Latch & Nipple Pain Prevention",
        durationMins: 12,
        summary: "Breastfeeding should NEVER hurt. Pain indicates a shallow latch that can be corrected in seconds.",
        learningPoints: [
          "Nose-to-Nipple Alignment: Baby's nose should point towards the nipple so their head tilts back (like drinking a glass of water).",
          "Asymmetrical Latch: Baby takes more of the lower areola into their mouth, with the nipple pointing towards the roof of their mouth (soft palate).",
          "Signs of effective transfer: Wide open jaw angle, swallowing pauses ('breathe-suck-swallow'), and rounded full cheeks (not dimpled)."
        ],
        partnerCoachingCue: "Bring pillows and nursing stools to support mom's arms. Mom should bring baby to breast, never lean forward to baby."
      },
      {
        id: "c4-4",
        title: "Colostrum: 'Liquid Gold' & Day 1 Newborn Stomach Capacity",
        durationMins: 8,
        summary: "Why you don't need bottles of milk on Day 1. Colostrum is thick, antibody-rich immunological vaccination.",
        learningPoints: [
          "A newborn's stomach on Day 1 is the size of a marble (holds only 5 to 7 ml per feed).",
          "A mother produces only teaspoons of colostrum in the first 48 hours—exactly what baby's kidneys and stomach can process.",
          "Rich in Immunoglobulin A (IgA) that coats the newborn intestine, preventing pathogen entry."
        ],
        partnerCoachingCue: "Reassure elders: 'Doctor says baby's stomach is only marble-sized today; small frequent drops of colostrum are 100% sufficient.'"
      }
    ],
    keyTakeaways: [
      "Skin-to-skin for 60 mins stabilizes baby's heart rate and prevents maternal hemorrhage.",
      "Delayed cord clamping increases baby's iron stores for 6 months.",
      "Day 1 stomach size is only 5-7 ml; small drops of colostrum are perfect."
    ]
  },
  {
    id: "cls-5",
    classNumber: "Masterclass 05",
    title: "Postpartum Recovery, Lochia Tracking & Newborn Care Fundamentals",
    subtitle: "Navigating the fourth trimester with clinical healing, mental wellbeing, and baby care basics",
    category: "postpartum_prep",
    totalDurationMins: 45,
    level: "Comprehensive",
    instructor: "Dr. Meera Chandran (Perinatal Mental Health & Maternal Medicine)",
    badgeColor: "from-emerald-500 to-teal-600",
    summary: "Everything you need for the fourth trimester: lochia stages, perineal care, cesarean wound recovery, Baby Blues vs PPD (Tele-MANAS 14416), and newborn diapering and sleep safety.",
    chapters: [
      {
        id: "c5-1",
        title: "Normal Lochia Progression vs Postpartum Hemorrhage (PPH) Red Flags",
        durationMins: 12,
        summary: "Understanding normal uterine healing discharge and when bleeding requires emergency care.",
        learningPoints: [
          "Lochia Rubra (Days 1-4): Dark red, like heavy period, occasional small clots (size of a coin).",
          "Lochia Serosa (Days 4-10): Pinkish-brown, watery discharge as placental site heals.",
          "Lochia Alba (Weeks 2-6): Creamy yellowish-white discharge.",
          "RED FLAG WARNING: Soaking more than 1 heavy maternity pad in 1 hour, or passing clots larger than a golf ball requires immediate emergency OB-GYN evaluation."
        ],
        partnerCoachingCue: "Monitor her pad changes. If she feels dizzy, weak, or passes a large golf-ball-sized clot, call her doctor immediately."
      },
      {
        id: "c5-2",
        title: "Perineal & Cesarean Incision Healing Care",
        durationMins: 12,
        summary: "Practical hygiene techniques that accelerate wound closure and minimize infection.",
        learningPoints: [
          "Perineal Care: Use warm water in a peri bottle after every bathroom visit; pat dry gently from front to back, never wipe.",
          "Cesarean Incision Care: Keep incision dry and clean. Do not scrub or soak in tub. Watch for redness, warmth, or purulent oozing.",
          "Pelvic floor rest: Avoid lifting weights heavier than baby for the first 4-6 weeks."
        ],
        partnerCoachingCue: "Take over all heavy household chores and lifting so she can rest in bed with baby for the first 14 days."
      },
      {
        id: "c5-3",
        title: "Baby Blues vs Postpartum Depression & Tele-MANAS Support",
        durationMins: 11,
        summary: "Differentiating normal hormonal drop from clinical perinatal depression, and accessing free 24/7 national support.",
        learningPoints: [
          "Baby Blues: Crying spells, mood swings, anxiety occurring in Days 3-10 due to massive progesterone/estrogen drop; resolves spontaneously with rest and support.",
          "Postpartum Depression (PPD): Persistent hopelessness, inability to bond with baby, panic attacks, or thoughts of self-harm lasting > 2 weeks.",
          "National Support: India's 24/7 Tele-MANAS helpline (Dial 14416) provides confidential maternal emotional support."
        ],
        partnerCoachingCue: "Check in on her emotional state daily: 'How are you feeling inside your mind today?' Be her empathetic listener."
      },
      {
        id: "c5-4",
        title: "Newborn Care Basics: Cord Care, Diapering & ABC Safe Sleep",
        durationMins: 10,
        summary: "Essential practical skills for caring for your newborn during the first 2 weeks at home.",
        learningPoints: [
          "Umbilical Cord Stump: Keep it clean and dry; fold diaper waistband down below the stump. Will fall off spontaneously in 7-14 days.",
          "Diaper output benchmark: At least 6 wet diapers and 3-4 yellow seedy stools per day by Day 5 confirms adequate hydration.",
          "ABC Safe Infant Sleep: Alone in crib/bassinet, on their Back (supine), in a Clean flat mattress without pillows, bumpers, or heavy blankets (eliminates SIDS risk)."
        ],
        partnerCoachingCue: "Take charge of night-time diaper changes before bringing baby to mom for feeds."
      }
    ],
    keyTakeaways: [
      "Soaking more than 1 heavy pad in an hour is an obstetric emergency.",
      "Baby Blues are temporary; persistent anxiety/sadness past 2 weeks is treatable PPD.",
      "Safe infant sleep requires the ABCs: Alone, on Back, in clean Crib."
    ]
  }
];

export interface AntenatalArticle {
  id: string;
  title: string;
  category: "Clinical Alert" | "Fetal Science" | "Labor Prep" | "Ayurveda & Diet";
  readTime: string;
  snippet: string;
  author: string;
  evidenceSource: string;
  content: string;
  keyHighlights: string[];
}

export const ANTENATAL_ARTICLES: AntenatalArticle[] = [
  {
    id: "art-1",
    title: "Third Trimester Red Flags & Obstetric Emergency Triage",
    category: "Clinical Alert",
    readTime: "5 min read",
    author: "Dr. Priya Sharma (MD, DGO, Senior Obstetrician)",
    evidenceSource: "ACOG Committee Opinion No. 734: Obstetric Emergencies in Third Trimester",
    snippet: "Learn when to contact your OB-GYN or head to casualty immediately regarding reduced fetal movement, severe unremitting headaches, visual flashes, or active bright vaginal bleeding.",
    keyHighlights: [
      "Fewer than 10 fetal movements in 2 hours requires immediate non-stress test (CTG).",
      "Preeclampsia triad: Sudden frontal throbbing headache + blurred vision/flashes + right upper quadrant rib pain.",
      "Green/brown amniotic fluid (meconium) requires immediate hospital admission."
    ],
    content: `
During the third trimester (Weeks 28 to 40+), discerning harmless physiological sensations from acute obstetric emergencies is essential for maternal and neonatal safety.

### 1. Decreased or Altered Fetal Movement
Fetal sleep cycles typically last 20 to 40 minutes. However, a noticeable reduction in kicks, rolls, or jabs warrants immediate attention. The Cardiff 'Count-to-10' rule mandates that healthy fetuses generate at least 10 distinct movements within a 2-hour window when the mother is resting quietly on her left side after a meal or cold drink. If 10 movements are not felt, do not wait for the next morning—proceed to the labor casualty for continuous electronic fetal heart rate monitoring (Cardiotocography/CTG).

### 2. Preeclampsia Symptoms Triad
Preeclampsia can develop rapidly near term. It causes microvascular spasm and end-organ hypoperfusion. Immediate emergency symptoms include:
- Severe, persistent frontal headache that does not respond to paracetamol.
- Visual disturbances: Scintillating scotoma (shimmering zig-zags), floaters, or blurred vision.
- Severe pain beneath the right ribs (epigastric/right upper quadrant pain due to liver capsule stretching).
- Sudden rapid puffiness in face and hands.

### 3. Obstetric Hemorrhage vs Normal Bloody Show
While a gelatinous pink or brown-tinged discharge (mucous plug) is normal as the cervix ripens, active bright red bleeding that soaks a sanitary pad is an emergency. It suggests Placenta Previa (placenta overlying the cervical os) or Placental Abruption (premature separation of the placenta). Internal examinations are strictly contraindicated.

### 4. Meconium-Stained Amniotic Fluid
Amniotic fluid should be clear or straw-colored. Greenish or dark brownish liquor indicates the fetus has passed meconium in utero due to transient hypoxia. Pediatric resuscitation teams must be scrubbed and present at delivery to prevent Meconium Aspiration Syndrome (MAS).
    `
  },
  {
    id: "art-2",
    title: "Fetal Lung Maturation & Alveolar Surfactant Development",
    category: "Fetal Science",
    readTime: "4 min read",
    author: "Dr. S. K. Narayanan (Neonatologist & Pediatric Pulmonologist)",
    evidenceSource: "American Academy of Pediatrics (AAP) Neonatal Resuscitation Program",
    snippet: "How baby's lungs mature during Weeks 32 to 36 with pulmonary surfactant coating the alveoli, preparing your newborn for their first independent atmospheric breath.",
    keyHighlights: [
      "Type II pneumocyte cells begin producing surfactant around Week 24, surging by Week 34.",
      "Surfactant reduces surface tension, preventing alveoli from collapsing during exhalation.",
      "Antenatal Betamethasone steroids are administered if preterm delivery is threatened before 34-36 weeks."
    ],
    content: `
Inside the womb, the fetus does not breathe air. The placenta serves as the organ of respiration, providing oxygen and removing carbon dioxide via the umbilical vein and arteries. However, the fetal pulmonary architecture undergoes miraculous preparations.

### What is Pulmonary Surfactant?
Surfactant is a complex lipoprotein mixture synthesized by specialized Type II alveolar cells. It acts like a biological detergent, dramatically reducing the surface tension of the fluid lining the millions of tiny air sacs (alveoli). Without adequate surfactant, the alveoli would collapse shut every time baby exhales, leading to Infant Respiratory Distress Syndrome (IRDS).

### The Gestational Timeline
- **Weeks 24 to 28:** Primitive saccular alveoli develop, and Type II cells begin producing trace surfactant.
- **Weeks 32 to 34:** Production ramps up exponentially. Phosphatidylcholine (lecithin) levels rise sharply.
- **Weeks 35 to 37:** Mature lung surfactant levels are achieved. Most babies born past 36 completed weeks can breathe room air independently without CPAP or oxygen support.

### Antenatal Corticosteroid Therapy
When labor begins preterm (prior to 34–36 weeks), obstetricians administer two intramuscular injections of Betamethasone or Dexamethasone 24 hours apart. These steroids cross the placenta and accelerate fetal Type II pneumocyte maturation, cutting neonatal respiratory complications by over 50%.
    `
  },
  {
    id: "art-3",
    title: "Braxton Hicks vs True Progressive Labor: The 5-Point Matrix",
    category: "Labor Prep",
    readTime: "4 min read",
    author: "Ananya Nair (Certified Lamaze Childbirth Educator)",
    evidenceSource: "RCOG Green-top Guideline No. 44: Management of Spontaneous Labor",
    snippet: "A practical clinical guide to differentiating harmless practice contractions from true cervical-dilating labor surges.",
    keyHighlights: [
      "Braxton Hicks tightenings are irregular and fade with hydration and position changes.",
      "True labor surges grow closer together, last longer, and increase in intensity regardless of movement.",
      "True labor contractions often radiate from the lower back around to the front of the abdomen."
    ],
    content: `
Nearly all expectant mothers experience practice tightenings during the second and third trimesters. Known as Braxton Hicks contractions, these sensations tone the myometrium (uterine muscle) and enhance uterine blood flow.

### The 5-Point Diagnostic Matrix

1. **Regularity & Frequency:**
   - *Braxton Hicks:* Unpredictable, irregular spacing (e.g. 15 mins, then 8 mins, then 25 mins).
   - *True Labor:* Rhythmic, clockwork pattern (e.g. every 5 minutes) that progressively gets closer together (4 mins, 3 mins).

2. **Response to Activity & Hydration:**
   - *Braxton Hicks:* Fades or stops when you drink 2 glasses of water, take a warm shower, or lie down on your left side.
   - *True Labor:* Intensifies with walking, movement, and postural changes.

3. **Location of Sensation:**
   - *Braxton Hicks:* Concentrated in the front of the abdomen or pelvic groin.
   - *True Labor:* Originates in the lower back and wraps around the abdomen like a continuous tightening belt.

4. **Strength & Intensity:**
   - *Braxton Hicks:* Mild to moderate tightness; generally painless or mildly uncomfortable.
   - *True Labor:* Progressively stronger, requiring focused somatic breathing and making conversation during contractions difficult.

5. **Cervical Change:**
   - *Braxton Hicks:* Does not cause progressive effacement or cervical dilation.
   - *True Labor:* Steadily thins and dilates the cervix from 0 to 10 cm.
    `
  },
  {
    id: "art-4",
    title: "Traditional Indian Postpartum Nutrition & Healing Galactagogues",
    category: "Ayurveda & Diet",
    readTime: "5 min read",
    author: "Dr. Radhika V. (Ayurvedic Gynecologist & Perinatal Nutritionist)",
    evidenceSource: "AYUSH National Perinatal Guidelines & Evidence-Based Lactation Studies",
    snippet: "Exploring traditional postpartum healing foods: Fenugreek (Methi), Garlic (Poondu), Gondh laddoos, Carom (Ajwain/Omam) water, and Shatavari for rapid uterine involution and milk synthesis.",
    keyHighlights: [
      "Methi (Fenugreek) and Garlic stimulate prolactin receptor sensitivity, enhancing colostrum and milk volume.",
      "Omam / Ajwain water eases maternal and infant colic, bloating, and promotes digestion.",
      "Gondh (Edible Acacia Gum) and Ghee provide concentrated calories for pelvic floor bone restoration."
    ],
    content: `
In Indian postpartum tradition, the first 40 days following childbirth (*Jaapa* / *Sutika*) represent a sacred healing window. Ancient Ayurvedic wisdom aligns remarkably with modern clinical physiology in nourishing maternal recovery and establishing robust lactation.

### Key Healing Galactagogues & Functional Foods

1. **Fenugreek Seeds (*Methi*):**
   Rich in phytoestrogens and diosgenin, fenugreek has been shown in clinical trials to enhance maternal prolactin release, often increasing milk supply within 24 to 72 hours. Traditionally consumed as *Methi Kanji* or sprouted *Methi salad*.

2. **Garlic (*Poondu*):**
   Widely used in traditional *Poondu Kuzhambu*. Garlic possesses potent antimicrobial, anti-inflammatory properties, and subtle volatile sulfur compounds that subtly alter amniotic and milk scent, which studies suggest can encourage longer, more eager infant nursing sessions.

3. **Ajwain / Carom Water (*Omam Thanneer*):**
   Boiled water infused with ajwain seeds is the cornerstone of postpartum hydration. Thymol in ajwain relaxes gastrointestinal smooth muscle, prevents postpartum constipation, and reduces colic.

4. **Gondh & Dry Fruit Laddoos:**
   Edible acacia gum (*Gondh*) fried in pure A2 ghee with almonds, walnuts, and dry dates provides high-density caloric energy to sustain round-the-clock breastfeeding while nourishing collagen for ligament repair.

5. **Shatavari (*Asparagus racemosus*):**
   A premier Ayurvedic female tonic, clinically validated as a galactagogue that increases prolactin and reduces maternal oxidative stress.
    `
  },
  {
    id: "art-5",
    title: "Gentle Cesarean Protocol: Maternal-Infant Bonding in Surgical Birth",
    category: "Labor Prep",
    readTime: "4 min read",
    author: "Dr. Rajesh K. (Obstetric Anesthesiologist & Family-Centered Birth Advocate)",
    evidenceSource: "ACOG Practice Bulletin No. 205: Vaginal Birth After Cesarean & Surgical Protocols",
    snippet: "How gentle, family-centered cesarean techniques preserve immediate skin-to-skin, partner presence in the operating room, and the sacred golden hour.",
    keyHighlights: [
      "Lowered or clear surgical drapes allow mothers to witness birth in real-time.",
      "Repositioned ECG monitor leads allow immediate chest-to-chest skin-to-skin in the OR.",
      "Birth partner is seated right beside mother's head providing reassurance throughout the surgery."
    ],
    content: `
A surgical delivery, whether planned or medically necessary due to fetal distress, breech presentation, or placenta previa, does not have to be a cold, detached clinical experience. The 'Gentle Cesarean' or 'Family-Centered Cesarean' transforms surgical birth into an intimate family milestone.

### Core Elements of a Gentle Cesarean

1. **The Lowered / Clear Drape:**
   As baby is about to be born, the surgical screen is lowered or a clear plastic window is exposed, allowing the mother and partner to see their baby's head emerge, witness their first breath, and hear their initial cry.

2. **Immediate Operating Room Skin-to-Skin:**
   Instead of whisking baby off to an incubator across the room, the neonatal nurse quickly dries baby and places them naked directly on mother's chest beneath warm blankets while surgeons close the incision. The mother's ECG leads are placed on her back to keep her chest clear.

3. **Partner Presence Throughout:**
   The birth partner is scrubbed in, seated right by the mother's head, holding her hand, narrating the birth, and taking the first family photos.

4. **Delayed Cord Clamping in the OR:**
   Surgeons hold baby at the level of the incision for 60 seconds before clamping the cord, providing the full hemodynamic benefits of placental transfusion.
    `
  }
];

export interface AntenatalQuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalGuideline: string;
}

export const ANTENATAL_QUIZ_QUESTIONS: AntenatalQuizQuestion[] = [
  {
    id: 1,
    category: "Labor Assessment",
    question: "According to the ACOG 5-1-1 labor rule, when is it time to head to the hospital?",
    options: [
      "Contractions are 10 minutes apart lasting 30 seconds for 30 minutes",
      "Contractions are 5 minutes apart, lasting 60 seconds, consistent for 1 full hour",
      "Contractions are 2 minutes apart lasting 10 seconds for 2 hours",
      "Only after spontaneous rupture of membranes regardless of contractions"
    ],
    correctIndex: 1,
    explanation: "The 5-1-1 rule indicates established active labor: contractions arriving consistently every 5 minutes (or closer), lasting 60 seconds, for at least 1 continuous hour.",
    clinicalGuideline: "ACOG Committee Opinion on Management of Normal Labor"
  },
  {
    id: 2,
    category: "Maternal Physiology",
    question: "Why is left side-lying (SOS position) clinically recommended during the third trimester?",
    options: [
      "It prevents fetal hiccups",
      "It relieves pressure on the Inferior Vena Cava (IVC), maximizing placental blood flow and maternal kidney filtration",
      "It stops Braxton Hicks contractions permanently",
      "It speeds up cervical dilation by 5 cm overnight"
    ],
    correctIndex: 1,
    explanation: "The heavy gravid uterus compresses the Inferior Vena Cava in supine (flat on back) position, causing Supine Hypotensive Syndrome. Left lateral tilt keeps the vein open, maximizing cardiac output and placental oxygenation.",
    clinicalGuideline: "ACOG Clinical Consensus: Maternal Sleep Positioning"
  },
  {
    id: 3,
    category: "Obstetric Red Flags",
    question: "What does green or brownish amniotic fluid signify?",
    options: [
      "Normal high-protein fetal vernix discharge",
      "Meconium staining (baby passed stool in utero due to transient hypoxia), requiring immediate emergency hospital admission",
      "Bladder urine leakage with dietary dye",
      "Harmless cervical mucous plug shedding"
    ],
    correctIndex: 1,
    explanation: "Green or brownish liquor indicates meconium passage in utero, carrying risk of Meconium Aspiration Syndrome (MAS). The neonatal pediatric resuscitation team must be present at birth.",
    clinicalGuideline: "NICE Guidelines: Intrapartum Care & Meconium Triage"
  },
  {
    id: 4,
    category: "Pain Relief",
    question: "How does warm water hydrotherapy (shower or tub) aid during active labor?",
    options: [
      "It numbs the spinal cord completely like an epidural",
      "It stimulates thermal sensory skin receptors, blocking pain signals and reducing epidural requests by ~30%",
      "It artificially ruptures the amniotic sac faster",
      "It induces labor by releasing synthetic prostaglandins"
    ],
    correctIndex: 1,
    explanation: "Hydrotherapy utilizes the Gate Control Theory: warmth and buoyancy stimulate cutaneous nerve fibers, overriding slower pain transmission and releasing endogenous endorphins.",
    clinicalGuideline: "Cochrane Systematic Review: Immersion in Water in Labour"
  },
  {
    id: 5,
    category: "Labor Biomechanics",
    question: "Which maternal posture expands the pelvic outlet widest for crowning and delivery?",
    options: [
      "Lying flat on your back with legs pulled back (Lithotomy)",
      "Upright squatting, all-fours, or side-lying with internal hip rotation",
      "Standing stiffly with knees locked",
      "Sitting cross-legged on the floor"
    ],
    correctIndex: 1,
    explanation: "Upright postures, all-fours, and side-lying with knees turned inward expand the pelvic outlet by up to 28% compared to traditional flat lithotomy delivery beds.",
    clinicalGuideline: "ACOG Committee Opinion No. 687: Approaches to Limit Intervention"
  },
  {
    id: 6,
    category: "Golden Hour Care",
    question: "What is the recommended duration of immediate skin-to-skin contact during the Golden Hour?",
    options: [
      "5 minutes for a quick photo",
      "At least 60 continuous, uninterrupted minutes",
      "Only after baby has been bathed and weighed",
      "30 seconds before cord cutting"
    ],
    correctIndex: 1,
    explanation: "The World Health Organization (WHO) and AAP urge uninterrupted skin-to-skin for at least the first 60 minutes of life, which stabilizes newborn glucose, body temp, and heart rate.",
    clinicalGuideline: "WHO Guidelines on Protecting, Promoting and Supporting Breastfeeding"
  },
  {
    id: 7,
    category: "Neonatal Science",
    question: "What is the physiological stomach capacity of a healthy full-term newborn on Day 1?",
    options: [
      "60 to 90 ml (size of an adult coffee cup)",
      "5 to 7 ml (size of a small marble / 1 teaspoon per feed)",
      "30 ml (size of an egg)",
      "150 ml (size of a tennis ball)"
    ],
    correctIndex: 1,
    explanation: "On Day 1, a newborn's stomach holds only 5 to 7 ml (one teaspoon) at a time. The small, frequent drops of nutrient-dense colostrum perfectly match this physiological capacity.",
    clinicalGuideline: "Academy of Breastfeeding Medicine (ABM) Clinical Protocols"
  },
  {
    id: 8,
    category: "Surgical Birth",
    question: "ACOG Practice Bulletin No. 205 explicitly discourages which procedure as a routine practice?",
    options: [
      "Delayed cord clamping",
      "Routine episiotomy (surgical cut of perineum)",
      "Wireless fetal heart rate monitoring",
      "Skin-to-skin bonding in the operating room"
    ],
    correctIndex: 1,
    explanation: "ACOG recommends selective rather than routine episiotomy. Routine episiotomy increases severe 3rd and 4th-degree perineal lacerations and anal sphincter injury.",
    clinicalGuideline: "ACOG Practice Bulletin: Episiotomy & Perineal Laceration Prevention"
  },
  {
    id: 9,
    category: "Postpartum Recovery",
    question: "Which postpartum lochia pattern is an obstetric emergency requiring immediate hospital evaluation?",
    options: [
      "Watery pinkish discharge on Day 7 (Lochia Serosa)",
      "Soaking more than 1 heavy maternity pad in under 1 hour, or passing golf-ball-sized clots",
      "Yellowish-white creamy discharge at Week 3 (Lochia Alba)",
      "Dark red discharge during the first 48 hours"
    ],
    correctIndex: 1,
    explanation: "Soaking a pad in under an hour, continuous bright red gushing, or large clots indicate potential Postpartum Hemorrhage (PPH) or retained placental fragments.",
    clinicalGuideline: "ACOG Practice Bulletin No. 183: Postpartum Hemorrhage"
  },
  {
    id: 10,
    category: "Perinatal Mental Health",
    question: "What is India's free, 24/7 national tele-mental health support helpline for maternal emotional support?",
    options: [
      "100",
      "Tele-MANAS (14416)",
      "1098",
      "102"
    ],
    correctIndex: 1,
    explanation: "Tele-MANAS (Dial 14416) is the Ministry of Health & Family Welfare's 24/7 toll-free mental health service, providing multilingual counselling for maternal anxiety and postpartum depression.",
    clinicalGuideline: "Ministry of Health & Family Welfare (MoHFW) Tele-MANAS Initiative"
  }
];

export interface DoulaFaq {
  q: string;
  a: string;
}

export const ANTENATAL_DOULA_FAQS: DoulaFaq[] = [
  {
    q: "Can my husband or birth partner be inside the delivery room in Indian hospitals?",
    a: "Yes! Almost all modern Indian maternity hospitals (Apollo Cradle, Cloudnine, Motherhood, Rainbow, Fernandez, and most private and NABH-accredited facilities) welcome the birth partner in the L&D birthing suite and even during gentle C-sections. Simply specify this in your printed BloomNest Birth Plan."
  },
  {
    q: "Is walking and moving around safe while in labor?",
    a: "Absolutely! Movement and upright postures (walking, rocking on a birth ball, swaying) use gravity to help baby's head descend and rotate, reducing labor duration by an average of 1.5 hours and significantly reducing the need for epidurals or interventions."
  },
  {
    q: "When is the optimal gestational window to take childbirth classes?",
    a: "The ideal window is between Weeks 28 and 34 of pregnancy (early third trimester). You have enough energy to practice comfort positions, your partner has time to rehearse coaching cues, and you're well-prepared if baby arrives a week or two early."
  },
  {
    q: "How will I know the difference between my water breaking and losing my mucous plug?",
    a: "The mucous plug is a thick, gelatinous blob often tinged with pink or brown streaks. Water breaking (amniotic fluid) is clear or pale straw-colored, watery, and produces either a continuous warm trickle or a sudden gush that keeps dampening pads even when you sit or stand."
  }
];
