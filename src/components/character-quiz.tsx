"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function CharacterQuiz() {
  const { charQuiz, answerCharQuestion } = useAppStore();
  const { currentChar, options, direction, selectedAnswer, isCorrect, answered, showHint, loading, hint } =
    charQuiz;

  if (loading && !currentChar) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentChar) return null;

  const displayText =
    direction === "char-to-romaji" ? currentChar.char : currentChar.romaji;
  const questionLabel =
    direction === "char-to-romaji"
      ? "What is this character?"
      : "Which character is this?";

  const getButtonStyle = (option: typeof options[0]) => {
    if (!answered) return "outline";
    const value = direction === "char-to-romaji" ? option.romaji : option.char;
    if (value === selectedAnswer) {
      return isCorrect ? "default" : "destructive";
    }
    const correctValue =
      direction === "char-to-romaji"
        ? currentChar.romaji
        : currentChar.char;
    if (value === correctValue && !isCorrect) {
      return "secondary";
    }
    return "outline";
  };

  const getButtonClass = (option: typeof options[0]) => {
    if (!answered) return "";
    const value = direction === "char-to-romaji" ? option.romaji : option.char;
    const correctValue =
      direction === "char-to-romaji" ? currentChar.romaji : currentChar.char;
    if (value === correctValue && isCorrect) {
      return "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white";
    }
    if (value === selectedAnswer && !isCorrect) {
      return "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white";
    }
    if (value === correctValue && !isCorrect) {
      return "bg-emerald-100 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300";
    }
    return "opacity-50";
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">{questionLabel}</p>

          <motion.div
            key={displayText}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="my-6"
          >
            <div className="inline-flex items-center justify-center size-32 sm:size-40 rounded-2xl bg-muted/50 border-2 border-dashed border-muted-foreground/20">
              {loading ? (
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              ) : (
                <span className="text-6xl sm:text-7xl font-bold select-none">
                  {displayText}
                </span>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
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
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {options.map((option, index) => {
              const value =
                direction === "char-to-romaji"
                  ? option.romaji
                  : option.char;
              return (
                <motion.div
                  key={`${option.char}-${option.romaji}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant={getButtonStyle(option)}
                    className={`w-full h-14 sm:h-16 text-lg font-semibold transition-all duration-200 ${getButtonClass(option)}`}
                    onClick={() => answerCharQuestion(value)}
                    disabled={answered || loading}
                  >
                    {direction === "char-to-romaji"
                      ? option.romaji
                      : option.char}
                  </Button>
                </motion.div>
              );
            })}
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
                      {direction === "char-to-romaji"
                        ? currentChar.romaji
                        : currentChar.char}
                    </span>{" "}
                    ({direction === "char-to-romaji" ? currentChar.char : currentChar.romaji})
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