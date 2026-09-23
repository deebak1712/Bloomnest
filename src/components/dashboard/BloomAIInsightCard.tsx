import React, { useState } from "react";
import { PageView } from "../../types";
import { Card } from "../ui/Card";
import { Bot, ArrowRight, Sparkles } from "lucide-react";

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

  return (
    <div
      className="glass-panel luxury-card-hover rounded-3xl p-5 space-y-3.5 border border-purple-200/40 dark:border-purple-900/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1">
              <span>{t("aiMamaCompanion")}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-[11px] text-gray-500 dark:text-rose-300/70">
              {t("multilingualAssistant")}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("ai-assistant")}
          className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
        >
          <span>{t("askAi")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekly Clinical Insight Note */}
      <div className="p-3.5 rounded-2xl glass-pill text-xs font-medium text-gray-700 dark:text-rose-200 leading-relaxed border border-purple-100 dark:border-purple-900/30">
        🌸 <strong>Week {currentWeek} Clinical Insight:</strong> Your baby's hearing is active this week. Listening to peaceful Garbha Sanskar ragas can promote maternal relaxation and baby bonding.
      </div>

      <form onSubmit={handleQuickSubmit} className="flex gap-2">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder={t("aiPlaceholder")}
          className="flex-1 px-4 py-2.5 rounded-2xl glass-pill text-xs text-gray-800 dark:text-rose-100 placeholder-gray-400 dark:placeholder-rose-300/40 focus:outline-none focus:ring-2 focus:ring-pink-400/50 min-h-[44px]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all shrink-0 min-h-[44px] cursor-pointer hover:scale-105"
        >
          {t("ask")}
        </button>
      </form>
    </div>
  );
};
