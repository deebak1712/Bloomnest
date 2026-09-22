import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { TravelRelocationProfile } from "../types";
import { 
  AIRLINE_REGULATIONS_DATABASE, 
  DVT_CIRCULATION_EXERCISES, 
  MATERNAL_RELOCATION_DOSSIER, 
  INITIAL_DEFAULT_TRAVEL_PROFILE, 
  LOCAL_STORAGE_KEY_TRAVEL_PROFILE 
} from "../data/travelSafetyData";
import { FitToFlyCertificateModal } from "../components/travel/FitToFlyCertificateModal";
import { 
  Car, Plane, AlertTriangle, ShieldCheck, MapPin, Compass, 
  FileText, CheckCircle2, Globe, Heart, Activity, Train, 
  Calendar, PhoneCall, ExternalLink, Printer, CheckSquare, 
  Square, Droplet, Sparkles, AlertOctagon, HelpCircle
} from "lucide-react";

export const TravelSafetyPage: React.FC = () => {
  const { user, showToast, t } = useApp();

  const [profile, setProfile] = useState<TravelRelocationProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRAVEL_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load travel profile from localStorage", e);
    }
    return INITIAL_DEFAULT_TRAVEL_PROFILE;
  });

  const [selectedAirlineId, setSelectedAirlineId] = useState<string>(profile.airlineName || "indigo");
  const [isFitToFlyModalOpen, setIsFitToFlyModalOpen] = useState(false);
  const [checkedDossierIds, setCheckedDossierIds] = useState<Record<string, boolean>>({});
  const [activeDvtId, setActiveDvtId] = useState<string>("ankle_pumps");
  const [waterCupsLogged, setWaterCupsLogged] = useState<number>(2);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_TRAVEL_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to persist travel profile", err);
    }
  }, [profile]);

  const updateProfile = (updater: (prev: TravelRelocationProfile) => TravelRelocationProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      next.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  const week = user.currentWeek || 24;

  // Gestational stage evaluation
  let travelStatus = {
    badgeClass: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800",
    iconColor: "text-emerald-600",
    label: `Week ${week} · Optimal Golden Travel Window`,
    bannerGradient: "from-emerald-600 to-teal-700",
    bannerTitle: "Trimester 2 (Weeks 14 – 28): Optimal Travel Window",
    bannerDesc: "Morning sickness has typically subsided, maternal energy is high, and the statistical risk of miscarriage or preterm labor is at its lowest. Best window for hometown relocation.",
    isFlightAllowed: true,
    fitToFlyNeeded: false,
  };

  if (week < 14) {
    travelStatus = {
      badgeClass: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800",
      iconColor: "text-amber-600",
      label: `Week ${week} · First Trimester Caution`,
      bannerGradient: "from-amber-600 to-orange-700",
      bannerTitle: "Trimester 1 (Weeks 1 – 13): Early Pregnancy Caution",
      bannerDesc: "Fatigue and nausea are common. Stay well hydrated, avoid strenuous journeys on bumpy roads, and carry physician-prescribed antiemetics.",
      isFlightAllowed: true,
      fitToFlyNeeded: false,
    };
  } else if (week >= 36) {
    travelStatus = {
      badgeClass: "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800",
      iconColor: "text-rose-600",
      label: `Week ${week} · Air Travel Barred (Full-Term)`,
      bannerGradient: "from-rose-600 via-red-600 to-pink-700",
      bannerTitle: "Week 36+: Commercial Airlines Restrict Air Travel",
      bannerDesc: "Labor surges can begin spontaneously. Commercial airlines strictly bar travel. Stay within 30 minutes of your designated delivery hospital.",
      isFlightAllowed: false,
      fitToFlyNeeded: false,
    };
  } else if (week >= 28) {
    travelStatus = {
      badgeClass: "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-800",
      iconColor: "text-purple-600",
      label: `Week ${week} · Fit-to-Fly Certificate Required`,
      bannerGradient: "from-purple-600 to-indigo-700",
      bannerTitle: "Trimester 3 (Weeks 28 – 35): Medical Clearance Mandatory",
      bannerDesc: "Commercial airlines mandate a signed Fit-to-Fly certificate from your treating OB-GYN issued within 48h to 7 days of scheduled departure.",
      isFlightAllowed: true,
      fitToFlyNeeded: true,
    };
  }

  const selectedAirline = AIRLINE_REGULATIONS_DATABASE.find((a) => a.id === selectedAirlineId) || AIRLINE_REGULATIONS_DATABASE[0];
  const isEligibleForSelectedAirline = week <= selectedAirline.maxWeeksSingle;

  const toggleDossierItem = (id: string) => {
    setCheckedDossierIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeDvtExercise = DVT_CIRCULATION_EXERCISES.find((e) => e.id === activeDvtId) || DVT_CIRCULATION_EXERCISES[0];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-rose-500" />
            <span>Trimester Travel & Hometown Relocation Protocol</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Pregnancy Travel Safety & Hometown Relocation Studio
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            Airline policy checker (IndiGo, Air India, Akasa), printable Fit-to-Fly certificate, DVT circulation coach, and transfer dossier.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFitToFlyModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Fit-to-Fly Letter</span>
          </button>
        </div>
      </div>

      {/* ── Dynamic ACOG Travel Safety Banner ────────────────────────────── */}
      <div className={`bg-gradient-to-r ${travelStatus.bannerGradient} text-white p-6 rounded-3xl shadow-xl space-y-3 relative overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90">
            <Globe className="w-4 h-4" />
            <span>ACOG & DGCA Clinical Travel Stage</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs">
            {travelStatus.label}
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold">{travelStatus.bannerTitle}</h3>
        <p className="text-xs text-white/95 leading-relaxed max-w-2xl">
          {travelStatus.bannerDesc}
        </p>

        {travelStatus.fitToFlyNeeded && (
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setIsFitToFlyModalOpen(true)}
              className="px-4 py-2 bg-white text-indigo-900 hover:bg-white/90 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-700" />
              <span>Preview & Print Clearance Certificate</span>
            </button>
            <span className="text-[11px] text-white/90 italic">
              Required for airport check-in from Week 28 onwards
            </span>
          </div>
        )}
      </div>

      {/* ── SECTION 1: Interactive Airline Policy Checker ────────────────── */}
      <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-sky-500" />
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100">
                Commercial Airline Policy & Gestational Cutoff Checker
              </h3>
              <p className="text-[11px] text-gray-500">
                Official DGCA & international carrier rules for pregnant travelers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {AIRLINE_REGULATIONS_DATABASE.map((airline) => (
              <button
                key={airline.id}
                onClick={() => setSelectedAirlineId(airline.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAirlineId === airline.id
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-rose-300 hover:bg-sky-50"
                }`}
              >
                {airline.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Airline Details Card */}
        <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-black text-sky-700 dark:text-sky-300 tracking-wider">
                Carrier Policy Specification
              </div>
              <div className="font-serif font-black text-lg text-gray-900 dark:text-rose-100">
                {selectedAirline.name}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                isEligibleForSelectedAirline
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300"
                  : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-300"
              }`}>
                {isEligibleForSelectedAirline ? `Eligible to Fly (Week ${week})` : `Beyond Cutoff (Week ${week})`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-[#20182c] border border-sky-100 dark:border-sky-900/30">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Max Cutoff (Single)</div>
              <div className="font-extrabold text-sky-700 dark:text-sky-300 text-sm">
                Up to {selectedAirline.maxWeeksSingle} Weeks
              </div>
              <div className="text-[10px] text-gray-500">Uncomplicated singleton</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#20182c] border border-sky-100 dark:border-sky-900/30">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Max Cutoff (Twins/Multiples)</div>
              <div className="font-extrabold text-purple-700 dark:text-purple-300 text-sm">
                Up to {selectedAirline.maxWeeksMultiple} Weeks
              </div>
              <div className="text-[10px] text-gray-500">Multiple gestation limit</div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#20182c] border border-sky-100 dark:border-sky-900/30">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Certificate Validity</div>
              <div className="font-bold text-gray-800 dark:text-rose-100 text-xs">
                {selectedAirline.certificateValidityWindow}
              </div>
              <div className="text-[10px] text-gray-500">From treating obstetrician</div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-gray-700 dark:text-rose-200">
            <div className="font-bold text-[11px] uppercase tracking-wider text-sky-900 dark:text-sky-200">
              Special Boarding & Check-in Rules:
            </div>
            {selectedAirline.specialRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-sky-200 dark:border-sky-900/40 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 italic">
              Need a verified medical certificate for {selectedAirline.name}?
            </span>
            <button
              onClick={() => setIsFitToFlyModalOpen(true)}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Generate Certificate Now
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Maternal Hometown Relocation ("Thai Veedu") Hub ─────── */}
      <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100">
                Hometown Relocation & Delivery Transfer Hub ("Thai Veedu")
              </h3>
              <p className="text-[11px] text-gray-500">
                Setup destination delivery hospital, local doctor speed-dial, and medical handover dossier
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200">
            Recommended Window: Weeks 28–32
          </span>
        </div>

        {/* Relocation Destination Details Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
              Destination City / Hometown
            </label>
            <input
              type="text"
              value={profile.destinationCity}
              onChange={(e) => updateProfile((p) => ({ ...p, destinationCity: e.target.value }))}
              placeholder="e.g. Chennai / Coimbatore / Madurai / Kochi"
              className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
              Preferred Maternity Hospital in Hometown
            </label>
            <input
              type="text"
              value={profile.destinationHospital}
              onChange={(e) => updateProfile((p) => ({ ...p, destinationHospital: e.target.value }))}
              placeholder="e.g. Apollo Cradle / Cloudnine / Manipal Hospital"
              className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
              Hometown Obstetrician Name
            </label>
            <input
              type="text"
              value={profile.destinationDoctorName || ""}
              onChange={(e) => updateProfile((p) => ({ ...p, destinationDoctorName: e.target.value }))}
              placeholder="e.g. Dr. Revathi Raman, MD (OB-GYN)"
              className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
              Hometown Doctor Emergency Phone
            </label>
            <input
              type="tel"
              value={profile.destinationDoctorPhone || ""}
              onChange={(e) => updateProfile((p) => ({ ...p, destinationDoctorPhone: e.target.value }))}
              placeholder="+91 98400 12345"
              className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono font-bold"
            />
          </div>
        </div>

        {/* Clinical Transfer Handover Dossier Checklist */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#20182c] border border-gray-200 dark:border-rose-900/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Clinical Transfer Records Dossier (Carry Physical Copies in Bag)</span>
            </span>
            <span className="text-[11px] font-bold text-rose-600">
              {Object.values(checkedDossierIds).filter(Boolean).length} / {MATERNAL_RELOCATION_DOSSIER.length} Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {MATERNAL_RELOCATION_DOSSIER.map((item) => {
              const isChecked = !!checkedDossierIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleDossierItem(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    isChecked
                      ? "bg-white dark:bg-[#1a1424] border-emerald-500 shadow-2xs"
                      : "bg-white/80 dark:bg-[#1a1424]/80 border-gray-200 dark:border-rose-900/30"
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-bold text-xs block ${isChecked ? "text-emerald-700 dark:text-emerald-300 line-through" : "text-gray-900 dark:text-rose-100"}`}>
                      {item.title}
                    </span>
                    <p className="text-[11px] text-gray-500 dark:text-rose-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: DVT In-Transit Circulation Coach ─────────────────── */}
      <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100">
                In-Transit DVT Prevention & Circulation Coach
              </h3>
              <p className="text-[11px] text-gray-500">
                Seated micro-exercises for flights, trains, and long car rides to prevent venous stasis
              </p>
            </div>
          </div>

          {/* Hydration tracker */}
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-2xl border border-purple-200 dark:border-purple-900/40">
            <Droplet className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
              Hydration: {waterCupsLogged * 250} ml
            </span>
            <button
              onClick={() => setWaterCupsLogged((c) => c + 1)}
              className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
              title="Add 250ml water"
            >
              + 250ml
            </button>
          </div>
        </div>

        {/* Exercise Selector & Active Display */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Exercise List */}
          <div className="sm:col-span-2 space-y-2">
            {DVT_CIRCULATION_EXERCISES.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setActiveDvtId(ex.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeDvtId === ex.id
                    ? "bg-purple-50 dark:bg-purple-950/40 border-purple-400 shadow-xs"
                    : "bg-white dark:bg-[#20182c] border-gray-100 dark:border-rose-900/20 hover:border-purple-200"
                }`}
              >
                <div className="font-bold text-gray-900 dark:text-rose-100 flex items-center justify-between">
                  <span>{ex.name}</span>
                  <span className="text-[10px] text-purple-600 font-semibold">{ex.reps}</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-rose-400 mt-1 line-clamp-1">
                  {ex.benefit}
                </p>
              </div>
            ))}
          </div>

          {/* Active Exercise Guidance Card */}
          <div className="sm:col-span-2 p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-900/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider">
                Active Circulation Drill
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-rose-100">
                {activeDvtExercise.name}
              </h4>
              <p className="text-xs text-gray-700 dark:text-rose-200 leading-relaxed">
                {activeDvtExercise.instructions}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#1a1424]/80 border border-purple-100 dark:border-purple-900/30 text-[11px]">
              <span className="font-bold text-purple-700 dark:text-purple-300 block">Clinical Benefit:</span>
              <p className="text-gray-600 dark:text-rose-300 mt-0.5">{activeDvtExercise.benefit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Mode-Specific Safety Guidelines ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Car Safety */}
        <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <Car className="w-5 h-5" />
            <span>Car & Road Travel</span>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-rose-300">
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>3-Point Seatbelt:</strong> Place lap strap below belly across pelvic bones. Never across abdomen.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>2-Hour Stops:</strong> Exit vehicle every 90–120 mins for a 10-minute walk.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>No Auto-Rickshaws:</strong> Avoid bumpy three-wheelers on unpaved roads in Trimester 3.</span>
            </li>
          </ul>
        </div>

        {/* Train Safety */}
        <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Train className="w-5 h-5" />
            <span>Vande Bharat & Trains</span>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-rose-300">
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>Lower Berth Only:</strong> Avoid climbing upper berths to prevent falls and abdominal strain.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>Aisle Walks:</strong> Take smooth strolls down the train corridor during long journeys.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>Hygiene Pack:</strong> Carry antibacterial wipes, toilet seat covers, and drinking water.</span>
            </li>
          </ul>
        </div>

        {/* Flight Safety */}
        <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-600 font-bold text-sm">
            <Plane className="w-5 h-5" />
            <span>Commercial Flights</span>
          </div>
          <ul className="space-y-2 text-gray-600 dark:text-rose-300">
            <li className="flex items-start gap-1.5">
              <span className="text-sky-500 font-bold">•</span>
              <span><strong>Aisle Seat:</strong> Reserve aisle seats for easy restroom access and movement.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-sky-500 font-bold">•</span>
              <span><strong>Compression Socks:</strong> Class-1 stockings (15–20 mmHg) prevent pedal swelling.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-sky-500 font-bold">•</span>
              <span><strong>Cabin Hydration:</strong> Airplane air is dry (~10% humidity); drink 250ml water/hr.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Fit-to-Fly Certificate Modal ─────────────────────────────────── */}
      <FitToFlyCertificateModal
        isOpen={isFitToFlyModalOpen}
        onClose={() => setIsFitToFlyModalOpen(false)}
        user={user}
        airlineName={selectedAirline.name}
        destinationCity={profile.destinationCity}
      />
    </div>
  );
};
