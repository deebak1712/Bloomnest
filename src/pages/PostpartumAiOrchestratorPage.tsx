import React, { useState } from "react";
import { Bot, Baby, ShieldCheck, ArrowLeft } from "lucide-react";
import { MotherRecoveryAiPage } from "./MotherRecoveryAiPage";
import { BabyCareAiPage } from "./BabyCareAiPage";
import { SafetyCareCoordinationAiPage } from "./SafetyCareCoordinationAiPage";

interface PostpartumAiOrchestratorPageProps {
  onNavigateSubPage?: (page: string) => void;
}

export const PostpartumAiOrchestratorPage: React.FC<PostpartumAiOrchestratorPageProps> = ({
  onNavigateSubPage,
}) => {
  // Default to mother agent, no orchestrator
  const [activeTab, setActiveTab] = useState<"mother" | "baby" | "safety">("mother");

  return (
    <div className="flex flex-col h-full bg-[#FAF8FC] dark:bg-[#120e18] relative">
      {/* Header and Tabs */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1a1523] border-b border-rose-100 dark:border-rose-900/40 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => onNavigateSubPage?.("dashboard")}
              className="p-2 -ml-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-rose-100 flex items-center gap-2">
                <Bot className="w-6 h-6 text-rose-500" />
                Bloom AI Care Team
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Your 3 Specialized Postpartum AI Agents</p>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveTab("mother")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "mother"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white dark:bg-[#120e18] text-gray-600 dark:text-rose-200 border border-gray-200 dark:border-rose-900/40"
              }`}
            >
              <Bot className="w-4 h-4" />
              Mother Recovery AI
            </button>
            <button
              onClick={() => setActiveTab("baby")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "baby"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white dark:bg-[#120e18] text-gray-600 dark:text-rose-200 border border-gray-200 dark:border-rose-900/40"
              }`}
            >
              <Baby className="w-4 h-4" />
              Baby Care AI
            </button>
            <button
              onClick={() => setActiveTab("safety")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === "safety"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white dark:bg-[#120e18] text-gray-600 dark:text-rose-200 border border-gray-200 dark:border-rose-900/40"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Safety & Coordination AI
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full">
        {activeTab === "mother" && <MotherRecoveryAiPage onNavigateSubPage={onNavigateSubPage} />}
        {activeTab === "baby" && <BabyCareAiPage onNavigatePage={(page) => onNavigateSubPage?.(page as string)} />}
        {activeTab === "safety" && <SafetyCareCoordinationAiPage onNavigatePage={(page) => onNavigateSubPage?.(page as string)} />}
      </div>
    </div>
  );
};
