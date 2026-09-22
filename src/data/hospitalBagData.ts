import { HospitalBagItem, HospitalBagSection } from "../types";

export const LOCAL_STORAGE_KEY_HOSPITAL_BAG = "bloomnest_hospital_bag_v2";

export interface HospitalBagSectionMeta {
  id: HospitalBagSection;
  name: string;
  shortName: string;
  subtitle: string;
  iconName: string;
  colorGradient: string;
  borderColor: string;
  bgLight: string;
  description: string;
}

export const HOSPITAL_BAG_SECTIONS: HospitalBagSectionMeta[] = [
  {
    id: "labor_delivery",
    name: "Bag 1: Labor & Delivery Room",
    shortName: "Labor Room",
    subtitle: "Immediate L&D Suite Essentials (Take into Birthing Room)",
    iconName: "Sparkles",
    colorGradient: "from-rose-500 to-pink-600",
    borderColor: "border-rose-200 dark:border-rose-900/40",
    bgLight: "bg-rose-50/50 dark:bg-rose-950/20",
    description: "Compact bag brought directly into the labor suite during active contractions and delivery."
  },
  {
    id: "mother_recovery",
    name: "Bag 2: Postpartum Mother Recovery",
    shortName: "Mother Recovery",
    subtitle: "Ward Stay Care (2–4 Days in Hospital Room)",
    iconName: "Heart",
    colorGradient: "from-purple-500 to-violet-600",
    borderColor: "border-purple-200 dark:border-purple-900/40",
    bgLight: "bg-purple-50/50 dark:bg-purple-950/20",
    description: "Stays in room or vehicle until after delivery; clothing, feeding essentials, and lochia recovery."
  },
  {
    id: "baby_essentials",
    name: "Bag 3: Newborn Baby Sanctuary",
    shortName: "Baby Sanctuary",
    subtitle: "Baby Clothing & Nursery Care",
    iconName: "Baby",
    colorGradient: "from-blue-500 to-cyan-600",
    borderColor: "border-blue-200 dark:border-blue-900/40",
    bgLight: "bg-blue-50/50 dark:bg-blue-950/20",
    description: "Pre-washed 100% cotton newborn apparel, swaddles, diapers, and safe discharge transport."
  },
  {
    id: "partner_support",
    name: "Bag 4: Birth Partner & Documents Kit",
    shortName: "Partner & ID",
    subtitle: "Support Partner & Medical Paperwork",
    iconName: "Users",
    colorGradient: "from-amber-500 to-orange-600",
    borderColor: "border-amber-200 dark:border-amber-900/40",
    bgLight: "bg-amber-50/50 dark:bg-amber-950/20",
    description: "Aadhaar, TPA card, hospital booking slip, chargers, power bank, snacks, and partner clothing."
  },
  {
    id: "last_minute",
    name: "⚡ 10-Min Door Departure Pouch",
    shortName: "Last-Minute Pouch",
    subtitle: "Last-Minute Grab-and-Go Essentials",
    iconName: "Flame",
    colorGradient: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-200 dark:border-emerald-900/40",
    bgLight: "bg-emerald-50/50 dark:bg-emerald-950/20",
    description: "Critical daily items that cannot be packed in advance until the minute you leave home."
  }
];

export const INITIAL_CLINICAL_HOSPITAL_BAG: HospitalBagItem[] = [
  // ── Bag 1: Labor & Delivery Room ──
  {
    id: 101,
    category: "mother",
    bagSection: "labor_delivery",
    item: "Cotton Front-Open Labor Nighty / Gown",
    quantity: 2,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Provides immediate access for wireless fetal telemetry monitoring belts, IV lines, and instant golden hour skin-to-skin."
  },
  {
    id: 102,
    category: "mother",
    bagSection: "labor_delivery",
    item: "Warm Non-Skid Grip Socks & Easy Slip-On Slippers",
    quantity: 2,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Hospital tiled floors are freezing and slippery. Non-skid grips keep feet warm and safe during active labor pacing."
  },
  {
    id: 103,
    category: "essentials",
    bagSection: "labor_delivery",
    item: "10-Foot Extra-Long Braided Phone Charging Cable",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Hospital wall sockets are frequently located 8+ feet away behind medical equipment panels."
  },
  {
    id: 104,
    category: "essentials",
    bagSection: "labor_delivery",
    item: "High-Capacity 20,000mAh Power Bank (Fully Charged)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Keeps contraction timer and communication active without being tethered to a wall socket."
  },
  {
    id: 105,
    category: "mother",
    bagSection: "labor_delivery",
    item: "Organic Lip Balm & Cold-Pressed Almond Massage Oil",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Continuous hospital air conditioning and mouth breathing during contractions cause extreme lip chapping. Oil aids partner sacral counter-pressure."
  },
  {
    id: 106,
    category: "mother",
    bagSection: "labor_delivery",
    item: "Soft Cotton Hair Ties, Scrunchies & Headband",
    quantity: 3,
    isPacked: true,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Keeps hair off neck and face during intense perspiration and labor surges."
  },
  {
    id: 107,
    category: "essentials",
    bagSection: "labor_delivery",
    item: "Wooden Acupressure Comb / Squeeze Stress Ball",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "vaginal",
    clinicalReason: "Grip comb teeth against palm creases during contractions to trigger the 'Gate Control Theory' of pain relief."
  },
  {
    id: 108,
    category: "essentials",
    bagSection: "labor_delivery",
    item: "Portable Mini Bluetooth Speaker / Earphones",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Plays relaxing 432Hz binaural soundscapes or Garbha Sanskar mantras to keep labor room calm."
  },
  {
    id: 109,
    category: "documents",
    bagSection: "labor_delivery",
    item: "Printed Birth Plan Copies (2 Copies: Clipboard & Head Nurse)",
    quantity: 2,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Communicates upright pushing, delayed cord clamping, and restrictive episiotomy preferences to the shift nursing team."
  },
  {
    id: 110,
    category: "essentials",
    bagSection: "labor_delivery",
    item: "Insulated Water Flask with Bendable Silicone Straw",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Allows mom to sip water or electrolyte fluids while lying down or leaning forward without spilling."
  },

  // ── Bag 2: Postpartum Mother Recovery ──
  {
    id: 201,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Front-Opening Feeding Kurtis / Nursing Nighties",
    quantity: 4,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Breathable cotton garments with hidden side or front zippers allow effortless round-the-clock newborn latching."
  },
  {
    id: 202,
    category: "mother",
    bagSection: "mother_recovery",
    item: "High-Waisted Cotton Briefs / Disposable Mesh Underwear",
    quantity: 8,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "High-waist waistband sits well above a low-transverse Pfannenstiel cesarean incision and accommodates bulky lochia pads."
  },
  {
    id: 203,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Heavy Maternity Sanitary Pads for Lochia (2 Packs / 20+ Pads)",
    quantity: 24,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Postpartum lochia rubra is significantly heavier than normal menstrual bleeding during the first 3 days."
  },
  {
    id: 204,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Wire-Free Seamless Nursing Bras",
    quantity: 3,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Underwires can clog milk ducts. Seamless wire-free cups adapt to breast engorgement as mature milk comes in."
  },
  {
    id: 205,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Washable Organic Bamboo Breast Pads",
    quantity: 6,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Absorbs colostrum and milk leaks, keeping nursing bras dry and preventing nipple irritation."
  },
  {
    id: 206,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Ergonomic Upside-Down Peri Wash Bottle",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "vaginal",
    clinicalReason: "Allows soothing warm water cleansing of the perineum while urinating, preventing stinging over perineal tears or stitches."
  },
  {
    id: 207,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Witch Hazel Perineal Cooling Pads / Herbal Spray",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "vaginal",
    clinicalReason: "Natural anti-inflammatory that significantly reduces perineal swelling, soreness, and hemorrhoids post-birth."
  },
  {
    id: 208,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Postpartum Abdominal Support Binder / Post-Surgical Belt",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "c_section",
    clinicalReason: "Stabilizes abdominal wall muscles, splints the surgical incision when walking, and reduces post-op incisional pain."
  },
  {
    id: 209,
    category: "mother",
    bagSection: "mother_recovery",
    item: "100% Ultra-Pure Medical Grade Lanolin / Organic Nipple Balm",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Soothes sensitive, tender nipples during initial cluster feeding. Safe for baby; no need to wash off before feeds."
  },
  {
    id: 210,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Personal Toiletries Kit (Toothbrush, Mild Body Wash, Dry Shampoo, Towel)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Hospital toiletries are often generic and heavily perfumed. Use unscented soaps so baby bonds with your natural maternal pheromones."
  },
  {
    id: 211,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Comfortable Going-Home Maternity Outfit (6-Month Bump Size)",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "The uterus takes 6 weeks to involute. Pack clothes that fit around your 5-to-6 month pregnancy stage."
  },
  {
    id: 212,
    category: "mother",
    bagSection: "mother_recovery",
    item: "Warm Cardigan / Knit Shawl (Hospital Ward AC)",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Hospital maternity private rooms and postnatal wards are kept chilly; keeps mom warm during midnight feeds."
  },

  // ── Bag 3: Newborn Baby Sanctuary ──
  {
    id: 301,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Pre-Washed 100% Muslin Cotton Front-Tie Jhablas",
    quantity: 6,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Indian traditional jhablas have front tie-strings (no metal snaps or harsh zippers) that sit gently above the healing umbilical cord stump."
  },
  {
    id: 302,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Soft Muslin Cotton Swaddle Blankets / Thottil Cloths",
    quantity: 5,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Recreates the snug uterine environment, reduces Moro startle reflex, and promotes restful neonatal sleep."
  },
  {
    id: 303,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Soft Newborn Knotted Caps / Beanies",
    quantity: 3,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Newborns lose up to 30% of their body heat through their scalp. Essential for thermoregulation in air-conditioned hospital wards."
  },
  {
    id: 304,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Gentle Cotton Baby Mittens & Booties / Socks",
    quantity: 4,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Newborns are born with sharp paper-thin nails and lack motor control; mittens prevent accidental facial scratching."
  },
  {
    id: 305,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Hypoallergenic Newborn Diapers (Size 0 / NB Pack)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Newborns typically void 6-10 times a day once feeding is established. Pack at least 1 pack of 24 diapers."
  },
  {
    id: 306,
    category: "baby",
    bagSection: "baby_essentials",
    item: "99% Pure Water Newborn Wipes & Organic Cotton Balls",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Fragrance-free and chemical-free wipes protect immature newborn stratum corneum barrier."
  },
  {
    id: 307,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Pediatrician-Approved Diaper Rash Balm / Cold-Pressed Virgin Coconut Oil",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Coconut oil forms a natural lipid barrier that makes sticky newborn meconium stools easy to wipe off without chafing."
  },
  {
    id: 308,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Soft Hooded Muslin Newborn Bath Towel",
    quantity: 2,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Gentle for sponging baby after initial 24-hour vernix absorption window."
  },
  {
    id: 309,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Going-Home Baby Sleepsuit & Warm Receiving Blanket",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Pre-washed comfortable outfit with enclosed feet for baby's memorable discharge journey home."
  },
  {
    id: 310,
    category: "baby",
    bagSection: "baby_essentials",
    item: "Rear-Facing Infant Car Seat Safely Anchored in Car",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Mandatory for safe vehicular transit home. Holding a newborn in lap during a car journey carries severe deceleration trauma risk."
  },

  // ── Bag 4: Birth Partner & Documents Kit ──
  {
    id: 401,
    category: "documents",
    bagSection: "partner_support",
    item: "Waterproof Transparent Document Docket (Aadhaar, TPA, MCP, Doctor Slips)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Allows triage registration desk to access insurance pre-auth and blood group without opening multiple bags."
  },
  {
    id: 402,
    category: "partner",
    bagSection: "partner_support",
    item: "Partner Change of Comfortable Clothes (2 T-Shirts, Track Pants & Hoodie)",
    quantity: 2,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Labor can extend past 24 hours. A warm hoodie and fresh change of clothes keep the partner rested and alert."
  },
  {
    id: 403,
    category: "partner",
    bagSection: "partner_support",
    item: "Partner Toiletries Kit (Toothbrush, Mints, Deodorizing Wipes)",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Fresh breath and hygiene are critical when coaching close face-to-face somatic breathing."
  },
  {
    id: 404,
    category: "partner",
    bagSection: "partner_support",
    item: "High-Protein Energy Snacks (Makhana, Almonds, Walnuts, Dark Chocolate)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Hospital canteens often close between 11 PM and 6 AM. Sustains partner stamina during nocturnal labor surges."
  },
  {
    id: 405,
    category: "partner",
    bagSection: "partner_support",
    item: "Electrolyte Drink Powder Sachets & Insulated Flask",
    quantity: 6,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Maintains optimal hydration for both mother and partner throughout the labor ordeal."
  },
  {
    id: 406,
    category: "partner",
    bagSection: "partner_support",
    item: "Cash in Small Denominations (₹100 / ₹500 Notes)",
    quantity: 1,
    isPacked: true,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "For hospital night pharmacy, late-night tea/water vending, and emergency valet or ambulance tips."
  },
  {
    id: 407,
    category: "partner",
    bagSection: "partner_support",
    item: "Pocket Notebook & Pen (for Feeding Intervals & Pediatrician Notes)",
    quantity: 1,
    isPacked: false,
    isEssential: false,
    deliveryType: "all",
    clinicalReason: "Tracks exact timestamps of baby's first meconium stool, wet diapers, and consultant pediatrician instructions."
  },

  // ── ⚡ 10-Min Door Departure Pouch ──
  {
    id: 501,
    category: "medicine",
    bagSection: "last_minute",
    item: "Daily Prescribed Medications (Thyroid, Iron, Calcium, Anticoagulant)",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Cannot be packed days ahead. Slip active daily blister packs into the door pouch right before stepping into the car."
  },
  {
    id: 502,
    category: "essentials",
    bagSection: "last_minute",
    item: "Mobile Phones & Fast-Charging Wall Bricks",
    quantity: 2,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Crucial for family updates, hospital coordination, and capturing first newborn golden hour moments."
  },
  {
    id: 503,
    category: "essentials",
    bagSection: "last_minute",
    item: "Prescription Eyeglasses & Spare Contact Lens Case",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Contact lenses should be removed before entering the labor room / OR; eyeglasses provide clarity and comfort."
  },
  {
    id: 504,
    category: "essentials",
    bagSection: "last_minute",
    item: "Vehicle Car Keys & House Keys",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "Ensure backup keys are left with trusted family member."
  },
  {
    id: 505,
    category: "documents",
    bagSection: "last_minute",
    item: "Wallet / Purse with Debit Cards & UPI Phone",
    quantity: 1,
    isPacked: false,
    isEssential: true,
    deliveryType: "all",
    clinicalReason: "For cashless admission security deposit and hospital pharmacy billing."
  }
];
