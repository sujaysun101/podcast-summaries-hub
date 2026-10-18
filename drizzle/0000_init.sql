CREATE TABLE IF NOT EXISTS "shows" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "host_name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "rss_url" text,
  "website" text,
  "avg_downloads" integer DEFAULT 0 NOT NULL,
  "episode_count" integer DEFAULT 0 NOT NULL,
  "cadence" text DEFAULT 'Weekly' NOT NULL,
  "location" text DEFAULT '' NOT NULL,
  "preroll_cents" integer DEFAULT 0 NOT NULL,
  "midroll_cents" integer DEFAULT 0 NOT NULL,
  "newsletter_cents" integer DEFAULT 0 NOT NULL,
  "kit_published" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "shows_slug_unique" ON "shows" ("slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shows_user_idx" ON "shows" ("user_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audience_profiles" (
  "id" text PRIMARY KEY NOT NULL,
  "show_id" text NOT NULL REFERENCES "shows"("id") ON DELETE CASCADE,
  "age_range" text NOT NULL,
  "primary_interests" jsonb NOT NULL,
  "values" text NOT NULL,
  "income_bracket" text NOT NULL,
  "purchase_behaviour" text NOT NULL,
  "content_themes" text NOT NULL,
  "engagement_style" text NOT NULL,
  "sample" boolean DEFAULT false NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audience_show_idx" ON "audience_profiles" ("show_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brand_matches" (
  "id" text PRIMARY KEY NOT NULL,
  "show_id" text NOT NULL REFERENCES "shows"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "fit_score" integer NOT NULL,
  "reason" text NOT NULL,
  "contact" text NOT NULL,
  "position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "brands_show_idx" ON "brand_matches" ("show_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outreach" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "show_id" text NOT NULL REFERENCES "shows"("id") ON DELETE CASCADE,
  "brand_match_id" text,
  "brand_name" text NOT NULL,
  "status" text NOT NULL,
  "subject" text NOT NULL,
  "body" text NOT NULL,
  "value_cents" integer DEFAULT 0 NOT NULL,
  "contact" text DEFAULT '' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "sent_at" timestamptz,
  "replied_at" timestamptz,
  "won_at" timestamptz
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "outreach_user_idx" ON "outreach" ("user_id");
