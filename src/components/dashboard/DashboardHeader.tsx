import React from "react";
import { UserProfile, PageView } from "../../types";
import { Search, Bell, Sparkles, Calendar, Baby, Heart } from "lucide-react";

// Asset Image
import sarahAvatar from "../../assets/images/sarah_pastel_avatar_1785746217665.jpg";

interface DashboardHeaderProps {
  user: UserProfile;
  timeOfDayGreeting: string;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  timeOfDayGreeting,
  onNavigate,
  t,
}) => {
  const displayName = user.fullName || "Sarah";
  const daysLeft = user.daysRemaining || 112;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-2">
      {/* Left: Greeting & Colorful Badges */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1724] dark:text-rose-100 tracking-tight flex items-center gap-2">
          <span>Hi {displayName}! Welcome to Week {user.currentWeek || 24}</span>
          <span className="text-xl animate-pulse">✨</span>
        </h1>

        {/* Concept 1 Vibrant Stage Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Week 24 of 40 Pill (Vibrant Rose) */}
          <button
            onClick={() => onNavigate("timeline")}
            className="px-3.5 py-1.5 rounded-full bg-[#fce4ec] dark:bg-rose-950/80 text-[#d81b60] dark:text-rose-300 border border-[#f8bbd0] dark:border-rose-800/50 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Week {user.currentWeek || 24} of 40</span>
          </button>

          {/* Trimester 2 Pill (Peach Coral) */}
          <span className="px-3.5 py-1.5 rounded-full bg-[#ffe0b2] dark:bg-amber-950/80 text-[#e65100] dark:text-amber-300 border border-[#ffcc80] dark:border-amber-800/50 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Baby className="w-3.5 h-3.5" />
            <span>Trimester {user.trimester || 2}</span>
          </span>

          {/* 112 Days to Due Date Pill (Soft Lavender/Purple) */}
          <span className="px-3.5 py-1.5 rounded-full bg-[#ede7f6] dark:bg-purple-950/80 text-[#512da8] dark:text-purple-300 border border-[#d1c4e9] dark:border-purple-800/50 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{daysLeft} Days to Due Date</span>
          </span>
        </div>
      </div>

      {/* Right: Search, Notifications & Avatar */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        {/* Search Input Box */}
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, scans..."
            className="pl-9 pr-4 py-2 rounded-full bg-white dark:bg-[#1a1423] border border-[#f1d7df] dark:border-rose-900/40 text-xs text-gray-700 dark:text-rose-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 w-52 shadow-2xs"
          />
        </div>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => onNavigate("settings")}
          className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1423] border border-[#f1d7df] dark:border-rose-900/40 flex items-center justify-center text-gray-600 dark:text-rose-300 relative shadow-2xs hover:scale-105 transition-transform cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-2 right-2 border-2 border-white dark:border-[#1a1423]" />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => onNavigate("settings")}
          className="cursor-pointer hover:scale-105 transition-transform"
          title="Profile & Settings"
        >
          <img
            src={user.avatarUrl || sarahAvatar}
            alt={displayName}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white dark:border-[#1a1423] shadow-xs"
          />
        </div>
      </div>
    </div>
  );
};
