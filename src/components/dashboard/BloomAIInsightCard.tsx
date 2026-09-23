import React, { useState } from "react";
import { PageView } from "../../types";
import { Sparkles, Send } from "lucide-react";

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
    onNavigate("ai-assistant");
  };

  const handleChipClick = (prompt: string) => {
    setQuickInput(prompt);
    onNavigate("ai-assistant");
  };

  return (
    <div className="bg-white dark:bg-[#1a1423] rounded-3xl p-5 sm:p-6 border border-[#f5dce3] dark:border-rose-900/40 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#fce4ec] dark:border-rose-900/30 pb-2.5">
        <h3 className="font-serif font-bold text-base text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
          <span>Bloom AI Assistant</span>
          <Sparkles className="w-4 h-4 text-pink-500 fill-current" />
        </h3>
      </div>

      {/* Concept 1 Colorful Prompt Pills */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleChipClick("Relieving back pain")}
          className="w-full text-left px-4 py-2 rounded-2xl bg-[#f3e5f5] text-[#7b1fa2] dark:bg-purple-950/70 dark:text-purple-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate"
        >
          Relieving back pain
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("Best snacks for Week 24")}
          className="w-full text-left px-4 py-2 rounded-2xl bg-[#ffecb3] text-[#e65100] dark:bg-amber-950/70 dark:text-amber-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate"
        >
          Best snacks for Week 24
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("Preparing the Nursery")}
          className="w-full text-left px-4 py-2 rounded-2xl bg-[#e1f5fe] text-[#0277bd] dark:bg-sky-950/70 dark:text-sky-300 font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-2xs block truncate"
        >
          Preparing the Nursery
        </button>
      </div>

      {/* Input Box with Pink Send Button */}
      <form onSubmit={handleQuickSubmit} className="relative pt-1">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Input suggestion..."
          className="w-full pl-4 pr-12 py-2.5 rounded-full bg-[#fdf8fa] dark:bg-[#201828] border border-[#f5dce3] text-xs text-gray-800 dark:text-rose-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-full bg-[#ff4081] text-white flex items-center justify-center absolute right-1.5 top-2.5 shadow-md shadow-pink-500/30 hover:scale-105 transition-transform cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </form>
    </div>
  );
};
