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
    },
    {
      id: "hospital-bag" as PageView,
      title: "Hospital Bag Checklist",
      subtitle: "4-Bag Ward Packing System",
      icon: ShoppingBag,
      accent: "from-purple-500 to-pink-500",
      badge: isThirdTrimester ? "3rd Trimester Ready" : "Prepare Early",
    },
    {
      id: "reports" as PageView,
      title: "Diagnostic Scans & Lab Dossier",
      subtitle: "AI Caliper Extraction & Ranges",
      icon: FileText,
      accent: "from-blue-500 to-cyan-500",
      badge: "AI Calibrated",
    },
    {
      id: "birth-plan" as PageView,
      title: "Maternal Birth Plan Builder",
      subtitle: "ACOG Directives & 1-Page Handoff",
      icon: ClipboardList,
      accent: "from-emerald-500 to-teal-500",
      badge: "Printable Ward Brief",
    },
    {
      id: "yoga" as PageView,
      title: "Prenatal Yoga & Pelvic Coach",
      subtitle: "Trimester 2 Safe Asanas & Pacing",
      icon: Dumbbell,
      accent: "from-amber-500 to-orange-500",
      badge: "Gentle Flow",
    },
    {
      id: "emergency-contacts" as PageView,
      title: "Emergency NICU & Hospital GPS",
      subtitle: "Level IV Facilities & 1-Tap SOS",
      icon: Compass,
      accent: "from-red-500 to-rose-600",
      badge: "24/7 Casualty",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-sm sm:text-base text-[#681e35] dark:text-rose-100 flex items-center gap-2">
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
              className="pink-cream-card rounded-2xl p-4 border border-[#f3dbe2] dark:border-rose-900/30 flex items-center justify-between group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.accent} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#fce8ee] text-[#8f2d48] dark:bg-rose-950/70 dark:text-rose-300">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#681e35] dark:text-rose-100 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-gray-500 dark:text-rose-300/70">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#fce8ee] dark:bg-rose-950/60 text-[#8f2d48] dark:text-rose-300 flex items-center justify-center group-hover:bg-rose-200 transition-colors shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
