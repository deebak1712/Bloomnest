import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { BirthPlanPreference, BirthPlanArchetype } from "../types";
import { 
  BIRTH_PLAN_ARCHETYPES, 
  INITIAL_DEFAULT_BIRTH_PLAN, 
  LOCAL_STORAGE_KEY_BIRTH_PLAN 
} from "../data/birthPlanData";
import { 
  FileText, Printer, CheckCircle2, Heart, ShieldAlert, 
  Sparkles, UserCheck, Baby, Stethoscope, ChevronRight, 
  Sun, Moon, Music, Activity, ShieldCheck, CheckSquare, 
  Square, Droplet, Eye, Clock, Scissors, AlertCircle
} from "lucide-react";

export const BirthPlanPage: React.FC = () => {
  const { user, showToast, emergencyContacts, t } = useApp();

  // Load from localStorage or fallback to defaults merged with user/partner info
  const [plan, setPlan] = useState<BirthPlanPreference>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BIRTH_PLAN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load birth plan from localStorage", e);
    }

    // Auto-detect primary partner name if available
    const partner = emergencyContacts.find(
      (c) => c.category === "partner" || c.relation.toLowerCase().includes("partner") || c.relation.toLowerCase().includes("husband")
    );

    return {
      ...INITIAL_DEFAULT_BIRTH_PLAN,
      birthPartnerName: partner ? partner.name : INITIAL_DEFAULT_BIRTH_PLAN.birthPartnerName,
    };
  });

  // Persist whenever plan changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BIRTH_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.error("Failed to persist birth plan", e);
    }
  }, [plan]);

  const updatePlan = (updater: (prev: BirthPlanPreference) => BirthPlanPreference) => {
    setPlan((prev) => {
      const next = updater(prev);
      next.lastUpdated = new Date().toISOString();
      return next;
    });
  };

  const handleSelectArchetype = (archetypeId: BirthPlanArchetype) => {
    const archetype = BIRTH_PLAN_ARCHETYPES.find((a) => a.id === archetypeId);
    if (!archetype) return;

    updatePlan((prev) => ({
      ...prev,
      ...archetype.preset,
      templateArchetype: archetypeId,
      birthPartnerName: prev.birthPartnerName, // preserve customized names
      birthPartnerRole: prev.birthPartnerRole,
    }));

    showToast(`Loaded ${archetype.name} template! 🌸`);
  };

  const togglePainManagement = (option: string) => {
    updatePlan((prev) => {
      const exists = prev.painManagement.includes(option);
      const updated = exists
        ? prev.painManagement.filter((p) => p !== option)
        : [...prev.painManagement, option];
      return { ...prev, painManagement: updated };
    });
  };

  const togglePushingPosition = (pos: string) => {
    updatePlan((prev) => {
      const current = prev.laborInterventions?.pushingPositions || [];
      const updated = current.includes(pos)
        ? current.filter((p) => p !== pos)
        : [...current, pos];
      return {
        ...prev,
        laborInterventions: {
          ...(prev.laborInterventions || {
            episiotomyPreference: "avoid_unless_emergency",
            amniotomyPreference: "discuss_first",
            fetalMonitoring: "continuous_wireless",
            pushingPositions: [],
          }),
          pushingPositions: updated,
        },
      };
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BIRTH_PLAN, JSON.stringify(plan));
      showToast("Birth plan saved successfully! Ready for hospital export. 📋");
    } catch (e) {
      showToast("Plan saved!");
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Print Stylesheet ────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-birth-plan, #printable-birth-plan * {
            visibility: visible;
          }
          #printable-birth-plan {
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

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-rose-500" />
            <span>Labor & Delivery Preferences</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Birth Plan Builder & Hospital Admission Export
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            Communicates your labor ambiance, pain relief, clinical intervention limits, and golden hour care clearly to your obstetric team.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white dark:bg-[#1a1523] border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-rose-500" />
            <span>Print Hospital PDF</span>
          </button>
        </div>
      </div>

      {/* ── 1-Click Clinical Archetype Selector ─────────────────────────── */}
      <div className="space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Choose a Clinical Baseline Archetype (1-Click Pre-fill):</span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Fully Customizable Below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {BIRTH_PLAN_ARCHETYPES.map((arch) => {
            const isSelected = plan.templateArchetype === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => handleSelectArchetype(arch.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? `${arch.colorClass} ${arch.borderClass} shadow-md scale-[1.02]`
                    : "bg-white dark:bg-[#1a1424] border-gray-100 dark:border-rose-900/30 hover:border-purple-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                      {arch.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  </div>
                  <h4 className="font-serif font-black text-sm text-gray-900 dark:text-rose-100 mt-2">
                    {arch.name}
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-rose-300 mt-1 leading-snug">
                    {arch.shortDesc}
                  </p>
                </div>

                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-300 pt-1">
                  {isSelected ? "✓ Active Template" : "Apply Template →"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Workspace Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Left 2 Cols: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Delivery Mode & Partner Role */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Baby className="w-4 h-4 text-rose-500" />
              <span>1. Delivery Mode & Birth Partner Role</span>
            </h3>

            {/* Delivery type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { id: "vaginal", title: "Vaginal Delivery", desc: "Spontaneous physiological birth unless medically indicated" },
                { id: "c-section-medically-required", title: "Trial with Backup C-Section", desc: "Vaginal labor trial with emergency surgical backup" },
                { id: "planned-c-section", title: "Elective / Planned C-Section", desc: "Pre-scheduled surgical cesarean delivery" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updatePlan((prev) => ({ ...prev, deliveryType: opt.id as any }))}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    plan.deliveryType === opt.id
                      ? "bg-rose-500 text-white border-rose-600 shadow-md scale-[1.01]"
                      : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-gray-800 dark:text-rose-200 hover:bg-rose-100/50"
                  }`}
                >
                  <div className="font-bold text-xs mb-1">{opt.title}</div>
                  <div className={`text-[11px] ${plan.deliveryType === opt.id ? "text-rose-100" : "text-gray-500 dark:text-rose-400"}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Partner Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Birth Partner Name</label>
                <input
                  type="text"
                  value={plan.birthPartnerName}
                  onChange={(e) => updatePlan((prev) => ({ ...prev, birthPartnerName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Partner Role & Advocacy</label>
                <input
                  type="text"
                  value={plan.birthPartnerRole}
                  onChange={(e) => updatePlan((prev) => ({ ...prev, birthPartnerRole: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Labor Environment & Mobility */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>2. Labor Suite Atmosphere & Maternal Mobility</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Lighting Preference</label>
                <select
                  value={plan.laborEnvironment?.lighting || "dim"}
                  onChange={(e: any) =>
                    updatePlan((prev) => ({
                      ...prev,
                      laborEnvironment: { ...(prev.laborEnvironment || { lighting: "dim", music: "playlist", mobility: "free_movement", clothing: "own_clothes" }), lighting: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="dim">Dim & Soft Ambiance (Oxytocin Friendly)</option>
                  <option value="standard">Standard Hospital Lighting</option>
                  <option value="dark">Dark Sanctuary Room</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Auditory & Music</label>
                <select
                  value={plan.laborEnvironment?.music || "playlist"}
                  onChange={(e: any) =>
                    updatePlan((prev) => ({
                      ...prev,
                      laborEnvironment: { ...(prev.laborEnvironment || { lighting: "dim", music: "playlist", mobility: "free_movement", clothing: "own_clothes" }), music: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="playlist">Personal Calming Labor Playlist</option>
                  <option value="mantras">Vedic Garbha Sanskar Mantras</option>
                  <option value="ambient">432Hz Ambient Soundscapes</option>
                  <option value="silence">Quiet & Undisturbed Silence</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Mobility During Labor</label>
                <select
                  value={plan.laborEnvironment?.mobility || "free_movement"}
                  onChange={(e: any) =>
                    updatePlan((prev) => ({
                      ...prev,
                      laborEnvironment: { ...(prev.laborEnvironment || { lighting: "dim", music: "playlist", mobility: "free_movement", clothing: "own_clothes" }), mobility: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="free_movement">Free Movement & Birth Ball</option>
                  <option value="shower_tub">Hydrotherapy (Shower / Tub)</option>
                  <option value="bed_with_monitoring">In Bed with Telemetry Monitoring</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Pain Management & Comfort Toolkit */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>3. Pain Relief & Comfort Preferences</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { id: "epidural", label: "Epidural Analgesia" },
                { id: "gas-air", label: "Entonox (Gas & Air)" },
                { id: "hydrotherapy", label: "Shower / Warm Water" },
                { id: "breathing", label: "Somatic Breathing / Pacer" },
                { id: "tens", label: "TENS Machine (Early Labor)" },
                { id: "massage", label: "Sacral Counterpressure" },
                { id: "birth-ball", label: "Peanut / Birth Ball" },
                { id: "hypnobirthing", label: "Hypnobirthing Calm Prompts" },
              ].map((item) => {
                const isSelected = plan.painManagement.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePainManagement(item.id)}
                    className={`p-3 rounded-2xl border text-left font-bold flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                        : "bg-rose-50/30 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-gray-700 dark:text-rose-200"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Clinical Labor Interventions & Pushing Postures */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Stethoscope className="w-4 h-4 text-emerald-500" />
              <span>4. Clinical Interventions & Pushing Postures (ACOG Standards)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Episiotomy Directive
                </label>
                <select
                  value={plan.laborInterventions?.episiotomyPreference || "avoid_unless_emergency"}
                  onChange={(e: any) =>
                    updatePlan((prev) => ({
                      ...prev,
                      laborInterventions: {
                        ...(prev.laborInterventions || {
                          episiotomyPreference: "avoid_unless_emergency",
                          amniotomyPreference: "discuss_first",
                          fetalMonitoring: "continuous_wireless",
                          pushingPositions: [],
                        }),
                        episiotomyPreference: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="avoid_unless_emergency">Avoid Routine Episiotomy (Perineal warm compresses)</option>
                  <option value="perineal_massage_first">Perineal Massage First (Doctor discretion)</option>
                  <option value="routine_ok">Doctor Discretion / Routine if Needed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">
                  Membrane Rupture (Amniotomy)
                </label>
                <select
                  value={plan.laborInterventions?.amniotomyPreference || "discuss_first"}
                  onChange={(e: any) =>
                    updatePlan((prev) => ({
                      ...prev,
                      laborInterventions: {
                        ...(prev.laborInterventions || {
                          episiotomyPreference: "avoid_unless_emergency",
                          amniotomyPreference: "discuss_first",
                          fetalMonitoring: "continuous_wireless",
                          pushingPositions: [],
                        }),
                        amniotomyPreference: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="discuss_first">Discuss with Mother First Before Rupturing</option>
                  <option value="spontaneous_only">Allow Spontaneous Rupture Only</option>
                  <option value="physician_discretion">Obstetrician Clinical Discretion</option>
                </select>
              </div>
            </div>

            {/* Pushing Positions Multi-Select */}
            <div className="pt-2">
              <label className="block font-semibold text-xs text-gray-700 dark:text-rose-200 mb-1.5">
                Desired Pushing Positions (Expands pelvic outlet by up to 28%):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: "squatting", label: "Supported Squatting" },
                  { id: "all_fours", label: "Hands & Knees (All-Fours)" },
                  { id: "side_lying", label: "Side-Lying Position" },
                  { id: "semi_sitting", label: "Semi-Sitting Supported" },
                ].map((pos) => {
                  const isChecked = (plan.laborInterventions?.pushingPositions || []).includes(pos.id);
                  return (
                    <div
                      key={pos.id}
                      onClick={() => togglePushingPosition(pos.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-800 dark:text-emerald-200"
                          : "bg-white dark:bg-[#1a1424] border-gray-200 dark:border-rose-900/30 text-gray-600 dark:text-rose-300"
                      }`}
                    >
                      {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-gray-400" />}
                      <span className="text-[11px]">{pos.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Gentle C-Section Contingencies */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>5. Family-Centered / Gentle C-Section Contingencies</span>
            </h3>

            <p className="text-[11px] text-gray-500">
              If an emergency or planned cesarean section is required, these preferences safeguard maternal bonding:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { key: "partnerInOT", label: "Birth Partner Present in Operating Theatre" },
                { key: "loweredDrape", label: "Lower Surgical Drape to Witness Baby's Birth" },
                { key: "immediateSkinToSkin", label: "Immediate Skin-to-Skin in OT / Recovery" },
                { key: "musicInOT", label: "Calming Music Permitted in Operating Theatre" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer bg-rose-50/30 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                  <input
                    type="checkbox"
                    checked={!!(plan.cSectionContingency as any)?.[item.key]}
                    onChange={(e) =>
                      updatePlan((prev) => ({
                        ...prev,
                        cSectionContingency: {
                          ...(prev.cSectionContingency || { partnerInOT: true, loweredDrape: true, immediateSkinToSkin: true, musicInOT: true, clearExplanationOfSteps: true }),
                          [item.key]: e.target.checked,
                        },
                      }))
                    }
                    className="accent-rose-500 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-gray-800 dark:text-rose-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 6: The Golden Hour & Newborn Protocol */}
          <div className="bg-white dark:bg-[#1a1424] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>6. The Golden Hour & Immediate Newborn Care</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Skin-to-Skin Postpartum</label>
                <select
                  value={plan.skinToSkin}
                  onChange={(e: any) => updatePlan((prev) => ({ ...prev, skinToSkin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="immediate">Immediate Uninterrupted Golden Hour (60 mins)</option>
                  <option value="delayed">After Brief Vital Assessment</option>
                  <option value="partner-if-c-section">Partner Skin-to-Skin if Mother Incapacitated</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 dark:text-rose-300 mb-1">Cord Clamping Timing</label>
                <select
                  value={plan.cordClamping}
                  onChange={(e: any) => updatePlan((prev) => ({ ...prev, cordClamping: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 font-bold"
                >
                  <option value="delayed-1-3-mins">Delayed Cord Clamping (1–3 Mins - Boosts Iron)</option>
                  <option value="immediate">Immediate Cord Clamping</option>
                  <option value="cord-blood-banking">Cord Blood Stem Cell Collection Kit Ready</option>
                </select>
              </div>
            </div>

            {/* Newborn Care Checkboxes */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: "delayedBathing", label: "Delay Baby Bath for 24 Hours (Preserve Vernix)" },
                { key: "breastfeedingSupport", label: "Lactation Specialist Latch Assessment" },
                { key: "eyeOintment", label: "Erythromycin Eye Ointment Prophylaxis" },
                { key: "hepBVac", label: "Hepatitis B & Vitamin K Shot at Birth" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer bg-rose-50/30 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  <input
                    type="checkbox"
                    checked={(plan.newbornProcedures as any)[item.key]}
                    onChange={(e) =>
                      updatePlan((prev) => ({
                        ...prev,
                        newbornProcedures: { ...prev.newbornProcedures, [item.key]: e.target.checked },
                      }))
                    }
                    className="accent-rose-500 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-gray-800 dark:text-rose-200">{item.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-xs text-gray-600 dark:text-rose-300 mb-1">
                Special Labor Instructions / Cultural Requests
              </label>
              <textarea
                rows={2}
                value={plan.specialNotes}
                onChange={(e) => updatePlan((prev) => ({ ...prev, specialNotes: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Admission Card Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 text-white p-6 rounded-3xl shadow-xl space-y-5 border border-white/20">
            <div className="border-b border-white/20 pb-3">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-rose-200">
                Official Clinical Handoff
              </div>
              <h2 className="font-serif text-xl font-bold mt-0.5">Birth Plan Summary</h2>
              <p className="text-xs text-rose-100 mt-0.5">
                {user.fullName} · Week {user.currentWeek} (EDD: {user.edd || "N/A"})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-rose-200 block">Delivery Archetype:</span>
                <span className="font-black text-sm capitalize">{plan.deliveryType.replace(/-/g, " ")}</span>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-200 block">Pain Relief Chosen:</span>
                <div className="flex flex-wrap gap-1">
                  {plan.painManagement.map((pm) => (
                    <span key={pm} className="px-2 py-0.5 rounded-md bg-white/20 font-bold capitalize text-[10px]">
                      {pm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-rose-200 block">Birth Partner & Advocate:</span>
                <div className="font-bold">{plan.birthPartnerName}</div>
                <div className="text-[11px] opacity-85">{plan.birthPartnerRole}</div>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/15 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-200 block">Key Postpartum Directives:</span>
                <ul className="text-[11px] space-y-0.5 opacity-90">
                  <li>• Skin-to-skin: <strong>{plan.skinToSkin}</strong></li>
                  <li>• Cord clamping: <strong>{plan.cordClamping}</strong></li>
                  <li>• Episiotomy: <strong>{plan.laborInterventions?.episiotomyPreference || "Avoid unless emergency"}</strong></li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-white text-rose-700 font-extrabold text-xs rounded-2xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print 1-Page Admission PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── PRINTABLE 1-PAGE VISUAL ADMISSION HANDOVER (Print Only) ──────── */}
      <div id="printable-birth-plan" className="hidden print:block text-black font-sans leading-tight">
        <div className="border-4 border-black p-6 rounded-2xl max-w-2xl mx-auto space-y-4">
          <div className="border-b-2 border-black pb-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">BLOOMNEST MATERNAL BIRTH PREFERENCES</h1>
              <div className="text-xs font-bold text-gray-700">Official Obstetric Triage & Labor Ward Admission Handoff</div>
            </div>
            <div className="text-right text-xs">
              <p><strong>Patient:</strong> {user.fullName}</p>
              <p><strong>Gestation:</strong> Week {user.currentWeek} | <strong>EDD:</strong> {user.edd || "N/A"}</p>
              <p><strong>Blood:</strong> {user.bloodGroup || "O+"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border p-3 rounded-lg space-y-1">
              <h4 className="font-bold uppercase text-[11px] text-gray-900 border-b pb-1">1. Delivery & Partner</h4>
              <p><strong>Mode:</strong> {plan.deliveryType.replace(/-/g, " ")}</p>
              <p><strong>Partner:</strong> {plan.birthPartnerName} ({plan.birthPartnerRole})</p>
              <p><strong>Partner in OT:</strong> {plan.cSectionContingency?.partnerInOT ? "Yes, requested" : "No"}</p>
            </div>

            <div className="border p-3 rounded-lg space-y-1">
              <h4 className="font-bold uppercase text-[11px] text-gray-900 border-b pb-1">2. Pain Management</h4>
              <p><strong>Preferences:</strong> {plan.painManagement.join(", ")}</p>
              <p><strong>Mobility:</strong> {plan.laborEnvironment?.mobility || "Free movement"}</p>
            </div>

            <div className="border p-3 rounded-lg space-y-1">
              <h4 className="font-bold uppercase text-[11px] text-gray-900 border-b pb-1">3. Interventions & Pushing</h4>
              <p><strong>Episiotomy:</strong> {plan.laborInterventions?.episiotomyPreference || "Avoid unless emergency"}</p>
              <p><strong>Membranes:</strong> {plan.laborInterventions?.amniotomyPreference || "Discuss first"}</p>
              <p><strong>Pushing Posture:</strong> {(plan.laborInterventions?.pushingPositions || []).join(", ") || "Physiological upright"}</p>
            </div>

            <div className="border p-3 rounded-lg space-y-1">
              <h4 className="font-bold uppercase text-[11px] text-gray-900 border-b pb-1">4. Golden Hour & Newborn</h4>
              <p><strong>Skin-to-Skin:</strong> {plan.skinToSkin}</p>
              <p><strong>Cord Clamping:</strong> {plan.cordClamping}</p>
              <p><strong>Bathing:</strong> {plan.newbornProcedures.delayedBathing ? "Delay 24 hours" : "Standard"}</p>
              <p><strong>Feeding:</strong> Exclusive breastfeeding latch</p>
            </div>
          </div>

          <div className="border-t-2 border-black pt-2 text-xs">
            <p><strong>Special Instructions:</strong> {plan.specialNotes || "None"}</p>
          </div>

          <div className="border-t border-gray-300 pt-6 flex items-center justify-between text-xs">
            <div>
              <p>Patient Signature: _______________________</p>
            </div>
            <div>
              <p>Attending Obstetrician Endorsement: _______________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
