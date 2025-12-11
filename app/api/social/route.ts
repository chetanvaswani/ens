import { NextRequest, NextResponse } from "next/server";
import { initSocialGraphTables, insertSocialEdge, getSocialEdges, deleteSocialEdge } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ens_from, ens_to } = body ?? {};

    if (
      typeof userId !== "string" ||
      typeof ens_from !== "string" ||
      typeof ens_to !== "string" ||
      !userId.trim() ||
      !ens_from.trim() ||
      !ens_to.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "userId, ens_from, and ens_to are required strings" },
        { status: 400 }
      );
    }

    await initSocialGraphTables();
    const result = await insertSocialEdge({
      userId: userId.trim(),
      ensFrom: ens_from.trim(),
      ensTo: ens_to.trim(),
    });

    return NextResponse.json({ ok: true, edge: result.rows[0] });
  } catch (error) {
    console.error("social POST error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to record social edge" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await initSocialGraphTables();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const limit = searchParams.get("limit");
    const edges = await getSocialEdges({
      userId,
      limit: limit ? Number(limit) : undefined,
    });

    return NextResponse.json({ ok: true, edges: edges.rows });
  } catch (error) {
    console.error("social GET error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch social edges" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initSocialGraphTables();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const userId = searchParams.get("userId") || undefined;

    if (!idParam) {
      return NextResponse.json(
        { ok: false, error: "id query param is required" },
        { status: 400 }
      );
    }

    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { ok: false, error: "id must be a number" },
        { status: 400 }
      );
    }

    const result = await deleteSocialEdge({ id, userId });
    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, error: "Edge not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error("social DELETE error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete social edge" },
      { status: 500 }
    );
  }
}

