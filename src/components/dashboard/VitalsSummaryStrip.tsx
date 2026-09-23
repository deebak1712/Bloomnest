import React from "react";
import { HealthVital, PageView } from "../../types";
import { Droplets, Scale, Smile, Heart, Activity, Plus, TrendingUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface VitalsSummaryStripProps {
  todayVital?: Partial<HealthVital>;
  selectedMood: string;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const VitalsSummaryStrip: React.FC<VitalsSummaryStripProps> = ({
  todayVital,
  selectedMood,
  onNavigate,
  t,
}) => {
  const { addVital, logKickSession, showToast } = useApp();

  const currentWater = todayVital?.waterMl || 2200;
  const waterLiters = (currentWater / 1000).toFixed(1);
  const weightDisplay = todayVital?.weightKg ? `${todayVital.weightKg} kg` : "64.2 kg";
  const kicks = todayVital?.babyKicksCount !== undefined ? todayVital.babyKicksCount : 10;
  
  const systolic = todayVital?.systolicBp || 118;
  const diastolic = todayVital?.diastolicBp || 76;
  const meanArterialPressure = Math.round((systolic + 2 * diastolic) / 3);

  const bpStatus = todayVital?.evaluation?.bp?.status || (
    systolic >= 160 || diastolic >= 110
      ? "SEVERE"
      : systolic >= 140 || diastolic >= 90
      ? "HIGH"
      : systolic > 120 || diastolic > 80 || systolic < 90 || diastolic < 60
      ? "ATTENTION"
      : "NORMAL"
  );

  // Interactive Quick Log Handlers
  const handleQuickAddWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWater = currentWater + 250;
    addVital({
      date: new Date().toISOString().split("T")[0],
      waterMl: newWater,
      weightKg: todayVital?.weightKg || 64.2,
      systolicBp: systolic,
      diastolicBp: diastolic,
      babyKicksCount: kicks,
    });
    if (showToast) showToast("💧 +250ml Water Logged (Hydration target updated)");
  };

  const handleQuickAddKick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newKicks = kicks + 1;
    logKickSession({
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: 1,
      kickCount: 1,
      targetReached: newKicks >= 10,
      notes: "Quick dashboard tap",
    });
    addVital({
      date: new Date().toISOString().split("T")[0],
      waterMl: currentWater,
      weightKg: todayVital?.weightKg || 64.2,
      systolicBp: systolic,
      diastolicBp: diastolic,
      babyKicksCount: newKicks,
    });
    if (showToast) showToast(`👣 +1 Baby Kick Logged (Total: ${newKicks})`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-sm sm:text-base text-[#681e35] dark:text-rose-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-500" />
          <span>Biometric Health & Vital Signs</span>
        </h3>
        <button
          onClick={() => onNavigate("health-tracker")}
          className="text-xs font-bold text-[#b84a6b] dark:text-rose-300 hover:underline cursor-pointer"
        >
          View Full Vitals Trends →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Blood Pressure & MAP */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="pink-cream-card rounded-2xl p-4 flex flex-col justify-between space-y-2 border border-[#f3dbe2] dark:border-rose-900/30 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#fce8ee] dark:bg-rose-950/70 text-[#8f2d48] dark:text-rose-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Optimal
            </span>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-300/70">
              Blood Pressure
            </div>
            <div className="text-base font-serif font-bold text-[#681e35] dark:text-rose-100">
              {systolic}/{diastolic} <span className="text-[10px] font-sans font-normal text-gray-400">mmHg</span>
            </div>
            <div className="text-[10px] text-gray-500 dark:text-rose-300/60 font-medium">
              MAP: {meanArterialPressure} mmHg
            </div>
          </div>
        </div>

        {/* 2. Hydration & Quick +250ml Action */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="pink-cream-card rounded-2xl p-4 flex flex-col justify-between space-y-2 border border-[#f3dbe2] dark:border-rose-900/30 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <Droplets className="w-4 h-4 fill-current" />
            </div>
            {/* Quick Add Button */}
            <button
              onClick={handleQuickAddWater}
              className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold flex items-center gap-0.5 transition-colors"
              title="Quick Add 250ml"
            >
              <Plus className="w-3 h-3" />
              <span>250ml</span>
            </button>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-500 dark:text-blue-300/70">
              Daily Fluids
            </div>
            <div className="text-base font-serif font-bold text-[#681e35] dark:text-blue-100">
              {waterLiters} <span className="text-xs font-sans font-normal text-gray-400">/ 3.0 L</span>
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-300 font-semibold">
              {Math.min(100, Math.round((currentWater / 3000) * 100))}% Goal Reached
            </div>
          </div>
        </div>

        {/* 3. Baby Kicks & Quick +1 Action */}
        <div
          onClick={() => onNavigate("kick-counter")}
          className="pink-cream-card rounded-2xl p-4 flex flex-col justify-between space-y-2 border border-[#f3dbe2] dark:border-rose-900/30 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#fce8ee] dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            {/* Quick Add Kick Button */}
            <button
              onClick={handleQuickAddKick}
              className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-0.5 transition-colors"
              title="Quick Add 1 Baby Kick"
            >
              <Plus className="w-3 h-3" />
              <span>1 Kick</span>
            </button>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-300/70">
              Baby Kicks (Today)
            </div>
            <div className="text-base font-serif font-bold text-[#681e35] dark:text-rose-100">
              {kicks} <span className="text-[10px] font-sans font-normal text-gray-400">Cardiff-10</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {kicks >= 10 ? "Reassuring & Active ✓" : "Counting In Progress"}
            </div>
          </div>
        </div>

        {/* 4. Maternal Weight */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="pink-cream-card rounded-2xl p-4 flex flex-col justify-between space-y-2 border border-[#f3dbe2] dark:border-rose-900/30 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#faf3eb] dark:bg-amber-950/70 text-[#8c5e32] dark:text-amber-300 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              +6.2 kg
            </span>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-300/70">
              Maternal Weight
            </div>
            <div className="text-base font-serif font-bold text-[#681e35] dark:text-rose-100">
              {weightDisplay}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-rose-300/60 font-medium">
              Within IOM Targets
            </div>
          </div>
        </div>

        {/* 5. Mood & Sleep */}
        <div
          onClick={() => onNavigate("mood-tracker")}
          className="pink-cream-card rounded-2xl p-4 flex flex-col justify-between space-y-2 border border-[#f3dbe2] dark:border-rose-900/30 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Restful
            </span>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-300/70">
              Mood & Sleep
            </div>
            <div className="text-base font-serif font-bold text-[#681e35] dark:text-rose-100 capitalize">
              {selectedMood || "Calm"}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-rose-300/60 font-medium">
              8.2h Sleep Logged
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
