import React, { useState, useEffect, useId } from "react";
import { useApp } from "../context/AppContext";
import { PostpartumProfile, BabyProfileData } from "../types";
import {
  calculatePostpartumDay,
  calculatePostpartumWeek,
  formatPostpartumTime,
  formatBabyAge,
  formatDeliveryType,
} from "../utils/postpartumUtils";
import {
  Baby,
  Heart,
  Calendar,
  Sparkles,
  Clock,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Milk,
  Utensils,
  Moon,
  Ruler,
  Weight,
  Syringe,
  ChevronRight,
  X,
  FileText,
  Building2,
  UserCheck,
  History,
  ArrowRight,
} from "lucide-react";

const POSTPARTUM_PROFILE_KEY = "bloomnest_postpartum_profile_v1";
const BABY_PROFILE_KEY = "bloomnest_baby_profile_v1";

export const BabyCarePage: React.FC<{
  onNavigateSubPage?: (page: string) => void;
}> = ({ onNavigateSubPage }) => {
  const { user, setActivePage, showToast } = useApp();

  const babyNameInputId = useId();
  const birthWeightInputId = useId();
  const birthLengthInputId = useId();
  const notesInputId = useId();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<PostpartumProfile | null>(null);
  const [babyData, setBabyData] = useState<BabyProfileData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Edit form state
  const [formBabyName, setFormBabyName] = useState<string>("");
  const [formGender, setFormGender] = useState<"Boy" | "Girl" | "Surprise" | "Unspecified">("Unspecified");
  const [formWeight, setFormWeight] = useState<string>("");
  const [formLength, setFormLength] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // Load Feature 03 Baby Profile & Feature 10 Feeding / Feature 11 Diaper / Feature 13 Baby Sleep Status
  const [feedingStatus, setFeedingStatus] = useState<string>("Not logged today");
  const [diaperStatus, setDiaperStatus] = useState<string>("Not logged today");
  const [sleepStatus, setSleepStatus] = useState<string>("Not logged today");

  useEffect(() => {
    const loadData = () => {
      try {
        // Load Feature 01 Profile
        const savedProfile = localStorage.getItem(POSTPARTUM_PROFILE_KEY);
        let currentProfile: PostpartumProfile | null = null;

        if (savedProfile) {
          currentProfile = JSON.parse(savedProfile);
          setProfile(currentProfile);
        } else if (user?.journeyStage === "POST_PREGNANCY") {
          currentProfile = {
            deliveryDate: new Date().toISOString().split("T")[0],
            deliveryType: "vaginal",
            numberOfBabies: 1,
          };
          setProfile(currentProfile);
        }

        // Load Feature 03 Baby Profile
        const savedBaby = localStorage.getItem(BABY_PROFILE_KEY);
        if (savedBaby) {
          const parsed: BabyProfileData = JSON.parse(savedBaby);
          setBabyData(parsed);
          populateForm(parsed);
        } else {
          // Initial default based on Feature 01 context
          const initialBaby: BabyProfileData = {
            babyName: "Newborn Baby",
            gender: "Unspecified",
            notes: "",
          };
          setBabyData(initialBaby);
          populateForm(initialBaby);
        }

        const todayStr = new Date().toISOString().split("T")[0];

        // Load Feature 10 Feeding logs status for today
        const savedFeeds = localStorage.getItem("bloomnest_baby_feeding_logs_v1");
        if (savedFeeds) {
          const feeds = JSON.parse(savedFeeds);
          const todayFeeds = feeds.filter((f: any) => f.date === todayStr);
          if (todayFeeds.length > 0) {
            const bottleMl = todayFeeds.reduce((acc: number, f: any) => acc + (f.amountConsumedMl || 0), 0);
            setFeedingStatus(
              `${todayFeeds.length} ${todayFeeds.length === 1 ? "feed" : "feeds"} today${
                bottleMl > 0 ? ` (${bottleMl} mL bottle)` : ""
              }`
            );
          }
        }

        // Load Feature 11 Diaper logs status for today
        const savedDiapers = localStorage.getItem("bloomnest_diaper_logs_v1");
        if (savedDiapers) {
          const diaperLogs = JSON.parse(savedDiapers);
          const todayDiapers = diaperLogs.filter((d: any) => d.date === todayStr);
          if (todayDiapers.length > 0) {
            const wet = todayDiapers.filter((d: any) => d.type === "Wet" || d.type === "Wet + Dirty").length;
            const dirty = todayDiapers.filter((d: any) => d.type === "Dirty" || d.type === "Wet + Dirty").length;
            setDiaperStatus(`${todayDiapers.length} changes (${wet} wet, ${dirty} dirty)`);
          }
        }

        // Load Feature 13 Baby Sleep logs status for today
        const savedSleep = localStorage.getItem("bloomnest_baby_sleep_logs_v1");
        if (savedSleep) {
          const sleepLogs = JSON.parse(savedSleep);
          const todaySleep = sleepLogs.filter((s: any) => s.date === todayStr);
          if (todaySleep.length > 0) {
            const totalMins = todaySleep.reduce((acc: number, s: any) => acc + (s.durationMinutes || 0), 0);
            const hrs = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
            setSleepStatus(`${todaySleep.length} ${todaySleep.length === 1 ? "session" : "sessions"} (${timeStr} total)`);
          }
        }
      } catch (err) {
        console.error("Error loading baby care data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const populateForm = (b: BabyProfileData) => {
    setFormBabyName(b.babyName || "Newborn Baby");
    setFormGender(b.gender || "Unspecified");
    setFormWeight(b.birthWeightKg ? String(b.birthWeightKg) : "");
    setFormLength(b.birthLengthCm ? String(b.birthLengthCm) : "");
    setFormNotes(b.notes || "");
  };

  const handleSaveBabyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formBabyName.trim()) {
      setFormError("Please enter a baby name or nickname.");
      return;
    }

    const updatedBaby: BabyProfileData = {
      id: babyData?.id || `baby_${Date.now()}`,
      userId: user?.id || "user_demo",
      babyName: formBabyName.trim(),
      gender: formGender,
      birthWeightKg: formWeight ? parseFloat(formWeight) : undefined,
      birthLengthCm: formLength ? parseFloat(formLength) : undefined,
      notes: formNotes.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(BABY_PROFILE_KEY, JSON.stringify(updatedBaby));
      setBabyData(updatedBaby);
      setIsModalOpen(false);
      setSaveSuccessMsg("Baby profile details updated successfully!");
      showToast("Baby profile saved 💕");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      setFormError("Failed to save baby profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#120E18] p-6 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Baby Care...</p>
      </div>
    );
  }

  // FALLBACK IF FEATURE 01 PROFILE NOT CONFIGURED
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#120E18] p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-[#1A1523] rounded-3xl p-8 border border-rose-100 dark:border-rose-900/40 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center mx-auto">
            <Baby className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-rose-100">Setup Postpartum Care First</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Feature 03 (Baby Care) reuses birth details from Feature 01. Please configure your delivery date first.
            </p>
          </div>

          <button
            onClick={() => onNavigateSubPage && onNavigateSubPage("care")}
            className="w-full py-3 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Feature 01 (Postpartum Care)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // CALCULATE BABY AGE FROM FEATURE 01 BIRTH CONTEXT
  const birthDateStr = profile.babyBirthDate || profile.deliveryDate;
  const babyAgeDays = calculatePostpartumDay(birthDateStr);
  const babyAgeWeeks = calculatePostpartumWeek(babyAgeDays);
  const formattedTime = formatBabyAge(babyAgeDays);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#120E18] text-slate-800 dark:text-rose-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* TOAST */}
      {saveSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* HEADER WITH REUSED FEATURE 01 BIRTH CONTEXT */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 uppercase tracking-wider">
              Feature 03
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Infant Profile & Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-rose-100 tracking-tight mt-1">
            Newborn Baby Care
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="px-3 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-xs">
              Baby Age: {babyAgeDays} {babyAgeDays === 1 ? "day" : "days"} old
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
              {profile.numberOfBabies} Baby ({formatDeliveryType(profile.deliveryType)})
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Born {birthDateStr}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-[#1A1523] text-purple-600 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-900/40 text-xs shadow-xs hover:bg-purple-50 transition-all self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Baby Profile</span>
        </button>
      </header>

      {/* 👶 BABY PROFILE CARD */}
      <section className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-pink-900/20 mb-8 border border-white/50 bg-gradient-to-br from-pink-500 to-rose-400">
        {/* High-Quality Baby Image without color overlay */}
        <div className="absolute inset-0 w-full h-full">
           <img 
              src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=1600&ixlib=rb-4.0.3" 
              alt="Sleeping baby" 
              className="w-full h-full object-cover object-[center_30%] [mask-image:linear-gradient(to_right,transparent,black_40%,black)]"
            />
        </div>
        
        {/* Left Side Pink Shadow ONLY for text readability - NO dark/black colors! */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-500/80 to-transparent w-full md:w-1/2" />
        
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-8 max-w-xl">
            {/* Top Label */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-sm">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-100 block">Baby Profile Card</span>
                {babyData?.gender && babyData.gender !== "Unspecified" && (
                  <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                    {babyData.gender === "Girl" ? "🎀 Baby Girl" : babyData.gender === "Boy" ? "🧸 Baby Boy" : "✨ Surprise"}
                  </span>
                )}
              </div>
            </div>

            {/* Main Name & Age Grid */}
            <div className="space-y-1.5">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {babyData?.babyName || "Newborn Baby"}
              </h2>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                  <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                  <span className="text-sm font-extrabold text-white">{formattedTime.formatted}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-purple-50">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Week {babyAgeWeeks} of growth</span>
                </div>
              </div>
            </div>

            {/* Reused Feature 01 Context Bar */}
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-inner">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Birth Date</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{birthDateStr}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Baby className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </div>
                <span className="font-extrabold text-white text-sm block truncate">{formatDeliveryType(profile.deliveryType)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Weight className="w-3.5 h-3.5" />
                  <span>Weight</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{babyData?.birthWeightKg ? `${babyData.birthWeightKg} kg` : "—"}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-purple-100/90 text-[10px] font-bold uppercase tracking-wider">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Length</span>
                </div>
                <span className="font-extrabold text-white text-sm block">{babyData?.birthLengthCm ? `${babyData.birthLengthCm} cm` : "—"}</span>
              </div>
            </div>
            
            {babyData?.notes && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-sm italic text-purple-50 border-l-4 border-l-pink-300">
                "{babyData.notes}"
              </div>
            )}
          </div>
          
          {/* Right Side Summary Cards */}
          <div className="flex-1 max-w-md w-full space-y-3 lg:pl-12">
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("baby-feeding")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                  <Milk className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Feeding</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{feedingStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-500 transition-colors" />
              </div>
              
              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("baby-sleep")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Sleep</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{sleepStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>

              <div 
                onClick={() => onNavigateSubPage && onNavigateSubPage("diapers")}
                className="bg-white rounded-3xl p-4 cursor-pointer hover:shadow-lg transition-shadow border border-white/40 flex items-center gap-3 shadow-md group"
              >
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5 text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Diapers</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">{diaperStatus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
              </div>

              <div className="bg-white rounded-3xl p-4 border border-white/40 flex items-center gap-3 shadow-md">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Ruler className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">Growth</h3>
                  <p className="text-[10px] font-semibold text-slate-500 truncate">On track</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            {/* AI Diaper Vision Card */}
            <div className="bg-gradient-to-r from-[#E9F0FF] to-[#F1EEFF] rounded-3xl p-4 border border-white/40 flex items-center gap-4 shadow-md relative overflow-hidden mt-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                <Baby className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-sm font-extrabold text-slate-800">AI Diaper Vision</h3>
                <p className="text-[10px] font-medium text-slate-600 leading-snug pr-4 mt-0.5">
                  Check your baby's diaper for visible characteristics & insights.
                </p>
              </div>
              <button 
                onClick={() => onNavigateSubPage && onNavigateSubPage("diapers")}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-sm transition-colors shrink-0"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 QUICK ACCESS SHORTCUTS */}
      <section className="bg-white dark:bg-[#1A1523] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-rose-900/40 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-rose-100">Baby Care Quick Access</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Direct shortcuts to specialized infant care features.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickShortcutCard label="Baby Feeding" feature="Feature 10" icon={Milk} onClick={() => onNavigateSubPage && onNavigateSubPage("baby-feeding")} />
          <QuickShortcutCard label="Diaper Monitor" feature="Feature 11" icon={Baby} onClick={() => onNavigateSubPage && onNavigateSubPage("diapers")} />
          <QuickShortcutCard label="Baby Sleep Routine" feature="Feature 13" icon={Moon} onClick={() => onNavigateSubPage ? onNavigateSubPage("baby-sleep") : setActivePage("baby-sleep")} />
          <QuickShortcutCard label="Growth & Milestones" feature="Feature 27" icon={Ruler} onClick={() => showToast("Growth module launching soon!")} />
          <QuickShortcutCard label="Vaccination Schedule" feature="Feature 28" icon={Syringe} onClick={() => setActivePage("vaccinations")} />
        </div>
      </section>

      {/* 📊 BABY CARE HISTORY SUMMARY */}
      <section className="bg-white dark:bg-[#1A1523] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-rose-900/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-rose-100">Baby Care Record History</h2>
          </div>
          <span className="text-xs text-slate-400">Initial Profile Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#15111C] border border-slate-200/60 dark:border-gray-800 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-rose-200">
            <span>{babyData?.babyName || "Newborn Baby"} Profile Established</span>
            <span className="text-[10px] text-slate-400 font-normal">Born {birthDateStr}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Central baby profile active. Consuming canonical birth details from Feature 01. Ready for specialized infant logging.
          </p>
        </div>
      </section>

      {/* EDIT BABY PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1523] text-slate-800 dark:text-rose-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-purple-900/40 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-rose-900/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-rose-100">Edit Baby Profile Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update baby name, gender, weight, and length.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBabyProfile} className="space-y-4 mt-4 text-xs">
              <div>
                <label htmlFor={babyNameInputId} className="block font-bold text-slate-700 dark:text-rose-300 mb-1">
                  Baby Name / Nickname <span className="text-purple-500">*</span>
                </label>
                <input
                  id={babyNameInputId}
                  type="text"
                  required
                  placeholder="e.g. Baby Aarav"
                  value={formBabyName}
                  onChange={(e) => setFormBabyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-[#15111C] font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-rose-300 mb-1.5">
                  Gender <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Girl", "Boy", "Surprise", "Unspecified"] as const).map((gnd) => (
                    <button
                      key={gnd}
                      type="button"
                      onClick={() => setFormGender(gnd)}
                      className={`py-2 rounded-xl font-bold border transition-all text-[11px] ${
                        formGender === gnd
                          ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                          : "bg-white dark:bg-[#15111C] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-gray-800"
                      }`}
                    >
                      {gnd === "Girl" ? "🎀 Girl" : gnd === "Boy" ? "🧸 Boy" : gnd === "Surprise" ? "✨ Surprise" : "Skip"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={birthWeightInputId} className="block font-bold text-slate-700 dark:text-rose-300 mb-1">
                    Birth Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id={birthWeightInputId}
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="10"
                    placeholder="e.g. 3.2"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-[#15111C] font-semibold"
                  />
                </div>

                <div>
                  <label htmlFor={birthLengthInputId} className="block font-bold text-slate-700 dark:text-rose-300 mb-1">
                    Birth Length (cm) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id={birthLengthInputId}
                    type="number"
                    step="0.1"
                    min="20"
                    max="100"
                    placeholder="e.g. 50"
                    value={formLength}
                    onChange={(e) => setFormLength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-[#15111C] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={notesInputId} className="block font-bold text-slate-700 dark:text-rose-300 mb-1">
                  Baby Care Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id={notesInputId}
                  rows={3}
                  placeholder="Special birth notes or milestone observations..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-gray-800 bg-white dark:bg-[#15111C] font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-rose-900/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-gray-800 font-bold text-slate-600 dark:text-rose-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER SUMMARY CARD
const CareSummaryCard: React.FC<{
  title: string;
  featureBadge: string;
  icon: React.ElementType;
  iconColor: string;
  status: string;
  onClick?: () => void;
}> = ({ title, featureBadge, icon: Icon, iconColor, status, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-50/80 dark:bg-[#15111C] p-4 rounded-2xl border border-slate-200/60 dark:border-gray-800 space-y-2 transition-all ${
      onClick ? "cursor-pointer hover:border-purple-300 hover:bg-purple-50/30" : ""
    }`}
  >
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-xl bg-white dark:bg-[#1A1523] shadow-xs ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        {featureBadge}
      </span>
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-800 dark:text-rose-100">{title}</h3>
      <p className="text-[11px] text-slate-400 italic mt-0.5">{status}</p>
    </div>
  </div>
);

// HELPER SHORTCUT CARD
const QuickShortcutCard: React.FC<{
  label: string;
  feature: string;
  icon: React.ElementType;
  onClick: () => void;
}> = ({ label, feature, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15111C] hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200/60 dark:border-gray-800 hover:border-purple-300 text-left transition-all group flex flex-col justify-between h-22"
  >
    <div className="flex items-center justify-between w-full">
      <Icon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-500" />
    </div>
    <div>
      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{feature}</span>
      <span className="text-xs font-bold text-slate-800 dark:text-rose-100 group-hover:text-purple-600 transition-colors line-clamp-1">
        {label}
      </span>
    </div>
  </button>
);
