import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  TRIMESTER_PARTNER_PROFILES,
  PARTNER_CHECKLISTS,
  LABOR_ROOM_TECHNIQUES,
  LABOR_COMMUNICATION_RULES,
  MATERNAL_EMPATHY_INSIGHTS,
  FAMILY_HARMONY_SCRIPTS,
  DEPARTURE_DRILL_ITEMS,
  TrimesterPartnerProfile,
  PartnerChecklistItem,
} from "../data/partnerHubData";
import {
  Users,
  Heart,
  Sparkles,
  CheckCircle2,
  Calendar,
  Check,
  Clock,
  Printer,
  X,
  ChevronRight,
  Info,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Car,
  Activity,
  ShieldCheck,
  Send,
  Copy,
  BookOpen,
  Award,
} from "lucide-react";

export const PartnerPage: React.FC = () => {
  const { user, showToast, emergencyContacts } = useApp();

  const currentWeek = user.currentWeek || 20;
  const currentTrimester: 1 | 2 | 3 = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;

  // Active Tab
  const [activeTab, setActiveTab] = useState<"checklists" | "labor_coach" | "empathy" | "family_harmony" | "departure_drill">("checklists");

  // Checklist Filter
  const [selectedTrimesterFilter, setSelectedTrimesterFilter] = useState<1 | 2 | 3 | "all">(currentTrimester);

  // Completed Checklist State (Persisted in localStorage)
  const STORAGE_KEY = "bloomnest_partner_progress_v2";
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedItems));
    } catch (err) {
      console.error("Failed to save partner progress:", err);
    }
  }, [completedItems]);

  const toggleCheckItem = (id: string) => {
    setCompletedItems((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      return updated;
    });
  };

  // Profile for Current Week
  const activeProfile: TrimesterPartnerProfile =
    TRIMESTER_PARTNER_PROFILES.find((p) => p.trimester === currentTrimester) || TRIMESTER_PARTNER_PROFILES[1];

  // Checklist Calculation
  const totalTasks = PARTNER_CHECKLISTS.length;
  const completedTasksCount = Object.values(completedItems).filter(Boolean).length;
  const partnerReadinessPct = Math.round((completedTasksCount / totalTasks) * 100);

  // WhatsApp Broadcast State (Auto-synced from User Profile / Hospital Finder)
  const [hospitalName, setHospitalName] = useState(user.hospitalName || "Apollo Cradle Maternity Hospital");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (user.hospitalName) {
      setHospitalName(user.hospitalName);
    }
  }, [user.hospitalName]);

  // Printable Pocket Card Modal
  const [isPocketCardOpen, setIsPocketCardOpen] = useState(false);

  // Primary Emergency Hospital Contact
  const hospitalContact =
    emergencyContacts.find((c) => c.category === "hospital" || c.relation.toLowerCase().includes("hospital")) ||
    emergencyContacts[0];

  // WhatsApp Message Generator
  const generateBroadcastText = () => {
    const motherName = user.fullName || user.name || "My Wife";
    return `🌸 *BloomNest Family Update: Labor Journey Begins!* 🌸\n\n` +
      `Namaste Dear Family & Friends,\n\n` +
      `We have exciting and joyful news! ${motherName} has entered active labor, and we are currently en route to ${hospitalName}.\n\n` +
      `Both mother and baby are doing wonderfully, calm, and well-prepared. To help ${motherName} stay completely relaxed and focused on labor, our phones will be on silent/do-not-disturb.\n\n` +
      `Please keep us in your warm prayers and blessings! We will share joyful updates with photos as soon as our little angel arrives safely into the world! 🙏👶💕\n\n` +
      `— With all our love, ${user.partnerName || "Partner"} & ${motherName}`;
  };

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(generateBroadcastText());
    setIsCopied(true);
    showToast("WhatsApp broadcast message copied to clipboard! 📋");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateBroadcastText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const filteredChecklist = PARTNER_CHECKLISTS.filter((item) => {
    if (selectedTrimesterFilter === "all") return true;
    return item.trimester === selectedTrimesterFilter;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Hero Command Center Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/20 to-pink-500/0 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold tracking-wide">
                <Users className="w-3.5 h-3.5" />
                <span>Partner & Family Pregnancy Involvement Hub</span>
                <span className="text-[10px] bg-purple-500/40 px-2 py-0.5 rounded-full text-white">
                  Week {currentWeek} · Trimester {currentTrimester}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight">
                Co-Parenting & Labor Doula Command Center
              </h1>
              <p className="text-xs md:text-sm text-purple-200 max-w-2xl leading-relaxed">
                Empowering partners and fathers with clinical empathy, labor room pain-relief techniques, trimester checklists, and Indian family harmony tools.
              </p>
            </div>

            {/* Overall Partner Readiness Ring */}
            <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/10 self-start md:self-auto">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="22" className="stroke-white/20" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    className="stroke-amber-400 transition-all duration-700"
                    strokeWidth="4"
                    strokeDasharray={138}
                    strokeDashoffset={138 - (138 * partnerReadinessPct) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-bold text-xs text-white">
                  {partnerReadinessPct}%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 block">Partner Readiness</span>
                <span className="text-[11px] text-purple-200">
                  {completedTasksCount} of {totalTasks} Duties Done
                </span>
              </div>
            </div>
          </div>

          {/* Current Gestational Week Focus Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                How She Feels Right Now
              </span>
              <p className="text-xs text-purple-100 leading-relaxed">
                {activeProfile.mamaPhysiology}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider block">
                Her Emotional Spectrum
              </span>
              <p className="text-xs text-purple-100 leading-relaxed">
                {activeProfile.mamaEmotionalState}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                Your Primary Mission
              </span>
              <p className="text-xs text-purple-100 leading-relaxed font-semibold">
                {activeProfile.partnerPrimaryMission}
              </p>
            </div>
          </div>

          {/* Top 3 Missions for This Week */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Your Top 3 Actions This Week for {user.name || "Mother"}</span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {activeProfile.top3WeeklyActions.map((action, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-1 hover:bg-white/15 transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="text-base">{action.icon}</span>
                    <span>{action.title}</span>
                  </div>
                  <p className="text-[11px] text-purple-200 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-purple-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Evidence-based coaching from certified perinatal birth doulas</span>
            </div>

            <button
              onClick={() => setIsPocketCardOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Labor Pocket Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Primary Navigation Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-rose-100 dark:border-rose-900/40">
        {[
          { id: "checklists", label: "Trimester Checklists", icon: CheckCircle2 },
          { id: "labor_coach", label: "Labor Room Coach Deck", icon: Activity },
          { id: "empathy", label: "Walk in Her Shoes", icon: Heart },
          { id: "family_harmony", label: "Indian Family Harmony", icon: BookOpen },
          { id: "departure_drill", label: "5-Min Departure Drill", icon: Car },
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

      {/* TAB 1: TRIMESTER PARTNER CHECKLISTS */}
      {activeTab === "checklists" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Trimester Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1a1523] p-4 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-rose-300 uppercase tracking-wider mr-1">
                Filter Trimester:
              </span>
              {[
                { id: "all", label: "All Trimesters" },
                { id: 1, label: "T1: Foundation (W1-13)" },
                { id: 2, label: "T2: Fetal Bonding (W14-27)" },
                { id: 3, label: "T3: Labor Prep (W28-40+)" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedTrimesterFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedTrimesterFilter === pill.id
                      ? "bg-rose-500 text-white shadow-xs"
                      : "bg-rose-50 dark:bg-rose-950/30 text-gray-700 dark:text-rose-200 hover:bg-rose-100"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-gray-600 dark:text-rose-300">
              Showing {filteredChecklist.length} Action Items
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChecklist.map((item) => {
              const isChecked = !!completedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked
                      ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 shadow-xs"
                      : "bg-white dark:bg-[#1a1523] border-rose-100 dark:border-rose-900/40 shadow-xs hover:border-rose-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isChecked
                        ? "bg-emerald-500 text-white"
                        : "border-2 border-gray-300 dark:border-rose-800 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isChecked
                            ? "line-through text-emerald-800 dark:text-emerald-300"
                            : "text-gray-900 dark:text-rose-100"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          item.importance === "essential"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {item.importance}
                      </span>
                    </div>

                    {item.tamilTitle && (
                      <span className="text-[11px] text-gray-500 dark:text-rose-400 block font-medium">
                        {item.tamilTitle}
                      </span>
                    )}

                    <p className="text-xs text-gray-600 dark:text-rose-200/80 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LABOR ROOM COACH DECK */}
      {activeTab === "labor_coach" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-5 rounded-3xl border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">
                Evidence-Based Partner Impact in Labor
              </span>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Continuous physical and emotional support from a prepared birth partner reduces requests for pharmacological pain relief by 31%, reduces labor duration by an average of 41 minutes, and drastically lowers emergency intervention rates (Cochrane Review).
              </p>
            </div>
          </div>

          {/* Hands-on Techniques Grid */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              <span>4 Hands-On Non-Pharmacological Comfort Techniques</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LABOR_ROOM_TECHNIQUES.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40">
                      {tech.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-rose-100">
                        {tech.title}
                      </h4>
                      <span className="text-[11px] text-gray-500 dark:text-rose-400">
                        {tech.tamilTitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 text-xs space-y-1">
                    <span className="font-bold text-rose-700 dark:text-rose-300 block">
                      Target Area: {tech.targetArea}
                    </span>
                    <p className="text-gray-700 dark:text-rose-200 leading-relaxed">
                      {tech.howToPerform}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                      <span className="font-bold text-gray-500 dark:text-gray-400 block">
                        Partner Stance
                      </span>
                      <span className="text-gray-800 dark:text-rose-200">
                        {tech.partnerPosition}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                      <span className="font-bold text-gray-500 dark:text-gray-400 block">
                        Timing
                      </span>
                      <span className="text-gray-800 dark:text-rose-200">
                        {tech.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] italic text-gray-500 dark:text-rose-300">
                    💡 Clinical Reason: {tech.clinicalWhy}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Rules: What to say vs What NEVER to say */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Green Column: What to say */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                <ThumbsUp className="w-5 h-5 text-emerald-600" />
                <span>What to Say in the Labor Room (Oxytocin Boosters)</span>
              </div>

              <div className="space-y-3">
                {LABOR_COMMUNICATION_RULES.whatToSay.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1523] border border-emerald-100 dark:border-emerald-900/40 space-y-1"
                  >
                    <span className="font-serif font-bold text-xs text-gray-900 dark:text-rose-100 block">
                      "{item.phrase}"
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">
                      ✓ Why it helps: {item.why}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Column: What NEVER to say */}
            <div className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold text-sm">
                <ThumbsDown className="w-5 h-5 text-rose-600" />
                <span>What NEVER to Say (Cortisol & Stress Triggers)</span>
              </div>

              <div className="space-y-3">
                {LABOR_COMMUNICATION_RULES.whatNeverToSay.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 space-y-1"
                  >
                    <span className="font-serif font-bold text-xs text-gray-900 dark:text-rose-100 line-through decoration-rose-500 block">
                      "{item.phrase}"
                    </span>
                    <span className="text-[11px] text-rose-700 dark:text-rose-300 block">
                      ⚠️ Why to avoid: {item.why}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WALK IN HER SHOES (EMPATHY SIMULATOR) */}
      {activeTab === "empathy" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 space-y-2">
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Maternal Anatomical & Sensory Empathy Simulator</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-rose-300 max-w-2xl leading-relaxed">
              Pregnancy is not just a growing belly — it is a complete cellular and cardiovascular transformation. Understand what your partner's body is enduring right now so you can support her with deep compassion.
            </p>
          </div>

          <div className="space-y-4">
            {MATERNAL_EMPATHY_INSIGHTS.map((insight) => (
              <div
                key={insight.id}
                className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 dark:border-rose-900/30 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40">
                      {insight.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-rose-100">
                        {insight.organSystem}
                      </h4>
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        {insight.anatomicalChange}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-200 text-xs font-bold self-start sm:self-auto">
                    {insight.metricComparison}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 space-y-1">
                    <span className="font-bold text-rose-900 dark:text-rose-200 block">
                      What She Physically Experiences
                    </span>
                    <p className="text-gray-700 dark:text-rose-200/90 leading-relaxed">
                      {insight.whatShePhysicallyFeels}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 space-y-1">
                    <span className="font-bold text-teal-900 dark:text-teal-200 block">
                      What You Should Do as Partner
                    </span>
                    <p className="text-gray-700 dark:text-rose-200/90 leading-relaxed">
                      {insight.whatPartnerShouldDo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INDIAN FAMILY HARMONY & TRADITIONS */}
      {activeTab === "family_harmony" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-3xl border border-amber-200 dark:border-amber-900/40 space-y-2">
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>Indian Family Harmony & Cultural Boundary Scripts</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-rose-300 max-w-2xl leading-relaxed">
              In Indian families, love is abundant but unsolicited advice can overwhelm the mother. Your role as partner is to act as a loving shield — absorbing family friction with respect while ensuring her peace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAMILY_HARMONY_SCRIPTS.map((script) => (
              <div
                key={script.id}
                className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-4"
              >
                <div>
                  <h4 className="font-serif font-bold text-base text-gray-900 dark:text-rose-100">
                    {script.scenario}
                  </h4>
                  <span className="text-[11px] text-gray-500 dark:text-rose-400">
                    {script.tamilScenario}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 text-xs space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">
                    💬 What Partner Can Say Politely to Relatives:
                  </span>
                  <p className="font-serif italic text-gray-800 dark:text-rose-100 leading-relaxed">
                    {script.whatPartnerCanSay}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-gray-700 dark:text-rose-300 block">
                    Why it matters:
                  </span>
                  <p className="text-gray-600 dark:text-rose-200/80 leading-relaxed">
                    {script.whyItMatters}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-[11px] font-semibold text-gray-700 dark:text-rose-200">
                  🎯 Partner Action: {script.practicalAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 5-MINUTE HOSPITAL DEPARTURE DRILL & WHATSAPP BROADCAST */}
      {activeTab === "departure_drill" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-3xl border border-blue-200 dark:border-blue-900/40 space-y-2">
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-rose-100 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              <span>5-Minute Emergency Hospital Departure Drill</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-rose-300 max-w-2xl leading-relaxed">
              When true active labor begins (contractions 5 minutes apart, lasting 1 minute, for 1 hour — the 5-1-1 rule), stay calm. Follow this sequential 5-minute protocol to leave home smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5-Min Departure Timeline */}
            <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100">
                  Step-by-Step Countdown
                </span>
                <span className="text-xs font-semibold text-rose-500">
                  Target Departure: 5 Mins
                </span>
              </div>

              <div className="space-y-3">
                {DEPARTURE_DRILL_ITEMS.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30"
                  >
                    <span className="px-2 py-1 rounded-xl bg-white dark:bg-rose-900/40 text-xs font-bold text-gray-700 dark:text-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-500" />
                      <span>{item.time}</span>
                    </span>

                    <span className="text-xl">{item.icon}</span>

                    <span className="text-xs font-medium text-gray-800 dark:text-rose-100 flex-1">
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Family Broadcast Generator */}
            <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
                  <span className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>1-Tap WhatsApp Family Broadcast</span>
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Avoids 50 anxious calls
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Destination Maternity Hospital
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Cloudnine, Apollo Cradle, Motherhood..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Pre-Drafted Respectful Family Broadcast
                  </label>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-gray-800 dark:text-rose-100 whitespace-pre-line leading-relaxed font-sans max-h-52 overflow-y-auto">
                    {generateBroadcastText()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleOpenWhatsApp}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyBroadcast}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-rose-900/50 bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-rose-200 font-bold text-xs hover:bg-gray-100 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isCopied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE PARTNER LABOR POCKET CARD MODAL */}
      {isPocketCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1523] w-full max-w-3xl max-h-[92vh] rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Controls */}
            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/50 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100">
                  Partner Delivery Room Pocket Card (Print Preview)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Cheat Sheet</span>
                </button>
                <button
                  onClick={() => setIsPocketCardOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white text-gray-900 font-sans print:p-0">
              <div className="border-b-2 border-rose-500 pb-4 text-center space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-rose-600">
                  BloomNest Perinatal Sanctuary
                </span>
                <h2 className="text-2xl font-bold font-serif">
                  Partner Delivery Room Quick-Action Cheat Sheet
                </h2>
                <p className="text-xs text-gray-500">
                  Patient: {user.fullName || user.name || "Mother"} · Delivery Center: {hospitalName} · Emergency Doctor: Dr. {user.doctorName || "Ananya Sharma"} · Casualty Desk: {hospitalContact?.phone || "108"}
                </p>
              </div>

              {/* 2-Column Labor Guide */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Physical Pain Relief */}
                <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                  <span className="font-bold text-sm block border-b pb-1 text-rose-700">
                    🤲 Physical Counter-Pressure
                  </span>
                  <div className="space-y-1.5 text-[11px] text-gray-700">
                    <p><strong>1. Sacral Press:</strong> Lean full heel of hand against the lower flat spine during contraction peaks.</p>
                    <p><strong>2. Double Hip Squeeze:</strong> Cup outer hip crests with both hands and press firmly inward.</p>
                    <p><strong>3. Cold Cloth:</strong> Ice-cold damp cloth on forehead & back of neck between waves.</p>
                    <p><strong>4. Breath Anchor:</strong> Inhale 4s through nose, exhale 6s with loose, soft jelly lips.</p>
                  </div>
                </div>

                {/* Verbal Support */}
                <div className="p-4 rounded-xl border border-gray-200 space-y-2">
                  <span className="font-bold text-sm block border-b pb-1 text-emerald-700">
                    🗣️ What to Say (Oxytocin Boosters)
                  </span>
                  <div className="space-y-1.5 text-[11px] text-gray-700">
                    <p>✓ "You are doing this. Look how strong you are."</p>
                    <p>✓ "Every wave brings our baby closer to your arms."</p>
                    <p>✓ "Inhale peace... let your jaw go completely soft."</p>
                    <p>✓ "I am right here with you. You are safe."</p>
                    <p className="text-red-600 font-semibold pt-1">
                      🚫 NEVER say: "Just relax" or "It can't hurt that bad" or announce dilation numbers!
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Departure Checklist */}
              <div className="p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <span className="font-bold text-sm block border-b pb-1 text-blue-700">
                  🚗 5-Minute Hospital Departure Protocol
                </span>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-700">
                  <div>1. Grab Medical Folder & Aadhaar</div>
                  <div>2. Load 4 Hospital Bags into car boot</div>
                  <div>3. Seatbelt below mother's bump</div>
                  <div>4. Call Maternity Casualty</div>
                  <div>5. Send WhatsApp Family Broadcast</div>
                  <div>6. Drive smoothly without jerking</div>
                </div>
              </div>

              {/* Signoff */}
              <div className="text-center text-[10px] text-gray-400 pt-2 border-t">
                BloomNest Partner Command Sheet · Keep this in your wallet or hospital bag pocket.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
