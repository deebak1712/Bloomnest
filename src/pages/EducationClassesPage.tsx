import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { 
  ANTENATAL_MASTERCLASSES, 
  ANTENATAL_ARTICLES, 
  ANTENATAL_QUIZ_QUESTIONS, 
  ANTENATAL_DOULA_FAQS,
  LOCAL_STORAGE_KEY_EDUCATION_PROGRESS,
  AntenatalMasterclass,
  AntenatalChapter,
  AntenatalArticle,
  AntenatalQuizQuestion
} from "../data/educationClassesData";
import { 
  GraduationCap, BookOpen, Award, CheckCircle2, Circle, 
  Sparkles, ChevronRight, Clock, UserCheck, Stethoscope, 
  HelpCircle, Printer, X, Heart, ShieldCheck, Play, 
  BookMarked, FileText, Share2, Check, ArrowRight, Lightbulb
} from "lucide-react";

export const EducationClassesPage: React.FC = () => {
  const { user, showToast, t } = useApp();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<"classes" | "articles" | "quiz" | "faqs">("classes");

  // Progress state (completed chapter IDs)
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_EDUCATION_PROGRESS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedChapters)) return parsed.completedChapters;
      }
    } catch (e) {}
    return ["c1-1", "c1-2", "c2-1"]; // initial demo progress
  });

  // Active Masterclass Modal
  const [activeClassModal, setActiveClassModal] = useState<AntenatalMasterclass | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Active Article Reader Modal
  const [activeArticleModal, setActiveArticleModal] = useState<AntenatalArticle | null>(null);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_EDUCATION_PROGRESS,
        JSON.stringify({
          completedChapters,
          selectedAnswers,
          hasPassed: calculateScore() >= 8
        })
      );
    } catch (e) {
      console.error("Failed to persist education progress", e);
    }
  }, [completedChapters, selectedAnswers]);

  // Overall class completion calculation
  const totalChaptersCount = useMemo(() => {
    return ANTENATAL_MASTERCLASSES.reduce((acc, cls) => acc + cls.chapters.length, 0);
  }, []);

  const completedChaptersCount = completedChapters.length;
  const overallProgressPct = Math.round((completedChaptersCount / totalChaptersCount) * 100);

  // Toggle chapter completion
  const toggleChapterComplete = (chapterId: string) => {
    setCompletedChapters((prev) => {
      const exists = prev.includes(chapterId);
      const updated = exists ? prev.filter((id) => id !== chapterId) : [...prev, chapterId];
      showToast(exists ? "Chapter marked incomplete." : "Chapter marked complete! 🌸");
      return updated;
    });
  };

  // Quiz logic
  const handleSelectOption = (qId: number, optIdx: number) => {
    if (showResults) return; // locked after submission
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    ANTENATAL_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  const quizScore = calculateScore();
  const quizPassed = quizScore >= 8; // 80% passing grade for certification

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* ── Screen Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>ACOG & Lamaze Perinatal Curriculum</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-rose-100 mt-1">
            Childbirth Education Center & Masterclasses
          </h1>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-rose-300 mt-1">
            Week {user?.currentWeek || 24} · Evidence-based labor physiology, non-pharmacological comfort toolkit, newborn golden hour, and official certification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {quizPassed && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>View Official Certificate</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white p-3 rounded-2xl shadow-md">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-rose-200">Curriculum Progress</div>
              <div className="font-serif text-2xl font-extrabold">{overallProgressPct}%</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center font-bold text-xs bg-white/10">
              {completedChaptersCount}/{totalChaptersCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── Studio Navigation Tabs ── */}
      <div className="flex flex-wrap gap-2 text-xs font-bold border-b border-rose-100 dark:border-rose-900/30 pb-2">
        <button
          onClick={() => setActiveTab("classes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === "classes"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Antenatal Masterclasses ({ANTENATAL_MASTERCLASSES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === "articles"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Clinical Knowledge Base ({ANTENATAL_ARTICLES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === "quiz"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certification Quiz ({quizPassed ? "Certified ✓" : "10 Questions"})</span>
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all ${
            activeTab === "faqs"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-white dark:bg-[#1a1523] border border-rose-100 dark:border-rose-900/40 text-gray-700 dark:text-rose-200 hover:bg-rose-50"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Antenatal & Doula FAQs</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: ANTENATAL MASTERCLASSES                                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "classes" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ANTENATAL_MASTERCLASSES.map((cls) => {
              const classCompletedChapters = cls.chapters.filter((c) => completedChapters.includes(c.id)).length;
              const classPct = Math.round((classCompletedChapters / cls.chapters.length) * 100);

              return (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {cls.classNumber}
                      </span>
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {cls.totalDurationMins} Mins
                      </span>
                    </div>

                    <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 leading-snug">
                      {cls.title}
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-rose-300 leading-relaxed">
                      {cls.subtitle}
                    </p>

                    <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-rose-900/20 text-xs">
                      <div className="flex justify-between font-bold text-[11px] text-gray-700 dark:text-rose-200">
                        <span>Class Progress</span>
                        <span className="text-rose-500">{classCompletedChapters}/{cls.chapters.length} Chapters</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-rose-950/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${classPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Syllabus Modules:
                      </span>
                      {cls.chapters.map((ch, idx) => {
                        const isDone = completedChapters.includes(ch.id);
                        return (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between text-xs text-gray-700 dark:text-rose-200"
                          >
                            <span className="truncate max-w-[200px] flex items-center gap-1.5">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              )}
                              <span className={isDone ? "line-through text-gray-400" : ""}>{ch.title}</span>
                            </span>
                            <span className="text-[10px] text-gray-400">{ch.durationMins}m</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveClassModal(cls);
                      setActiveChapterIndex(0);
                    }}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Open Masterclass Player</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: CLINICAL KNOWLEDGE BASE (ARTICLES)                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ANTENATAL_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {art.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {art.readTime}
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-gray-500 dark:text-rose-300 leading-relaxed">
                  {art.snippet}
                </p>

                <div className="p-3 rounded-2xl bg-gray-50/60 dark:bg-black/20 border border-gray-100 dark:border-rose-900/20 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Key Clinical Takeaways:</span>
                  <ul className="space-y-1 text-gray-700 dark:text-rose-200">
                    {art.keyHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                <span className="text-[11px] text-gray-400 italic">By {art.author}</span>
                <button
                  onClick={() => setActiveArticleModal(art)}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: CERTIFICATION QUIZ                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "quiz" && (
        <div className="bg-white dark:bg-[#1a1523] p-6 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>ACOG Antenatal Competency Evaluation</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-rose-100 mt-0.5">
                Childbirth Preparation Certification Quiz
              </h2>
              <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
                Score 80% (8/10) or higher to unlock and download your official BloomNest Childbirth Preparation Certificate of Completion.
              </p>
            </div>

            {showResults && (
              <div className="flex items-center gap-3 shrink-0">
                <div className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm ${
                  quizPassed ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                }`}>
                  <Award className="w-4 h-4" />
                  <span>Score: {quizScore} / {ANTENATAL_QUIZ_QUESTIONS.length} ({quizScore * 10}%)</span>
                </div>

                {quizPassed && (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 animate-bounce"
                  >
                    <span>Print Certificate 🏆</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quiz Question Cards */}
          <div className="space-y-6">
            {ANTENATAL_QUIZ_QUESTIONS.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const selectedIdx = selectedAnswers[q.id];
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    showResults
                      ? isCorrect
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                        : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                      : "bg-gray-50/50 dark:bg-[#16111f] border-gray-100 dark:border-rose-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="font-bold text-sm text-gray-900 dark:text-rose-100">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-200 dark:bg-rose-950/60 text-gray-700 dark:text-rose-300 shrink-0">
                      {q.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      const isOptionCorrect = q.correctIndex === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={showResults}
                          className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                            showResults
                              ? isOptionCorrect
                                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                                : isOptionSelected
                                ? "bg-rose-600 text-white border-rose-700"
                                : "bg-white/60 dark:bg-black/30 text-gray-600 dark:text-rose-300/60 opacity-60"
                              : isOptionSelected
                              ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                              : "bg-white dark:bg-[#1a1523] border-gray-200 dark:border-rose-900/30 text-gray-800 dark:text-rose-200 hover:border-rose-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#130f1c] border border-gray-100 dark:border-rose-900/30 text-xs space-y-1">
                      <div className="font-bold text-gray-900 dark:text-rose-100 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Clinical Explanation:</span>
                      </div>
                      <p className="text-gray-600 dark:text-rose-300 leading-relaxed">
                        {q.explanation}
                      </p>
                      <div className="text-[10px] text-gray-400 italic pt-1">
                        Guideline Reference: {q.clinicalGuideline}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500 dark:text-rose-300">
              {Object.keys(selectedAnswers).length} of {ANTENATAL_QUIZ_QUESTIONS.length} Questions Answered
            </span>

            <button
              onClick={() => {
                if (Object.keys(selectedAnswers).length < ANTENATAL_QUIZ_QUESTIONS.length) {
                  showToast("Please answer all questions before submitting! 📝");
                  return;
                }
                setShowResults(true);
                showToast("Quiz evaluated! Check your clinical score. 🏆");
              }}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              Submit & Evaluate Score
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: ANTENATAL & DOULA FAQS                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 to-rose-50 dark:from-[#1b1527] dark:to-[#171120] border border-purple-100 dark:border-purple-900/30">
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-purple-100">
              Frequently Asked Childbirth & Hospital Room Questions
            </h2>
            <p className="text-xs text-gray-600 dark:text-purple-200 mt-1">
              Curated by senior Indian hospital labor ward nurses and certified doulas.
            </p>
          </div>

          <div className="space-y-3">
            {ANTENATAL_DOULA_FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1a1523] p-5 rounded-2xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-sm text-gray-900 dark:text-rose-100 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-gray-600 dark:text-rose-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MASTERCLASS PLAYER MODAL                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeClassModal && (() => {
        const curChapter = activeClassModal.chapters[activeChapterIndex];
        const isChapterDone = completedChapters.includes(curChapter.id);

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a1523] w-full max-w-3xl rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-5 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between bg-rose-50/50 dark:bg-[#15101d]">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                    {activeClassModal.classNumber} · {activeClassModal.level}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-0.5">
                    {activeClassModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveClassModal(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-rose-950/60 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chapter Tabs Strip */}
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-rose-900/20 overflow-x-auto text-xs">
                {activeClassModal.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      activeChapterIndex === idx
                        ? "bg-rose-500 text-white shadow-xs"
                        : "bg-white dark:bg-[#1e1728] text-gray-700 dark:text-rose-200 border border-gray-200 dark:border-rose-900/40"
                    }`}
                  >
                    {completedChapters.includes(ch.id) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-current text-[9px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                    <span>{ch.title}</span>
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-gray-900 dark:text-rose-100">
                    Chapter {activeChapterIndex + 1}: {curChapter.title}
                  </h4>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {curChapter.durationMins} Mins
                  </span>
                </div>

                <p className="text-xs text-gray-700 dark:text-rose-200 leading-relaxed bg-rose-50/30 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                  {curChapter.summary}
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-rose-200 uppercase tracking-wider">
                    Core Learning Points:
                  </span>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-rose-300">
                    {curChapter.learningPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 bg-gray-50/60 dark:bg-black/20 p-2.5 rounded-xl border border-gray-100 dark:border-rose-900/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Partner Coaching Cue Callout */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>Birth Partner Real-Time Coaching Cue:</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    {curChapter.partnerCoachingCue}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-rose-100 dark:border-rose-900/30 bg-gray-50 dark:bg-[#15101d] flex items-center justify-between">
                <button
                  onClick={() => toggleChapterComplete(curChapter.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isChapterDone
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white dark:bg-[#1e1728] border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-300 hover:bg-rose-50"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isChapterDone ? "Completed ✓" : "Mark Chapter Complete"}</span>
                </button>

                <div className="flex items-center gap-2">
                  {activeChapterIndex > 0 && (
                    <button
                      onClick={() => setActiveChapterIndex(activeChapterIndex - 1)}
                      className="px-3 py-2 rounded-xl border border-gray-200 dark:border-rose-900/40 text-xs font-semibold text-gray-600 dark:text-rose-300"
                    >
                      Previous
                    </button>
                  )}

                  {activeChapterIndex < activeClassModal.chapters.length - 1 ? (
                    <button
                      onClick={() => setActiveChapterIndex(activeChapterIndex + 1)}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <span>Next Chapter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveClassModal(null);
                        showToast("Class finished! Excellent progress 🌸");
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                    >
                      Finish Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ARTICLE READER MODAL                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1523] w-full max-w-3xl rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between bg-rose-50/50 dark:bg-[#15101d]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                  {activeArticleModal.category} · {activeArticleModal.readTime}
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-rose-100 mt-0.5">
                  {activeArticleModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-rose-950/60 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-gray-700 dark:text-rose-200 leading-relaxed whitespace-pre-line">
              <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-900 dark:text-blue-300">
                <strong>Clinical Guideline Reference:</strong> {activeArticleModal.evidenceSource}
              </div>

              <div>{activeArticleModal.content.trim()}</div>
            </div>

            <div className="p-4 border-t border-rose-100 dark:border-rose-900/30 bg-gray-50 dark:bg-[#15101d] flex justify-between items-center text-xs">
              <span className="text-gray-400 italic">Author: {activeArticleModal.author}</span>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CERTIFICATE MODAL                                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 w-full max-w-2xl rounded-3xl border-4 border-amber-300 shadow-2xl p-8 space-y-6 relative print:border-none print:shadow-none">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden"
            >
              ✕ Close
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest">
                <Award className="w-4 h-4 text-amber-600" />
                BloomNest Antenatal Perinatal Academy
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-wide text-gray-900">
                Certificate of Childbirth Preparation
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                Competency in Labor Stages, Somatic Breathing & Newborn Golden Hour
              </p>
            </div>

            {/* Certificate Recipient */}
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">This officially certifies that</p>
              <h3 className="font-serif text-3xl font-bold text-rose-600 underline decoration-amber-300 underline-offset-8">
                {user?.name || "Priya S."}
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto pt-2 leading-relaxed">
                has successfully completed the comprehensive clinical curriculum, non-pharmacological labor pain toolkit, and scored <strong>{quizScore * 10}%</strong> on the ACOG Childbirth Readiness Competency Evaluation.
              </p>
            </div>

            {/* Certificate Details Grid */}
            <div className="grid grid-cols-3 gap-3 text-center border-t border-b border-gray-200 py-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Gestational Stage</span>
                <span className="font-bold">Week {user?.currentWeek || 24}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Issue Date</span>
                <span className="font-bold">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Verification Code</span>
                <span className="font-mono font-bold text-purple-600">BN-AC-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-4 text-xs">
              <div className="text-center">
                <div className="w-36 border-b border-gray-400 pb-1 font-serif italic font-bold">
                  Dr. Priya Sharma
                </div>
                <span className="text-[10px] text-gray-500">Lead Obstetric Educator</span>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center font-bold text-[9px] uppercase text-amber-700 bg-amber-50 text-center leading-tight">
                Verified Clinical Seal
              </div>

              <div className="text-center">
                <div className="w-36 border-b border-gray-400 pb-1 font-serif italic font-bold">
                  Ananya Nair
                </div>
                <span className="text-[10px] text-gray-500">Certified Doula Director</span>
              </div>
            </div>

            {/* Print Trigger */}
            <div className="pt-4 flex justify-center print:hidden">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
