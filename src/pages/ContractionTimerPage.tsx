import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  BRAXTON_HICKS_VS_TRUE_LABOR,
  LABOR_PHASES_INFO,
  ACOG_RED_FLAGS,
  PARTNER_COMFORT_TECHNIQUES,
  evaluateLaborTriage,
} from "../data/contractionLaborData";
import {
  playContractionStartChime,
  playContractionPeakReleaseChime,
} from "../utils/contractionWaveSound";
import {
  Clock,
  Play,
  Square,
  AlertTriangle,
  Activity,
  Heart,
  PhoneCall,
  ShieldCheck,
  Info,
  CheckCircle2,
  Siren,
  Sparkles,
  HelpCircle,
  Users,
  Compass,
  Waves,
  Briefcase,
  ChevronRight,
  Droplets,
  HeartHandshake,
} from "lucide-react";

export const ContractionTimerPage: React.FC = () => {
  const { contractions, addContraction, setActivePage, showToast, user, t } = useApp();
  const currentWeek = user.currentWeek || 24;
  const isPreterm = currentWeek < 37;
  const doctorName = user.doctorName || "Dr. Ananya Sharma, MD (OB-GYN)";
  const hospitalName = user.hospitalName || "Cloudnine Maternal Hospital";

  // Active Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [intensity, setIntensity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [painLocation, setPainLocation] = useState<"lower_abdomen" | "lower_back_radiating" | "pelvic_groin">("lower_abdomen");
  const [lastContractionStart, setLastContractionStart] = useState<number | null>(null);
  const [lastEndTime, setLastEndTime] = useState<Date | null>(null);
  const [peakChimePlayed, setPeakChimePlayed] = useState(false);

  // Modals State
  const [showBraxtonModal, setShowBraxtonModal] = useState(false);
  const [showRedFlagsModal, setShowRedFlagsModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showPhasesModal, setShowPhasesModal] = useState(false);

  // Triage Assessment Engine
  const triage = evaluateLaborTriage(contractions, currentWeek);

  // Timer Tick & Somatic Wave Chime
  useEffect(() => {
    let interval: any = null;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const secs = Math.floor((Date.now() - startTime) / 1000);
        setDurationSeconds(secs);

        // Somatic peak release chime around 35-40s (typical contraction peak)
        if (secs >= 38 && !peakChimePlayed) {
          playContractionPeakReleaseChime();
          setPeakChimePlayed(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, peakChimePlayed]);

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setDurationSeconds(0);
    setPeakChimePlayed(false);
    playContractionStartChime();

    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(50); } catch (_) {}
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    const now = new Date();
    const currentStart = startTime || Date.now() - durationSeconds * 1000;

    // Interval is measured start-to-start according to clinical obstetrics
    let interval = 0;
    if (lastContractionStart) {
      interval = Math.max(0, Math.round((currentStart - lastContractionStart) / 1000));
    } else if (lastEndTime) {
      interval = Math.max(0, Math.round((currentStart - lastEndTime.getTime()) / 1000));
    }

    addContraction({
      date: now.toISOString().split("T")[0],
      startTime: new Date(currentStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationSeconds: Math.max(1, durationSeconds),
      intervalSeconds: interval,
      intensity,
      painLocation,
      isBraxtonHicksSuspected: painLocation === "lower_abdomen" && intensity === "mild",
      laborPhase: durationSeconds >= 50 && interval <= 330 ? "active" : "latent",
    });

    setLastContractionStart(currentStart);
    setLastEndTime(now);
    setDurationSeconds(0);
    setPeakChimePlayed(false);
    showToast("Contraction logged successfully!");
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Breath pacing calculation for visual wave (10s full breath cycle: 4s in, 6s out)
  const breathCycleSecs = durationSeconds % 10;
  const isExhalePhase = breathCycleSecs >= 4;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Labor Triage & Contraction Studio
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                isPreterm ? "bg-amber-300 text-slate-950" : "bg-emerald-300 text-slate-950"
              }`}>
                Week {currentWeek} • {isPreterm ? "Preterm Monitoring (<37w)" : "Full-Term Labor Window (37w+)"}
              </span>
            </div>

            <button
              onClick={() => setShowRedFlagsModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-red-500/80 hover:bg-red-600 border border-white/30 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md"
            >
              <Siren className="w-4 h-4" />
              <span>ACOG Emergency Red-Flags</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Maternal Contraction Studio & Labor Triage ⏱️
            </h1>
            <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
              Track start-to-start contraction intervals, monitor active labor 5-1-1 milestones, ride uterine waves with somatic breathing, and distinguish practice Braxton Hicks from progressive labor.
            </p>
          </div>

          {/* Quick Doctor & Hospital Routing */}
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <span className="font-bold text-white">Designated Labor Room: </span>
                <span className="text-rose-100">{hospitalName} • {doctorName}</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage("emergency")}
              className="px-4 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-black text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Speed Dial Delivery Room</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CLINICAL LABOR TRIAGE BANNER */}
      <section className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all ${
        triage.status === "PRETERM_LABOR_ALERT"
          ? "bg-red-600 text-white border-red-700 animate-pulse"
          : triage.status === "ACTIVE_LABOR_511_MET"
          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-700"
          : triage.status === "EARLY_LATENT_LABOR"
          ? "bg-amber-500 text-white border-amber-600"
          : "bg-teal-600 text-white border-teal-700"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-white/20 shrink-0 mt-0.5">
              {triage.isUrgent ? <AlertTriangle className="w-6 h-6 text-white" /> : <ShieldCheck className="w-6 h-6 text-white" />}
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider">
                {triage.badge}
              </span>
              <h3 className="text-lg font-black tracking-tight">{triage.title}</h3>
              <p className="text-xs opacity-95 max-w-3xl leading-relaxed">
                {triage.description}
              </p>
            </div>
          </div>

          <div className="sm:self-center shrink-0">
            {triage.status === "ACTIVE_LABOR_511_MET" ? (
              <button
                onClick={() => setActivePage("hospital-bag")}
                className="px-5 py-2.5 rounded-2xl bg-white text-rose-700 font-black text-xs shadow-md hover:bg-rose-50 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Check Hospital Bag</span>
              </button>
            ) : triage.isUrgent ? (
              <button
                onClick={() => setActivePage("emergency")}
                className="px-5 py-2.5 rounded-2xl bg-white text-red-700 font-black text-xs shadow-md hover:bg-red-50 flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Triage Line</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPhasesModal(true)}
                className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Info className="w-4 h-4" />
                <span>Labor Phases Guide</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/20 text-xs font-semibold flex items-center gap-2">
          <span>Clinical Recommendation:</span>
          <span className="font-bold underline">{triage.recommendedAction}</span>
        </div>
      </section>

      {/* 3. MAIN CONTRACTION WAVE STAGE */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white shadow-2xl flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden border border-purple-800/40">
        <div className="text-xs font-black px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md flex items-center gap-2 text-purple-200">
          <Clock className="w-4 h-4 text-amber-300" />
          <span>{isRunning ? "CONTRACTION IN PROGRESS (RIDE THE WAVE)" : "READY FOR NEXT CONTRACTION"}</span>
        </div>

        {/* Somatic Contraction Wave Visualizer */}
        <div className="w-full max-w-md space-y-2">
          <div className="relative h-24 bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
            {/* Wave Curve Graphic */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path
                d="M 0,80 Q 100,80 150,50 Q 200,10 250,50 Q 300,80 400,80"
                fill="none"
                stroke="rgba(244, 63, 94, 0.6)"
                strokeWidth="4"
              />
              {isRunning && (
                <path
                  d="M 0,80 Q 100,80 150,50 Q 200,10 250,50 Q 300,80 400,80"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="6"
                  strokeDasharray="400"
                  strokeDashoffset={Math.max(0, 400 - (durationSeconds / 60) * 400)}
                />
              )}
            </svg>

            {/* Central Time Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {formatSecs(durationSeconds)}
              </span>
              {isRunning && (
                <span className="text-[10px] uppercase font-black tracking-widest text-amber-300">
                  {durationSeconds < 35 ? "Rising to Peak..." : "Descending / Release Phase"}
                </span>
              )}
            </div>
          </div>

          {/* Somatic Breath Guide During Wave */}
          {isRunning && (
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs flex items-center justify-center gap-2 animate-pulse">
              <Waves className="w-4 h-4 text-teal-300" />
              <span>
                <strong>Somatic Pacing: </strong>
                {isExhalePhase ? "Long slow sigh exhale through soft lips (6s)..." : "Deep diaphragmatic inhale (4s)..."}
              </span>
            </div>
          )}
        </div>

        {/* Intensity & Pain Location Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
          {/* Intensity Selector */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/15">
            <span className="text-purple-200 font-bold px-2">Intensity:</span>
            {(["mild", "moderate", "severe"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setIntensity(lvl)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition-all ${
                  intensity === lvl
                    ? "bg-rose-500 text-white shadow-md scale-105"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Pain Location Selector */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/15">
            <span className="text-purple-200 font-bold px-2">Location:</span>
            {[
              { id: "lower_abdomen", label: "Abdomen" },
              { id: "lower_back_radiating", label: "Back Radiating" },
              { id: "pelvic_groin", label: "Groin" },
            ].map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setPainLocation(loc.id as any)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  painLocation === loc.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start / Stop Giant Button */}
        <button
          onClick={isRunning ? handleStop : handleStart}
          className={`w-60 sm:w-64 py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl transition-transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer ${
            isRunning
              ? "bg-red-600 text-white hover:bg-red-700 animate-pulse ring-4 ring-red-500/50"
              : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white hover:scale-105"
          }`}
        >
          {isRunning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? "Stop & Save Wave" : "Start Contraction"}</span>
        </button>
      </section>

      {/* 4. CLINICAL TOOLS DECK (BRAXTON HICKS & PARTNER SUPPORT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Braxton Hicks Diagnostic */}
        <div
          onClick={() => setShowBraxtonModal(true)}
          className="p-6 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm cursor-pointer hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
              Braxton Hicks vs True Labor
            </h3>
            <p className="text-xs text-slate-500 dark:text-rose-300 leading-relaxed">
              Wondering if it's practice false labor or active progression? Review the 5-point clinical differential matrix.
            </p>
          </div>
          <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1 pt-2">
            <span>Check diagnostic criteria</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 2: Partner Comfort Support */}
        <div
          onClick={() => setShowPartnerModal(true)}
          className="p-6 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm cursor-pointer hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
              Partner Comfort Deck
            </h3>
            <p className="text-xs text-slate-500 dark:text-rose-300 leading-relaxed">
              Actionable doula & partner techniques: Sacral counter-pressure, double hip squeeze, and jaw release cues.
            </p>
          </div>
          <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 pt-2">
            <span>View partner comfort cues</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Card 3: Labor Room Readiness */}
        <div
          onClick={() => setActivePage("hospital-bag")}
          className="p-6 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm cursor-pointer hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-rose-100">
              Hospital Bag & Birth Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-rose-300 leading-relaxed">
              Ensure delivery suitcase, maternal ID, baby clothes, and your signed Birth Plan are packed and by the door.
            </p>
          </div>
          <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300 flex items-center gap-1 pt-2">
            <span>Open checklist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 5. VELOCITY & FREQUENCY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Duration</span>
          <div className="text-2xl font-black text-slate-900 dark:text-rose-100">
            {triage.avgDurationSec} <span className="text-xs font-normal text-slate-500">seconds</span>
          </div>
          <p className="text-[11px] text-slate-500">Target for active labor: 50 – 70s</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Frequency (Interval)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-rose-100">
            {triage.avgIntervalSec > 0 ? (triage.avgIntervalSec / 60).toFixed(1) : "--"}{" "}
            <span className="text-xs font-normal text-slate-500">mins apart</span>
          </div>
          <p className="text-[11px] text-slate-500">Measured start-to-start</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1a1420] border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Logged Waves</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {contractions.length}{" "}
            <span className="text-xs font-normal text-slate-500">contractions</span>
          </div>
          <p className="text-[11px] text-slate-500">Recent sequence documented</p>
        </div>
      </div>

      {/* 6. HISTORICAL CONTRACTIONS LIST */}
      <section className="bg-white dark:bg-[#1a1420] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-rose-100">
              Documented Contraction Timeline
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {contractions.length} Recorded Waves
          </span>
        </div>

        {contractions.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-rose-200">
              No Contraction Waves Logged Yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap "Start Contraction" as soon as your uterine tightening begins.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contractions.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 dark:text-rose-100 text-sm">
                      {formatSecs(c.durationSeconds)} Duration
                    </span>
                    <span className="text-slate-500 font-bold">
                      {c.intervalSeconds > 0
                        ? `• ~${Math.round(c.intervalSeconds / 60)} mins apart`
                        : "• First wave of session"}
                    </span>
                    {c.painLocation && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold capitalize">
                        {c.painLocation.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-rose-400">
                    Logged {c.date} at {c.startTime}
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-300 italic pt-0.5">
                      "{c.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-full font-black text-[10px] uppercase ${
                      c.intensity === "severe"
                        ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                        : c.intensity === "moderate"
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                        : "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300"
                    }`}
                  >
                    {c.intensity} Peak
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* MODAL: BRAXTON HICKS VS TRUE LABOR */}
      {/* ========================================== */}
      {showBraxtonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-900/50 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                  Braxton Hicks vs True Labor: Diagnostic Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300">
                  Clinical criteria to help you understand if your contractions are practice or progress.
                </p>
              </div>
              <button
                onClick={() => setShowBraxtonModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {BRAXTON_HICKS_VS_TRUE_LABOR.map((row, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <span className="font-black text-slate-900 dark:text-rose-100 text-xs block">
                    {row.parameter}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                      <strong className="text-amber-800 dark:text-amber-300 block mb-0.5">
                        Braxton Hicks (Practice):
                      </strong>
                      <span className="text-slate-700 dark:text-rose-200">{row.braxtonHicks}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                      <strong className="text-emerald-800 dark:text-emerald-300 block mb-0.5">
                        True Labor (Progression):
                      </strong>
                      <span className="text-slate-700 dark:text-rose-200">{row.trueLabor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowBraxtonModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: PARTNER COMFORT DECK */}
      {/* ========================================== */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-900/50 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-rose-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>Partner & Companion Labor Cues</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300">
                  Concrete comfort measures your birth companion can perform during active waves.
                </p>
              </div>
              <button
                onClick={() => setShowPartnerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {PARTNER_COMFORT_TECHNIQUES.map((tech, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5"
                >
                  <span className="text-2xl mt-0.5">{tech.emoji}</span>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-extrabold text-slate-900 dark:text-rose-100 text-sm">
                      {tech.title}
                    </h4>
                    <p className="text-slate-600 dark:text-rose-300 leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPartnerModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
              >
                Close Partner Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ACOG RED-FLAGS */}
      {/* ========================================== */}
      {showRedFlagsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-red-300 dark:border-red-900/60 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-red-200 dark:border-red-900/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                    ACOG Immediate Red-Flag Labor Alerts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-rose-300">
                    Seek immediate emergency obstetric care if any of the following occur.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRedFlagsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {ACOG_RED_FLAGS.map((rf, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-1"
                >
                  <span className="font-black text-red-900 dark:text-red-200 block text-xs">
                    ⚠️ {rf.title}
                  </span>
                  <p className="text-slate-700 dark:text-rose-200 leading-relaxed">
                    {rf.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Maternity Hospital</span>
                <p className="text-xs font-black text-slate-900 dark:text-rose-100">
                  {hospitalName} • {doctorName}
                </p>
              </div>

              <button
                onClick={() => setActivePage("emergency")}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hospital Delivery Room</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRedFlagsModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-rose-200 font-bold text-xs"
              >
                Close Alerts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: LABOR PHASES GUIDE */}
      {/* ========================================== */}
      {showPhasesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1420] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 dark:border-rose-900/50 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-rose-100 dark:border-rose-900/30 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-rose-100">
                  Labor Phases Clinical Guide
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-300">
                  Understanding dilation, contraction timing, and when to head to the hospital.
                </p>
              </div>
              <button
                onClick={() => setShowPhasesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {LABOR_PHASES_INFO.map((phase, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 dark:text-rose-100 text-sm">
                      {phase.phase}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                      {phase.tag}
                    </span>
                  </div>
                  <p className="font-bold text-rose-600 dark:text-rose-400 text-[11px]">
                    Timing: {phase.timing}
                  </p>
                  <p className="text-slate-600 dark:text-rose-300">
                    <strong>Sensations: </strong>{phase.sensations}
                  </p>
                  <p className="text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 p-2 rounded-xl border border-teal-200 dark:border-teal-900/40">
                    <strong>Action: </strong>{phase.guidance}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPhasesModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
