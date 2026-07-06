import { create } from "zustand";

export type KanaType = "hiragana" | "katakana";
export type AppView = "landing" | "character" | "sentence" | "results" | "admin";
export type QuizDirection = "char-to-romaji" | "romaji-to-char";

export interface KanaOption {
  id: number;
  char: string;
  romaji: string;
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
  // Navigation
  view: AppView;
  kanaType: KanaType;
  setView: (view: AppView) => void;
  setKanaType: (type: KanaType) => void;

  quizMode: "character" | "sentence";

  // Character quiz
  charQuiz: CharacterQuizState;
  initCharQuiz: () => Promise<void>;
  nextCharQuestion: () => Promise<void>;
  answerCharQuestion: (value: string) => void;
  toggleCharHint: () => void;
  setCharDirection: (dir: QuizDirection) => void;

  // Sentence quiz
  sentenceQuiz: SentenceQuizState;
  initSentenceQuiz: () => Promise<void>;
  nextSentenceQuestion: () => Promise<void>;
  fetchNextBlankOptions: (blankChar: string) => Promise<void>;
  answerSentenceQuestion: (char: string) => void;
  toggleSentenceHint: () => void;

  // Progress
  score: number;
  totalQuestions: number;
  wrongAnswers: KanaOption[];
  resetScore: () => void;

  // Results
  results: Results | null;

  questionsPerSession: number;
  setQuestionsPerSession: (n: number) => void;

  // Admin
  allSentences: { id: number; text: string; kanaType: string }[];
  fetchSentences: () => Promise<void>;
  addSentence: (data: {
    text: string;
    reading: string;
    meaning: string;
    kanaType: string;
    missingIndices: number[];
    blanks: string[];
  }) => Promise<boolean>;
  deleteSentence: (id: number) => Promise<void>;

  resetAll: () => void;
}

const initialCharQuiz: CharacterQuizState = {
  currentChar: null,
  group: "",
  options: [],
  direction: "char-to-romaji",
  selectedAnswer: null,
  isCorrect: null,
  showHint: false,
  answered: false,
  loading: false,
  hint: "",
};

const initialSentenceQuiz: SentenceQuizState = {
  currentSentence: null,
  currentBlankIndex: 0,
  options: [],
  filledBlanks: [],
  selectedAnswer: null,
  isCorrect: null,
  showHint: false,
  answered: false,
  loading: false,
  hint: "",
};

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

  score: 0,
  totalQuestions: 0,
  wrongAnswers: [],
  resetScore: () => set({ score: 0, totalQuestions: 0, wrongAnswers: [], results: null }),
  results: null,
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
    } catch {
      // silently fail
    }
  },

  addSentence: async (data) => {
    try {
      const res = await fetch("/api/sentences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        get().fetchSentences();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  deleteSentence: async (id) => {
    try {
      await fetch(`/api/sentences?id=${id}`, { method: "DELETE" });
      get().fetchSentences();
    } catch {
      // silently fail
    }
  },

  // Character Quiz
  charQuiz: { ...initialCharQuiz },

  initCharQuiz: async () => {
    const { kanaType } = get();
    set({
      view: "character",
      quizMode: "character",
      score: 0,
      totalQuestions: 0,
      wrongAnswers: [],
      results: null,
      charQuiz: { ...initialCharQuiz, loading: true, direction: get().charQuiz.direction },
    });

    try {
      const direction = get().charQuiz.direction;
      const res = await fetch(`/api/quiz/character?type=${kanaType}&direction=${direction}`);
      if (res.ok) {
        const data = await res.json();
        set({
          charQuiz: {
            ...initialCharQuiz,
            currentChar: { id: data.id, char: data.char, romaji: data.romaji },
            group: data.group,
            options: data.options,
            direction: data.direction,
            hint: data.hint,
          },
        });
      }
    } catch {
      set((s) => ({ charQuiz: { ...s.charQuiz, loading: false } }));
    }
  },

  nextCharQuestion: async () => {
    const { totalQuestions, questionsPerSession, score } = get();

    if (totalQuestions >= questionsPerSession) {
      const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      set({
        view: "results",
        results: { total: totalQuestions, correct: score, wrong: totalQuestions - score, accuracy },
      });
      return;
    }

    set((s) => ({ charQuiz: { ...s.charQuiz, loading: true } }));

    try {
      const { kanaType } = get();
      const direction = get().charQuiz.direction;
      const res = await fetch(`/api/quiz/character?type=${kanaType}&direction=${direction}`);
      if (res.ok) {
        const data = await res.json();
        set({
          charQuiz: {
            ...initialCharQuiz,
            currentChar: { id: data.id, char: data.char, romaji: data.romaji },
            group: data.group,
            options: data.options,
            direction: data.direction,
            hint: data.hint,
          },
        });
      }
    } catch {
      set((s) => ({ charQuiz: { ...s.charQuiz, loading: false } }));
    }
  },

  answerCharQuestion: (value: string) => {
    const { charQuiz } = get();
    if (charQuiz.answered || !charQuiz.currentChar) return;

    const isCorrect =
      charQuiz.direction === "char-to-romaji"
        ? value === charQuiz.currentChar.romaji
        : value === charQuiz.currentChar.char;

    if (isCorrect) {
      set((s) => ({ score: s.score + 1 }));
    } else {
      set((s) => ({ wrongAnswers: [...s.wrongAnswers, charQuiz.currentChar!] }));
    }
    set((s) => ({ totalQuestions: s.totalQuestions + 1 }));

    set({
      charQuiz: { ...charQuiz, selectedAnswer: value, isCorrect, answered: true },
    });

    setTimeout(() => {
      get().nextCharQuestion();
    }, 1500);
  },

  toggleCharHint: () => {
    set((s) => ({ charQuiz: { ...s.charQuiz, showHint: !s.charQuiz.showHint } }));
  },

  setCharDirection: (dir) => {
    set((s) => ({ charQuiz: { ...s.charQuiz, direction: dir } }));
    get().nextCharQuestion();
  },

  // Sentence Quiz
  sentenceQuiz: { ...initialSentenceQuiz },

  initSentenceQuiz: async () => {
    const { kanaType } = get();
    set({
      view: "sentence",
      quizMode: "sentence",
      score: 0,
      totalQuestions: 0,
      wrongAnswers: [],
      results: null,
      sentenceQuiz: { ...initialSentenceQuiz, loading: true },
    });

    try {
      const res = await fetch(`/api/quiz/sentence?type=${kanaType}`);
      if (res.ok) {
        const data = await res.json();
        set({
          sentenceQuiz: {
            ...initialSentenceQuiz,
            currentSentence: {
              id: data.id,
              text: data.text,
              reading: data.reading,
              meaning: data.meaning,
              kanaType: data.kanaType,
              missingIndices: data.missingIndices,
              blanks: data.blanks,
            },
            options: data.options,
            hint: data.hint,
          },
        });
      }
    } catch {
      set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: false } }));
    }
  },

  nextSentenceQuestion: async () => {
    const { totalQuestions, questionsPerSession, score } = get();

    if (totalQuestions >= questionsPerSession) {
      const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
      set({
        view: "results",
        results: { total: totalQuestions, correct: score, wrong: totalQuestions - score, accuracy },
      });
      return;
    }

    set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: true } }));

    try {
      const { kanaType } = get();
      const res = await fetch(`/api/quiz/sentence?type=${kanaType}`);
      if (res.ok) {
        const data = await res.json();
        set({
          sentenceQuiz: {
            ...initialSentenceQuiz,
            currentSentence: {
              id: data.id,
              text: data.text,
              reading: data.reading,
              meaning: data.meaning,
              kanaType: data.kanaType,
              missingIndices: data.missingIndices,
              blanks: data.blanks,
            },
            options: data.options,
            hint: data.hint,
          },
        });
      }
    } catch {
      set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: false } }));
    }
  },

  fetchNextBlankOptions: async (blankChar: string) => {
    set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: true } }));
    try {
      const { kanaType } = get();
      const res = await fetch("/api/quiz/sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kanaType, blankChar }),
      });
      if (res.ok) {
        const data = await res.json();
        set((s) => ({
          sentenceQuiz: {
            ...s.sentenceQuiz,
            loading: false,
            options: data.options,
            hint: data.hint,
          },
        }));
      }
    } catch {
      set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, loading: false } }));
    }
  },

  answerSentenceQuestion: (char: string) => {
    const { sentenceQuiz, kanaType } = get();
    if (sentenceQuiz.answered || !sentenceQuiz.currentSentence) return;

    const correctChar = sentenceQuiz.currentSentence.blanks[sentenceQuiz.currentBlankIndex];
    const isCorrect = char === correctChar;

    if (isCorrect) {
      set((s) => ({ score: s.score + 1 }));
    } else {
      const wrongKana: KanaOption = { id: 0, char: correctChar, romaji: "?" };
      set((s) => ({ wrongAnswers: [...s.wrongAnswers, wrongKana] }));
    }
    set((s) => ({ totalQuestions: s.totalQuestions + 1 }));

    const newFilledBlanks = [...sentenceQuiz.filledBlanks, char];
    const nextBlankIndex = sentenceQuiz.currentBlankIndex + 1;
    const isLastBlank = nextBlankIndex >= sentenceQuiz.currentSentence.missingIndices.length;

    if (isLastBlank) {
      set({
        sentenceQuiz: {
          ...sentenceQuiz,
          selectedAnswer: char,
          isCorrect,
          answered: true,
          filledBlanks: newFilledBlanks,
        },
      });
      setTimeout(() => {
        get().nextSentenceQuestion();
      }, 1500);
    } else {
      const nextCorrectChar = sentenceQuiz.currentSentence.blanks[nextBlankIndex];
      set({
        sentenceQuiz: {
          ...sentenceQuiz,
          currentBlankIndex: nextBlankIndex,
          selectedAnswer: null,
          isCorrect: null,
          showHint: false,
          answered: false,
          filledBlanks: newFilledBlanks,
        },
      });
      get().fetchNextBlankOptions(nextCorrectChar);
    }
  },

  toggleSentenceHint: () => {
    set((s) => ({ sentenceQuiz: { ...s.sentenceQuiz, showHint: !s.sentenceQuiz.showHint } }));
  },

  resetAll: () => {
    set({
      view: "landing",
      quizMode: "character",
      score: 0,
      totalQuestions: 0,
      wrongAnswers: [],
      results: null,
      charQuiz: { ...initialCharQuiz },
      sentenceQuiz: { ...initialSentenceQuiz },
    });
  },
}));