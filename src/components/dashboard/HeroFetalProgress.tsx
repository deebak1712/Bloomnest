import React, { useState } from "react";
import { PageView } from "../../types";
import { ChevronRight, Sparkles, Heart, Activity, Baby } from "lucide-react";

// Asset Images & Fallbacks
import cornCobArt from "../../assets/images/corn_cob_art_1785746048803.jpg";
import fetalDevBanner from "../../assets/images/fetal_dev_banner_1785562889402.jpg";
import { PREGNANCY_WEEKS_DATA } from "../../data/pregnancyWeeksData";

// Helper to resolve the authentic 3D cinematic fetus image for the exact gestational week
const getFetusImageSrc = (week: number): string => {
  const safeWeek = Math.max(1, Math.min(40, Math.round(week || 1)));
  return `/assets/cinematic/fetus_week_${safeWeek}.jpg`;
};

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
    length: "35.6 cm",
    weight: "760 g",
    emoji: "🌽",
    indianComparison: "Bhutta",
  };

  const [imageError, setImageError] = useState(false);
  const fetusImageSrc = imageError ? fetalDevBanner : getFetusImageSrc(safeWeek);

  return (
    <div className="space-y-4">
      {/* 1. Large 3D Fetal Progress Ring Card (Pastel Blush Theme with Current Week Fetus) */}
      <div className="pastel-blush-card rounded-3xl p-6 relative overflow-hidden text-center group transition-all duration-300">
        {/* Soft background radial aura */}
        <div className="absolute inset-0 bg-radial from-rose-200/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative w-52 h-52 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
          {/* Animated SVG Progress Ring in Vivid Rose, Peach & Coral */}
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
            <circle
              cx="50%"
              cy="50%"
              r="43%"
              stroke="currentColor"
              strokeWidth="11"
              fill="transparent"
              className="text-[#fce4ec] dark:text-rose-950/60"
            />
            <circle
              cx="50%"
              cy="50%"
              r="43%"
              stroke="url(#pastelHeroPinkGradient)"
              strokeWidth="11"
              strokeDasharray={620}
              strokeDashoffset={620 - (620 * (progressPercent || 60)) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="pastelHeroPinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing Womb Center with Current Week's Authentic 3D Fetus Image */}
          <div
            onClick={() => onNavigate("baby-development")}
            className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-[#fbcfe8]/70 via-[#fce7f3]/90 to-[#fed7aa]/60 p-1.5 shadow-md flex items-center justify-center overflow-hidden border-2 border-white/90 cursor-pointer group-hover:scale-105 transition-transform"
            title={`Week ${safeWeek} Fetus in Womb — Tap to launch 3D Fetal Studio`}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black/20">
              <img
                src={fetusImageSrc}
                alt={`Week ${safeWeek} Fetal Development in Womb`}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-full drop-shadow-md animate-[pulse_6s_ease-in-out_infinite]"
              />
              {/* Soft amniotic fluid caustic shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/20 via-transparent to-white/20 pointer-events-none" />
            </div>
          </div>

          {/* 60% Progress Badge Tag with Rose Gold Glow */}
          <div className="absolute bottom-2 right-4 px-2.5 py-1 rounded-full bg-white dark:bg-[#201828] border border-rose-200 dark:border-rose-800 shadow-xs text-xs font-serif font-extrabold text-[#be185d] dark:text-rose-300">
            {progressPercent || 60}%
          </div>
        </div>

        {/* Stage & Viability Headline */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-[#9d174d] dark:text-rose-300">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>Week {safeWeek} · Viability Milestone</span>
        </div>
        <div className="text-[11px] text-gray-500 dark:text-rose-300/70 font-medium mt-0.5">
          Surfactant active · Auditory nerve responding to voice
        </div>
      </div>

      {/* 2. "This Week: Baby Size" Card (Pastel Buttercup / Apricot Theme) */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="pastel-buttercup-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer group space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-[#b45309] dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>This Week: Baby Size</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-[9px] font-bold">
                Week {safeWeek}
              </span>
            </div>
            <div className="text-sm font-serif font-bold text-gray-900 dark:text-amber-100">
              {babySize.name} ({babySize.indianComparison || "Bhutta"})
            </div>
            <div className="text-xs text-amber-800/80 dark:text-amber-200/70 font-medium">
              ~{babySize.length} length · ~{babySize.weight} weight
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pl-2">
            {/* Real Fetus Thumbnail from Fetal Studio */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xs bg-black/10">
              <img
                src={fetusImageSrc}
                alt="Fetal development thumbnail"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            {/* Corn Cob Comparison */}
            <img
              src={cornCobArt}
              alt="Corn Cob Size"
              className="w-12 h-12 object-contain bg-amber-50 rounded-2xl p-1 border border-amber-200"
            />
          </div>
        </div>
      </div>

      {/* 3. "Weekly Milestone & 3D Fetal Studio" Card (Pastel Lavender Theme) */}
      <div
        onClick={() => onNavigate("baby-development")}
        className="pastel-lavender-card rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer group space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-extrabold text-[#6b21a8] dark:text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <Baby className="w-3.5 h-3.5" />
            <span>3D Fetal Studio · Clinical Milestone</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            ACOG Standard
          </span>
        </div>

        <div className="text-sm font-bold text-gray-900 dark:text-purple-100 leading-snug">
          Auditory System & Rapid Brain Connectivity
        </div>
        <p className="text-xs text-purple-900/75 dark:text-purple-200/70 leading-relaxed">
          Hearing pathways are hardened. Your baby responds to your voice, heartbeat, and soothing music with gentle kicks.
        </p>

        <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#7e22ce] dark:text-purple-300 group-hover:translate-x-0.5 transition-transform">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch 3D Fetal Studio (Week {safeWeek})</span>
          </span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

