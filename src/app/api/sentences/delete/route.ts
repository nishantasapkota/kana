import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    if (type === "numbers") {
      await db.numbersSentence.delete({ where: { id: parseInt(id) } });
    } else {
      await db.kanaSentence.delete({ where: { id: parseInt(id) } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}