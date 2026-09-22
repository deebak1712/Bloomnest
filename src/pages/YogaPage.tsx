import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Flower2,
  Play,
  Square,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Flame,
  Activity,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { PRENATAL_YOGA_POSES, PrenatalYogaPose } from "../data/prenatalYogaData";

export const YogaPage: React.FC = () => {
  const { user, showToast, isAudioMuted, toggleAudioMute, t } = useApp();

  // Local Sound Mute Toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected Pose Detail Modal
  const [activeDetailPose, setActiveDetailPose] = useState<PrenatalYogaPose | null>(null);

  // Somatic Breathing Pacer State (Continuous 4s In / 6s Out - No Breath Holding)
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Exhale">("Inhale");
  const [timerCount, setTimerCount] = useState(4);
  const [breathCyclesDone, setBreathCyclesDone] = useState(0);

  // Guided Practice Flow State
  const [isFlowActive, setIsFlowActive] = useState(false);
  const [flowPoseIndex, setFlowPoseIndex] = useState(0);
  const [flowSecondsLeft, setFlowSecondsLeft] = useState(90);
  const [isFlowPaused, setIsFlowPaused] = useState(false);

  // Preset Routines
  const FLOW_PRESETS = [
    {
      id: "morning",
      title: "Morning Hip & Spine Awakening (8 Mins)",
      badge: "Gentle Mobility",
      poseIds: ["cat-cow", "baddha-konasana", "virabhadrasana-2", "balasana"],
    },
    {
      id: "labor_prep",
      title: "Labor Prep & Pelvic Outlet Drop (10 Mins)",
      badge: "Trimester 3 Focus",
      poseIds: ["baddha-konasana", "malasana", "utkata-konasana", "balasana"],
    },
    {
      id: "evening_edema",
      title: "Evening Sciatica & Edema Relief (10 Mins)",
      badge: "Restorative Reset",
      poseIds: ["cat-cow", "balasana", "viparita-karani", "parsva-savasana"],
    },
  ];

  const [activePresetId, setActivePresetId] = useState("morning");
  const currentPreset = FLOW_PRESETS.find((p) => p.id === activePresetId) || FLOW_PRESETS[0];
  const flowSequencePoses = currentPreset.poseIds
    .map((id) => PRENATAL_YOGA_POSES.find((p) => p.id === id))
    .filter(Boolean) as PrenatalYogaPose[];

  const currentFlowPose = flowSequencePoses[flowPoseIndex] || flowSequencePoses[0];

  // Soft Harmonic Singing Bowl Chime using Web Audio API
  const playSoftChime = (freq = 440, type: "bowl" | "bell" = "bowl") => {
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
      const duration = type === "bowl" ? 1.1 : 0.6;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  // Somatic Continuous Breathing Effect (4s In / 6s Out - No Breath Holding)
  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setTimerCount((prev) => {
        if (prev > 1) return prev - 1;

        if (breathPhase === "Inhale") {
          setBreathPhase("Exhale");
          playSoftChime(392.0, "bowl"); // G4 soft descending note for long exhale
          return 6;
        } else {
          setBreathPhase("Inhale");
          setBreathCyclesDone((c) => c + 1);
          playSoftChime(523.25, "bowl"); // C5 soft note for fresh inhale
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase, isAudioMuted, soundEnabled]);

  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathPhase("Inhale");
      setTimerCount(4);
    } else {
      setIsBreathing(true);
      setBreathPhase("Inhale");
      setTimerCount(4);
      playSoftChime(523.25, "bowl");
    }
  };

  // Guided Routine Flow Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFlowActive && !isFlowPaused) {
      interval = setInterval(() => {
        setFlowSecondsLeft((prev) => {
          if (prev <= 1) {
            // Advance to next pose or complete flow
            if (flowPoseIndex < flowSequencePoses.length - 1) {
              setFlowPoseIndex((idx) => idx + 1);
              playSoftChime(659.25, "bell"); // E5 transition bell
              const nextPose = flowSequencePoses[flowPoseIndex + 1];
              return nextPose ? nextPose.durationSec : 90;
            } else {
              setIsFlowActive(false);
              playSoftChime(523.25, "bowl");
              showToast("🌸 Namaste! You completed your prenatal yoga flow.");
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFlowActive, isFlowPaused, flowPoseIndex, flowSequencePoses, isAudioMuted, soundEnabled]);

  const startGuidedFlow = (presetId: string) => {
    setActivePresetId(presetId);
    setFlowPoseIndex(0);
    const preset = FLOW_PRESETS.find((p) => p.id === presetId) || FLOW_PRESETS[0];
    const firstPose = PRENATAL_YOGA_POSES.find((p) => p.id === preset.poseIds[0]);
    setFlowSecondsLeft(firstPose ? firstPose.durationSec : 90);
    setIsFlowActive(true);
    setIsFlowPaused(false);
    playSoftChime(523.25, "bowl");
    showToast(`🧘‍♀️ Starting ${preset.title}!`);
  };

  const nextFlowPose = () => {
    if (flowPoseIndex < flowSequencePoses.length - 1) {
      const nextIdx = flowPoseIndex + 1;
      setFlowPoseIndex(nextIdx);
      const nextP = flowSequencePoses[nextIdx];
      setFlowSecondsLeft(nextP ? nextP.durationSec : 90);
      playSoftChime(587.33, "bell");
    }
  };

  const prevFlowPose = () => {
    if (flowPoseIndex > 0) {
      const prevIdx = flowPoseIndex - 1;
      setFlowPoseIndex(prevIdx);
      const prevP = flowSequencePoses[prevIdx];
      setFlowSecondsLeft(prevP ? prevP.durationSec : 90);
      playSoftChime(523.25, "bell");
    }
  };

  const stopGuidedFlow = () => {
    setIsFlowActive(false);
    setIsFlowPaused(false);
    setFlowPoseIndex(0);
  };

  // Filter poses by category
  const filteredPoses =
    selectedCategory === "all"
      ? PRENATAL_YOGA_POSES
      : PRENATAL_YOGA_POSES.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Flower2 className="w-4 h-4" />
            <span>{t("pelvicMindfulWellness")}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200">
              Week {user?.currentWeek || 24} Stage
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            {t("prenatalYogaGuide")}
          </h1>
          <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
            {t("prenatalYogaDesc")}
          </p>
        </div>

        {/* Action Controls: Sound Chime Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
              soundEnabled && !isAudioMuted
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600 dark:text-rose-300"
                : "bg-gray-100 dark:bg-black/30 border-gray-200 text-gray-400"
            }`}
            title="Toggle Singing Bowl Chimes"
          >
            {soundEnabled && !isAudioMuted ? (
              <Volume2 className="w-4 h-4 text-rose-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
            <span>{soundEnabled && !isAudioMuted ? "Chimes Active" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Relaxin Hormone & Joint Safety Guard Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">{t("relaxinWarningTitle")}</span>
          <p className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
            {t("relaxinWarningDesc")} Avoid deep closed twists across the abdomen, hot yoga, and inversions without wall support.
          </p>
        </div>
      </div>

      {/* Active Guided Flow Player (Visible when user starts a flow) */}
      {isFlowActive && currentFlowPose && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-rose-950 text-white shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-white/10 text-rose-200 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>
                Guided Flow: Pose {flowPoseIndex + 1} of {flowSequencePoses.length}
              </span>
            </span>

            <span className="text-sm font-serif font-extrabold text-amber-300">
              {Math.floor(flowSecondsLeft / 60)}:{(flowSecondsLeft % 60).toString().padStart(2, "0")} left
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <img
              src={currentFlowPose.imageUrl}
              alt={currentFlowPose.sanskritName}
              className="w-full h-40 object-cover rounded-2xl border border-white/20 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="sm:col-span-2 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-rose-300">
                {currentFlowPose.sanskritName}
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                {currentFlowPose.englishName}
              </h3>
              <p className="text-[11px] text-purple-200 leading-relaxed">
                {currentFlowPose.benefits}
              </p>
              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                💡 Form Cue: {currentFlowPose.stepByStep[0]}
              </div>
            </div>
          </div>

          {/* Flow Progress Bar */}
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-amber-400 h-full transition-all duration-1000"
              style={{
                width: `${((flowPoseIndex * 90 + (90 - flowSecondsLeft)) / (flowSequencePoses.length * 90)) * 100}%`,
              }}
            />
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prevFlowPose}
              disabled={flowPoseIndex === 0}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Prev Pose</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFlowPaused(!isFlowPaused)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                {isFlowPaused ? <Play className="w-4 h-4 fill-current" /> : <Square className="w-4 h-4 fill-current" />}
                <span>{isFlowPaused ? "Resume" : "Pause"}</span>
              </button>

              <button
                onClick={stopGuidedFlow}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-bold"
              >
                Stop Flow
              </button>
            </div>

            <button
              onClick={nextFlowPose}
              disabled={flowPoseIndex === flowSequencePoses.length - 1}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <span>Next Pose</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Preset Routines Quick Picker */}
      <div className="bg-white dark:bg-[#1a1523] p-5 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-gray-800 dark:text-rose-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>Select Guided Flow Routine</span>
          </span>
          <span className="text-rose-600 dark:text-rose-300 text-[11px]">
            Audio-guided pose transitions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FLOW_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => startGuidedFlow(preset.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                activePresetId === preset.id && isFlowActive
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 shadow-xs"
                  : "bg-gray-50/50 dark:bg-black/20 border-gray-200 dark:border-gray-800 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {preset.badge}
                </span>
                <span className="text-xs text-rose-500 font-bold flex items-center gap-0.5">
                  ▶ Start
                </span>
              </div>
              <div className="font-serif font-bold text-xs text-gray-900 dark:text-rose-100 mt-2">
                {preset.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Somatic Continuous Pranayama Breathing Card (No Breath Holding) */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-rose-950 text-white shadow-xl flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-1">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-rose-300">
            {t("guidedBreathPacer")}
          </span>
          <h2 className="font-serif text-2xl font-bold">{t("laborRelaxationBreath")}</h2>
          <p className="text-xs text-purple-200 max-w-sm">
            Continuous somatic wave: 4 seconds gentle inhale into lower belly, 6 seconds long relaxing exhale. Zero breath-holding for baby's continuous oxygenation.
          </p>
        </div>

        {/* Pulsing Breathing Circle */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 opacity-30 transition-all duration-1000 ${
              isBreathing && breathPhase === "Inhale"
                ? "scale-125 duration-[4000ms]"
                : isBreathing && breathPhase === "Exhale"
                ? "scale-75 duration-[6000ms]"
                : "scale-100"
            }`}
          />
          <div className="w-36 h-36 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-md flex flex-col items-center justify-center relative z-10 shadow-2xl">
            <span className="text-sm font-bold text-amber-300 uppercase tracking-widest">
              {isBreathing ? (breathPhase === "Inhale" ? t("inhale") : t("exhale")) : t("ready")}
            </span>
            <span className="font-serif text-4xl font-extrabold my-1">
              {isBreathing ? `${timerCount}s` : "4s - 6s"}
            </span>
            <span className="text-[10px] text-purple-200">
              {isBreathing
                ? breathPhase === "Inhale"
                  ? "Expanding Belly"
                  : "Softening Perineum"
                : "Continuous Wave"}
            </span>
          </div>
        </div>

        <button
          onClick={toggleBreathing}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          {isBreathing ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isBreathing ? t("pauseBreathPacer") : t("startGuidedBreathing")}</span>
        </button>
      </div>

      {/* Category Filter Chips for Yoga Poses */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {[
          { id: "all", label: "All Poses (8)" },
          { id: "pelvic_opening", label: "Pelvic Opening & Labor (2)" },
          { id: "back_sciatica", label: "Lower Back & Sciatica (2)" },
          { id: "stamina_balance", label: "Stamina & Upright Birth (2)" },
          { id: "restorative", label: "Restorative & Edema (2)" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-2xl whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:border-rose-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Curated 8-Pose Prenatal Library Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPoses.map((pose) => (
          <div
            key={pose.id}
            onClick={() => setActiveDetailPose(pose)}
            className="bg-white dark:bg-[#1a1523] rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-xs hover:shadow-md hover:border-rose-300 transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
          >
            <div>
              <img
                src={pose.imageUrl}
                alt={pose.sanskritName}
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200">
                    {pose.trimester}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-rose-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-500" />
                    {pose.durationLabel}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {pose.sanskritName}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-gray-900 dark:text-rose-100 line-clamp-1">
                    {pose.englishName}
                  </h3>
                </div>

                <p className="text-[11px] text-gray-600 dark:text-rose-300 line-clamp-2 leading-relaxed">
                  {pose.benefits}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-rose-100 dark:border-rose-900/30 mt-2 flex items-center justify-between text-xs text-rose-600 dark:text-rose-300 font-bold">
              <span>View Form & Props</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Pose Detail & Step-by-Step Modal */}
      {activeDetailPose && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-[#1A1523] rounded-[32px] p-6 sm:p-8 border border-rose-200 dark:border-rose-900 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-900/40">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {activeDetailPose.sanskritName}
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100">
                  {activeDetailPose.englishName}
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailPose(null)}
                className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <img
              src={activeDetailPose.imageUrl}
              alt={activeDetailPose.sanskritName}
              className="w-full h-48 object-cover rounded-2xl border border-rose-100 dark:border-rose-900/40"
              referrerPolicy="no-referrer"
            />

            <div className="space-y-2">
              <div className="font-bold text-gray-800 dark:text-rose-100">
                🌿 Clinical Benefits
              </div>
              <p className="text-gray-600 dark:text-rose-300 leading-relaxed text-[11px]">
                {activeDetailPose.benefits}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-gray-800 dark:text-rose-100">
                🧘‍♀️ Step-by-Step Form Cues
              </div>
              <div className="space-y-1.5 text-[11px] text-gray-600 dark:text-rose-300">
                {activeDetailPose.stepByStep.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 text-[11px]">
              <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Props Recommended:</span>
              </div>
              <div className="text-gray-600 dark:text-rose-300">
                {activeDetailPose.props.join(" · ")}
              </div>
            </div>

            <div className="space-y-1 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-[11px]">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ACOG Safety Guard:</span>
              </div>
              <div className="text-amber-900 dark:text-amber-200">
                {activeDetailPose.acogSafetyTip}
              </div>
            </div>

            <button
              onClick={() => setActiveDetailPose(null)}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
            >
              Close Pose Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
