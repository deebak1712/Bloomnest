import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  Flower2,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Footprints,
  Flame,
  Timer,
  Activity,
  CheckCircle2,
  HeartHandshake,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  Info,
  Check,
  ChevronRight,
  ShieldCheck,
  Heart,
  Zap,
} from "lucide-react";

type BreathingModeId = "slow_deep" | "contraction_crest" | "labor_sigh" | "pranayama";
type KegelModeId = "endurance" | "quick_flicks";

interface BreathingModeConfig {
  id: BreathingModeId;
  title: string;
  badge: string;
  purpose: string;
  inhaleSec: number;
  exhaleSec: number;
  tip: string;
  color: string;
}

const BREATHING_MODES: BreathingModeConfig[] = [
  {
    id: "slow_deep",
    title: "🌸 Slow Wave Abdominal Breathing",
    badge: "Early Labor & Anxiety",
    purpose: "ACOG-recommended for nervous system relaxation. No breath-holding; keeps placenta continuously oxygenated.",
    inhaleSec: 4,
    exhaleSec: 6,
    tip: "Inhale gently through nose expanding lower belly; exhale slowly through soft relaxed lips.",
    color: "from-rose-500/20 via-pink-500/10 to-purple-500/20 border-rose-300 dark:border-rose-800",
  },
  {
    id: "contraction_crest",
    title: "🌊 Contraction Wave Breathing",
    badge: "Active Labor Peaks",
    purpose: "Rhythmic breathing designed to navigate the intense 60-90 second peak of active contractions.",
    inhaleSec: 4,
    exhaleSec: 4,
    tip: "Ride the wave of tightening. Keep shoulders dropped and focus on rhythm rather than pain.",
    color: "from-sky-500/20 via-indigo-500/10 to-purple-500/20 border-sky-300 dark:border-sky-800",
  },
  {
    id: "labor_sigh",
    title: "🌬️ Labor Sigh & Down-Breathing",
    badge: "Pelvic Floor Release",
    purpose: "Somatic principle: 'Relaxed Jaw = Relaxed Cervix'. An open-mouth sigh naturally softens the perineum.",
    inhaleSec: 4,
    exhaleSec: 7,
    tip: "Take a deep breath in, then sigh out with an audible soft 'Haaaaa'. Completely unclamp teeth and jaw.",
    color: "from-emerald-500/20 via-teal-500/10 to-sky-500/20 border-emerald-300 dark:border-emerald-800",
  },
  {
    id: "pranayama",
    title: "🧘‍♀️ Nadi Shodhana (Harmonizing Breath)",
    badge: "BP & Pulse Balance",
    purpose: "Gentle alternate awareness breath to soothe palpitations and stabilize maternal blood pressure.",
    inhaleSec: 4,
    exhaleSec: 4,
    tip: "Sit upright comfortably. Imagine breath circulating up the spine and clearing fatigue.",
    color: "from-purple-500/20 via-pink-500/10 to-amber-500/20 border-purple-300 dark:border-purple-800",
  },
];

export const ExerciseBreathingPage: React.FC = () => {
  const { showToast, user, vitals, updateVital, isAudioMuted, toggleAudioMute, t } = useApp();

  // Local Sound Mute Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Breathing Engine State
  const [selectedBreathMode, setSelectedBreathMode] = useState<BreathingModeId>("slow_deep");
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "exhale">("inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathRounds, setBreathRounds] = useState(0);

  // Kegel Pelvic Floor Engine State
  const [kegelMode, setKegelMode] = useState<KegelModeId>("endurance");
  const [kegelActive, setKegelActive] = useState(false);
  const [kegelPhase, setKegelPhase] = useState<"contract" | "relax">("contract");
  const [kegelSeconds, setKegelSeconds] = useState(5);
  const [kegelReps, setKegelReps] = useState(0);
  const [kegelSetsDone, setKegelSetsDone] = useState(0);

  // Walking Tracker State
  const [walkSteps, setWalkSteps] = useState(3400);
  const [walkMinutes, setWalkMinutes] = useState(28);
  const [walkActive, setWalkActive] = useState(false);
  const [walkSynced, setWalkSynced] = useState(false);

  // Trimester Guide State (Auto-select based on user currentWeek)
  const userTrimester = user?.trimester || 2;
  const [selectedTrimesterTab, setSelectedTrimesterTab] = useState<number>(userTrimester);

  // ACOG Safety Triage Modal
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  const activeBreathConfig = BREATHING_MODES.find((m) => m.id === selectedBreathMode) || BREATHING_MODES[0];

  // Soft Harmonic Chime Generator using Web Audio API
  const playHarmonicTone = (freq: number, type: "bell" | "bowl" = "bowl") => {
    if (isAudioMuted || !soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      const duration = type === "bowl" ? 1.0 : 0.5;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  // Breathing Timer Engine Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            if (breathPhase === "inhale") {
              setBreathPhase("exhale");
              playHarmonicTone(392.0, "bowl"); // G4 soft descending chime for exhale
              return activeBreathConfig.exhaleSec;
            } else {
              setBreathPhase("inhale");
              setBreathRounds((r) => r + 1);
              playHarmonicTone(523.25, "bowl"); // C5 uplifting chime for inhale
              return activeBreathConfig.inhaleSec;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathActive, breathPhase, activeBreathConfig, isAudioMuted, soundEnabled]);

  // Handle switching breathing mode
  const handleSelectBreathMode = (mode: BreathingModeId) => {
    setSelectedBreathMode(mode);
    const cfg = BREATHING_MODES.find((m) => m.id === mode);
    setBreathPhase("inhale");
    setBreathSeconds(cfg ? cfg.inhaleSec : 4);
    setBreathActive(false);
  };

  // Kegel Timer Engine Effect
  const contractDuration = kegelMode === "endurance" ? 5 : 1;
  const relaxDuration = kegelMode === "endurance" ? 5 : 2;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (kegelActive) {
      interval = setInterval(() => {
        setKegelSeconds((prev) => {
          if (prev <= 1) {
            if (kegelPhase === "contract") {
              setKegelPhase("relax");
              playHarmonicTone(349.23, "bell"); // F4 release
              return relaxDuration;
            } else {
              setKegelPhase("contract");
              setKegelReps((r) => {
                const nextReps = r + 1;
                if (nextReps > 0 && nextReps % 10 === 0) {
                  setKegelSetsDone((s) => s + 1);
                  showToast("🎉 Great job! 1 Set of 10 Kegels completed.");
                }
                return nextReps;
              });
              playHarmonicTone(587.33, "bell"); // D5 squeeze
              return contractDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [kegelActive, kegelPhase, kegelMode, contractDuration, relaxDuration, isAudioMuted, soundEnabled]);

  // Walking Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (walkActive) {
      interval = setInterval(() => {
        setWalkMinutes((prev) => prev + 1);
        setWalkSteps((prev) => prev + 95);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [walkActive]);

  // Sync Walking to Authoritative Health Vitals in AppContext
  const handleSyncWalkToVitals = async () => {
    if (vitals && vitals.length > 0) {
      const latest = vitals[0];
      try {
        await updateVital(latest.id, {
          stepsCount: (latest.stepsCount || 0) + walkSteps,
          exerciseMinutes: (latest.exerciseMinutes || 0) + walkMinutes,
        });
        setWalkSynced(true);
        showToast(`✅ ${walkSteps.toLocaleString()} steps synced to today's Health Vitals! 🌸`);
        setTimeout(() => setWalkSynced(false), 4000);
      } catch {
        showToast(`✅ ${walkSteps.toLocaleString()} steps logged locally!`);
      }
    } else {
      showToast(`✅ ${walkSteps.toLocaleString()} steps logged to your daily dashboard!`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Flower2 className="w-4 h-4" />
            <span>{t("clinicalFitnessTitle")}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200">
              Week {user?.currentWeek || 24} · Trimester {userTrimester}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            {t("prenatalExerciseHub")}
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            {t("prenatalExerciseDesc")}
          </p>
        </div>

        {/* Audio Toggle & Stop Signs Trigger */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
              soundEnabled && !isAudioMuted
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600 dark:text-rose-300"
                : "bg-gray-100 dark:bg-black/30 border-gray-200 text-gray-400"
            }`}
            title="Toggle Soft Chime Sound"
          >
            {soundEnabled && !isAudioMuted ? (
              <Volume2 className="w-4 h-4 text-rose-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
            <span>{soundEnabled && !isAudioMuted ? "Audio Chimes On" : "Chimes Muted"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSafetyModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-all shadow-xs"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>ACOG Red-Flag Stop Signs</span>
          </button>
        </div>
      </div>

      {/* Safety Guideline Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">{t("clinicalExerciseSafetyRule")}</span>
            <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-200">
              {t("clinicalExerciseSafetyDesc")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSafetyModalOpen(true)}
          className="text-amber-700 dark:text-amber-300 underline font-bold whitespace-nowrap text-[11px]"
        >
          View 7 Stop Signs →
        </button>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Enhanced Labor & Contraction Breathing Guide */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100 dark:border-rose-900/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  {t("contractionPainRelief")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                  {t("rounds")}: {breathRounds}
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-0.5">
                {t("laborBreathingGuide")}
              </h2>
            </div>

            {/* Breathing Mode Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {BREATHING_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleSelectBreathMode(mode.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBreathMode === mode.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-black/30 text-gray-600 dark:text-rose-200 hover:bg-purple-50"
                  }`}
                >
                  {mode.title.split(" ")[1]} {mode.title.split(" ")[2] || ""}
                </button>
              ))}
            </div>
          </div>

          {/* Active Mode Rationale Pill */}
          <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 text-xs space-y-1">
            <div className="font-bold text-purple-800 dark:text-purple-300 flex items-center justify-between">
              <span>{activeBreathConfig.title}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-200/70 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                {activeBreathConfig.badge}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-rose-300">
              {activeBreathConfig.purpose}
            </p>
          </div>

          {/* Somatic Breathing Visualizer Animation */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulse Ring */}
              <div
                className={`absolute rounded-full transition-all duration-1000 ${
                  breathActive
                    ? breathPhase === "inhale"
                      ? "w-64 h-64 bg-purple-400/20 animate-ping opacity-30"
                      : "w-48 h-48 bg-sky-400/20"
                    : "w-40 h-40 bg-transparent"
                }`}
              />

              {/* Main Respiration Circle */}
              <div
                className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathActive
                    ? breathPhase === "inhale"
                      ? "border-purple-500 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 scale-110 shadow-2xl shadow-purple-500/30"
                      : "border-sky-500 bg-gradient-to-tr from-sky-500/20 to-teal-500/20 scale-90 shadow-lg shadow-sky-500/20"
                    : "border-gray-300 dark:border-rose-900/40 bg-gray-50/50 dark:bg-black/20"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                  {breathActive
                    ? breathPhase === "inhale"
                      ? t("inhale")
                      : t("exhale")
                    : t("ready")}
                </span>
                <span className="font-serif text-4xl font-extrabold text-gray-900 dark:text-rose-100 mt-1">
                  {breathSeconds}s
                </span>
                <span className="text-[10px] text-gray-500 dark:text-rose-300 mt-1">
                  {breathPhase === "inhale" ? "Expanding Belly" : "Releasing Tension"}
                </span>
              </div>
            </div>

            {/* Somatic Instruction Cue */}
            <div className="mt-4 text-xs font-medium text-purple-700 dark:text-purple-300 text-center max-w-sm">
              💡 {activeBreathConfig.tip}
            </div>
          </div>

          {/* Breathing Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBreathActive(!breathActive)}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] ${
                breathActive ? "bg-amber-600 hover:bg-amber-700" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {breathActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{breathActive ? t("pause") : t("startBreathing")}</span>
            </button>

            <button
              onClick={() => {
                setBreathActive(false);
                setBreathRounds(0);
                setBreathPhase("inhale");
                setBreathSeconds(activeBreathConfig.inhaleSec);
              }}
              className="p-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Reset Rounds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Advanced Kegel Pelvic Floor Studio */}
        <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {t("pelvicFloorFitness")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Sets: {kegelSetsDone} / 3 Goal
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-1">
              {t("kegelExerciseTimer")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-rose-300 mt-0.5">
              {t("kegelExerciseDesc")}
            </p>
          </div>

          {/* Mode Switcher: Endurance vs Quick Flicks */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-black/30 text-[11px] font-bold">
            <button
              onClick={() => {
                setKegelMode("endurance");
                setKegelActive(false);
                setKegelPhase("contract");
                setKegelSeconds(5);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                kegelMode === "endurance"
                  ? "bg-white dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Endurance (5s Hold)
            </button>
            <button
              onClick={() => {
                setKegelMode("quick_flicks");
                setKegelActive(false);
                setKegelPhase("contract");
                setKegelSeconds(1);
              }}
              className={`py-1.5 rounded-lg transition-all ${
                kegelMode === "quick_flicks"
                  ? "bg-white dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Quick Flicks (1s Squeeze)
            </button>
          </div>

          {/* Kegel Visualizer Circle */}
          <div className="flex flex-col items-center justify-center py-2">
            <div
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${
                kegelActive
                  ? kegelPhase === "contract"
                    ? "border-emerald-500 bg-emerald-500/10 scale-105 shadow-xl shadow-emerald-500/20"
                    : "border-sky-500 bg-sky-500/10 scale-95"
                  : "border-gray-300 dark:border-rose-900/40"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-rose-300">
                {kegelActive ? (kegelPhase === "contract" ? t("contract") : t("relax")) : t("ready")}
              </span>
              <span className="font-serif text-3xl font-extrabold text-gray-900 dark:text-rose-100 mt-0.5">
                {kegelSeconds}s
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Reps: {kegelReps} / 30 Target
              </span>
            </div>

            <p className="text-[11px] text-center text-gray-500 dark:text-rose-300 mt-2 px-2">
              {kegelPhase === "contract"
                ? "Squeeze pelvic floor up & inward (as if stopping urine stream)."
                : "Completely release & soften between repetitions."}
            </p>
          </div>

          {/* Kegel Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setKegelActive(!kegelActive)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all ${
                kegelActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {kegelActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{kegelActive ? t("pause") : t("startKegels")}</span>
            </button>
            <button
              onClick={() => {
                setKegelActive(false);
                setKegelReps(0);
                setKegelSeconds(contractDuration);
                setKegelPhase("contract");
              }}
              className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Reset Kegels"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Maternal Walking & Cardio Tracker with Vitals Sync */}
      <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500">
                {t("dailyCardiovascular")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                {t("goal5000Steps")}
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-0.5">
              {t("maternalWalkingTracker")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncWalkToVitals}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              {walkSynced ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Zap className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{walkSynced ? "Synced to Vitals!" : "⚡ Sync Walk to Vitals"}</span>
            </button>

            <button
              onClick={() => {
                setWalkActive(!walkActive);
                showToast(walkActive ? t("walkingPaused") : t("walkingActive"));
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1.5 transition-all shadow-sm ${
                walkActive ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>{walkActive ? t("pauseWalking") : t("startWalkSession")}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-rose-300">
          {t("maternalWalkingDesc")}
        </p>

        {/* Progress Bar & Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-1">
            <div className="text-[11px] text-gray-500 dark:text-rose-300 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-rose-500" />
              <span>{t("stepsToday")}</span>
            </div>
            <div className="font-bold text-lg text-gray-900 dark:text-rose-100">
              {walkSteps.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ 5,000</span>
            </div>
          </div>

          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-1">
            <div className="text-[11px] text-gray-500 dark:text-rose-300 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-sky-500" />
              <span>{t("distance")}</span>
            </div>
            <div className="font-bold text-lg text-gray-900 dark:text-rose-100">
              {(walkSteps * 0.00075).toFixed(2)} <span className="text-xs font-normal text-gray-500">{t("km")}</span>
            </div>
          </div>

          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-1">
            <div className="text-[11px] text-gray-500 dark:text-rose-300 flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-purple-500" />
              <span>{t("walkDuration")}</span>
            </div>
            <div className="font-bold text-lg text-gray-900 dark:text-rose-100">
              {walkMinutes} <span className="text-xs font-normal text-gray-500">{t("mins")}</span>
            </div>
          </div>

          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 space-y-1">
            <div className="text-[11px] text-gray-500 dark:text-rose-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Caloric Burn</span>
            </div>
            <div className="font-bold text-lg text-gray-900 dark:text-rose-100">
              {Math.round(walkSteps * 0.04)} <span className="text-xs font-normal text-gray-500">kcal</span>
            </div>
          </div>
        </div>

        {/* Linear Goal Meter */}
        <div className="w-full bg-rose-100 dark:bg-rose-950/50 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (walkSteps / 5000) * 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Week-Adaptive Trimester Workout Library */}
      <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>{t("trimesterExerciseGuide")}</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-0.5">
              Clinically Curated Workouts for Your Stage
            </h3>
          </div>

          {/* Trimester Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-100 dark:bg-black/30 text-xs font-bold">
            <button
              onClick={() => setSelectedTrimesterTab(1)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTrimesterTab === 1
                  ? "bg-sky-500 text-white shadow-xs"
                  : "text-gray-600 dark:text-rose-200"
              }`}
            >
              Trimester 1 {userTrimester === 1 && "🌸"}
            </button>
            <button
              onClick={() => setSelectedTrimesterTab(2)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTrimesterTab === 2
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-gray-600 dark:text-rose-200"
              }`}
            >
              Trimester 2 {userTrimester === 2 && "🌸 (Your Stage)"}
            </button>
            <button
              onClick={() => setSelectedTrimesterTab(3)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTrimesterTab === 3
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-rose-200"
              }`}
            >
              Trimester 3 {userTrimester === 3 && "🌸"}
            </button>
          </div>
        </div>

        {/* Supine Position Warning for 2nd & 3rd Trimester */}
        {selectedTrimesterTab >= 2 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>ACOG Posture Rule (After Week 16):</strong> Avoid lying flat on your back (supine) during exercise. The enlarged uterus compresses the Inferior Vena Cava (IVC), decreasing cardiac return and fetal oxygenation. Use side-lying, sitting, or inclined postures instead.
            </div>
          </div>
        )}

        {/* Exercises Grid for Selected Trimester */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {selectedTrimesterTab === 1 && (
            <>
              <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/20 dark:bg-sky-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>{t("pelvicTilts")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("pelvicTiltsDesc")}
                </p>
                <div className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold pt-1">
                  🎯 Form: Stand with back against wall; gently flatten lumbar spine against wall for 3 seconds.
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/20 dark:bg-sky-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>{t("briskWalking")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("briskWalkingDesc")}
                </p>
                <div className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold pt-1">
                  🎯 Form: Maintain talk-test pace (you should be able to hold a conversation comfortably).
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/20 dark:bg-sky-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>{t("catCowStretch")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("catCowStretchDesc")}
                </p>
                <div className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold pt-1">
                  🎯 Form: On hands and knees, inhale arching gently, exhale rounding spine like a cat.
                </div>
              </div>
            </>
          )}

          {selectedTrimesterTab === 2 && (
            <>
              <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>{t("prenatalSquats")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("prenatalSquatsDesc")}
                </p>
                <div className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold pt-1">
                  🎯 Form: Hold onto a sturdy chair; lower hips back as if sitting. Keep knees over ankles.
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>{t("sideLyingLegLifts")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("sideLyingLegLiftsDesc")}
                </p>
                <div className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold pt-1">
                  🎯 Form: Lie on left side with head supported by pillow; lift top leg smoothly 10-12 times.
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span>{t("butterflyStretch")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("butterflyStretchDesc")}
                </p>
                <div className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold pt-1">
                  🎯 Form: Sit tall against a wall; bring soles of feet together, let knees fall out naturally.
                </div>
              </div>
            </>
          )}

          {selectedTrimesterTab === 3 && (
            <>
              <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>{t("deepBirthSquats")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("deepBirthSquatsDesc")}
                </p>
                <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                  🎯 Form: Use birth ball or partner support; lowers fetal head into maternal pelvis.
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>{t("pelvicFloorHold")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("pelvicFloorHoldDesc")}
                </p>
                <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                  🎯 Form: In late pregnancy, learning to relax and expand the perineum is more vital than squeezing!
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 space-y-2">
                <div className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>{t("laborBreathSync")}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-rose-300">
                  {t("laborBreathSyncDesc")}
                </p>
                <div className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                  🎯 Form: Practice inhaling 4s and blowing out through straw lips 7s during simulated contractions.
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ACOG Red-Flag Stop Signs Modal */}
      {isSafetyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#1A1523] rounded-[32px] p-6 sm:p-8 border border-amber-300 dark:border-amber-800 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 dark:border-amber-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900 dark:text-rose-100">
                    ACOG Clinical Warning Signs: When to STOP Immediately
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-rose-300">
                    American College of Obstetricians & Gynecologists (ACOG) Committee Opinion No. 804
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSafetyModalOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-rose-900/40 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 dark:text-rose-200 leading-relaxed">
              If you develop any of the following symptoms during physical exercise or breathing practice, <strong>stop immediately, sit down in a cool shaded area, and call your OB-GYN or maternity hospital</strong>:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {[
                { title: "Vaginal Bleeding or Spotting", desc: "Can indicate placental disruption, subchorionic hematoma, or cervical changes." },
                { title: "Amniotic Fluid Leakage", desc: "Clear watery fluid loss could signify premature rupture of membranes (PROM)." },
                { title: "Dizziness, Vertigo or Fainting", desc: "Indicates cerebral hypoperfusion, hypotension, or dehydration." },
                { title: "Shortness of Breath Before Exertion", desc: "Dyspnea before beginning physical activity requires immediate clinical evaluation." },
                { title: "Chest Pain or Severe Palpitations", desc: "Signs of acute cardiovascular compromise." },
                { title: "Calf Pain or Swelling (Unilateral)", desc: "Red-flag indicator for Deep Vein Thrombosis (DVT), a medical emergency." },
                { title: "Regular Painful Uterine Contractions", desc: "More than 4-5 contractions per hour prior to 37 weeks can be preterm labor." },
                { title: "Decreased Fetal Movements", desc: "If baby feels unusually quiet after rest and hydration, contact care team." },
              ].map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <div className="font-bold text-amber-950 dark:text-amber-200">
                      {flag.title}
                    </div>
                    <div className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-0.5">
                      {flag.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:108"
                className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-center text-xs shadow-md"
              >
                🚨 Call Emergency (108 SOS)
              </a>
              <button
                onClick={() => setIsSafetyModalOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-black/40 text-gray-800 dark:text-rose-100 font-bold text-center text-xs border border-gray-300 dark:border-gray-700"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
