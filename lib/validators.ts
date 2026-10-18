import { z } from "zod";
import { OUTREACH_STATUSES } from "./types";

export const showInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  hostName: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(2000),
  category: z.string().trim().min(2).max(60),
  rssUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  website: z.string().trim().url().max(300).optional().or(z.literal("")),
  avgDownloads: z.coerce.number().int().min(0).max(5_000_000),
  episodeCount: z.coerce.number().int().min(0).max(10000),
  cadence: z.string().trim().min(2).max(40),
  location: z.string().trim().max(80).optional().default(""),
  prerollCents: z.coerce.number().int().min(0).max(50_000_000).optional(),
  midrollCents: z.coerce.number().int().min(0).max(50_000_000).optional(),
  newsletterCents: z.coerce.number().int().min(0).max(50_000_000).optional(),
  kitPublished: z.boolean().optional(),
});

export const outreachPatchSchema = z.object({
  status: z.enum(OUTREACH_STATUSES).optional(),
  subject: z.string().trim().min(3).max(180).optional(),
  body: z.string().trim().min(10).max(8000).optional(),
  valueCents: z.coerce.number().int().min(0).max(50_000_000).optional(),
});
