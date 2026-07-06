"use client";

import { useAppStore, type KanaType } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Home,
  Lightbulb,
  RotateCcw,
  ArrowLeftRight,
  BookOpen,
  PenLine,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function QuizHeader() {
  const {
    view,
    kanaType,
    setKanaType,
    score,
    totalQuestions,
    questionsPerSession,
    charQuiz,
    sentenceQuiz,
    resetAll,
    toggleCharHint,
    toggleSentenceHint,
    setCharDirection,
    nextCharQuestion,
    nextSentenceQuestion,
  } = useAppStore();

  const progress =
    questionsPerSession > 0
      ? (totalQuestions / questionsPerSession) * 100
      : 0;
  const accuracy =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const isCharacterMode = view === "character";
  const quiz = isCharacterMode ? charQuiz : sentenceQuiz;
  const isAnswered = quiz.answered;
  const showHint = quiz.showHint;

  const handleToggleKana = () => {
    setKanaType(kanaType === "hiragana" ? "katakana" : "hiragana");
  };

  const handleSkip = () => {
    if (isCharacterMode) {
      nextCharQuestion();
    } else {
      nextSentenceQuestion();
    }
  };

  const handleHint = () => {
    if (isCharacterMode) {
      toggleCharHint();
    } else {
      toggleSentenceHint();
    }
  };

  const handleDirection = () => {
    if (isCharacterMode) {
      setCharDirection(
        charQuiz.direction === "char-to-romaji" ? "romaji-to-char" : "char-to-romaji"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={resetAll}
              aria-label="Go home"
            >
              <Home className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Badge
              variant={kanaType === "hiragana" ? "default" : "secondary"}
              className="font-medium"
            >
              {kanaType === "hiragana" ? "ひらがな" : "カタカナ"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Direction toggle (character mode only) */}
            {isCharacterMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDirection}
                className="h-8 gap-1.5 text-xs"
                title="Toggle quiz direction"
              >
                <ArrowLeftRight className="size-3.5" />
                {charQuiz.direction === "char-to-romaji"
                  ? "Kana → Romaji"
                  : "Romaji → Kana"}
              </Button>
            )}

            {/* Skip button */}
            {!isAnswered && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleSkip}
                title="Skip question"
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}

            {/* Hint button */}
            {!isAnswered && (
              <Button
                variant={showHint ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                onClick={handleHint}
                title={showHint ? "Hide hint" : "Show hint"}
              >
                <Lightbulb className="size-4" />
              </Button>
            )}

            {/* Kana type toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleKana}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              {kanaType === "hiragana" ? "Switch to カタカナ" : "Switch to ひらがな"}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-3">
          <Progress value={progress} className="h-1.5 flex-1" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <Target className="size-3" />
              {totalQuestions}/{questionsPerSession}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" />
              {score}
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="size-3 text-rose-500" />
              {totalQuestions - score}
            </span>
            <span className="font-medium">{accuracy}%</span>
          </div>
        </div>
      </div>
    </header>
  );
}