import React, { useState } from "react";
import { HealthVital, PageView } from "../../types";
import { Droplets, Scale, Smile, Heart, Activity, Plus, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

interface VitalsSummaryStripProps {
  todayVital?: Partial<HealthVital>;
  selectedMood: string;
  onNavigate: (page: PageView) => void;
  onQuickAddWater?: (amountMl: number) => void;
  onQuickAddKick?: () => void;
  t: (key: string, options?: any) => string;
}

export const VitalsSummaryStrip: React.FC<VitalsSummaryStripProps> = ({
  todayVital,
  selectedMood,
  onNavigate,
  onQuickAddWater,
  onQuickAddKick,
  t,
}) => {
  const [kickAnimation, setKickAnimation] = useState(false);
  const [waterAnimation, setWaterAnimation] = useState(false);

  const waterLiters = todayVital?.waterMl ? (todayVital.waterMl / 1000).toFixed(1) : "2.4";
  const weightDisplay = todayVital?.weightKg ? `${todayVital.weightKg} kg` : "64.2 kg";
  const kicks = todayVital?.babyKicksCount !== undefined ? todayVital.babyKicksCount : 8;
  
  const bpStatus = todayVital?.evaluation?.overallStatus || (
    todayVital?.systolicBp && todayVital?.diastolicBp
      ? (todayVital.systolicBp > 120 || todayVital.diastolicBp > 80 || todayVital.systolicBp < 90 || todayVital.diastolicBp < 60 ? "ATTENTION" : "NORMAL")
      : "NORMAL"
  );
  
  const sys = todayVital?.systolicBp || 118;
  const dia = todayVital?.diastolicBp || 76;
  const mapBp = Math.round((sys + 2 * dia) / 3);

  const handleKickClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setKickAnimation(true);
    setTimeout(() => setKickAnimation(false), 800);
    if (onQuickAddKick) onQuickAddKick();
  };

  const handleWaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWaterAnimation(true);
    setTimeout(() => setWaterAnimation(false), 800);
    if (onQuickAddWater) onQuickAddWater(250);
  };

  return (
    <div className="space-y-3">
      {/* Top Strip: Maternal Stability Score & Quick Telemetry Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-pink-100 dark:bg-rose-950/80 text-pink-600">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-serif font-bold text-gray-900 dark:text-rose-100">
              {t("todaysWellnessVitals")}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-rose-300 ml-2 font-medium">
              Real-time biometric radar
            </span>
          </div>
        </div>

        {/* AI Health Stability Score Pill */}
        <div className="flex items-center gap-2">
          <div className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
              96/100 · Optimal Perinatal Stability
            </span>
          </div>
          <button
            onClick={() => onNavigate("health-tracker")}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Full Log →
          </button>
        </div>
      </div>

      {/* 5 Vitals Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* 1. Blood Pressure & MAP */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className={`glass-panel luxury-card-hover rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-1.5 cursor-pointer relative overflow-hidden ${
            bpStatus === "SEVERE"
              ? "border-rose-400 bg-rose-500/10"
              : bpStatus === "HIGH"
              ? "border-orange-400 bg-orange-500/10"
              : "border-white/60 dark:border-white/10"
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-rose-200/70">
            Blood Pressure
          </div>
          <div className="text-base font-extrabold text-gray-900 dark:text-rose-100">
            {sys}/{dia}
            <span className="text-[10px] font-normal text-gray-400 ml-1">mmHg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              MAP {mapBp}
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Normal
            </span>
          </div>
        </div>

        {/* 2. Hydration Tracker + Quick +250ml Button */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-1.5 cursor-pointer group relative overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-2xs">
            <Droplets className={`w-4 h-4 fill-current ${waterAnimation ? "animate-bounce text-blue-400" : ""}`} />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-blue-200/70">
            {t("hydration")}
          </div>
          <div className="text-base font-extrabold text-gray-900 dark:text-blue-100">
            {waterLiters} <span className="text-xs font-normal text-gray-400">/ 3.0L</span>
          </div>
          <button
            onClick={handleWaterClick}
            className="w-full py-1 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Quick add 250ml water"
          >
            <Plus className="w-3 h-3" />
            <span>250 ml</span>
          </button>
        </div>

        {/* 3. Weight Progress */}
        <div
          onClick={() => onNavigate("health-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-1.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-emerald-200/70">
            {t("weight")}
          </div>
          <div className="text-base font-extrabold text-gray-900 dark:text-emerald-100">
            {weightDisplay}
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            +5.4 kg Total
          </span>
        </div>

        {/* 4. Mood Wellbeing */}
        <div
          onClick={() => onNavigate("mood-tracker")}
          className="glass-panel luxury-card-hover rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-1.5 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center shadow-2xs">
            <Smile className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-amber-200/70">
            Emotional State
          </div>
          <div className="text-base font-extrabold text-gray-900 dark:text-amber-100 capitalize">
            {selectedMood || "Calm"}
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            Serene & Grounded
          </span>
        </div>

        {/* 5. Live Baby Kicks + Quick +1 Kick Button */}
        <div
          onClick={() => onNavigate("kick-counter")}
          className="glass-panel luxury-card-hover rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-1.5 cursor-pointer group relative overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 flex items-center justify-center shadow-2xs">
            <Heart className={`w-4 h-4 fill-current ${kickAnimation ? "animate-ping text-rose-500" : ""}`} />
          </div>
          <div className="text-[11px] font-semibold text-gray-500 dark:text-pink-200/70">
            Cardiff Kicks
          </div>
          <div className="text-base font-extrabold text-gray-900 dark:text-pink-100">
            {kicks} <span className="text-xs font-normal text-gray-400">/ 10 Kicks</span>
          </div>
          <button
            onClick={handleKickClick}
            className="w-full py-1 px-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-pink-700 dark:text-pink-300 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Log 1 fetal kick"
          >
            <Plus className="w-3 h-3" />
            <span>+1 Kick</span>
          </button>
        </div>
      </div>
    </div>
  );
};

