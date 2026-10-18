import type { Metadata } from "next";
import { ShowForm } from "@/components/show-form";

export const metadata: Metadata = { title: "Add a show" };

export default function NewShowPage() {
  return <ShowForm />;
}
