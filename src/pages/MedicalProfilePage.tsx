import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MedicalProfileData, CriticalDailyMedication } from "../types";
import { 
  INITIAL_DEFAULT_MEDICAL_PROFILE, 
  LOCAL_STORAGE_KEY_MEDICAL_PROFILE,
  HIGH_RISK_CONDITIONS_CATALOG,
  COMMON_DRUG_ALLERGIES
} from "../data/medicalProfileData";
import { generateEmergencyPayload, generateQrSvg } from "../utils/emergencyQrGenerator";
import { EmergencyResponderModal } from "../components/medical/EmergencyResponderModal";
import { 
  Droplet, AlertTriangle, ShieldCheck, QrCode, Printer, 
  Plus, Trash2, Heart, FileText, PhoneCall, Stethoscope, 
  Hospital, ShieldAlert, Check, Copy, AlertOctagon, Share2, 
  Calendar, CreditCard, Sparkles, UserCheck, Shield
} from "lucide-react";

export const MedicalProfilePage: React.FC = () => {
  const { user, updateUser, showToast, t, syncClinicalEventToMemory } = useApp();

  // Load from localStorage or fallback to defaults merged with user's profile
  const [profile, setProfile] = useState<MedicalProfileData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MEDICAL_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load medical profile from localStorage", e);
    }

    return {
      ...INITIAL_DEFAULT_MEDICAL_PROFILE,
      bloodGroup: user.bloodGroup || INITIAL_DEFAULT_MEDICAL_PROFILE.bloodGroup,
      obgynName: user.doctorName || INITIAL_DEFAULT_MEDICAL_PROFILE.obgynName,
      hospitalName: user.hospitalName || INITIAL_DEFAULT_MEDICAL_PROFILE.hospitalName,
    };
  });

  const [activeTab, setActiveTab] = useState<"pass" | "blood" | "obstetric" | "risks_meds" | "official_ids">("pass");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [showResponderModal, setShowResponderModal] = useState(false);

  // Form local states
  const [newAllergy, setNewAllergy] = useState("");
  const [newCustomRisk, setNewCustomRisk] = useState("");
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");
  const [newMedIsAnticoagulant, setNewMedIsAnticoagulant] = useState(false);

  // Sync and generate QR Code
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_MEDICAL_PROFILE, JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to persist medical profile", err);
    }

    const payload = generateEmergencyPayload(profile, user);
    generateQrSvg(payload, 200).then((svg) => setQrSvg(svg));
  }, [profile, user]);

  const updateProfile = (updater: (prev: MedicalProfileData) => MedicalProfileData) => {
    setProfile((prev) => {
      const updated = updater(prev);
      updated.lastUpdated = new Date().toISOString();

      // Sync with AppContext user where relevant
      if (updated.bloodGroup !== user.bloodGroup || updated.obgynName !== user.doctorName || updated.hospitalName !== user.hospitalName) {
        updateUser({
          bloodGroup: updated.bloodGroup,
          doctorName: updated.obgynName,
          hospitalName: updated.hospitalName,
        });
      }

      return updated;
    });
  };

  // Allergy handlers
  const handleAddAllergy = (algName: string) => {
    const trimmed = algName.trim();
    if (!trimmed || profile.allergies.includes(trimmed)) return;
    updateProfile((p) => ({
      ...p,
      allergies: [...p.allergies, trimmed],
    }));
    syncClinicalEventToMemory?.("PROFILE", `Known Allergy Recorded: ${trimmed}`);
    setNewAllergy("");
    showToast(t("allergyAdded") || "Allergy added to emergency record");
  };

  const handleRemoveAllergy = (index: number) => {
    updateProfile((p) => ({
      ...p,
      allergies: p.allergies.filter((_, i) => i !== index),
    }));
  };

  // High risk condition toggle
  const handleToggleRiskCondition = (conditionId: string) => {
    const catalogItem = HIGH_RISK_CONDITIONS_CATALOG.find((c) => c.id === conditionId);
    if (!catalogItem) return;

    updateProfile((p) => {
      const currentConditions = p.highRiskConditions || [];
      const currentNotes = p.highRiskNotes || [];
      const isSelected = currentConditions.includes(conditionId);

      let nextConditions: string[];
      let nextNotes: string[];

      if (isSelected) {
        nextConditions = currentConditions.filter((c) => c !== conditionId);
        nextNotes = currentNotes.filter((n) => !n.startsWith(catalogItem.name));
      } else {
        nextConditions = [...currentConditions, conditionId];
        nextNotes = [...currentNotes, `${catalogItem.name} - ${catalogItem.description}`];
        syncClinicalEventToMemory?.("CARE_CONTEXT", `Precondition Flagged: ${catalogItem.name} (${catalogItem.description})`);
      }

      return {
        ...p,
        highRiskConditions: nextConditions,
        highRiskNotes: nextNotes,
      };
    });
  };

  const handleAddCustomRisk = () => {
    if (!newCustomRisk.trim()) return;
    updateProfile((p) => ({
      ...p,
      highRiskNotes: [...p.highRiskNotes, newCustomRisk.trim()],
    }));
    setNewCustomRisk("");
    showToast(t("clinicalNoteAdded") || "Clinical condition note added");
  };

  const handleRemoveRiskNote = (index: number) => {
    updateProfile((p) => ({
      ...p,
      highRiskNotes: p.highRiskNotes.filter((_, i) => i !== index),
    }));
  };

  // Medication handlers
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedDose.trim()) return;

    const newMed: CriticalDailyMedication = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      dose: newMedDose.trim(),
      frequency: newMedFreq.trim() || "Once daily",
      isAnticoagulant: newMedIsAnticoagulant,
      category: newMedIsAnticoagulant ? "anticoagulant" : "other",
    };

    updateProfile((p) => ({
      ...p,
      criticalDailyMedications: [...(p.criticalDailyMedications || []), newMed],
    }));

    setNewMedName("");
    setNewMedDose("");
    setNewMedFreq("");
    setNewMedIsAnticoagulant(false);
    showToast("Medication added to emergency record");
  };

  const handleRemoveMedication = (id: string) => {
    updateProfile((p) => ({
      ...p,
      criticalDailyMedications: (p.criticalDailyMedications || []).filter((m) => m.id !== id),
    }));
  };

  const isRhNegative = profile.rhFactor === "Negative";
  const hasPlacentaPrevia = profile.placentaLocation?.includes("Previa") || profile.placentaLocation?.includes("Low-Lying");

  const gpal = profile.gpal || {
    gravida: profile.gravidaCount,
    para: profile.paraCount,
    abortions: 0,
    living: profile.paraCount,
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Print Stylesheet ────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-emergency-card, #printable-emergency-card * {
            visibility: visible;
          }
          #printable-emergency-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Maternal Medical Profile & Emergency ID</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Emergency Medical Pass & Clinical Profile
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            Offline scannable emergency pass, ACOG first-responder directives, and comprehensive obstetric history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResponderModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Paramedic Triage View</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white dark:bg-[#1f1828] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-rose-500" />
            <span>Print Wallet Card</span>
          </button>
        </div>
      </div>

      {/* ── Life-Saving Clinical Alert Banner ────────────────────────────── */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase tracking-wider block text-amber-800 dark:text-amber-300 text-[11px]">
              ACOG / AHA Maternal Resuscitation Safety Directive:
            </span>
            <p className="mt-0.5 leading-relaxed font-medium">
              In any medical emergency, syncope, or trauma: <strong>DO NOT LIE FLAT ON BACK!</strong> Maintain a <strong>15°–30° Left Lateral Tilt</strong> (or manual left uterine displacement - LUD) to prevent IVC compression.
            </p>
          </div>
        </div>

        {isRhNegative && (
          <span className="shrink-0 px-3 py-1.5 rounded-full bg-red-500 text-white font-extrabold text-[10px] uppercase flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 fill-white" />
            <span>Rh-Negative (Anti-D Needed)</span>
          </span>
        )}
      </div>

      {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-rose-100 dark:border-rose-900/30 no-print">
        {[
          { id: "pass", label: "🪪 Digital Emergency Pass", icon: QrCode },
          { id: "blood", label: "🩸 Blood & Rh Protocol", icon: Droplet },
          { id: "obstetric", label: "📋 Obstetric History (G-P-A-L)", icon: FileText },
          { id: "risks_meds", label: "🛡️ Allergies, Risks & Meds", icon: ShieldAlert },
          { id: "official_ids", label: "🏥 Official IDs (ABHA / TPA)", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-white dark:bg-[#1a1424] text-gray-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: Digital Emergency Pass ───────────────────────────────── */}
      {activeTab === "pass" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Apple Wallet Style Emergency Card Widget */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-950 via-zinc-900 to-rose-950 text-white p-6 rounded-3xl shadow-2xl space-y-6 border border-rose-900/60 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      ID
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-rose-300 font-bold">
                        BloomNest Medical Pass
                      </div>
                      <div className="text-xs font-black text-white">EMERGENCY RESPONSE</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-red-500/30 text-red-300 border border-red-500/40 font-black text-xs uppercase flex items-center gap-1">
                    <Droplet className="w-3 h-3 fill-red-400" />
                    <span>{profile.bloodGroup} ({profile.rhFactor})</span>
                  </span>
                </div>

                {/* Patient Vitals */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Patient Name</div>
                    <div className="font-serif font-bold text-lg text-rose-100">{user.fullName}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Gestation</div>
                      <div className="font-bold text-rose-300">Week {user.currentWeek}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">Expected Due Date</div>
                      <div className="font-bold text-rose-300">{user.edd || "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Treating OB-GYN</div>
                    <div className="font-bold text-xs text-rose-200">{profile.obgynName}</div>
                    <div className="text-[11px] text-gray-400">{profile.hospitalName}</div>
                    <div className="text-[11px] text-rose-400 font-mono">{profile.obgynPhone}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Primary ICE Contact</div>
                    <div className="font-bold text-xs text-rose-200">{profile.emergencyContactName}</div>
                    <div className="text-[11px] text-rose-400 font-mono">{profile.emergencyContactPhone}</div>
                  </div>

                  {profile.allergies.length > 0 && (
                    <div className="pt-1">
                      <div className="text-[10px] uppercase text-red-400 font-bold tracking-wider">Severe Allergies</div>
                      <div className="text-xs font-extrabold text-red-300 truncate">
                        {profile.allergies.join(", ")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Scannable Offline QR Code */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold text-gray-200 uppercase">Emergency Paramedic Scan</div>
                    <div className="text-[10px] text-gray-400">Offline Camera Instant Access</div>
                  </div>

                  <div className="w-20 h-20 bg-white p-1 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    {qrSvg ? (
                      <div
                        className="w-18 h-18 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    ) : (
                      <QrCode className="w-16 h-16 text-slate-900" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2 relative z-10">
                <button
                  onClick={() => setShowResponderModal(true)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Full Screen Paramedic Pass</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-rose-200 font-bold text-xs rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Wallet ID Badge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Emergency Contacts & Quick Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Emergency Speed Dial Cards */}
            <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <PhoneCall className="w-4 h-4 text-rose-500" />
                <span>Immediate Emergency Speed-Dials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">Primary Obstetrician</div>
                  <div className="font-bold text-xs text-gray-900 dark:text-rose-100">{profile.obgynName}</div>
                  <div className="text-[11px] text-gray-500 dark:text-rose-400 font-mono">{profile.obgynPhone}</div>
                  <a
                    href={`tel:${profile.obgynPhone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Doctor
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Partner / Next of Kin</div>
                  <div className="font-bold text-xs text-gray-900 dark:text-rose-100">{profile.emergencyContactName}</div>
                  <div className="text-[11px] text-gray-500 dark:text-rose-400 font-mono">{profile.emergencyContactPhone}</div>
                  <a
                    href={`tel:${profile.emergencyContactPhone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Partner
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">National Ambulance</div>
                  <div className="font-bold text-xs text-gray-900 dark:text-rose-100">Maternal Emergency 108 / 102</div>
                  <div className="text-[11px] text-gray-500 dark:text-rose-400">Toll-Free 24/7 Helpline</div>
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call 108
                  </a>
                </div>
              </div>
            </div>

            {/* Treating Hospital & Emergency Address */}
            <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
                <Hospital className="w-4 h-4 text-rose-500" />
                <span>Designated Delivery Hospital & Paramedic Destination</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    value={profile.hospitalName}
                    onChange={(e) => updateProfile((p) => ({ ...p, hospitalName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                    Hospital Emergency Line
                  </label>
                  <input
                    type="tel"
                    value={profile.obgynPhone}
                    onChange={(e) => updateProfile((p) => ({ ...p, obgynPhone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                    Hospital Address / Landmark (For Ambulance Dispatch)
                  </label>
                  <input
                    type="text"
                    value={profile.hospitalAddress}
                    onChange={(e) => updateProfile((p) => ({ ...p, hospitalAddress: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Paramedic Resuscitation Instructions Card */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 p-5 rounded-3xl border border-red-200 dark:border-red-900/40 space-y-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4" />
                <span>Paramedic Obstetric Triage Protocol</span>
              </div>
              <ul className="text-xs space-y-1.5 text-gray-700 dark:text-rose-200">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Left Lateral Tilt (LUD):</strong> Always transport patient tilted 15–30° to the left using a wedge or manual displacement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>High Flow Oxygen:</strong> Provide 100% O2 via non-rebreather mask; fetal oxygenation drops rapidly during maternal hypoxia.</span>
                </li>
                {isRhNegative && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Rh-Negative Anti-D Alert:</strong> Document any abdominal impact; Anti-D immunoglobulin required within 72h.</span>
                  </li>
                )}
                {hasPlacentaPrevia && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Placenta Previa:</strong> Strictly no vaginal digital examination in antepartum hemorrhage!</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Blood Group & Rh Protocol ─────────────────────────────── */}
      {activeTab === "blood" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Maternal Blood Group & Rh-Sensitization Protocol</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Maternal Blood Group (ABO)
                </label>
                <select
                  value={profile.bloodGroup}
                  onChange={(e) => updateProfile((p) => ({ ...p, bloodGroup: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-black text-sm text-rose-600 dark:text-rose-300"
                >
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Rhesus Factor (Rh-D)
                </label>
                <select
                  value={profile.rhFactor}
                  onChange={(e: any) =>
                    updateProfile((p) => ({
                      ...p,
                      rhFactor: e.target.value,
                      rhOGAMNeeded: e.target.value === "Negative",
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-black text-sm"
                >
                  <option value="Positive">Rh-Positive (+)</option>
                  <option value="Negative">Rh-Negative (-)</option>
                </select>
              </div>
            </div>

            {/* Rh Sensitization Explanatory Box */}
            {profile.rhFactor === "Negative" ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Rh-Negative Incompatibility Safety Protocol</span>
                </div>
                <p className="leading-relaxed">
                  Because you are Rh-Negative, if baby inherits Rh-Positive blood from father, your body could produce antibodies (Rh sensitization). To safeguard your baby:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-medium">
                  <li><strong>Routine Prophylaxis:</strong> One dose of Anti-D (RhoGAM 300 mcg) is administered between <strong>Weeks 28 and 32</strong>.</li>
                  <li><strong>Postpartum Dose:</strong> Second dose within 72 hours of delivery if baby is confirmed Rh-positive.</li>
                  <li><strong>Emergency Trauma Guard:</strong> Any abdominal trauma, fall, amniocentesis, or vaginal bleeding requires Anti-D within 72 hours.</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-700 dark:text-emerald-300">Rh-Positive Status (Compatible)</span>
                  You are Rh-Positive. Rh-isoimmunization (sensitization) is not a clinical concern for this pregnancy. Anti-D (RhoGAM) is not required.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: Obstetric History (G-P-A-L) ────────────────────────────── */}
      {activeTab === "obstetric" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <span>Obstetric Parity Profile (Standard G-P-A-L)</span>
            </h3>

            {/* G-P-A-L Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-rose-300 mb-1">
                  Gravida (G)
                </label>
                <div className="text-[10px] text-gray-400 mb-1">Total Pregnancies</div>
                <input
                  type="number"
                  min="1"
                  value={gpal.gravida}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    updateProfile((p) => ({
                      ...p,
                      gravidaCount: val,
                      gpal: { ...gpal, gravida: val },
                    }));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 font-black text-sm"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-rose-300 mb-1">
                  Para (P)
                </label>
                <div className="text-[10px] text-gray-400 mb-1">Deliveries ≥ 20w</div>
                <input
                  type="number"
                  min="0"
                  value={gpal.para}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    updateProfile((p) => ({
                      ...p,
                      paraCount: val,
                      gpal: { ...gpal, para: val },
                    }));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 font-black text-sm"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-rose-300 mb-1">
                  Abortions (A)
                </label>
                <div className="text-[10px] text-gray-400 mb-1">Miscarriages / Ectopic</div>
                <input
                  type="number"
                  min="0"
                  value={gpal.abortions}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    updateProfile((p) => ({
                      ...p,
                      gpal: { ...gpal, abortions: val },
                    }));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 font-black text-sm"
                />
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-rose-300 mb-1">
                  Living (L)
                </label>
                <div className="text-[10px] text-gray-400 mb-1">Living Children</div>
                <input
                  type="number"
                  min="0"
                  value={gpal.living}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    updateProfile((p) => ({
                      ...p,
                      gpal: { ...gpal, living: val },
                    }));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#20182c] border border-rose-200 dark:border-rose-900/40 font-black text-sm"
                />
              </div>
            </div>

            {/* Placentation & Multiplicity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Placenta Location (From Ultrasound)
                </label>
                <select
                  value={profile.placentaLocation || "Normal (Anterior/Posterior)"}
                  onChange={(e: any) => updateProfile((p) => ({ ...p, placentaLocation: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="Normal (Anterior/Posterior)">Normal (Anterior / Posterior Fundal)</option>
                  <option value="Low-Lying Placenta">Low-Lying Placenta (&lt; 2cm from os)</option>
                  <option value="Placenta Previa (Grade I-IV)">Placenta Previa (Covering cervical os)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Pregnancy Multiplicity
                </label>
                <select
                  value={profile.pregnancyType || "Singleton"}
                  onChange={(e: any) => updateProfile((p) => ({ ...p, pregnancyType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="Singleton">Singleton (Single baby)</option>
                  <option value="Twin (DCDA)">Twin (DCDA - Separate sacs/placentas)</option>
                  <option value="Twin (MCDA)">Twin (MCDA - Shared placenta)</option>
                  <option value="Twin (MCMA)">Twin (MCMA - Shared sac & placenta)</option>
                  <option value="Higher Order">Higher Order Multiples (Triplets+)</option>
                </select>
              </div>
            </div>

            {/* Prior Cesarean Section Details */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#20182c] border border-rose-100 dark:border-rose-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-gray-900 dark:text-rose-100">Prior Cesarean Section / Hysterotomy Scar</span>
                  <p className="text-[11px] text-gray-500">Essential for labor management and VBAC clearance.</p>
                </div>

                <select
                  value={profile.previousCSection ? "yes" : "no"}
                  onChange={(e) => {
                    const hasPrior = e.target.value === "yes";
                    updateProfile((p) => ({
                      ...p,
                      previousCSection: hasPrior,
                      priorCesareanDetails: {
                        ...(p.priorCesareanDetails || {
                          hasPrior,
                          count: hasPrior ? 1 : 0,
                          scarType: "Low Transverse",
                          vbacCandidate: hasPrior,
                          notes: "",
                        }),
                        hasPrior,
                      },
                    }));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 font-bold text-xs"
                >
                  <option value="no">No Prior C-Section</option>
                  <option value="yes">Yes, Prior C-Section</option>
                </select>
              </div>

              {profile.previousCSection && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Scar Type</label>
                    <select
                      value={profile.priorCesareanDetails?.scarType || "Low Transverse"}
                      onChange={(e: any) =>
                        updateProfile((p) => ({
                          ...p,
                          priorCesareanDetails: {
                            ...(p.priorCesareanDetails || {
                              hasPrior: true,
                              count: 1,
                              scarType: e.target.value,
                              vbacCandidate: true,
                            }),
                            scarType: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 font-bold"
                    >
                      <option value="Low Transverse">Low Transverse (Standard, VBAC Eligible)</option>
                      <option value="Classical Vertical">Classical Vertical (High Rupture Risk, Repeat C-Section Req)</option>
                      <option value="Unknown">Unknown Scar Type</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Clinical Notes</label>
                    <input
                      type="text"
                      value={profile.previousCSectionNotes || ""}
                      onChange={(e) => updateProfile((p) => ({ ...p, previousCSectionNotes: e.target.value }))}
                      placeholder="e.g. Prior full-term delivery, healthy scar healing"
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: Allergies, High Risks & Critical Meds ────────────────── */}
      {activeTab === "risks_meds" && (
        <div className="max-w-4xl space-y-6">
          {/* Allergies Card */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              <span>Confirmed Drug & Medical Allergies</span>
            </h3>

            {/* Current Allergies Badges */}
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((alg, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-black text-xs flex items-center gap-2 border border-red-200 dark:border-red-900/40 shadow-2xs"
                >
                  <span>🚫 {alg}</span>
                  <button
                    onClick={() => handleRemoveAllergy(i)}
                    className="hover:text-red-950 dark:hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {profile.allergies.length === 0 && (
                <span className="text-xs text-gray-400 italic">No drug allergies recorded.</span>
              )}
            </div>

            {/* Quick-Add Predefined Allergy Pills */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Quick-Add Common Hospital Allergens:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DRUG_ALLERGIES.map((item) => {
                  const isAdded = profile.allergies.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => (isAdded ? null : handleAddAllergy(item))}
                      disabled={isAdded}
                      className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold border transition-all ${
                        isAdded
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-default"
                          : "bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100"
                      }`}
                    >
                      {isAdded ? `✓ ${item}` : `+ ${item}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Allergy Input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add other drug, anesthesia, or food allergy..."
                className="flex-1 px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleAddAllergy(newAllergy)}
              />
              <button
                onClick={() => handleAddAllergy(newAllergy)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Allergy
              </button>
            </div>
          </div>

          {/* High-Risk Clinical Conditions Catalog */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>High-Risk Perinatal Conditions & Paramedic Directives</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HIGH_RISK_CONDITIONS_CATALOG.map((condition) => {
                const isSelected = (profile.highRiskConditions || []).includes(condition.id);
                return (
                  <div
                    key={condition.id}
                    onClick={() => handleToggleRiskCondition(condition.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/40 shadow-xs"
                        : "bg-white dark:bg-[#20182c] border-gray-200 dark:border-rose-900/20 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-amber-500" : "bg-gray-300"}`} />
                        {condition.name}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        isSelected ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        {isSelected ? "Active" : "Add"}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-rose-400 mt-1 leading-snug">
                      {condition.description}
                    </p>

                    {isSelected && condition.paramedicAlert && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-500/15 text-[10px] text-amber-900 dark:text-amber-200 font-bold flex items-start gap-1.5">
                        <span>🚨</span>
                        <span>{condition.paramedicAlert}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Notes List */}
            {profile.highRiskNotes.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="block text-[11px] font-bold text-gray-500 dark:text-rose-300">
                  Custom Clinical Notes on File:
                </span>
                <div className="space-y-1.5">
                  {profile.highRiskNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#20182c] border border-gray-200 dark:border-rose-900/30 text-xs flex items-center justify-between"
                    >
                      <span className="text-gray-800 dark:text-rose-200 font-medium">📋 {note}</span>
                      <button
                        onClick={() => handleRemoveRiskNote(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Risk */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCustomRisk}
                onChange={(e) => setNewCustomRisk(e.target.value)}
                placeholder="Enter custom obstetric note (e.g. Previous Precipitous Labor, GBS Positive)..."
                className="flex-1 px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs"
              />
              <button
                onClick={handleAddCustomRisk}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Note
              </button>
            </div>
          </div>

          {/* Daily Critical Medications Card */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Heart className="w-4 h-4 text-purple-500" />
              <span>Daily Critical Medications (Anticoagulants, Thyroid, Insulin)</span>
            </h3>

            <div className="space-y-2">
              {(profile.criticalDailyMedications || []).map((med) => (
                <div
                  key={med.id}
                  className="p-3 rounded-2xl bg-gray-50 dark:bg-[#20182c] border border-gray-200 dark:border-rose-900/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-gray-900 dark:text-rose-100 flex items-center gap-2">
                      <span>{med.name}</span>
                      {med.isAnticoagulant && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold uppercase">
                          ⚠️ Anticoagulant / Antiplatelet
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-rose-400 mt-0.5">
                      Dose: <strong>{med.dose}</strong> · Timing: {med.frequency}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMedication(med.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Medication Form */}
            <form onSubmit={handleAddMedication} className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
              <span className="block font-bold text-xs text-gray-800 dark:text-rose-200">
                + Add Critical Prescription Medication
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Drug Name</label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="e.g. L-Thyroxine, Aspirin"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="e.g. 50 mcg, 150 mg"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    placeholder="e.g. Once daily morning fasting"
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1424] border border-rose-200 dark:border-rose-900/40 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={newMedIsAnticoagulant}
                    onChange={(e) => setNewMedIsAnticoagulant(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-purple-900 dark:text-purple-300">
                    Flag as Blood Thinner / Anticoagulant (Aspirin, Heparin, Clexane)
                  </span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 5: Official IDs (ABHA / TPA) ─────────────────────────────── */}
      {activeTab === "official_ids" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <CreditCard className="w-4 h-4 text-rose-500" />
              <span>Ayushman Bharat (ABHA), Hospital UHID & Maternity Insurance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  ABHA ID (Ayushman Bharat Health Account)
                </label>
                <input
                  type="text"
                  value={profile.officialIds?.abhaNumber || ""}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      officialIds: { ...(p.officialIds || {}), abhaNumber: e.target.value },
                    }))
                  }
                  placeholder="e.g. 91-4562-7891-3402"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">14-digit National Digital Health ID</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Hospital UHID / Patient MRN
                </label>
                <input
                  type="text"
                  value={profile.officialIds?.hospitalMrn || ""}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      officialIds: { ...(p.officialIds || {}), hospitalMrn: e.target.value },
                    }))
                  }
                  placeholder="e.g. UHID-CN-2026-8849"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Registration ID at Delivery Hospital</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Health Insurance Provider
                </label>
                <input
                  type="text"
                  value={profile.officialIds?.insuranceProvider || ""}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      officialIds: { ...(p.officialIds || {}), insuranceProvider: e.target.value },
                    }))
                  }
                  placeholder="e.g. Star Health / Care / HDFC ERGO"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Policy / TPA Card Number
                </label>
                <input
                  type="text"
                  value={profile.officialIds?.policyNumber || ""}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      officialIds: { ...(p.officialIds || {}), policyNumber: e.target.value },
                    }))
                  }
                  placeholder="e.g. POL-MAT-9942188"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Hospital Cashless TPA Desk Helpline
                </label>
                <input
                  type="tel"
                  value={profile.officialIds?.tpaDeskPhone || ""}
                  onChange={(e) =>
                    updateProfile((p) => ({
                      ...p,
                      officialIds: { ...(p.officialIds || {}), tpaDeskPhone: e.target.value },
                    }))
                  }
                  placeholder="+91 80 4455 6677"
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRINTABLE WALLET CUTOUT & HOSPITAL HANDOVER SHEET (Print Only) ── */}
      <div id="printable-emergency-card" className="hidden print:block text-black font-sans">
        <div className="border-4 border-black p-6 rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="border-b-2 border-black pb-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">BLOOMNEST MATERNAL EMERGENCY PASS</h1>
              <div className="text-xs font-bold text-gray-700">Official Obstetric Triage & Paramedic Card</div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black border-2 border-black px-2 py-1 rounded">
                {profile.bloodGroup} ({profile.rhFactor})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p><strong>Patient Name:</strong> {user.fullName} ({user.age || 28}y)</p>
              <p><strong>Current Gestation:</strong> Week {user.currentWeek} | <strong>EDD:</strong> {user.edd || "N/A"}</p>
              <p><strong>Parity (GPAL):</strong> {`G${gpal.gravida} P${gpal.para} A${gpal.abortions} L${gpal.living}`}</p>
              <p><strong>Prior C-Section:</strong> {profile.previousCSection ? `Yes (${profile.priorCesareanDetails?.scarType || "Low Transverse"})` : "No"}</p>
            </div>

            <div>
              <p><strong>OB-GYN:</strong> {profile.obgynName} ({profile.obgynPhone})</p>
              <p><strong>Delivery Hospital:</strong> {profile.hospitalName}</p>
              <p><strong>ICE Contact:</strong> {profile.emergencyContactName} ({profile.emergencyContactPhone})</p>
              <p><strong>ABHA ID:</strong> {profile.officialIds?.abhaNumber || "N/A"}</p>
            </div>
          </div>

          <div className="border-t-2 border-black pt-2 text-xs">
            <p><strong>Severe Allergies:</strong> {profile.allergies.length > 0 ? profile.allergies.join(", ") : "NKDA (No Known Allergies)"}</p>
            <p><strong>High Risk Conditions:</strong> {profile.highRiskNotes.length > 0 ? profile.highRiskNotes.join("; ") : "None"}</p>
            <p><strong>Critical Meds:</strong> {(profile.criticalDailyMedications || []).map(m => `${m.name} ${m.dose}`).join(", ") || "None"}</p>
          </div>

          <div className="border-t-2 border-black pt-2 text-[10px] font-bold">
            🚨 PARAMEDIC DIRECTIVE: DO NOT LIE FLAT ON BACK. Maintain 15-30° Left Lateral Tilt (LUD) during transit.
          </div>
        </div>
      </div>

      {/* ── Paramedic Responder Modal ────────────────────────────────────── */}
      <EmergencyResponderModal
        isOpen={showResponderModal}
        onClose={() => setShowResponderModal(false)}
        profile={profile}
        user={user}
      />
    </div>
  );
};
