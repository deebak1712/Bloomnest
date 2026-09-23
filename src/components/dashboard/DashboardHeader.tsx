import React from "react";
import { UserProfile, PageView } from "../../types";
import { PageHeading, Caption } from "../ui/Typography";
import { Badge } from "../ui/Badge";
import { Sparkles, ChevronDown, User } from "lucide-react";

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
  const displayName = user.fullName || "Mom";

  const journeyText =
    user.currentJourney === "PRE_PREGNANCY"
      ? "🌱 Preconception Journey"
      : user.currentJourney === "POST_PREGNANCY"
      ? "🌷 Fourth Trimester Journey"
      : "🤰 Gestational Journey";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <Caption className="text-gray-500 dark:text-rose-300/80">
          {timeOfDayGreeting}
        </Caption>

        <PageHeading className="flex items-center gap-2">
          <span>{displayName}</span>
          <span className="text-pink-400 text-xl sm:text-2xl animate-pulse">✨</span>
        </PageHeading>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <Badge variant="rose" size="sm">
            {journeyText}
          </Badge>

          <button
            onClick={() => onNavigate("timeline")}
            className="glass-pill text-[#b84a6b] dark:text-rose-200 text-xs font-semibold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 min-h-[32px]"
          >
            <span>
              {t("weekTrimesterBadge", { week: user.currentWeek, trimester: user.trimester }) !== "weekTrimesterBadge"
                ? t("weekTrimesterBadge", { week: user.currentWeek, trimester: user.trimester })
                : `Week ${user.currentWeek} · Trimester ${user.trimester}`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#b84a6b] dark:text-rose-300" />
          </button>

          {user.extractedMedicalFields && user.extractedMedicalFields.length > 0 && (
            <button
              onClick={() => onNavigate("medical-profile")}
              className="glass-pill text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3.5 py-1 rounded-full border border-emerald-300/60 dark:border-emerald-700/50 inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 min-h-[32px]"
              title="Verified clinical parameters extracted from your medical report"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Report Calibrated ({user.extractedMedicalFields.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* User Avatar -> Settings */}
      <div
        className="relative cursor-pointer group shrink-0"
        onClick={() => onNavigate("settings")}
        title="View Settings Profile"
      >
        <div className="p-0.5 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-400 shadow-md group-hover:shadow-rose-400/30 group-hover:scale-105 transition-all duration-300">
          <img
            src={user.avatarUrl || sarahAvatar}
            alt={user.fullName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white dark:border-[#120e18]"
          />
        </div>
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-[#120e18] rounded-full shadow-2xs" />
      </div>
    </div>
  );
};
