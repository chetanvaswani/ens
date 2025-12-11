import { NextResponse } from "next/server";
import { initSocialGraphTables } from "@/lib/db";

export async function POST() {
  try {
    await initSocialGraphTables();
    return NextResponse.json({ ok: true, message: "Database initialized" });
  } catch (error) {
    console.error("init-db error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}

