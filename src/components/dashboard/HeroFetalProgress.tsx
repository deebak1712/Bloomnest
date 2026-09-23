import React, { useState } from "react";
import { PageView } from "../../types";
import { ProgressRing } from "../ui/ProgressRing";
import { Heart, ChevronRight, Sparkles, Volume2, VolumeX, Activity, Compass, RotateCcw } from "lucide-react";

// Asset Images
import pastelMotherArt from "../../assets/images/pastel_mother_art_1785746033662.jpg";
import cornCobArt from "../../assets/images/corn_cob_art_1785746048803.jpg";
import roseGoldFetalArt from "../../assets/images/rosegold_fetal_art_1785730367099.jpg";
import { PREGNANCY_WEEKS_DATA } from "../../data/pregnancyWeeksData";

interface HeroFetalProgressProps {
  currentWeek: number;
  trimester: number;
  daysRemaining: number;
  progressPercent: number;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const HeroFetalProgress: React.FC<HeroFetalProgressProps> = ({
  currentWeek,
  trimester: actualTrimester,
  daysRemaining: actualDaysRemaining,
  progressPercent: actualProgressPercent,
  onNavigate,
  t,
}) => {
  // Presentation Mode: Interactive Gestational Week Demo Selector
  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek || 24);
  const [isPlayingHeartbeat, setIsPlayingHeartbeat] = useState<boolean>(false);

  const isDemoOverride = selectedWeek !== (currentWeek || 24);

  // Derived values based on selectedWeek for interactive demonstration
  const safeWeek = Math.min(40, Math.max(1, selectedWeek));
  const weekDetail = PREGNANCY_WEEKS_DATA[safeWeek - 1] || PREGNANCY_WEEKS_DATA[23];
  const babySize = weekDetail?.babySize || {
    name: "Corn Cob",
    length: "35.6 cm",
    weight: "760 g",
    emoji: "🌽",
    indianComparison: "Bhutta",
  };

  const displayTrimester = safeWeek <= 13 ? 1 : safeWeek <= 27 ? 2 : 3;
  const displayProgressPercent = Math.min(100, Math.round((safeWeek / 40) * 100));
  const displayDaysRemaining = Math.max(0, (40 - safeWeek) * 7);

  // Synthesize realistic 142 BPM Fetal Heartbeat via Web Audio API (Zero dependencies, offline, zero latency)
  const playHeartbeatSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      setIsPlayingHeartbeat(true);

      const playThump = (time: number, freq: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(32, time + 0.11);
        gain.gain.setValueAtTime(gainVal, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.13);
      };

      const now = ctx.currentTime;
      // 4 sets of rhythmic lub-dub pulses (~142 bpm)
      const beats = [0, 0.42, 0.84, 1.26, 1.68];
      beats.forEach((b) => {
        playThump(now + b, 86, 0.45);
        playThump(now + b + 0.13, 70, 0.32);
      });

      setTimeout(() => {
        setIsPlayingHeartbeat(false);
      }, 2200);
    } catch (err) {
      console.warn("Audio Context playback error:", err);
      setIsPlayingHeartbeat(false);
    }
  };

  // Preset demo milestone chips for live pitch
  const demoChips = [
    { week: 12, label: "W12 · First Ultrasound" },
    { week: 20, label: "W20 · TIFFA Anomaly" },
    { week: currentWeek || 24, label: `W${currentWeek || 24} · Today` },
    { week: 32, label: "W32 · Growth Doppler" },
    { week: 37, label: "W37 · Full Term Ready" },
  ];

  return (
    <div className="glass-panel luxury-card-hover rounded-3xl p-6 sm:p-7 space-y-6 relative overflow-hidden transition-all duration-300">
      {/* Top Bar: Title & Presentation Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-pink-100/60 dark:border-rose-900/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-100 dark:bg-rose-950/80 text-pink-600 dark:text-pink-300">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-pink-500 dark:text-rose-300">
              Maternal & Fetal Intelligence HUD
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-extrabold text-gray-900 dark:text-rose-100">
              Week {safeWeek} Gestational Runway
            </h2>
          </div>
        </div>

        {/* Presentation Week Selector Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {demoChips.map((chip) => {
            const isSelected = selectedWeek === chip.week;
            return (
              <button
                key={chip.week}
                onClick={() => setSelectedWeek(chip.week)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? "bg-pink-600 text-white shadow-md scale-105"
                    : "glass-pill text-gray-600 dark:text-rose-200 hover:text-pink-600 dark:hover:text-white"
                }`}
                title={`Preview Week ${chip.week} baby development`}
              >
                {chip.label}
              </button>
            );
          })}

          {isDemoOverride && (
            <button
              onClick={() => setSelectedWeek(currentWeek || 24)}
              className="p-1 rounded-full text-pink-600 dark:text-rose-300 hover:bg-pink-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
              title="Reset to my actual gestational week"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Core: Progress Ring + Fetal Audio Pulse + Artwork */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column (5 Cols): Progress Ring & Days Countdown */}
        <div className="md:col-span-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <ProgressRing
              percentage={displayProgressPercent}
              size={120}
              strokeWidth={10}
              label={t("complete")}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-bold text-gray-400 dark:text-rose-300/70">
                Tri {displayTrimester}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#8f2d48] dark:text-rose-200 tracking-tight">
              {displayDaysRemaining}
              <span className="text-sm font-sans font-medium text-gray-500 dark:text-rose-300 ml-1.5">
                {t("days")}
              </span>
            </div>
            <div className="text-xs font-bold text-[#b84a6b] dark:text-rose-300 flex items-center gap-1.5">
              <span>{t("remaining")}</span>
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
            </div>
            <div className="text-[11px] text-gray-500 dark:text-rose-300/70 font-medium">
              40 Weeks Normal Gestation
            </div>
          </div>
        </div>

        {/* Center-Right Column (7 Cols): Fetal Heartbeat Doppler Synthesizer & Visualizer */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-rose-50/50 to-purple-50/60 dark:from-rose-950/40 dark:via-purple-950/30 dark:to-pink-950/40 border border-pink-100/70 dark:border-rose-900/40">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Fetal Cardiac Doppler
              </span>
            </div>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-2xl font-serif font-bold text-gray-900 dark:text-rose-100">
                142
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-rose-300">BPM</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                Normal & Strong
              </span>
            </div>

            {/* Simulated Live ECG Waveform */}
            <div className="flex items-center justify-center sm:justify-start gap-1 h-6">
              <Activity
                className={`w-28 h-6 text-pink-500 dark:text-pink-400 transition-all ${
                  isPlayingHeartbeat ? "animate-pulse scale-110 text-rose-600" : "opacity-75"
                }`}
              />
            </div>
          </div>

          {/* Interactive Play Audio Heartbeat Button */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <button
              onClick={playHeartbeatSound}
              disabled={isPlayingHeartbeat}
              className={`p-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-md transition-all cursor-pointer ${
                isPlayingHeartbeat
                  ? "bg-rose-500 text-white animate-bounce shadow-rose-500/40"
                  : "bg-white dark:bg-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-700 hover:scale-105"
              }`}
              title="Click to simulate live audio fetal heartbeat"
            >
              {isPlayingHeartbeat ? (
                <>
                  <Volume2 className="w-4 h-4 animate-spin" />
                  <span>Beating...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current text-rose-500" />
                  <span>Listen FHR</span>
                </>
              )}
            </button>
            <span className="text-[9px] font-semibold text-gray-400 dark:text-rose-300/60">
              Web Audio Synthesizer
            </span>
          </div>
        </div>
      </div>

      {/* Week Interactive Slider for live presentations */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-rose-300">
          <span>Gestational Runway Scrubber</span>
          <span className="text-pink-600 dark:text-pink-400 font-bold">
            Week {safeWeek} of 40
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={40}
          value={safeWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="w-full h-2 bg-pink-100 dark:bg-rose-950/80 rounded-lg appearance-none cursor-pointer accent-pink-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          <span>T1 (W1-13)</span>
          <span>T2 (W14-27)</span>
          <span>T3 (W28-40)</span>
        </div>
      </div>

      {/* Lower Banner: Integrated Baby Size HUD -> Baby Development */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="glass-pill rounded-2xl p-4 sm:p-5 border border-white/60 dark:border-white/10 shadow-sm hover:shadow-lg transition-all flex items-center justify-between cursor-pointer group hover:scale-[1.01]"
      >
        <div className="flex items-center gap-3.5">
          {safeWeek === 24 ? (
            <img
              src={cornCobArt}
              alt="Size of Corn Cob"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 p-1 border border-amber-100 dark:border-amber-900/40 shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <span>{babySize.emoji}</span>
            </div>
          )}
          <div>
            <div className="text-[11px] font-extrabold text-gray-400 dark:text-rose-300/60 uppercase tracking-wider flex items-center gap-1">
              <span>{t("babyToday")}</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-bold font-serif text-gray-900 dark:text-rose-100">
              Size of {babySize.name}
              {babySize.indianComparison && (
                <span className="text-xs font-sans font-medium text-rose-500 dark:text-rose-300 ml-1.5">
                  ({babySize.indianComparison})
                </span>
              )}
            </div>
            <div className="text-xs font-semibold text-[#b84a6b] dark:text-rose-300">
              Week {safeWeek} · {babySize.length} | {babySize.weight}
            </div>
            {weekDetail?.milestones?.[0] && (
              <div className="text-[11px] text-gray-500 dark:text-rose-300/80 line-clamp-1 mt-0.5">
                💡 {weekDetail.milestones[0]}
              </div>
            )}
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#fce8ee] dark:bg-rose-950/60 text-[#b84a6b] dark:text-rose-300 flex items-center justify-center group-hover:bg-[#f8d0dc] transition-colors shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

