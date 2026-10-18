import { and, eq, inArray } from "drizzle-orm";
import { buildDemoWorkspace, DEMO_USER_ID } from "./demo-data";
import { getDb } from "./db";
import { audienceProfiles, brandMatches, outreach, shows } from "./db/schema";
import type {
  AnalysisPayload,
  AudienceProfile,
  BrandMatch,
  OutreachItem,
  OutreachStatus,
  PublicKit,
  Show,
  ShowInput,
  WorkspaceSnapshot,
} from "./types";
import { slugify, suggestRates } from "./utils";

type Bucket = WorkspaceSnapshot;

const memory = new Map<string, Bucket>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function memoryBucket(userId: string): Bucket {
  const existing = memory.get(userId);
  if (existing) return existing;
  const seeded = buildDemoWorkspace(userId);
  memory.set(userId, seeded);
  return seeded;
}

function ensureDemoMemory() {
  if (!memory.has(DEMO_USER_ID)) memory.set(DEMO_USER_ID, buildDemoWorkspace(DEMO_USER_ID));
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapShow(row: typeof shows.$inferSelect): Show {
  return {
    ...row,
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date().toISOString(),
  };
}

function mapAudience(row: typeof audienceProfiles.$inferSelect): AudienceProfile {
  return {
    ...row,
    primaryInterests: row.primaryInterests ?? [],
    updatedAt: toIso(row.updatedAt) ?? new Date().toISOString(),
  };
}

function mapBrand(row: typeof brandMatches.$inferSelect): BrandMatch {
  return row;
}

function mapOutreach(row: typeof outreach.$inferSelect): OutreachItem {
  return {
    ...row,
    status: row.status as OutreachStatus,
    createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(row.updatedAt) ?? new Date().toISOString(),
    sentAt: toIso(row.sentAt),
    repliedAt: toIso(row.repliedAt),
    wonAt: toIso(row.wonAt),
  };
}

function uniqueSlug(base: string, taken: Set<string>) {
  const slug = slugify(base);
  if (!taken.has(slug)) return slug;
  let n = 2;
  while (taken.has(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}

async function replaceWorkspace(userId: string, snapshot: WorkspaceSnapshot) {
  const db = getDb();
  if (!db) {
    memory.set(userId, clone({ ...snapshot, demo: true }));
    return;
  }

  const existing = await db.select({ id: shows.id }).from(shows).where(eq(shows.userId, userId));
  if (existing.length) {
    await db.delete(shows).where(eq(shows.userId, userId));
  }

  if (!snapshot.shows.length) return;

  await db.insert(shows).values(
    snapshot.shows.map((show) => ({
      ...show,
      userId,
      createdAt: new Date(show.createdAt),
      updatedAt: new Date(show.updatedAt),
    })),
  );
  if (snapshot.audience.length) {
    await db.insert(audienceProfiles).values(
      snapshot.audience.map((row) => ({
        ...row,
        updatedAt: new Date(row.updatedAt),
      })),
    );
  }
  if (snapshot.brands.length) {
    await db.insert(brandMatches).values(snapshot.brands);
  }
  if (snapshot.outreach.length) {
    await db.insert(outreach).values(
      snapshot.outreach.map((row) => ({
        ...row,
        userId,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
        sentAt: row.sentAt ? new Date(row.sentAt) : null,
        repliedAt: row.repliedAt ? new Date(row.repliedAt) : null,
        wonAt: row.wonAt ? new Date(row.wonAt) : null,
      })),
    );
  }
}

export const store = {
  mode(): "postgres" | "memory" {
    return getDb() ? "postgres" : "memory";
  },

  async snapshot(userId: string): Promise<WorkspaceSnapshot> {
    const db = getDb();
    if (!db) {
      const bucket = memoryBucket(userId);
      return clone(bucket);
    }
    const showRows = await db.select().from(shows).where(eq(shows.userId, userId));
    if (!showRows.length) return { demo: false, shows: [], audience: [], brands: [], outreach: [] };
    const ids = showRows.map((row) => row.id);
    const [audienceRows, brandRows, outreachRows] = await Promise.all([
      db.select().from(audienceProfiles).where(inArray(audienceProfiles.showId, ids)),
      db.select().from(brandMatches).where(inArray(brandMatches.showId, ids)),
      db.select().from(outreach).where(eq(outreach.userId, userId)),
    ]);
    return {
      demo: false,
      shows: showRows.map(mapShow).sort((a, b) => a.title.localeCompare(b.title)),
      audience: audienceRows.map(mapAudience),
      brands: brandRows.map(mapBrand).sort((a, b) => a.position - b.position),
      outreach: outreachRows.map(mapOutreach).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    };
  },

  async getShow(userId: string, id: string) {
    const snapshot = await this.snapshot(userId);
    const show = snapshot.shows.find((item) => item.id === id) ?? null;
    if (!show) return null;
    return {
      show,
      audience: snapshot.audience.find((item) => item.showId === id) ?? null,
      brands: snapshot.brands.filter((item) => item.showId === id),
      outreach: snapshot.outreach.filter((item) => item.showId === id),
      demo: snapshot.demo,
    };
  },

  async publicKit(slug: string): Promise<PublicKit | null> {
    const db = getDb();
    if (!db) {
      ensureDemoMemory();
      for (const bucket of memory.values()) {
        const show = bucket.shows.find((item) => item.slug === slug && item.kitPublished);
        if (!show) continue;
        return {
          show,
          audience: bucket.audience.find((item) => item.showId === show.id) ?? null,
        };
      }
      return null;
    }
    const rows = await db.select().from(shows).where(eq(shows.slug, slug)).limit(1);
    const show = rows[0];
    if (!show || !show.kitPublished) return null;
    const audienceRows = await db.select().from(audienceProfiles).where(eq(audienceProfiles.showId, show.id)).limit(1);
    return {
      show: mapShow(show),
      audience: audienceRows[0] ? mapAudience(audienceRows[0]) : null,
    };
  },

  async createShow(userId: string, input: ShowInput): Promise<Show> {
    const rates = suggestRates(input.avgDownloads);
    const now = new Date().toISOString();
    const db = getDb();
    if (!db) {
      const bucket = memoryBucket(userId);
      const slug = uniqueSlug(input.title, new Set(bucket.shows.map((show) => show.slug)));
      const show: Show = {
        id: crypto.randomUUID(),
        userId,
        title: input.title,
        slug,
        hostName: input.hostName,
        description: input.description,
        category: input.category,
        rssUrl: input.rssUrl || null,
        website: input.website || null,
        avgDownloads: input.avgDownloads,
        episodeCount: input.episodeCount,
        cadence: input.cadence,
        location: input.location,
        prerollCents: input.prerollCents ?? rates.prerollCents,
        midrollCents: input.midrollCents ?? rates.midrollCents,
        newsletterCents: input.newsletterCents ?? rates.newsletterCents,
        kitPublished: Boolean(input.kitPublished),
        createdAt: now,
        updatedAt: now,
      };
      bucket.shows.unshift(show);
      bucket.demo = true;
      return show;
    }

    const existing = await db.select({ slug: shows.slug }).from(shows);
    const slug = uniqueSlug(input.title, new Set(existing.map((row) => row.slug)));
    const show: Show = {
      id: crypto.randomUUID(),
      userId,
      title: input.title,
      slug,
      hostName: input.hostName,
      description: input.description,
      category: input.category,
      rssUrl: input.rssUrl || null,
      website: input.website || null,
      avgDownloads: input.avgDownloads,
      episodeCount: input.episodeCount,
      cadence: input.cadence,
      location: input.location,
      prerollCents: input.prerollCents ?? rates.prerollCents,
      midrollCents: input.midrollCents ?? rates.midrollCents,
      newsletterCents: input.newsletterCents ?? rates.newsletterCents,
      kitPublished: Boolean(input.kitPublished),
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(shows).values({ ...show, createdAt: new Date(now), updatedAt: new Date(now) });
    return show;
  },

  async updateShow(userId: string, id: string, patch: Partial<ShowInput> & { kitPublished?: boolean }) {
    const db = getDb();
    if (!db) {
      const bucket = memoryBucket(userId);
      const show = bucket.shows.find((item) => item.id === id);
      if (!show) return null;
      Object.assign(show, {
        ...patch,
        rssUrl: patch.rssUrl === undefined ? show.rssUrl : patch.rssUrl || null,
        website: patch.website === undefined ? show.website : patch.website || null,
        updatedAt: new Date().toISOString(),
      });
      return show;
    }
    const current = await db.select().from(shows).where(and(eq(shows.id, id), eq(shows.userId, userId))).limit(1);
    if (!current[0]) return null;
    const next = {
      title: patch.title ?? current[0].title,
      hostName: patch.hostName ?? current[0].hostName,
      description: patch.description ?? current[0].description,
      category: patch.category ?? current[0].category,
      rssUrl: patch.rssUrl === undefined ? current[0].rssUrl : patch.rssUrl || null,
      website: patch.website === undefined ? current[0].website : patch.website || null,
      avgDownloads: patch.avgDownloads ?? current[0].avgDownloads,
      episodeCount: patch.episodeCount ?? current[0].episodeCount,
      cadence: patch.cadence ?? current[0].cadence,
      location: patch.location ?? current[0].location,
      prerollCents: patch.prerollCents ?? current[0].prerollCents,
      midrollCents: patch.midrollCents ?? current[0].midrollCents,
      newsletterCents: patch.newsletterCents ?? current[0].newsletterCents,
      kitPublished: patch.kitPublished ?? current[0].kitPublished,
      updatedAt: new Date(),
    };
    await db.update(shows).set(next).where(eq(shows.id, id));
    return mapShow({ ...current[0], ...next });
  },

  async deleteShow(userId: string, id: string) {
    const db = getDb();
    if (!db) {
      const bucket = memoryBucket(userId);
      const before = bucket.shows.length;
      bucket.shows = bucket.shows.filter((show) => show.id !== id);
      bucket.audience = bucket.audience.filter((row) => row.showId !== id);
      bucket.brands = bucket.brands.filter((row) => row.showId !== id);
      bucket.outreach = bucket.outreach.filter((row) => row.showId !== id);
      return bucket.shows.length !== before;
    }
    const removed = await db.delete(shows).where(and(eq(shows.id, id), eq(shows.userId, userId))).returning({ id: shows.id });
    return removed.length > 0;
  },

  async saveAnalysis(userId: string, showId: string, analysis: AnalysisPayload) {
    const owned = await this.getShow(userId, showId);
    if (!owned) return null;
    const now = new Date().toISOString();
    const audience: AudienceProfile = {
      id: owned.audience?.id ?? crypto.randomUUID(),
      showId,
      ageRange: analysis.audience_profile.age_range,
      primaryInterests: analysis.audience_profile.primary_interests,
      values: analysis.audience_profile.values,
      incomeBracket: analysis.audience_profile.income_bracket,
      purchaseBehaviour: analysis.audience_profile.purchase_behaviour,
      contentThemes: analysis.audience_profile.content_themes,
      engagementStyle: analysis.audience_profile.engagement_style,
      sample: Boolean(analysis.sample),
      updatedAt: now,
    };
    const brands: BrandMatch[] = analysis.brand_matches.map((brand, position) => ({
      id: crypto.randomUUID(),
      showId,
      name: brand.name,
      category: brand.category,
      fitScore: brand.fit_score,
      reason: brand.reason,
      contact: brand.contact,
      position,
    }));

    const db = getDb();
    if (!db) {
      const bucket = memoryBucket(userId);
      bucket.audience = bucket.audience.filter((row) => row.showId !== showId);
      bucket.audience.push(audience);
      bucket.brands = bucket.brands.filter((row) => row.showId !== showId);
      bucket.brands.push(...brands);
      const existingNames = new Set(bucket.outreach.filter((row) => row.showId === showId).map((row) => row.brandName));
      analysis.pitch_emails.slice(0, 3).forEach((email, index) => {
        const brand = brands[index];
        if (!brand || existingNames.has(brand.name)) return;
        bucket.outreach.unshift(pitchFromEmail(userId, showId, brand, email, now));
      });
      return { audience, brands };
    }

    await db.delete(audienceProfiles).where(eq(audienceProfiles.showId, showId));
    await db.delete(brandMatches).where(eq(brandMatches.showId, showId));
    await db.insert(audienceProfiles).values({ ...audience, updatedAt: new Date(now) });
    if (brands.length) await db.insert(brandMatches).values(brands);
    const existing = await db.select().from(outreach).where(and(eq(outreach.userId, userId), eq(outreach.showId, showId)));
    const existingNames = new Set(existing.map((row) => row.brandName));
    const drafts = analysis.pitch_emails.slice(0, 3).flatMap((email, index) => {
      const brand = brands[index];
      if (!brand || existingNames.has(brand.name)) return [];
      const pitch = pitchFromEmail(userId, showId, brand, email, now);
      return [
        {
          ...pitch,
          createdAt: new Date(now),
          updatedAt: new Date(now),
          sentAt: null,
          repliedAt: null,
          wonAt: null,
        },
      ];
    });
    if (drafts.length) await db.insert(outreach).values(drafts);
    return { audience, brands };
  },

  async createPitch(userId: string, showId: string, brandId: string, email: { subject: string; body: string }, sample: boolean) {
    const owned = await this.getShow(userId, showId);
    if (!owned) return null;
    const brand = owned.brands.find((item) => item.id === brandId);
    if (!brand) return null;
    const now = new Date().toISOString();
    const item: OutreachItem = {
      id: crypto.randomUUID(),
      userId,
      showId,
      brandMatchId: brand.id,
      brandName: brand.name,
      status: "drafted",
      subject: email.subject,
      body: sample ? `${email.body}\n\n— Sample draft. Set ANTHROPIC_API_KEY to generate this from the model.` : email.body,
      valueCents: owned.show.midrollCents * 4,
      contact: brand.contact,
      createdAt: now,
      updatedAt: now,
      sentAt: null,
      repliedAt: null,
      wonAt: null,
    };
    const db = getDb();
    if (!db) {
      memoryBucket(userId).outreach.unshift(item);
      return item;
    }
    await db.insert(outreach).values({
      ...item,
      createdAt: new Date(now),
      updatedAt: new Date(now),
      sentAt: null,
      repliedAt: null,
      wonAt: null,
    });
    return item;
  },

  async updateOutreach(
    userId: string,
    id: string,
    patch: Partial<Pick<OutreachItem, "status" | "subject" | "body" | "valueCents">>,
  ) {
    const db = getDb();
    if (!db) {
      const item = memoryBucket(userId).outreach.find((row) => row.id === id);
      if (!item) return null;
      applyOutreachPatch(item, patch);
      return item;
    }
    const rows = await db.select().from(outreach).where(and(eq(outreach.id, id), eq(outreach.userId, userId))).limit(1);
    if (!rows[0]) return null;
    const current = mapOutreach(rows[0]);
    applyOutreachPatch(current, patch);
    await db
      .update(outreach)
      .set({
        status: current.status,
        subject: current.subject,
        body: current.body,
        valueCents: current.valueCents,
        updatedAt: new Date(current.updatedAt),
        sentAt: current.sentAt ? new Date(current.sentAt) : null,
        repliedAt: current.repliedAt ? new Date(current.repliedAt) : null,
        wonAt: current.wonAt ? new Date(current.wonAt) : null,
      })
      .where(eq(outreach.id, id));
    return current;
  },

  async importDemo(userId: string) {
    const snapshot = buildDemoWorkspace(userId);
    await replaceWorkspace(userId, snapshot);
    return snapshot;
  },
};

function pitchFromEmail(userId: string, showId: string, brand: BrandMatch, email: string, now: string): OutreachItem {
  const subjectLine = email.split("\n").find((line) => line.toLowerCase().startsWith("subject:"));
  const subject = subjectLine ? subjectLine.replace(/^subject:\s*/i, "").trim() : `Pitch — ${brand.name}`;
  const body = email.replace(/^subject:.*\n+/i, "").trim();
  return {
    id: crypto.randomUUID(),
    userId,
    showId,
    brandMatchId: brand.id,
    brandName: brand.name,
    status: "drafted",
    subject,
    body,
    valueCents: 0,
    contact: brand.contact,
    createdAt: now,
    updatedAt: now,
    sentAt: null,
    repliedAt: null,
    wonAt: null,
  };
}

function applyOutreachPatch(item: OutreachItem, patch: Partial<Pick<OutreachItem, "status" | "subject" | "body" | "valueCents">>) {
  const now = new Date().toISOString();
  if (patch.subject !== undefined) item.subject = patch.subject;
  if (patch.body !== undefined) item.body = patch.body;
  if (patch.valueCents !== undefined) item.valueCents = patch.valueCents;
  if (patch.status && patch.status !== item.status) {
    item.status = patch.status;
    if (patch.status === "drafted") {
      item.sentAt = null;
      item.repliedAt = null;
      item.wonAt = null;
    }
    if (patch.status === "sent") {
      item.sentAt = item.sentAt ?? now;
      item.repliedAt = null;
      item.wonAt = null;
    }
    if (patch.status === "replied") {
      item.sentAt = item.sentAt ?? now;
      item.repliedAt = now;
      item.wonAt = null;
    }
    if (patch.status === "won") {
      item.sentAt = item.sentAt ?? now;
      item.repliedAt = item.repliedAt ?? now;
      item.wonAt = now;
    }
  }
  item.updatedAt = now;
}

ensureDemoMemory();
