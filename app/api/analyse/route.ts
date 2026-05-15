import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an elite podcast monetization expert and media buyer with 15 years of experience placing brands inside niche audio content.

Your goal is to analyse the provided podcast transcript or show description, determine the exact demographic and psychographic profile of the listener, and identify 10 highly relevant, niche brands that would benefit from sponsoring this specific content.

You think in terms of audience intent, purchase readiness, and brand-audience resonance — not just surface-level topic alignment.

Always return a single valid JSON object — no markdown fences, no commentary before or after.`;

const OUTPUT_SCHEMA = `Return ONLY a JSON object with exactly this structure:
{
  "audience_profile": {
    "age_range": "string",
    "primary_interests": ["string"],
    "values": "string",
    "income_bracket": "string",
    "purchase_behaviour": "string",
    "content_themes": "string",
    "engagement_style": "string"
  },
  "brand_matches": [
    {
      "name": "string",
      "category": "string",
      "fit_score": 0,
      "reason": "string",
      "contact": "string"
    }
  ],
  "pitch_emails": ["full pitch email string for each of the top 3 brands"]
}

brand_matches must contain exactly 10 entries ordered by fit_score descending (0-100).
pitch_emails must contain exactly 3 entries for the top 3 brands.`;

async function parseRSS(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": "YieldCast/1.0" } });
  const xml = await res.text();

  // Extract description/summary text from items
  const items = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/g)).slice(0, 3);
  const texts = items.map((m) => {
    const desc = m[0].match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
    const title = m[0].match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    return `${title}\n${desc}`.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").trim();
  });

  const showTitle = xml.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/)?.[1] || "Podcast";
  const showDesc = xml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<[^>]+>/g, " ") || "";

  return `Show: ${showTitle}\nDescription: ${showDesc}\n\nRecent episodes:\n${texts.join("\n\n---\n\n")}`;
}

export async function POST(req: NextRequest) {
  let content = "";
  let refinement = "";

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const rssUrl = form.get("rss_url") as string | null;
    refinement = (form.get("refinement") as string) || "";

    if (rssUrl) {
      try {
        content = await parseRSS(rssUrl);
      } catch {
        return NextResponse.json({ detail: "Failed to fetch RSS feed." }, { status: 422 });
      }
    } else {
      return NextResponse.json({ detail: "Provide rss_url or audio file." }, { status: 400 });
    }
  } else {
    const body = await req.json();
    refinement = body.refinement || "";
    if (body.rss_url) {
      try {
        content = await parseRSS(body.rss_url);
      } catch {
        return NextResponse.json({ detail: "Failed to fetch RSS feed." }, { status: 422 });
      }
    } else {
      return NextResponse.json({ detail: "Provide rss_url." }, { status: 400 });
    }
  }

  const refinementBlock = refinement
    ? `\n\nADDITIONAL CONSTRAINT: ${refinement}\nApply this when selecting and ranking brand matches.`
    : "";

  const userPrompt = `${content}${refinementBlock}\n\n${OUTPUT_SCHEMA}`;

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ detail: "Failed to parse AI response." }, { status: 500 });

    return NextResponse.json(JSON.parse(match[0]));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI analysis failed.";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
