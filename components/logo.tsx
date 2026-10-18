import { cn } from "@/lib/utils";

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <svg viewBox="0 0 32 32" className={cn("h-7 w-7", markClassName)} aria-hidden>
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path d="M6 20.5c3.2-1 4.2-6.2 7.2-6.2 2.4 0 2.8 3.4 5.2 3.4 2.6 0 3.4-5.2 7.6-6.3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-primary-foreground" />
        <circle cx="23.5" cy="11.2" r="1.6" className="fill-gold" />
      </svg>
      YieldCast
    </span>
  );
}
