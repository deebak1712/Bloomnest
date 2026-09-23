import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { JournalEntry, JournalCategory } from "../types";
import {
  GUIDED_PROMPTS,
  MILESTONE_CATALOG,
  MOOD_PALETTE,
  PRESET_AVATARS,
  KEEPSAKE_COVER_QUOTES,
  GuidedPrompt,
} from "../data/journalKeepsakeData";
import {
  BookOpen,
  Plus,
  Heart,
  Sparkles,
  Image as ImageIcon,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  Mic,
  Square,
  Play,
  Pause,
  Printer,
  Search,
  Calendar,
  X,
  Volume2,
  Smile,
  Check,
  ZoomIn,
  Feather,
  UploadCloud,
  ChevronDown,
} from "lucide-react";

export const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, user, setActivePage, t } = useApp();
  const currentWeek = Math.max(1, Math.min(40, user?.currentWeek || 20));
  const fetalImage = `/assets/cinematic/fetus_week_${currentWeek}.jpg`;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrimester, setSelectedTrimester] = useState<"all" | "1" | "2" | "3">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | JournalCategory | "voice">("all");
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);

  // Modal State: Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(user.currentWeek || 20);
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<JournalCategory>("milestone");
  const [milestoneTag, setMilestoneTag] = useState<string>("");
  const [mood, setMood] = useState<string>("Overjoyed & Blessed");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [audioNoteUrl, setAudioNoteUrl] = useState<string>("");
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number>(0);
  const [promptQuestion, setPromptQuestion] = useState<string>("");

  // UI Drawer / Helpers in Modal
  const [showPromptDrawer, setShowPromptDrawer] = useState(false);
  const [showPresetStickers, setShowPresetStickers] = useState(false);

  // Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Playback in Cards
  const [activePlayingAudioId, setActivePlayingAudioId] = useState<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox Preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Keepsake Print View Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Delete Confirmation Modal
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setContent("");
    setWeekNumber(user.currentWeek || 20);
    setEntryDate(new Date().toISOString().split("T")[0]);
    setCategory("milestone");
    setMilestoneTag("");
    setMood("Overjoyed & Blessed");
    setIsPrivate(false);
    setImageUrl("");
    setAudioNoteUrl("");
    setAudioDurationSeconds(0);
    setPromptQuestion("");
    setEditingEntryId(null);
    setShowPromptDrawer(false);
    setShowPresetStickers(false);
    stopRecording(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setWeekNumber(entry.weekNumber);
    setEntryDate(entry.date);
    setCategory(entry.category || "general");
    setMilestoneTag(entry.milestoneTag || "");
    setMood(entry.mood || "Overjoyed & Blessed");
    setIsPrivate(entry.isPrivate || false);
    setImageUrl(entry.imageUrl || "");
    setAudioNoteUrl(entry.audioNoteUrl || "");
    setAudioDurationSeconds(entry.audioDurationSeconds || 0);
    setPromptQuestion(entry.promptQuestion || "");
    setIsModalOpen(true);
  };

  // Image File Compression to Base64
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageFile(file);
      setImageUrl(compressedDataUrl);
    } catch (err) {
      console.error("Failed to compress image:", err);
    }
  };

  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          resolve(compressed);
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Voice Memo Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioNoteUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone permission was denied or is not available. Please allow microphone access to record voice letters.");
    }
  };

  const stopRecording = (save = true) => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (save) {
        setAudioDurationSeconds(recordingSeconds);
      }
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingEntryId !== null) {
      updateJournalEntry(editingEntryId, {
        title,
        content,
        date: entryDate,
        weekNumber,
        category,
        milestoneTag: milestoneTag || undefined,
        mood,
        isPrivate,
        imageUrl: imageUrl || undefined,
        audioNoteUrl: audioNoteUrl || undefined,
        audioDurationSeconds: audioDurationSeconds || undefined,
        promptQuestion: promptQuestion || undefined,
      });
    } else {
      addJournalEntry({
        title,
        content,
        date: entryDate,
        weekNumber,
        category,
        milestoneTag: milestoneTag || undefined,
        mood,
        isPrivate,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?auto=format&fit=crop&w=800&q=80",
        audioNoteUrl: audioNoteUrl || undefined,
        audioDurationSeconds: audioDurationSeconds || undefined,
        promptQuestion: promptQuestion || undefined,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Apply Prompt
  const handleApplyPrompt = (prompt: GuidedPrompt) => {
    setPromptQuestion(prompt.prompt);
    if (!title.trim()) {
      setTitle(prompt.title);
    }
    if (!content.trim()) {
      setContent(prompt.starter + "\n\n");
    } else {
      setContent((prev) => prev + "\n\n" + prompt.starter);
    }
    setShowPromptDrawer(false);
  };

  // Audio Playback
  const togglePlayAudio = (entryId: number, audioUrl: string) => {
    if (activePlayingAudioId === entryId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setActivePlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      audio.play();
      setActivePlayingAudioId(entryId);
      audio.onended = () => setActivePlayingAudioId(null);
    }
  };

  // Filtering Logic
  const filteredEntries = journalEntries.filter((entry) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchContent = entry.content.toLowerCase().includes(q);
      const matchMilestone = entry.milestoneTag?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchMilestone) return false;
    }

    // Trimester filter
    if (selectedTrimester !== "all") {
      const wk = entry.weekNumber;
      if (selectedTrimester === "1" && (wk < 1 || wk > 13)) return false;
      if (selectedTrimester === "2" && (wk < 14 || wk > 27)) return false;
      if (selectedTrimester === "3" && wk < 28) return false;
    }

    // Category filter
    if (selectedCategory === "voice") {
      if (!entry.audioNoteUrl) return false;
    } else if (selectedCategory !== "all") {
      if (entry.category !== selectedCategory) return false;
    }

    // Private filter
    if (showPrivateOnly && !entry.isPrivate) return false;

    return true;
  });

  // Calculate statistics
  const totalPhotos = journalEntries.filter((e) => !!e.imageUrl).length;
  const totalVoiceNotes = journalEntries.filter((e) => !!e.audioNoteUrl).length;
  const totalMilestones = journalEntries.filter((e) => !!e.milestoneTag).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Header Card with Pastel Blush & 3D Fetal Studio Preview */}
      <div className="pastel-blush-card p-6 md:p-8 rounded-3xl border border-rose-200/60 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div 
              onClick={() => setActivePage("baby-development")}
              className="relative group cursor-pointer shrink-0 rounded-2xl overflow-hidden border-2 border-rose-300/60 shadow-md hover:scale-105 transition-all duration-300 w-16 h-16 md:w-20 md:h-20 bg-rose-900/10"
              title="Click to view 3D Fetal Studio"
            >
              <img 
                src={fetalImage} 
                alt={`Week ${currentWeek} Baby Preview`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/cinematic/fetus_week_24.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-1">
                <span className="text-[9px] font-bold text-white bg-rose-600/80 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                  W{currentWeek} 3D
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 text-xs font-bold tracking-wide">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                <span>Maternal Keepsake & Memory Scrapbook</span>
                <span className="text-[10px] bg-rose-200 dark:bg-rose-800 px-2 py-0.5 rounded-full font-semibold">
                  Week {currentWeek}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-rose-100 tracking-tight">
                Pregnancy Memory Journal
              </h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-rose-200/90 max-w-2xl leading-relaxed">
                Capture bump photos, sonograms, voice letters to baby, and sacred Indian ceremonies like Valaikaapu. Preserved forever in your personal archival keepsake album.
              </p>

              {/* Quick Stat Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-rose-100 dark:border-rose-900/50 font-semibold text-gray-700 dark:text-rose-200">
                  <Feather className="w-3.5 h-3.5 text-rose-500" />
                  <strong>{journalEntries.length}</strong> Memories Written
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-rose-100 dark:border-rose-900/50 font-semibold text-gray-700 dark:text-rose-200">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                  <strong>{totalPhotos}</strong> Photos Attached
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-rose-100 dark:border-rose-900/50 font-semibold text-gray-700 dark:text-rose-200">
                  <Mic className="w-3.5 h-3.5 text-purple-500" />
                  <strong>{totalVoiceNotes}</strong> Voice Letters
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 dark:bg-white/5 border border-rose-100 dark:border-rose-900/50 font-semibold text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <strong>{totalMilestones}</strong> Milestones Marked
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap md:flex-col gap-2.5 sm:self-start">
            <button
              onClick={openCreateModal}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Memory</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-rose-950/60 hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 font-bold text-xs shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-rose-500" />
              <span>Export Keepsake Album</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1523] p-4 rounded-3xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories by title, feelings, or milestone (e.g. Valaikaapu, First kick)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs text-gray-800 dark:text-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={() => setShowPrivateOnly(!showPrivateOnly)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
              showPrivateOnly
                ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800"
                : "bg-gray-50 dark:bg-rose-950/20 text-gray-600 dark:text-rose-300 border-rose-100 dark:border-rose-900/40 hover:bg-rose-50/50"
            }`}
          >
            {showPrivateOnly ? <Lock className="w-3.5 h-3.5 text-purple-600" /> : <Unlock className="w-3.5 h-3.5 text-gray-400" />}
            <span>Private Vault</span>
          </button>
        </div>

        {/* Trimester Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-50 dark:border-rose-950/40">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Trimester:</span>
            {[
              { id: "all", label: "All Weeks" },
              { id: "1", label: "Trimester 1 (W1-13)" },
              { id: "2", label: "Trimester 2 (W14-27)" },
              { id: "3", label: "Trimester 3 (W28-40+)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTrimester(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTrimester === tab.id
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-rose-50/70 dark:bg-rose-950/40 text-gray-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filter:</span>
            {[
              { id: "all", label: "Everything" },
              { id: "milestone", label: "🌸 Milestones" },
              { id: "letter_to_baby", label: "💌 Letters to Baby" },
              { id: "voice", label: "🎙️ Voice Notes" },
              { id: "bump_update", label: "🤰 Bump Diary" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                  selectedCategory === chip.id
                    ? "bg-gray-900 dark:bg-rose-200 text-white dark:text-gray-900 font-bold"
                    : "bg-gray-100 dark:bg-rose-950/30 text-gray-600 dark:text-rose-300 hover:bg-gray-200 dark:hover:bg-rose-900/50"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guided Prompts Quick Inspiration Bar */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/20 dark:to-rose-950/20 p-4 rounded-3xl border border-amber-200/60 dark:border-amber-900/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              Maternal Reflection Inspo for Week {user.currentWeek || 20}
            </span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300/80">Click any prompt to start writing</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {GUIDED_PROMPTS.filter((p) => {
            const wk = user.currentWeek || 20;
            const currentTri = wk <= 13 ? 1 : wk <= 27 ? 2 : 3;
            return p.trimester === currentTri || p.trimester === 0;
          })
            .slice(0, 4)
            .map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  openCreateModal();
                  setTimeout(() => handleApplyPrompt(p), 100);
                }}
                className="flex-shrink-0 max-w-xs text-left p-3 rounded-2xl bg-white/90 dark:bg-[#1f192b] border border-amber-200/70 dark:border-amber-900/40 hover:border-rose-300 dark:hover:border-rose-700 shadow-xs hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-rose-100 group-hover:text-rose-600 transition-colors">
                  <span>{p.icon}</span>
                  <span className="truncate">{p.title}</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-rose-300/70 line-clamp-2 mt-1 leading-snug">
                  {p.prompt}
                </p>
              </button>
            ))}
        </div>
      </div>

      {/* Scrapbook Cards Masonry Grid */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1523] rounded-3xl border border-rose-100 dark:border-rose-900/40 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center mx-auto text-rose-400">
            <Feather className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-rose-100">
              No Memories Found in this Filter
            </h3>
            <p className="text-xs text-gray-500 dark:text-rose-300 max-w-md mx-auto">
              Your pregnancy journey is blooming every day. Click "Record New Memory" to preserve your first kick, bump picture, or heartfelt letter to baby!
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Write Your First Memory</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => {
            const moodObj = MOOD_PALETTE.find((m) => m.label === entry.mood) || MOOD_PALETTE[0];
            const milestoneObj = MILESTONE_CATALOG.find((m) => m.label === entry.milestoneTag);

            return (
              <div
                key={entry.id}
                className="bg-white dark:bg-[#1a1523] rounded-3xl border border-rose-100/80 dark:border-rose-900/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Scrapbook Tape Aesthetic at top */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-100/70 dark:bg-amber-900/30 border-t border-b border-amber-200/60 rotate-1 rounded-xs pointer-events-none z-10" />

                <div>
                  {/* Photo Display */}
                  {entry.imageUrl && (
                    <div className="relative overflow-hidden bg-rose-50 dark:bg-rose-950/30">
                      <img
                        src={entry.imageUrl}
                        alt={entry.title}
                        className="w-full h-56 object-cover cursor-pointer hover:scale-102 transition-transform duration-300"
                        onClick={() => setPreviewImage(entry.imageUrl || null)}
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => setPreviewImage(entry.imageUrl || null)}
                        className="absolute bottom-3 right-3 p-1.5 rounded-xl bg-black/50 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View photo fullscreen"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      {/* Trimester Badge on Photo */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xs text-rose-700 dark:text-rose-200 text-[10px] font-extrabold shadow-xs">
                          Week {entry.weekNumber}
                        </span>
                        {entry.isPrivate && (
                          <span className="p-1 rounded-full bg-purple-900/80 text-purple-200 shadow-xs" title="Private Memory">
                            <Lock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Content Area */}
                  <div className="p-5 space-y-3.5">
                    {/* Header: Date + Milestone Tag */}
                    <div className="flex items-center justify-between text-[11px] gap-2">
                      {!entry.imageUrl && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-200 font-bold">
                          Week {entry.weekNumber}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 ml-auto">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 font-medium">{entry.date}</span>
                      </div>
                    </div>

                    {/* Milestone Tag if present */}
                    {entry.milestoneTag && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50">
                        <span>{milestoneObj?.icon || "🌸"}</span>
                        <span>{entry.milestoneTag}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {entry.title}
                    </h3>

                    {/* Prompt Box if used */}
                    {entry.promptQuestion && (
                      <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border-l-2 border-rose-400 text-[11px] italic text-rose-900 dark:text-rose-200 leading-relaxed">
                        "{entry.promptQuestion}"
                      </div>
                    )}

                    {/* Main Story Content */}
                    <p className="text-xs text-gray-700 dark:text-rose-200/90 leading-relaxed whitespace-pre-line line-clamp-6">
                      {entry.content}
                    </p>

                    {/* Voice Memo Player */}
                    {entry.audioNoteUrl && (
                      <div className="p-3 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-between gap-3">
                        <button
                          onClick={() => togglePlayAudio(entry.id, entry.audioNoteUrl!)}
                          className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-all shadow-xs"
                        >
                          {activePlayingAudioId === entry.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Voice Letter to Baby</span>
                          </div>
                          <span className="text-[10px] text-purple-600 dark:text-purple-300 font-semibold">
                            {entry.audioDurationSeconds ? `${entry.audioDurationSeconds} seconds` : "Audio Recording"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Mood & Action Menu */}
                <div className="p-4 pt-0 border-t border-rose-50 dark:border-rose-900/30 mt-2 flex items-center justify-between">
                  {entry.mood ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-700 dark:text-rose-200">
                      <span>{moodObj.emoji}</span>
                      <span className="truncate max-w-[130px]">{entry.mood}</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Actions: Edit / Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-500 hover:text-rose-600 transition-colors"
                      title="Edit Memory"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(entry.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/40 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MEMORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1523] w-full max-w-2xl max-h-[92vh] rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-rose-100">
                    {editingEntryId !== null ? "Edit Pregnancy Memory" : "Record a Pregnancy Keepsake"}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-rose-300">
                    Week {weekNumber} • Preserved in your private scrapbook
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Row 1: Week, Date, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Pregnancy Week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={42}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Memory Date
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Entry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JournalCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-semibold"
                  >
                    <option value="milestone">🌸 Sacred Milestone</option>
                    <option value="letter_to_baby">💌 Letter to Baby</option>
                    <option value="bump_update">🤰 Bump & Body Diary</option>
                    <option value="scan_memory">🩺 Ultrasound & Scans</option>
                    <option value="cultural_ceremony">🪷 Cultural Ceremony (Valaikaapu)</option>
                    <option value="partner_note">👨‍👧 Partner & Family Moment</option>
                    <option value="general">📖 General Reflection</option>
                  </select>
                </div>
              </div>

              {/* Milestone Tag Selector */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1.5">
                  Milestone Tag (Optional Indian & Clinical Moments)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-2xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                  {MILESTONE_CATALOG.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMilestoneTag(milestoneTag === m.label ? "" : m.label)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                        milestoneTag === m.label
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-white dark:bg-rose-950/40 text-gray-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-50"
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Guided Prompt Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 dark:text-rose-200">
                    Memory Title *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPromptDrawer(!showPromptDrawer)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showPromptDrawer ? "Close Prompts" : "Use Guided Prompt"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The first flutter of kicks, Level-2 Anomaly scan day, Valaikaapu blessings..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-bold text-xs"
                />
              </div>

              {/* Guided Prompt Drawer */}
              {showPromptDrawer && (
                <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                    Select a thoughtful prompt starter:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {GUIDED_PROMPTS.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleApplyPrompt(p)}
                        className="text-left p-2.5 rounded-xl bg-white dark:bg-[#1a1523] border border-amber-200/80 dark:border-amber-900/40 hover:border-rose-400 transition-all text-[11px]"
                      >
                        <div className="font-bold text-gray-800 dark:text-rose-100 flex items-center gap-1">
                          <span>{p.icon}</span>
                          <span>{p.title}</span>
                        </div>
                        <p className="text-gray-500 dark:text-rose-300/70 line-clamp-2 mt-0.5">
                          {p.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Story / Content Textarea */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1">
                  Heartfelt Thoughts & Letter to Baby *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts, feelings, physical changes, or speaking directly to your unborn child..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs leading-relaxed"
                />
              </div>

              {/* Media Attachments: Photo Upload + Preset Art */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700 dark:text-rose-200">
                    Attach Bump Photo or Ultrasound
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresetStickers(!showPresetStickers)}
                    className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    {showPresetStickers ? "Hide Presets" : "Or pick maternity artwork"}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-800 hover:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 cursor-pointer transition-colors text-center">
                    <UploadCloud className="w-4 h-4 text-rose-500" />
                    <span className="font-semibold text-gray-700 dark:text-rose-200">
                      Upload from Device / Camera
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {imageUrl && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-rose-200 dark:border-rose-800 shadow-xs flex-shrink-0">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Preset Art Palette */}
                {showPresetStickers && (
                  <div className="flex gap-2 overflow-x-auto p-2 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setImageUrl(av.url)}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          imageUrl === av.url ? "border-rose-500 scale-105 shadow-sm" : "border-transparent opacity-80"
                        }`}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Memo Recording Box */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-purple-950 dark:text-purple-200">
                      Record Voice Letter to Baby
                    </span>
                  </div>
                  {audioNoteUrl && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Audio Saved ({audioDurationSeconds}s)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{audioNoteUrl ? "Re-record Voice Memo" : "Record Voice Memo"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => stopRecording(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold animate-pulse shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Recording ({recordingSeconds}s)</span>
                    </button>
                  )}

                  {audioNoteUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={() => setAudioNoteUrl("")}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mood Spectrum & Privacy Vault */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-rose-200 mb-1">
                    Maternal Emotional State
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-semibold"
                  >
                    {MOOD_PALETTE.map((m) => (
                      <option key={m.id} value={m.label}>
                        {m.emoji} {m.label} ({m.tamilLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-rose-100 block">
                      Private Vault
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-rose-300">
                      Lock this memory from general views
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-rose-100 dark:border-rose-900/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-rose-900/50 text-gray-600 dark:text-rose-300 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-md"
                >
                  {editingEntryId !== null ? "Save Changes" : "Save to Keepsake"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Memory Fullscreen"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#1a1523] w-full max-w-sm rounded-3xl p-6 border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-rose-100">
                Remove Memory?
              </h3>
              <p className="text-xs text-gray-500 dark:text-rose-300 mt-1">
                Are you sure you want to delete this memory from your keepsake scrapbook? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-rose-900/50 text-gray-600 dark:text-rose-300 font-bold text-xs"
              >
                Keep Memory
              </button>
              <button
                onClick={() => {
                  deleteJournalEntry(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ARCHIVAL KEEPSAKE BOOK PRINT MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f192b] w-full max-w-4xl max-h-[92vh] rounded-3xl border border-rose-200 dark:border-rose-900/50 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Controls Header */}
            <div className="p-4 bg-rose-50/80 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900/50 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-sm text-gray-900 dark:text-rose-100">
                  Archival Pregnancy Keepsake Memory Album (Print Preview)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-rose-100 dark:hover:bg-rose-900/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Book Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fffcf9] text-gray-900 font-serif print:p-0">
              {/* Cover Page Frame */}
              <div className="border-4 border-rose-200 rounded-3xl p-8 md:p-12 text-center space-y-6 bg-white shadow-xs">
                <div className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-sans font-bold tracking-widest uppercase">
                  BloomNest Maternity Archival Edition
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Letters to My Baby & Bump Memories
                </h1>

                <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed italic">
                  "{KEEPSAKE_COVER_QUOTES[0]}"
                </p>

                <div className="pt-4 border-t border-rose-100 flex flex-wrap items-center justify-center gap-8 font-sans text-xs text-gray-500">
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-[10px]">Mother's Name</span>
                    <span className="text-gray-900 font-semibold text-sm">{user.name || "Loving Mother"}</span>
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-[10px]">Estimated Due Date</span>
                    <span className="text-gray-900 font-semibold text-sm">{user.edd || "Blessed Day Ahead"}</span>
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-wider block text-[10px]">Memories Documented</span>
                    <span className="text-gray-900 font-semibold text-sm">{journalEntries.length} Sacred Moments</span>
                  </div>
                </div>
              </div>

              {/* Scrapbook Entries Flow */}
              <div className="space-y-6">
                {journalEntries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="p-6 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3 break-inside-avoid"
                  >
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
                        Entry #{idx + 1} • Week {entry.weekNumber}
                      </span>
                      <span className="text-gray-500">{entry.date}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {entry.title}
                    </h2>

                    {entry.milestoneTag && (
                      <div className="font-sans text-xs font-semibold text-amber-700">
                        🌸 Milestone: {entry.milestoneTag}
                      </div>
                    )}

                    {entry.imageUrl && (
                      <div className="max-w-md mx-auto my-4 rounded-xl overflow-hidden border border-rose-200 shadow-xs">
                        <img src={entry.imageUrl} alt={entry.title} className="w-full h-64 object-cover" />
                      </div>
                    )}

                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {entry.content}
                    </p>

                    <div className="pt-3 border-t border-rose-100 flex items-center justify-between font-sans text-xs text-gray-500">
                      <span>Mood: {entry.mood || "Peaceful & Blessed"}</span>
                      {entry.audioNoteUrl && <span>🎙️ Includes Recorded Voice Letter</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Final Blessing Seal */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-rose-300 text-center space-y-2 bg-rose-50/50 print:border-solid">
                <Heart className="w-6 h-6 text-rose-500 mx-auto fill-rose-500" />
                <p className="text-sm font-semibold text-gray-800">
                  "May health, grace, and boundless love surround mother and baby always."
                </p>
                <span className="font-sans text-[11px] text-gray-500">
                  BloomNest Perinatal Sanctuary • Archival Record
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
