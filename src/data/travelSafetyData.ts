import { TravelRelocationProfile } from "../types";

export interface AirlinePolicy {
  id: string;
  name: string;
  country: "India" | "International";
  maxWeeksSingle: number;
  maxWeeksMultiple: number;
  certificateRequiredFromWeek: number;
  certificateValidityWindow: string; // e.g. "Within 7 days of travel"
  formName: string;
  summary: string;
  specialRules: string[];
}

export const AIRLINE_REGULATIONS_DATABASE: AirlinePolicy[] = [
  {
    id: "indigo",
    name: "IndiGo Airlines (6E)",
    country: "India",
    maxWeeksSingle: 36,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 28,
    certificateValidityWindow: "Issued within 7 days of travel departure",
    formName: "Standard Fit-to-Fly Certificate from Registered Medical Practitioner",
    summary: "Travel permitted up to 36 weeks for uncomplicated single pregnancies. Fit-to-fly certificate required from 28 to 36 weeks.",
    specialRules: [
      "Certificate must state: Gestational age, single/multiple pregnancy, expected delivery date, and fitness to fly.",
      "Beyond 36 weeks: Strictly not permitted under DGCA regulations.",
      "Multiple pregnancy (twins): Cut-off is end of 32nd week.",
    ],
  },
  {
    id: "air_india",
    name: "Air India (AI)",
    country: "India",
    maxWeeksSingle: 35,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 28,
    certificateValidityWindow: "Issued within 48 to 72 hours of travel departure",
    formName: "MEDA Form + Treating Obstetrician Certificate",
    summary: "Air India permits travel up to 32 weeks with general doctor clearance; weeks 32–35 require Air India Medical Dept (MEDA) clearance.",
    specialRules: [
      "Weeks 32 to 35: Requires MEDA clearance submitted at least 48 hours prior to flight.",
      "Weeks 36 and above: Air travel is strictly barred.",
      "Aisle seat near restroom recommended by airline medical team.",
    ],
  },
  {
    id: "akasa",
    name: "Akasa Air (QP)",
    country: "India",
    maxWeeksSingle: 36,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 28,
    certificateValidityWindow: "Issued within 72 hours of scheduled departure",
    formName: "Medical Certificate of Fitness to Fly",
    summary: "Accepts expectant mothers up to 36 weeks with doctor certification issued within 72 hours.",
    specialRules: [
      "Doctor certificate must specify expected date of confinement (EDC).",
      "Must state that the pregnancy is uncomplicated without preterm labor symptoms.",
      "Infant travel accepted from 7 days of age post-delivery.",
    ],
  },
  {
    id: "spicejet",
    name: "SpiceJet (SG)",
    country: "India",
    maxWeeksSingle: 35,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 28,
    certificateValidityWindow: "Issued within 7 days of travel",
    formName: "Obstetrician Fitness Certificate",
    summary: "Travel permitted up to 35 weeks for single pregnancies; multiple pregnancy permitted up to 32 weeks.",
    specialRules: [
      "Certificate must confirm mother is free from pregnancy complications.",
      "Indemnity form must be signed at the check-in airport counter.",
      "Strict cut-off at 35 weeks 6 days.",
    ],
  },
  {
    id: "emirates",
    name: "Emirates (EK)",
    country: "International",
    maxWeeksSingle: 36,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 29,
    certificateValidityWindow: "Issued within 10 days of travel departure",
    formName: "Emirates MEDIF / Standard Obstetrician Certificate",
    summary: "No medical certificate required before 28 weeks. Weeks 29–36 (single) require signed medical clearance; 36+ weeks barred.",
    specialRules: [
      "Twins / Multiples: Cut-off at end of 32nd week.",
      "MEDIF form required if any history of preeclampsia, diabetes, or bleeding.",
      "Doctor's license number, phone, and clinic stamp must be clearly visible.",
    ],
  },
  {
    id: "singapore_airlines",
    name: "Singapore Airlines (SQ)",
    country: "International",
    maxWeeksSingle: 36,
    maxWeeksMultiple: 32,
    certificateRequiredFromWeek: 29,
    certificateValidityWindow: "Issued within 10 days of the flight",
    formName: "Doctor Medical Clearance Letter",
    summary: "Fly up to 36 weeks for uncomplicated single pregnancy, 32 weeks for multiple pregnancy.",
    specialRules: [
      "Doctor letter must state gestational age and due date.",
      "Check-in staff will review document at departure airport.",
      "Return journey must also fall within the allowed gestational limits.",
    ],
  },
];

export interface DvtExercise {
  id: string;
  name: string;
  reps: string;
  benefit: string;
  instructions: string;
}

export const DVT_CIRCULATION_EXERCISES: DvtExercise[] = [
  {
    id: "ankle_pumps",
    name: "Calf Muscle Pump (Heel-Toe Raises)",
    reps: "20 reps every hour",
    benefit: "Activates the calf muscle pump, forcing venous blood back toward the heart.",
    instructions: "While seated, alternate lifting your heels high off the floor, then lifting your toes upward with heels grounded.",
  },
  {
    id: "ankle_circles",
    name: "Rotational Ankle Circles",
    reps: "10 clockwise + 10 anti-clockwise per foot",
    benefit: "Relieves dependent pedal edema (foot swelling) and stimulates micro-circulation.",
    instructions: "Lift one foot slightly off the floor. Slowly draw full circles with your big toe, first clockwise then counter-clockwise.",
  },
  {
    id: "knee_lifts",
    name: "Seated Knee-to-Chest Lifts",
    reps: "10 per leg every 2 hours",
    benefit: "Prevents femoral vein stasis caused by prolonged 90-degree hip flexion.",
    instructions: "Gently lift one knee toward your chest using your hands for soft support, hold for 3 seconds, then lower smoothly.",
  },
  {
    id: "glute_squeeze",
    name: "Isometric Gluteal & Pelvic Contractions",
    reps: "15 reps with 3-sec holds",
    benefit: "Improves pelvic venous return and reduces sacroiliac aching.",
    instructions: "Squeeze your buttocks firmly together, hold for 3 slow seconds, then release completely. Breathe smoothly without holding your breath.",
  },
];

export interface DossierItem {
  id: string;
  title: string;
  category: "Scans" | "Blood Tests" | "Records" | "Doctor Letter";
  required: boolean;
  description: string;
}

export const MATERNAL_RELOCATION_DOSSIER: DossierItem[] = [
  {
    id: "anomaly_scan",
    title: "18-22 Week Level-II TIFFA / Anomaly Scan Report",
    category: "Scans",
    required: true,
    description: "Detailed fetal anatomy evaluation, placental insertion point, and cervical length measurement.",
  },
  {
    id: "growth_scan",
    title: "Latest Growth & Fetal Doppler Ultrasound",
    category: "Scans",
    required: true,
    description: "Estimated fetal weight (EFW), amniotic fluid index (AFI), and umbilical artery Doppler PI/RI.",
  },
  {
    id: "blood_rh_card",
    title: "Blood Group & Rh Antibody Screening Record",
    category: "Blood Tests",
    required: true,
    description: "ABO blood typing, Indirect Coombs Test (ICT), and Anti-D administration dates if Rh-negative.",
  },
  {
    id: "ogtt_report",
    title: "75g Oral Glucose Tolerance Test (OGTT) Curve",
    category: "Blood Tests",
    required: true,
    description: "Fasting, 1-hour, and 2-hour gestational diabetes screening values.",
  },
  {
    id: "vaccine_card",
    title: "Maternal Vaccination Card (Tdap, TT-1, TT-2)",
    category: "Records",
    required: true,
    description: "Documented dates of Tdap (whooping cough protection) and Tetanus Toxoid doses.",
  },
  {
    id: "doctor_transfer_letter",
    title: "Treating OB-GYN Transfer Summary Letter",
    category: "Doctor Letter",
    required: true,
    description: "Clinical handover note documenting antenatal course, high-risk factors, daily medications, and labor plan.",
  },
  {
    id: "emergency_pass",
    title: "BloomNest Digital Emergency Medical ID Pass",
    category: "Records",
    required: false,
    description: "Offline scannable QR card with blood group, allergies, and emergency speed-dials.",
  },
];

export const INITIAL_DEFAULT_TRAVEL_PROFILE: TravelRelocationProfile = {
  destinationCity: "Bengaluru",
  destinationHospital: "Manipal Hospital, HAL Airport Road, Bengaluru",
  destinationHospitalAddress: "98 HAL Airport Road, Kodihalli, Bengaluru, Karnataka 560017",
  destinationDoctorName: "Dr. Ananya Sharma, MD (OB-GYN)",
  destinationDoctorPhone: "+91 98765 43210",
  travelDate: "2026-10-15",
  travelMode: "flight",
  airlineName: "indigo",
  medicalDossierHandoverReady: false,
  fitToFlyIssued: false,
  travelNotes: "Relocating for delivery. Family support in hometown. Level-III NICU facility confirmed.",
  lastUpdated: new Date().toISOString(),
};

export const LOCAL_STORAGE_KEY_TRAVEL_PROFILE = "bloomnest_travel_relocation_profile_v1";
