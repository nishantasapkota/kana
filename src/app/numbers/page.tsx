"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const NumbersQuiz = dynamic(
  () => import("@/components/numbers-quiz").then((m) => m.NumbersQuiz),
  { ssr: false },
);
const SentenceQuiz = dynamic(
  () => import("@/components/sentence-quiz").then((m) => m.SentenceQuiz),
  { ssr: false },
);

export default function NumbersPage() {
  const [mode, setMode] = useState<"character" | "sentence">("character");
  const setKanaType = useAppStore((s) => s.setKanaType);
  const initSentenceQuiz = useAppStore((s) => s.initSentenceQuiz);

  useEffect(() => {
    if (mode === "sentence") {
      setKanaType("numbers");
      initSentenceQuiz();
    }
  }, [mode, setKanaType, initSentenceQuiz]);

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button
              variant={mode === "character" ? "default" : "outline"}
              onClick={() => setMode("character")}
            >
              Character
            </Button>
            <Button
              variant={mode === "sentence" ? "default" : "outline"}
              onClick={() => setMode("sentence")}
            >
              Sentence
            </Button>
          </div>

          {mode === "character" ? (
            <NumbersQuiz />
          ) : (
            <div className="bg-card rounded-xl p-4">
              <SentenceQuiz />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
