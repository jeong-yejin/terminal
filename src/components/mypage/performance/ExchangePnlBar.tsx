"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { ExchangePnlBreakdown } from "@/types/mypage";
import { formatUsd } from "@/lib/format";

interface ExchangePnlBarProps {
  data?: ExchangePnlBreakdown[];
  isLoading?: boolean;
}

/**
 * 거래소별 P&L 비율 바 차트 (recharts BarChart — horizontal layout)
 */
export function ExchangePnlBar({ data, isLoading }: ExchangePnlBarProps) {
  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />
    );
  }

  const chartHeight = Math.max(120, (data?.length ?? 1) * 52);

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
      <h2 className="mb-4 text-sm font-medium text-text-secondary">P&L by Exchange</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="rgba(255,255,255,0.06)"
          />
          <XAxis
            type="number"
            tickFormatter={(v: number) =>
              v === 0 ? "0" : `$${(v / 1000).toFixed(0)}k`
            }
            tick={{ fontSize: 10, fill: "#A3A3A3" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="exchangeName"
            tick={{ fontSize: 11, fill: "#D4D4D4" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "#262626",
              border: "1px solid rgba(255,255,255,0.20)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#A3A3A3", marginBottom: 4 }}
            formatter={(v: number) => [
              `${v >= 0 ? "+" : ""}${formatUsd(v)}`,
              "P&L",
            ]}
          />
          <Bar dataKey="pnlUsd" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data?.map((entry) => (
              <Cell
                key={entry.exchangeId}
                fill={entry.pnlUsd >= 0 ? "#22C55E" : "#EF4444"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
