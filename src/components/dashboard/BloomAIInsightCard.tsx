import React, { useState } from "react";
import { PageView } from "../../types";
import { Bot, ArrowRight, Sparkles, MessageSquareHeart } from "lucide-react";

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

  const promptSuggestions = [
    "Is mild lower belly tightening normal at 24 weeks?",
    "Best iron-rich Indian vegetarian dinner recipes",
    "What scans are due in the third trimester?",
  ];

  return (
    <div className="pink-cream-card rounded-3xl p-5 sm:p-6 space-y-4 border border-[#f3dbe2] dark:border-rose-900/30 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-[#e26989] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#681e35] dark:text-rose-100 flex items-center gap-1.5">
              <span>Dr. Bloom AI Maternal Copilot</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '5s' }} />
            </div>
            <div className="text-[11px] text-gray-500 dark:text-rose-300/70 font-medium">
              Trained on ACOG & FOGSI Guidelines · English & Tanglish Ready
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("ai-assistant")}
          className="text-xs font-bold text-[#b84a6b] dark:text-rose-300 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
        >
          <span>Open Full Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Week 24 Contextual Clinical Insight */}
      <div className="p-3.5 rounded-2xl bg-[#fff7f9] dark:bg-rose-950/40 text-xs font-medium text-[#75203b] dark:text-rose-200 leading-relaxed border border-[#f5cad6] dark:border-rose-800/40 flex items-start gap-2.5">
        <MessageSquareHeart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <strong>Week {currentWeek} Maternal Note:</strong> Your blood volume has expanded by nearly 45-50%, which may cause occasional dizziness when standing up quickly. In Garbha Sanskar, morning listening to gentle ragas like <em>Kalyani</em> helps regulate maternal vagal nerve tone and fetal rest rhythms.
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(prompt)}
            className="text-[11px] font-semibold px-3 py-1 rounded-full pink-cream-pill hover:border-rose-400 hover:text-rose-700 transition-all text-left truncate max-w-full cursor-pointer hover:scale-102"
          >
            💬 "{prompt}"
          </button>
        ))}
      </div>

      {/* Quick Ask Input Bar */}
      <form onSubmit={handleQuickSubmit} className="flex gap-2 pt-1">
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Ask Dr. Bloom any pregnancy question (e.g. food, scans, sleep, symptoms)..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-rose-950/60 border border-[#f3dbe2] dark:border-rose-900/40 text-xs text-gray-800 dark:text-rose-100 placeholder-gray-400 dark:placeholder-rose-300/40 focus:outline-none focus:ring-2 focus:ring-rose-400/50 min-h-[44px]"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-[#e26989] text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all shrink-0 min-h-[44px] cursor-pointer hover:scale-105"
        >
          Ask AI
        </button>
      </form>
    </div>
  );
};
