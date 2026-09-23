import React from "react";
import { HealthVital, PageView } from "../../types";
import { Card } from "../ui/Card";
import { Droplets, Scale, Smile, Heart, Activity } from "lucide-react";

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
  const waterLiters = todayVital?.waterMl ? (todayVital.waterMl / 1000).toFixed(1) : "0.0";
  const weightDisplay = todayVital?.weightKg ? `${todayVital.weightKg} kg` : "--";
  const kicks = todayVital?.babyKicksCount !== undefined ? todayVital.babyKicksCount : 0;
  const bpStatus = todayVital?.evaluation?.bp?.status || (
    todayVital?.systolicBp && todayVital?.diastolicBp
      ? (todayVital.systolicBp > 120 || todayVital.diastolicBp > 80 || todayVital.systolicBp < 90 || todayVital.diastolicBp < 60 ? "ATTENTION" : "NORMAL")
      : "NORMAL"
  );
  const bpText = todayVital?.systolicBp && todayVital?.diastolicBp
    ? `${todayVital.systolicBp}/${todayVital.diastolicBp}`
    : "120/80";

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-bold text-gray-900 dark:text-rose-100 font-serif">
        {t("todaysWellnessVitals")}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Blood Pressure & Status */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className={`glass-panel luxury-card-hover rounded-2xl p-3.5 text-center flex flex-col items-center justify-between space-y-1 cursor-pointer ${
            bpStatus === "SEVERE"
              ? "border-rose-400 dark:border-rose-600 bg-rose-500/10"
              : bpStatus === "HIGH"
              ? "border-orange-400 dark:border-orange-600 bg-orange-500/10"
              : bpStatus === "ATTENTION"
              ? "border-amber-400 dark:border-amber-600 bg-amber-500/10"
              : "border-white/60 dark:border-white/10"
          }`}
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-200/70">
            Blood Pressure
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-rose-100">
            {bpText} <span className="text-[10px] font-normal text-gray-400">mmHg</span>
          </div>
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
            bpStatus === "NORMAL"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : bpStatus === "ATTENTION"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : bpStatus === "HIGH"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
              : "bg-rose-600 text-white"
          }`}>
            {bpStatus === "NORMAL" ? "Target" : bpStatus}
          </span>
        </div>

        {/* Water / Hydration */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-3.5 text-center flex flex-col items-center justify-between space-y-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Droplets className="w-4 h-4 fill-current" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-blue-200/70">
            {t("hydration")}
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-blue-100">
            {waterLiters} L
          </div>
        </div>

        {/* Weight */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-3.5 text-center flex flex-col items-center justify-between space-y-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-emerald-200/70">
            {t("weight")}
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-emerald-100">
            {weightDisplay}
          </div>
        </div>

        {/* Mood */}
        <div
          onClick={() => onNavigate("mood-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-3.5 text-center flex flex-col items-center justify-between space-y-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <Smile className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-amber-200/70">
            {t("mood")}
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-amber-100 capitalize">
            {selectedMood}
          </div>
        </div>

        {/* Baby Kicks */}
        <div
          onClick={() => onNavigate("kick-counter")}
          className="glass-panel luxury-card-hover rounded-2xl p-3.5 text-center flex flex-col items-center justify-between space-y-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-pink-200/70">
            {t("babyKicks")}
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-pink-100">
            {kicks}
          </div>
        </div>
      </div>
    </div>
  );
};
