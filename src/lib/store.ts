import { create } from "zustand";

export type KanaType = "hiragana" | "katakana" | "numbers" | "days";
export type AppView = "landing" | "character" | "sentence" | "results" | "admin";
export type QuizDirection = "char-to-romaji" | "romaji-to-char";

export interface KanaOption {
  id: number;
  char: string;
  romaji: string;
  group?: string;
}

interface QuizState {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showHint: boolean;
  answered: boolean;
  loading: boolean;
}

interface CharacterQuizState extends QuizState {
  currentChar: KanaOption | null;
  group: string;
  direction: QuizDirection;
  hint: string;
  options: KanaOption[];
}

interface SentenceQuizState extends QuizState {
  currentSentence: {
    id: number;
    text: string;
    reading: string;
    meaning: string;
    kanaType: string;
    missingIndices: number[];
    blanks: string[];
  } | null;
  currentBlankIndex: number;
  options: KanaOption[];
  filledBlanks: string[];
  hint: string;
}

interface Results {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

interface AppState {
  view: AppView;
  kanaType: KanaType;
  setView: (view: AppView) => void;
  setKanaType: (type: KanaType) => void;

  quizMode: "character" | "sentence";

  charQuiz: CharacterQuizState;
  initCharQuiz: () => Promise<void>;
  nextCharQuestion: () => void;
  answerCharQuestion: (value: string) => void;
  toggleCharHint: () => void;
  setCharDirection: (dir: QuizDirection) => void;

  sentenceQuiz: SentenceQuizState;
  initSentenceQuiz: () => Promise<void>;
  nextSentenceQuestion: () => void;
  answerSentenceQuestion: (char: string) => void;
  toggleSentenceHint: () => void;

  score: number;
  totalQuestions: number;
  wrongAnswers: KanaOption[];
  resetScore: () => void;

  results: Results | null;
  questionsPerSession: number;
  setQuestionsPerSession: (n: number) => void;

  allSentences: { id: number; text: string; kanaType: string }[];
  fetchSentences: () => Promise<void>;
  addSentence: (data: {
    text: string; reading: string; meaning: string;
    kanaType: string; missingIndices: number[]; blanks: string[];
  }) => Promise<boolean>;
  deleteSentence: (id: number) => Promise<void>;
  editSentenceId: number | null;
  setEditSentenceId: (id: number | null) => void;

  resetAll: () => void;
}

const initialCharQuiz: CharacterQuizState = {
  currentChar: null, group: "", options: [], direction: "char-to-romaji",
  selectedAnswer: null, isCorrect: null, showHint: false, answered: false, loading: false, hint: "",
};

const initialSentenceQuiz: SentenceQuizState = {
  currentSentence: null, currentBlankIndex: 0, options: [], filledBlanks: [],
  selectedAnswer: null, isCorrect: null, showHint: false, answered: false, loading: false, hint: "",
};

// --- Helper functions for client-side quiz generation ---

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateMCQOptions(correct: KanaOption, allChars: KanaOption[]): KanaOption[] {
  const others = allChars.filter((c) => c.romaji !== correct.romaji);
  const wrong = getRandomItems(others, 3);
  return [correct, ...wrong].sort(() => Math.random() - 0.5);
}

// In-memory cache of kana data — loaded once from static JSON
let cachedKana: Record<string, KanaOption[]> = {};
let cachedSentences: Record<string, typeof initialSentenceQuiz.currentSentence[]> = {};
let staticDataLoaded = false;

async function fetchSentenceQuizFromServer(type: KanaType) {
  try {
    const res = await fetch(`/api/quiz/sentence?type=${type}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchSentenceOptionsFromServer(type: KanaType, blankChar: string) {
  try {
    const res = await fetch(`/api/quiz/sentence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, blankChar }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function ensureDataLoaded(type: KanaType) {
  const kanaReady = cachedKana[type]?.length > 0;
  const sentReady = cachedSentences[type]?.length > 0;
  if (kanaReady && sentReady) return;

  // Load static JSON on first call
  if (!staticDataLoaded) {
    try {
      const res = await fetch("/kana-data.json");
      if (res.ok) {
        const data = await res.json();
        cachedKana["hiragana"] = (data.characters || []).filter((c: { kanaType: string }) => c.kanaType === "hiragana");
        cachedKana["katakana"] = (data.characters || []).filter((c: { kanaType: string }) => c.kanaType === "katakana");
        cachedKana["numbers"] = (data.characters || []).filter((c: { kanaType: string }) => c.kanaType === "numbers");
        cachedKana["days"] = (data.characters || []).filter((c: { kanaType: string }) => c.kanaType === "days");
        cachedSentences["hiragana"] = (data.sentences || []).filter((s: { kanaType: string }) => s.kanaType === "hiragana");
        cachedSentences["katakana"] = (data.sentences || []).filter((s: { kanaType: string }) => s.kanaType === "katakana");
        cachedSentences["numbers"] = (data.sentences || []).filter((s: { kanaType: string }) => s.kanaType === "numbers");
        cachedSentences["days"] = (data.sentences || []).filter((s: { kanaType: string }) => s.kanaType === "days");
        staticDataLoaded = true;
      }
    } catch {
      // Fall through to API
    }
  }

  // Fallback: fetch missing data from API
  if (!kanaReady) {
    try {
      const kanaRes = await fetch(`/api/kana?type=${type}`);
      if (kanaRes.ok) cachedKana[type] = await kanaRes.json();
    } catch { if (!cachedKana[type]) cachedKana[type] = []; }
  }
  if (!sentReady) {
    try {
      const sentRes = await fetch(`/api/sentences?type=${type}`);
      if (sentRes.ok) cachedSentences[type] = await sentRes.json();
    } catch { if (!cachedSentences[type]) cachedSentences[type] = []; }
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  view: "landing",
  kanaType: "hiragana",
  setView: (view) => set({ view }),
  setKanaType: (type) => {
    const state = get();
    set({ kanaType: type });
    if (state.view === "character") get().initCharQuiz();
    else if (state.view === "sentence") get().initSentenceQuiz();
  },

  quizMode: "character",
  score: 0, totalQuestions: 0, wrongAnswers: [], results: null,
  resetScore: () => set({ score: 0, totalQuestions: 0, wrongAnswers: [], results: null }),
  questionsPerSession: 10,
  setQuestionsPerSession: (n) => set({ questionsPerSession: n }),

  allSentences: [],
  fetchSentences: async () => {
    try {
      const res = await fetch("/api/sentences");
      if (res.ok) {
        const data = await res.json();
        set({ allSentences: data.map((s: { id: number; text: string; kanaType: string }) => ({ id: s.id, text: s.text, kanaType: s.kanaType })) });
      }
    } catch { /* silent */ }
  },
  addSentence: async (data) => {
    try {
      const res = await fetch("/api/sentences", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      if (res.ok) {
        // Invalidate client-side cache for the affected kana type
        cachedSentences[data.kanaType] = [];
        get().fetchSentences();
        return true;
      }
      return false;
    } catch { return false; }
  },
  deleteSentence: async (id) => {
    try {
      // Find the sentence type before deleting for cache invalidation
      const all = get().allSentences;
      const sent = all.find((s) => s.id === id);
      const typeQuery = sent?.kanaType ? `&type=${encodeURIComponent(sent.kanaType)}` : "";
      await fetch(`/api/sentences/delete?id=${id}${typeQuery}`, { method: "DELETE" });
      if (sent) cachedSentences[sent.kanaType] = [];
      get().fetchSentences();
    } catch { /* silent */ }
  },
  editSentenceId: null,
  setEditSentenceId: (id) => set({ editSentenceId: id }),

  // --- Character Quiz (client-side generation from cached data) ---
  charQuiz: { ...initialCharQuiz },

  initCharQuiz: async () => {
    const { kanaType } = get();
    set({ view: "character", quizMode: "character", score: 0, totalQuestions: 0, wrongAnswers: [], results: null,
      charQuiz: { ...initialCharQuiz, loading: true, direction: get().charQuiz.direction } });

    await ensureDataLoaded(kanaType);
    const allChars = cachedKana[kanaType];
    if (!allChars?.length) { set((s) => ({ charQuiz: { ...s.charQuiz, loading: false } })); return; }

    const char = getRandomItems(allChars, 1)[0];
    set({
      charQuiz: {
        ...initialCharQuiz, currentChar: char, group: char.group || "",
        options: generateMCQOptions(char, allChars),
        direction: get().charQuiz.direction,
        hint: `Hint: ${char.group || ""} — starts with "${char.romaji[0]}"`,
      },
    });
  },

  nextCharQuestion: () => {
    const { totalQuestions, questionsPerSession, score, kanaType } = get();
    if (totalQuestions >= questionsPerSession) {
      const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      set({ view: "results", results: { total: totalQuestions, correct: score, wrong: totalQuestions - score, accuracy } });
      return;
    }

    const allChars = cachedKana[kanaType];
    if (!allChars?.length) return;

    const prevChar = get().charQuiz.currentChar;
    let char = getRandomItems(allChars, 1)[0];
    let attempts = 0;
    while (char.romaji === prevChar?.romaji && attempts < 10) {
      char = getRandomItems(allChars, 1)[0]; attempts++;
    }

    set({
      charQuiz: {
        ...initialCharQuiz, currentChar: char, group: char.group || "",
        options: generateMCQOptions(char, allChars),
        direction: get().charQuiz.direction,
        hint: `Hint: ${char.group || ""} — starts with "${char.romaji[0]}"`,
      },
    });
  },

  answerCharQuestion: (value: string) => {
    const { charQuiz } = get();
    if (charQuiz.answered || !charQuiz.currentChar) return;

    const isCorrect = charQuiz.direction === "char-to-romaji"
      ? value === charQuiz.currentChar.romaji : value === charQuiz.currentChar.char;

    if (isCorrect) set((s) => ({ score: s.score + 1 }));
    else set((s) => ({ wrongAnswers: [...s.wrongAnswers, charQuiz.currentChar!] }));
    set((s) => ({ totalQuestions: s.totalQuestions + 1 }));

    set({ charQuiz: { ...charQuiz, selectedAnswer: value, isCorrect, answered: true } });
    setTimeout(() => get().nextCharQuestion(), 1500);
  },

  toggleCharHint: () => set((s) => ({ charQuiz: { ...s.charQuiz, showHint: !s.charQuiz.showHint } })),

  setCharDirection: (dir) => {
    set((s) => ({ charQuiz: { ...s.charQuiz, direction: dir } }));
    get().nextCharQuestion();
  },

  // --- Sentence Quiz (client-side generation from cached data) ---
  sentenceQuiz: { ...initialSentenceQuiz },

  initSentenceQuiz: async () => {
    const { kanaType } = get();
    set({ view: "sentence", quizMode: "sentence", score: 0, totalQuestions: 0, wrongAnswers: [], results: null,
      sentenceQuiz: { ...initialSentenceQuiz, loading: true } });

    const serverQuiz = await fetchSentenceQuizFromServer(kanaType);
    if (serverQuiz) {
      set({
        sentenceQuiz: {
          ...initialSentenceQuiz,
          currentSentence: {
            id: serverQuiz.id,
            text: serverQuiz.text,
            reading: serverQuiz.reading,
            meaning: serverQuiz.meaning,
            kanaType: serverQuiz.kanaType,
            missingIndices: serverQuiz.missingIndices,
            blanks: serverQuiz.blanks,
          },
          currentBlankIndex: serverQuiz.blankIndex ?? 0,
          options: serverQuiz.options || [],
          hint: serverQuiz.hint || "",
          loading: false,
        },
      });
      return;
    }

    await ensureDataLoaded(kanaType);
    const allSentences = cachedSentences[kanaType];
    const allChars = cachedKana[kanaType];
    if (!allSentences?.length || !allChars?.length) {
      set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: false } })); return;
    }

    const charSet = new Set(allChars.map((c) => c.char));

    // Find a valid sentence whose blanks are all in the kana table
    let sentence: typeof allSentences[0] | null = null;
    for (let i = 0; i < 30; i++) {
      const candidate = getRandomItems(allSentences, 1)[0];
      if (candidate.blanks.every((b) => charSet.has(b))) {
        sentence = candidate;
        break;
      }
    }
    if (!sentence) sentence = allSentences[0]; // fallback

    const correctChar = sentence.blanks[0];
    const correctKana = allChars.find((c) => c.char === correctChar);

    set({
      sentenceQuiz: {
        ...initialSentenceQuiz, currentSentence: sentence,
        options: correctKana ? generateMCQOptions(correctKana, allChars) : [],
        hint: correctKana ? `Hint: The answer is ${correctChar}` : `Hint: ${correctChar}`,
        loading: false,
      },
    });
  },

  nextSentenceQuestion: () => {
    const { totalQuestions, questionsPerSession, score, kanaType } = get();
    if (totalQuestions >= questionsPerSession) {
      const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      set({ view: "results", results: { total: totalQuestions, correct: score, wrong: totalQuestions - score, accuracy } });
      return;
    }

    const allSentences = cachedSentences[kanaType];
    const allChars = cachedKana[kanaType];
    if (!allSentences?.length || !allChars?.length) return;

    const charSet = new Set(allChars.map((c) => c.char));
    const prev = get().sentenceQuiz.currentSentence;

    let sentence: typeof allSentences[0] | null = null;
    for (let i = 0; i < 30; i++) {
      const candidate = getRandomItems(allSentences, 1)[0];
      if (candidate.text === prev?.text) continue;
      if (candidate.blanks.every((b) => charSet.has(b))) {
        sentence = candidate;
        break;
      }
    }
    if (!sentence) sentence = getRandomItems(allSentences, 1)[0];

    const correctChar = sentence.blanks[0];
    const correctKana = allChars.find((c) => c.char === correctChar);

    set({
      sentenceQuiz: {
        ...initialSentenceQuiz, currentSentence: sentence,
        options: correctKana ? generateMCQOptions(correctKana, allChars) : [],
        hint: `Hint: The answer is ${correctChar}`,
      },
    });
  },

  answerSentenceQuestion: async (char: string) => {
    const { sentenceQuiz, kanaType } = get();
    if (sentenceQuiz.answered || !sentenceQuiz.currentSentence) return;

    const correctChar = sentenceQuiz.currentSentence.blanks[sentenceQuiz.currentBlankIndex];
    const isCorrect = char === correctChar;

    if (isCorrect) set((s) => ({ score: s.score + 1 }));
    else set((s) => ({ wrongAnswers: [...s.wrongAnswers, { id: 0, char: correctChar, romaji: "?" }] }));
    set((s) => ({ totalQuestions: s.totalQuestions + 1 }));

    const newFilledBlanks = [...sentenceQuiz.filledBlanks, char];
    const nextBlankIndex = sentenceQuiz.currentBlankIndex + 1;
    const isLastBlank = nextBlankIndex >= sentenceQuiz.currentSentence.missingIndices.length;

    if (isLastBlank) {
      set({ sentenceQuiz: { ...sentenceQuiz, selectedAnswer: char, isCorrect, answered: true, filledBlanks: newFilledBlanks } });
      setTimeout(() => get().nextSentenceQuestion(), 1500);
    } else {
      const nextCorrectChar = sentenceQuiz.currentSentence.blanks[nextBlankIndex];
      const serverOptions = await fetchSentenceOptionsFromServer(kanaType, nextCorrectChar);
      if (serverOptions?.options) {
        set({
          sentenceQuiz: {
            ...sentenceQuiz,
            currentBlankIndex: nextBlankIndex,
            selectedAnswer: null,
            isCorrect: null,
            showHint: false,
            answered: false,
            filledBlanks: newFilledBlanks,
            options: serverOptions.options,
            hint: serverOptions.hint || `Hint: The answer is ${nextCorrectChar}`,
          },
        });
      } else {
        const allChars = cachedKana[kanaType];
        const nextCorrectKana = allChars?.find((c) => c.char === nextCorrectChar);
        set({
          sentenceQuiz: {
            ...sentenceQuiz,
            currentBlankIndex: nextBlankIndex,
            selectedAnswer: null,
            isCorrect: null,
            showHint: false,
            answered: false,
            filledBlanks: newFilledBlanks,
            options: nextCorrectKana ? generateMCQOptions(nextCorrectKana, allChars) : [],
            hint: `Hint: The answer is ${nextCorrectChar}`,
          },
        });
      }
    }
  },

  toggleSentenceHint: () => set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, showHint: !s.sentenceQuiz.showHint } })),

  resetAll: () => {
    set({
      view: "landing", quizMode: "character", score: 0, totalQuestions: 0,
      wrongAnswers: [], results: null,
      charQuiz: { ...initialCharQuiz }, sentenceQuiz: { ...initialSentenceQuiz },
    });
  },
}));