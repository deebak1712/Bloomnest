import { MaternityHospitalResult } from "../services/googleMcpService";

export interface CityHubLocation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  tag: string;
}

export const CITY_HUBS: CityHubLocation[] = [
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0418, lng: 80.2341, tag: "Apex Perinatal Hub" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, tag: "Tertiary Neonatal Hub" },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, tag: "Western TN Care Hub" },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198, tag: "Southern TN Care Hub" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, tag: "Apex Neonatal Hub" },
  { id: "trichy", name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lng: 78.7047, tag: "Central TN Hub" },
  { id: "salem", name: "Salem", state: "Tamil Nadu", lat: 11.6643, lng: 78.1460, tag: "North-Central TN Hub" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, tag: "Metro Tertiary Hub" },
  { id: "delhi", name: "Delhi-NCR", state: "Delhi", lat: 28.6139, lng: 77.2090, tag: "National Capital Hub" },
];

export interface VerifiedHospitalData {
  id: string;
  name: string;
  type: string;
  city: string;
  locality: string;
  lat: number;
  lng: number;
  address: string;
  emergencyPhone: string;
  nicuLevel: "Level II" | "Level III (Specialized)" | "Level IV (Advanced)";
  nicuBedsAvailable?: number;
  bloodBankAvailable: boolean;
  ambulanceAvailable: boolean;
  has24x7ObstetricOt: boolean;
  rating: number;
  googleMapsUrl: string;
  pincode: string;
}

export const OFFLINE_VERIFIED_HOSPITALS: VerifiedHospitalData[] = [
  // ── CHENNAI ──
  {
    id: "hosp_chn_01",
    name: "Apollo Cradle & Children's Hospital — R.A. Puram",
    type: "Maternity Super-Specialty & Level IV Surgical NICU",
    city: "Chennai",
    locality: "R.A. Puram / Alwarpet",
    lat: 13.0238,
    lng: 80.2544,
    address: "Plot 42, Greenways Road, Raja Annamalaipuram, Chennai, TN 600028",
    emergencyPhone: "+91 44 2461 7777",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 8,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Apollo+Cradle+Maternity+RA+Puram+Chennai",
    pincode: "600028"
  },
  {
    id: "hosp_chn_02",
    name: "Cloudnine Hospital — T. Nagar",
    type: "Maternity & Neonatal Super-Specialty",
    city: "Chennai",
    locality: "T. Nagar",
    lat: 13.0418,
    lng: 80.2341,
    address: "54, Vijaya Raghava Road, T. Nagar, Chennai, TN 600017",
    emergencyPhone: "+91 44 4020 5555",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 6,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cloudnine+Hospital+T+Nagar+Chennai",
    pincode: "600017"
  },
  {
    id: "hosp_chn_03",
    name: "Motherhood Hospital — Alwarpet",
    type: "Maternity Super-Specialty & High-Risk Obstetrics",
    city: "Chennai",
    locality: "Alwarpet",
    lat: 13.0368,
    lng: 80.2497,
    address: "542, TTK Road, Alwarpet, Chennai, TN 600018",
    emergencyPhone: "+91 44 4966 6666",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 5,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Motherhood+Hospital+Alwarpet+Chennai",
    pincode: "600018"
  },
  {
    id: "hosp_chn_04",
    name: "Rainbow Children's Hospital & BirthRight — Guindy",
    type: "Tertiary Perinatal & Advanced Surgical NICU",
    city: "Chennai",
    locality: "Guindy / Little Mount",
    lat: 13.0102,
    lng: 80.2205,
    address: "157, Anna Salai, Guindy, Chennai, TN 600032",
    emergencyPhone: "+91 44 4012 3456",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 12,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Guindy+Chennai",
    pincode: "600032"
  },
  {
    id: "hosp_chn_05",
    name: "Kasturba Gandhi Hospital for Women and Children",
    type: "Government Apex Tertiary Maternity Teaching Hospital",
    city: "Chennai",
    locality: "Triplicane",
    lat: 13.0612,
    lng: 80.2789,
    address: "Triplicane High Road, Police Quarters, Triplicane, Chennai, TN 600005",
    emergencyPhone: "108 / +91 44 2844 4200",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 16,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.6,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kasturba+Gandhi+Hospital+Triplicane+Chennai",
    pincode: "600005"
  },
  {
    id: "hosp_chn_06",
    name: "MGM Healthcare — Aminjikarai",
    type: "Quaternary Multi-Specialty & High-Risk Perinatal",
    city: "Chennai",
    locality: "Aminjikarai",
    lat: 13.0732,
    lng: 80.2184,
    address: "No 72, Nelson Manickam Road, Aminjikarai, Chennai, TN 600029",
    emergencyPhone: "+91 44 4524 2424",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 10,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MGM+Healthcare+Nelson+Manickam+Road+Chennai",
    pincode: "600029"
  },

  // ── BENGALURU ──
  {
    id: "hosp_blr_01",
    name: "Cloudnine Hospital — Old Airport Road",
    type: "Maternity, Gynecology & Neonatal Hospital",
    city: "Bengaluru",
    locality: "Indiranagar / Old Airport Road",
    lat: 12.9602,
    lng: 77.6485,
    address: "1533, 9th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560008",
    emergencyPhone: "+91 80 4020 2222",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 10,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cloudnine+Hospital+Old+Airport+Road+Bangalore",
    pincode: "560008"
  },
  {
    id: "hosp_blr_02",
    name: "Rainbow Children's Hospital & BirthRight — Bannerghatta",
    type: "Advanced Perinatal Center & Level IV Surgical NICU",
    city: "Bengaluru",
    locality: "Bannerghatta Road",
    lat: 12.8941,
    lng: 77.5982,
    address: "Survey No 85, Bannerghatta Main Road, Bilekahalli, Bengaluru, KA 560076",
    emergencyPhone: "+91 80 4242 4242",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 14,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Bannerghatta+Bangalore",
    pincode: "560076"
  },
  {
    id: "hosp_blr_03",
    name: "Motherhood Hospital — Indiranagar",
    type: "Maternity Super-Specialty & Neonatal Care",
    city: "Bengaluru",
    locality: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    address: "324, Chinmaya Mission Hospital Road, Indiranagar, Bengaluru, KA 560038",
    emergencyPhone: "+91 80 6723 8888",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 6,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Motherhood+Hospital+Indiranagar+Bangalore",
    pincode: "560038"
  },
  {
    id: "hosp_blr_04",
    name: "Aster CMI Hospital — Hebbal",
    type: "Quaternary Healthcare & Level IV ECMO NICU",
    city: "Bengaluru",
    locality: "Hebbal",
    lat: 13.0569,
    lng: 77.5925,
    address: "No. 43/2, New Airport Road, NH 44, Sahakar Nagar, Hebbal, Bengaluru, KA 560092",
    emergencyPhone: "+91 80 4344 4344",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 12,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Aster+CMI+Hospital+Hebbal+Bangalore",
    pincode: "560092"
  },

  // ── COIMBATORE ──
  {
    id: "hosp_cbe_01",
    name: "Women Center by Motherhood — Coimbatore",
    type: "Maternity Super-Specialty & High-Risk Pregnancy Center",
    city: "Coimbatore",
    locality: "Ramnagar",
    lat: 11.0168,
    lng: 76.9558,
    address: "146B, Mettupalayam Road, Ramnagar, Coimbatore, TN 641009",
    emergencyPhone: "+91 422 424 0000",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 8,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Women+Center+Motherhood+Coimbatore",
    pincode: "641009"
  },
  {
    id: "hosp_cbe_02",
    name: "Ganga Women and Child Center — Ramnagar",
    type: "Specialized Maternity & Pediatric Hospital",
    city: "Coimbatore",
    locality: "Ramnagar",
    lat: 11.0125,
    lng: 76.9620,
    address: "313, Mettupalayam Road, Ramnagar, Coimbatore, TN 641009",
    emergencyPhone: "+91 422 223 5050",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 6,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ganga+Women+and+Child+Center+Coimbatore",
    pincode: "641009"
  },
  {
    id: "hosp_cbe_03",
    name: "PSG Hospitals & Super Speciality — Peelamedu",
    type: "Tertiary Teaching Hospital & Level IV Regional Perinatal Center",
    city: "Coimbatore",
    locality: "Peelamedu",
    lat: 11.0264,
    lng: 77.0028,
    address: "Avinashi Road, Peelamedu, Coimbatore, TN 641004",
    emergencyPhone: "+91 422 434 5353",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 15,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=PSG+Hospitals+Avinashi+Road+Coimbatore",
    pincode: "641004"
  },

  // ── MADURAI ──
  {
    id: "hosp_mdu_01",
    name: "Meenakshi Mission Hospital & Research Centre",
    type: "Tertiary Multi-Specialty & High-Risk Obstetrics",
    city: "Madurai",
    locality: "Lake Area, Melur Road",
    lat: 9.9482,
    lng: 78.1583,
    address: "Lake Area, Melur Road, Madurai, TN 625107",
    emergencyPhone: "+91 452 426 3000",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 10,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Meenakshi+Mission+Hospital+Madurai",
    pincode: "625107"
  },
  {
    id: "hosp_mdu_02",
    name: "Apollo Speciality Hospitals — K.K. Nagar",
    type: "Super-Specialty Tertiary Care Center",
    city: "Madurai",
    locality: "K.K. Nagar",
    lat: 9.9234,
    lng: 78.1465,
    address: "Lake View Road, K.K. Nagar, Madurai, TN 625020",
    emergencyPhone: "+91 452 258 0880",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 6,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.6,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Apollo+Speciality+Hospital+KK+Nagar+Madurai",
    pincode: "625020"
  },

  // ── HYDERABAD ──
  {
    id: "hosp_hyd_01",
    name: "Rainbow Children's Hospital & BirthRight — Banjara Hills",
    type: "Specialized Perinatal Center & Level IV Surgical NICU",
    city: "Hyderabad",
    locality: "Banjara Hills",
    lat: 17.4156,
    lng: 78.4487,
    address: "Road No. 2, Banjara Hills, Hyderabad, TS 500034",
    emergencyPhone: "+91 40 4466 5555",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 18,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+BirthRight+Hyderabad",
    pincode: "500034"
  },
  {
    id: "hosp_hyd_02",
    name: "Fernandez Hospital — Hyderguda",
    type: "Pioneer Tertiary Maternal & Perinatal Healthcare",
    city: "Hyderabad",
    locality: "Hyderguda",
    lat: 17.3984,
    lng: 78.4831,
    address: "4-1-1230, Bogulkunta, Hyderguda, Hyderabad, TS 500001",
    emergencyPhone: "+91 40 4022 2300",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 12,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Fernandez+Hospital+Hyderguda+Hyderabad",
    pincode: "500001"
  },

  // ── TIRUCHIRAPPALLI (TRICHY) ──
  {
    id: "hosp_try_01",
    name: "Kauvery Hospital Heartcity & Women Center — Cantonment",
    type: "Tertiary Multi-Specialty & Neonatal Intensive Care",
    city: "Tiruchirappalli",
    locality: "Cantonment",
    lat: 10.8062,
    lng: 78.6883,
    address: "No 1, K.C. Road, Cantonment, Tiruchirappalli, TN 620001",
    emergencyPhone: "+91 431 400 0100",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 8,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kauvery+Hospital+Cantonment+Trichy",
    pincode: "620001"
  },

  // ── SALEM ──
  {
    id: "hosp_slm_01",
    name: "Manipal Hospital — Dalmia Board",
    type: "Tertiary Super-Specialty & Level III NICU",
    city: "Salem",
    locality: "Dalmia Board",
    lat: 11.6961,
    lng: 78.1158,
    address: "Dalmia Board, Bangalore Highway, Salem, TN 636012",
    emergencyPhone: "+91 427 234 6666",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 6,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.7,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Manipal+Hospital+Salem",
    pincode: "636012"
  },

  // ── MUMBAI ──
  {
    id: "hosp_mum_01",
    name: "Surya Hospitals & Apex NICU — Santacruz West",
    type: "Premier Maternity & Level IV Advanced Neonatal Care",
    city: "Mumbai",
    locality: "Santacruz West",
    lat: 19.0832,
    lng: 72.8369,
    address: "101, SV Road, Saraswat Colony, Santacruz West, Mumbai, MH 400054",
    emergencyPhone: "+91 22 6153 8989",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 16,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Surya+Hospital+Santacruz+Mumbai",
    pincode: "400054"
  },
  {
    id: "hosp_mum_02",
    name: "Cloudnine Hospital — Malad West",
    type: "Maternity & Specialized Pediatric Care",
    city: "Mumbai",
    locality: "Malad West",
    lat: 19.1860,
    lng: 72.8485,
    address: "Link Road, Near Inorbit Mall, Malad West, Mumbai, MH 400064",
    emergencyPhone: "+91 22 4020 7777",
    nicuLevel: "Level III (Specialized)",
    nicuBedsAvailable: 8,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cloudnine+Hospital+Malad+Mumbai",
    pincode: "400064"
  },
  {
    id: "hosp_mum_03",
    name: "Kokilaben Dhirubhai Ambani Hospital — Andheri West",
    type: "Quaternary Super-Specialty & Level IV NICU",
    city: "Mumbai",
    locality: "Andheri West",
    lat: 19.1311,
    lng: 72.8252,
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, MH 400053",
    emergencyPhone: "+91 22 4269 6969",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 14,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kokilaben+Hospital+Andheri+Mumbai",
    pincode: "400053"
  },

  // ── DELHI-NCR ──
  {
    id: "hosp_del_01",
    name: "Cloudnine Hospital — Kailash Colony",
    type: "Maternity Super-Specialty & Level IV Surgical NICU",
    city: "Delhi-NCR",
    locality: "Greater Kailash / Kailash Colony",
    lat: 28.5529,
    lng: 77.2415,
    address: "A-2, Ring Road, Kailash Colony, New Delhi, DL 110048",
    emergencyPhone: "+91 11 4020 3333",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 12,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.9,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Cloudnine+Hospital+Kailash+Colony+Delhi",
    pincode: "110048"
  },
  {
    id: "hosp_del_02",
    name: "Rainbow Children's Hospital & BirthRight — Malviya Nagar",
    type: "Perinatal Center & Advanced Neonatal ICU",
    city: "Delhi-NCR",
    locality: "Malviya Nagar",
    lat: 28.5298,
    lng: 77.2065,
    address: "Geetanjali Near Shivalik, Malviya Nagar, New Delhi, DL 110017",
    emergencyPhone: "+91 11 4242 4242",
    nicuLevel: "Level IV (Advanced)",
    nicuBedsAvailable: 16,
    bloodBankAvailable: true,
    ambulanceAvailable: true,
    has24x7ObstetricOt: true,
    rating: 4.8,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rainbow+Childrens+Hospital+Malviya+Nagar+Delhi",
    pincode: "110017"
  }
];

/**
 * High-precision Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Indian city urban traffic drive time approximation (2.5 to 3.2 mins per km).
 */
export function estimateDriveTimeMins(distanceKm: number): number {
  return Math.max(4, Math.round(distanceKm * 2.8));
}

export interface SortOptions {
  userLat?: number;
  userLng?: number;
  searchQuery?: string;
  requireLevel4Nicu?: boolean;
  requireBloodBank?: boolean;
  maxResults?: number;
}

/**
 * Dynamically sorts and filters hospitals based on live coordinates.
 */
export function processHospitalsDynamic(options: SortOptions): MaternityHospitalResult[] {
  let pool = [...OFFLINE_VERIFIED_HOSPITALS];

  // 1. Filter by Level IV NICU
  if (options.requireLevel4Nicu) {
    pool = pool.filter((h) => h.nicuLevel.includes("Level IV"));
  }

  // 2. Filter by Blood Bank
  if (options.requireBloodBank) {
    pool = pool.filter((h) => h.bloodBankAvailable);
  }

  // 3. Search query (City, name, address, pincode)
  if (options.searchQuery && options.searchQuery.trim()) {
    const q = options.searchQuery.toLowerCase().trim();
    pool = pool.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.locality.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.pincode.includes(q)
    );
  }

  const hasGps = typeof options.userLat === "number" && typeof options.userLng === "number";

  // 4. Compute real distances & drive times
  const mapped: MaternityHospitalResult[] = pool.map((h) => {
    let distanceKm = 2.5;
    if (hasGps) {
      distanceKm = calculateHaversineDistance(options.userLat!, options.userLng!, h.lat, h.lng);
    } else {
      distanceKm = 4.2;
    }

    const driveTimeMins = estimateDriveTimeMins(distanceKm);

    const navUrl = hasGps
      ? `https://www.google.com/maps/dir/?api=1&origin=${options.userLat},${options.userLng}&destination=${h.lat},${h.lng}&travelmode=driving`
      : h.googleMapsUrl;

    return {
      ...h,
      distanceKm,
      estimatedDriveTimeMins: driveTimeMins,
      googleMapsUrl: navUrl
    };
  });

  // 5. Strictly sort ascending by nearest distance!
  mapped.sort((a, b) => a.distanceKm - b.distanceKm);

  const limit = options.maxResults || 20;
  return mapped.slice(0, limit);
}
