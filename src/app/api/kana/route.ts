import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hiragana";

  if (type !== "hiragana" && type !== "katakana") {
    return NextResponse.json({ error: "Invalid type. Use 'hiragana' or 'katakana'." }, { status: 400 });
  }

  const characters = await db.kanaCharacter.findMany({
    where: { kanaType: type },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(characters);
}