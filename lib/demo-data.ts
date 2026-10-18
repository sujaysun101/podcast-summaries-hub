import type { AudienceProfile, BrandMatch, OutreachItem, OutreachStatus, Show, WorkspaceSnapshot } from "./types";
import { slugify } from "./utils";

export const DEMO_USER_ID = "demo";

function stamp(monthsAgo: number, day: number) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, day, 15, 0, 0));
  return d.toISOString();
}

type SeedBrand = {
  id: string;
  name: string;
  category: string;
  fitScore: number;
  reason: string;
  contact: string;
};

type SeedShow = {
  id: string;
  slug: string;
  title: string;
  hostName: string;
  description: string;
  category: string;
  website: string;
  avgDownloads: number;
  episodeCount: number;
  cadence: string;
  location: string;
  prerollCents: number;
  midrollCents: number;
  newsletterCents: number;
  audience: Omit<AudienceProfile, "id" | "showId" | "updatedAt" | "sample">;
  brands: SeedBrand[];
};

const SHOWS: SeedShow[] = [
  {
    id: "show_kitchen",
    slug: "kitchen-ledger",
    title: "Kitchen Ledger",
    hostName: "Lena Ortiz",
    description:
      "Weekly conversations with people who run bakeries, taquerias, and specialty grocers. Episodes stay on margins, hiring, suppliers, and the unglamorous systems that keep a small food business open.",
    category: "Food business",
    website: "https://kitchenledger.fm",
    avgDownloads: 6400,
    episodeCount: 86,
    cadence: "Weekly",
    location: "Austin, TX",
    prerollCents: 12500,
    midrollCents: 27500,
    newsletterCents: 7500,
    audience: {
      ageRange: "31–48",
      primaryInterests: ["Restaurant operations", "Local supply chains", "Hiring", "Food cost"],
      values: "Craft, local relationships, and numbers that survive a slow Tuesday.",
      incomeBracket: "Operator households, roughly $90k–$180k",
      purchaseBehaviour: "Buys tools that replace a spreadsheet or a missed invoice. Slow to switch once the staff is trained.",
      contentThemes: "Food cost, vendor terms, front-of-house hiring, neighborhood retail",
      engagementStyle: "Listens on the line or during a commute. Saves episodes that name a specific system.",
    },
    brands: [
      {
        id: "brand_marginedge",
        name: "MarginEdge",
        category: "Restaurant ops",
        fitScore: 96,
        reason: "Listeners already track invoices by hand. MarginEdge is the system episodes keep circling back to when food cost slips.",
        contact: "partnerships@marginedge.com",
      },
      {
        id: "brand_faire",
        name: "Faire",
        category: "Wholesale",
        fitScore: 91,
        reason: "Specialty grocers on the show reorder from independent makers. Faire is how several guests actually place those orders.",
        contact: "podcasts@faire.com",
      },
      {
        id: "brand_toast",
        name: "Toast",
        category: "POS",
        fitScore: 84,
        reason: "A large share of guest restaurants already run Toast. The fit is renewal and add-on modules, not a cold category introduction.",
        contact: "creator@toasttab.com",
      },
      {
        id: "brand_webstaurant",
        name: "WebstaurantStore",
        category: "Supplies",
        fitScore: 80,
        reason: "Small kitchens buy replacement equipment in a hurry. The audience trusts a host who has burned a pan on the line.",
        contact: "affiliates@webstaurantstore.com",
      },
      {
        id: "brand_local_line",
        name: "Local Line",
        category: "Farm software",
        fitScore: 77,
        reason: "Episodes on direct farm relationships need a tool the grower and the chef can both stand. Local Line is that narrow.",
        contact: "hello@localline.ca",
      },
      {
        id: "brand_square",
        name: "Square",
        category: "Payments",
        fitScore: 71,
        reason: "Counter-service guests still start on Square. Useful for the earlier-stage half of the list, less so for full-service rooms.",
        contact: "podcasts@squareup.com",
      },
    ],
  },
  {
    id: "show_night",
    slug: "night-shift",
    title: "Night Shift",
    hostName: "Andre Brooks",
    description:
      "Long interviews with nurses, paramedics, and overnight techs about the hours most health coverage skips. Practical, not heroic: shoes, schedules, continuing education, and what actually helps at 3 a.m.",
    category: "Healthcare work",
    website: "https://nightshift.show",
    avgDownloads: 11200,
    episodeCount: 64,
    cadence: "Weekly",
    location: "Chicago, IL",
    prerollCents: 20000,
    midrollCents: 45000,
    newsletterCents: 12500,
    audience: {
      ageRange: "26–44",
      primaryInterests: ["Nursing", "Shift work", "Continuing education", "Recovery"],
      values: "Competence, straight talk, and gear that survives a 12-hour shift.",
      incomeBracket: "Clinical staff, roughly $70k–$130k",
      purchaseBehaviour: "Replaces shoes and scrubs on a schedule. Will pay more for something a colleague already wears.",
      contentThemes: "Overnight staffing, burnout, practical gear, licensure",
      engagementStyle: "High completion on commutes home. Replies when a guest names a product they personally use.",
    },
    brands: [
      {
        id: "brand_figs",
        name: "FIGS",
        category: "Scrubs",
        fitScore: 95,
        reason: "The audience buys scrubs more than once a year and already argues about them in the comments. FIGS is the brand they compare everything else to.",
        contact: "partnerships@wearfigs.com",
      },
      {
        id: "brand_clove",
        name: "Clove",
        category: "Footwear",
        fitScore: 93,
        reason: "Overnight guests talk about their feet before they talk about policy. Clove is built for clinical floors, which is the whole show.",
        contact: "hello@goclove.com",
      },
      {
        id: "brand_liquidiv",
        name: "Liquid I.V.",
        category: "Hydration",
        fitScore: 86,
        reason: "Shift workers already stash hydration packets in a locker. The host can say that without pretending it is medicine.",
        contact: "creators@liquid-iv.com",
      },
      {
        id: "brand_owala",
        name: "Owala",
        category: "Drinkware",
        fitScore: 78,
        reason: "A bottle that does not leak in a bag is a recurring aside. Owala shows up unprompted in listener mail.",
        contact: "partnerships@owalalife.com",
      },
      {
        id: "brand_nurse_com",
        name: "Nurse.com",
        category: "Education",
        fitScore: 74,
        reason: "Licensure episodes have a direct next step. CE credits are one of the few offers this audience asks for.",
        contact: "sponsors@nurse.com",
      },
      {
        id: "brand_huel",
        name: "Huel",
        category: "Meals",
        fitScore: 69,
        reason: "Breaks are short and real food is inconsistent. Useful as a practical mention, not a lifestyle brand.",
        contact: "podcasts@huel.com",
      },
    ],
  },
  {
    id: "show_ridge",
    slug: "ridge-line",
    title: "Ridge Line",
    hostName: "Mira Solano",
    description:
      "Trail stories told slowly, plus gear that lasts a season rather than a photo. Mira hikes in the southern Rockies and interviews rangers, hut keepers, and people who repair their own kits.",
    category: "Outdoors",
    website: "https://ridgeline.fm",
    avgDownloads: 8900,
    episodeCount: 71,
    cadence: "Biweekly",
    location: "Durango, CO",
    prerollCents: 17500,
    midrollCents: 37500,
    newsletterCents: 10000,
    audience: {
      ageRange: "29–52",
      primaryInterests: ["Backpacking", "Trail maintenance", "Repair", "Maps"],
      values: "Durability, leaving a place intact, and advice that names a failure.",
      incomeBracket: "Mixed outdoor households, roughly $75k–$160k",
      purchaseBehaviour: "Buys less, keeps longer. Researches a tent or a sock for weeks, then does not return it.",
      contentThemes: "Route planning, layering, public lands, field repair",
      engagementStyle: "Downloads before a trip. Clicks show notes for the exact product a guest repaired.",
    },
    brands: [
      {
        id: "brand_darn_tough",
        name: "Darn Tough",
        category: "Apparel",
        fitScore: 97,
        reason: "Guests mention socks by the warranty, not the logo. Darn Tough is already the default recommendation on the show.",
        contact: "partnerships@darntough.com",
      },
      {
        id: "brand_gaia",
        name: "Gaia GPS",
        category: "Navigation",
        fitScore: 92,
        reason: "Route episodes assume an offline map. Gaia is the tool Mira actually opens when a trail name is wrong.",
        contact: "podcasts@gaiagps.com",
      },
      {
        id: "brand_hyperlite",
        name: "Hyperlite Mountain Gear",
        category: "Packs",
        fitScore: 88,
        reason: "The audience argues about pack weight in good faith. Hyperlite is specific enough to survive that argument.",
        contact: "studio@hyperlitemountaingear.com",
      },
      {
        id: "brand_garage",
        name: "Garage Grown Gear",
        category: "Specialty retail",
        fitScore: 83,
        reason: "Listeners would rather buy from a small outdoor shop than a general marketplace. Garage Grown Gear is that shop.",
        contact: "hello@garagegrowngear.com",
      },
      {
        id: "brand_nemo",
        name: "NEMO Equipment",
        category: "Shelter",
        fitScore: 76,
        reason: "Shelter episodes are some of the most saved. NEMO fits the repair-and-keep tone better than a fashion outdoor brand.",
        contact: "partners@nemoequipment.com",
      },
      {
        id: "brand_lems",
        name: "Lems",
        category: "Footwear",
        fitScore: 70,
        reason: "Approach shoes come up whenever a guest leaves the trail for a town day. A narrower fit than a general sneaker brand.",
        contact: "partnerships@lemsshoes.com",
      },
    ],
  },
  {
    id: "show_basement",
    slug: "basement-signal",
    title: "Basement Signal",
    hostName: "Theo Park",
    description:
      "How independent bands book rooms, press vinyl, and stay solvent. Less scene myth, more door deals, distribution, and the gear that records a record in a rented room.",
    category: "Independent music",
    website: "https://basementsignal.fm",
    avgDownloads: 4200,
    episodeCount: 53,
    cadence: "Weekly",
    location: "Philadelphia, PA",
    prerollCents: 7500,
    midrollCents: 17500,
    newsletterCents: 5000,
    audience: {
      ageRange: "23–39",
      primaryInterests: ["Independent music", "Recording", "Touring", "Vinyl"],
      values: "Paying collaborators, owning masters, and gear that can be repaired.",
      incomeBracket: "Working musicians and studio techs, roughly $40k–$95k",
      purchaseBehaviour: "Saves for one piece of gear. Suspicious of anything that sounds like a growth hack.",
      contentThemes: "Door deals, distribution, home recording, pressing plants",
      engagementStyle: "Shares episodes inside band group chats. Acts on a link when the host has used the product on a session.",
    },
    brands: [
      {
        id: "brand_distrokid",
        name: "DistroKid",
        category: "Distribution",
        fitScore: 90,
        reason: "Almost every guest has a distribution story. DistroKid is the one they already have an opinion about, which makes a host-read credible.",
        contact: "partners@distrokid.com",
      },
      {
        id: "brand_sweetwater",
        name: "Sweetwater",
        category: "Instruments",
        fitScore: 87,
        reason: "Recording episodes end with a specific input chain. Sweetwater is where this audience actually checks stock.",
        contact: "creators@sweetwater.com",
      },
      {
        id: "brand_bandcamp",
        name: "Bandcamp",
        category: "Direct sales",
        fitScore: 85,
        reason: "The show's whole argument is that fans will pay the artist. Bandcamp is the checkout guests already send.",
        contact: "press@bandcamp.com",
      },
      {
        id: "brand_uaudio",
        name: "Universal Audio",
        category: "Recording",
        fitScore: 79,
        reason: "Home-studio episodes name interfaces more than microphones. Universal Audio is the upgrade path, not the starter toy.",
        contact: "partnerships@uaudio.com",
      },
      {
        id: "brand_disc_makers",
        name: "Disc Makers",
        category: "Physical media",
        fitScore: 73,
        reason: "Vinyl and short-run CD episodes need a plant people can email. Disc Makers is concrete enough for a 60-second read.",
        contact: "marketing@discmakers.com",
      },
      {
        id: "brand_output",
        name: "Output",
        category: "Software",
        fitScore: 66,
        reason: "Producers in the audience already collect virtual instruments. A fit for the studio half of the show, not the touring half.",
        contact: "partners@output.com",
      },
    ],
  },
];

type SeedOutreach = {
  id: string;
  showId: string;
  brandId: string;
  status: OutreachStatus;
  valueCents: number;
  subject: string;
  body: string;
  monthsAgo: number;
  day: number;
};

const OUTREACH: SeedOutreach[] = [
  {
    id: "out_figs",
    showId: "show_night",
    brandId: "brand_figs",
    status: "won",
    valueCents: 220000,
    monthsAgo: 5,
    day: 14,
    subject: "Night Shift × FIGS — four host-read mid-rolls",
    body: `Hi there,

I host Night Shift, a weekly show with nurses, paramedics, and overnight techs. We average about 11,200 downloads. Scrubs come up because people wear them for twelve hours, not because I am looking for a category to fill.

I am offering four host-read mid-rolls in May and June, plus a show-notes link. I will only read this if I can say what the fabric does after a wash, which I can.

If a four-episode test is interesting, reply with whoever books podcasts and I will send the one-pager.

Andre Brooks
Night Shift`,
  },
  {
    id: "out_darn",
    showId: "show_ridge",
    brandId: "brand_darn_tough",
    status: "won",
    valueCents: 160000,
    monthsAgo: 4,
    day: 9,
    subject: "Ridge Line — a sock read I would actually do",
    body: `Hello,

Ridge Line is a biweekly trail show out of Durango. About 8,900 downloads. Guests already tell the warranty story without being asked, so a Darn Tough mid-roll would sound like the rest of the episode.

I am proposing three host-read mid-rolls and one newsletter note to the trip-planning list. I do not read pre-roll slogans.

Happy to send the rate card.

Mira Solano`,
  },
  {
    id: "out_margin",
    showId: "show_kitchen",
    brandId: "brand_marginedge",
    status: "won",
    valueCents: 280000,
    monthsAgo: 3,
    day: 18,
    subject: "Kitchen Ledger × MarginEdge — operators, not foodies",
    body: `Hi,

Kitchen Ledger is a weekly show for people who run small restaurants and grocers. Lena Ortiz hosts. About 6,400 downloads an episode, and the listeners are owners and managers, not diners.

The last month of episodes stayed on invoice coding and food cost. MarginEdge is the tool those conversations assume. I would like to offer a six-episode host-read package: one mid-roll each week, show notes, and a single newsletter placement.

I will not claim a percentage saved. I will say what the product replaces.

Lena Ortiz
Kitchen Ledger`,
  },
  {
    id: "out_distrokid",
    showId: "show_basement",
    brandId: "brand_distrokid",
    status: "won",
    valueCents: 90000,
    monthsAgo: 2,
    day: 7,
    subject: "Basement Signal — distribution, said plainly",
    body: `Hi,

I host Basement Signal in Philadelphia. Independent bands, door deals, pressing plants. About 4,200 downloads. Small on purpose.

DistroKid comes up because guests have already used it and have a specific complaint or a specific reason they stayed. That is a better read than a generic "get your music everywhere."

Two mid-rolls and a show-notes link. Rate is on the media kit.

Theo Park`,
  },
  {
    id: "out_clove",
    showId: "show_night",
    brandId: "brand_clove",
    status: "won",
    valueCents: 140000,
    monthsAgo: 1,
    day: 22,
    subject: "Night Shift × Clove — shoes for a real floor",
    body: `Hi,

Following the FIGS run on Night Shift, I have a gap in September for a footwear read. Clove is the shoe overnight guests already compare in the mailbag.

Three host-read mid-rolls. I have stood in a pair; I will say what I noticed and stop there.

Andre`,
  },
  {
    id: "out_gaia",
    showId: "show_ridge",
    brandId: "brand_gaia",
    status: "won",
    valueCents: 120000,
    monthsAgo: 0,
    day: 2,
    subject: "Ridge Line × Gaia GPS — offline maps",
    body: `Hello,

I open Gaia on Ridge Line whenever a guest's trail name does not match the map. Listeners download the show before a trip, which is when a navigation trial is useful.

Two mid-rolls this month and a link in the route notes. I will not promise people will subscribe. I will tell them which layer I use when a forest road is closed.

Mira Solano`,
  },
  {
    id: "out_faire",
    showId: "show_kitchen",
    brandId: "brand_faire",
    status: "replied",
    valueCents: 210000,
    monthsAgo: 0,
    day: 11,
    subject: "Kitchen Ledger × Faire — specialty reorder",
    body: `Hi,

Two guests this fall restock their grocery shelves through Faire and said so on tape. I would like to turn that into a four-episode mid-roll rather than leave it as a passing mention.

Kitchen Ledger reaches about 6,400 operators an episode. The read would be about reorder and net terms, not a lifestyle shop.

If you are the right person, I can send the dates I still have open.

Lena Ortiz`,
  },
  {
    id: "out_hyperlite",
    showId: "show_ridge",
    brandId: "brand_hyperlite",
    status: "replied",
    valueCents: 240000,
    monthsAgo: 1,
    day: 3,
    subject: "A pack read for people who argue about weight",
    body: `Hello,

Ridge Line listeners will argue about a pack for twenty minutes and then buy one. Hyperlite is specific enough to survive that. I am offering a four-episode package tied to an upcoming shelter-and-pack series.

About 8,900 downloads, biweekly. I repair my own kit on the show, so the read has to respect that.

Mira`,
  },
  {
    id: "out_toast",
    showId: "show_kitchen",
    brandId: "brand_toast",
    status: "sent",
    valueCents: 320000,
    monthsAgo: 0,
    day: 6,
    subject: "Kitchen Ledger — Toast add-ons for rooms already on Toast",
    body: `Hi,

Most full-service guests on Kitchen Ledger already run Toast. I do not want to pretend otherwise. The useful read is about the modules they have not turned on: inventory and team messaging.

Six host-read spots. I will say who on the show already uses it.

Lena Ortiz`,
  },
  {
    id: "out_liquid",
    showId: "show_night",
    brandId: "brand_liquidiv",
    status: "sent",
    valueCents: 180000,
    monthsAgo: 0,
    day: 9,
    subject: "Night Shift — a locker-shelf read",
    body: `Hi,

Night Shift is overnight clinical staff. Hydration packets are already in the locker shots guests send me. I can do three mid-rolls in the next six weeks if the claim stays at "this is what people drink between patients," not a health promise.

About 11,200 downloads.

Andre Brooks`,
  },
  {
    id: "out_sweetwater",
    showId: "show_basement",
    brandId: "brand_sweetwater",
    status: "sent",
    valueCents: 150000,
    monthsAgo: 0,
    day: 4,
    subject: "Basement Signal × Sweetwater",
    body: `Hi,

Recording episodes on Basement Signal end with a specific interface or a mic we could actually get. Sweetwater is where the guests check stock. I am offering three host-reads around a home-recording series in November.

4,200 downloads. The audience saves for one piece of gear, so I would rather be precise than loud.

Theo Park`,
  },
  {
    id: "out_webstaurant",
    showId: "show_kitchen",
    brandId: "brand_webstaurant",
    status: "drafted",
    valueCents: 150000,
    monthsAgo: 0,
    day: 16,
    subject: "Draft: Kitchen Ledger × WebstaurantStore",
    body: `Hi,

Kitchen Ledger listeners replace a pan or a prep table in a hurry. I am drafting a three-episode mid-roll for WebstaurantStore aimed at that moment, not at a general kitchen makeover.

About 6,400 downloads an episode. I will send dates once I know who should see this.

Lena Ortiz`,
  },
  {
    id: "out_owala",
    showId: "show_night",
    brandId: "brand_owala",
    status: "drafted",
    valueCents: 90000,
    monthsAgo: 0,
    day: 15,
    subject: "Draft: Night Shift × Owala",
    body: `Hi,

Listeners mail me about bottles that do not open in a work bag. I have a draft mid-roll for Owala tied to that, two episodes, no wellness language.

Andre Brooks
Night Shift`,
  },
  {
    id: "out_garage",
    showId: "show_ridge",
    brandId: "brand_garage",
    status: "drafted",
    valueCents: 80000,
    monthsAgo: 0,
    day: 14,
    subject: "Draft: Ridge Line × Garage Grown Gear",
    body: `Hello,

I would rather send listeners to a small outdoor shop than a general marketplace. Drafting two mid-rolls for Garage Grown Gear around a repair episode.

Mira Solano`,
  },
  {
    id: "out_bandcamp",
    showId: "show_basement",
    brandId: "brand_bandcamp",
    status: "drafted",
    valueCents: 70000,
    monthsAgo: 0,
    day: 13,
    subject: "Draft: Basement Signal × Bandcamp",
    body: `Hi,

The show's argument is that fans will pay the artist directly. I am drafting a short Bandcamp read for two episodes in the vinyl series. I will not dress it up as a growth story.

Theo Park`,
  },
];

function idFor(userId: string, stable: string) {
  if (userId === DEMO_USER_ID) return stable;
  return `${stable}_${slugify(userId).slice(0, 12)}_${stable.slice(-4)}`;
}

export function buildDemoWorkspace(userId: string): WorkspaceSnapshot {
  const now = new Date().toISOString();
  const suffix = userId === DEMO_USER_ID ? "" : `-${slugify(userId).slice(-8)}`;

  const shows: Show[] = SHOWS.map((show) => ({
    id: idFor(userId, show.id),
    userId,
    title: show.title,
    slug: `${show.slug}${suffix}`,
    hostName: show.hostName,
    description: show.description,
    category: show.category,
    rssUrl: null,
    website: show.website,
    avgDownloads: show.avgDownloads,
    episodeCount: show.episodeCount,
    cadence: show.cadence,
    location: show.location,
    prerollCents: show.prerollCents,
    midrollCents: show.midrollCents,
    newsletterCents: show.newsletterCents,
    kitPublished: true,
    createdAt: stamp(8, 3),
    updatedAt: now,
  }));

  const audience: AudienceProfile[] = SHOWS.map((show) => ({
    id: idFor(userId, `aud_${show.id}`),
    showId: idFor(userId, show.id),
    ...show.audience,
    sample: false,
    updatedAt: now,
  }));

  const brands: BrandMatch[] = SHOWS.flatMap((show) =>
    show.brands.map((brand, position) => ({
      id: idFor(userId, brand.id),
      showId: idFor(userId, show.id),
      name: brand.name,
      category: brand.category,
      fitScore: brand.fitScore,
      reason: brand.reason,
      contact: brand.contact,
      position,
    })),
  );

  const outreach: OutreachItem[] = OUTREACH.map((item) => {
    const when = stamp(item.monthsAgo, item.day);
    const status = item.status;
    return {
      id: idFor(userId, item.id),
      userId,
      showId: idFor(userId, item.showId),
      brandMatchId: idFor(userId, item.brandId),
      brandName: brands.find((brand) => brand.id === idFor(userId, item.brandId))?.name ?? "Brand",
      status,
      subject: item.subject,
      body: item.body,
      valueCents: item.valueCents,
      contact: brands.find((brand) => brand.id === idFor(userId, item.brandId))?.contact ?? "",
      createdAt: when,
      updatedAt: when,
      sentAt: status === "drafted" ? null : when,
      repliedAt: status === "replied" || status === "won" ? when : null,
      wonAt: status === "won" ? when : null,
    };
  });

  return { demo: true, shows, audience, brands, outreach };
}

export function sampleAnalysisFor(title?: string) {
  const show = SHOWS.find((item) => item.title === title) ?? SHOWS[0];
  return {
    audience_profile: {
      age_range: show.audience.ageRange,
      primary_interests: show.audience.primaryInterests,
      values: show.audience.values,
      income_bracket: show.audience.incomeBracket,
      purchase_behaviour: show.audience.purchaseBehaviour,
      content_themes: show.audience.contentThemes,
      engagement_style: show.audience.engagementStyle,
    },
    brand_matches: show.brands.map((brand) => ({
      name: brand.name,
      category: brand.category,
      fit_score: brand.fitScore,
      reason: brand.reason,
      contact: brand.contact,
    })),
    pitch_emails: OUTREACH.filter((item) => item.showId === show.id)
      .slice(0, 3)
      .map((item) => `Subject: ${item.subject}\n\n${item.body}`),
    sample: true as const,
    sample_label: "Sample response — set ANTHROPIC_API_KEY for a live analysis of this show.",
  };
}
