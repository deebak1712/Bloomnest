import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { HospitalBagItem, HospitalBagSection } from "../types";
import { 
  HOSPITAL_BAG_SECTIONS, 
  INITIAL_CLINICAL_HOSPITAL_BAG, 
  LOCAL_STORAGE_KEY_HOSPITAL_BAG,
  HospitalBagSectionMeta
} from "../data/hospitalBagData";
import { 
  Briefcase, CheckCircle2, Circle, Plus, Heart, Baby, 
  Users, Sparkles, Printer, RotateCcw, Flame, ShieldAlert,
  Info, Trash2, ChevronRight, Check, Tag, Filter, Layers
} from "lucide-react";

export const HospitalBagPage: React.FC = () => {
  const { user, showToast, toggleHospitalItem, addHospitalItem: appAddHospitalItem, t } = useApp();

  // Load items from localStorage or fallback to clinical defaults
  const [items, setItems] = useState<HospitalBagItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HOSPITAL_BAG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_CLINICAL_HOSPITAL_BAG.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load hospital bag data", e);
    }
    return INITIAL_CLINICAL_HOSPITAL_BAG;
  });

  // Persist whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_HOSPITAL_BAG, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist hospital bag", e);
    }
  }, [items]);

  // Active section tab & filters
  const [activeSection, setActiveSection] = useState<HospitalBagSection | "all">("all");
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "vaginal" | "c_section">("all");
  const [essentialOnly, setEssentialOnly] = useState<boolean>(false);

  // Add custom item modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newSection, setNewSection] = useState<HospitalBagSection>("labor_delivery");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newEssential, setNewEssential] = useState<boolean>(true);
  const [newReason, setNewReason] = useState<string>("");

  // Statistics calculation
  const totalCount = items.length;
  const packedCount = items.filter((i) => i.isPacked).length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Section-by-section stats
  const sectionStats = useMemo(() => {
    const stats: Record<HospitalBagSection, { total: number; packed: number; pct: number }> = {
      labor_delivery: { total: 0, packed: 0, pct: 0 },
      mother_recovery: { total: 0, packed: 0, pct: 0 },
      baby_essentials: { total: 0, packed: 0, pct: 0 },
      partner_support: { total: 0, packed: 0, pct: 0 },
      last_minute: { total: 0, packed: 0, pct: 0 },
    };

    items.forEach((item) => {
      const sec = item.bagSection || "labor_delivery";
      if (stats[sec]) {
        stats[sec].total++;
        if (item.isPacked) stats[sec].packed++;
      }
    });

    Object.keys(stats).forEach((k) => {
      const s = k as HospitalBagSection;
      stats[s].pct = stats[s].total > 0 ? Math.round((stats[s].packed / stats[s].total) * 100) : 0;
    });

    return stats;
  }, [items]);

  // Toggle item packed status
  const togglePacked = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isPacked = !item.isPacked;
          showToast(isPacked ? `Packed: ${item.item} ✓` : `Unpacked: ${item.item}`);
          return { ...item, isPacked };
        }
        return item;
      })
    );
    // Sync with AppContext if exists
    try {
      toggleHospitalItem(id);
    } catch (e) {}
  };

  // Adjust quantity
  const adjustQuantity = (id: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  // Delete item
  const deleteItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Removed item from bag.");
  };

  // Add item handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: HospitalBagItem = {
      id: Date.now(),
      category: newSection === "baby_essentials" ? "baby" : newSection === "partner_support" ? "partner" : "mother",
      bagSection: newSection,
      item: newItemName.trim(),
      quantity: newQuantity,
      isPacked: false,
      isEssential: newEssential,
      deliveryType: "all",
      clinicalReason: newReason.trim() || "Custom personalized hospital bag item.",
      isCustom: true,
    };

    setItems((prev) => [newItem, ...prev]);
    try {
      appAddHospitalItem({
        category: newItem.category,
        item: newItem.item,
        quantity: newItem.quantity,
      });
    } catch (e) {}

    setNewItemName("");
    setNewReason("");
    setNewQuantity(1);
    setShowAddModal(false);
    showToast("Added item to hospital bag! 🧳");
  };

  // Reset to clinical defaults
  const handleResetDefaults = () => {
    if (window.confirm("Reset your hospital bag packing checklist to the clinical evidence-based defaults?")) {
      setItems(INITIAL_CLINICAL_HOSPITAL_BAG);
      showToast("Reset to clinical defaults! 🌸");
    }
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Section filter
      const matchesSection = activeSection === "all" || (item.bagSection || "labor_delivery") === activeSection;

      // Delivery preset filter
      const matchesDelivery = 
        deliveryFilter === "all" || 
        !item.deliveryType || 
        item.deliveryType === "all" || 
        item.deliveryType === deliveryFilter;

      // Essential filter
      const matchesEssential = !essentialOnly || item.isEssential;

      return matchesSection && matchesDelivery && matchesEssential;
    });
  }, [items, activeSection, deliveryFilter, essentialOnly]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Screen Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Maternal Perinatal Packing Studio</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Hospital Bag Packing Studio & 4-Bag System
          </h1>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-rose-300 mt-1">
            Week {user?.currentWeek || 24} · Clinically organized 4-bag physical packing system, vaginal vs cesarean presets, and last-minute door departure pouch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#1a1523] text-gray-700 dark:text-rose-200 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-rose-500" />
            <span>Print Bag Luggage Manifest</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-rose-900/30 bg-white dark:bg-[#1a1523] text-gray-500 dark:text-rose-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white p-3 rounded-2xl shadow-md">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-rose-200">Total Packed</div>
              <div className="font-serif text-2xl font-extrabold">{progressPct}%</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-xs bg-white/10">
              {packedCount}/{totalCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-Bag Multi-Compartment Progress Dashboard ── */}
      <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-rose-200">
              4-Bag Physical Compartment Breakdown
            </span>
          </div>
          <span className="text-xs font-extrabold text-rose-500">{packedCount} of {totalCount} Items Packed</span>
        </div>

        <div className="w-full bg-rose-100/70 dark:bg-rose-950/50 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 5 Compartment Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {HOSPITAL_BAG_SECTIONS.map((sec) => {
            const stat = sectionStats[sec.id] || { total: 0, packed: 0, pct: 0 };
            const isSelected = activeSection === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-sm"
                    : "border-gray-100 dark:border-rose-900/20 bg-gray-50/50 dark:bg-[#15101d] hover:border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-rose-200">
                  <span className="truncate">{sec.shortName}</span>
                  <span className="text-rose-500 font-extrabold">{stat.pct}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-rose-950/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sec.colorGradient} transition-all duration-500`}
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 dark:text-rose-300/70 mt-1">
                  {stat.packed}/{stat.total} packed
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Delivery Mode Preset & Filters Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#1a1523] p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
        {/* Delivery Type Preset */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600 dark:text-rose-300 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-rose-500" />
            <span>Delivery Preset:</span>
          </span>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/30 p-1 rounded-xl">
            <button
              onClick={() => setDeliveryFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                deliveryFilter === "all" ? "bg-rose-500 text-white shadow-sm" : "text-gray-600 dark:text-rose-300"
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setDeliveryFilter("vaginal")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                deliveryFilter === "vaginal" ? "bg-rose-500 text-white shadow-sm" : "text-gray-600 dark:text-rose-300"
              }`}
            >
              🌿 Vaginal Birth
            </button>
            <button
              onClick={() => setDeliveryFilter("c_section")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                deliveryFilter === "c_section" ? "bg-rose-500 text-white shadow-sm" : "text-gray-600 dark:text-rose-300"
              }`}
            >
              🌸 Cesarean (C-Section)
            </button>
          </div>
        </div>

        {/* Essential Toggle & Add Custom Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEssentialOnly(!essentialOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              essentialOnly
                ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-rose-900/30 text-gray-600 dark:text-rose-300"
            }`}
          >
            🔴 Essentials Only
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* ── Compartment Tabs ── */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveSection("all")}
          className={`px-4 py-2.5 rounded-2xl transition-all ${
            activeSection === "all"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
          }`}
        >
          All Compartments ({items.length})
        </button>

        {HOSPITAL_BAG_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2.5 rounded-2xl transition-all ${
              activeSection === sec.id
                ? "bg-rose-500 text-white shadow-md"
                : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
            }`}
          >
            {sec.name} ({items.filter((i) => (i.bagSection || "labor_delivery") === sec.id).length})
          </button>
        ))}
      </div>

      {/* ── Active Bag Section Banner ── */}
      {activeSection !== "all" && (() => {
        const secMeta = HOSPITAL_BAG_SECTIONS.find((s) => s.id === activeSection);
        if (!secMeta) return null;
        return (
          <div className={`p-4 rounded-2xl border ${secMeta.borderColor} ${secMeta.bgLight} flex items-center justify-between gap-3`}>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-rose-200">
                {secMeta.name} · {secMeta.subtitle}
              </h2>
              <p className="text-xs text-gray-600 dark:text-rose-300 mt-0.5">
                {secMeta.description}
              </p>
            </div>
            <span className="text-xs font-extrabold text-rose-500 shrink-0">
              {sectionStats[secMeta.id]?.packed}/{sectionStats[secMeta.id]?.total} Packed
            </span>
          </div>
        );
      })()}

      {/* ── Add Custom Item Modal ── */}
      {showAddModal && (
        <form
          onSubmit={handleAddItem}
          className="bg-rose-50/70 dark:bg-[#1e1728] p-5 rounded-3xl border border-rose-200 dark:border-rose-900/50 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-500" />
              Add Personal Hospital Bag Item
            </span>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Item name (e.g. Traditional Omam Water Thermos Flask)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-900 dark:text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <input
              type="text"
              placeholder="Clinical reason or packing note (optional)"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-900 dark:text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600 dark:text-rose-300">Bag:</span>
                <select
                  value={newSection}
                  onChange={(e: any) => setNewSection(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-800 dark:text-rose-200 text-xs"
                >
                  {HOSPITAL_BAG_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>{sec.shortName}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-600 dark:text-rose-300">Qty:</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-black/40 text-gray-800 dark:text-rose-200 text-xs text-center"
                />
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-rose-200">
                <input
                  type="checkbox"
                  checked={newEssential}
                  onChange={(e) => setNewEssential(e.target.checked)}
                  className="accent-rose-500 rounded"
                />
                <span>Mark Essential</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Add to Checklist
            </button>
          </div>
        </form>
      )}

      {/* ── Items List ── */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-[#1a1523] rounded-3xl border border-rose-100 dark:border-rose-900/30 text-gray-500 dark:text-rose-300 text-xs">
            No items match the current compartment or delivery filters.
          </div>
        ) : (
          filteredItems.map((item) => {
            const secMeta = HOSPITAL_BAG_SECTIONS.find((s) => s.id === item.bagSection);
            return (
              <div
                key={item.id}
                onClick={() => togglePacked(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  item.isPacked
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200"
                    : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 text-gray-900 dark:text-rose-100 hover:border-rose-300 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePacked(item.id);
                    }}
                    className="mt-0.5 shrink-0 focus:outline-none"
                  >
                    {item.isPacked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-current text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-rose-500 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${item.isPacked ? "line-through opacity-75 text-emerald-900 dark:text-emerald-300" : "text-gray-900 dark:text-rose-100"}`}>
                          {item.item}
                        </span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 dark:bg-rose-950/50 text-gray-500">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-200 dark:border-rose-900/40 rounded-lg bg-gray-50 dark:bg-black/20 text-xs">
                          <button
                            onClick={(e) => adjustQuantity(item.id, -1, e)}
                            className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-rose-950/60 rounded-l text-gray-600 dark:text-rose-300 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-gray-800 dark:text-rose-100">
                            Qty: {item.quantity || 1}
                          </span>
                          <button
                            onClick={(e) => adjustQuantity(item.id, 1, e)}
                            className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-rose-950/60 rounded-r text-gray-600 dark:text-rose-300 font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Priority Badge */}
                        {item.isEssential && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
                            Essential
                          </span>
                        )}

                        {/* Delivery Type Badge */}
                        {item.deliveryType === "vaginal" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                            🌿 Vaginal
                          </span>
                        )}
                        {item.deliveryType === "c_section" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300">
                            🌸 C-Section
                          </span>
                        )}

                        {/* Compartment Pill */}
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/30">
                          {secMeta?.shortName || item.category}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={(e) => deleteItem(item.id, e)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.clinicalReason && (
                      <div className="flex items-start gap-1.5 p-2 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/20 text-[11px] text-gray-600 dark:text-rose-300 mt-1.5">
                        <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>Clinical Note:</strong> {item.clinicalReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PRINT-ONLY LUGGAGE MANIFEST (@media print)                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden print:block space-y-8 p-6 bg-white text-black">
        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold uppercase">BloomNest Maternal Hospital Bag Packing Manifest</h1>
            <p className="text-xs text-gray-600">Patient: {user?.name || "Priya S."} · Due Date: {user?.dueDate || "October 2026"} · Hospital: {user?.hospitalName || "Apollo Cradle"}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{progressPct}% Packed</div>
            <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 4 Cutout Luggage Tags */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          {HOSPITAL_BAG_SECTIONS.filter((s) => s.id !== "last_minute").map((sec) => {
            const secItems = items.filter((i) => (i.bagSection || "labor_delivery") === sec.id);
            return (
              <div key={sec.id} className="border-2 border-dashed border-gray-400 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center border-b border-gray-300 pb-1">
                  <h3 className="font-bold text-sm uppercase">{sec.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-gray-600">Cutout Tag</span>
                </div>
                <p className="text-[10px] text-gray-500">{sec.subtitle}</p>

                <div className="space-y-1 pt-1">
                  {secItems.map((i) => (
                    <div key={i.id} className="flex items-center justify-between border-b border-gray-100 py-0.5">
                      <span>[{i.isPacked ? "✓" : " "}] {i.item} (x{i.quantity || 1})</span>
                      {i.isEssential && <span className="text-[9px] font-bold uppercase text-red-600">Essential</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Last minute departure checklist */}
        <div className="border-2 border-red-500 p-4 rounded-xl text-xs space-y-2">
          <h3 className="font-bold uppercase text-red-600">⚡ 10-Minute Door Departure Pouch (Pack Before Stepping Into Car)</h3>
          <div className="grid grid-cols-2 gap-2">
            {items.filter((i) => i.bagSection === "last_minute").map((i) => (
              <div key={i.id} className="flex items-center gap-2">
                <span>[{i.isPacked ? "✓" : " "}]</span>
                <span><strong>{i.item}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
