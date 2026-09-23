import React from "react";
import { JourneyStage, PageView } from "../../types";
import { Flower2, ShoppingBag, FileText, ClipboardList, Dumbbell, Compass, ChevronRight, Sparkles } from "lucide-react";

interface JourneyDiscoveryHubProps {
  journey?: JourneyStage;
  currentWeek: number;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const JourneyDiscoveryHub: React.FC<JourneyDiscoveryHubProps> = ({
  journey = "PREGNANCY",
  currentWeek,
  onNavigate,
  t,
}) => {
  const isThirdTrimester = currentWeek >= 28;

  const modules = [
    {
      id: "garbha-wellness" as PageView,
      title: "Garbha Sanskar Wellness",
      subtitle: "Binaural Ragas & Fetal Bonding",
      icon: Flower2,
      accent: "from-rose-500 to-[#e26989]",
      badge: "Week 24 Recommended",
      cardClass: "pastel-blush-card",
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    },
    {
      id: "hospital-bag" as PageView,
      title: "Hospital Bag Checklist",
      subtitle: "4-Bag Ward Packing System",
      icon: ShoppingBag,
      accent: "from-purple-500 to-pink-500",
      badge: isThirdTrimester ? "3rd Trimester Ready" : "Prepare Early",
      cardClass: "pastel-lavender-card",
      badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
    },
    {
      id: "reports" as PageView,
      title: "Diagnostic Scans & Lab Dossier",
      subtitle: "AI Caliper Extraction & Ranges",
      icon: FileText,
      accent: "from-blue-500 to-cyan-500",
      badge: "AI Calibrated",
      cardClass: "pastel-sky-card",
      badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    },
    {
      id: "birth-plan" as PageView,
      title: "Maternal Birth Plan Builder",
      subtitle: "ACOG Directives & 1-Page Handoff",
      icon: ClipboardList,
      accent: "from-emerald-500 to-teal-500",
      badge: "Printable Ward Brief",
      cardClass: "pastel-mint-card",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    },
    {
      id: "yoga" as PageView,
      title: "Prenatal Yoga & Pelvic Coach",
      subtitle: "Trimester 2 Safe Asanas & Pacing",
      icon: Dumbbell,
      accent: "from-amber-500 to-orange-500",
      badge: "Gentle Flow",
      cardClass: "pastel-buttercup-card",
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    },
    {
      id: "emergency-contacts" as PageView,
      title: "Emergency NICU & Hospital GPS",
      subtitle: "Level IV Facilities & 1-Tap SOS",
      icon: Compass,
      accent: "from-red-500 to-rose-600",
      badge: "24/7 Casualty",
      cardClass: "pastel-peach-card",
      badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 dark:text-rose-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Maternal Care Clinical Suite</span>
        </h3>
        <span className="text-xs font-semibold text-gray-500 dark:text-rose-300/70">
          6 Evidence-Based Pillars
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {modules.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`${item.cardClass} rounded-2xl p-4 flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.accent} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900 dark:text-rose-100 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-gray-600 dark:text-rose-300/70 font-medium">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-white/70 dark:bg-rose-950/60 text-gray-700 dark:text-rose-300 flex items-center justify-center group-hover:bg-rose-200 transition-colors shrink-0 shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
