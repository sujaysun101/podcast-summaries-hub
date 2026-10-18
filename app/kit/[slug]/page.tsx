import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaKitView } from "@/components/media-kit";
import { store } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kit = await store.publicKit(slug);
  if (!kit) return { title: "Media kit" };
  return {
    title: `${kit.show.title} media kit`,
    description: kit.show.description,
  };
}

export default async function KitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = await store.publicKit(slug);
  if (!kit) notFound();
  return <MediaKitView kit={kit} />;
}
