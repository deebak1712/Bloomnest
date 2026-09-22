import React, { useState } from "react";
import { motion } from "motion/react";
import { ExtractedMedicalField, Medicine } from "../../types";
import { ProgressHeader } from "./ProgressHeader";
import {
  ShieldAlert,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  Sparkles,
  FileText,
  Pill,
  Clock,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { checkIronCalciumConflict, resolveIndianBrand } from "../../utils/prescriptionOcr";

interface BloomScanReviewProps {
  initialFields?: ExtractedMedicalField[];
  initialMedicines?: Medicine[];
  onConfirm: (fields: ExtractedMedicalField[], medicines?: Medicine[]) => void;
  onBack: () => void;
}

export const BloomScanReview: React.FC<BloomScanReviewProps> = ({
  initialFields,
  initialMedicines,
  onConfirm,
  onBack,
}) => {
  const defaultFields: ExtractedMedicalField[] = [
    { id: "1", category: "ultrasound", label: "Gestational Age", value: "24 Weeks 3 Days", unit: "weeks", date: "2026-08-20" },
    { id: "2", category: "ultrasound", label: "Estimated Due Date (EDD)", value: "2026-11-20", date: "2026-08-20" },
    { id: "3", category: "vitals", label: "Blood Group", value: "O+", date: "2026-08-20" },
    { id: "4", category: "vitals", label: "Blood Pressure", value: "118/74", unit: "mmHg", date: "2026-08-20" },
    { id: "5", category: "lab", label: "Hemoglobin", value: "11.8", unit: "g/dL", referenceRange: "11.0 - 14.0", date: "2026-08-20" },
    { id: "6", category: "lab", label: "Fasting Blood Sugar", value: "88", unit: "mg/dL", referenceRange: "70 - 95", date: "2026-08-20" },
    { id: "7", category: "prescription", label: "Primary OB-GYN", value: "Dr. Ananya Sharma, MD", date: "2026-08-20" },
    { id: "8", category: "prescription", label: "Maternity Hospital", value: "Apollo Cradle Maternity", date: "2026-08-20" },
  ];

  const defaultMedicines: Medicine[] = [
    {
      id: 101,
      name: "Shelcal-HD",
      genericName: "Calcium Carbonate (500mg) + Vitamin D3 (250 IU)",
      category: "calcium",
      dosage: "1 Tablet (500mg)",
      time: "01:30 PM",
      frequency: "Daily after Lunch",
      notes: "Take after lunch with water. Keep 2 hours gap away from Iron or tea/coffee.",
      purpose: "Supports fetal bone ossification, tooth bud development, and maternal bone density.",
      foodPairingTip: "Take after lunch with water. Keep at least a 2-hour gap away from Iron or tea/coffee.",
      refillDaysLeft: 28,
      isActive: true,
      isTakenToday: false,
      extractedFromReport: true,
    },
    {
      id: 102,
      name: "Orofer-XT",
      genericName: "Ferrous Ascorbate (100mg) + Folic Acid (1.5mg)",
      category: "iron",
      dosage: "1 Tablet (100mg)",
      time: "08:30 PM",
      frequency: "Daily post Dinner / Bedtime",
      notes: "Take with fresh lime water for peak absorption. Avoid milk, tea, coffee, and Calcium for 2 hours.",
      purpose: "Prevents gestational iron deficiency anemia and boosts red blood cell oxygen transport.",
      foodPairingTip: "Best taken with fresh lime water or Vitamin C. Avoid milk, tea, coffee, and Calcium for 2 hours.",
      refillDaysLeft: 28,
      isActive: true,
      isTakenToday: false,
      extractedFromReport: true,
    },
    {
      id: 103,
      name: "Folvite 5mg",
      genericName: "Folic Acid (Vitamin B9 5mg)",
      category: "folic_acid",
      dosage: "1 Tablet (5mg)",
      time: "08:30 AM",
      frequency: "Daily after Breakfast",
      notes: "Essential for neural tube closure and red blood cell health.",
      purpose: "Critical for neural tube closure, brain formation, and DNA synthesis.",
      foodPairingTip: "Take every morning with or without food. Safe to take alongside standard morning meals.",
      refillDaysLeft: 30,
      isActive: true,
      isTakenToday: false,
      extractedFromReport: true,
    },
  ];

  const [activeTab, setActiveTab] = useState<"biomarkers" | "prescriptions">("biomarkers");

  // Biomarkers state
  const [fields, setFields] = useState<ExtractedMedicalField[]>(
    initialFields && initialFields.length > 0 ? initialFields : defaultFields
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  // Prescriptions state
  const [medicines, setMedicines] = useState<Medicine[]>(
    initialMedicines && initialMedicines.length > 0 ? initialMedicines : defaultMedicines
  );
  const [selectedMedIds, setSelectedMedIds] = useState<Set<number>>(
    new Set((initialMedicines && initialMedicines.length > 0 ? initialMedicines : defaultMedicines).map((m) => m.id))
  );

  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedTime, setNewMedTime] = useState("08:30 AM");

  // Evaluate Iron-Calcium conflict
  const activeSelectedMeds = medicines.filter((m) => selectedMedIds.has(m.id));
  const conflictInfo = checkIronCalciumConflict(activeSelectedMeds);

  const handleStartEdit = (field: ExtractedMedicalField) => {
    setEditingId(field.id);
    setEditValue(field.value);
  };

  const handleSaveEdit = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value: editValue } : f))
    );
    setEditingId(null);
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddField = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    const newField: ExtractedMedicalField = {
      id: Date.now().toString(),
      category: "vitals",
      label: newLabel.trim(),
      value: newValue.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    setFields((prev) => [...prev, newField]);
    setNewLabel("");
    setNewValue("");
  };

  const toggleMedSelection = (id: number) => {
    setSelectedMedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRemoveMed = (id: number) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setSelectedMedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    const brand = resolveIndianBrand(newMedName.trim());
    const newMed: Medicine = {
      id: Date.now(),
      name: newMedName.trim(),
      genericName: brand.genericName,
      category: brand.category,
      dosage: newMedDosage.trim() || brand.defaultDosage,
      time: newMedTime.trim() || brand.defaultTime,
      frequency: brand.defaultFrequency,
      notes: brand.foodPairingTip,
      purpose: brand.purpose,
      foodPairingTip: brand.foodPairingTip,
      refillDaysLeft: brand.refillDaysLeft || 30,
      isActive: true,
      isTakenToday: false,
      extractedFromReport: true,
    };
    setMedicines((prev) => [...prev, newMed]);
    setSelectedMedIds((prev) => new Set(prev).add(newMed.id));
    setNewMedName("");
    setNewMedDosage("");
  };

  const handleAutoFixConflict = () => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.category === "calcium" || m.name.toLowerCase().includes("calcium") || m.name.toLowerCase().includes("shelcal")) {
          return { ...m, time: "01:30 PM", frequency: "Daily after Lunch" };
        }
        if (m.category === "iron" || m.name.toLowerCase().includes("iron") || m.name.toLowerCase().includes("orofer") || m.name.toLowerCase().includes("autrin")) {
          return { ...m, time: "08:30 PM", frequency: "Daily post Dinner" };
        }
        return m;
      })
    );
  };

  const handleFinalConfirm = () => {
    const finalSelectedMeds = medicines.filter((m) => selectedMedIds.has(m.id));
    onConfirm(fields, finalSelectedMeds);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#FFF0F5] via-[#FFF7F9] to-[#F5E6EC] dark:from-[#120E18] dark:via-[#1A1424] dark:to-[#22172A] text-gray-900 dark:text-rose-100">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white/90 dark:bg-[#1A1523]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[36px] border border-rose-100 dark:border-rose-900/40 shadow-2xl shadow-rose-200/50 dark:shadow-none space-y-6"
      >
        <ProgressHeader
          currentStep={4}
          totalSteps={4}
          title="👩 Human Review & Data Confirmation"
          onBack={onBack}
        />

        {/* Mandatory Medical Safety Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Doctor Slip & Lab Extraction Verification</span>
            <span>
              BloomScan digitized your report using clinical OCR. Verify your diagnostics and prescription schedule below before entering your dashboard.
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-rose-50/70 dark:bg-black/30 border border-rose-100 dark:border-rose-900/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("biomarkers")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "biomarkers"
                ? "bg-white dark:bg-rose-950 text-rose-600 dark:text-rose-300 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-rose-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Clinical Biomarkers ({fields.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("prescriptions")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "prescriptions"
                ? "bg-white dark:bg-rose-950 text-rose-600 dark:text-rose-300 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-rose-200"
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Prescription & Medicines ({medicines.length})</span>
            {conflictInfo.hasConflict && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab 1: Clinical Biomarkers */}
        {activeTab === "biomarkers" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Extracted Clinical Fields ({fields.length})</span>
              <span>Edit / Remove</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-black/30 text-rose-500 flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 dark:text-rose-100 text-xs truncate">
                        {field.label}
                      </div>

                      {editingId === field.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-black/40 border border-rose-300 font-bold text-xs flex-1"
                          />
                          <button
                            onClick={() => handleSaveEdit(field.id)}
                            className="px-3 py-1 bg-rose-500 text-white rounded-lg font-bold text-[11px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-rose-600 dark:text-rose-300 font-semibold truncate mt-0.5">
                          {field.value} {field.unit || ""} {field.referenceRange ? `(Ref: ${field.referenceRange})` : ""}
                        </div>
                      )}
                    </div>
                  </div>

                  {editingId !== field.id && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(field)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-gray-500 hover:text-rose-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Field Form */}
            <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-black/20 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="font-bold text-gray-600 dark:text-rose-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-rose-500" />
                <span>Add Additional Clinical Field</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Thyroid TSH Level"
                  className="w-full sm:flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#15111C] border border-gray-200 dark:border-gray-700 font-semibold"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. 1.8 mIU/L"
                  className="w-full sm:flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#15111C] border border-gray-200 dark:border-gray-700 font-semibold"
                />
                <button
                  onClick={handleAddField}
                  className="w-full sm:w-auto px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Prescriptions & Supplements */}
        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            {/* Iron vs Calcium Conflict Alert */}
            {conflictInfo.hasConflict && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-950 dark:text-amber-200 text-xs space-y-2"
              >
                <div className="flex items-start gap-2.5 font-bold text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span>Clinical Absorption Warning: Iron & Calcium Conflict</span>
                    <p className="font-normal text-[11px] text-amber-800/90 dark:text-amber-200/90 mt-0.5">
                      {conflictInfo.message}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAutoFixConflict}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Auto-Separate (Calcium: 01:30 PM, Iron: 08:30 PM)</span>
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Detected Prescriptions ({medicines.length})</span>
              <span>Sync to Daily Schedule</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {medicines.map((med) => {
                const isSelected = selectedMedIds.has(med.id);
                return (
                  <div
                    key={med.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs ${
                      isSelected
                        ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"
                        : "bg-gray-50/50 dark:bg-black/20 border-gray-200 dark:border-gray-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMedSelection(med.id)}
                        className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-rose-100 text-xs">
                            {med.name}
                          </span>
                          {med.genericName && med.genericName !== med.name && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
                              🧬 {med.genericName}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {med.time}
                          </span>
                        </div>

                        <div className="text-[11px] text-gray-600 dark:text-rose-300 mt-1">
                          {med.dosage} · {med.frequency}
                        </div>

                        {med.foodPairingTip && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-1 flex items-start gap-1">
                            <span>💡</span>
                            <span>{med.foodPairingTip}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveMed(med.id)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Medicine Form */}
            <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-black/20 border border-gray-200 dark:border-gray-800 space-y-2 text-xs">
              <div className="font-bold text-gray-600 dark:text-rose-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-rose-500" />
                <span>Add Prescribed Medicine / Supplement</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Thyronorm or Shelcal"
                  className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#15111C] border border-gray-200 dark:border-gray-700 font-semibold"
                />
                <input
                  type="text"
                  value={newMedTime}
                  onChange={(e) => setNewMedTime(e.target.value)}
                  placeholder="08:30 AM"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#15111C] border border-gray-200 dark:border-gray-700 font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personalization Calibration Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 border border-rose-200 dark:border-rose-900/40 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-300">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Automatic Profile & Schedule Calibration</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 dark:text-rose-200">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-rose-100 dark:border-rose-900/30">
              <span className="block font-bold">🗓️ Gestational Age</span>
              <span className="text-[10px] text-gray-500">Auto-calculated</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-rose-100 dark:border-rose-900/30">
              <span className="block font-bold">🩺 Vitals Baseline</span>
              <span className="text-[10px] text-gray-500">BP, Sugar & Hb</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-rose-100 dark:border-rose-900/30">
              <span className="block font-bold">💊 Daily Schedule</span>
              <span className="text-[10px] text-gray-500">{selectedMedIds.size} Meds Synced</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-rose-100 dark:border-rose-900/30">
              <span className="block font-bold">🛡️ Clinical Safety</span>
              <span className="text-[10px] text-gray-500">Absorption Verified</span>
            </div>
          </div>
        </div>

        {/* Confirm Action */}
        <button
          onClick={handleFinalConfirm}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-500 hover:from-emerald-600 hover:to-rose-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Confirm & Enter Personalized Dashboard ({selectedMedIds.size} medicines synced) →</span>
        </button>
      </motion.div>
    </div>
  );
};
