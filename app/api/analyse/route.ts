import { NextRequest, NextResponse } from "next/server";
import { analyseInputSchema, runAnalysis } from "@/lib/ai";
import { getViewer } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { store } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }

  const limited = await rateLimit(viewer.userId);
  if (!limited.ok) {
    return NextResponse.json(
      { detail: "Rate limit reached. Try again in a minute.", remaining: limited.remaining },
      { status: 429 },
    );
  }

  let payload: unknown;
  const contentType = req.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      payload = {
        rss_url: form.get("rss_url") ?? undefined,
        title: form.get("title") ?? undefined,
        description: form.get("description") ?? undefined,
        creator: form.get("creator") ?? undefined,
        platform: form.get("platform") ?? undefined,
        genre: form.get("genre") ?? undefined,
        refinement: form.get("refinement") ?? undefined,
        showId: form.get("showId") ?? undefined,
      };
    } else {
      return NextResponse.json({ detail: "Unsupported content type." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ detail: "Could not read the request body." }, { status: 400 });
  }

  const parsed = analyseInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ detail: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const result = await runAnalysis(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ detail: result.detail }, { status: result.status });
  }

  if (parsed.data.showId) {
    const saved = await store.saveAnalysis(viewer.userId, parsed.data.showId, result.analysis);
    if (!saved) {
      return NextResponse.json({ detail: "Show not found for this account." }, { status: 400 });
    }
  }

  return NextResponse.json({ ...result.analysis, remaining: limited.remaining });
}
