import React, { useState } from "react";
import { PageView } from "../../types";
import { Sparkles, Send, Brain, ShieldAlert } from "lucide-react";

interface BloomAIInsightCardProps {
  currentWeek: number;
  onNavigate: (page: PageView) => void;
  t: (key: string, options?: any) => string;
}

export const BloomAIInsightCard: React.FC<BloomAIInsightCardProps> = ({
  currentWeek,
  onNavigate,
  t,
}) => {
  const [quickInput, setQuickInput] = useState("");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    try {
      sessionStorage.setItem("bloom_ai_preset_prompt", quickInput.trim());
    } catch {}
    onNavigate("ai-assistant");
  };

  const handleChipClick = (prompt: string) => {
    try {
      sessionStorage.setItem("bloom_ai_preset_prompt", prompt);
    } catch {}
    onNavigate("ai-assistant");
  };

  return (
    <div className="bg-white dark:bg-[#1a1423] rounded-3xl p-5 sm:p-6 border border-[#f5dce3] dark:border-rose-900/40 shadow-sm space-y-4">
      {/* Header with Active Memory Badge */}
      <div className="flex items-center justify-between border-b border-[#fce4ec] dark:border-rose-900/30 pb-2.5">
        <h3 className="font-serif font-bold text-base text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
          <span>Bloom AI Assistant</span>
          <Sparkles className="w-4 h-4 text-pink-500 fill-current" />
        </h3>
        <button
          type="button"
          onClick={() => onNavigate("ai-assistant")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[10px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
          title="Active Memory: Borderline BP history (138/88), Mild GDM Risk, Penicillin Allergy, Iron/Calcium spacing, AFI 13.8cm"
        >
          <Brain className="w-3 h-3 text-rose-500" />
          <span>Memory Active</span>
        </button>
      </div>

      {/* Concept 1 Colorful Memory-Aware Prompt Pills */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleChipClick("I have a headache today, how does my borderline BP history affect this?")}
          className="w-full text-left px-4 py-2.5 rounded-2xl bg-[#fce4ec] text-[#ad1457] dark:bg-rose-950/70 dark:text-rose-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate flex items-center justify-between"
        >
          <span className="truncate">🩺 Headache & BP 138/88 Protocol</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-200/60 text-rose-800 dark:bg-rose-900 dark:text-rose-200 ml-1.5 shrink-0">Memory</span>
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("Suggest low-glycemic high-protein snacks for Week 24 considering my mild GDM risk")}
          className="w-full text-left px-4 py-2.5 rounded-2xl bg-[#ffecb3] text-[#e65100] dark:bg-amber-950/70 dark:text-amber-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate flex items-center justify-between"
        >
          <span className="truncate">🥗 Low-GI Snacks (GDM Tailored)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-200/60 text-amber-800 dark:bg-amber-900 dark:text-amber-200 ml-1.5 shrink-0">Diet</span>
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("How do my iron and calcium medication timings prevent absorption conflicts?")}
          className="w-full text-left px-4 py-2.5 rounded-2xl bg-[#e1f5fe] text-[#0277bd] dark:bg-sky-950/70 dark:text-sky-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate flex items-center justify-between"
        >
          <span className="truncate">💊 Iron & Calcium 2h Spacing Rule</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-200/60 text-sky-800 dark:bg-sky-900 dark:text-sky-200 ml-1.5 shrink-0">Med</span>
        </button>
      </div>

      {/* Input Box with Pink Send Button */}
      <form onSubmit={handleQuickSubmit} className="relative pt-1">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Ask with patient memory..."
          className="w-full pl-4 pr-12 py-2.5 rounded-full bg-[#fdf8fa] dark:bg-[#201828] border border-[#f5dce3] text-xs text-gray-800 dark:text-rose-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-full bg-[#ff4081] text-white flex items-center justify-center absolute right-1.5 top-2.5 shadow-md shadow-pink-500/30 hover:scale-105 transition-transform cursor-pointer"
          title="Send question to Bloom AI"
        >
          <Send className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
