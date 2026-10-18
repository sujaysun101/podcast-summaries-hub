import { DEMO_USER_ID } from "../lib/demo-data";
import { databaseUrl } from "../lib/db";
import { store } from "../lib/store";

async function main() {
  const userId = process.env.SEED_USER_ID?.trim() || DEMO_USER_ID;
  if (!databaseUrl()) {
    console.log("DATABASE_URL is not set. The app serves the built-in demo workspace in memory.");
    console.log("Set DATABASE_URL and run npm run db:migrate before seeding Postgres.");
    return;
  }
  await store.importDemo(userId);
  console.log(`Seeded demo shows, audience profiles, brand matches, and outreach for user ${userId}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
