export const OUTREACH_STATUSES = ["drafted", "sent", "replied", "won"] as const;
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];

export type Show = {
  id: string;
  userId: string;
  title: string;
  slug: string;
  hostName: string;
  description: string;
  category: string;
  rssUrl: string | null;
  website: string | null;
  avgDownloads: number;
  episodeCount: number;
  cadence: string;
  location: string;
  prerollCents: number;
  midrollCents: number;
  newsletterCents: number;
  kitPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AudienceProfile = {
  id: string;
  showId: string;
  ageRange: string;
  primaryInterests: string[];
  values: string;
  incomeBracket: string;
  purchaseBehaviour: string;
  contentThemes: string;
  engagementStyle: string;
  sample: boolean;
  updatedAt: string;
};

export type BrandMatch = {
  id: string;
  showId: string;
  name: string;
  category: string;
  fitScore: number;
  reason: string;
  contact: string;
  position: number;
};

export type OutreachItem = {
  id: string;
  userId: string;
  showId: string;
  brandMatchId: string | null;
  brandName: string;
  status: OutreachStatus;
  subject: string;
  body: string;
  valueCents: number;
  contact: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  repliedAt: string | null;
  wonAt: string | null;
};

export type WorkspaceSnapshot = {
  demo: boolean;
  shows: Show[];
  audience: AudienceProfile[];
  brands: BrandMatch[];
  outreach: OutreachItem[];
};

export type ShowInput = {
  title: string;
  hostName: string;
  description: string;
  category: string;
  rssUrl?: string;
  website?: string;
  avgDownloads: number;
  episodeCount: number;
  cadence: string;
  location: string;
  prerollCents?: number;
  midrollCents?: number;
  newsletterCents?: number;
  kitPublished?: boolean;
};

export type AnalysisPayload = {
  audience_profile: {
    age_range: string;
    primary_interests: string[];
    values: string;
    income_bracket: string;
    purchase_behaviour: string;
    content_themes: string;
    engagement_style: string;
  };
  brand_matches: {
    name: string;
    category: string;
    fit_score: number;
    reason: string;
    contact: string;
  }[];
  pitch_emails: string[];
  sample?: boolean;
  sample_label?: string;
};

export type PublicKit = {
  show: Show;
  audience: AudienceProfile | null;
};

export type Viewer = {
  userId: string;
  mode: "user" | "preview";
  demoData: boolean;
};
