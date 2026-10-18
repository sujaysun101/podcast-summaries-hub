export function hasClerkKeys() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export function clerkUiEnabled() {
  if (process.env.DEMO_SCREENSHOT === "1") return false;
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return true;
  return process.env.NODE_ENV !== "production";
}

export function isPreviewWorkspace() {
  if (process.env.DEMO_SCREENSHOT === "1") return true;
  return process.env.NODE_ENV === "production" && !hasClerkKeys();
}
