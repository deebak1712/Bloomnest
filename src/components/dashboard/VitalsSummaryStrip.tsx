import React, { useState } from "react";
import { HealthVital, PageView } from "../../types";
import { Droplets, Heart, Activity, Plus, Moon, Volume2, Play, Pause, SkipForward, SkipBack, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface VitalsSummaryStripProps {
  todayVital?: Partial<HealthVital>;
  selectedMood: string;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const VitalsSummaryStrip: React.FC<VitalsSummaryStripProps> = ({
  todayVital,
  selectedMood,
  onNavigate,
  t,
}) => {
  const { addVital, logKickSession, showToast } = useApp();
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const currentWater = todayVital?.waterMl || 1400;
  const targetWater = 2200;
  const kicks = todayVital?.babyKicksCount !== undefined ? todayVital.babyKicksCount : 47;
  const systolic = todayVital?.systolicBp || 118;
  const diastolic = todayVital?.diastolicBp || 74;

  const handleQuickAddWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWater = currentWater + 250;
    addVital({
      date: new Date().toISOString().split("T")[0],
      waterMl: newWater,
      weightKg: todayVital?.weightKg || 64.2,
      systolicBp: systolic,
      diastolicBp: diastolic,
      babyKicksCount: kicks,
    });
    if (showToast) showToast("💧 +250ml Water Added!");
  };

  const handleQuickAddKick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newKicks = kicks + 1;
    logKickSession({
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: 1,
      kickCount: 1,
      targetReached: newKicks >= 10,
      notes: "Quick tap",
    });
    addVital({
      date: new Date().toISOString().split("T")[0],
      waterMl: currentWater,
      weightKg: todayVital?.weightKg || 64.2,
      systolicBp: systolic,
      diastolicBp: diastolic,
      babyKicksCount: newKicks,
    });
    if (showToast) showToast(`👣 +1 Kick Logged (Total: ${newKicks})`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Weekly Milestone Highlights Card (Pastel Lavender Theme) */}
      <div className="pastel-lavender-card rounded-3xl p-6 space-y-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-purple-900/30 pb-2.5">
          <h3 className="font-serif font-bold text-base sm:text-lg text-purple-950 dark:text-purple-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 fill-current" />
            <span>Weekly Milestone Highlights</span>
          </h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            Week 24
          </span>
        </div>

        <div className="space-y-2 text-xs text-purple-900/80 dark:text-purple-200 leading-relaxed">
          <div className="font-bold text-purple-950 dark:text-purple-100">
            Physical and Developmental Progress:
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-purple-900/70 dark:text-purple-300/80">
            <li>Inner ear auditory pathways are hardened; baby responds to maternal voice and gentle ragas.</li>
            <li>Alveolar lung branches forming and surfactant synthesis initiates.</li>
            <li>Rapid neurological development and active REM sleep patterns.</li>
          </ul>
        </div>
      </div>

      {/* 2. Concept 1 Vitals 2-Column Grid (Pastel Palette: Blush, Sky, Mint, Lavender) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Blood Pressure Card (Pastel Blush / Rose Cream) */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="pastel-blush-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">My Health Vitals</span>
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-rose-600/70 dark:text-rose-400 uppercase tracking-wider">Blood Pressure</div>
            <div className="text-2xl font-serif font-extrabold text-gray-900 dark:text-rose-100">
              {systolic}/{diastolic} <span className="text-xs font-sans font-normal text-rose-400">mmHg</span>
            </div>
          </div>

          {/* Smooth Pink Wave Graph SVG */}
          <div className="h-14 w-full">
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
              <path
                d="M0,35 Q25,10 50,35 T100,35 T150,15 T200,35"
                fill="none"
                stroke="#ff4081"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M0,35 Q25,10 50,35 T100,35 T150,15 T200,35 L200,60 L0,60 Z"
                fill="url(#bpPinkFill)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="bpPinkFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff4081" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Hydration Tracker Card (Pastel Sky / Azure) */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="pastel-sky-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3 relative group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300">Hydration Tracker</span>
            <Droplets className="w-4 h-4 text-sky-500 fill-current animate-bounce" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-serif font-extrabold text-gray-900 dark:text-sky-100">
                {currentWater} <span className="text-xs font-sans font-normal text-sky-500">/ {targetWater}ml</span>
              </div>
              <div className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 mt-0.5">
                {Math.round((currentWater / targetWater) * 100)}% Hydrated Today
              </div>
            </div>

            {/* Quick +250ml Button */}
            <button
              onClick={handleQuickAddWater}
              className="px-2.5 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-950 dark:text-sky-300 text-xs font-bold flex items-center gap-1 transition-colors border border-sky-300/60"
              title="Quick Add 250ml"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>250ml</span>
            </button>
          </div>

          {/* Baby Footstep / Glass Stage Badges */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 py-1 rounded-lg text-center font-bold text-[10px] text-white shadow-2xs ${
                  step === 1 ? "bg-pink-500" : step === 2 ? "bg-orange-400" : step === 3 ? "bg-purple-500" : "bg-emerald-400"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Baby Kicks Card (Pastel Mint / Fresh Sage) */}
        <div
          onClick={() => onNavigate("kick-counter")}
          className="pastel-mint-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Baby Kicks</span>
            <button
              onClick={handleQuickAddKick}
              className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-0.5 border border-emerald-300"
            >
              <Plus className="w-3 h-3" />
              <span>+1</span>
            </button>
          </div>

          <div>
            <div className="text-2xl font-serif font-extrabold text-gray-900 dark:text-emerald-100">
              {kicks} <span className="text-xs font-sans font-normal text-emerald-500">today</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white font-extrabold text-xs">1</span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-400 text-white font-extrabold text-xs">2</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-white font-extrabold text-xs">3</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white font-extrabold text-xs">4</span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 ml-auto">Cardiff-10 Reassuring ✓</span>
          </div>
        </div>

        {/* Sleep Quality Card (Pastel Lavender / Twilight Purple) */}
        <div
          onClick={() => onNavigate("mood-tracker")}
          className="pastel-lavender-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300">
              <Moon className="w-4 h-4 fill-current text-purple-500" />
              <span>Sleep Quality</span>
            </div>
            <span className="text-[10px] font-bold text-purple-600/70 dark:text-purple-400">Last Night</span>
          </div>

          <div className="text-2xl font-serif font-extrabold text-gray-900 dark:text-purple-100">
            7.2 <span className="text-xs font-sans font-normal text-purple-400">hrs</span>
          </div>

          {/* Purple Sleep Wave Curve */}
          <div className="h-10 w-full">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M0,25 Q30,5 60,25 T120,25 T180,10 T200,25"
                fill="none"
                stroke="#7e57c2"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Garbha Sanskar Audio Player Card (Concept 1 Dark/Plum Glowing Soundwave) */}
      <div className="bg-[#1c1427] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-pink-400" />
            <h4 className="font-serif font-bold text-sm text-pink-100">Garbha Sanskar</h4>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
            Week 24 Auditory Raga
          </span>
        </div>

        {/* Animated Soundwave Equalizer */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-12 py-2">
          {[20, 45, 80, 50, 95, 30, 70, 100, 65, 40, 85, 35, 90, 60, 45, 25].map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 sm:w-2 rounded-full transition-all duration-300 ${
                isPlayingMusic
                  ? "bg-gradient-to-t from-pink-500 via-rose-400 to-amber-300 animate-pulse"
                  : "bg-pink-500/40"
              }`}
              style={{
                height: `${isPlayingMusic ? height : Math.max(15, height * 0.4)}%`,
                animationDelay: `${idx * 0.08}s`,
              }}
            />
          ))}
        </div>

        {/* Audio Meta & Controls */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Bonding Melody · Raga Kalyani</span>
            </div>
            <div className="text-[10px] text-pink-200/70">
              Calm Affirmations & Fetal Relaxation
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("garbha-wellness")}
              className="p-2 rounded-full hover:bg-white/10 text-pink-300"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-105 transition-transform cursor-pointer"
              title={isPlayingMusic ? "Pause" : "Play"}
            >
              {isPlayingMusic ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => onNavigate("garbha-wellness")}
              className="p-2 rounded-full hover:bg-white/10 text-pink-300"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
