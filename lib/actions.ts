"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "./auth";
import { draftPitchEmail } from "./ai";
import { rateLimit } from "./rate-limit";
import { store } from "./store";
import { outreachPatchSchema, showInputSchema } from "./validators";

async function viewerOrError() {
  const viewer = await getViewer();
  if (!viewer) return { ok: false as const, error: "Sign in required." };
  return { ok: true as const, viewer };
}

export async function createShowAction(input: unknown) {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  const parsed = showInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the show details." };
  const show = await store.createShow(gate.viewer.userId, parsed.data);
  revalidatePath("/shows");
  revalidatePath("/dashboard");
  return { ok: true as const, id: show.id };
}

export async function updateShowAction(id: string, input: unknown) {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  const parsed = showInputSchema.partial().safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Check the show details." };
  const show = await store.updateShow(gate.viewer.userId, id, parsed.data);
  if (!show) return { ok: false as const, error: "Show not found." };
  revalidatePath(`/shows/${id}`);
  revalidatePath(`/kit/${show.slug}`);
  revalidatePath("/shows");
  return { ok: true as const, show };
}

export async function deleteShowAction(id: string) {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  const removed = await store.deleteShow(gate.viewer.userId, id);
  if (!removed) return { ok: false as const, error: "Show not found." };
  revalidatePath("/shows");
  revalidatePath("/dashboard");
  revalidatePath("/outreach");
  return { ok: true as const };
}

export async function updateOutreachAction(id: string, input: unknown) {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  const parsed = outreachPatchSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Could not update that card." };
  const item = await store.updateOutreach(gate.viewer.userId, id, parsed.data);
  if (!item) return { ok: false as const, error: "Pitch not found." };
  revalidatePath("/outreach");
  revalidatePath("/dashboard");
  revalidatePath(`/shows/${item.showId}`);
  return { ok: true as const, item };
}

export async function draftPitchAction(showId: string, brandId: string) {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  const limited = await rateLimit(gate.viewer.userId);
  if (!limited.ok) return { ok: false as const, error: "Rate limit reached. Try again in a minute." };
  const detail = await store.getShow(gate.viewer.userId, showId);
  if (!detail) return { ok: false as const, error: "Show not found." };
  const brand = detail.brands.find((item) => item.id === brandId);
  if (!brand) return { ok: false as const, error: "Brand match not found." };
  const email = await draftPitchEmail({
    showTitle: detail.show.title,
    hostName: detail.show.hostName,
    description: detail.show.description,
    downloads: detail.show.avgDownloads,
    brand: brand.name,
    category: brand.category,
    reason: brand.reason,
    contact: brand.contact,
  });
  const item = await store.createPitch(gate.viewer.userId, showId, brandId, email, email.sample);
  revalidatePath("/outreach");
  revalidatePath("/dashboard");
  revalidatePath(`/shows/${showId}`);
  return { ok: true as const, id: item?.id, sample: email.sample };
}

export async function importDemoAction() {
  const gate = await viewerOrError();
  if (!gate.ok) return gate;
  await store.importDemo(gate.viewer.userId);
  revalidatePath("/dashboard");
  revalidatePath("/shows");
  revalidatePath("/outreach");
  return { ok: true as const };
}
