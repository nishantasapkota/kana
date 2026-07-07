"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  RotateCcw,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Star,
  BookOpen,
  PenLine,
} from "lucide-react";

export function Results() {
  const { results, wrongAnswers, quizMode, kanaType, resetAll, initCharQuiz, initSentenceQuiz } =
    useAppStore();

  if (!results) return null;

  const { total, correct, wrong, accuracy } = results;

  const getGrade = () => {
    if (accuracy >= 90) return { label: "Excellent!", emoji: "🌟", color: "text-amber-500" };
    if (accuracy >= 70) return { label: "Great Job!", emoji: "🎉", color: "text-emerald-500" };
    if (accuracy >= 50) return { label: "Good Effort!", emoji: "💪", color: "text-blue-500" };
    return { label: "Keep Practicing!", emoji: "📚", color: "text-rose-500" };
  };

  const grade = getGrade();

  const handleRetry = () => {
    if (quizMode === "character") {
      initCharQuiz();
    } else {
      initSentenceQuiz();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md mx-auto space-y-6"
      >
        {/* Grade */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-5xl mb-2"
          >
            {grade.emoji}
          </motion.div>
          <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
          <p className="text-sm text-muted-foreground">
            {quizMode === "character" ? "Character Quiz" : "Sentence Mode"} •{" "}
            {kanaType === "hiragana" ? "Hiragana" : "Katakana"}
          </p>
        </div>

        {/* Score Card */}
        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            {/* Accuracy Circle */}
            <div className="flex justify-center">
              <div className="relative size-32">
                <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/50"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 52 * (1 - accuracy / 100),
                    }}
                    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                    className={
                      accuracy >= 70
                        ? "text-emerald-500"
                        : accuracy >= 50
                          ? "text-amber-500"
                          : "text-rose-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{accuracy}%</span>
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Target className="size-3.5" />
                  <span className="text-xs">Total</span>
                </div>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-emerald-500">
                  <CheckCircle2 className="size-3.5" />
                  <span className="text-xs">Correct</span>
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{correct}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-rose-500">
                  <XCircle className="size-3.5" />
                  <span className="text-xs">Wrong</span>
                </div>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{wrong}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wrong Answers Review */}
        {wrongAnswers.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="size-4 text-rose-500" />
                <h3 className="font-semibold text-sm">Review Mistakes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {wrongAnswers.map((item, i) => (
                  <motion.div
                    key={`${item.char}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                  >
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 text-sm font-mono"
                    >
                      <span className="font-bold text-base mr-2">{item.char}</span>
                      <span className="text-muted-foreground">{item.romaji}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRetry}
            className="flex-1 gap-2"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={resetAll}
            className="flex-1 gap-2"
          >
            <Home className="size-4" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}