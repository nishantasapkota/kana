"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Database,
  CheckCircle2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export function AdminForm() {
  const {
    setView,
    allSentences,
    fetchSentences,
    addSentence,
    deleteSentence,
    setEditSentenceId,
    kanaType,
  } = useAppStore();
  const [formKanaType, setFormKanaType] = useState<string>("hiragana");
  const [text, setText] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [blankAnswers, setBlankAnswers] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchSentences();
  }, [fetchSentences]);

  // If store-level edit id is set externally, populate form
  const editSentenceId = useAppStore((s) => s.editSentenceId);
  useEffect(() => {
    if (!editSentenceId) return;
    const s = allSentences.find((x) => x.id === editSentenceId);
    if (s) {
      setEditingId(s.id);
      setFormKanaType(s.kanaType);
      const chars = s.text.split("");
      let offset = 0;
      for (const idx of (s as any).missingIndices || []) {
        chars.splice(idx + offset, 0, "＿");
        offset += 1;
      }
      setText(chars.join(""));
      setReading((s as any).reading || "");
      setMeaning((s as any).meaning || "");
      setBlankAnswers(((s as any).blanks || []).join(", "));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSentenceId]);

  useEffect(() => {
    // When kanaType in store changes, update form default
    setFormKanaType(kanaType);
  }, [kanaType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Auto-detect missing indices: find characters that differ between text and reading hint
    // Simple approach: user marks blanks with ＿ (full-width underscore)
    const chars = text.split("");
    const missingIndices: number[] = [];
    const blanks: string[] = [];

    // Parse: find all ＿ characters
    chars.forEach((char, i) => {
      if (char === "＿" || char === "_") {
        missingIndices.push(i);
      }
    });

    if (missingIndices.length === 0) {
      alert(
        "Please mark blank positions with ＿ (full-width) or _ (half-width). Example: おは＿ございます",
      );
      return;
    }

    // User needs to provide the blank answers
    const blankAnswersArr = parseBlankAnswers(
      blankAnswers,
      missingIndices.length,
    );
    if (!blankAnswersArr) return;

    setSubmitting(true);
    let ok = false;
    if (editingId) {
      // Update existing
      try {
        const res = await fetch(`/api/sentences`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            text: text.replace(/[＿_]/g, ""),
            reading,
            meaning,
            kanaType: formKanaType,
            missingIndices,
            blanks: blankAnswersArr,
          }),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
    } else {
      ok = await addSentence({
        text: text.replace(/[＿_]/g, ""),
        reading,
        meaning,
        kanaType: formKanaType,
        missingIndices,
        blanks: blankAnswersArr,
      });
    }

    setSubmitting(false);
    if (ok) {
      setText("");
      setReading("");
      setMeaning("");
      setEditingId(null);
      setEditSentenceId(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      fetchSentences();
    }
  };

  const startEdit = (s: {
    id: number;
    text: string;
    reading: string;
    meaning: string;
    kanaType: string;
    missingIndices: number[];
    blanks: string[];
  }) => {
    setEditingId(s.id);
    setFormKanaType(s.kanaType);
    // Re-insert blanks marker into text at missing indices for editing
    const chars = s.text.split("");
    // Insert placeholders at indices
    let offset = 0;
    for (const idx of s.missingIndices) {
      chars.splice(idx + offset, 0, "＿");
      offset += 1;
    }
    setText(chars.join(""));
    setReading(s.reading);
    setMeaning(s.meaning);
    setBlankAnswers(s.blanks.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText("");
    setReading("");
    setMeaning("");
    setBlankAnswers("");
    setEditSentenceId(null);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      await deleteSentence(id);
      // If we were editing this sentence, clear edit state
      if (editingId === id) {
        setEditingId(null);
        setText("");
        setReading("");
        setMeaning("");
        setBlankAnswers("");
        setEditSentenceId(null);
      }
      fetchSentences();
    } catch {
      // ignore
    }
  };

  const filteredSentences = allSentences.filter((s) => {
    if (filterType === "all") return true;
    return s.kanaType === filterType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setView("landing")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Database className="size-4" />
            <h1 className="font-semibold">Manage Sentences</h1>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {allSentences.length} total
          </Badge>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Add Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="size-4" />
                Add New Sentence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Kana Type</Label>
                    <Select
                      value={formKanaType}
                      onValueChange={setFormKanaType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hiragana">
                          Hiragana ひらがな
                        </SelectItem>
                        <SelectItem value="katakana">
                          Katakana カタカナ
                        </SelectItem>
                        <SelectItem value="numbers">Numbers 0–9</SelectItem>
                        <SelectItem value="days">
                          Days 日 月 火 水 木 金 土
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Meaning (English)</Label>
                    <Input
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      placeholder="e.g., Good morning"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Sentence{" "}
                    <span className="text-muted-foreground font-normal">
                      (use <code className="bg-muted px-1 rounded">＿</code> for
                      blanks)
                    </span>
                  </Label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., おは＿ございます"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Reading (Romaji)</Label>
                  <Input
                    value={reading}
                    onChange={(e) => setReading(e.target.value)}
                    placeholder="e.g., ohayou gozaimasu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Blank Answers{" "}
                    <span className="text-muted-foreground font-normal">
                      (one per blank, comma-separated, in order)
                    </span>
                  </Label>
                  <Input
                    id="blank-answers"
                    value={blankAnswers}
                    onChange={(e) => setBlankAnswers(e.target.value)}
                    placeholder="e.g., よ"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {!submitting && <Plus className="size-4" />}
                    {submitting
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                        ? "Update Sentence"
                        : "Add Sentence"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="ghost" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                  {success && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-sm text-emerald-600"
                    >
                      <CheckCircle2 className="size-4" />
                      Added!
                    </motion.span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sentence List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-3">
                <span>Existing Sentences</span>
                <div className="flex gap-1">
                  {(["all", "hiragana", "katakana"] as const).map((t) => (
                    <Badge
                      key={t}
                      variant={filterType === t ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => setFilterType(t)}
                    >
                      {t === "all"
                        ? "All"
                        : t === "hiragana"
                          ? "ひらがな"
                          : "カタカナ"}
                    </Badge>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredSentences.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No sentences found.
                  </p>
                )}
                {filteredSentences.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            s.kanaType === "hiragana" ? "default" : "secondary"
                          }
                          className="text-xs shrink-0"
                        >
                          {s.kanaType === "hiragana" ? "ひ" : "カ"}
                        </Badge>
                        <span className="font-medium text-sm truncate">
                          {s.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 shrink-0"
                        onClick={() => startEdit(s as any)}
                      >
                        <Database className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete sentence</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this sentence?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleConfirmDelete(s.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground mt-auto">
        <p>Kana Practice — Learn Japanese one character at a time</p>
      </footer>
    </div>
  );
}

function parseBlankAnswers(input: string, expected: number): string[] | null {
  if (!input?.trim()) {
    alert(
      'Please enter the blank answers (comma-separated) in the "Blank Answers" field.',
    );
    return null;
  }
  const answers = input
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (answers.length !== expected) {
    alert(`Expected ${expected} blank answer(s) but got ${answers.length}.`);
    return null;
  }
  return answers;
}
