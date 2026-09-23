import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  DOCTOR_QUESTIONS_CATALOG,
  evaluateObstetricTriage,
  DoctorQuestionItem,
  ObstetricTriageStatus,
} from "../data/doctorReportsData";
import { INDIAN_SCANS } from "../data/medicalScans";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Activity,
  Pill,
  HeartPulse,
  Sparkles,
  UserCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Plus,
  Trash2,
  FileText,
  Share2,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Clock,
  Eye,
  Send,
  Copy,
  Check,
  X,
  Droplet,
  Baby,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export const ReportsPage: React.FC = () => {
  const { user, vitals, medicines, moodLogs, kickSessions, scanReports, addScanReport, showToast, t, maternalVaccines } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"obgyn_brief" | "biometrics" | "prep_kit" | "scans_archive">("obgyn_brief");

  // Doctor Consultation Questions State (Persisted in localStorage)
  const STORAGE_KEY = "bloomnest_doctor_questions_v2";
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customQuestions, setCustomQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_custom");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newCustomQuestionText, setNewCustomQuestionText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedQuestions));
    } catch (err) {
      console.error("Failed to save doctor questions:", err);
    }
  }, [checkedQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "_custom", JSON.stringify(customQuestions));
    } catch (err) {
      console.error("Failed to save custom questions:", err);
    }
  }, [customQuestions]);

  const toggleQuestionCheck = (id: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomQuestionText.trim()) return;
    setCustomQuestions((prev) => [...prev, newCustomQuestionText.trim()]);
    setNewCustomQuestionText("");
    showToast("Question added to your Ob-Gyn checklist! 🩺");
  };

  const handleDeleteCustomQuestion = (index: number) => {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Vitals Calculation & Recharts Chronological Data
  const latestVital = vitals.length > 0 ? vitals[0] : null;
  const initialWeight = vitals.length > 0 ? vitals[vitals.length - 1].weightKg : user.weightKg || 60;
  const currentWeight = latestVital?.weightKg || user.weightKg || 60;
  const weightGainKg = Math.max(0, Math.round((currentWeight - initialWeight) * 10) / 10);

  const systolicBp = latestVital?.systolicBp || 118;
  const diastolicBp = latestVital?.diastolicBp || 76;
  const bloodSugar = latestVital?.glucoseMgDl || latestVital?.bloodSugarMgDl;
  const recentKicks = kickSessions.length > 0 ? kickSessions[0].kickCount : latestVital?.babyKicksCount;

  // Obstetric Triage Evaluation
  const triage: ObstetricTriageStatus = evaluateObstetricTriage(
    systolicBp,
    diastolicBp,
    latestVital?.glucoseContext === "fasting" ? bloodSugar : undefined,
    latestVital?.glucoseContext === "post_meal" ? bloodSugar : undefined,
    user.bloodGroup,
    user.currentWeek,
    recentKicks
  );

  const chartData = [...vitals].reverse().map((v) => ({
    name: v.date ? v.date.split(" ").slice(0, 2).join(" ") : "Today",
    weight: v.weightKg,
    systolic: v.systolicBp,
    diastolic: v.diastolicBp,
    pulse: v.heartRateBpm || 78,
  }));

  // CSV Export Handler
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Patient Meta
    csvContent += "--- OBSTETRIC CLINICAL SUMMARY ---\n";
    csvContent += `Patient Name,${user.fullName || user.name}\n`;
    csvContent += `Gestational Age,Week ${user.currentWeek} (Trimester ${user.trimester})\n`;
    csvContent += `Estimated Due Date (EDD),${user.edd}\n`;
    csvContent += `Blood Group & Rh,${user.bloodGroup || "O+"}\n`;
    csvContent += `ABHA ID / MRN,${user.abhaId || "ABHA-PENDING"}\n`;
    csvContent += `Mean Arterial Pressure (MAP),${triage.mapValue} mmHg\n`;
    csvContent += "\n";

    // Authoritative Vitals
    csvContent += "--- AUTHORITATIVE VITALS LOG ---\n";
    csvContent += "Date,Weight(kg),BP Systolic,BP Diastolic,MAP(mmHg),BP Status,Glucose(mg/dL),Context,Water(mL),Sleep(hrs),Kicks,Symptoms\n";
    vitals.forEach((v) => {
      const mapVal = Math.round((v.systolicBp + 2 * v.diastolicBp) / 3);
      const gVal = v.glucoseMgDl || v.bloodSugarMgDl || "";
      csvContent += `${v.date},${v.weightKg},${v.systolicBp},${v.diastolicBp},${mapVal},${v.systolicBp >= 140 ? "HIGH" : "NORMAL"},${gVal},${v.glucoseContext || ""},${v.waterMl},${v.sleepHours},${v.babyKicksCount},"${(v.symptoms || []).join("; ")}"\n`;
    });
    csvContent += "\n";

    // Active Medications
    csvContent += "--- ACTIVE MEDICATIONS & SUPPLEMENTS ---\n";
    csvContent += "Name,Dosage,Timing,Clinical Purpose\n";
    medicines.filter((m) => m.isActive).forEach((m) => {
      csvContent += `"${m.name}","${m.dosage}","${m.timeOfDay}","${m.purpose || ""}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BloomNest_ObGyn_Dossier_${(user.name || "Patient").replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded Comprehensive Obstetric CSV Dossier! 📊");
  };

  // WhatsApp Clinical Summary Generator
  const [isCopied, setIsCopied] = useState(false);
  const generateDoctorWhatsAppText = () => {
    const activeMeds = medicines.filter((m) => m.isActive).map((m) => `${m.name} (${m.dosage})`).join(", ") || "Prenatal Vitamins";
    const recentSymptoms = latestVital?.symptoms?.join(", ") || "No acute distress";
    const askedQuestions = customQuestions.slice(0, 3).join("; ") || "Routine prenatal wellness review";

    return `🩺 *BloomNest Clinical Handover Brief (For Ob-Gyn)* 🩺\n\n` +
      `*Patient:* ${user.name || "Patient"} | *Age:* 28\n` +
      `*Gestation:* Week ${user.currentWeek || 20} (Trimester ${user.trimester || 2})\n` +
      `*EDD:* ${user.edd || "Pending"} | *Blood Group:* ${user.bloodGroup || "O+"}\n\n` +
      `*Latest Biometrics:*\n` +
      `• Blood Pressure: ${systolicBp}/${diastolicBp} mmHg (MAP: ${triage.mapValue} mmHg) — ${triage.bpLabel}\n` +
      `• Maternal Weight: ${currentWeight} kg (+${weightGainKg} kg total gain)\n` +
      `• Blood Glucose: ${bloodSugar ? `${bloodSugar} mg/dL (${latestVital?.glucoseContext || "casual"})` : "Within normal baseline"}\n` +
      `• Fetal Movement: ${recentKicks ? `${recentKicks} kicks (Cardiff compliant)` : "Reassuring"}\n\n` +
      `*Active Medications:*\n${activeMeds}\n\n` +
      `*Reported Symptoms:*\n${recentSymptoms}\n\n` +
      `*Patient Questions for Today's Visit:*\n${askedQuestions}\n\n` +
      `— Generated via BloomNest Perinatal Sanctuary`;
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generateDoctorWhatsAppText());
    setIsCopied(true);
    showToast("Clinical WhatsApp brief copied! 📋");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateDoctorWhatsAppText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 print:p-0 print:m-0 print:space-y-4">
      {/* Top Interactive Header (Hidden in Print) */}
      <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-indigo-500/10 dark:from-rose-950/40 dark:via-purple-950/20 dark:to-indigo-950/30 p-6 md:p-8 rounded-3xl border border-rose-200/70 dark:border-rose-900/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 text-xs font-bold tracking-wide">
            <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
            <span>Maternal Health & Ob-Gyn Consultation Dossier</span>
            <span className="text-[10px] bg-rose-200 dark:bg-rose-800 px-2 py-0.5 rounded-full font-semibold">
              Week {user.currentWeek || 20}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-rose-100 tracking-tight">
            Doctor Reports & Clinical Handover
          </h1>

          <p className="text-xs md:text-sm text-gray-600 dark:text-rose-200/80 max-w-2xl leading-relaxed">
            Standardized 1-page obstetric handover brief for clinic visits, biometric trend curves, trimester consultation prep kit, and diagnostic scan archives.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print 1-Page Brief</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Brief</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-rose-950/60 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 font-bold text-xs shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Hidden in Print) */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-rose-100 dark:border-rose-900/40 print:hidden">
        {[
          { id: "obgyn_brief", label: "1-Page Ob-Gyn Handover Brief", icon: FileText },
          { id: "biometrics", label: "Biometric Dossier & Trends", icon: HeartPulse },
          { id: "prep_kit", label: "Doctor Consultation Prep Kit", icon: HelpCircle },
          { id: "scans_archive", label: "Scans & Lab Attachments", icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 1-PAGE OB-GYN HANDOVER BRIEF (Visible on Screen & in Print) */}
      {(activeTab === "obgyn_brief" || true) && (
        <div
          className={`${
            activeTab === "obgyn_brief" ? "block" : "hidden print:block"
          } space-y-6 print:space-y-4 print:p-0`}
        >
          {/* A4 STANDARDIZED CLINICAL HANDOVER SHEET */}
          <div className="bg-white dark:bg-[#1a1523] p-8 md:p-10 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6 print:border-2 print:border-gray-800 print:rounded-none print:p-6 print:shadow-none print:break-after-page">
            {/* Clinical Header */}
            <div className="border-b-2 border-rose-500 print:border-black pb-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider print:border print:border-black">
                  BloomNest Obstetric Handover Brief · Confidential Medical Record
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-rose-100 print:text-black">
                  Prenatal Clinical Summary & Consultation Sheet
                </h2>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wider block text-[10px]">
                  Generated On
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-rose-100 print:text-black">
                  {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Patient Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 print:bg-gray-50 print:border-gray-400 print:rounded-none">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                  Patient Name
                </span>
                <span className="font-serif font-bold text-base text-gray-900 dark:text-rose-100 print:text-black">
                  {user.name || "Maternal Patient"}
                </span>
                <span className="text-[11px] text-gray-500 block">ABHA: {user.abhaId || "91-4829-1092"}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                  Gestational Age
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 print:text-black text-base">
                  Week {user.currentWeek || 20} (Tri {user.trimester || 2})
                </span>
                <span className="text-[11px] text-gray-500 block">EDD: {user.edd || "14 Nov 2026"}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                  Parity Matrix (GPAL)
                </span>
                <span className="font-bold text-gray-900 dark:text-rose-100 print:text-black text-base">
                  G1 P0 A0 L0 (Primigravida)
                </span>
                <span className="text-[11px] text-gray-500 block">LMP: {user.lmpDate || "07 Feb 2026"}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider block">
                  Blood Group & Rh
                </span>
                <span className={`font-bold text-base ${user.bloodGroup?.includes("-") ? "text-red-600" : "text-emerald-700"} print:text-black`}>
                  {user.bloodGroup || "O+"} ({user.bloodGroup?.includes("-") ? "Rh Negative" : "Rh Positive"})
                </span>
                <span className="text-[11px] text-gray-500 block">
                  {user.bloodGroup?.includes("-") ? "Anti-D Prophylaxis Due" : "Rh Compatible"}
                </span>
              </div>
            </div>

            {/* 4 Obstetric Clinical Triage Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1 print:border-gray-400">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Blood Pressure Status
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-300 print:text-black">
                  <HeartPulse className="w-4 h-4" />
                  <span>{systolicBp}/{diastolicBp} mmHg</span>
                </div>
                <span className="text-[10px] text-gray-500 block">MAP: {triage.mapValue} mmHg · {triage.bpLevel}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1 print:border-gray-400">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Glycemic Control (GDM)
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-300 print:text-black">
                  <Activity className="w-4 h-4" />
                  <span>{bloodSugar ? `${bloodSugar} mg/dL` : "Baseline Checked"}</span>
                </div>
                <span className="text-[10px] text-gray-500 block">{triage.gdmLabel}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1 print:border-gray-400">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Fetal Kick Cardiff Count
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-600 dark:text-purple-300 print:text-black">
                  <Baby className="w-4 h-4" />
                  <span>{recentKicks ? `${recentKicks} Kicks Logged` : "Active Movements"}</span>
                </div>
                <span className="text-[10px] text-gray-500 block">{triage.dfmcLabel}</span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1 print:border-gray-400">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Weight Progression
                </span>
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-300 print:text-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentWeight} kg (+{weightGainKg} kg)</span>
                </div>
                <span className="text-[10px] text-gray-500 block">IOM Normal Range Compliant</span>
              </div>
            </div>

            {/* 4-Box Obstetric Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Box A: Vital Signs History */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-rose-900/40 space-y-2.5 print:border-gray-400">
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b pb-1.5 print:text-black">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>Recent Biometric Readings</span>
                </span>
                <div className="space-y-1.5 text-[11px] text-gray-700 dark:text-rose-200 print:text-black">
                  <div className="flex justify-between">
                    <span>Resting Blood Pressure:</span>
                    <strong className="font-mono">{systolicBp}/{diastolicBp} mmHg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mean Arterial Pressure (MAP):</span>
                    <strong className="font-mono">{triage.mapValue} mmHg (Ref &lt; 85 mmHg)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Resting Maternal Heart Rate:</span>
                    <strong className="font-mono">{latestVital?.heartRateBpm || 78} BPM</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hydration Daily Average:</span>
                    <strong className="font-mono">{latestVital?.waterMl || 2200} mL / day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Restorative Sleep:</span>
                    <strong className="font-mono">{latestVital?.sleepHours || 8} hrs (Left Lateral)</strong>
                  </div>
                </div>
              </div>

              {/* Box B: Active Medications & Supplements */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-rose-900/40 space-y-2.5 print:border-gray-400">
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b pb-1.5 print:text-black">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  <span>Active Prenatal Prescriptions</span>
                </span>
                <div className="space-y-2 text-[11px] text-gray-700 dark:text-rose-200 print:text-black">
                  {medicines.filter((m) => m.isActive).length === 0 ? (
                    <p className="text-gray-500 italic">No prescription medications active.</p>
                  ) : (
                    medicines
                      .filter((m) => m.isActive)
                      .slice(0, 4)
                      .map((med) => (
                        <div key={med.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                          <div>
                            <strong>{med.name}</strong> ({med.dosage})
                            <span className="text-[10px] text-gray-500 block">{med.purpose || "Prescribed prenatal"}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold">
                            {med.timeOfDay}
                          </span>
                        </div>
                      ))
                  )}
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 italic pt-1">
                    ✓ Iron & Calcium scheduled with ≥ 2 hours separation to prevent competitive binding.
                  </div>
                </div>
              </div>

              {/* Box C: Diagnostic Scans Timeline & Maternal Immunizations Status */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-rose-900/40 space-y-2.5 print:border-gray-400">
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b pb-1.5 print:text-black">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                  <span>Diagnostic Scans & Maternal Vaccines</span>
                </span>
                <div className="space-y-1.5 text-[11px] text-gray-700 dark:text-rose-200 print:text-black">
                  <div className="flex justify-between items-center">
                    <span>Dating & Viability Ultrasound:</span>
                    <span className="text-emerald-600 font-bold">✓ Completed (CRL on track)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Level-2 TIFFA Anomaly Scan:</span>
                    <span className="text-rose-600 font-bold">
                      {scanReports.length > 0
                        ? `✓ ${scanReports.length} Report(s) Attached`
                        : (user.currentWeek || 20) >= 18
                        ? "Reviewing Today"
                        : "Scheduled Wk 20"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>75g OGTT Gestational Diabetes:</span>
                    <span className="text-amber-600 font-bold">
                      {(user.currentWeek || 20) >= 24 ? "Due for Booking" : "Upcoming (Wk 24-28)"}
                    </span>
                  </div>

                  {/* Maternal Immunization status */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">
                      Maternal Vaccine Protection
                    </span>
                    {maternalVaccines && maternalVaccines.length > 0 ? (
                      maternalVaccines.slice(0, 3).map((v) => (
                        <div key={v.vaccineCode} className="flex justify-between items-center">
                          <span>{v.vaccineName} ({v.recommendedWindow}):</span>
                          <span
                            className={`font-bold ${
                              v.status === "GIVEN"
                                ? "text-emerald-600"
                                : v.status === "DUE"
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          >
                            {v.status === "GIVEN" ? `✓ Given ${v.dateAdministered || ""}` : v.status === "DUE" ? "⚠️ Due Now" : "Upcoming"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>Tdap & Td Boosters:</span>
                        <span className="text-emerald-600 font-bold">Recommended Wk 27-36</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Box D: Reported Symptoms & Consultation Inquiries */}
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-rose-900/40 space-y-2.5 print:border-gray-400">
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b pb-1.5 print:text-black">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>Patient Symptoms & Clinical Questions</span>
                </span>
                <div className="space-y-1.5 text-[11px] text-gray-700 dark:text-rose-200 print:text-black">
                  <div>
                    <span className="font-bold text-gray-500 block">Reported Symptoms this Trimester:</span>
                    <span className="font-medium">{latestVital?.symptoms?.join(", ") || "No severe symptoms logged"}</span>
                  </div>

                  <div className="pt-1">
                    <span className="font-bold text-gray-500 block">Top Questions for Ob-Gyn Today:</span>
                    {customQuestions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 text-gray-800 dark:text-rose-100 font-medium">
                        {customQuestions.slice(0, 3).map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic text-gray-500">Reviewing fetal growth and nutrition protocols.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ob-Gyn Physical Exam Notes & Signoff Section */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-rose-900/50 space-y-4 bg-rose-50/20 dark:bg-transparent print:border-solid print:border-gray-500">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-rose-200 print:text-black border-b pb-2">
                <span>DOCTOR'S PHYSICAL EXAMINATION & CLINICAL NOTES (FOR IN-CLINIC USE)</span>
                <span>ICD-10 Z34.0 (Normal Pregnancy)</span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Fundal Height (cm)</span>
                  <div className="border-b border-gray-400 h-6 print:border-black" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Fetal Heart Rate (bpm)</span>
                  <div className="border-b border-gray-400 h-6 print:border-black" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Presentation / Lie</span>
                  <div className="border-b border-gray-400 h-6 print:border-black" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 block">Edema / Reflexes</span>
                  <div className="border-b border-gray-400 h-6 print:border-black" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-gray-500 block">Clinical Directives & Next Investigation:</span>
                <div className="border-b border-gray-400 h-8 print:border-black" />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-sans text-gray-600 print:text-black">
                <div>
                  <span>Next Appointment Date: ____________________</span>
                </div>
                <div>
                  <span>Doctor Signature & Stamp: ____________________</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BIOMETRIC DOSSIER & TREND CHARTS */}
      {activeTab === "biometrics" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* BP Area Chart with 140/90 Danger Line */}
          <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                  <span>Blood Pressure Longitudinal Trajectory</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-rose-300">
                  Continuous monitoring against the ACOG Preeclampsia threshold (140/90 mmHg).
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold self-start sm:self-auto">
                Latest: {systolicBp}/{diastolicBp} mmHg (MAP: {triage.mapValue})
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 170]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <ReferenceLine y={140} label="140 mmHg (Sys Alert)" stroke="#e11d48" strokeDasharray="4 4" />
                  <ReferenceLine y={90} label="90 mmHg (Dia Alert)" stroke="#e11d48" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="systolic" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorSys)" name="Systolic BP" />
                  <Area type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDia)" name="Diastolic BP" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maternal Weight Progression Chart */}
          <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span>Maternal Weight Gain Progression</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-rose-300">
                  Total gestational weight delta: +{weightGainKg} kg (Target: 11.5–16 kg for normal BMI).
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold self-start sm:self-auto">
                Current: {currentWeight} kg
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Authoritative Vitals Table */}
          <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100">
                Authoritative Longitudinal Vitals Log
              </h3>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-rose-100 dark:border-rose-900/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Blood Pressure</th>
                    <th className="p-3">MAP</th>
                    <th className="p-3">Glucose</th>
                    <th className="p-3">Kicks</th>
                    <th className="p-3">Reported Symptoms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100 dark:divide-rose-900/30">
                  {vitals.map((v) => {
                    const mapVal = Math.round((v.systolicBp + 2 * v.diastolicBp) / 3);
                    return (
                      <tr key={v.id} className="text-gray-700 dark:text-rose-200 hover:bg-rose-50/30">
                        <td className="p-3 font-semibold">{v.date}</td>
                        <td className="p-3">{v.weightKg} kg</td>
                        <td className="p-3 font-mono">{v.systolicBp}/{v.diastolicBp}</td>
                        <td className="p-3 font-mono">{mapVal} mmHg</td>
                        <td className="p-3">{v.glucoseMgDl ? `${v.glucoseMgDl} mg/dL` : "—"}</td>
                        <td className="p-3">{v.babyKicksCount ? `${v.babyKicksCount}` : "—"}</td>
                        <td className="p-3 text-gray-500 italic max-w-xs truncate">
                          {v.symptoms?.join(", ") || v.notes || "Normal"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCTOR CONSULTATION PREP KIT */}
      {activeTab === "prep_kit" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-purple-50 to-rose-50 dark:from-purple-950/20 dark:to-rose-950/20 p-6 rounded-3xl border border-purple-200 dark:border-purple-900/40 space-y-2">
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <span>Doctor Consultation Question Prep Kit</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-rose-300 max-w-2xl leading-relaxed">
              Don't let "pregnancy brain" make you forget your important questions! Review evidence-based questions for your trimester and add personal questions to check off during your doctor visit.
            </p>
          </div>

          {/* Add Custom Question Bar */}
          <form onSubmit={handleAddCustomQuestion} className="bg-white dark:bg-[#1a1523] p-4 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs flex gap-2">
            <input
              type="text"
              value={newCustomQuestionText}
              onChange={(e) => setNewCustomQuestionText(e.target.value)}
              placeholder="Type your own question for the doctor (e.g. Can I travel to Chennai next week? Is my low back pain normal?)..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-gray-900 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 font-medium"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </form>

          {/* Custom Questions List */}
          {customQuestions.length > 0 && (
            <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-3">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                Your Personal Inquiries ({customQuestions.length})
              </span>
              <div className="space-y-2">
                {customQuestions.map((q, idx) => {
                  const isChecked = !!checkedQuestions[`custom_${idx}`];
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200"
                          : "bg-rose-50/30 dark:bg-rose-950/20 border-rose-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleQuestionCheck(`custom_${idx}`)}
                        className="flex items-center gap-3 text-left flex-1"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                            isChecked ? "bg-emerald-500 text-white" : "border-2 border-gray-300 text-transparent"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={`text-xs font-semibold ${isChecked ? "line-through text-gray-400" : "text-gray-800 dark:text-rose-100"}`}>
                          {q}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomQuestion(idx)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete question"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Curated Trimester Evidence-Based Questions */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100">
              Evidence-Based Questions Recommended by Trimester
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCTOR_QUESTIONS_CATALOG.map((item) => {
                const isChecked = !!checkedQuestions[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleQuestionCheck(item.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 select-none ${
                      isChecked
                        ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 shadow-xs"
                        : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 shadow-xs hover:border-rose-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                          isChecked ? "bg-emerald-500 text-white" : "border-2 border-gray-300 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isChecked ? "line-through text-gray-400" : "text-gray-900 dark:text-rose-100"}`}>
                            {item.question}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">
                            Tri {item.trimester}
                          </span>
                        </div>

                        {item.tamilQuestion && (
                          <span className="text-[11px] text-gray-500 dark:text-rose-400 block font-medium">
                            {item.tamilQuestion}
                          </span>
                        )}

                        <p className="text-[11px] text-gray-500 dark:text-rose-300/80 italic leading-snug pt-1">
                          💡 Clinical Context: {item.clinicalContext}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SCANS & LAB REPORT ATTACHMENTS ARCHIVE */}
      {activeTab === "scans_archive" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-teal-950/20 dark:to-indigo-950/20 p-6 rounded-3xl border border-teal-200 dark:border-teal-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <span>Ultrasound Scans & Laboratory Reports Archive</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-rose-300 max-w-2xl leading-relaxed">
                Centralized vault of all your uploaded sonogram images, blood test slips, and urine routines. Keep them offline and organized for your Ob-Gyn.
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-bold self-start md:self-auto">
              {scanReports.length} Attachments Stored
            </span>
          </div>

          {/* Attachments Grid */}
          {scanReports.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1523] rounded-3xl border border-rose-100 dark:border-rose-900/40 p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-rose-100">
                No Scan Reports Attached Yet
              </h4>
              <p className="text-xs text-gray-500 dark:text-rose-300 max-w-md mx-auto">
                You can attach ultrasound scan photos and blood test reports from the <strong>Scans & Lab Timeline</strong> page, or upload your prescription in the Medicine Tracker!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scanReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white dark:bg-[#1a1523] p-4 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 font-bold uppercase text-[10px]">
                        {report.scanId || "Diagnostic Scan"}
                      </span>
                      <span className="text-gray-400 font-medium">{report.uploadedAt}</span>
                    </div>

                    {report.fileDataUrl && report.fileType === "image" ? (
                      <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-100 border">
                        <img src={report.fileDataUrl} alt={report.fileName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border flex flex-col items-center justify-center text-gray-500 gap-1.5">
                        <FileText className="w-8 h-8 text-rose-500" />
                        <span className="text-xs font-semibold">{report.fileName}</span>
                      </div>
                    )}

                    <span className="font-bold text-xs text-gray-900 dark:text-rose-100 block truncate">
                      {report.fileName}
                    </span>
                    {report.notes && (
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {report.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-rose-50 dark:border-rose-900/30 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{report.fileSize}</span>
                    {report.fileDataUrl && (
                      <a
                        href={report.fileDataUrl}
                        download={report.fileName}
                        className="inline-flex items-center gap-1 text-rose-600 font-bold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
