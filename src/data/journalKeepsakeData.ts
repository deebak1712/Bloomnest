export interface GuidedPrompt {
  id: string;
  trimester: 1 | 2 | 3 | 0; // 0 = anytime
  category: "first_discoveries" | "emotional_connection" | "physical_journey" | "family_cultural" | "letter_to_baby";
  title: string;
  prompt: string;
  starter: string;
  icon: string;
}

export interface MilestoneTagOption {
  id: string;
  label: string;
  tamilLabel: string;
  icon: string;
  trimesterSuggested: 1 | 2 | 3;
  color: string;
}

export interface MoodArchetype {
  id: string;
  label: string;
  tamilLabel: string;
  emoji: string;
  gradient: string;
  textColor: string;
  bgLight: string;
}

export const GUIDED_PROMPTS: GuidedPrompt[] = [
  // Trimester 1
  {
    id: "p_positive_test",
    trimester: 1,
    category: "first_discoveries",
    title: "The Moment of Two Pink Lines",
    prompt: "How did you find out you were pregnant? Describe the room, the time of day, and the very first emotion that rushed through your heart.",
    starter: "I will never forget the moment I saw those two lines on the test. My hands were trembling, and the first thing I felt was...",
    icon: "🌸",
  },
  {
    id: "p_first_told",
    trimester: 1,
    category: "family_cultural",
    title: "Sharing the Good News",
    prompt: "Who did you tell first, and how did they react? What were the tears or laughter like?",
    starter: "Telling your father was one of the sweetest moments of my life. When I showed him, his eyes filled with tears and he said...",
    icon: "💌",
  },
  {
    id: "p_first_heartbeat",
    trimester: 1,
    category: "physical_journey",
    title: "Hearing Your First Heartbeat",
    prompt: "Describe the sound of your baby's heartbeat during the early ultrasound scan. What did it feel like in that clinic room?",
    starter: "The Doppler machine crackled, and suddenly there it was — a galloping rhythm at 150 bpm! It sounded like a tiny, fierce warrior train...",
    icon: "💓",
  },
  {
    id: "p_first_cravings",
    trimester: 1,
    category: "physical_journey",
    title: "Morning Waves & First Cravings",
    prompt: "What strange food cravings or silly nausea moments happened this trimester? What could you or couldn't you stand to smell?",
    starter: "You definitely have distinct food tastes already! Suddenly all I wanted was sour raw mangoes with salt, and the smell of...",
    icon: "🥭",
  },

  // Trimester 2
  {
    id: "p_first_flutter",
    trimester: 2,
    category: "physical_journey",
    title: "The First Flutter ('Meen Thullal')",
    prompt: "Where were you when you felt the baby's first movement? Was it like a butterfly, a bubble, or a tiny fish turning over?",
    starter: "I was sitting quietly this afternoon when I felt it for the first time — like a tiny golden fish fluttering softly inside my womb...",
    icon: "🦋",
  },
  {
    id: "p_tiffa_scan",
    trimester: 2,
    category: "first_discoveries",
    title: "Level-2 Anomaly (TIFFA) Scan Day",
    prompt: "Seeing your baby's face, profile, tiny hands, and spine on the sonogram screen. What details made you fall in love all over again?",
    starter: "Today was the big anomaly scan! Watching your tiny hands cover your face and seeing your perfect spine on the monitor made my heart melt...",
    icon: "🩺",
  },
  {
    id: "p_dad_bump_talk",
    trimester: 2,
    category: "family_cultural",
    title: "Dad's Conversations with the Bump",
    prompt: "What does your partner or family whisper, sing, or say to your belly when you are relaxing together?",
    starter: "Every night before we sleep, your dad leans close to my bump and says goodnight. Tonight you gave him two swift kicks in response...",
    icon: "👨‍👧",
  },
  {
    id: "p_naming_dreams",
    trimester: 2,
    category: "first_discoveries",
    title: "Baby Name Daydreams",
    prompt: "What names are you considering? What do those names mean, and who inspired them?",
    starter: "We have spent hours whispering names back and forth. Some names carrying our hopes, values, and family heritage include...",
    icon: "✨",
  },
  {
    id: "p_music_ragas",
    trimester: 2,
    category: "emotional_connection",
    title: "Music & Ragas We Listen To",
    prompt: "What music, lullabies, or Garbha Sanskar chants does your baby seem to react to with gentle rolls?",
    starter: "Whenever I put on Raga Kalyani or soft flute melodies, you seem to settle into a calm, gentle rhythm inside...",
    icon: "🎶",
  },

  // Trimester 3
  {
    id: "p_valaikaapu",
    trimester: 3,
    category: "family_cultural",
    title: "Valaikaapu / Godh Bharai Blessing",
    prompt: "Reflect on your traditional bangle ceremony or baby shower. The clinking glass bangles, the aroma of variety rice, and blessings from elders.",
    starter: "The gentle clinking sound of glass bangles on my wrists is believed to soothe your ears. Surrounded by family, mothers, and elders, we felt so blessed...",
    icon: "🪷",
  },
  {
    id: "p_nursery_prep",
    trimester: 3,
    category: "physical_journey",
    title: "Nesting & Tiny Baby Clothes",
    prompt: "Washing the soft organic jhablas, swaddles, and setting up the cot or bassinet. How does seeing those tiny clothes make you feel?",
    starter: "Holding your tiny newborn socks and soft cotton jhablas in my hands made it feel so real today. Everything is washed, sun-dried, and waiting for you...",
    icon: "🧸",
  },
  {
    id: "p_letter_to_baby",
    trimester: 3,
    category: "letter_to_baby",
    title: "Letter to My Unborn Child",
    prompt: "Write directly to your baby. What promise do you make to them about the world they will enter and the love waiting for them?",
    starter: "My precious child, as your birth draws near, there are a few promises I want to make to you from the depths of my soul...",
    icon: "💌",
  },
  {
    id: "p_birth_hopes",
    trimester: 3,
    category: "emotional_connection",
    title: "My Hopes & Birth Affirmations",
    prompt: "How are you preparing your heart, mind, and breath for delivery day? What gives you strength?",
    starter: "As we count down the final weeks, I am breathing deeply and trusting my body's ancient wisdom. When labor begins, I will remember...",
    icon: "🕊️",
  },
  {
    id: "p_thaai_veedu",
    trimester: 3,
    category: "family_cultural",
    title: "Thaai Veedu Payanam (Maternal Home)",
    prompt: "Arriving at your maternal home, eating comforting home-cooked food, and being cared for by your mother and grandmother.",
    starter: "Stepping into my mother's home brought an overwhelming sense of calm. The aroma of herbal soups and unconditional care surrounding us...",
    icon: "🏡",
  },
];

export const MILESTONE_CATALOG: MilestoneTagOption[] = [
  { id: "positive_test", label: "First Positive Test", tamilLabel: "முதல் நல்ல செய்தி", icon: "🌸", trimesterSuggested: 1, color: "bg-rose-50 border-rose-200 text-rose-700" },
  { id: "first_heartbeat", label: "First Heartbeat Sound", tamilLabel: "முதல் இதயத் துடிப்பு", icon: "💓", trimesterSuggested: 1, color: "bg-pink-50 border-pink-200 text-pink-700" },
  { id: "first_ultrasound", label: "Dating Ultrasound Scan", tamilLabel: "முதல் ஸ்கேன் படம்", icon: "📷", trimesterSuggested: 1, color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "first_flutter", label: "First Flutter / Kick", tamilLabel: "முதல் மீன் துள்ளல் உதைப்பு", icon: "🦋", trimesterSuggested: 2, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { id: "tiffa_scan", label: "Level-2 TIFFA Scan", tamilLabel: "அனோமலி ஸ்கேன்", icon: "🩺", trimesterSuggested: 2, color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { id: "dad_felt_kick", label: "Dad Felt Baby Kick", tamilLabel: "அப்பா தொட்டுணர்ந்த உதை", icon: "👨‍👧", trimesterSuggested: 2, color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "glucose_cleared", label: "Glucose Test Cleared", tamilLabel: "சர்க்கரை பரிசோதனை வெற்றி", icon: "🍯", trimesterSuggested: 2, color: "bg-amber-50 border-amber-200 text-amber-700" },
  { id: "valaikaapu", label: "Valaikaapu / Seemantham", tamilLabel: "வளைகாப்பு / சீமந்தம்", icon: "🪷", trimesterSuggested: 3, color: "bg-amber-50 border-amber-300 text-amber-900" },
  { id: "thaai_veedu", label: "Thaai Veedu Relocation", tamilLabel: "தாய் வீடு பயணம்", icon: "🏡", trimesterSuggested: 3, color: "bg-teal-50 border-teal-200 text-teal-700" },
  { id: "hospital_bag_ready", label: "Hospital Bag Packed", tamilLabel: "மருத்துவமனை பை தயார்", icon: "👜", trimesterSuggested: 3, color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700" },
  { id: "nursery_ready", label: "Crib & Clothes Ready", tamilLabel: "தொட்டில் & உடைகள் தயார்", icon: "🧸", trimesterSuggested: 3, color: "bg-sky-50 border-sky-200 text-sky-700" },
  { id: "full_term_37w", label: "Full Term 37 Weeks", tamilLabel: "37 வார முழுமை மைல்கல்", icon: "🌟", trimesterSuggested: 3, color: "bg-rose-50 border-rose-300 text-rose-800" },
];

export const MOOD_PALETTE: MoodArchetype[] = [
  { id: "overjoyed", label: "Overjoyed & Blessed", tamilLabel: "மகிழ்ச்சி & ஆசீர்வாதம்", emoji: "🥰", gradient: "from-amber-400 to-rose-400", textColor: "text-amber-800 dark:text-amber-200", bgLight: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40" },
  { id: "emotional", label: "Deeply Emotional", tamilLabel: "நெகிழ்ச்சி & ஆனந்தக்கண்ணீர்", emoji: "🥹", gradient: "from-rose-500 to-pink-500", textColor: "text-rose-800 dark:text-rose-200", bgLight: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40" },
  { id: "peaceful", label: "Serene & Peaceful", tamilLabel: "அமைதி & தியான நிலை", emoji: "🕊️", gradient: "from-teal-400 to-emerald-500", textColor: "text-teal-800 dark:text-teal-200", bgLight: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/40" },
  { id: "glowing", label: "Glowing & Radiant", tamilLabel: "பிரகாசம் & உற்சாகம்", emoji: "✨", gradient: "from-yellow-400 to-amber-500", textColor: "text-yellow-800 dark:text-yellow-200", bgLight: "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800/40" },
  { id: "anxious", label: "Anxious & Seeking Calm", tamilLabel: "பதட்டம் & ஆறுதல் தேவை", emoji: "🥺", gradient: "from-indigo-400 to-purple-500", textColor: "text-indigo-800 dark:text-indigo-200", bgLight: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40" },
  { id: "tired", label: "Fatigued & Resting", tamilLabel: "சோர்வு & ஓய்வு தேவை", emoji: "🥱", gradient: "from-slate-400 to-gray-500", textColor: "text-slate-800 dark:text-slate-200", bgLight: "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/40" },
  { id: "nesting", label: "Nesting & Organizing", tamilLabel: "கூடுகட்டும் வேகம்", emoji: "🪺", gradient: "from-pink-500 to-rose-400", textColor: "text-pink-800 dark:text-pink-200", bgLight: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800/40" },
  { id: "wonder", label: "Awe & Wonder", tamilLabel: "வியப்பு & பரவசம்", emoji: "💖", gradient: "from-purple-400 to-pink-500", textColor: "text-purple-800 dark:text-purple-200", bgLight: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40" },
];

export const PRESET_AVATARS = [
  { id: "av_womb", label: "Womb Glow", url: "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?auto=format&fit=crop&w=800&q=80" },
  { id: "av_scan", label: "Ultrasound Sonogram", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80" },
  { id: "av_shoes", label: "Tiny Booties", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80" },
  { id: "av_lotus", label: "Lotus Blessing", url: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80" },
  { id: "av_hands", label: "Hands on Bump", url: "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80" },
];

export const KEEPSAKE_COVER_QUOTES = [
  "A mother's joy begins when new life stirs inside; when a tiny heartbeat is heard for the very first time, and a playful kick reminds that she is never alone.",
  "Ten little fingers, ten little toes, with love and grace our family grows.",
  "Before you were conceived, I wanted you. Before you were born, I loved you. Before you were here an hour, I would die for you. This is the miracle of mother's love.",
  "The moment a child is born, the mother is also born. She never existed before. The woman existed, but the mother, never.",
];
