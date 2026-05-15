"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="hidden md:flex flex-col w-52 min-h-screen bg-[#0a1628] border-r border-white/8 p-3 flex-shrink-0">
      <Link href="/" className="flex items-center gap-2 font-bold text-white mb-6 px-2 py-1">
        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
        <span className="text-sm">YieldCast</span>
      </Link>

      <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-xs py-2 mb-5 justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Analysis
      </Link>

      <nav className="flex-1 space-y-0.5">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-emerald-500/12 text-emerald-400" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={l.icon} />
              </svg>
              {l.label}
              {active && <span className="ml-auto w-1 h-1 rounded-full bg-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 pt-3 mt-3">
        {user ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.fullName || user.username}</p>
              <p className="text-white/30 text-xs truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Back to site
          </Link>
        )}
      </div>
    </aside>
  );
}
