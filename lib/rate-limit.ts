import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const CAPACITY = 8;
const WINDOW_MS = 60_000;

type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();

let upstash: Ratelimit | null = null;

function upstashLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!upstash) {
    upstash = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(CAPACITY, "60 s"),
      prefix: "yieldcast:analyse",
      analytics: false,
    });
  }
  return upstash;
}

export async function rateLimit(userId: string): Promise<{ ok: boolean; remaining: number }> {
  const remote = upstashLimiter();
  if (remote) {
    try {
      const result = await remote.limit(userId);
      return { ok: result.success, remaining: result.remaining };
    } catch (error) {
      console.error("Upstash rate limit failed, using in-memory bucket.", error);
    }
  }

  const now = Date.now();
  const bucket = buckets.get(userId) ?? { tokens: CAPACITY, updated: now };
  const refilled = Math.min(CAPACITY, bucket.tokens + ((now - bucket.updated) * CAPACITY) / WINDOW_MS);
  if (refilled < 1) {
    buckets.set(userId, { tokens: refilled, updated: now });
    return { ok: false, remaining: 0 };
  }
  const next = refilled - 1;
  buckets.set(userId, { tokens: next, updated: now });
  return { ok: true, remaining: Math.floor(next) };
}
