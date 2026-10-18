import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShowDetail } from "@/components/show-detail";
import { getViewer } from "@/lib/auth";
import { store } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer) return { title: "Show" };
  const detail = await store.getShow(viewer.userId, id);
  return { title: detail?.show.title ?? "Show" };
}

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  const detail = await store.getShow(viewer.userId, id);
  if (!detail) notFound();
  return <ShowDetail show={detail.show} audience={detail.audience} brands={detail.brands} />;
}
