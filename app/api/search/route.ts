import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth";

export const runtime = "nodejs";

const querySchema = z.object({
  q: z.string().trim().min(2).max(120),
  platform: z.enum(["spotify", "podcast", "youtube", "rumble"]).optional(),
});

export async function GET(req: NextRequest) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ detail: "Sign in required.", results: [] }, { status: 401 });

  const parsed = querySchema.safeParse({
    q: req.nextUrl.searchParams.get("q") ?? "",
    platform: req.nextUrl.searchParams.get("platform") ?? "podcast",
  });
  if (!parsed.success) {
    return NextResponse.json({ detail: "Enter at least two characters.", results: [] }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(parsed.data.q)}&media=podcast&limit=8`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) {
      return NextResponse.json({ detail: "Podcast lookup is unavailable right now.", results: [] }, { status: 200 });
    }
    const data = (await response.json()) as {
      results?: {
        collectionId: number;
        collectionName?: string;
        artistName?: string;
        feedUrl?: string;
        primaryGenreName?: string;
        artworkUrl600?: string;
      }[];
    };
    const results = (data.results ?? []).map((item) => ({
      id: String(item.collectionId),
      title: item.collectionName ?? "Untitled show",
      creator: item.artistName ?? "",
      feedUrl: item.feedUrl ?? "",
      genre: item.primaryGenreName ?? "",
      artwork: item.artworkUrl600 ?? "",
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ detail: "Podcast lookup is unavailable right now.", results: [] }, { status: 200 });
  }
}
