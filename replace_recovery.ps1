$content = @'
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Heart,
  Droplets,
  Moon,
  Smile,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from "lucide-react";

export const MotherRecoveryPage: React.FC<{
  onNavigateSubPage?: (page: string) => void;
}> = ({ onNavigateSubPage }) => {
  const [activeTab, setActiveTab] = useState<"physical" | "mental" | "nutrition">("physical");

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 pb-12">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => onNavigateSubPage?.("dashboard")} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-lg font-extrabold text-slate-900">Mother Recovery</h1>
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex bg-slate-100/80 rounded-full p-1.5 shadow-inner">
          <button
            onClick={() => setActiveTab("physical")}
            className={lex-1 text-sm font-bold rounded-full py-2.5 transition-all }
          >
            Physical
          </button>
          <button
            onClick={() => setActiveTab("mental")}
            className={lex-1 text-sm font-bold rounded-full py-2.5 transition-all }
          >
            Mental
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={lex-1 text-sm font-bold rounded-full py-2.5 transition-all }
          >
            Nutrition
          </button>
        </div>

        {activeTab === "physical" && (
          <div className="space-y-4">
            {/* Pain Card */}
            <div onClick={() => onNavigateSubPage?.("pain")} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pain Level</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-emerald-600">Mild (2/10)</span>
                    <div className="w-16 h-1 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[20%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            {/* Bleeding Card */}
            <div onClick={() => onNavigateSubPage?.("bleeding")} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-rose-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bleeding & Lochia</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Decreasing</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            {/* Sleep Card */}
            <div onClick={() => onNavigateSubPage?.("sleep-fatigue")} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 w-full min-w-[150px]">
                  <h3 className="text-sm font-bold text-slate-900">Sleep</h3>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-xs font-semibold text-slate-600">6h 20m</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[70%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            {/* Mood Card */}
            <div onClick={() => onNavigateSubPage?.("mood-wellbeing")} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-emerald-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mood</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Stable</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            {/* Recovery Insight */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex gap-4 items-start mt-8 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">Recovery Insight</h4>
                <p className="text-sm font-medium text-amber-800 leading-relaxed">
                  Your sleep has improved by 1.5 hrs compared to last 3 days. Keep it up!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mental" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Smile className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Mental health tracking coming soon.</p>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Droplets className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Nutrition tracking coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};
'@

Set-Content -Path src\pages\MotherRecoveryPage.tsx -Value $content
