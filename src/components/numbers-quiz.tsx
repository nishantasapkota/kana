"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type NumItem = { id: number; char: string; romaji: string; group?: string };

export function NumbersQuiz() {
  const [items, setItems] = useState<NumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<"small" | "medium" | "large" | "huge">(
    "small",
  );
  const [question, setQuestion] = useState<NumItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/kana?type=numbers");
        if (!res.ok) throw new Error("failed");
        const data: NumItem[] = await res.json();
        if (mounted) setItems(data);
      } catch {
        // fallback to static file
        try {
          const res2 = await fetch("/kana-data.json");
          const d = await res2.json();
          const data: NumItem[] = (d.characters || []).filter(
            (c: any) => c.kanaType === "numbers",
          );
          if (mounted) setItems(data);
        } catch {
          if (mounted) setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!items.length) return;
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, preset]);

  const presetFilter = (it: NumItem) => {
    const n = parseInt(it.romaji || "NaN", 10);
    if (isNaN(n)) return false;
    if (preset === "small") return n >= 0 && n < 10;
    if (preset === "medium") return n >= 10 && n < 1000;
    if (preset === "large") return n >= 1000 && n < 1000000;
    return n >= 1000000;
  };

  const getOptions = (correct: NumItem, pool: NumItem[]) => {
    const others = pool
      .filter((p) => p.romaji !== correct.romaji)
      .map((p) => p.romaji);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct.romaji, ...shuffled].sort(() => Math.random() - 0.5);
  };

  const nextQuestion = () => {
    setSelected(null);
    setAnswered(false);
    setIsCorrect(null);
    const pool = items.filter(presetFilter);
    if (!pool.length) {
      setQuestion(null);
      setOptions([]);
      return;
    }
    const q = pool[Math.floor(Math.random() * pool.length)];
    setQuestion(q);
    setOptions(getOptions(q, pool));
  };

  const answer = (val: string) => {
    if (!question) return;
    const ok = val === question.romaji;
    setSelected(val);
    setAnswered(true);
    setIsCorrect(ok);
    setTotal((t) => t + 1);
    if (ok) setScore((s) => s + 1);
    setTimeout(() => nextQuestion(), 1200);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!question)
    return (
      <div className="p-8 text-center">
        No numbers available for the selected range.
      </div>
    );

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Numbers Quiz</h3>
          <div className="inline-flex gap-2">
            <Badge
              variant={preset === "small" ? "default" : "outline"}
              onClick={() => setPreset("small")}
            >
              Small
            </Badge>
            <Badge
              variant={preset === "medium" ? "default" : "outline"}
              onClick={() => setPreset("medium")}
            >
              Medium
            </Badge>
            <Badge
              variant={preset === "large" ? "default" : "outline"}
              onClick={() => setPreset("large")}
            >
              Large
            </Badge>
            <Badge
              variant={preset === "huge" ? "default" : "outline"}
              onClick={() => setPreset("huge")}
            >
              Huge
            </Badge>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Choose the numeric value for this hiragana
          </p>
          <div className="w-full flex items-center justify-center rounded-2xl bg-muted/50 border-2 border-dashed border-muted-foreground/20 py-4 px-6">
            <div className="max-w-full overflow-hidden">
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold select-none whitespace-normal break-words">
                {question.char}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <Button
              key={opt}
              onClick={() => answer(opt)}
              disabled={answered}
              className={`h-14 sm:h-16 text-lg font-semibold ${answered ? (opt === question.romaji ? "bg-emerald-600 text-white" : opt === selected ? "bg-rose-600 text-white" : "opacity-60") : ""}`}
            >
              {opt}
            </Button>
          ))}
        </div>

        {answered && (
          <div className="text-center">
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <CheckCircle2 /> <span>Correct</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-rose-600">
                <div className="flex items-center gap-2">
                  <XCircle /> <span>Incorrect</span>
                </div>
                <div className="text-sm">
                  Answer: <strong>{question.romaji}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Score:{" "}
            <strong className="text-foreground">
              {score}/{total}
            </strong>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setScore(0);
              setTotal(0);
              nextQuestion();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NumbersQuiz;
