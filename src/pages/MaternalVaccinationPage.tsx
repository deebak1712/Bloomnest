import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  MaternalVaccine,
  MATERNAL_VACCINE_DEFINITIONS,
  CONTRAINDICATED_VACCINES,
  ContraindicatedVaccine,
} from "../data/maternalVaccinesData";
import {
  MaternalVaccineRecord,
  getMaternalVaccineRecords,
  saveMaternalVaccineRecord,
  deleteMaternalVaccineRecord,
  evaluateMaternalVaccineSummary,
} from "../utils/maternalVaccineStorage";
import {
  Syringe,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  FileText,
  Info,
  Building2,
  User,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  Droplet,
  HeartHandshake,
  Baby,
} from "lucide-react";

export const MaternalVaccinationPage: React.FC = () => {
  const { user, setActivePage } = useApp();
  const currentWeek = user.currentWeek || 24;
  const bloodGroup = user.bloodGroup || "B+";
  const doctorName = user.doctorName || "Dr. Ananya Sharma, MD (OB-GYN)";
  const hospitalName = user.hospitalName || "Cloudnine Maternal Hospital";

  const [filterTab, setFilterTab] = useState<"all" | "routine" | "conditional" | "contraindicated">("all");
  const [selectedWhyVaccine, setSelectedWhyVaccine] = useState<MaternalVaccine | null>(null);
  const [selectedContraVaccine, setSelectedContraVaccine] = useState<ContraindicatedVaccine | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal State for Logging
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVaccineId, setSelectedVaccineId] = useState<string>("mat_vac_tdap");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formWeek, setFormWeek] = useState<number>(currentWeek);
  const [formProvider, setFormProvider] = useState(doctorName);
  const [formClinic, setFormClinic] = useState(hospitalName);
  const [formLot, setFormLot] = useState("");
  const [formSource, setFormSource] = useState<MaternalVaccineRecord["verificationSource"]>("HOSPITAL_RECORD");
  const [formNotes, setFormNotes] = useState("");

  const records = getMaternalVaccineRecords();
  const summary = evaluateMaternalVaccineSummary(currentWeek, bloodGroup);
  const completedVaccineIds = new Set(records.map((r) => r.vaccineId));

  const handleOpenAddModal = (vaccineId?: string) => {
    if (vaccineId) {
      setSelectedVaccineId(vaccineId);
    }
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormWeek(currentWeek);
    setIsAddModalOpen(true);
  };

  const handleSaveVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaccineId) {
      alert("Please select a maternal vaccine.");
      return;
    }

    saveMaternalVaccineRecord({
      vaccineId: selectedVaccineId,
      administeredDate: formDate,
      gestationalWeek: Number(formWeek),
      provider: formProvider || undefined,
      clinicLocation: formClinic || undefined,
      batchLotNumber: formLot || undefined,
      verificationSource: formSource,
      verificationStatus: formSource === "PATIENT_REPORTED" ? "USER_REPORTED" : "VERIFIED",
      notes: formNotes || undefined,
    });

    setIsAddModalOpen(false);
    setFormLot("");
    setFormNotes("");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this maternal vaccination record?")) {
      deleteMaternalVaccineRecord(id);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  // Filter maternal vaccines
  const displayedMaternalVaccines = MATERNAL_VACCINE_DEFINITIONS.filter((v) => {
    if (filterTab === "routine") return v.category === "routine";
    if (filterTab === "conditional") return v.category === "conditional";
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Maternal Immunization Studio
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-300 text-slate-900 text-xs font-black">
                Week {currentWeek} • Trimester {user.trimester || 2}
              </span>
            </div>

            {/* Maternal Blood Type Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-100">
              <Droplet className="w-3.5 h-3.5 text-rose-300" />
              <span>Blood Group: <strong className="text-white">{bloodGroup}</strong></span>
              {summary.isRhNegative ? (
                <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  Rh-Negative (RhoGAM Protocol)
                </span>
              ) : (
                <span className="bg-emerald-400/30 text-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  Rh-Positive
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Mom's Pregnancy Vaccination Schedule 🛡️
              </h1>
              <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
                Clinical maternal immunizations tailored to your gestational timeline. Vaccines given during pregnancy protect you from severe infections and transfer essential transplacental antibodies to protect your baby before their first infant shots.
              </p>
            </div>

            <div
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shrink-0 cursor-pointer hover:bg-white/25 transition-all group shadow-sm self-start lg:self-center"
              onClick={() => setActivePage?.("baby-development")}
              title="Open 3D Fetal Growth Studio"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-white/50 relative shadow-md">
                <img
                  src={`/assets/cinematic/fetus_week_${Math.max(1, Math.min(40, currentWeek))}.jpg`}
                  alt={`Week ${currentWeek} Fetus`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/cinematic/fetus_week_24.jpg";
                  }}
                />
              </div>
              <div className="text-left text-xs pr-1">
                <span className="block font-bold text-white text-sm">Week {currentWeek} Baby</span>
                <span className="text-[11px] text-rose-200">Antibody Protection 👶</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Doses Logged</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {summary.totalCompleted} Complete
              </span>
              <span className="text-[11px] text-emerald-300 font-bold block mt-0.5">✓ Verified</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Due / Recommended</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {summary.totalDueNow} Vaccine{summary.totalDueNow === 1 ? "" : "s"}
              </span>
              <span className="text-[11px] text-amber-200 font-bold block mt-0.5">Consult OB-GYN</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Upcoming Windows</span>
              <span className="text-xl sm:text-2xl font-black text-white">
                {summary.totalUpcoming} Scheduled
              </span>
              <span className="text-[11px] text-rose-200 font-medium block mt-0.5">Later gestation</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Next Priority Shot</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">
                {summary.nextDueVaccine ? summary.nextDueVaccine.code : "All Up-to-Date"}
              </span>
              {summary.nextDueWindowText && (
                <span className="text-[11px] text-amber-300 font-bold block mt-0.5 truncate">
                  {summary.nextDueWindowText}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. GESTATIONAL TIMING INSIGHT CARD */}
      <div className="pastel-mint-card p-5 rounded-3xl border border-emerald-200/60 dark:border-emerald-900/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 dark:text-rose-100">
                Gestational Timing Advisory (Week {currentWeek})
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
                ACOG & FOGSI Clinical Guideline
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-rose-300 leading-relaxed">
              {currentWeek >= 27 && currentWeek <= 36 ? (
                <span>
                  <strong>You are in the optimal window for your Tdap shot!</strong> Administration between Weeks 27–36 ensures maximal transplacental antibody transfer to shield your newborn from whooping cough.
                </span>
              ) : currentWeek < 27 ? (
                <span>
                  <strong>Tdap milestone is approaching:</strong> Scheduled between Weeks 27–36 (in {27 - currentWeek} week{27 - currentWeek > 1 ? "s" : ""}). Review timing with {doctorName} during your next routine prenatal visit.
                </span>
              ) : (
                <span>
                  If you haven't yet received your <strong>Tdap vaccination</strong> this pregnancy, it is recommended prior to delivery to confer protective maternal antibodies.
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddModal("mat_vac_tdap")}
          className="px-4 py-2.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-sm inline-flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Dose Received</span>
        </button>
      </div>

      {/* 3. CONTRAINDICATED LIVE VACCINES WARNING BANNER */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <span>⚠️ Important Maternal Safety: Contraindicated Live Vaccines</span>
            </h3>
            <button
              onClick={() => setFilterTab("contraindicated")}
              className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>View contraindicated list</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <p className="leading-relaxed">
            Live-attenuated vaccines such as <strong>MMR (Measles, Mumps, Rubella)</strong> and <strong>Varicella (Chickenpox)</strong> are <strong>strictly contraindicated during pregnancy</strong> due to theoretical risks to the fetus. If non-immune, these must be taken immediately <em>after delivery (postpartum)</em>.
          </p>
          <p className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
            ✓ Inactivated vaccines (like Tdap and the Inactivated Flu shot) are completely non-replicating, safe, and highly recommended.
          </p>
        </div>
      </div>

      {/* 4. FILTER TABS */}
      <div className="flex border-b border-rose-100 dark:border-rose-900/40 space-x-2 sm:space-x-4 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterTab("all")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            filterTab === "all"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>All Maternal Vaccines ({MATERNAL_VACCINE_DEFINITIONS.length})</span>
        </button>

        <button
          onClick={() => setFilterTab("routine")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            filterTab === "routine"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Routine Mandatory (Tdap, TT, Flu)</span>
        </button>

        <button
          onClick={() => setFilterTab("conditional")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            filterTab === "conditional"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Conditional (RhoGAM, COVID-19)</span>
        </button>

        <button
          onClick={() => setFilterTab("contraindicated")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            filterTab === "contraindicated"
              ? "border-amber-600 text-amber-600 dark:text-amber-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety & Contraindications ({CONTRAINDICATED_VACCINES.length})</span>
        </button>
      </div>

      {/* 5. VACCINE CARDS GRID (MATERNAL VACCINES) */}
      {filterTab !== "contraindicated" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-rose-100">
                Pregnancy Immunization Schedule
              </h2>
              <p className="text-xs text-slate-500 dark:text-rose-300">
                Evidence-based maternal vaccines mapped to gestational weeks for maternal and neonatal defense.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddModal()}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Log Vaccine Administration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {displayedMaternalVaccines.map((vaccine) => {
              const isCompleted = completedVaccineIds.has(vaccine.id);
              const isDueNow =
                !isCompleted &&
                currentWeek >= vaccine.recommendedWeeksStart &&
                currentWeek <= vaccine.recommendedWeeksEnd;
              const isUpcoming = !isCompleted && currentWeek < vaccine.recommendedWeeksStart;
              const matchingRecord = records.find((r) => r.vaccineId === vaccine.id);

              return (
                <div
                  key={vaccine.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-sm ${
                    isCompleted
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50"
                      : isDueNow
                      ? "bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/60 ring-2 ring-amber-400/20"
                      : "bg-white dark:bg-[#1a1420] border-rose-100 dark:border-rose-900/40"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Status & Timing Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs">
                          {vaccine.code}
                        </span>
                        {vaccine.isMandatory && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold text-[10px] uppercase">
                            Mandatory Routine
                          </span>
                        )}
                        {vaccine.rhNegativeOnly && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase">
                            Rh-Negative Protocol
                          </span>
                        )}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : isDueNow
                            ? "bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 animate-pulse"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Completed
                          </>
                        ) : isDueNow ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            Recommended Now
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            Upcoming Window
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title & Timing */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                        {vaccine.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-rose-300 font-medium">
                        {vaccine.fullTitle}
                      </p>
                    </div>

                    {/* Gestational Timing Bar */}
                    <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-rose-900 dark:text-rose-200 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-rose-600" />
                          Recommended Timing:
                        </span>
                        <span className="text-rose-700 dark:text-rose-300 font-black">
                          {vaccine.recommendedTiming}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-rose-300 leading-snug">
                        {vaccine.summary}
                      </p>
                    </div>

                    {/* Newborn & Fetal Protection Highlight */}
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-rose-200 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      <Baby className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-rose-100">Baby's Benefit: </strong>
                        <span>{vaccine.fetalBenefit}</span>
                      </div>
                    </div>

                    {/* Completed Record Details (if available) */}
                    {matchingRecord && (
                      <div className="p-3.5 rounded-2xl bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Administered on: {matchingRecord.administeredDate}
                          </span>
                          {matchingRecord.gestationalWeek && (
                            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                              Week {matchingRecord.gestationalWeek}
                            </span>
                          )}
                        </div>
                        {matchingRecord.provider && (
                          <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                            Provider: <strong>{matchingRecord.provider}</strong> • {matchingRecord.clinicLocation || hospitalName}
                          </p>
                        )}
                        {matchingRecord.batchLotNumber && (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                            Batch/Lot: {matchingRecord.batchLotNumber}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedWhyVaccine(vaccine)}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Why is this needed?</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <button
                          onClick={() => matchingRecord && handleDeleteRecord(matchingRecord.recordId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all text-xs flex items-center gap-1"
                          title="Remove record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenAddModal(vaccine.id)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log Dose</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. CONTRAINDICATED VACCINES SECTION */}
      {filterTab === "contraindicated" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-rose-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Contraindicated Vaccines in Pregnancy</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-rose-300">
              Clinical safety reference: Vaccines that contain live replicating organisms or have theoretical risk of fetal harm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTRAINDICATED_VACCINES.map((contra) => (
              <div
                key={contra.id}
                className="p-5 bg-white dark:bg-[#1a1420] rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-extrabold uppercase">
                      {contra.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                      Contraindicated
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
                    {contra.name}
                  </h3>

                  <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <strong className="block text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300 font-black">
                      Why it is avoided in pregnancy:
                    </strong>
                    <p className="leading-relaxed">{contra.contraindicationReason}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40 text-xs text-teal-900 dark:text-teal-200 space-y-1">
                    <strong className="block text-[11px] uppercase tracking-wider text-teal-800 dark:text-teal-300 font-black">
                      Postpartum Action Plan:
                    </strong>
                    <p className="leading-relaxed">{contra.postpartumCatchUp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RECENTLY LOGGED MATERNAL VACCINES TIMELINE */}
      <div className="p-6 bg-white dark:bg-[#1a1420] rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-rose-100 dark:border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-rose-100">
              Verified Maternal Immunization History
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {records.length} Documented Record{records.length === 1 ? "" : "s"}
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Syringe className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-rose-200">
              No Maternal Vaccine Records Logged Yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap "Log Vaccine Administration" above to document your TT, Tdap, or Flu shots.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => {
              const def = MATERNAL_VACCINE_DEFINITIONS.find((v) => v.id === r.vaccineId);
              return (
                <div
                  key={r.recordId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                        {def?.code || "Maternal Vaccine"}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-rose-100">
                        {def?.name || "Vaccine"}
                      </span>
                      {r.gestationalWeek && (
                        <span className="text-[10px] text-slate-500 font-bold">
                          • Week {r.gestationalWeek}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-rose-300 flex items-center gap-3 flex-wrap">
                      <span>Date: <strong>{r.administeredDate}</strong></span>
                      {r.provider && <span>Provider: <strong>{r.provider}</strong></span>}
                      {r.batchLotNumber && (
                        <span>Batch/Lot: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">{r.batchLotNumber}</code></span>
                      )}
                    </div>
                    {r.notes && (
                      <p className="text-[11px] text-slate-500 italic">"{r.notes}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(r.recordId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all self-end sm:self-center"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL: LOG MATERNAL VACCINE */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-900/50 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                  Log Maternal Vaccine Dose
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300">
                  Document injection date, hospital details, and batch lot number.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVaccination} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                  Select Maternal Vaccine *
                </label>
                <select
                  value={selectedVaccineId}
                  onChange={(e) => setSelectedVaccineId(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {MATERNAL_VACCINE_DEFINITIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.code} — {v.name} ({v.recommendedTiming})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Administration Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Gestational Week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={42}
                    value={formWeek}
                    onChange={(e) => setFormWeek(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Doctor / Obstetrician
                  </label>
                  <input
                    type="text"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma"
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Clinic / Hospital
                  </label>
                  <input
                    type="text"
                    value={formClinic}
                    onChange={(e) => setFormClinic(e.target.value)}
                    placeholder="e.g. Cloudnine Maternal Hospital"
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Batch / Lot Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formLot}
                    onChange={(e) => setFormLot(e.target.value)}
                    placeholder="e.g. TDAP-2026-904"
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                    Verification Source
                  </label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as any)}
                    className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="HOSPITAL_RECORD">Hospital Discharge / OPD Record</option>
                    <option value="VACCINATION_CARD">Physical Vaccine Card</option>
                    <option value="DOCTOR_PRESCRIPTION">Doctor Prescription</option>
                    <option value="PATIENT_REPORTED">Self-Reported</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200 mb-1">
                  Notes & Tolerability
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Left arm injection; mild soreness for 24h, no fever."
                  rows={2}
                  className="w-full p-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-100 dark:border-rose-900/30">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Save to Immunization Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: WHY IS THIS VACCINE NEEDED? */}
      {/* ========================================== */}
      {selectedWhyVaccine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-900/50 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black">
                  {selectedWhyVaccine.code}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-rose-100 mt-1">
                  {selectedWhyVaccine.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWhyVaccine(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-1">
                <span className="font-extrabold text-rose-900 dark:text-rose-200 block text-[11px] uppercase">
                  Target Prevention
                </span>
                <p className="text-slate-700 dark:text-rose-200 font-bold">
                  {selectedWhyVaccine.targetDisease}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-rose-400">
                  Recommended: {selectedWhyVaccine.recommendedTiming}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-rose-100 text-sm">
                  Clinical Rationale for Mother
                </h4>
                <p className="text-slate-600 dark:text-rose-300 leading-relaxed">
                  {selectedWhyVaccine.clinicalRationale}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/40 space-y-1">
                <h4 className="font-black text-pink-900 dark:text-pink-100 text-xs flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-pink-600" />
                  <span>Transplacental Protection for Baby</span>
                </h4>
                <p className="text-slate-700 dark:text-rose-200 leading-relaxed">
                  {selectedWhyVaccine.fetalBenefit}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-rose-100 text-sm">
                  Safety Profile in Pregnancy
                </h4>
                <p className="text-slate-600 dark:text-rose-300 leading-relaxed">
                  {selectedWhyVaccine.safetyProfile}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-rose-400 flex items-center justify-between">
                <span>Guideline Source: <strong>{selectedWhyVaccine.guidelineSource}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWhyVaccine(null)}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Close Insight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
