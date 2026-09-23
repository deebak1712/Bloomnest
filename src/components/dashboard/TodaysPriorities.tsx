import React from "react";
import { Medicine, PageView } from "../../types";
import { CheckCircle2, MoreVertical, Droplets } from "lucide-react";

interface TodaysPrioritiesProps {
  medicines: Medicine[];
  onToggleMedicine: (id: number) => void;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const TodaysPriorities: React.FC<TodaysPrioritiesProps> = ({
  medicines,
  onToggleMedicine,
  onNavigate,
  t,
}) => {
  const defaultChecklist = [
    { id: 101, name: "Multivitamin", iconBg: "bg-purple-100 text-purple-600", pillColors: "from-amber-400 to-purple-500", isComplete: true },
    { id: 102, name: "Iron", iconBg: "bg-rose-100 text-rose-600", pillColors: "from-rose-500 to-rose-200", isComplete: false },
    { id: 103, name: "Folic Acid", iconBg: "bg-teal-100 text-teal-600", pillColors: "from-teal-400 to-orange-400", isComplete: false },
  ];

  return (
    <div className="pastel-buttercup-card rounded-3xl p-5 sm:p-6 space-y-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/70 dark:border-amber-900/30 pb-3">
        <h3 className="font-serif font-bold text-base text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
          <span>Daily Checklist</span>
          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
            Meds & Spacing
          </span>
        </h3>
        <button
          onClick={() => onNavigate("medicines")}
          className="text-amber-700/60 hover:text-amber-900 p-1 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-gray-500 dark:text-rose-300 uppercase tracking-wider">
          Prenatal Vitamins
        </div>

        {/* 3 Pill Items (Concept 1) */}
        {defaultChecklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate("medicines")}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {/* Colorful Pill Graphic */}
              <div className={`w-8 h-4 rounded-full bg-gradient-to-r ${item.pillColors} shadow-xs border border-white/60`} />
              <span className="font-bold text-xs text-gray-800 dark:text-rose-100">
                {item.name}
              </span>
            </div>

            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
              item.isComplete
                ? "bg-rose-500 border-rose-500 text-white"
                : "border-gray-300 dark:border-rose-800"
            }`}>
              {item.isComplete && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>
        ))}

        {/* Hydration Task */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="flex items-center justify-between p-2 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer pt-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shadow-xs border border-white/60 flex items-center justify-center">
              <Droplets className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-bold text-xs text-gray-800 dark:text-rose-100">
              Hydration (2.2L target)
            </span>
          </div>

          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-500 text-white flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
