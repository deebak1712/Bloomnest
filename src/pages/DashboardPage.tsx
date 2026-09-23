import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { HeroFetalProgress } from "../components/dashboard/HeroFetalProgress";
import { TodaysPriorities } from "../components/dashboard/TodaysPriorities";
import { NextAppointmentCard } from "../components/dashboard/NextAppointmentCard";
import { VitalsSummaryStrip } from "../components/dashboard/VitalsSummaryStrip";
import { calculatePregnancyProgress } from "../utils/pregnancyCalculation";
import { BloomAIInsightCard } from "../components/dashboard/BloomAIInsightCard";
import { JourneyDiscoveryHub } from "../components/dashboard/JourneyDiscoveryHub";
import { HealthVital, PageView } from "../types";
import {
  Siren,
  PhoneCall,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Scan,
  UserCheck,
  FileText,
  ClipboardList,
  Briefcase,
  Music,
  Volume2,
  Play,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const {
    user,
    vitals,
    medicines,
    toggleMedicineTaken,
    appointments,
    kickSessions,
    contractions,
    moodLogs,
    scanReports,
    setActivePage,
    showToast,
    addVital,
    addKickSession,
    t,
  } = useApp();

  const [isPlayingRaga, setIsPlayingRaga] = useState(false);

  // Dynamic time of day greeting
  const currentHour = new Date().getHours();
  const timeOfDayGreeting =
    currentHour < 12
      ? t("goodMorning")
      : currentHour < 18
      ? t("goodAfternoon")
      : t("goodEvening");

  // Clinical day-by-day pregnancy calculation
  const pregnancyProgress = calculatePregnancyProgress(user);
  const { currentWeek, trimester, daysRemaining, progressPercent } = pregnancyProgress;

  // 1. Kick Counter Cross-Feature Data Link: Sum today's sessions
  const todayStr = new Date().toISOString().split("T")[0];
  const todayKicksFromSessions = (kickSessions || [])
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + (s.kickCount || 0), 0);

  const todayVital = vitals[0];
  const effectiveVital: Partial<HealthVital> | undefined = todayVital
    ? {
        ...todayVital,
        babyKicksCount: Math.max(todayVital.babyKicksCount || 0, todayKicksFromSessions),
      }
    : todayKicksFromSessions > 0
    ? {
        waterMl: 2400,
        weightKg: user.prePregnancyDetails?.prePregnancyWeightKg || 64,
        babyKicksCount: todayKicksFromSessions,
      }
    : undefined;

  // 2. Interactive Quick Add Handlers for Live Presentation Demo
  const handleQuickAddKick = () => {
    const newCount = (effectiveVital?.babyKicksCount || todayKicksFromSessions || 0) + 1;
    addKickSession({
      date: todayStr,
      startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationMinutes: 15,
      kickCount: newCount,
      status: "completed",
      notes: "Quick logged from Dashboard HUD",
    });
    showToast(`Baby kick recorded! ✨ (${newCount}/10 Cardiff goal)`);
  };

  const handleQuickAddWater = (amountMl: number = 250) => {
    const currentWater = effectiveVital?.waterMl || 2400;
    const newWater = currentWater + amountMl;
    addVital({
      date: todayStr,
      timestamp: new Date().toISOString(),
      waterMl: newWater,
      weightKg: effectiveVital?.weightKg || user.prePregnancyDetails?.prePregnancyWeightKg || 64,
      babyKicksCount: effectiveVital?.babyKicksCount || todayKicksFromSessions || 8,
      systolicBp: effectiveVital?.systolicBp || 118,
      diastolicBp: effectiveVital?.diastolicBp || 76,
    });
    showToast(`Hydration logged! 💧 (+${amountMl}ml · Total: ${(newWater / 1000).toFixed(1)}L)`);
  };

  // 3. Synthesize Kalyani Raga Audio Harmonic (Web Audio API)
  const playGarbhaRagaChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      setIsPlayingRaga(true);

      const playHarmonic = (freq: number, start: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Kalyani Raga opening notes (Sa, Ri, Ga, Pa - 261.6, 293.6, 329.6, 392 Hz)
      playHarmonic(261.63, 0, 1.2, 0.35);
      playHarmonic(293.66, 0.45, 1.2, 0.28);
      playHarmonic(329.63, 0.9, 1.4, 0.28);
      playHarmonic(392.0, 1.35, 1.8, 0.22);

      setTimeout(() => {
        setIsPlayingRaga(false);
      }, 3000);
    } catch (e) {
      setIsPlayingRaga(false);
    }
  };

  // 4. Mood Tracker Cross-Feature Data Link: Read actual logged mood from MoodPage
  const latestMood = moodLogs && moodLogs.length > 0 ? moodLogs[0].mood : "Calm";

  // 5. Appointments Cross-Feature Data Link: Chronologically nearest upcoming visit
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingApt =
    [...appointments]
      .filter((a) => a.status === "upcoming" && new Date(a.appointmentDate || a.date).getTime() >= now.getTime())
      .sort((a, b) => new Date(a.appointmentDate || a.date).getTime() - new Date(b.appointmentDate || b.date).getTime())[0] ||
    appointments.find((a) => a.status === "upcoming");

  // 6. Contraction Timer Cross-Feature Data Link: 5-1-1 Rule Active Labor Check
  const recentContractions = (contractions || []).slice(0, 5);
  const contractionsWithInterval = recentContractions.filter((c) => c.intervalSeconds > 0);
  const isRule511Met =
    recentContractions.length >= 3 &&
    contractionsWithInterval.length >= 2 &&
    recentContractions.every((c) => c.durationSeconds >= 45) &&
    contractionsWithInterval.every((c) => c.intervalSeconds <= 330);

  // 7. Vitals Risk Cross-Feature Data Link: Alert whenever vitals are outside normal range
  const vitalsStatus = todayVital?.evaluation?.overallStatus || (
    todayVital?.systolicBp && todayVital?.diastolicBp
      ? (todayVital.systolicBp >= 160 || todayVital.diastolicBp >= 110
          ? "SEVERE"
          : todayVital.systolicBp >= 140 || todayVital.diastolicBp >= 90
          ? "HIGH"
          : todayVital.systolicBp > 120 || todayVital.diastolicBp > 80 || todayVital.systolicBp < 90 || todayVital.diastolicBp < 60
          ? "ATTENTION"
          : "NORMAL")
      : "NORMAL"
  );
  const requiresUrgentVitalsCare = vitalsStatus === "SEVERE" || todayVital?.evaluation?.requiresUrgentAttention;
  const isVitalsAttentionOrHigh = vitalsStatus === "HIGH" || vitalsStatus === "ATTENTION";
  const bpAlertText = todayVital?.evaluation?.bp?.statusText || (
    vitalsStatus === "SEVERE"
      ? "Severe blood pressure reading recorded. Please seek medical advice."
      : vitalsStatus === "HIGH"
      ? "High blood pressure recorded (≥140/90 mmHg). Notify your doctor."
      : "Blood pressure reading outside target reference range. Rest and monitor."
  );

  // 8. Ultrasound Scans Cross-Feature Clinical Alert: Amniotic Fluid Index (AFI)
  const latestScan = scanReports && scanReports.length > 0 ? scanReports[0] : null;
  const latestAfi = latestScan?.extractedData?.ultrasoundBiometrics?.afi?.value;
  const isAfiConcerning = typeof latestAfi === "number" && (latestAfi < 8.0 || latestAfi > 24.0);
  const afiAlertText =
    typeof latestAfi === "number" && latestAfi < 8.0
      ? `Latest ultrasound report indicates borderline low amniotic fluid (AFI: ${latestAfi} cm < 8 cm). Maintain aggressive hydration and review with Dr. ${user.doctorName || "your obstetrician"}.`
      : typeof latestAfi === "number" && latestAfi > 24.0
      ? `Latest ultrasound report indicates elevated amniotic fluid (AFI: ${latestAfi} cm > 24 cm). Clinical review recommended.`
      : "";

  // Showcase Feature Cards for Presentation
  const presentationFeatures: Array<{
    id: PageView;
    title: string;
    subtitle: string;
    icon: any;
    badge: string;
    gradient: string;
  }> = [
    {
      id: "medical-timeline",
      title: "AI Scan Analyzer",
      subtitle: "Vision OCR Extraction",
      icon: Scan,
      badge: "Gemini 2.5",
      gradient: "from-purple-500/20 to-indigo-500/20 border-purple-300/40 text-purple-700 dark:text-purple-300",
    },
    {
      id: "digital-twin",
      title: "3D Maternal Twin",
      subtitle: "Living Biometric State",
      icon: UserCheck,
      badge: "Adaptive 3D",
      gradient: "from-pink-500/20 to-rose-500/20 border-rose-300/40 text-rose-700 dark:text-rose-300",
    },
    {
      id: "reports",
      title: "Doctor Handover",
      subtitle: "1-Page Ob-Gyn Brief",
      icon: FileText,
      badge: "Clinical Dossier",
      gradient: "from-emerald-500/20 to-teal-500/20 border-emerald-300/40 text-emerald-700 dark:text-emerald-300",
    },
    {
      id: "birth-plan",
      title: "Birth Plan Studio",
      subtitle: "ACOG Labor Directives",
      icon: ClipboardList,
      badge: "Gentle C-Section",
      gradient: "from-amber-500/20 to-orange-500/20 border-amber-300/40 text-amber-700 dark:text-amber-300",
    },
    {
      id: "hospital-bag",
      title: "Hospital Go-Bag",
      subtitle: "4-Bag Packing System",
      icon: Briefcase,
      badge: "Bag Tags",
      gradient: "from-blue-500/20 to-cyan-500/20 border-blue-300/40 text-blue-700 dark:text-blue-300",
    },
    {
      id: "emergency",
      title: "Emergency Casualty",
      subtitle: "Level-IV NICU & 108",
      icon: Siren,
      badge: "24/7 Triage",
      gradient: "from-red-500/20 to-rose-500/20 border-red-300/40 text-red-700 dark:text-red-300",
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-rose-100 pb-24 pt-2 space-y-6 font-sans max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* 1. PERSONALIZED WELCOME HEADER */}
      <DashboardHeader
        user={{
          ...user,
          currentWeek,
          trimester,
          daysRemaining,
        }}
        timeOfDayGreeting={timeOfDayGreeting}
        onNavigate={setActivePage}
        t={t}
      />

      {/* 2. PRESENTATION QUICK-LAUNCH FEATURE RIBBON (FLAGSHIP DEMO SHOWCASE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-rose-300 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-pink-500" />
            <span>Presentation Showcase Deck · Core Modules</span>
          </div>
          <span className="text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-pink-200/60 dark:border-rose-900/40">
            Interactive Pitch Controls
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {presentationFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`glass-panel luxury-card-hover rounded-2xl p-3 text-left border flex flex-col justify-between space-y-2 cursor-pointer transition-all hover:scale-[1.03] group ${item.gradient}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur-md shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-tight px-1.5 py-0.5 rounded-md bg-white/60 dark:bg-white/10 shadow-2xs">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900 dark:text-rose-100 font-serif leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-rose-300/80 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE LABOR 5-1-1 TRIAGE BANNER (Connected from Contraction Timer) */}
      {isRule511Met && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-600/90 via-rose-600/90 to-pink-600/90 backdrop-blur-2xl text-white shadow-2xl border border-white/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white/20 rounded-2xl shrink-0 backdrop-blur-md">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                5-1-1 Labor Rule Detected
              </span>
              <h3 className="font-serif text-lg font-bold mt-1">Active Labor In Progress</h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Contractions are 5 minutes apart, lasting ~1 minute. Please proceed to your delivery hospital.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage("emergency")}
            className="px-6 py-2.5 bg-white text-red-600 rounded-2xl font-extrabold text-xs shadow-lg hover:bg-rose-50 shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Maternity Triage</span>
          </button>
        </div>
      )}

      {/* SEVERE BLOOD PRESSURE / VITALS EMERGENCY ALERT */}
      {!isRule511Met && requiresUrgentVitalsCare && (
        <div className="p-5 rounded-3xl glass-panel border border-rose-500/50 bg-rose-600/90 backdrop-blur-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 text-white" />
            <div>
              <div className="text-sm font-extrabold">🚨 Clinical Emergency Alert ({todayVital?.systolicBp}/{todayVital?.diastolicBp} mmHg)</div>
              <div className="text-xs opacity-95">{bpAlertText} Contact Dr. {user.doctorName || "your obstetrician"} immediately.</div>
            </div>
          </div>
          <button
            onClick={() => setActivePage("health-tracker")}
            className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold uppercase shrink-0 transition-all shadow-xs cursor-pointer"
          >
            Review Vitals
          </button>
        </div>
      )}

      {/* ATTENTION / HIGH BLOOD PRESSURE ALERT */}
      {!isRule511Met && !requiresUrgentVitalsCare && isVitalsAttentionOrHigh && (
        <div className="p-5 rounded-3xl glass-panel border border-amber-500/40 bg-amber-500/85 backdrop-blur-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 text-white" />
            <div>
              <div className="text-sm font-extrabold">⚠️ Blood Pressure Attention ({todayVital?.systolicBp}/{todayVital?.diastolicBp} mmHg)</div>
              <div className="text-xs opacity-95">{bpAlertText}</div>
            </div>
          </div>
          <button
            onClick={() => setActivePage("health-tracker")}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold uppercase shrink-0 transition-all cursor-pointer"
          >
            Review Vitals
          </button>
        </div>
      )}

      {/* ULTRASOUND BIOMARKER (AFI) CLINICAL ALERT BANNER */}
      {!isRule511Met && !requiresUrgentVitalsCare && isAfiConcerning && (
        <div className="p-5 rounded-3xl glass-panel border border-indigo-500/40 bg-indigo-950/80 backdrop-blur-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 shrink-0 text-cyan-300" />
            <div>
              <div className="text-sm font-extrabold flex items-center gap-2">
                <span>Scan Report Clinical Alert: Amniotic Fluid Index ({latestAfi} cm)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-400/20 text-cyan-200 uppercase font-bold border border-cyan-400/30">
                  {latestAfi! < 8.0 ? "Oligohydramnios Watch" : "Polyhydramnios Watch"}
                </span>
              </div>
              <div className="text-xs opacity-90 mt-0.5">{afiAlertText}</div>
            </div>
          </div>
          <button
            onClick={() => setActivePage("reports")}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-indigo-950 rounded-xl text-xs font-bold uppercase shrink-0 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
          >
            <span>Review Scan Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. PRIMARY MATERNAL BENTO GRID (HERO SECTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Fetal Progress HUD + Real-time Biometrics */}
        <div className="lg:col-span-2 space-y-6">
          <HeroFetalProgress
            currentWeek={currentWeek}
            trimester={trimester}
            daysRemaining={daysRemaining}
            progressPercent={progressPercent}
            onNavigate={setActivePage}
            t={t}
          />

          {/* Vitals Summary Strip with Quick +1 Kick and +250ml Hydration Actions */}
          <VitalsSummaryStrip
            todayVital={effectiveVital}
            selectedMood={latestMood}
            onNavigate={setActivePage}
            onQuickAddWater={handleQuickAddWater}
            onQuickAddKick={handleQuickAddKick}
            t={t}
          />
        </div>

        {/* Right 1 Column: Care Priorities + Next Visit + Garbha Sanskar Soundscape */}
        <div className="space-y-6">
          <TodaysPriorities
            medicines={medicines}
            onToggleMedicine={toggleMedicineTaken}
            onNavigate={setActivePage}
            t={t}
          />

          <NextAppointmentCard
            appointment={upcomingApt}
            onNavigate={setActivePage}
            t={t}
          />

          {/* Daily Garbha Sanskar & Therapeutic Soundscape Card */}
          <div className="glass-panel luxury-card-hover rounded-3xl p-5 space-y-3.5 border border-pink-200/50 dark:border-rose-900/40 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-pink-100/60 dark:border-rose-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-pink-100 dark:bg-rose-950/80 text-pink-600">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-gray-900 dark:text-rose-100">
                    Garbha Sanskar Audio
                  </span>
                  <span className="text-[10px] text-rose-500 font-semibold ml-1.5">
                    Kalyani Raga
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 dark:bg-rose-950 text-pink-600 dark:text-rose-300">
                432 Hz
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-rose-200/90 italic">
              "My body knows exactly how to nourish, protect, and birth my baby."
            </p>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[10px] text-gray-500 dark:text-rose-300/70">
                Fetal sensory stimulation & relaxation
              </div>

              <button
                onClick={playGarbhaRagaChime}
                disabled={isPlayingRaga}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isPlayingRaga
                    ? "bg-pink-600 text-white animate-pulse"
                    : "bg-pink-50 dark:bg-rose-950/80 hover:bg-pink-100 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-rose-800"
                }`}
              >
                {isPlayingRaga ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Chiming...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Tone</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BLOOM AI CONTEXTUAL INSIGHT */}
      <BloomAIInsightCard
        currentWeek={user.currentWeek}
        onNavigate={setActivePage}
        t={t}
      />

      {/* 5. MY DIGITAL TWIN (ADAPTIVE 3D MATERNAL TWIN) */}
      <div className="p-6 rounded-3xl glass-panel luxury-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/15 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-300/40">
                Flagship Innovation · 3D Living State
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Week {user.currentWeek || 24} Journey
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-rose-100 font-serif">
              My Digital Twin
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 max-w-xl">
              An adaptive 3D maternal avatar connected directly to your logged health vitals, symptoms, sleep, and emotional wellbeing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActivePage("digital-twin")}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105"
        >
          <span>Open 3D Twin View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6. JOURNEY DISCOVERY HUB */}
      <JourneyDiscoveryHub
        journey={user.currentJourney}
        currentWeek={user.currentWeek}
        onNavigate={setActivePage}
        t={t}
      />
    </div>
  );
};

export default DashboardPage;

