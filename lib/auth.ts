import { auth } from "@clerk/nextjs/server";
import { DEMO_USER_ID } from "./demo-data";
import { isPreviewWorkspace } from "./flags";
import { store } from "./store";
import type { Viewer } from "./types";

export { clerkUiEnabled, hasClerkKeys, isPreviewWorkspace } from "./flags";

export async function getViewer(): Promise<Viewer | null> {
  if (isPreviewWorkspace()) {
    return {
      userId: process.env.SEED_USER_ID?.trim() || DEMO_USER_ID,
      mode: "preview",
      demoData: store.mode() === "memory",
    };
  }
  try {
    const session = await auth();
    if (!session.userId) return null;
    return { userId: session.userId, mode: "user", demoData: store.mode() === "memory" };
  } catch {
    return null;
  }
}
