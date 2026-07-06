"use client";

import { useAppStore } from "@/lib/store";
import { Landing } from "@/components/landing";
import { QuizHeader } from "@/components/quiz-header";
import { CharacterQuiz } from "@/components/character-quiz";
import { SentenceQuiz } from "@/components/sentence-quiz";
import { Results } from "@/components/results";
import { AdminForm } from "@/components/admin-form";

export default function Home() {
  const { view } = useAppStore();

  if (view === "landing") {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Landing />
        </main>
        <footer className="border-t py-4 text-center text-xs text-muted-foreground">
          <p>Kana Practice — Learn Japanese one character at a time</p>
        </footer>
      </div>
    );
  }

  if (view === "admin") {
    return <AdminForm />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <QuizHeader />
      <main className="flex-1">
        {view === "character" && <CharacterQuiz />}
        {view === "sentence" && <SentenceQuiz />}
        {view === "results" && <Results />}
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>Kana Practice — Learn Japanese one character at a time</p>
      </footer>
    </div>
  );
}