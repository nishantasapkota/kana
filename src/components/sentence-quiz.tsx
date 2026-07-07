"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, BookOpen, Loader2 } from "lucide-react";

export function SentenceQuiz() {
  const { sentenceQuiz, answerSentenceQuestion } = useAppStore();
  const {
    currentSentence,
    currentBlankIndex,
    options,
    filledBlanks,
    selectedAnswer,
    isCorrect,
    answered,
    showHint,
    loading,
    hint,
  } = sentenceQuiz;

  if (loading && !currentSentence) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentSentence) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
        No sentence quiz is available for this type yet.
      </div>
    );
  }

  const setView = useAppStore((s) => s.setView);
  const setEditSentenceId = useAppStore((s) => s.setEditSentenceId);

  const correctChar = currentSentence.blanks[currentBlankIndex];
  const totalBlanks = currentSentence.missingIndices.length;

  const blankStartMap = new Map<number, string>();
  currentSentence.missingIndices.forEach((index, idx) => {
    blankStartMap.set(index, currentSentence.blanks[idx]);
  });

  const renderSentence = () => {
    const chars = currentSentence.text.split("");
    const output: React.ReactNode[] = [];
    let i = 0;
    let blankIndex = 0;

    while (i < chars.length) {
      const blankText = blankStartMap.get(i);
      if (blankText) {
        const filled = blankIndex < filledBlanks.length;
        output.push(
          <span
            key={`blank-${i}`}
            className={`inline-flex items-center justify-center size-10 sm:size-12 rounded-lg font-bold text-lg sm:text-xl mx-0.5 ${
              filled
                ? "bg-emerald-100 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : currentBlankIndex === blankIndex && !answered
                  ? "bg-amber-100 dark:bg-amber-950/30 border-2 border-dashed border-amber-400 dark:border-amber-600 text-amber-600 dark:text-amber-400"
                  : "bg-muted border-2 border-dashed border-muted-foreground/20 text-muted-foreground"
            }`}
          >
            {filled ? (
              filledBlanks[blankIndex]
            ) : currentBlankIndex === blankIndex && !answered ? (
              loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "?"
              )
            ) : (
              "?"
            )}
          </span>,
        );
        i += blankText.length;
        blankIndex += 1;
        continue;
      }

      output.push(
        <span
          key={`char-${i}`}
          className="inline-block text-2xl sm:text-3xl font-medium leading-tight mx-0.5"
        >
          {chars[i]}
        </span>,
      );
      i += 1;
    }

    return output;
  };

  const getButtonStyle = (option: (typeof options)[0]) => {
    if (!answered) return "outline";
    if (option.char === selectedAnswer) {
      return isCorrect ? "default" : "destructive";
    }
    if (option.char === correctChar && !isCorrect) {
      return "secondary";
    }
    return "outline";
  };

  const getButtonClass = (option: (typeof options)[0]) => {
    if (!answered) return "";
    if (option.char === correctChar && isCorrect) {
      return "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white";
    }
    if (option.char === selectedAnswer && !isCorrect) {
      return "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white";
    }
    if (option.char === correctChar && !isCorrect) {
      return "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300";
    }
    return "opacity-50";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg mx-auto space-y-8">
        <div className="text-center">
          <Badge variant="outline" className="mb-3">
            <BookOpen className="size-3 mr-1.5" />
            Blank {currentBlankIndex + 1} of {totalBlanks}
          </Badge>
        </div>

        <div className="flex justify-end -mt-6 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditSentenceId(currentSentence?.id || null);
              setView("admin");
            }}
          >
            Edit Sentence
          </Button>
        </div>

        <motion.div
          key={currentSentence.text}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-1 min-h-[3.5rem]">
                {renderSentence()}
              </div>

              <p className="text-center text-sm text-muted-foreground font-mono">
                {currentSentence.reading}
              </p>

              <p className="text-center text-base font-medium text-muted-foreground">
                &quot;{currentSentence.meaning}&quot;
              </p>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center overflow-hidden"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    >
                      {hint}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {options.map((option, index) => (
              <motion.div
                key={`${option.char}-${currentBlankIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={getButtonStyle(option)}
                  className={`w-full h-14 sm:h-16 text-2xl font-bold transition-all duration-200 ${getButtonClass(option)}`}
                  onClick={() => answerSentenceQuestion(option.char)}
                  disabled={answered || loading}
                >
                  {option.char}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                  <span className="font-medium">Correct!</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-rose-600 dark:text-rose-400">
                    <XCircle className="size-5" />
                    <span className="font-medium">Incorrect</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The correct answer is{" "}
                    <span className="font-bold text-foreground">
                      {correctChar}
                    </span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
