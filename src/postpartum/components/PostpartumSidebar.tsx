import React from "react";
import {
  Heart,
  LayoutDashboard,
  Baby,
  Activity,
  Syringe,
  Flower2,
  Bell,
  ChevronRight,
  UserPlus,
  LogOut,
  ShieldAlert,
  Droplet,
  HeartPulse,
  Bandage,
  Milk,
  Droplets,
  Utensils,
  Moon,
  Smile,
  Pill,
  Calendar,
  FileText,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Sparkles,
  Brain,
  Network,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface PostpartumNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubPage: string;
  setActiveSubPage: (page: string) => void;
}

export const PostpartumSidebar: React.FC<PostpartumNavProps> = ({
  isOpen,
  onClose,
  activeSubPage,
  setActiveSubPage,
}) => {
  const { user, updateUser, setActivePage } = useApp();

  const navItems = [
    { id: "dashboard", label: "Postpartum Hub", icon: LayoutDashboard, badge: "Overview" },
    { id: "care", label: "Postpartum Care", icon: Heart, badge: "" },
    { id: "recovery", label: "Mother Physical Recovery", icon: Activity, badge: "" },
    { id: "baby-care", label: "Newborn Baby Care", icon: Baby, badge: "" },
    { id: "safety", label: "Clinical Safety Shield", icon: ShieldAlert, badge: "" },
    { id: "bleeding", label: "Bleeding & Lochia Care", icon: Droplet, badge: "" },
    { id: "pain", label: "Pain & Recovery Care", icon: HeartPulse, badge: "" },
    { id: "wound", label: "C-Section & Wound Care", icon: Bandage, badge: "" },
    { id: "feeding-lactation", label: "Baby Feeding & Lactation", icon: Milk, badge: "" },
    { id: "diapers", label: "Baby Diaper Care", icon: Baby, badge: "" },
    { id: "sleep-fatigue", label: "Mother Sleep & Fatigue", icon: Moon, badge: "" },
    { id: "baby-sleep", label: "Baby Sleep Care", icon: Moon, badge: "" },
    { id: "mood-wellbeing", label: "Mood & Emotional Wellbeing", icon: Smile, badge: "" },
    { id: "nutrition-hydration", label: "Nutrition & Hydration", icon: Utensils, badge: "" },
    { id: "medication", label: "Medication Management", icon: Pill, badge: "" },
    { id: "appointments", label: "Appointments & Visits", icon: Calendar, badge: "" },
    { id: "doctor-brief", label: "Doctor Brief Generator", icon: FileText, badge: "" },
    { id: "trend-pattern", label: "Trend & Pattern Engine", icon: TrendingUp, badge: "" },
    { id: "anomalies", label: "Anomaly Detection Engine", icon: Activity, badge: "" },
    { id: "plan", label: "Personalized Daily Plan", icon: Calendar, badge: "" },
    { id: "reminders", label: "Context-Aware Reminders", icon: Bell, badge: "" },
    { id: "checkin", label: "Daily Check-in Touchpoint", icon: CheckCircle2, badge: "" },
    { id: "followup", label: "Follow-up & Care Continuity", icon: RotateCcw, badge: "" },
    { id: "education", label: "Postpartum Education Layer", icon: BookOpen, badge: "" },
    { id: "insight", label: "Personalized Recovery Insight", icon: Sparkles, badge: "" },
    { id: "growth", label: "Baby Growth & Milestones", icon: TrendingUp, badge: "" },
    { id: "vaccines", label: "Vaccination Calendar", icon: Syringe, badge: "" },
    { id: "memory", label: "AI Memory & Patient History", icon: Brain, badge: "" },
    { id: "coordination", label: "Care Coordination Hub", icon: Network, badge: "" },
    { id: "bloom-ai-care-team", label: "Bloom AI Care Team", icon: Bot, badge: "Master AI" },
    { id: "wellness", label: "Postpartum Mind & Wellness", icon: Flower2, badge: "Coming Soon" },
  ];

  const handleLogout = () => {
    updateUser({ hasCompletedOnboarding: false });
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-[100dvh] w-[280px] bg-white dark:bg-[#1a1420] border-r border-rose-100 dark:border-rose-900/40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Module Header */}
        <div className="p-5 border-b border-rose-100 dark:border-rose-900/40 flex items-center gap-3">
          <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-white shadow-sm border border-rose-100 dark:border-slate-800">
            <img src="/bloomnest-logo.png" alt="BloomNest Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-rose-100 leading-tight">BloomNest</h1>
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              Fourth Trimester • Postpartum
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-2 pb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Postpartum Module
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubPage === item.id;
            const isComingSoon = item.badge === "Coming Soon";

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isComingSoon) {
                    setActiveSubPage(item.id);
                    onClose();
                  }
                }}
                disabled={isComingSoon}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : isComingSoon
                    ? "opacity-60 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "text-slate-600 dark:text-slate-300 hover:bg-rose-50/70 dark:hover:bg-rose-950/40 hover:text-rose-900 dark:hover:text-rose-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isComingSoon
                        ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-2 pb-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Stage Switcher
            </span>
          </div>

          <button
            onClick={() => {
              updateUser({ journeyStage: "PREGNANCY" });
              setActivePage("dashboard");
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Switch to Pregnancy</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Footer User Info & Logout Button */}
        <div className="p-4 border-t border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#231a2c] border border-rose-200/80 dark:border-rose-800/40 hover:border-rose-400 text-rose-700 dark:text-rose-200 transition-all group shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold leading-none truncate">Logout / Switch User</div>
                <div className="text-[9px] text-slate-500 dark:text-rose-300/70 mt-0.5 truncate">Reset session & setup</div>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center">
              {(user.fullName || user.name || "Mama")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.fullName || user.name || "Mama"}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Postpartum Recovery</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

