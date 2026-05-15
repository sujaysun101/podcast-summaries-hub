import { NextRequest, NextResponse } from "next/server";

type Platform = "youtube" | "spotify" | "rumble";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator: string;
  platform: Platform;
  url: string;
  duration?: string;
  metadata?: Record<string, string>;
}

async function searchYouTube(query: string): Promise<SearchResult[]> {
  // Piped API — open-source YouTube proxy, no key required
  const res = await fetch(
    `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=all`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("YouTube search failed");
  const data = await res.json();

  return (data.items || [])
    .filter((item: { type: string }) => item.type === "stream")
    .slice(0, 12)
    .map((item: {
      url: string; title: string; thumbnail: string;
      uploaderName: string; shortDescription: string; duration: number;
    }) => ({
      id: item.url.replace("/watch?v=", ""),
      title: item.title,
      description: item.shortDescription || "",
      thumbnail: item.thumbnail,
      creator: item.uploaderName,
      platform: "youtube" as Platform,
      url: `https://www.youtube.com${item.url}`,
      duration: item.duration ? `${Math.floor(item.duration / 60)}m` : "",
    }));
}

async function searchSpotify(query: string): Promise<SearchResult[]> {
  // iTunes Search API — free, no auth, returns podcasts
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=12`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Podcast search failed");
  const data = await res.json();

  return (data.results || []).map((item: {
    collectionId: number; trackName: string; collectionName: string;
    artworkUrl600: string; artistName: string; feedUrl: string; primaryGenreName: string;
  }) => ({
    id: String(item.collectionId),
    title: item.trackName || item.collectionName,
    description: `by ${item.artistName}`,
    thumbnail: item.artworkUrl600,
    creator: item.artistName,
    platform: "spotify" as Platform,
    url: item.feedUrl || "",
    metadata: { feedUrl: item.feedUrl, genre: item.primaryGenreName },
  }));
}

async function searchRumble(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `https://rumble.com/search/video?q=${encodeURIComponent(query)}`,
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; YieldCast/1.0)" }, next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Rumble search failed");
  const html = await res.text();

  const results: SearchResult[] = [];
  const itemRegex = /<article[^>]*class="[^"]*video-item[^"]*"[\s\S]*?<\/article>/g;
  const titleRegex = /title="([^"]+)"/;
  const thumbRegex = /src="(https:\/\/sp\.rmbl\.ws[^"]+)"/;
  const urlRegex = /href="(\/[a-z0-9\-]+\.html)"/;
  const channelRegex = /class="[^"]*rumbles-count[^"]*"[\s\S]*?<a[^>]*>([^<]+)<\/a>/;

  let match;
  while ((match = itemRegex.exec(html)) !== null && results.length < 12) {
    const block = match[0];
    const title = titleRegex.exec(block)?.[1] || "";
    const thumb = thumbRegex.exec(block)?.[1] || "";
    const path = urlRegex.exec(block)?.[1] || "";
    const channel = channelRegex.exec(block)?.[1]?.trim() || "Rumble";

    if (title && path) {
      results.push({
        id: path.replace(/[^a-z0-9]/gi, ""),
        title,
        description: "",
        thumbnail: thumb,
        creator: channel,
        platform: "rumble",
        url: `https://rumble.com${path}`,
      });
    }
  }
  return results;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const platform = searchParams.get("platform") as Platform;
  const query = searchParams.get("q") || "";

  if (!query || !platform) {
    return NextResponse.json({ error: "Missing platform or q" }, { status: 400 });
  }

  try {
    let results: SearchResult[] = [];
    if (platform === "youtube") results = await searchYouTube(query);
    else if (platform === "spotify") results = await searchSpotify(query);
    else if (platform === "rumble") results = await searchRumble(query);
    return NextResponse.json({ results });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: msg, results: [] }, { status: 500 });
  }
}
