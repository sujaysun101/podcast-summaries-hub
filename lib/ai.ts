import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { sampleAnalysisFor } from "./demo-data";

const TOKEN_CAP = 4096;

export const analyseInputSchema = z
  .object({
    rss_url: z.string().trim().max(500).optional().or(z.literal("")),
    title: z.string().trim().max(300).optional().or(z.literal("")),
    description: z.string().trim().max(8000).optional().or(z.literal("")),
    creator: z.string().trim().max(200).optional().or(z.literal("")),
    platform: z.string().trim().max(40).optional().or(z.literal("")),
    genre: z.string().trim().max(80).optional().or(z.literal("")),
    refinement: z.string().trim().max(500).optional().or(z.literal("")),
    showId: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .refine((value) => Boolean(value.rss_url || value.title || value.description), {
    message: "Provide a title, description, or rss_url.",
  });

export type AnalyseInput = z.infer<typeof analyseInputSchema>;

const analysisSchema = z.object({
  audience_profile: z.object({
    age_range: z.string().min(1).max(80),
    primary_interests: z.array(z.string().min(1).max(80)).min(1).max(8),
    values: z.string().min(1).max(400),
    income_bracket: z.string().min(1).max(120),
    purchase_behaviour: z.string().min(1).max(400),
    content_themes: z.string().min(1).max(400),
    engagement_style: z.string().min(1).max(400),
  }),
  brand_matches: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        category: z.string().min(1).max(80),
        fit_score: z.coerce.number().min(0).max(100),
        reason: z.string().min(1).max(600),
        contact: z.string().max(200).optional().default(""),
      }),
    )
    .min(3)
    .max(10),
  pitch_emails: z.array(z.string().min(20).max(4000)).min(1).max(5),
});

const SYSTEM_PROMPT = `You are an elite podcast monetization editor. You profile a show's actual listeners and name sponsor brands that fit the way those people already buy. You avoid celebrity podcasts, generic national brands with no specific reason, and invented performance statistics.

Return a single JSON object and nothing else.`;

function outputSchema() {
  return `Return JSON with this shape:
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
    { "name": "string", "category": "string", "fit_score": 0, "reason": "string", "contact": "string" }
  ],
  "pitch_emails": ["full email including a Subject line, for each of the top 3 brands"]
}
brand_matches: 6 to 10 entries, fit_score 0-100, best fit first.
Each reason must name a concrete overlap with this show.
pitch_emails: exactly 3, written as a host, specific, no fake download claims beyond what the prompt states.`;
}

export function aiModel() {
  return process.env.AI_MODEL?.trim() || "claude-sonnet-4-5";
}

export function maxTokens() {
  const raw = Number(process.env.AI_MAX_TOKENS ?? 2800);
  if (!Number.isFinite(raw)) return 2800;
  return Math.min(TOKEN_CAP, Math.max(256, Math.floor(raw)));
}

export function hasAiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

async function readRss(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "YieldCast/1.0" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("RSS fetch failed");
  const xml = await response.text();
  const items = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/g)).slice(0, 3);
  const texts = items.map((match) => {
    const block = match[0];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const description = block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? "";
    return `${title}\n${description}`.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").trim();
  });
  const showTitle = xml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Podcast";
  const showDesc = xml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<[^>]+>/g, " ") ?? "";
  return `Show: ${showTitle}\nDescription: ${showDesc}\n\nRecent episodes:\n${texts.join("\n\n---\n\n")}`.slice(0, 12000);
}

export async function runAnalysis(input: AnalyseInput) {
  let content = "";
  if (input.rss_url) {
    try {
      content = await readRss(input.rss_url);
    } catch {
      return { ok: false as const, status: 400, detail: "Could not read that RSS feed." };
    }
  }
  const meta = [
    input.title && `Title: ${input.title}`,
    input.creator && `Host: ${input.creator}`,
    input.description && `Description: ${input.description}`,
    input.platform && `Platform: ${input.platform}`,
    input.genre && `Category: ${input.genre}`,
  ]
    .filter(Boolean)
    .join("\n");
  content = [meta, content].filter(Boolean).join("\n\n").slice(0, 14000);
  if (!content.trim()) {
    return { ok: false as const, status: 400, detail: "Provide a title, description, or rss_url." };
  }

  if (!hasAiKey()) {
    return { ok: true as const, analysis: sampleAnalysisFor(input.title) };
  }

  const refinement = input.refinement ? `\n\nAdditional constraint from the host: ${input.refinement}` : "";
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: aiModel(),
      max_tokens: maxTokens(),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `${content}${refinement}\n\n${outputSchema()}` }],
    });
    const raw = message.content.find((block) => block.type === "text")?.text ?? "";
    const jsonText = raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonText) {
      return { ok: true as const, analysis: sampleAnalysisFor(input.title) };
    }
    const parsed = analysisSchema.safeParse(JSON.parse(jsonText));
    if (!parsed.success) {
      return {
        ok: true as const,
        analysis: {
          ...sampleAnalysisFor(input.title),
          sample_label: "Sample response — the model reply did not match the expected shape.",
        },
      };
    }
    const ranked = [...parsed.data.brand_matches].sort((a, b) => b.fit_score - a.fit_score);
    return {
      ok: true as const,
      analysis: { ...parsed.data, brand_matches: ranked, sample: false },
    };
  } catch (error) {
    console.error("Analyse request failed", error);
    return {
      ok: true as const,
      analysis: {
        ...sampleAnalysisFor(input.title),
        sample_label: "Sample response — the model request did not succeed. Check ANTHROPIC_API_KEY and AI_MODEL.",
      },
    };
  }
}

export async function draftPitchEmail(input: {
  showTitle: string;
  hostName: string;
  description: string;
  downloads: number;
  brand: string;
  category: string;
  reason: string;
  contact: string;
}) {
  const fallback = {
    subject: `${input.showTitle} × ${input.brand}`,
    body: `Hi,\n\nI host ${input.showTitle}. ${input.description}\n\nAbout ${input.downloads.toLocaleString("en-US")} downloads an episode. ${input.reason}\n\nI am offering a short run of host-read mid-rolls and a show-notes link. I will only read what I can say plainly.\n\n${input.hostName}`,
    sample: true,
  };

  if (!hasAiKey()) return fallback;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: aiModel(),
      max_tokens: Math.min(900, maxTokens()),
      system: "You write short sponsor pitches for independent podcasters. No invented metrics. Return JSON only.",
      messages: [
        {
          role: "user",
          content: `Write one pitch email as the host.
Show: ${input.showTitle}
Host: ${input.hostName}
Downloads per episode: ${input.downloads}
Description: ${input.description}
Brand: ${input.brand} (${input.category})
Why it fits: ${input.reason}
Return {"subject":"...","body":"..."} with the body excluding the subject line.`,
        },
      ],
    });
    const raw = message.content.find((block) => block.type === "text")?.text ?? "";
    const jsonText = raw.match(/\{[\s\S]*\}/)?.[0];
    const parsed = z
      .object({ subject: z.string().min(3).max(180), body: z.string().min(20).max(4000) })
      .safeParse(jsonText ? JSON.parse(jsonText) : null);
    if (!parsed.success) return fallback;
    return { ...parsed.data, sample: false };
  } catch (error) {
    console.error("Pitch draft failed", error);
    return fallback;
  }
}
