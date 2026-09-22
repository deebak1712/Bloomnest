import {
  MaternalVaccine,
  MATERNAL_VACCINE_DEFINITIONS,
} from "../data/maternalVaccinesData";

export interface MaternalVaccineRecord {
  recordId: string;
  vaccineId: string;
  administeredDate: string;
  gestationalWeek?: number;
  provider?: string;
  clinicLocation?: string;
  batchLotNumber?: string;
  verificationSource: "HOSPITAL_RECORD" | "VACCINATION_CARD" | "DOCTOR_PRESCRIPTION" | "PATIENT_REPORTED";
  verificationStatus: "VERIFIED" | "USER_REPORTED";
  notes?: string;
}

export interface MaternalVaccineSummary {
  totalCompleted: number;
  totalDueNow: number;
  totalUpcoming: number;
  nextDueVaccine?: MaternalVaccine;
  nextDueWindowText?: string;
  isRhNegative: boolean;
  needsRhogam: boolean;
  currentGestationalWeek: number;
}

const STORAGE_KEY_MATERNAL_VACCINES = "bloomnest_maternal_vaccinations_v1";

// Initial seed generator for maternal vaccines
function getInitialSeededMaternalRecords(): MaternalVaccineRecord[] {
  return [
    {
      recordId: "mat_rec_tt1_seed",
      vaccineId: "mat_vac_tt1",
      administeredDate: "2026-07-15",
      gestationalWeek: 9,
      provider: "Dr. Ananya Sharma, MD (OB-GYN)",
      clinicLocation: "Cloudnine Maternal Hospital, Indiranagar",
      batchLotNumber: "TT-2026-8812",
      verificationSource: "HOSPITAL_RECORD",
      verificationStatus: "VERIFIED",
      notes: "First maternal tetanus dose received during initial obstetric registration. Well tolerated with minor left arm soreness.",
    },
  ];
}

export function getMaternalVaccineRecords(): MaternalVaccineRecord[] {
  if (typeof window === "undefined") {
    return getInitialSeededMaternalRecords();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MATERNAL_VACCINES);
    if (!raw) {
      const seeded = getInitialSeededMaternalRecords();
      localStorage.setItem(STORAGE_KEY_MATERNAL_VACCINES, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading maternal vaccine records:", err);
    return getInitialSeededMaternalRecords();
  }
}

export function saveMaternalVaccineRecord(
  record: Omit<MaternalVaccineRecord, "recordId"> & { recordId?: string }
): MaternalVaccineRecord {
  try {
    const records = getMaternalVaccineRecords();
    const newRecord: MaternalVaccineRecord = {
      ...record,
      recordId: record.recordId || `mat_rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    const existingIndex = records.findIndex((r) => r.recordId === newRecord.recordId);
    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.unshift(newRecord);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_MATERNAL_VACCINES, JSON.stringify(records));
    }
    return newRecord;
  } catch (err) {
    console.error("Error saving maternal vaccine record:", err);
    throw err;
  }
}

export function deleteMaternalVaccineRecord(recordId: string): void {
  try {
    const records = getMaternalVaccineRecords();
    const filtered = records.filter((r) => r.recordId !== recordId);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_MATERNAL_VACCINES, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error("Error deleting maternal vaccine record:", err);
  }
}

export function evaluateMaternalVaccineSummary(
  currentWeek: number = 24,
  bloodGroup: string = "B+"
): MaternalVaccineSummary {
  const records = getMaternalVaccineRecords();
  const completedIds = new Set(records.map((r) => r.vaccineId));
  const isRhNegative = bloodGroup.includes("-");

  // Determine applicable vaccines
  const applicableVaccines = MATERNAL_VACCINE_DEFINITIONS.filter((v) => {
    if (v.rhNegativeOnly && !isRhNegative) return false;
    return true;
  });

  let completed = 0;
  let dueNow = 0;
  let upcoming = 0;
  let nextDueVaccine: MaternalVaccine | undefined = undefined;

  applicableVaccines.forEach((v) => {
    if (completedIds.has(v.id)) {
      completed++;
    } else if (currentWeek >= v.recommendedWeeksStart && currentWeek <= v.recommendedWeeksEnd) {
      dueNow++;
      if (!nextDueVaccine) nextDueVaccine = v;
    } else if (currentWeek < v.recommendedWeeksStart) {
      upcoming++;
      if (!nextDueVaccine) nextDueVaccine = v;
    } else {
      // Overdue or available across all weeks (e.g. Flu)
      dueNow++;
      if (!nextDueVaccine) nextDueVaccine = v;
    }
  });

  // Calculate user-friendly next due window text
  let nextDueWindowText: string | undefined = undefined;
  if (nextDueVaccine) {
    if (currentWeek >= nextDueVaccine.recommendedWeeksStart && currentWeek <= nextDueVaccine.recommendedWeeksEnd) {
      nextDueWindowText = `Recommended Right Now (Week ${currentWeek})`;
    } else if (currentWeek < nextDueVaccine.recommendedWeeksStart) {
      const weeksAway = nextDueVaccine.recommendedWeeksStart - currentWeek;
      nextDueWindowText = `In ${weeksAway} week${weeksAway > 1 ? "s" : ""} (Week ${nextDueVaccine.recommendedWeeksStart}–${nextDueVaccine.recommendedWeeksEnd})`;
    } else {
      nextDueWindowText = `Recommended in ${nextDueVaccine.recommendedTiming}`;
    }
  }

  return {
    totalCompleted: completed,
    totalDueNow: dueNow,
    totalUpcoming: upcoming,
    nextDueVaccine,
    nextDueWindowText,
    isRhNegative,
    needsRhogam: isRhNegative && !completedIds.has("mat_vac_rhogam"),
    currentGestationalWeek: currentWeek,
  };
}
