import React from "react";
import { Medicine, PageView } from "../../types";
import { Pill, CheckCircle2, Sparkles, Clock, AlertCircle } from "lucide-react";

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
  const takenCount = medicines.filter((m) => m.isTakenToday).length;
  const totalCount = medicines.length;
  const progress = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="pink-cream-card rounded-3xl p-5 sm:p-6 space-y-4 border border-[#f3dbe2] dark:border-rose-900/30 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f3dbe2]/70 dark:border-rose-900/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#fce8ee] dark:bg-rose-950/70 text-[#8f2d48] dark:text-rose-300 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#681e35] dark:text-rose-100">
              Daily Prescriptions
            </h3>
            <div className="text-[10px] text-gray-500 dark:text-rose-300/70 font-medium">
              {takenCount} of {totalCount} Taken Today ({progress}%)
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("medicines")}
          className="text-xs font-bold text-[#b84a6b] dark:text-rose-300 hover:underline cursor-pointer"
        >
          {t("manage")} →
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#fce8ee] dark:bg-rose-950/40 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-rose-500 to-[#e26989] h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Medicine List */}
      <div className="space-y-2">
        {medicines.map((med) => {
          const isTaken = med.isTakenToday;
          return (
            <div
              key={med.id}
              onClick={() => onToggleMedicine(med.id)}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                isTaken
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40 opacity-90"
                  : "pink-cream-pill hover:border-rose-300 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isTaken
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : "bg-[#fce8ee] text-[#8f2d48] dark:bg-rose-950/70 dark:text-rose-300"
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div
                    className={`font-bold text-xs ${
                      isTaken
                        ? "line-through text-emerald-800 dark:text-emerald-300"
                        : "text-[#681e35] dark:text-rose-100"
                    }`}
                  >
                    {med.name}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-rose-300/70 flex items-center gap-1.5">
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {med.time || med.frequency || "Scheduled"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  isTaken
                    ? "bg-emerald-500 text-white shadow-2xs"
                    : "border-2 border-gray-300 dark:border-rose-800 hover:border-rose-500"
                }`}
              >
                {isTaken && <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Guidance Callout */}
      <div className="p-2.5 rounded-xl bg-[#faf3eb] dark:bg-[#201815] border border-[#eddcc9] dark:border-amber-900/30 text-[10px] text-[#8c5e32] dark:text-amber-300/90 leading-tight flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Separate Iron and Calcium supplements by 2+ hours for optimal absorption.</span>
      </div>
    </div>
  );
};
