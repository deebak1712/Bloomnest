import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  FETAL_MOVEMENT_DEFINITIONS,
  MATERNAL_POSTURES,
  LOW_MOVEMENT_TRIAGE_STEPS,
  FetalMovementType,
  getCircadianWindow,
} from "../data/fetalMovementData";
import { playFetalKickSound } from "../utils/fetalAudioFeedback";
import {
  Footprints,
  Play,
  CheckCircle2,
  RotateCcw,
  Save,
  Sparkles,
  Clock,
  Heart,
  AlertTriangle,
  Info,
  ShieldAlert,
  GlassWater,
  Bed,
  PhoneCall,
  Activity,
  BedDouble,
  Compass,
  HelpCircle,
  Volume2,
  Calendar,
  Sun,
  Sunset,
  Moon,
  ChevronRight,
} from "lucide-react";

export const KickCounterPage: React.FC = () => {
  const { kickSessions, addKickSession, setActivePage, showToast, user, t } = useApp();
  const currentWeek = user.currentWeek || 24;
  const trimester = user.trimester || 2;
  const isWeek28Plus = currentWeek >= 28;
  const doctorName = user.doctorName || "Dr. Ananya Sharma, MD (OB-GYN)";
  const hospitalName = user.hospitalName || "Cloudnine Maternal Hospital";

  // Session State
  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [kickCount, setKickCount] = useState(0); // Valid goal movements (kicks, rolls, flutters)
  const [hiccupCount, setHiccupCount] = useState(0); // Hiccups tracked separately
  const [movementBreakdown, setMovementBreakdown] = useState({
    kicks: 0,
    rolls: 0,
    flutters: 0,
    hiccups: 0,
  });
  const [selectedMovementType, setSelectedMovementType] = useState<FetalMovementType>("kick");
  const [maternalPosture, setMaternalPosture] = useState<"left_side" | "semi_reclined" | "sitting">("left_side");
  const [hadColdDrinkOrSnack, setHadColdDrinkOrSnack] = useState(true);
  const [kickTimestamps, setKickTimestamps] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [showLowMovementModal, setShowLowMovementModal] = useState(false);
  const [showHiccupsModal, setShowHiccupsModal] = useState(false);

  const GOAL_KICKS = 10;

  // Real-time timer
  useEffect(() => {
    let interval: any = null;
    if (isActive && sessionStartTime) {
      interval = setInterval(() => {
        const next = Math.floor((Date.now() - sessionStartTime) / 1000);
        setElapsedSeconds(next);
        if (next >= 7200 && kickCount < GOAL_KICKS) {
          setShowLowMovementModal(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, kickCount, sessionStartTime]);

  const handleStart = () => {
    setIsActive(true);
    setSessionStartTime(Date.now());
    setKickCount(0);
    setHiccupCount(0);
    setElapsedSeconds(0);
    setKickTimestamps([]);
    setMovementBreakdown({ kicks: 0, rolls: 0, flutters: 0, hiccups: 0 });
    setShowLowMovementModal(false);
  };

  const handleMovementTap = (type: FetalMovementType = selectedMovementType) => {
    if (!isActive) {
      setIsActive(true);
      setSessionStartTime(Date.now());
    }

    // Sensory Feedback: Web Audio womb resonance + haptic vibration
    playFetalKickSound(type);
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(type === "kick" ? 60 : 35);
      } catch (_) {}
    }

    const now = Date.now();

    if (type === "hiccup") {
      setHiccupCount((prev) => prev + 1);
      setMovementBreakdown((prev) => ({ ...prev, hiccups: prev.hiccups + 1 }));
      showToast("Fetal hiccup logged (Excluded from 10-kick count)");
      return;
    }

    // For kicks, rolls, flutters: count towards 10 DFMC goal
    setKickTimestamps((prev) => [...prev, now]);
    setMovementBreakdown((prev) => {
      if (type === "kick") return { ...prev, kicks: prev.kicks + 1 };
      if (type === "roll") return { ...prev, rolls: prev.rolls + 1 };
      if (type === "flutter") return { ...prev, flutters: prev.flutters + 1 };
      return prev;
    });

    setKickCount((prev) => {
      const updated = prev + 1;
      if (updated === GOAL_KICKS) {
        showToast("🌸 Milestone reached: 10 movements felt!");
      }
      return updated;
    });
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionStartTime(null);
    setKickCount(0);
    setHiccupCount(0);
    setElapsedSeconds(0);
    setKickTimestamps([]);
    setMovementBreakdown({ kicks: 0, rolls: 0, flutters: 0, hiccups: 0 });
    setShowLowMovementModal(false);
  };

  const handleSave = () => {
    if (kickCount === 0 && hiccupCount === 0) return;
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const timeOfDay = getCircadianWindow();

    addKickSession({
      date: new Date().toISOString().split("T")[0],
      sessionStartTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      kickCount,
      durationMinutes: minutes,
      notes:
        notes ||
        (kickCount < 10
          ? "Session paused before reaching 10 movements."
          : `Reached 10 movements in ${minutes} mins on ${maternalPosture.replace("_", " ")}.`),
      movementBreakdown: {
        kicks: movementBreakdown.kicks,
        rolls: movementBreakdown.rolls,
        flutters: movementBreakdown.flutters,
        hiccups: movementBreakdown.hiccups,
      },
      maternalPosture,
      hadMealOrColdDrink: hadColdDrinkOrSnack,
      timeOfDay,
      averageIntervalSeconds: avgIntervalSec || undefined,
    });

    if (kickCount < GOAL_KICKS && minutes >= 90) {
      setShowLowMovementModal(true);
    } else {
      handleReset();
      setNotes("");
      showToast("Kick session successfully saved to maternal health record!");
    }
  };

  // Inter-kick intervals
  const intervals: number[] = [];
  if (kickTimestamps.length > 1) {
    for (let i = 1; i < kickTimestamps.length; i++) {
      intervals.push(Math.round((kickTimestamps[i] - kickTimestamps[i - 1]) / 1000));
    }
  }
  const avgIntervalSec =
    intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

  const historicalAvgMinutes =
    kickSessions.length > 0
      ? Math.round(kickSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / kickSessions.length)
      : 22;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Circadian window counts from history
  const morningCount = kickSessions.filter((s) => s.timeOfDay === "morning").length;
  const afternoonCount = kickSessions.filter((s) => s.timeOfDay === "afternoon").length;
  const eveningCount = kickSessions.filter((s) => s.timeOfDay === "evening").length;
  const nightCount = kickSessions.filter((s) => s.timeOfDay === "night").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-br from-pink-600 via-rose-600 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5" />
                Fetal Movement & DFMC Studio
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-300 text-slate-950 text-xs font-black">
                Week {currentWeek} • Trimester {trimester}
              </span>
            </div>

            <button
              onClick={() => setShowLowMovementModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>ACOG Decreased Movement Triage</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Maternal Fetal Movement Studio 👣
            </h1>
            <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
              Track your baby's unique movement patterns (kicks, rolls, flutters). Regular fetal movement is the single most reassuring clinical indicator of healthy fetal oxygenation and central nervous system integrity.
            </p>
          </div>

          {/* Gestational Week 28 Clinical Protocol Advisory */}
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-white uppercase text-[11px] block tracking-wide">
                  {isWeek28Plus ? "Active DFMC Protocol (Week 28+)" : "Gestational Awareness Mode (Week 24)"}
                </span>
                <p className="text-rose-100 text-xs leading-relaxed">
                  {isWeek28Plus ? (
                    "ACOG & RCOG recommend daily Count-to-10 sessions starting at Week 28. Look for 10 distinct movements within 2 hours."
                  ) : (
                    "At Week 24, baby's movement cycles are still developing circadian patterns. Enjoy feeling baby's kicks and rolls without feeling anxious if they rest for several hours."
                  )}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-white/20 text-[11px] font-black shrink-0 self-start sm:self-auto">
              Goal: 10 Movements
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRE-SESSION SETUP (POSTURE & SNACK) */}
      <section className="bg-white dark:bg-[#1a1420] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-black text-slate-900 dark:text-rose-100">
              Optimal Counting Setup
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">ACOG Clinical Practice</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Posture Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
              Maternal Position During Session:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MATERNAL_POSTURES.map((p) => {
                const isSelected = maternalPosture === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setMaternalPosture(p.id)}
                    className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1 ${
                      isSelected
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-rose-200 border-slate-200 dark:border-slate-800 hover:bg-rose-50"
                    }`}
                  >
                    <span className="text-xs font-black leading-tight">{p.label}</span>
                    <p
                      className={`text-[10px] leading-snug line-clamp-2 ${
                        isSelected ? "text-rose-100" : "text-slate-500 dark:text-rose-400"
                      }`}
                    >
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cold Drink / Postprandial Check */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
              Prior Snack or Cold Drink Check:
            </label>
            <div
              onClick={() => setHadColdDrinkOrSnack((prev) => !prev)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                hadColdDrinkOrSnack
                  ? "bg-teal-50/80 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-200"
                  : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-rose-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <GlassWater className="w-5 h-5 text-teal-600" />
                <div className="text-xs">
                  <p className="font-black">Cold Water / Fruit Snack Eaten</p>
                  <p className="text-[11px] opacity-80">
                    Glucose spikes & cold liquids trigger active baby movement.
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black ${
                  hadColdDrinkOrSnack
                    ? "bg-teal-600 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {hadColdDrinkOrSnack ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN INTERACTIVE COUNTER STAGE */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 text-white shadow-2xl flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
        {/* Elapsed Timer & Goal Progress */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="text-xs font-extrabold px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>Elapsed: {formatTime(elapsedSeconds)}</span>
          </div>

          <div className="text-xs font-extrabold px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Progress: {kickCount} / {GOAL_KICKS} Movements</span>
          </div>
        </div>

        {/* Central Giant Interactive Counter Button */}
        <div className="relative">
          <button
            onClick={() => handleMovementTap(selectedMovementType)}
            className="w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-white text-rose-600 shadow-2xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all group relative z-10 cursor-pointer"
          >
            <span className="text-3xl group-hover:scale-125 transition-transform">
              {FETAL_MOVEMENT_DEFINITIONS.find((m) => m.id === selectedMovementType)?.emoji || "🦶"}
            </span>
            <span className="text-6xl font-black text-slate-900 font-serif my-1">
              {kickCount}
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Tap to Register {selectedMovementType.toUpperCase()}
            </span>
          </button>

          {isActive && (
            <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Movement Type Selector Buttons */}
        <div className="space-y-2 w-full max-w-lg">
          <span className="text-xs font-bold text-rose-100 block">
            Select Movement Sensation Type:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FETAL_MOVEMENT_DEFINITIONS.map((def) => {
              const isSelected = selectedMovementType === def.id;
              return (
                <button
                  type="button"
                  key={def.id}
                  onClick={() => setSelectedMovementType(def.id)}
                  className={`p-2.5 rounded-2xl text-center border transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-white text-slate-900 font-black shadow-lg scale-105 border-white"
                      : "bg-white/15 hover:bg-white/20 text-white font-bold border-white/20"
                  }`}
                >
                  <span className="text-lg">{def.emoji}</span>
                  <span className="text-[11px] leading-tight">{def.label}</span>
                  {!def.countsTowardsGoal && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                      Hiccups
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Celebration Banner */}
        {kickCount >= GOAL_KICKS && (
          <div className="p-4 px-6 rounded-2xl bg-amber-300 text-slate-950 font-black text-xs sm:text-sm animate-bounce flex items-center gap-2 shadow-xl">
            <Sparkles className="w-5 h-5 text-rose-700" />
            <span>
              Goal Reached! 10 active fetal movements documented in {Math.round(elapsedSeconds / 60)} minutes.
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Timer</span>
          </button>

          <button
            onClick={handleSave}
            disabled={kickCount === 0 && hiccupCount === 0}
            className="px-7 py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-40 font-black text-xs shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Kick Session</span>
          </button>
        </div>
      </section>

      {/* 4. CURRENT SESSION METRICS & BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Current Session Pace</span>
          <div className="text-2xl font-black text-slate-900 dark:text-rose-100">
            {kickCount > 0 ? (elapsedSeconds / Math.max(1, kickCount) / 60).toFixed(1) : "0.0"}{" "}
            <span className="text-xs font-normal text-slate-500">min/kick</span>
          </div>
          <p className="text-[11px] text-slate-500">Inter-movement average velocity</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Kicks vs Rolls</span>
          <div className="text-2xl font-black text-slate-900 dark:text-rose-100">
            {movementBreakdown.kicks} <span className="text-xs text-rose-500">Kicks</span> / {movementBreakdown.rolls} <span className="text-xs text-indigo-500">Rolls</span>
          </div>
          <p className="text-[11px] text-slate-500">{movementBreakdown.flutters} flutters logged</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Fetal Hiccups</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {hiccupCount}{" "}
            <span className="text-xs font-normal text-slate-500">Spasms</span>
          </div>
          <p className="text-[11px] text-slate-500">Normal diaphragmatic practice</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Historical Average</span>
          <div className="text-2xl font-black text-slate-900 dark:text-rose-100">
            ~{historicalAvgMinutes}{" "}
            <span className="text-xs font-normal text-slate-500">mins for 10</span>
          </div>
          <p className="text-[11px] text-slate-500">Standard Cardiff DFMC timeframe</p>
        </div>
      </div>

      {/* 5. CIRCADIAN ACTIVE HOURS HEATMAP */}
      <section className="p-6 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
              Baby's Circadian Movement Rhythms
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">Daily Active Windows</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-rose-300">
          In utero, babies develop 20–40 minute sleep-wake cycles. Most fetuses are naturally most active in the late evening (9:00 PM – 1:00 AM) as maternal cortisol dips and melatonin rises.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Morning
              </span>
              <span className="text-xs font-bold">{morningCount} sessions</span>
            </div>
            <p className="text-[10px] text-slate-500">5:00 AM – 12:00 PM</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-sky-600" />
                Afternoon
              </span>
              <span className="text-xs font-bold">{afternoonCount} sessions</span>
            </div>
            <p className="text-[10px] text-slate-500">12:00 PM – 5:00 PM</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sunset className="w-3.5 h-3.5 text-indigo-600" />
                Evening
              </span>
              <span className="text-xs font-bold">{eveningCount} sessions</span>
            </div>
            <p className="text-[10px] text-slate-500">5:00 PM – 9:00 PM</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1 ring-2 ring-purple-400/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-600" />
                Night (Peak)
              </span>
              <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                {nightCount} sessions
              </span>
            </div>
            <p className="text-[10px] text-slate-500">9:00 PM – 2:00 AM</p>
          </div>
        </div>
      </section>

      {/* 6. HISTORICAL SESSIONS LIST */}
      <section className="bg-white dark:bg-[#1a1420] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-rose-100">
              Documented Fetal Movement History
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {kickSessions.length} Recorded Session{kickSessions.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-3">
          {kickSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-rose-100 text-sm">
                    {session.kickCount} Movements in {session.durationMinutes} Mins
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold capitalize">
                    {session.maternalPosture ? session.maternalPosture.replace("_", " ") : "Left side"}
                  </span>
                  {session.timeOfDay && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold capitalize">
                      {session.timeOfDay}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-rose-400">
                  {session.date} at {session.sessionStartTime} • Pace: ~
                  {(session.durationMinutes / Math.max(1, session.kickCount)).toFixed(1)} min/movement
                </div>

                {session.notes && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-300 italic pt-0.5">
                    "{session.notes}"
                  </p>
                )}
              </div>

              <span
                className={`px-3 py-1 rounded-full font-black text-[10px] self-end sm:self-center shrink-0 ${
                  session.kickCount >= 10
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-200"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200"
                }`}
              >
                {session.kickCount >= 10 ? "✓ 10-Goal Met" : "Paused Session"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* MODAL: ACOG DECREASED MOVEMENT TRIAGE */}
      {/* ========================================== */}
      {showLowMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-300 dark:border-amber-900/60 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-amber-200 dark:border-amber-900/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                    ACOG Decreased Fetal Movement Protocol
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-rose-300">
                    Evidence-based step-by-step clinical triage if baby is resting longer than usual.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLowMovementModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {LOW_MOVEMENT_TRIAGE_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.step}
                  </span>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-slate-900 dark:text-rose-100">
                      {step.title}
                    </h4>
                    <p className="text-slate-600 dark:text-rose-300 leading-relaxed">
                      {step.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300">
                    Primary Maternity Hospital
                  </span>
                  <p className="text-xs font-black text-slate-900 dark:text-rose-100">
                    {doctorName} • {hospitalName}
                  </p>
                </div>

                <button
                  onClick={() => setActivePage("emergency")}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hospital Triage</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLowMovementModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-rose-200 font-bold text-xs"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
