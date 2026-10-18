"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { money } from "@/lib/utils";

type PipelinePoint = { status: string; count: number; valueCents: number };
type RevenuePoint = { label: string; wonCents: number };

export function PipelineChart({ data }: { data: PipelinePoint[] }) {
  const rows = data.map((item) => ({
    ...item,
    name: item.status[0].toUpperCase() + item.status.slice(1),
    dollars: Math.round(item.valueCents / 100),
  }));
  return (
    <div className="h-64 w-full" role="img" aria-label="Pipeline value by stage">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barSize={28}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const row = payload[0].payload as (typeof rows)[number];
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="font-medium">{row.name}</p>
                  <p>{money(row.valueCents)} across {row.count} pitches</p>
                </div>
              );
            }}
          />
          <Bar dataKey="dollars" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const rows = data.map((item) => ({ ...item, dollars: Math.round(item.wonCents / 100) }));
  return (
    <div className="h-64 w-full" role="img" aria-label="Won sponsorship revenue by month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const row = payload[0].payload as (typeof rows)[number];
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
                  <p className="font-medium">{row.label}</p>
                  <p>{money(row.wonCents)} won</p>
                </div>
              );
            }}
          />
          <Area type="monotone" dataKey="dollars" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.25} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
