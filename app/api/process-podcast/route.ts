import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { transcript, podcastName, episodeTitle } = await req.json();

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Process this podcast transcript and generate all content assets.
Podcast: ${podcastName || "Unknown Podcast"}
Episode: ${episodeTitle || "Episode"}

Transcript:
${transcript}

Return JSON with exactly this shape:
{"summary":"2-3 sentence episode summary","chapters":[{"timestamp":"0:00","title":"string","summary":"string"}],"showNotes":"full show notes in markdown","keyInsights":["string"],"quotes":["memorable quote string"],"tweetThread":["tweet1","tweet2","tweet3","tweet4","tweet5"],"linkedinPost":"string","shortClips":[{"title":"string","startTimestamp":"string","endTimestamp":"string","clip":"verbatim quote from transcript"}],"seoTitle":"string","seoDescription":"string","tags":["string"]}`,
      },
    ],
  });

  const c = msg.content[0];
  if (c.type !== "text")
    return NextResponse.json({ error: "No response" }, { status: 500 });

  try {
    const m = c.text.match(/\{[\s\S]*\}/);
    if (m) return NextResponse.json(JSON.parse(m[0]));
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Failed to parse" }, { status: 500 });
  }
}
