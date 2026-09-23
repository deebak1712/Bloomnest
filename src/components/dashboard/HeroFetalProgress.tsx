import React from "react";
import { PageView } from "../../types";
import { Heart, ChevronRight, Sparkles, CheckCircle2, Baby, Activity, Info } from "lucide-react";

// Asset Images
import pastelMotherArt from "../../assets/images/pastel_mother_art_1785746033662.jpg";
import cornCobArt from "../../assets/images/corn_cob_art_1785746048803.jpg";
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
  trimester,
  daysRemaining,
  progressPercent,
  onNavigate,
  t,
}) => {
  const safeWeek = Math.min(40, Math.max(1, currentWeek || 24));
  const weekDetail = PREGNANCY_WEEKS_DATA[safeWeek - 1];
  const babySize = weekDetail?.babySize || {
    name: "Ear of Corn",
    length: "30.0 cm",
    weight: "600 g",
    emoji: "🌽",
    indianComparison: "Bhutta",
  };

  const daysPassed = (safeWeek * 7) - 3; // Approx Day 165 for W24

  return (
    <div className="pink-cream-card rounded-3xl p-5 sm:p-7 space-y-6 border border-[#f3dbe2] dark:border-rose-900/30 relative overflow-hidden transition-all shadow-sm">
      {/* 1. Upper Command HUD: Progress Ring + Trimester Roadmap + Art */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Circular Progress & Numbers */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Ring in Pink & Cream */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-[#fce8ee] dark:text-rose-950/60"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="url(#roseGoldGradient)"
                strokeWidth="8"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="roseGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e26989" />
                  <stop offset="50%" stopColor="#d97793" />
                  <stop offset="100%" stopColor="#f3c5c1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-serif font-extrabold text-[#75203b] dark:text-rose-100 leading-none">
                {progressPercent}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b84a6b] dark:text-rose-300 mt-0.5">
                Completed
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gray-500 dark:text-rose-300/80 uppercase tracking-wider flex items-center gap-1">
              <span>Gestational Journey</span>
              <Heart className="w-3 h-3 text-rose-500 fill-current inline" />
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#681e35] dark:text-rose-100">
              Week {safeWeek} <span className="text-sm font-sans font-medium text-gray-500 dark:text-rose-300/70">of 40</span>
            </div>
            <div className="text-xs font-semibold text-[#8f2d48] dark:text-rose-200 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-[#fce8ee] dark:bg-rose-950/70 font-bold text-[11px]">
                Day {daysPassed}
              </span>
              <span>· {daysRemaining} days to EDD</span>
            </div>
          </div>
        </div>

        {/* Center: Trimester Stepper Roadmap */}
        <div className="w-full lg:max-w-xs space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-rose-300/60 flex items-center justify-between">
            <span>Trimester Roadmap</span>
            <span className="text-rose-600 dark:text-rose-300 font-extrabold">Trimester 2 (Viability)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Tri 1 */}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 fill-emerald-500 text-white" />
                <span>Tri 1</span>
              </div>
              <div className="text-[9px] text-emerald-600/80 dark:text-emerald-400 font-medium">Weeks 1-12</div>
            </div>

            {/* Tri 2 (Active) */}
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#fde8ef] to-[#fbf0f4] dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-600 text-center shadow-xs scale-102">
              <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-[#75203b] dark:text-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Tri 2</span>
              </div>
              <div className="text-[9px] text-[#8f2d48] dark:text-rose-300 font-bold">W 13-27 · Active</div>
            </div>

            {/* Tri 3 */}
            <div className="p-2 rounded-xl bg-[#faf3eb] dark:bg-[#201815] border border-[#eddcc9] dark:border-amber-900/30 text-center opacity-85">
              <div className="text-[10px] font-bold text-[#8c5e32] dark:text-amber-300">Tri 3</div>
              <div className="text-[9px] text-[#8c5e32]/70 dark:text-amber-400/60 font-medium">Weeks 28-40</div>
            </div>
          </div>
        </div>

        {/* Right: Soft Pastel Mother Artwork */}
        <div className="relative shrink-0 hidden sm:flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-gradient-to-tr from-[#fce8ee] via-white to-[#faf3eb] shadow-sm">
            <img
              src={pastelMotherArt}
              alt="Pregnant Mother Watercolor Art"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* 2. Baby Size & Clinical Development HUD */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="pink-cream-pill rounded-2xl p-4 sm:p-5 border border-[#f2dbe2] dark:border-rose-900/40 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group hover:scale-[1.01]"
      >
        <div className="flex items-center gap-4">
          {safeWeek === 24 ? (
            <img
              src={cornCobArt}
              alt="Size of Corn Cob"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-1 border border-amber-200/70 dark:border-amber-800/40 shrink-0 group-hover:scale-105 transition-transform shadow-2xs"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fce8ee] dark:bg-rose-950/60 border border-[#f5cad6] dark:border-rose-800/50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <span>{babySize.emoji}</span>
            </div>
          )}

          <div className="space-y-0.5">
            <div className="text-[11px] font-extrabold text-[#b84a6b] dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Baby's Size Today</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div className="text-base sm:text-lg font-bold font-serif text-[#681e35] dark:text-rose-100 flex items-center gap-2">
              <span>Size of an {babySize.name}</span>
              {babySize.indianComparison && (
                <span className="text-xs font-sans font-semibold text-rose-600 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
                  {babySize.indianComparison}
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-gray-600 dark:text-rose-300/90 flex items-center gap-2">
              <span>Length: {babySize.length}</span>
              <span>•</span>
              <span>Weight: {babySize.weight}</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">FHR ~140 bpm</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-300 group-hover:underline">
            Explore 3D Organs
          </span>
          <div className="w-8 h-8 rounded-full bg-[#fce8ee] dark:bg-rose-950/60 text-[#8f2d48] dark:text-rose-300 flex items-center justify-center group-hover:bg-[#f8d0dc] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. This Week's Clinical Milestone Note */}
      <div className="p-3.5 rounded-2xl bg-[#faf3eb]/80 dark:bg-[#1f1816]/70 border border-[#eddcc9] dark:border-amber-900/30 flex items-start gap-3 text-xs text-[#5c3e21] dark:text-amber-200">
        <Info className="w-4 h-4 text-[#b87333] dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Week {safeWeek} Clinical Milestone:</strong> Baby's inner ear bones are hardened and auditory pathways are functional. Your baby can now hear your heartbeat, voice, and gentle Garbha Sanskar melodies. Lung surfactant production is also beginning.
        </div>
      </div>
    </div>
  );
};
