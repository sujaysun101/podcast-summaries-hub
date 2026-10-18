import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  return base || "show";
}

export function suggestRates(downloads: number) {
  const step = 2500;
  const round = (cents: number) => Math.max(step, Math.round(cents / step) * step);
  return {
    prerollCents: round((downloads / 1000) * 18 * 100),
    midrollCents: round((downloads / 1000) * 40 * 100),
    newsletterCents: round((downloads / 1000) * 8 * 100),
  };
}

export function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
}

export function monthLabel(isoMonthStart: Date) {
  return isoMonthStart.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
}
