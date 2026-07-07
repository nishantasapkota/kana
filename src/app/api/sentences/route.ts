import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let where: { kanaType?: string } = {};
  if (type && type !== "all") {
    if (type !== "hiragana" && type !== "katakana" && type !== "numbers" && type !== "days") {
      return NextResponse.json({ error: "Invalid type. Use 'hiragana', 'katakana', 'numbers', 'days', or 'all'." }, { status: 400 });
    }
    where = { kanaType: type };
  }

  const sentences = await db.kanaSentence.findMany({
    where,
    orderBy: { id: "asc" },
  });

  const parsed = sentences.map((s) => ({
    ...s,
    missingIndices: JSON.parse(s.missingIndices) as number[],
    blanks: JSON.parse(s.blanks) as string[],
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, reading, meaning, kanaType, missingIndices, blanks } = body;

    if (!text || !reading || !meaning || !kanaType || !missingIndices || !blanks) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (kanaType !== "hiragana" && kanaType !== "katakana" && kanaType !== "numbers" && kanaType !== "days") {
      return NextResponse.json({ error: "kanaType must be 'hiragana', 'katakana', 'numbers' or 'days'." }, { status: 400 });
    }

    if (!Array.isArray(missingIndices) || !Array.isArray(blanks)) {
      return NextResponse.json({ error: "missingIndices and blanks must be arrays." }, { status: 400 });
    }

    if (missingIndices.length !== blanks.length) {
      return NextResponse.json({ error: "missingIndices and blanks must have the same length." }, { status: 400 });
    }

    const sentence = await db.kanaSentence.create({
      data: {
        text,
        reading,
        meaning,
        kanaType,
        missingIndices: JSON.stringify(missingIndices),
        blanks: JSON.stringify(blanks),
      },
    });

    return NextResponse.json({
      ...sentence,
      missingIndices: JSON.parse(sentence.missingIndices),
      blanks: JSON.parse(sentence.blanks),
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating sentence:", error);
    return NextResponse.json({ error: "Failed to create sentence." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, reading, meaning, kanaType, missingIndices, blanks } = body;

    if (!id || !text || !reading || !meaning || !kanaType || !missingIndices || !blanks) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (kanaType !== "hiragana" && kanaType !== "katakana" && kanaType !== "numbers" && kanaType !== "days") {
      return NextResponse.json({ error: "kanaType must be 'hiragana', 'katakana', 'numbers' or 'days'." }, { status: 400 });
    }

    if (!Array.isArray(missingIndices) || !Array.isArray(blanks)) {
      return NextResponse.json({ error: "missingIndices and blanks must be arrays." }, { status: 400 });
    }

    if (missingIndices.length !== blanks.length) {
      return NextResponse.json({ error: "missingIndices and blanks must have the same length." }, { status: 400 });
    }

    const sentence = await db.kanaSentence.update({
      where: { id },
      data: {
        text,
        reading,
        meaning,
        kanaType,
        missingIndices: JSON.stringify(missingIndices),
        blanks: JSON.stringify(blanks),
      },
    });

    return NextResponse.json({
      ...sentence,
      missingIndices: JSON.parse(sentence.missingIndices),
      blanks: JSON.parse(sentence.blanks),
    });
  } catch (error) {
    console.error("Error updating sentence:", error);
    return NextResponse.json({ error: "Failed to update sentence." }, { status: 500 });
  }
}