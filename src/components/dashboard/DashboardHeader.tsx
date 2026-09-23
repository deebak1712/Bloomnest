import React from "react";
import { UserProfile, PageView } from "../../types";
import { Sparkles, ChevronDown, PhoneCall, Bot, FileText, Heart } from "lucide-react";

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
    <div className="pink-cream-card rounded-3xl p-5 sm:p-6 shadow-sm border border-[#f3dbe2] dark:border-rose-900/30 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
      {/* Left: Personalized Greeting & Journey Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#b84a6b] dark:text-rose-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            <span>{timeOfDayGreeting}, Mama</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-rose-300" />
          <span className="text-[11px] font-medium text-gray-500 dark:text-rose-300/70">
            Maternal Health Command Center
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#681e35] dark:text-rose-100 tracking-tight">
            {displayName}
          </h1>
          <span className="text-xl sm:text-2xl animate-pulse">✨</span>
        </div>

        {/* Pink & Cream Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            onClick={() => onNavigate("timeline")}
            className="rose-pill inline-flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Week {user.currentWeek || 24} · Trimester {user.trimester || 2}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8f2d48] dark:text-rose-300" />
          </button>

          <span className="cream-badge inline-flex items-center gap-1">
            <span>⏳ {daysLeft} Days to Delivery</span>
          </span>

          {user.extractedMedicalFields && user.extractedMedicalFields.length > 0 && (
            <button
              onClick={() => onNavigate("medical-profile")}
              className="pink-cream-pill text-xs font-semibold px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-2xs"
              title="Verified clinical parameters extracted from your medical report"
            >
              <Sparkles className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>AI Report Calibrated ({user.extractedMedicalFields.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: Executive Quick Action Toolbar & Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end md:self-center">
        {/* Quick Ask AI Pill */}
        <button
          onClick={() => onNavigate("ai-assistant")}
          className="pink-cream-pill px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:shadow-md hover:scale-105 transition-all cursor-pointer"
          title="Ask Dr. Bloom AI Copilot"
        >
          <Bot className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Scan Dossier */}
        <button
          onClick={() => onNavigate("reports")}
          className="pink-cream-pill px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:shadow-md hover:scale-105 transition-all cursor-pointer"
          title="View Medical Reports Dossier"
        >
          <FileText className="w-4 h-4 text-[#8f2d48] dark:text-rose-300" />
          <span className="hidden sm:inline">Dossier</span>
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={() => onNavigate("emergency")}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/20 hover:scale-105 transition-all cursor-pointer"
          title="Emergency Hospital Triage & 108 Speed-Dial"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>SOS Triage</span>
        </button>

        {/* Mother Avatar */}
        <div
          className="relative cursor-pointer group shrink-0 ml-1"
          onClick={() => onNavigate("settings")}
          title="View Settings & Profile"
        >
          <div className="p-0.5 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-200 shadow-md group-hover:scale-105 transition-all">
            <img
              src={user.avatarUrl || sarahAvatar}
              alt={displayName}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white dark:border-[#1a1423]"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-[#120e18] rounded-full shadow-2xs" />
        </div>
      </div>
    </div>
  );
};
