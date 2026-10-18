import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const shows = pgTable(
  "shows",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    hostName: text("host_name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    rssUrl: text("rss_url"),
    website: text("website"),
    avgDownloads: integer("avg_downloads").notNull().default(0),
    episodeCount: integer("episode_count").notNull().default(0),
    cadence: text("cadence").notNull().default("Weekly"),
    location: text("location").notNull().default(""),
    prerollCents: integer("preroll_cents").notNull().default(0),
    midrollCents: integer("midroll_cents").notNull().default(0),
    newsletterCents: integer("newsletter_cents").notNull().default(0),
    kitPublished: boolean("kit_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("shows_slug_unique").on(table.slug), index("shows_user_idx").on(table.userId)],
);

export const audienceProfiles = pgTable(
  "audience_profiles",
  {
    id: text("id").primaryKey(),
    showId: text("show_id")
      .notNull()
      .references(() => shows.id, { onDelete: "cascade" }),
    ageRange: text("age_range").notNull(),
    primaryInterests: jsonb("primary_interests").$type<string[]>().notNull(),
    values: text("values").notNull(),
    incomeBracket: text("income_bracket").notNull(),
    purchaseBehaviour: text("purchase_behaviour").notNull(),
    contentThemes: text("content_themes").notNull(),
    engagementStyle: text("engagement_style").notNull(),
    sample: boolean("sample").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("audience_show_idx").on(table.showId)],
);

export const brandMatches = pgTable(
  "brand_matches",
  {
    id: text("id").primaryKey(),
    showId: text("show_id")
      .notNull()
      .references(() => shows.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    fitScore: integer("fit_score").notNull(),
    reason: text("reason").notNull(),
    contact: text("contact").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("brands_show_idx").on(table.showId)],
);

export const outreach = pgTable(
  "outreach",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    showId: text("show_id")
      .notNull()
      .references(() => shows.id, { onDelete: "cascade" }),
    brandMatchId: text("brand_match_id"),
    brandName: text("brand_name").notNull(),
    status: text("status").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    valueCents: integer("value_cents").notNull().default(0),
    contact: text("contact").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    wonAt: timestamp("won_at", { withTimezone: true }),
  },
  (table) => [index("outreach_user_idx").on(table.userId)],
);
