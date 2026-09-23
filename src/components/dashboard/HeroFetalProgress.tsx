import React from "react";
import { PageView } from "../../types";
import { ChevronRight, Sparkles, Heart } from "lucide-react";

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
    name: "Corn Cob & Papaya",
    length: "30.0 cm",
    weight: "600 g",
    emoji: "🌽",
    indianComparison: "Bhutta",
  };

  return (
    <div className="space-y-4">
      {/* 1. Large 3D Fetal Progress Ring Card (Concept 1 Centerpiece) */}
      <div className="bg-white dark:bg-[#1a1423] rounded-3xl p-6 border border-[#f5dce3] dark:border-rose-900/40 shadow-sm flex flex-col items-center justify-center relative overflow-hidden text-center group">
        {/* Soft background radial aura */}
        <div className="absolute inset-0 bg-radial from-rose-100/40 via-transparent to-transparent pointer-events-none" />

        <div className="relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Animated SVG Progress Ring in Vivid Rose & Coral */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="43%"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-[#fce4ec] dark:text-rose-950/60"
            />
            <circle
              cx="50%"
              cy="50%"
              r="43%"
              stroke="url(#concept1PinkGradient)"
              strokeWidth="12"
              strokeDasharray={620}
              strokeDashoffset={620 - (620 * (progressPercent || 60)) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="concept1PinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff3366" />
                <stop offset="60%" stopColor="#ff6584" />
                <stop offset="100%" stopColor="#ffa0b4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing Womb Center with Fetal Illustration */}
          <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#f8bbd0]/60 via-[#fce4ec]/80 to-[#ffe0b2]/60 p-2 shadow-inner flex items-center justify-center overflow-hidden border border-white/80">
            <img
              src={pastelMotherArt}
              alt="Fetal Growth Womb Illustration"
              className="w-full h-full object-cover rounded-full drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </div>

          {/* 60% Progress Badge Tag */}
          <div className="absolute bottom-2 right-4 px-2.5 py-1 rounded-full bg-white dark:bg-[#201828] border border-[#f5cad6] shadow-sm text-xs font-serif font-extrabold text-[#d81b60] dark:text-rose-300">
            {progressPercent || 60}%
          </div>
        </div>

        <div className="mt-3 text-xs font-bold text-gray-500 dark:text-rose-300/80">
          Development Stage · Week {safeWeek} of 40
        </div>
      </div>

      {/* 2. "This Week: Baby Size" Card (Concept 1) */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="bg-white dark:bg-[#1a1423] rounded-3xl p-5 border border-[#f5dce3] dark:border-rose-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-extrabold text-[#d81b60] dark:text-rose-300 uppercase tracking-wider">
              This Week: Baby Size
            </div>
            <div className="text-sm font-serif font-bold text-gray-900 dark:text-rose-100">
              Compare your baby to with Corn Cob & Papaya
            </div>
            <div className="text-xs text-gray-500 dark:text-rose-300/70 font-medium">
              ~30.0 cm length · ~600 g weight
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <img
              src={cornCobArt}
              alt="Corn Cob Size"
              className="w-12 h-12 object-contain bg-amber-50 rounded-2xl p-1 border border-amber-200"
            />
            <span className="text-2xl">🥭</span>
          </div>
        </div>
      </div>

      {/* 3. "Weekly Milestone" Card (Concept 1) */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="bg-white dark:bg-[#1a1423] rounded-3xl p-5 border border-[#f5dce3] dark:border-rose-900/40 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
      >
        <div className="text-[11px] font-extrabold text-gray-400 dark:text-rose-300/60 uppercase tracking-wider">
          Weekly Milestone
        </div>
        <div className="text-sm font-bold text-gray-900 dark:text-rose-100 leading-snug">
          Physical & developmental changes
        </div>
        <p className="text-xs text-gray-500 dark:text-rose-300/70 leading-relaxed">
          Hearing pathways are hardened. Your baby can hear your voice and ambient music.
        </p>
        <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#d81b60] dark:text-rose-300 group-hover:underline">
          <span>Week {safeWeek} Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
