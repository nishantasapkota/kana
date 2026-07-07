import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hiragana";
  const direction = searchParams.get("direction") || "char-to-romaji";

  if (type !== "hiragana" && type !== "katakana" && type !== "numbers" && type !== "days") {
    return NextResponse.json({ error: "Invalid type." }, { status: 400 });
  }

  const allChars = await db.kanaCharacter.findMany({
    where: { kanaType: type },
  });

  if (allChars.length < 4) {
    return NextResponse.json({ error: "Not enough characters." }, { status: 500 });
  }

  const char = getRandomItems(allChars, 1)[0];
  const others = allChars.filter((c) => c.romaji !== char.romaji);
  const wrongOptions = getRandomItems(others, 3);
  const options = [char, ...wrongOptions].sort(() => Math.random() - 0.5);

  return NextResponse.json({
    id: char.id,
    char: char.char,
    romaji: char.romaji,
    group: char.group,
    direction,
    options: options.map((o) => ({ id: o.id, char: o.char, romaji: o.romaji })),
    hint: `Hint: ${char.group} — starts with "${char.romaji[0]}"`,
  });
}