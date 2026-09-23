import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { 
  BirthReadinessCheckItem, 
  ReadinessPillar,
  AmnioticLeakFluidColor,
  AmnioticLeakAmount,
  AmnioticLeakOdor,
  DepartureEvaluationInput
} from "../types";
import { 
  READINESS_PILLARS, 
  DEFAULT_READINESS_ITEMS, 
  LOCAL_STORAGE_KEY_BIRTH_READINESS,
  LABOR_WARNING_SIGNS,
  LaborWarningSign,
  evaluateTacoSymptoms,
  calculateHospitalDeparture,
  PARTNER_DEPARTURE_DRILL,
  PartnerDrillItem
} from "../data/birthReadinessData";
import { 
  ShieldCheck, CheckCircle2, Circle, AlertTriangle, 
  Briefcase, FileText, PhoneCall, Stethoscope, Car, 
  Sparkles, AlertCircle, HeartHandshake, Baby, Printer, 
  Droplet, Clock, Plus, Trash2, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Info, HelpCircle, Flame, MapPin
} from "lucide-react";

export const BirthReadinessPage: React.FC = () => {
  const { user, showToast, emergencyContacts, hospitalBag, setActivePage, t } = useApp();
  const currentWeek = Math.max(1, Math.min(40, user?.currentWeek || 24));
  const fetalImage = `/assets/cinematic/fetus_week_${currentWeek}.jpg`;

  // Active view tab
  const [activeTab, setActiveTab] = useState<"checklist" | "warning_signs" | "taco_evaluator" | "departure_calc" | "partner_drill">("checklist");

  // Checklist state with localStorage persistence
  const [items, setItems] = useState<BirthReadinessCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BIRTH_READINESS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load birth readiness checklist", e);
    }
    return DEFAULT_READINESS_ITEMS;
  });

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BIRTH_READINESS, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist birth readiness checklist", e);
    }
  }, [items]);

  // Filters for checklist
  const [selectedPillar, setSelectedPillar] = useState<ReadinessPillar | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "essential" | "recommended" | "optional">("all");
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customPillar, setCustomPillar] = useState<ReadinessPillar>("documents");
  const [customPriority, setCustomPriority] = useState<"essential" | "recommended" | "optional">("essential");

  // Warning signs filter & accordion state
  const [warningFilter, setWarningFilter] = useState<"all" | "emergency" | "urgent" | "normal">("all");
  const [expandedWarningId, setExpandedWarningId] = useState<string | null>("ws-1");

  // TACO Evaluator state
  const [tacoTime, setTacoTime] = useState<string>("< 2 hours ago");
  const [tacoAmount, setTacoAmount] = useState<AmnioticLeakAmount>("continuous_trickle");
  const [tacoColor, setTacoColor] = useState<AmnioticLeakFluidColor>("clear_straw");
  const [tacoOdor, setTacoOdor] = useState<AmnioticLeakOdor>("sweet_bleach");

  // Departure Calculator state
  const [isFirstBaby, setIsFirstBaby] = useState(true);
  const [isGbsPositive, setIsGbsPositive] = useState(false);
  const [hasWaterBroken, setHasWaterBroken] = useState(false);
  const [distanceMinutes, setDistanceMinutes] = useState(30);
  const [contractionIntervalMinutes, setContractionIntervalMinutes] = useState(5);
  const [contractionDurationSeconds, setContractionDurationSeconds] = useState(60);
  const [regularityDurationHours, setRegularityDurationHours] = useState(1);

  // Partner Drill state
  const [partnerDrillItems, setPartnerDrillItems] = useState<PartnerDrillItem[]>(() => {
    try {
      const saved = localStorage.getItem("bloomnest_partner_departure_drill");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PARTNER_DEPARTURE_DRILL;
  });

  const togglePartnerDrillItem = (id: string) => {
    setPartnerDrillItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item));
      try {
        localStorage.setItem("bloomnest_partner_departure_drill", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Cross-module integration checks
  const birthPlanActive = useMemo(() => {
    try {
      return !!localStorage.getItem("bloomnest_birth_plan_preferences_v2");
    } catch (e) {
      return false;
    }
  }, []);

  const packedBagCount = useMemo(() => {
    return (hospitalBag || []).filter((i) => i.isPacked).length;
  }, [hospitalBag]);

  const primaryPartner = useMemo(() => {
    return emergencyContacts?.find((c) => c.isPrimary || c.category === "partner") || null;
  }, [emergencyContacts]);

  const doctorContact = useMemo(() => {
    return emergencyContacts?.find((c) => c.category === "doctor") || {
      name: user?.doctorName || "Dr. Priya Sharma",
      phone: "+91 98400 12345"
    };
  }, [emergencyContacts, user]);

  // Overall calculations
  const totalCount = items.length;
  const completedCount = items.filter((i) => i.isDone).length;
  const readinessPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Pillar statistics
  const pillarStats = useMemo(() => {
    const map: Record<ReadinessPillar, { total: number; done: number; pct: number }> = {
      documents: { total: 0, done: 0, pct: 0 },
      hospital_bag: { total: 0, done: 0, pct: 0 },
      birth_plan: { total: 0, done: 0, pct: 0 },
      logistics: { total: 0, done: 0, pct: 0 },
      newborn_home: { total: 0, done: 0, pct: 0 },
      medical_triage: { total: 0, done: 0, pct: 0 },
    };

    items.forEach((item) => {
      if (map[item.pillar]) {
        map[item.pillar].total++;
        if (item.isDone) map[item.pillar].done++;
      }
    });

    Object.keys(map).forEach((k) => {
      const p = k as ReadinessPillar;
      map[p].pct = map[p].total > 0 ? Math.round((map[p].done / map[p].total) * 100) : 0;
    });

    return map;
  }, [items]);

  // Toggle item completion
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isDone = !item.isDone;
          showToast(isDone ? `Marked: "${item.title}" complete!` : `Pending: "${item.title}"`);
          return { ...item, isDone };
        }
        return item;
      })
    );
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newItem: BirthReadinessCheckItem = {
      id: `custom-${Date.now()}`,
      pillar: customPillar,
      title: customTitle.trim(),
      description: customDesc.trim() || "Custom delivery readiness preparation item.",
      isDone: false,
      priority: customPriority,
      isCustom: true
    };

    setItems((prev) => [newItem, ...prev]);
    setCustomTitle("");
    setCustomDesc("");
    setShowAddCustomModal(false);
    showToast("Added custom preparation checklist item! 🌸");
  };

  // Delete custom item
  const handleDeleteCustomItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast("Removed checklist item.");
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesPillar = selectedPillar === "all" || item.pillar === selectedPillar;
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
      return matchesPillar && matchesPriority;
    });
  }, [items, selectedPillar, priorityFilter]);

  // Filtered warning signs
  const filteredWarningSigns = useMemo(() => {
    return LABOR_WARNING_SIGNS.filter((ws) => {
      if (warningFilter === "all") return true;
      return ws.severity === warningFilter;
    });
  }, [warningFilter]);

  // TACO diagnostic evaluation
  const tacoResult = useMemo(() => {
    return evaluateTacoSymptoms(tacoTime, tacoAmount, tacoColor, tacoOdor);
  }, [tacoTime, tacoAmount, tacoColor, tacoOdor]);

  // Departure evaluation
  const departureInput: DepartureEvaluationInput = {
    isFirstBaby,
    isGbsPositive,
    hasWaterBroken,
    distanceMinutes,
    contractionIntervalMinutes,
    contractionDurationSeconds,
    regularityDurationHours
  };
  const departureResult = useMemo(() => {
    return calculateHospitalDeparture(departureInput);
  }, [departureInput]);

  const partnerDrillCompletedCount = partnerDrillItems.filter((i) => i.isDone).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Screen Header with Pastel Blush & 3D Fetal Studio Preview ── */}
      <div className="pastel-blush-card p-6 md:p-8 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-rose-200/50 shadow-sm relative overflow-hidden">
        <div className="flex items-start md:items-center gap-4 z-10">
          <div 
            onClick={() => setActivePage("baby-development")}
            className="relative group cursor-pointer shrink-0 rounded-2xl overflow-hidden border-2 border-rose-300/60 shadow-md hover:scale-105 transition-all duration-300 w-16 h-16 md:w-20 md:h-20 bg-rose-900/10"
            title="Click to view 3D Fetal Studio"
          >
            <img 
              src={fetalImage} 
              alt={`Week ${currentWeek} Baby Preview`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/assets/cinematic/fetus_week_24.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
              <span className="text-[9px] font-bold text-white bg-rose-600/80 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                W{currentWeek} 3D
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>ACOG Clinical Labor Triage & Preparation Studio</span>
            </div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
              Delivery Readiness & Labor Warning Signs
            </h1>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-rose-200 mt-1 max-w-xl">
              Week {currentWeek} · Comprehensive 5-pillar hospital preparation, TACO membrane leak triage, and departure calculator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/50 bg-white/80 dark:bg-[#1a1523]/80 backdrop-blur-sm text-gray-700 dark:text-rose-200 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-rose-500" />
            <span>Print Dossier</span>
          </button>

          <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white p-3.5 rounded-2xl shadow-md">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-rose-100">Total Score</div>
              <div className="font-serif text-2xl font-extrabold">{readinessPercent}%</div>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-xs bg-white/10">
              {completedCount}/{totalCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dynamic 5-Pillar Gauge & Cross-Module Pulse ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Pillar Breakdown */}
        <div className="lg:col-span-2 pastel-mint-card p-5 rounded-3xl border border-emerald-200/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-rose-200">
                5-Pillar Preparation Gauge
              </h2>
            </div>
            <span className="text-xs font-extrabold text-rose-500">{readinessPercent}% Admission Ready</span>
          </div>

          <div className="w-full bg-rose-100/70 dark:bg-rose-950/50 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {READINESS_PILLARS.map((pillar) => {
              const stat = pillarStats[pillar.id] || { total: 0, done: 0, pct: 0 };
              return (
                <div
                  key={pillar.id}
                  onClick={() => {
                    setSelectedPillar(pillar.id);
                    setActiveTab("checklist");
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedPillar === pillar.id && activeTab === "checklist"
                      ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 shadow-sm"
                      : "border-gray-100 dark:border-rose-900/20 bg-gray-50/50 dark:bg-[#15101d] hover:border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-rose-200">
                    <span className="truncate">{pillar.shortName}</span>
                    <span className="text-rose-500 font-extrabold">{stat.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-rose-950/60 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${pillar.colorClass} transition-all duration-500`}
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-rose-300/70 mt-1">
                    {stat.done}/{stat.total} items done
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Integrated Module Status */}
        <div className="bg-gradient-to-br from-purple-50/70 to-rose-50/70 dark:from-[#1b1526] dark:to-[#171120] p-5 rounded-3xl border border-purple-100 dark:border-purple-900/30 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Cross-Module Live Sync</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-rose-300 mt-1">
              Live status from companion pregnancy studios:
            </p>

            <div className="space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <span className="font-semibold text-gray-700 dark:text-rose-200">🌸 Birth Plan Studio</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${birthPlanActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {birthPlanActive ? "Configured & Saved" : "Action Required"}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-purple-100 dark:purple-900/20">
                <span className="font-semibold text-gray-700 dark:text-rose-200">🧳 Hospital Bags</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                  {packedBagCount} Items Packed
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/20">
                <span className="font-semibold text-gray-700 dark:text-rose-200">👩‍⚕️ OB-GYN Caregiver</span>
                <span className="text-[11px] font-bold text-gray-800 dark:text-rose-200 truncate max-w-[130px]">
                  {doctorContact.name}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActivePage("emergency-contacts")}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency SOS Dispatch Hub ↗</span>
          </button>
        </div>
      </div>

      {/* ── Studio Navigation Tabs ── */}
      <div className="flex flex-wrap gap-2 border-b border-rose-100 dark:border-rose-900/30 pb-2">
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "checklist"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Preparation Checklist ({completedCount}/{totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("warning_signs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "warning_signs"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>ACOG Labor Warning Signs (12)</span>
        </button>

        <button
          onClick={() => setActiveTab("taco_evaluator")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "taco_evaluator"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Amniotic Leak vs Discharge (TACO Test)</span>
        </button>

        <button
          onClick={() => setActiveTab("departure_calc")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "departure_calc"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Hospital Departure Rule (5-1-1)</span>
        </button>

        <button
          onClick={() => setActiveTab("partner_drill")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === "partner_drill"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] text-gray-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Partner 5-Min Departure Drill ({partnerDrillCompletedCount}/6)</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: PREPARATION CHECKLIST                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "checklist" && (
        <div className="space-y-4">
          {/* Sub-filters & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#1a1523] p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            {/* Category pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedPillar("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedPillar === "all"
                    ? "bg-rose-500 text-white"
                    : "bg-gray-100 dark:bg-rose-950/40 text-gray-600 dark:text-rose-200 hover:bg-rose-100"
                }`}
              >
                All ({items.length})
              </button>
              {READINESS_PILLARS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPillar(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedPillar === p.id
                      ? "bg-rose-500 text-white"
                      : "bg-gray-100 dark:bg-rose-950/40 text-gray-600 dark:text-rose-200 hover:bg-rose-100"
                  }`}
                >
                  {p.shortName} ({items.filter((i) => i.pillar === p.id).length})
                </button>
              ))}
            </div>

            {/* Priority & Add Custom */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e: any) => setPriorityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-rose-900/40 text-gray-800 dark:text-rose-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">All Priorities</option>
                <option value="essential">🔴 Essential Only</option>
                <option value="recommended">🟡 Recommended</option>
                <option value="optional">⚪ Optional</option>
              </select>

              <button
                onClick={() => setShowAddCustomModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Add Custom Item Inline Modal */}
          {showAddCustomModal && (
            <form
              onSubmit={handleAddCustomItem}
              className="bg-rose-50/70 dark:bg-[#1e1728] p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300">
                  Add Personal Preparation Item
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Item title (e.g., Pack Cord Blood Collection Box)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-900 dark:text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description or notes (optional)"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-900 dark:text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 dark:text-rose-300">Pillar:</span>
                  <select
                    value={customPillar}
                    onChange={(e: any) => setCustomPillar(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-800 dark:text-rose-200 text-xs"
                  >
                    {READINESS_PILLARS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <span className="text-gray-600 dark:text-rose-300 ml-2">Priority:</span>
                  <select
                    value={customPriority}
                    onChange={(e: any) => setCustomPriority(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-800 dark:text-rose-200 text-xs"
                  >
                    <option value="essential">Essential</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          )}

          {/* Checklist Items List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isDone
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-gray-800 dark:text-rose-200"
                    : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 text-gray-900 dark:text-rose-100 hover:border-rose-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-0.5 shrink-0 focus:outline-none"
                  >
                    {item.isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-current text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-rose-500 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${item.isDone ? "line-through opacity-75 text-emerald-900 dark:text-emerald-300" : "text-gray-900 dark:text-rose-100"}`}>
                          {item.title}
                        </span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 dark:bg-rose-950/50 text-gray-500">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            item.priority === "essential"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                              : item.priority === "recommended"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200"
                          }`}
                        >
                          {item.priority}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.isDone
                              ? "bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
                              : "bg-gray-100 dark:bg-rose-950/40 text-gray-600 dark:text-rose-300"
                          }`}
                        >
                          {item.isDone ? "Completed" : "Pending"}
                        </span>

                        {item.isCustom && (
                          <button
                            onClick={() => handleDeleteCustomItem(item.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-rose-300/80">
                      {item.description}
                    </p>

                    {item.clinicalTip && (
                      <div className="flex items-start gap-1.5 p-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-800 dark:text-blue-300 mt-2">
                        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span><strong>Clinical Tip:</strong> {item.clinicalTip}</span>
                      </div>
                    )}

                    {item.actionRoute && (
                      <div className="pt-1.5">
                        <button
                          onClick={() => setActivePage(item.actionRoute as any)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 underline underline-offset-2"
                        >
                          <span>{item.actionLabel || "View Companion Feature"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: ACOG LABOR WARNING SIGNS & EMERGENCY TRIAGE                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "warning_signs" && (
        <div className="space-y-4">
          {/* Triage Speed Dial Strip */}
          <div className="bg-rose-50 dark:bg-[#1e1526] p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Emergency Obstetric Triage Hotlines
              </span>
              <p className="text-xs text-gray-600 dark:text-rose-300 mt-0.5">
                Experiencing acute bleeding, meconium fluid, or rigid pain? Connect with first responders instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:108"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 108 Ambulance</span>
              </a>

              <a
                href={`tel:${doctorContact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Call {doctorContact.name}</span>
              </a>
            </div>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setWarningFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                warningFilter === "all"
                  ? "bg-gray-900 text-white dark:bg-rose-100 dark:text-gray-900"
                  : "bg-white dark:bg-[#1a1523] text-gray-700 dark:text-rose-200 border border-gray-200 dark:border-rose-900/40"
              }`}
            >
              All Clinical Signs ({LABOR_WARNING_SIGNS.length})
            </button>
            <button
              onClick={() => setWarningFilter("emergency")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                warningFilter === "emergency"
                  ? "bg-rose-600 text-white"
                  : "bg-white dark:bg-[#1a1523] text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
              }`}
            >
              🚨 Red Emergencies ({LABOR_WARNING_SIGNS.filter((ws) => ws.severity === "emergency").length})
            </button>
            <button
              onClick={() => setWarningFilter("urgent")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                warningFilter === "urgent"
                  ? "bg-amber-600 text-white"
                  : "bg-white dark:bg-[#1a1523] text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40"
              }`}
            >
              ⚠️ Urgent Doctor Inquiries ({LABOR_WARNING_SIGNS.filter((ws) => ws.severity === "urgent").length})
            </button>
            <button
              onClick={() => setWarningFilter("normal")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                warningFilter === "normal"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-[#1a1523] text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
              }`}
            >
              🟢 Normal Pre-Labor Signs ({LABOR_WARNING_SIGNS.filter((ws) => ws.severity === "normal").length})
            </button>
          </div>

          {/* Signs Accordion */}
          <div className="space-y-3">
            {filteredWarningSigns.map((ws) => {
              const isExpanded = expandedWarningId === ws.id;
              return (
                <div
                  key={ws.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    ws.severity === "emergency"
                      ? "border-rose-200 dark:border-rose-900/40 bg-white dark:bg-[#1a1523]"
                      : ws.severity === "urgent"
                      ? "border-amber-200 dark:border-amber-900/40 bg-white dark:bg-[#1a1523]"
                      : "border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-[#1a1523]"
                  }`}
                >
                  <div
                    onClick={() => setExpandedWarningId(isExpanded ? null : ws.id)}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-rose-950/20 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ws.severity === "emergency"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              : ws.severity === "urgent"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          }`}
                        >
                          {ws.badgeText}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100">{ws.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-rose-300">{ws.subtitle}</p>
                    </div>

                    <div className="shrink-0 text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-gray-100 dark:border-rose-900/20 space-y-3 bg-gray-50/40 dark:bg-black/20">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#15101d] border border-gray-100 dark:border-rose-900/30 text-xs text-gray-700 dark:text-rose-200 space-y-1">
                        <div className="font-bold text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                          <span>Clinical Diagnostic Rationale:</span>
                        </div>
                        <p>{ws.clinicalExplanation}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-800 dark:text-rose-200">
                          Recommended Action Protocol:
                        </span>
                        <ul className="space-y-1 text-xs text-gray-600 dark:text-rose-300 list-disc list-inside">
                          {ws.actionProtocol.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">{step}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        {ws.callAction === "108" && (
                          <a
                            href="tel:108"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Dial 108 Casualty</span>
                          </a>
                        )}

                        {ws.callAction === "doctor" && (
                          <a
                            href={`tel:${doctorContact.phone.replace(/\s+/g, "")}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call {doctorContact.name}</span>
                          </a>
                        )}

                        {ws.callAction === "monitor" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Safe to monitor at home</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: AMNIOTIC LEAK VS DISCHARGE (THE TACO TEST)                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "taco_evaluator" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#141527] dark:to-[#171b30] p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Droplet className="w-4 h-4" />
              <span>ACOG Clinical TACO Assessment Tool</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-blue-100 mt-1">
              Did My Water Break? (Amniotic Leak vs Bladder Incontinence)
            </h2>
            <p className="text-xs text-gray-600 dark:text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Expectant mothers often experience moisture near term. The <strong>TACO protocol</strong> evaluates <strong>T</strong>ime, <strong>A</strong>mount, <strong>C</strong>olor, and <strong>O</strong>dor to differentiate rupture of membranes from normal 3rd-trimester leukorrhea or involuntary bladder leakage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Form Inputs */}
            <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-rose-200">
                1. Select Observed Symptoms
              </h3>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-rose-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Time: When did fluid leakage start?</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "< 2 hours ago", label: "< 2 Hours" },
                    { val: "2 - 12 hours ago", label: "2 - 12 Hours" },
                    { val: "> 12 hours ago", label: "> 12 Hours" }
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setTacoTime(t.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        tacoTime === t.val
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-gray-50 dark:bg-black/30 text-gray-700 dark:text-rose-200 border-gray-200 dark:border-rose-900/30"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-rose-200">
                  Amount: How much fluid was released?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: "continuous_trickle", label: "Continuous Trickle", sub: "Keeps leaking on standing" },
                    { val: "sudden_gush", label: "Sudden Gush", sub: "Soaked through pants/bed" },
                    { val: "damp_spot_only", label: "Damp Spot Only", sub: "Coin-sized, stopped" }
                  ].map((a) => (
                    <button
                      key={a.val}
                      type="button"
                      onClick={() => setTacoAmount(a.val as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        tacoAmount === a.val
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-gray-50 dark:bg-black/30 text-gray-700 dark:text-rose-200 border-gray-200 dark:border-rose-900/30"
                      }`}
                    >
                      <div className="font-bold text-xs">{a.label}</div>
                      <div className={`text-[10px] ${tacoAmount === a.val ? "text-rose-100" : "text-gray-400"}`}>{a.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-rose-200">
                  Color: What does the fluid look like on a white pad?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "clear_straw", label: "Clear / Straw Pale", tag: "Normal Liquor" },
                    { val: "pink_tinged", label: "Pink-Tinged Streaks", tag: "Bloody Show Mix" },
                    { val: "green_brown", label: "Green / Brownish", tag: "🚨 Meconium Alert" },
                    { val: "bright_red", label: "Bright Red Bleeding", tag: "🚨 Bleeding Alert" }
                  ].map((c) => (
                    <button
                      key={c.val}
                      type="button"
                      onClick={() => setTacoColor(c.val as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        tacoColor === c.val
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-gray-50 dark:bg-black/30 text-gray-700 dark:text-rose-200 border-gray-200 dark:border-rose-900/30"
                      }`}
                    >
                      <div className="font-bold text-xs">{c.label}</div>
                      <div className={`text-[10px] ${tacoColor === c.val ? "text-rose-100" : "text-gray-400"}`}>{c.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Odor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 dark:text-rose-200">
                  Odor: What does it smell like?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "sweet_bleach", label: "Sweet / Pool Scent", sub: "Typical Amniotic" },
                    { val: "ammonia_urine", label: "Ammonia / Pungent", sub: "Urine Bladder Leak" },
                    { val: "odorless_mild", label: "Odorless / Mild", sub: "Cervical Discharge" }
                  ].map((o) => (
                    <button
                      key={o.val}
                      type="button"
                      onClick={() => setTacoOdor(o.val as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        tacoOdor === o.val
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-gray-50 dark:bg-black/30 text-gray-700 dark:text-rose-200 border-gray-200 dark:border-rose-900/30"
                      }`}
                    >
                      <div className="font-bold text-xs">{o.label}</div>
                      <div className={`text-[10px] ${tacoOdor === o.val ? "text-rose-100" : "text-gray-400"}`}>{o.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Diagnostic Evaluation Card */}
            <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
              tacoResult.urgencyLevel === "immediate_emergency"
                ? "bg-rose-50 dark:bg-[#20141b] border-rose-300 dark:border-rose-800"
                : tacoResult.urgencyLevel === "prompt_evaluation"
                ? "bg-blue-50 dark:bg-[#141b2c] border-blue-200 dark:border-blue-900/40"
                : "bg-emerald-50 dark:bg-[#14231d] border-emerald-200 dark:border-emerald-900/40"
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    TACO Diagnostic Result
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    tacoResult.urgencyLevel === "immediate_emergency"
                      ? "bg-rose-600 text-white"
                      : tacoResult.urgencyLevel === "prompt_evaluation"
                      ? "bg-blue-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}>
                    {tacoResult.urgencyLevel.replace("_", " ")}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  {tacoResult.title}
                </h3>

                <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                  {tacoResult.guidance}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    Action Directives:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
                    {tacoResult.protocolSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 dark:border-white/10 flex flex-wrap gap-2">
                {tacoResult.isEmergency ? (
                  <a
                    href="tel:108"
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Emergency: Call 108 Ambulance Now</span>
                  </a>
                ) : tacoResult.isLikelyAmniotic ? (
                  <a
                    href={`tel:${doctorContact.phone.replace(/\s+/g, "")}`}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Labor Room Hotline ({doctorContact.phone})</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setActivePage("contraction-timer")}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Open Contraction Timer Studio</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: HOSPITAL DEPARTURE RULE (5-1-1 CALCULATOR)                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "departure_calc" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-[#211a24] dark:to-[#1a1523] p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Car className="w-4 h-4" />
              <span>ACOG Clinical Departure Calculator</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-amber-100 mt-1">
              When Should I Head to the Hospital?
            </h2>
            <p className="text-xs text-gray-600 dark:text-amber-200 mt-1 max-w-2xl leading-relaxed">
              Arriving at the hospital too early (during latent early labor) increases interventions, whereas leaving too late risks delivery en route. This engine adapts the classic <strong>5-1-1 rule</strong> based on whether this is your first baby (Primigravida) vs second delivery (Multigravida), GBS status, and transit time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input Controls */}
            <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-rose-200">
                1. Maternal & Clinical Parameters
              </h3>

              {/* Parity */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                <div>
                  <span className="font-bold text-xs text-gray-800 dark:text-rose-100">Delivery History</span>
                  <p className="text-[10px] text-gray-500 dark:text-rose-300">Second labors progress twice as quickly as first labors</p>
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-black/50 p-1 rounded-xl border border-gray-200 dark:border-rose-900/30">
                  <button
                    onClick={() => setIsFirstBaby(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${isFirstBaby ? "bg-rose-500 text-white" : "text-gray-600 dark:text-rose-200"}`}
                  >
                    1st Baby (5-1-1)
                  </button>
                  <button
                    onClick={() => setIsFirstBaby(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${!isFirstBaby ? "bg-rose-500 text-white" : "text-gray-600 dark:text-rose-200"}`}
                  >
                    2nd+ Baby (4-1-1)
                  </button>
                </div>
              </div>

              {/* Water Broken */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                <div>
                  <span className="font-bold text-xs text-gray-800 dark:text-rose-100">Has Your Water Broken?</span>
                  <p className="text-[10px] text-gray-500 dark:text-rose-300">Rupture of membranes requires prompt CTG monitoring</p>
                </div>
                <button
                  onClick={() => setHasWaterBroken(!hasWaterBroken)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${hasWaterBroken ? "bg-rose-600 text-white" : "bg-gray-200 dark:bg-rose-950/60 text-gray-700 dark:text-rose-200"}`}
                >
                  {hasWaterBroken ? "Yes (Broken)" : "No (Intact)"}
                </button>
              </div>

              {/* GBS Status */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                <div>
                  <span className="font-bold text-xs text-gray-800 dark:text-rose-100">GBS (Group B Strep) Positive?</span>
                  <p className="text-[10px] text-gray-500 dark:text-rose-300">Requires 4 hours of IV Penicillin at hospital before delivery</p>
                </div>
                <button
                  onClick={() => setIsGbsPositive(!isGbsPositive)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${isGbsPositive ? "bg-rose-600 text-white" : "bg-gray-200 dark:bg-rose-950/60 text-gray-700 dark:text-rose-200"}`}
                >
                  {isGbsPositive ? "GBS Positive" : "Negative / Unknown"}
                </button>
              </div>

              {/* Transit time */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-rose-200">
                  <span>Travel Time to Hospital (with traffic):</span>
                  <span className="text-rose-500 font-extrabold">{distanceMinutes} Minutes</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={distanceMinutes}
                  onChange={(e) => setDistanceMinutes(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              {/* Contraction Metrics */}
              <div className="pt-2 border-t border-gray-100 dark:border-rose-900/20 space-y-3">
                <span className="text-xs font-bold text-gray-800 dark:text-rose-100 block">
                  Current Contraction Timing:
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                    <span className="text-[10px] text-gray-400 block">Interval</span>
                    <select
                      value={contractionIntervalMinutes}
                      onChange={(e) => setContractionIntervalMinutes(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-xs text-gray-800 dark:text-rose-100 mt-1 focus:outline-none"
                    >
                      <option value={15}>Every 15 mins</option>
                      <option value={10}>Every 10 mins</option>
                      <option value={7}>Every 7 mins</option>
                      <option value={5}>Every 5 mins</option>
                      <option value={4}>Every 4 mins</option>
                      <option value={3}>Every 3 mins</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                    <span className="text-[10px] text-gray-400 block">Duration</span>
                    <select
                      value={contractionDurationSeconds}
                      onChange={(e) => setContractionDurationSeconds(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-xs text-gray-800 dark:text-rose-100 mt-1 focus:outline-none"
                    >
                      <option value={30}>30 seconds</option>
                      <option value={45}>45 seconds</option>
                      <option value={60}>60 seconds</option>
                      <option value={75}>75 seconds</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-rose-900/20">
                    <span className="text-[10px] text-gray-400 block">Held For</span>
                    <select
                      value={regularityDurationHours}
                      onChange={(e) => setRegularityDurationHours(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-xs text-gray-800 dark:text-rose-100 mt-1 focus:outline-none"
                    >
                      <option value={0.5}>30 mins</option>
                      <option value={1}>1 Full Hour</option>
                      <option value={2}>2+ Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Departure Result Card */}
            <div className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 ${
              departureResult.status === "leave_immediately"
                ? "bg-rose-50 dark:bg-[#20141b] border-rose-300 dark:border-rose-800"
                : departureResult.status === "prepare_and_monitor"
                ? "bg-amber-50 dark:bg-[#211a19] border-amber-200 dark:border-amber-900/40"
                : "bg-emerald-50 dark:bg-[#14231d] border-emerald-200 dark:border-emerald-900/40"
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Departure Protocol Determination
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${departureResult.badgeColor}`}>
                    {departureResult.badgeText}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  Applied Standard: {departureResult.ruleApplied}
                </div>

                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                  {departureResult.headline}
                </h3>

                <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                  {departureResult.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    Action Directives:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
                    {departureResult.actionChecklist.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 dark:border-white/10 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("partner_drill")}
                  className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-rose-100 text-white dark:text-gray-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Start Partner 5-Minute Departure Drill ↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 5: PARTNER 5-MINUTE DEPARTURE DRILL                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "partner_drill" && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-purple-50 to-rose-50 dark:from-[#1d1627] dark:to-[#171120] p-5 rounded-3xl border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Partner Labor Departure Protocol</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-purple-100 mt-1">
              5-Minute Emergency Departure Drill for Birth Partners
            </h2>
            <p className="text-xs text-gray-600 dark:text-purple-200 mt-1 max-w-2xl leading-relaxed">
              When active labor begins, mom's focus must remain 100% on calm somatic breathing. The birth partner executes this rapid 6-point checklist to ensure smooth departure without forgotten bags or documents.
            </p>
          </div>

          <div className="space-y-3">
            {partnerDrillItems.map((drill) => (
              <div
                key={drill.id}
                onClick={() => togglePartnerDrillItem(drill.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  drill.isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                    : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 hover:border-rose-200 shadow-sm"
                }`}
              >
                <button className="mt-0.5 shrink-0 focus:outline-none">
                  {drill.isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-current text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${drill.isDone ? "line-through text-emerald-900 dark:text-emerald-300" : "text-gray-900 dark:text-rose-100"}`}>
                      {drill.task}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${drill.isDone ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600 dark:bg-rose-950/40 dark:text-rose-300"}`}>
                      {drill.isDone ? "Executed" : "Ready"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-rose-300/80">
                    {drill.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#20181b] border border-amber-200 dark:border-amber-900/30 flex items-center justify-between gap-3">
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Partner Reminder:</strong> Stay grounded and calm. Your steady breathing and confident presence directly lower maternal adrenaline and cortisol, helping natural oxytocin flow.
            </div>
            <a
              href={`tel:${doctorContact.phone.replace(/\s+/g, "")}`}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Casualty En Route</span>
            </a>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PRINT-ONLY DOSSIER VIEW (@media print)                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden print:block space-y-6 p-6 bg-white text-black">
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold uppercase">BloomNest Maternal Hospital Admission Dossier</h1>
            <p className="text-sm text-gray-600">Confidential Antenatal Labor Preparation & Clinical Summary</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{readinessPercent}% Ready</div>
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-3">
          <div><strong>Patient Name:</strong> {user?.name || "Priya S."}</div>
          <div><strong>Gestational Age:</strong> Week {user?.currentWeek || 24}</div>
          <div><strong>Blood Group / Rh:</strong> {user?.bloodGroup || "B+"}</div>
          <div><strong>Hospital / Room:</strong> {user?.hospitalName || "Apollo Cradle"}</div>
          <div><strong>Attending Obstetrician:</strong> {doctorContact.name} ({doctorContact.phone})</div>
          <div><strong>Primary Birth Partner:</strong> {primaryPartner?.name || "Aditya"} ({primaryPartner?.phone || "+91 98400 67890"})</div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2">Preparation Checklist Status:</h2>
          <div className="space-y-1 text-xs">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-1">
                <span>[{item.isDone ? "✓" : " "}] {item.title}</span>
                <span className="uppercase text-[10px] text-gray-500">{item.priority}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-400 flex justify-between text-xs">
          <div>
            <p>Obstetrician Review & Sign-Off:</p>
            <div className="w-48 border-b border-black mt-8" />
          </div>
          <div>
            <p>Labor Casualty Registrar Signature:</p>
            <div className="w-48 border-b border-black mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
};
