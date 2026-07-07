import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hiragana";

  if (type !== "hiragana" && type !== "katakana" && type !== "numbers" && type !== "days") {
    return NextResponse.json({ error: "Invalid type." }, { status: 400 });
  }

  const [allSentences, allChars] = await Promise.all([
    db.kanaSentence.findMany({ where: { kanaType: type } }),
    db.kanaCharacter.findMany({ where: { kanaType: type } }),
  ]);

  if (allSentences.length === 0) {
    return NextResponse.json({ error: "No sentences found." }, { status: 500 });
  }

  const charSet = new Set(allChars.map((c) => c.char));

  // Try up to 20 times to find a sentence whose blanks are all in the kana table
  for (let attempt = 0; attempt < 20; attempt++) {
    const rawSentence = getRandomItems(allSentences, 1)[0];
    const missingIndices = JSON.parse(rawSentence.missingIndices) as number[];
    const blanks = JSON.parse(rawSentence.blanks) as string[];

    // Check that the first blank character exists in the kana table
    const correctChar = blanks[0];
    if (!charSet.has(correctChar)) continue;

    const correctKana = allChars.find((c) => c.char === correctChar);
    if (!correctKana) continue;

    const others = allChars.filter((c) => c.char !== correctChar);
    const wrongOptions = getRandomItems(others, 3);
    const options = [correctKana, ...wrongOptions].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      id: rawSentence.id,
      text: rawSentence.text,
      reading: rawSentence.reading,
      meaning: rawSentence.meaning,
      kanaType: rawSentence.kanaType,
      missingIndices,
      blanks,
      blankIndex: 0,
      options: options.map((o) => ({ id: o.id, char: o.char, romaji: o.romaji })),
      hint: `Hint: The answer is ${correctChar}`,
    });
  }

  return NextResponse.json({ error: "Could not find a valid sentence quiz." }, { status: 500 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, blankChar } = body;

    const allChars = await db.kanaCharacter.findMany({ where: { kanaType: type } });
    const correctKana = allChars.find((c) => c.char === blankChar);

    if (!correctKana) {
      return NextResponse.json({ error: "Character not found." }, { status: 404 });
    }

    const others = allChars.filter((c) => c.char !== blankChar);
    const wrongOptions = getRandomItems(others, 3);
    const options = [correctKana, ...wrongOptions].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      options: options.map((o) => ({ id: o.id, char: o.char, romaji: o.romaji })),
      hint: `Hint: The answer is ${blankChar}`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to get options." }, { status: 500 });
  }
}