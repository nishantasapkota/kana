import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hiragana";

  if (type !== "hiragana" && type !== "katakana" && type !== "numbers" && type !== "days") {
    return NextResponse.json({ error: "Invalid type. Use 'hiragana', 'katakana', 'numbers', or 'days'." }, { status: 400 });
  }

  const characters =
    type === "numbers"
      ? await db.numbersCharacter.findMany({ orderBy: { id: "asc" } })
      : await db.kanaCharacter.findMany({
          where: { kanaType: type },
          orderBy: { id: "asc" },
        });

  return NextResponse.json(characters);
}