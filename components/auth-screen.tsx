import Link from "next/link";
import { Logo } from "@/components/logo";

export function AuthScreen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-[#10241b] p-10 text-[#f4f1ea] lg:flex">
        <Link href="/">
          <Logo className="text-[#f4f1ea]" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#b7cfc2]">The desk</p>
          <h1 className="mt-3 max-w-md font-display text-5xl leading-[1.05]">{title}</h1>
          <div className="mt-8 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-xs text-[#b7cfc2]">
              <span>Kitchen Ledger</span>
              <span>Fit 96</span>
            </div>
            <p className="mt-3 font-medium">MarginEdge</p>
            <p className="mt-1 text-sm text-[#d5e4db]">Listeners already code invoices by hand. The match is the system those episodes keep naming.</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[96%] rounded-full bg-[#7dcea5]" />
            </div>
          </div>
        </div>
        <p className="text-sm text-[#b7cfc2]">Audience profile, brand fit, and a pitch you can move across a board.</p>
      </section>
      <section className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </section>
    </div>
  );
}
