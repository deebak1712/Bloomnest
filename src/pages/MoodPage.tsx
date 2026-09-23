import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  MATERNAL_MOOD_ARCHETYPES,
  SLEEP_POSITIONS,
  NOCTURNAL_DISTURBANCES,
  PERINATAL_SUPPORT_RESOURCES,
  INITIAL_DEMO_MOOD_LOGS,
  MaternalMoodArchetype,
  SleepPositionOption,
} from "../data/maternalMoodSleepData";
import {
  playMaternalSleepSoundscape,
  stopMaternalSleepSoundscape,
  getMaternalSoundscapeStatus,
} from "../utils/maternalSoundscapes";
import {
  Moon,
  Smile,
  Sparkles,
  Heart,
  Plus,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Headphones,
  Volume2,
  VolumeX,
  PhoneCall,
  Activity,
  ChevronRight,
  Info,
  Clock,
  CheckCircle2,
  BedDouble,
  Compass,
  HeartHandshake,
  Waves,
  Coffee,
} from "lucide-react";

export const MoodPage: React.FC = () => {
  const { moodLogs, addMoodLog, user, setActivePage, t } = useApp();
  const currentWeek = user.currentWeek || 24;
  const trimester = user.trimester || 2;

  // If app moodLogs is empty, use initial authentic demo logs so user sees rich trends
  const displayLogs = moodLogs.length > 0 ? moodLogs : INITIAL_DEMO_MOOD_LOGS;

  // Active view tab
  const [activeTab, setActiveTab] = useState<"checkin" | "trends" | "soundscape" | "support">("checkin");

  // Form State
  const [selectedMoodId, setSelectedMoodId] = useState<string>("connected_joy");
  const [energyScore, setEnergyScore] = useState<number>(7);
  const [stressScore, setStressScore] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(8.0);
  const [sleepQuality, setSleepQuality] = useState<"poor" | "fair" | "good" | "excellent">("good");
  const [sleepPosition, setSleepPosition] = useState<SleepPositionOption["id"]>("left_side");
  const [nightAwakenings, setNightAwakenings] = useState<number>(1);
  const [selectedDisturbances, setSelectedDisturbances] = useState<string[]>([]);
  const [bedtime, setBedtime] = useState("10:30 PM");
  const [wakeTime, setWakeTime] = useState("06:30 AM");
  const [gratitudePrompt, setGratitudePrompt] = useState("");
  const [notes, setNotes] = useState("");
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Soundscape State
  const [activeSound, setActiveSound] = useState<"delta_432hz" | "womb_heartbeat" | "gentle_rain" | null>(null);
  const [soundVolume, setSoundVolume] = useState<number>(0.25);
  const [soundTimerMinutes, setSoundTimerMinutes] = useState<number>(15);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopMaternalSleepSoundscape();
    };
  }, []);

  // Quick stats calculation
  const totalLogs = displayLogs.length;
  const avgSleep = (
    displayLogs.reduce((acc, curr) => acc + (curr.sleepHours || 8), 0) / Math.max(1, totalLogs)
  ).toFixed(1);

  const safePositionLogs = displayLogs.filter(
    (l) => l.sleepPosition === "left_side" || l.sleepPosition === "right_side" || l.sleepPosition === "elevated_pillows"
  ).length;
  const safePositionPercent = Math.round((safePositionLogs / Math.max(1, totalLogs)) * 100);

  const selectedArchetype =
    MATERNAL_MOOD_ARCHETYPES.find((m) => m.id === selectedMoodId) || MATERNAL_MOOD_ARCHETYPES[0];

  const handleToggleDisturbance = (distId: string) => {
    setSelectedDisturbances((prev) =>
      prev.includes(distId) ? prev.filter((d) => d !== distId) : [...prev, distId]
    );
  };

  const handleToggleAudio = (mode: "delta_432hz" | "womb_heartbeat" | "gentle_rain") => {
    if (isAudioPlaying && activeSound === mode) {
      stopMaternalSleepSoundscape();
      setIsAudioPlaying(false);
      setActiveSound(null);
    } else {
      playMaternalSleepSoundscape(mode, soundVolume);
      setIsAudioPlaying(true);
      setActiveSound(mode);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodLog({
      date: new Date().toISOString().split("T")[0],
      mood: selectedArchetype.label,
      intensityScore: energyScore,
      sleepHours,
      sleepQuality,
      notes: notes || undefined,
      tags: [
        `Trimester ${trimester}`,
        `Position: ${sleepPosition}`,
        ...selectedDisturbances.slice(0, 2),
      ],
      sleepPosition,
      nightAwakenings,
      sleepDisturbances: selectedDisturbances,
      energyScore,
      stressScore,
      bedtime,
      wakeTime,
      gratitudePrompt: gratitudePrompt || undefined,
    });

    setHasSubmittedToday(true);
    setNotes("");
    setGratitudePrompt("");
    setActiveTab("trends");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 transform translate-y-8 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                Maternal Rest & Emotional Mindscape
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-300 text-slate-950 text-xs font-black">
                Week {currentWeek} • Trimester {trimester}
              </span>
            </div>

            {/* Quick Wind-down Pill */}
            {isAudioPlaying && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/40 text-xs font-bold text-emerald-200 animate-pulse">
                <Headphones className="w-3.5 h-3.5" />
                <span>Restorative Soundscape Active</span>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Maternal Mood & Restorative Sleep Studio 🌙
              </h1>
              <p className="text-sm sm:text-base text-purple-100 max-w-3xl leading-relaxed">
                Track restorative sleep architecture, ACOG left lateral posture adherence, and nuanced perinatal emotional states to protect maternal resilience and placental health.
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
                <span className="text-[11px] text-purple-200">Resting in Womb 💤</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">7-Day Avg Sleep</span>
              <span className="text-xl sm:text-2xl font-black text-white">{avgSleep} hrs</span>
              <span className="text-[11px] text-emerald-300 font-bold block mt-0.5">Optimal Range</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Safe Sleep Adherence</span>
              <span className="text-xl sm:text-2xl font-black text-white">{safePositionPercent}%</span>
              <span className="text-[11px] text-teal-300 font-bold block mt-0.5">ACOG SOS Aligned</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Current Mood Tone</span>
              <span className="text-sm sm:text-base font-black text-white truncate block">
                {selectedArchetype.emoji} {selectedArchetype.label}
              </span>
              <span className="text-[11px] text-rose-200 font-medium block mt-0.5 capitalize">
                {selectedArchetype.tone} state
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">Rest Quality Index</span>
              <span className="text-sm sm:text-base font-black text-white block">
                {displayLogs[0]?.sleepQuality.toUpperCase() || "GOOD"}
              </span>
              <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                {displayLogs[0]?.nightAwakenings || 1} Night Waking(s)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACOG SAFE SLEEP POSITION (SOS) ADVISORY BANNER */}
      <section className="pastel-lavender-card p-5 rounded-3xl border border-purple-200/60 dark:border-purple-900/50 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <BedDouble className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-slate-700 dark:text-rose-200 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-black text-slate-900 dark:text-rose-100 flex items-center gap-2">
              <span>ACOG Clinical Safe Sleep Posture: "Sleep On Side" (SOS)</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-200 text-[10px] font-black uppercase">
                2nd & 3rd Trimesters
              </span>
            </h3>
          </div>
          <p className="leading-relaxed">
            Clinical obstetric trials confirm that sleeping <strong>flat on your back (supine)</strong> after 20–28 weeks allows the heavy gravid uterus to compress your <em>Inferior Vena Cava (IVC)</em> and abdominal aorta, reducing venous return and placental oxygen delivery.
          </p>
          <p className="text-teal-900 dark:text-teal-300 font-bold">
            ✓ <strong>Left Lateral Sleep</strong> is the clinical gold standard: it optimizes blood flow to the placenta and assists maternal kidney function. Use a pillow between your knees and behind your back for pelvic alignment.
          </p>
        </div>
      </section>

      {/* 3. NAVIGATION TABS */}
      <div className="flex border-b border-rose-100 dark:border-rose-900/40 space-x-2 sm:space-x-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("checkin")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "checkin"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Daily Mood & Sleep Check-In</span>
        </button>

        <button
          onClick={() => setActiveTab("trends")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "trends"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Weekly Rest Rhythm & History</span>
        </button>

        <button
          onClick={() => setActiveTab("soundscape")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "soundscape"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Bedtime 432Hz Soundscapes</span>
        </button>

        <button
          onClick={() => setActiveTab("support")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm rounded-t-2xl border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "support"
              ? "border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-[#1a1420] shadow-sm"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-rose-300 dark:hover:text-white"
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Perinatal Emotional Support</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* TAB 1: DAILY CHECK-IN STUDIO */}
      {/* ========================================== */}
      {activeTab === "checkin" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PILLAR 1: EMOTIONAL MINDSCAPE */}
            <div className="bg-white dark:bg-[#1a1420] p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6">
              <div className="border-b border-rose-100 dark:border-rose-900/30 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-rose-500" />
                  <h2 className="text-base font-black text-slate-900 dark:text-rose-100">
                    Pillar 1: Emotional Mindscape
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">9 Perinatal Archetypes</span>
              </div>

              {/* Mood Archetype Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
                  Select Current Emotional State:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MATERNAL_MOOD_ARCHETYPES.map((arch) => {
                    const isSelected = selectedMoodId === arch.id;
                    return (
                      <button
                        type="button"
                        key={arch.id}
                        onClick={() => setSelectedMoodId(arch.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "bg-rose-500 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-rose-200 border-slate-200/70 dark:border-slate-800 hover:bg-rose-50"
                        }`}
                      >
                        <span className="text-xl">{arch.emoji}</span>
                        <div>
                          <p className="text-xs font-black leading-snug">{arch.label}</p>
                          <p
                            className={`text-[10px] line-clamp-1 ${
                              isSelected ? "text-rose-100" : "text-slate-500 dark:text-rose-400"
                            }`}
                          >
                            {arch.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Mood Somatic Advice Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 dark:text-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Somatic Centering Cue:</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-rose-300 leading-relaxed">
                  {selectedArchetype.somaticTip}
                </p>
              </div>

              {/* Energy & Stress Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-rose-200">Energy Level:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black">{energyScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={energyScore}
                    onChange={(e) => setEnergyScore(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Depleted</span>
                    <span>Radiant</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-rose-200">Stress / Tension:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black">{stressScore} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={stressScore}
                    onChange={(e) => setStressScore(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Peaceful</span>
                    <span>High Tension</span>
                  </div>
                </div>
              </div>

              {/* Baby Gratitude & Reflection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
                  Micro-Gratitude / Letter to Baby (Optional):
                </label>
                <textarea
                  rows={2}
                  value={gratitudePrompt}
                  onChange={(e) => setGratitudePrompt(e.target.value)}
                  placeholder="e.g. Loved feeling your little hiccups today. So excited to hold you."
                  className="w-full p-3 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* PILLAR 2: RESTORATIVE SLEEP ARCHITECTURE */}
            <div className="bg-white dark:bg-[#1a1420] p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6">
              <div className="border-b border-rose-100 dark:border-rose-900/30 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-base font-black text-slate-900 dark:text-rose-100">
                    Pillar 2: Restorative Sleep Architecture
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">Night Rest Log</span>
              </div>

              {/* Sleep Duration Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-rose-200">Hours Slept Last Night:</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {sleepHours.toFixed(1)} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={12.0}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>3.0h (Severe Insomnia)</span>
                  <span>8.0h (Target)</span>
                  <span>12.0h</span>
                </div>
              </div>

              {/* Sleep Quality Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
                  Perceived Sleep Quality:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["poor", "fair", "good", "excellent"] as const).map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setSleepQuality(q)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-extrabold capitalize transition-all border ${
                        sleepQuality === q
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-rose-200 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Position Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
                  Dominant Sleep Position:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SLEEP_POSITIONS.map((pos) => {
                    const isSelected = sleepPosition === pos.id;
                    return (
                      <button
                        type="button"
                        key={pos.id}
                        onClick={() => setSleepPosition(pos.id)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1 ${
                          isSelected
                            ? pos.isSafe
                              ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                              : "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-rose-200 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black">{pos.label}</span>
                          {pos.isSafe ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                          )}
                        </div>
                        <p
                          className={`text-[10px] leading-snug ${
                            isSelected ? "text-teal-100" : "text-slate-500 dark:text-rose-400"
                          }`}
                        >
                          {pos.subLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {sleepPosition === "back_supine" && (
                  <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 font-bold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      ACOG Advisory: Supine flat back sleep after Week 20 compresses the vena cava. Try wedging a pillow under your right hip to tilt yourself leftward.
                    </span>
                  </div>
                )}
              </div>

              {/* Night Awakenings & Nocturnal Disturbances */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-rose-200">
                    Night Awakenings:
                  </label>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setNightAwakenings(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                          nightAwakenings === num
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-rose-300"
                        }`}
                      >
                        {num === 4 ? "4+" : num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-rose-200">
                    Pregnancy Nocturnal Symptoms Experienced:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {NOCTURNAL_DISTURBANCES.map((d) => {
                      const isSelected = selectedDisturbances.includes(d.label);
                      return (
                        <button
                          type="button"
                          key={d.id}
                          onClick={() => handleToggleDisturbance(d.label)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-indigo-100 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700"
                              : "bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-rose-300 border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <span>{d.emoji}</span>
                          <span>{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Save Daily Rest & Emotional Mindscape Log</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================== */}
      {/* TAB 2: WEEKLY REST RHYTHM & HISTORY */}
      {/* ========================================== */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          {/* 7-Day Sleep Duration vs Target Chart */}
          <div className="bg-white dark:bg-[#1a1420] p-6 sm:p-8 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 dark:border-rose-900/30 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-rose-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <span>7-Day Rest Duration & Emotional Rhythm</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300">
                  Target maternal horizontal rest: 7.5 to 9.0 hours per night.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                  Sleep Hours
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
                  Safe SOS Position
                </span>
              </div>
            </div>

            {/* Visual Bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-4">
              {displayLogs.slice(0, 7).reverse().map((log) => {
                const heightPercent = Math.min(100, Math.round((log.sleepHours / 12) * 100));
                const isSafePos = log.sleepPosition === "left_side" || log.sleepPosition === "right_side";

                return (
                  <div key={log.id} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-black text-slate-700 dark:text-rose-200">
                      {log.sleepHours}h
                    </span>
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 h-40 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all shadow-sm ${
                          isSafePos
                            ? "bg-gradient-to-t from-teal-600 to-indigo-500"
                            : "bg-gradient-to-t from-amber-600 to-rose-500"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 truncate max-w-full">
                      {log.date.substring(5)}
                    </span>
                    <span className="text-xs font-bold" title={log.mood}>
                      {log.mood.includes("Joy") ? "🌸" : log.mood.includes("Calm") ? "🌿" : "🌙"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Log Cards */}
          <div className="bg-white dark:bg-[#1a1420] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-rose-100">
              Documented Mindscape & Sleep Logs
            </h3>

            <div className="space-y-3">
              {displayLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-black">
                        {log.mood}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {log.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                        {log.sleepHours} hrs ({log.sleepQuality})
                      </span>
                      {log.sleepPosition && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                          {log.sleepPosition === "left_side" ? "Left Lateral" : log.sleepPosition}
                        </span>
                      )}
                    </div>
                  </div>

                  {log.gratitudePrompt && (
                    <p className="text-xs text-rose-700 dark:text-rose-300 italic">
                      "Baby Note: {log.gratitudePrompt}"
                    </p>
                  )}

                  {log.notes && (
                    <p className="text-xs text-slate-600 dark:text-rose-200">
                      {log.notes}
                    </p>
                  )}

                  {log.sleepDisturbances && log.sleepDisturbances.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {log.sleepDisturbances.map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-rose-400"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: BEDTIME 432HZ SOUNDSCAPES */}
      {/* ========================================== */}
      {activeTab === "soundscape" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-black tracking-tight">
                  Harmonic 432Hz Somatic Sleep Player
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                In-Browser Synthesized
              </span>
            </div>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
              Synthesizes pure warm delta acoustic waves and pink-noise soothing rains directly in your browser. These calming frequencies slow maternal heart rate and lower cortisol before bedtime.
            </p>

            {/* Soundscape Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                onClick={() => handleToggleAudio("delta_432hz")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  activeSound === "delta_432hz" && isAudioPlaying
                    ? "bg-purple-600/60 border-amber-300 shadow-lg ring-2 ring-amber-300/50"
                    : "bg-white/10 hover:bg-white/15 border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌌</span>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-white/20">
                    {activeSound === "delta_432hz" && isAudioPlaying ? "Playing" : "Select"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black">432Hz Delta Binaural Wave</h4>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    Gentle harmonic drone with 2.5Hz delta brainwave resonance for deep REM sleep.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleToggleAudio("womb_heartbeat")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  activeSound === "womb_heartbeat" && isAudioPlaying
                    ? "bg-purple-600/60 border-amber-300 shadow-lg ring-2 ring-amber-300/50"
                    : "bg-white/10 hover:bg-white/15 border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💓</span>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-white/20">
                    {activeSound === "womb_heartbeat" && isAudioPlaying ? "Playing" : "Select"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black">Womb Heartbeat & Blood Flow</h4>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    Warm low 65 BPM maternal resting pulse hum that soothes both mother and baby.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleToggleAudio("gentle_rain")}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  activeSound === "gentle_rain" && isAudioPlaying
                    ? "bg-purple-600/60 border-amber-300 shadow-lg ring-2 ring-amber-300/50"
                    : "bg-white/10 hover:bg-white/15 border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌧️</span>
                  <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-white/20">
                    {activeSound === "gentle_rain" && isAudioPlaying ? "Playing" : "Select"}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-black">Gentle Monsoon Rain (Pink Noise)</h4>
                  <p className="text-[11px] text-purple-200 mt-0.5">
                    Filtered pink noise replicating soft rainfall on a bedroom window pane.
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            {isAudioPlaying && (
              <div className="pt-4 border-t border-white/20 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => stopMaternalSleepSoundscape()}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Soundscape</span>
                  </button>
                  <span className="text-xs text-purple-200 font-bold">
                    Playing: {activeSound?.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-purple-300 font-bold">Volume:</span>
                  <input
                    type="range"
                    min={0.05}
                    max={0.5}
                    step={0.05}
                    value={soundVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSoundVolume(v);
                      if (activeSound) playMaternalSleepSoundscape(activeSound, v);
                    }}
                    className="w-28 accent-amber-300"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: PERINATAL EMOTIONAL SUPPORT */}
      {/* ========================================== */}
      {activeTab === "support" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
                Maternal Emotional Resilience & Perinatal Triage
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-rose-300 leading-relaxed">
              Pregnancy carries profound hormonal and psychological shifts. Experiencing occasional anxiety, mood changes, or emotional exhaustion is common. You deserve a supportive, non-judgmental space to express every feeling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PERINATAL_SUPPORT_RESOURCES.map((res, i) => (
              <div
                key={i}
                className="p-5 bg-white dark:bg-[#1a1420] rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-black uppercase">
                    {res.badge}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-rose-100">
                    {res.name}
                  </h4>
                  <p className="text-xs font-black text-rose-600 dark:text-rose-400">
                    {res.phone}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-rose-300 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400">
                  {res.available}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
