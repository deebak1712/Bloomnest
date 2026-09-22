import { Medicine, MedicineCategory } from "../types";

export interface IndianBrandInfo {
  brandName: string;
  genericName: string;
  category: MedicineCategory;
  defaultDosage: string;
  defaultFrequency: string;
  defaultTime: string;
  purpose: string;
  foodPairingTip: string;
  refillDaysLeft?: number;
}

export const INDIAN_PREGNANCY_BRANDS: IndianBrandInfo[] = [
  {
    brandName: "Shelcal-HD",
    genericName: "Calcium Carbonate (500mg) + Vitamin D3 (250 IU)",
    category: "calcium",
    defaultDosage: "1 Tablet (500mg)",
    defaultFrequency: "Daily after Lunch",
    defaultTime: "01:30 PM",
    purpose: "Supports fetal bone ossification, tooth bud development, and maternal bone density.",
    foodPairingTip: "Take after lunch with water. Keep at least a 2-hour gap away from Iron or tea/coffee.",
    refillDaysLeft: 28,
  },
  {
    brandName: "Shelcal 500",
    genericName: "Elemental Calcium (500mg) + Cholecalciferol (250 IU)",
    category: "calcium",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Daily after Lunch",
    defaultTime: "01:30 PM",
    purpose: "Bone mineral density support and preeclampsia risk reduction.",
    foodPairingTip: "Take after a balanced meal. Calcium reduces Iron absorption; separate them by at least 2 hours.",
    refillDaysLeft: 30,
  },
  {
    brandName: "Cipcal 500",
    genericName: "Calcium (500mg) + Vitamin D3 (250 IU)",
    category: "calcium",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Daily after Lunch",
    defaultTime: "01:30 PM",
    purpose: "Strengthens maternal bone reserves and baby's skeletal architecture.",
    foodPairingTip: "Take with plain water after lunch. Never take simultaneously with Iron supplements.",
    refillDaysLeft: 25,
  },
  {
    brandName: "Orofer-XT",
    genericName: "Ferrous Ascorbate (100mg) + Folic Acid (1.5mg)",
    category: "iron",
    defaultDosage: "1 Tablet (100mg)",
    defaultFrequency: "Daily post Dinner / Bedtime",
    defaultTime: "08:30 PM",
    purpose: "Prevents gestational iron deficiency anemia and boosts red blood cell oxygen transport.",
    foodPairingTip: "Best taken with fresh lime water or Vitamin C. Avoid milk, tea, coffee, and Calcium for 2 hours.",
    refillDaysLeft: 28,
  },
  {
    brandName: "Autrin",
    genericName: "Dried Ferrous Sulfate (100mg) + Cyanocobalamin + Folic Acid",
    category: "iron",
    defaultDosage: "1 Capsule",
    defaultFrequency: "Daily after Dinner",
    defaultTime: "08:30 PM",
    purpose: "Treats and prevents nutritional maternal anemia.",
    foodPairingTip: "Drink with orange juice or water. Avoid taking with dairy products or antacids.",
    refillDaysLeft: 21,
  },
  {
    brandName: "Feronia-XT",
    genericName: "Ferrous Ascorbate + Folic Acid + Zinc",
    category: "iron",
    defaultDosage: "1 Tablet",
    defaultFrequency: "Daily after Dinner",
    defaultTime: "08:30 PM",
    purpose: "Enhanced bioavailable iron delivery for fetal circulatory growth.",
    foodPairingTip: "Take with lemon water. Maintain at least a 2-hour interval from Calcium or milk.",
    refillDaysLeft: 30,
  },
  {
    brandName: "Folvite 5mg",
    genericName: "Folic Acid (Vitamin B9 5mg)",
    category: "folic_acid",
    defaultDosage: "1 Tablet (5mg)",
    defaultFrequency: "Daily after Breakfast",
    defaultTime: "08:30 AM",
    purpose: "Critical for neural tube closure, brain formation, and DNA synthesis.",
    foodPairingTip: "Take every morning with or without food. Safe to take alongside standard morning meals.",
    refillDaysLeft: 30,
  },
  {
    brandName: "Thyronorm 50mcg",
    genericName: "Levothyroxine Sodium (50mcg)",
    category: "thyroid",
    defaultDosage: "1 Tablet (50mcg)",
    defaultFrequency: "Early morning empty stomach",
    defaultTime: "06:30 AM",
    purpose: "Maintains optimal maternal TSH level (<2.5 mIU/L) for baby's neurological development.",
    foodPairingTip: "Take first thing on an empty stomach with plain water. Wait 45 mins before tea or breakfast.",
    refillDaysLeft: 45,
  },
  {
    brandName: "Susten 200",
    genericName: "Micronized Natural Progesterone (200mg)",
    category: "progesterone",
    defaultDosage: "1 Capsule (200mg)",
    defaultFrequency: "Nightly before Bedtime",
    defaultTime: "10:00 PM",
    purpose: "Uterine quiescence and luteal phase endocrine support.",
    foodPairingTip: "Take right before sleeping as it may induce mild soothing drowsiness.",
    refillDaysLeft: 14,
  },
  {
    brandName: "Doxinate",
    genericName: "Doxylamine Succinate (10mg) + Pyridoxine HCl Vit B6 (10mg)",
    category: "antiemetic",
    defaultDosage: "1-2 Tablets",
    defaultFrequency: "Bedtime or as needed for Nausea",
    defaultTime: "09:30 PM",
    purpose: "First-line clinical relief for pregnancy morning sickness and hyperemesis.",
    foodPairingTip: "Take with water. Helps ensure restful sleep and nausea-free mornings.",
    refillDaysLeft: 20,
  },
  {
    brandName: "Argipreg",
    genericName: "L-Arginine (3g) + Proanthocyanidins Sachet",
    category: "vitamin",
    defaultDosage: "1 Sachet in water",
    defaultFrequency: "Daily in the Afternoon",
    defaultTime: "04:00 PM",
    purpose: "Promotes placental perfusion, nitric oxide synthesis, and normal amniotic fluid index (AFI).",
    foodPairingTip: "Dissolve sachet in half glass of water and consume fresh.",
    refillDaysLeft: 15,
  },
];

/**
 * Resolve an Indian brand or generic medicine name to its clinical metadata
 */
export function resolveIndianBrand(inputName: string): IndianBrandInfo {
  const normalized = inputName.trim().toLowerCase();

  // Try direct or partial match in Indian Brand DB
  const found = INDIAN_PREGNANCY_BRANDS.find((brand) => {
    const bName = brand.brandName.toLowerCase();
    const gName = brand.genericName.toLowerCase();
    return normalized.includes(bName) || bName.includes(normalized) || normalized.includes(gName);
  });

  if (found) return found;

  // Fallback heuristics based on keywords
  if (normalized.includes("iron") || normalized.includes("ferr") || normalized.includes("ifa")) {
    return {
      brandName: inputName,
      genericName: "Elemental Iron / Ferrous Ascorbate",
      category: "iron",
      defaultDosage: "1 Tablet",
      defaultFrequency: "Daily after Dinner",
      defaultTime: "08:30 PM",
      purpose: "Treats/prevents gestational iron deficiency anemia.",
      foodPairingTip: "Take with Vitamin C / citrus. Avoid taking within 2 hours of calcium or dairy.",
      refillDaysLeft: 30,
    };
  }

  if (normalized.includes("calc") || normalized.includes("d3") || normalized.includes("shelcal")) {
    return {
      brandName: inputName,
      genericName: "Calcium Carbonate + Vitamin D3",
      category: "calcium",
      defaultDosage: "1 Tablet (500mg)",
      defaultFrequency: "Daily after Lunch",
      defaultTime: "01:30 PM",
      purpose: "Supports fetal skeleton and maternal bone density.",
      foodPairingTip: "Take with lunch. Do NOT take simultaneously with Iron supplements.",
      refillDaysLeft: 30,
    };
  }

  if (normalized.includes("folic") || normalized.includes("folate") || normalized.includes("b9")) {
    return {
      brandName: inputName,
      genericName: "Folic Acid (5mg)",
      category: "folic_acid",
      defaultDosage: "1 Tablet",
      defaultFrequency: "Daily after Breakfast",
      defaultTime: "08:30 AM",
      purpose: "Essential for neural tube formation and red blood cell health.",
      foodPairingTip: "Take after breakfast with water.",
      refillDaysLeft: 30,
    };
  }

  if (normalized.includes("thyro") || normalized.includes("eltroxin") || normalized.includes("levo")) {
    return {
      brandName: inputName,
      genericName: "Levothyroxine Sodium",
      category: "thyroid",
      defaultDosage: "1 Tablet",
      defaultFrequency: "Early morning fasting",
      defaultTime: "06:30 AM",
      purpose: "Thyroid hormone replacement for healthy fetal neurodevelopment.",
      foodPairingTip: "Take empty stomach. Wait 45 minutes before tea or eating.",
      refillDaysLeft: 30,
    };
  }

  if (normalized.includes("susten") || normalized.includes("progest") || normalized.includes("gestone")) {
    return {
      brandName: inputName,
      genericName: "Natural Micronized Progesterone",
      category: "progesterone",
      defaultDosage: "1 Capsule",
      defaultFrequency: "Daily at Bedtime",
      defaultTime: "10:00 PM",
      purpose: "Uterine muscle relaxation and luteal phase support.",
      foodPairingTip: "Take at bedtime with water.",
      refillDaysLeft: 20,
    };
  }

  // Default fallback
  return {
    brandName: inputName,
    genericName: inputName,
    category: "other",
    defaultDosage: "1 Dose",
    defaultFrequency: "As Prescribed by Doctor",
    defaultTime: "09:00 AM",
    purpose: "Doctor prescribed antenatal medication.",
    foodPairingTip: "Follow physician guidelines regarding meals.",
    refillDaysLeft: 30,
  };
}

/**
 * Parse time string (e.g. "01:30 PM", "8:00 AM", "14:00") into minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export interface IronCalciumConflict {
  hasConflict: boolean;
  ironMed?: Medicine;
  calciumMed?: Medicine;
  gapMinutes: number;
  message?: string;
  recommendedIronTime?: string;
  recommendedCalciumTime?: string;
}

/**
 * Checks if Iron and Calcium supplements are taken within 2 hours (< 120 mins) of each other.
 * Calcium competitively inhibits divalent metal transporter 1 (DMT1), severely blocking Iron absorption.
 */
export function checkIronCalciumConflict(meds: Medicine[]): IronCalciumConflict {
  const activeMeds = meds.filter((m) => m.isActive !== false);

  const ironMed = activeMeds.find(
    (m) =>
      m.category === "iron" ||
      m.name.toLowerCase().includes("iron") ||
      m.name.toLowerCase().includes("orofer") ||
      m.name.toLowerCase().includes("autrin") ||
      m.name.toLowerCase().includes("feronia")
  );

  const calciumMed = activeMeds.find(
    (m) =>
      m.category === "calcium" ||
      m.name.toLowerCase().includes("calcium") ||
      m.name.toLowerCase().includes("shelcal") ||
      m.name.toLowerCase().includes("cipcal")
  );

  if (!ironMed || !calciumMed) {
    return { hasConflict: false, gapMinutes: 999 };
  }

  const ironMins = timeToMinutes(ironMed.time);
  const calcMins = timeToMinutes(calciumMed.time);

  let diff = Math.abs(ironMins - calcMins);
  if (diff > 720) diff = 1440 - diff; // Wrap around 24 hours

  if (diff < 120) {
    return {
      hasConflict: true,
      ironMed,
      calciumMed,
      gapMinutes: diff,
      message: `Absorption Conflict Detected: ${calciumMed.name} (${calciumMed.time}) and ${ironMed.name} (${ironMed.time}) are scheduled only ${diff} minutes apart. Calcium strongly inhibits Iron absorption in the intestine. ICMR & ACOG guidelines require a minimum 2-hour gap between them.`,
      recommendedCalciumTime: "01:30 PM",
      recommendedIronTime: "08:30 PM",
    };
  }

  return {
    hasConflict: false,
    ironMed,
    calciumMed,
    gapMinutes: diff,
  };
}

/**
 * Sample Doctor Prescriptions for instant testing & demonstration
 */
export const SAMPLE_PRESCRIPTION_TEMPLATES = [
  {
    id: "sample-2nd-tri",
    title: "Apollo Cradle - 2nd Trimester Routine Slip",
    doctor: "Dr. Ananya Sharma, MD, DGO",
    hospital: "Apollo Cradle Maternity, Chennai",
    date: "2026-09-15",
    medicines: [
      {
        name: "Shelcal-HD",
        dosage: "1 Tablet (500mg)",
        time: "01:30 PM",
        frequency: "Daily after Lunch",
        notes: "Take post-lunch with water. Don't take with tea or milk.",
      },
      {
        name: "Orofer-XT",
        dosage: "1 Tablet (100mg)",
        time: "08:30 PM",
        frequency: "Daily post Dinner",
        notes: "Take with fresh lemon water for peak absorption. Keep 2h away from Calcium.",
      },
      {
        name: "Folvite 5mg",
        dosage: "1 Tablet (5mg)",
        time: "08:30 AM",
        frequency: "Daily post Breakfast",
        notes: "Daily maternal folate supplement.",
      },
    ],
  },
  {
    id: "sample-1st-tri",
    title: "Cloudnine - 1st Trimester Early Pregnancy Support",
    doctor: "Dr. Priya Sundaram, MS (OB-GYN)",
    hospital: "Cloudnine Hospital, Old Airport Road",
    date: "2026-09-10",
    medicines: [
      {
        name: "Folvite 5mg",
        dosage: "1 Tablet (5mg)",
        time: "08:30 AM",
        frequency: "Daily after Breakfast",
        notes: "Essential for neural tube closure.",
      },
      {
        name: "Susten 200",
        dosage: "1 Capsule (200mg)",
        time: "10:00 PM",
        frequency: "Daily at Bedtime",
        notes: "Progesterone luteal support. Take right before sleep.",
      },
      {
        name: "Doxinate",
        dosage: "1 Tablet",
        time: "09:30 PM",
        frequency: "Nightly before Bedtime",
        notes: "For morning sickness and nausea prevention.",
      },
    ],
  },
  {
    id: "sample-thyroid-risk",
    title: "Fortis La Femme - High-Risk Anemia & Thyroid Regimen",
    doctor: "Dr. R. Meenakshi, MBBS, DGO, DNB",
    hospital: "Fortis La Femme Centre for Women",
    date: "2026-09-18",
    medicines: [
      {
        name: "Thyronorm 50mcg",
        dosage: "1 Tablet (50mcg)",
        time: "06:30 AM",
        frequency: "Early morning fasting",
        notes: "Take on empty stomach with plain water. Wait 45 mins before tea/food.",
      },
      {
        name: "Shelcal 500",
        dosage: "1 Tablet",
        time: "01:30 PM",
        frequency: "Daily after Lunch",
        notes: "Bone density support.",
      },
      {
        name: "Autrin",
        dosage: "1 Capsule",
        time: "08:30 PM",
        frequency: "Daily after Dinner",
        notes: "Therapeutic elemental iron for mild anemia.",
      },
    ],
  },
];
