import { UserProfile, EmergencyContact } from "../types";

export interface NationalHelpline {
  number: string;
  name: string;
  subtext: string;
  badge: string;
  iconType: "ambulance" | "phone" | "shield" | "heart";
  colorClass: string;
}

export const NATIONAL_MATERNAL_HELPLINES: NationalHelpline[] = [
  {
    number: "108",
    name: "National Emergency Ambulance",
    subtext: "24/7 Free Obstetric & Critical Trauma Transit",
    badge: "Government 24/7",
    iconType: "ambulance",
    colorClass: "bg-red-600 text-white hover:bg-red-700",
  },
  {
    number: "102",
    name: "Maternal & Infant Ambulance (JSSK)",
    subtext: "Free Janani Shishu Suraksha Maternal Transit",
    badge: "Maternal Free",
    iconType: "ambulance",
    colorClass: "bg-rose-600 text-white hover:bg-rose-700",
  },
  {
    number: "112",
    name: "Unified National Emergency Service",
    subtext: "Police, Fire, and Medical Dispatch (All India)",
    badge: "All-in-One",
    iconType: "shield",
    colorClass: "bg-amber-600 text-white hover:bg-amber-700",
  },
  {
    number: "14416",
    name: "Tele-MANAS Perinatal Support",
    subtext: "Govt of India 24/7 Perinatal Mental & Emotional Triage",
    badge: "Mental Health",
    iconType: "heart",
    colorClass: "bg-purple-600 text-white hover:bg-purple-700",
  },
  {
    number: "1091",
    name: "Women in Distress Helpline",
    subtext: "National Emergency Protection & Safety",
    badge: "Women Safety",
    iconType: "phone",
    colorClass: "bg-slate-700 text-white hover:bg-slate-800",
  },
];

export interface LaborDrillItem {
  id: string;
  label: string;
  description: string;
  category: "vehicle" | "bag" | "contacts" | "home";
}

export const LABOR_DEPARTURE_DRILL: LaborDrillItem[] = [
  {
    id: "drill-bag",
    label: "Hospital Go-Bag & Documents Ready",
    description: "Packed bag, Aadhaar/ID, Insurance card & ultrasound scan file kept near front door.",
    category: "bag",
  },
  {
    id: "drill-car",
    label: "Vehicle Ready & Fuel Checked",
    description: "Car keys in designated spot, tank above half, towels & waterproof sheet on passenger seat.",
    category: "vehicle",
  },
  {
    id: "drill-route",
    label: "Primary & Alternate Hospital Route Mapped",
    description: "Know the route to Labor Casualty, parking entrance, and 24/7 emergency ramp.",
    category: "vehicle",
  },
  {
    id: "drill-phone",
    label: "OB-GYN & Labor Ward in Partner's Speed Dial",
    description: "Partner phone charged, hospital labor room triage number saved.",
    category: "contacts",
  },
  {
    id: "drill-childcare",
    label: "Older Child / Pet Caregiver Confirmed",
    description: "Neighbor or relative briefed and available on short notice.",
    category: "home",
  },
];

/**
 * Builds a clear, concise maternal emergency broadcast message.
 */
export function buildEmergencySosMessage(
  user: UserProfile,
  locationCoords?: { lat: number; lng: number } | null,
  customNote?: string
): string {
  const parts: string[] = [];

  parts.push("🚨 MATERNAL EMERGENCY SOS 🚨");
  parts.push(`PATIENT: ${user.fullName} (${user.age || 28}y)`);
  parts.push(`GESTATION: Week ${user.currentWeek} | Due Date: ${user.edd || "N/A"}`);
  if (user.bloodGroup) {
    parts.push(`BLOOD GROUP: ${user.bloodGroup}`);
  }
  if (user.doctorName) {
    parts.push(`TREATING OB-GYN: ${user.doctorName}`);
  }
  if (user.hospitalName) {
    parts.push(`DELIVERY HOSPITAL: ${user.hospitalName}`);
  }

  if (locationCoords) {
    parts.push(`📍 LIVE GPS LOCATION: https://maps.google.com/?q=${locationCoords.lat},${locationCoords.lng}`);
  }

  if (customNote) {
    parts.push(`STATUS: ${customNote}`);
  } else {
    parts.push("STATUS: Urgent labor onset / pregnancy emergency. Immediate assistance or transport required.");
  }

  parts.push("⚠️ FIRST RESPONDERS: Maintain Left Lateral Tilt (LUD) to prevent IVC compression.");

  return parts.join("\n");
}

export function generateWhatsAppSosUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : `https://wa.me/?text=${encodedMsg}`;
}

export function generateSmsSosUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  // Works on both iOS and Android
  return `sms:${cleanPhone}?body=${encodedMsg}`;
}
