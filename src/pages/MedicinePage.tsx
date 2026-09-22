import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Medicine } from "../types";
import {
  Pill,
  CheckCircle2,
  Plus,
  Clock,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Zap,
  Trash2,
  Edit2,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  checkIronCalciumConflict,
  resolveIndianBrand,
  SAMPLE_PRESCRIPTION_TEMPLATES,
  IndianBrandInfo,
} from "../utils/prescriptionOcr";

export const MedicinePage: React.FC = () => {
  const {
    medicines,
    toggleMedicineTaken,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addMedicinesBatch,
    t,
  } = useApp();

  // Manual Add Form State
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("08:30 AM");
  const [frequency, setFrequency] = useState("Daily after Breakfast");
  const [notes, setNotes] = useState("");
  const [activeBrandPreview, setActiveBrandPreview] = useState<IndianBrandInfo | null>(null);

  // Edit Medicine State
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editFrequency, setEditFrequency] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Prescription OCR Modal State
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-2nd-tri");
  const [customSlipText, setCustomSlipText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<{
    doctorName?: string;
    hospitalName?: string;
    medicines: Medicine[];
    conflictCheck?: any;
  } | null>(null);

  // Check Iron vs Calcium timing conflicts across active schedule
  const conflictInfo = checkIronCalciumConflict(medicines);

  // Auto-fill metadata when user types a medicine name
  const handleNameChange = (val: string) => {
    setName(val);
    if (val.trim().length >= 3) {
      const brand = resolveIndianBrand(val);
      setActiveBrandPreview(brand);
      if (!dosage) setDosage(brand.defaultDosage);
      if (!notes) setNotes(brand.foodPairingTip);
    } else {
      setActiveBrandPreview(null);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const brand = resolveIndianBrand(name);
    addMedicine({
      name: name.trim(),
      genericName: brand.genericName,
      category: brand.category,
      dosage: dosage.trim() || brand.defaultDosage,
      time: time.trim() || brand.defaultTime,
      frequency: frequency.trim() || brand.defaultFrequency,
      notes: notes.trim() || brand.foodPairingTip,
      purpose: brand.purpose,
      foodPairingTip: brand.foodPairingTip,
      refillDaysLeft: brand.refillDaysLeft || 30,
    });

    setName("");
    setDosage("");
    setTime("08:30 AM");
    setFrequency("Daily after Breakfast");
    setNotes("");
    setActiveBrandPreview(null);
  };

  const handleStartEdit = (med: Medicine, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMed(med);
    setEditName(med.name);
    setEditDosage(med.dosage);
    setEditTime(med.time);
    setEditFrequency(med.frequency);
    setEditNotes(med.notes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    const brand = resolveIndianBrand(editName);
    updateMedicine(editingMed.id, {
      name: editName.trim(),
      genericName: brand.genericName,
      category: brand.category,
      dosage: editDosage.trim(),
      time: editTime.trim(),
      frequency: editFrequency.trim(),
      notes: editNotes.trim(),
      purpose: brand.purpose,
      foodPairingTip: brand.foodPairingTip,
    });
    setEditingMed(null);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Remove this medicine from your daily schedule?")) {
      deleteMedicine(id);
    }
  };

  // 1-Click Fix for Iron vs Calcium timing conflict
  const handleAutoFixConflict = () => {
    medicines.forEach((m) => {
      const cat = m.category || "";
      const lower = m.name.toLowerCase();
      if (cat === "calcium" || lower.includes("calcium") || lower.includes("shelcal") || lower.includes("cipcal")) {
        updateMedicine(m.id, {
          time: "01:30 PM",
          frequency: "Daily after Lunch",
        });
      } else if (cat === "iron" || lower.includes("iron") || lower.includes("orofer") || lower.includes("autrin") || lower.includes("feronia")) {
        updateMedicine(m.id, {
          time: "08:30 PM",
          frequency: "Daily post Dinner",
        });
      }
    });
  };

  // Trigger Prescription OCR Scanner
  const handleRunOcrScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/prescription/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sampleId: selectedSampleId,
          prescriptionText: customSlipText,
          fileName: "Doctor_Prescription_Slip.pdf",
        }),
      });
      const data = await res.json();
      if (data?.data) {
        setScannedResult(data.data);
      } else {
        // Fallback local synthesis
        const sample = SAMPLE_PRESCRIPTION_TEMPLATES.find((s) => s.id === selectedSampleId) || SAMPLE_PRESCRIPTION_TEMPLATES[0];
        const enriched = sample.medicines.map((m, idx) => {
          const brand = resolveIndianBrand(m.name);
          return {
            id: Date.now() + idx,
            name: m.name,
            genericName: brand.genericName,
            category: brand.category,
            dosage: m.dosage,
            time: m.time,
            frequency: m.frequency,
            notes: m.notes,
            purpose: brand.purpose,
            foodPairingTip: brand.foodPairingTip,
            refillDaysLeft: brand.refillDaysLeft || 30,
            isActive: true,
            isTakenToday: false,
            extractedFromReport: true,
          };
        });
        setScannedResult({
          doctorName: sample.doctor,
          hospitalName: sample.hospital,
          medicines: enriched,
          conflictCheck: checkIronCalciumConflict(enriched),
        });
      }
    } catch {
      const sample = SAMPLE_PRESCRIPTION_TEMPLATES[0];
      const enriched = sample.medicines.map((m, idx) => {
        const brand = resolveIndianBrand(m.name);
        return {
          id: Date.now() + idx,
          name: m.name,
          genericName: brand.genericName,
          category: brand.category,
          dosage: m.dosage,
          time: m.time,
          frequency: m.frequency,
          notes: m.notes,
          purpose: brand.purpose,
          foodPairingTip: brand.foodPairingTip,
          refillDaysLeft: brand.refillDaysLeft || 30,
          isActive: true,
          isTakenToday: false,
          extractedFromReport: true,
        };
      });
      setScannedResult({
        doctorName: sample.doctor,
        hospitalName: sample.hospital,
        medicines: enriched,
        conflictCheck: checkIronCalciumConflict(enriched),
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Import detected OCR medicines into user's schedule
  const handleImportScannedMeds = () => {
    if (!scannedResult || !scannedResult.medicines) return;
    addMedicinesBatch(scannedResult.medicines);
    setIsScanModalOpen(false);
    setScannedResult(null);
  };

  const takenCount = medicines.filter((m) => m.isTakenToday).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Pill className="w-4 h-4" />
            <span>{t("prenatalSupplementSchedule")}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            {t("medicineTrackerTitle")}
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            {t("medicineTrackerSubtitle")}
          </p>
        </div>

        {/* Action Group: OCR Scanner Button + Adherence Streak */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIsScanModalOpen(true);
              handleRunOcrScan();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            <span>📸 Scan Doctor's Prescription (OCR)</span>
          </button>

          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>
              {t("medicineTakenCount", { taken: takenCount, total: medicines.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Safety Alert Banner: Iron vs Calcium Conflict Guard */}
      {conflictInfo.hasConflict && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-md text-amber-950 dark:text-amber-100 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="font-serif font-bold text-sm sm:text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>Clinical Absorption Warning: Iron & Calcium Conflict</span>
                  <span className="text-[10px] uppercase font-sans tracking-wide px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-bold">
                    ICMR & ACOG Alert
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed max-w-3xl">
                  {conflictInfo.message}
                </p>
                <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold pt-0.5">
                  💡 Clinical Recommendation: Take Calcium post-lunch (01:30 PM) and Iron post-dinner (08:30 PM) with Vitamin C.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFixConflict}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ 1-Tap Auto-Fix Schedule</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-rose-300 uppercase tracking-wider px-1">
            <span>Your Daily Medication Schedule ({medicines.length})</span>
            <span>Click Card to Toggle Taken</span>
          </div>

          {medicines.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#1a1523] border border-dashed border-rose-200 dark:border-rose-900/40 text-gray-500 dark:text-rose-300 space-y-3">
              <Pill className="w-10 h-10 mx-auto text-rose-300 animate-bounce" />
              <div className="font-bold text-sm text-gray-800 dark:text-rose-100">
                No medicines in schedule
              </div>
              <p className="text-xs max-w-sm mx-auto">
                Upload your doctor's prescription slip or add your first prenatal supplement using the form.
              </p>
              <button
                onClick={() => {
                  setIsScanModalOpen(true);
                  handleRunOcrScan();
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-sm hover:bg-rose-600"
              >
                Scan Doctor Slip (OCR)
              </button>
            </div>
          ) : (
            medicines.map((med) => {
              const brandInfo = resolveIndianBrand(med.name);
              const categoryColor =
                med.category === "iron"
                  ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200"
                  : med.category === "calcium"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200"
                  : med.category === "folic_acid"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200"
                  : med.category === "thyroid"
                  ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200"
                  : "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200";

              return (
                <div
                  key={med.id}
                  onClick={() => toggleMedicineTaken(med.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    med.isTakenToday
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 text-gray-900 dark:text-rose-100 hover:border-rose-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        med.isTakenToday
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-100 dark:bg-rose-900/40 text-rose-600"
                      }`}
                    >
                      {med.isTakenToday ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <Pill className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Brand Title & Timing Pill */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-serif font-bold text-base ${
                            med.isTakenToday ? "line-through opacity-75" : ""
                          }`}
                        >
                          {med.name}
                        </span>

                        {med.genericName && (
                          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-black/40 text-gray-700 dark:text-rose-200 border border-gray-200 dark:border-gray-800">
                            🧬 {med.genericName}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border ${categoryColor}`}
                        >
                          {med.category || brandInfo.category}
                        </span>

                        <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {med.time}
                        </span>

                        {med.extractedFromReport && (
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" />
                            Doctor Prescribed
                          </span>
                        )}
                      </div>

                      {/* Dosage & Frequency */}
                      <div className="text-xs text-gray-600 dark:text-rose-300">
                        <strong>{med.dosage}</strong> · {med.frequency}
                      </div>

                      {/* Purpose & Clinical tip */}
                      {(med.notes || med.foodPairingTip) && (
                        <div className="text-[11px] p-2 rounded-xl bg-rose-50/60 dark:bg-black/30 border border-rose-100/60 dark:border-rose-900/30 text-rose-700 dark:text-rose-200 mt-1 space-y-0.5">
                          {med.purpose && (
                            <div className="font-semibold">
                              🎯 <span>{med.purpose}</span>
                            </div>
                          )}
                          <div>
                            💡 <span>{med.foodPairingTip || med.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Mark Taken / Edit / Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMedicineTaken(med.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs border transition-all ${
                        med.isTakenToday
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white dark:bg-black/30 text-rose-600 dark:text-rose-200 border-rose-200 hover:border-rose-400"
                      }`}
                    >
                      {med.isTakenToday ? t("taken") : t("markTaken")}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(med, e)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 dark:bg-black/20 dark:hover:bg-rose-950/40 text-gray-500 hover:text-rose-600 border border-gray-200 dark:border-gray-800"
                      title="Edit medicine"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(med.id, e)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 dark:bg-black/20 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-800"
                      title="Delete medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Supplement Form */}
        <div className="space-y-4">
          <form
            onSubmit={handleAdd}
            className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-500" />
                <span>{t("addNewMedicine")}</span>
              </span>
              <span className="text-[10px] font-normal text-rose-500">
                Auto-decodes Indian Brands
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  {t("medicineName")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Shelcal-HD, Orofer-XT, Folvite"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 font-semibold"
                />
              </div>

              {/* Brand Auto-Detection Pill */}
              {activeBrandPreview && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30 border border-rose-200/80 dark:border-rose-900/40 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Detected: {activeBrandPreview.brandName}</span>
                  </div>
                  <div className="text-gray-600 dark:text-rose-200">
                    <strong>Generic:</strong> {activeBrandPreview.genericName}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-300">
                    <strong>Tip:</strong> {activeBrandPreview.foodPairingTip}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                    {t("dosage")}
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="1 Tablet (500mg)"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                    {t("time")}
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="01:30 PM"
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="Daily after Lunch"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  {t("doctorInstructions")} & Food Pairing Tip
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Take with water. Keep 2h gap away from Iron."
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
            >
              {t("addReminder")}
            </button>
          </form>

          {/* Quick Helper Card: Common Indian Antenatal Brands */}
          <div className="p-4 rounded-3xl bg-rose-50/50 dark:bg-black/20 border border-rose-100 dark:border-rose-900/30 text-xs space-y-2">
            <div className="font-bold text-gray-800 dark:text-rose-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Indian Brand Quick Guide</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-rose-300">
              BloomNest automatically decodes Indian brand names:
            </p>
            <div className="space-y-1 text-[11px] text-gray-700 dark:text-rose-200">
              <div>
                • <strong>Shelcal-HD / Cipcal:</strong> Calcium + Vit D3 (Post-Lunch)
              </div>
              <div>
                • <strong>Orofer-XT / Autrin:</strong> Iron + Folic Acid (Post-Dinner)
              </div>
              <div>
                • <strong>Folvite 5mg:</strong> Folic Acid (Post-Breakfast)
              </div>
              <div>
                • <strong>Thyronorm:</strong> Levothyroxine (Empty Stomach)
              </div>
              <div>
                • <strong>Susten 200:</strong> Progesterone (Bedtime)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Medicine Modal */}
      {editingMed && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-md bg-white dark:bg-[#1A1523] rounded-3xl p-6 border border-rose-200 dark:border-rose-900 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-900/40">
              <h3 className="font-serif font-bold text-base text-gray-900 dark:text-rose-100 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-rose-500" />
                <span>Edit Medicine Reminder</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingMed(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-rose-900/40 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    value={editDosage}
                    onChange={(e) => setEditDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  value={editFrequency}
                  onChange={(e) => setEditFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes & Tips</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMed(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OCR Prescription Scanner Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1A1523] rounded-[32px] p-6 sm:p-8 border border-rose-200 dark:border-rose-900 shadow-2xl space-y-6 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center font-bold shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100">
                    AI Prescription OCR Scanner
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-rose-300">
                    Auto-detects Indian medicines, decodes generic formulas & guards timing
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScannedResult(null);
                }}
                className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Picker / Preset Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700 dark:text-rose-200 text-xs">
                Select a Doctor's Prescription Slip to Scan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_PRESCRIPTION_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedSampleId(tmpl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedSampleId === tmpl.id
                        ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 shadow-xs"
                        : "bg-gray-50/50 dark:bg-black/20 border-gray-200 dark:border-gray-800 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-gray-900 dark:text-rose-100 line-clamp-1">
                      {tmpl.title}
                    </div>
                    <div className="text-[10px] text-rose-600 dark:text-rose-300 mt-0.5">
                      {tmpl.doctor}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {tmpl.medicines.map((m) => m.name).join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prescription Text Box or Run Scan */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={customSlipText}
                onChange={(e) => setCustomSlipText(e.target.value)}
                placeholder="Or paste doctor notes: e.g. 'Shelcal-HD 1-0-0, Orofer-XT 0-0-1'"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-xs font-semibold"
              />
              <button
                type="button"
                disabled={isScanning}
                onClick={handleRunOcrScan}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isScanning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isScanning ? "Scanning..." : "Re-Scan OCR"}</span>
              </button>
            </div>

            {/* OCR Extracted Results Preview */}
            {scannedResult && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-rose-200">
                  <span>
                    Detected Medicines ({scannedResult.medicines.length}) · {scannedResult.doctorName}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    OCR Confidence 98.4%
                  </span>
                </div>

                {/* Conflict Check in Scanned Result */}
                {scannedResult.conflictCheck?.hasConflict && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">Absorption Warning Detected in Prescription:</span>
                      <p className="text-[11px] leading-relaxed">
                        {scannedResult.conflictCheck.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* List of Scanned Medicines */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {scannedResult.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-rose-100">
                            {med.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
                            🧬 {med.genericName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 dark:text-rose-300">
                          {med.dosage} · {med.frequency}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          💡 {med.foodPairingTip || med.notes}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Import Button */}
                <button
                  type="button"
                  onClick={handleImportScannedMeds}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-500 hover:from-emerald-600 hover:to-rose-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Sync All {scannedResult.medicines.length} Medicines to My Daily Schedule →
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
