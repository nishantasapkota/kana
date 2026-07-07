"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Languages,
  BookOpen,
  PenLine,
  Sparkles,
  ChevronRight,
  Cherry,
  Database,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export function Landing() {
  const {
    setKanaType,
    initCharQuiz,
    initSentenceQuiz,
    setQuestionsPerSession,
    questionsPerSession,
    setView,
  } = useAppStore();

  const handleStart = (
    type: "hiragana" | "katakana" | "numbers" | "days",
    mode: "character" | "sentence",
  ) => {
    setKanaType(type);
    if (mode === "character") {
      initCharQuiz();
    } else {
      initSentenceQuiz();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl mx-auto text-center space-y-6"
        >
          {/* Logo / Title */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Cherry className="size-7 text-rose-500" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Kana Practice
            </span>
            <Cherry className="size-7 text-rose-500" />
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
          >
            Learn{" "}
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Japanese
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto"
          >
            Master Hiragana and Katakana through interactive quizzes. Choose
            your script and start practicing!
          </motion.p>

          {/* Kana Type Selection */}
          <motion.div custom={3} variants={fadeUp} className="pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Choose a script to begin
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Hiragana Card */}
              <Card className="group cursor-pointer border-2 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 hover:shadow-lg hover:shadow-rose-100 dark:hover:shadow-rose-950/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400">
                      <Languages className="size-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Hiragana</h3>
                      <p className="text-xs text-muted-foreground">
                        ひらがな — 46 characters
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStart("hiragana", "character")}
                      className="w-full justify-between bg-rose-500 hover:bg-rose-600 text-white"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4" />
                        Character Quiz
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleStart("hiragana", "sentence")}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <PenLine className="size-4" />
                        Sentence Mode
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Katakana Card */}
              <Card className="group cursor-pointer border-2 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100 dark:hover:shadow-amber-950/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                      <Languages className="size-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Katakana</h3>
                      <p className="text-xs text-muted-foreground">
                        カタカナ — 46 characters
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStart("katakana", "character")}
                      className="w-full justify-between bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4" />
                        Character Quiz
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleStart("katakana", "sentence")}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <PenLine className="size-4" />
                        Sentence Mode
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Numbers Card */}
              <Card className="group cursor-pointer border-2 hover:border-sky-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                      <Languages className="size-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Numbers</h3>
                      <p className="text-xs text-muted-foreground">
                        0–9 — digits
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStart("numbers", "character")}
                      className="w-full justify-between bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4" />
                        Character Quiz
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleStart("numbers", "sentence")}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <PenLine className="size-4" />
                        Sentence Mode
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Days Card */}
              <Card className="group cursor-pointer border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Languages className="size-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Days</h3>
                      <p className="text-xs text-muted-foreground">
                        Days of the week — 日 月 火 水 木 金 土
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleStart("days", "character")}
                      className="w-full justify-between bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="size-4" />
                        Character Quiz
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleStart("days", "sentence")}
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <PenLine className="size-4" />
                        Sentence Mode
                      </span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Session Length */}
          <motion.div custom={4} variants={fadeUp} className="pt-4">
            <div className="inline-flex items-center gap-3 bg-muted/50 rounded-full px-4 py-2">
              <Sparkles className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Questions per session:
              </span>
              <div className="flex gap-1">
                {[5, 10, 15, 20].map((n) => (
                  <Badge
                    key={n}
                    variant={questionsPerSession === n ? "default" : "outline"}
                    className="cursor-pointer px-3 py-0.5 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setQuestionsPerSession(n)}
                  >
                    {n}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Admin Link */}
          <motion.div custom={5} variants={fadeUp} className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("admin")}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Database className="size-3.5" />
              Manage Sentences
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
