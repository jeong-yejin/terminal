"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { PnlDataPoint } from "@/types/mypage";

const PERIODS = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: Infinity },
] as const;

type Period = (typeof PERIODS)[number]["label"];

interface PnlChartProps {
  data?: PnlDataPoint[];
  isLoading?: boolean;
}

/**
 * P&L 라인 차트 (기간별)
 *
 * 라이브러리: recharts LineChart
 * 스펙:
 *   - 높이: 240px
 *   - X축: 날짜 (MM/DD), Y축: USD
 *   - 양수/음수 구간 색상 구분 (dot 없음)
 *   - 툴팁: 날짜 + P&L USD
 *   - 기간 필터 버튼: 1W / 1M / 3M / 1Y / ALL
 */
export function PnlChart({ data, isLoading }: PnlChartProps) {
  const [period, setPeriod] = useState<Period>("1M");

  const filteredData = useMemo(() => {
    if (!data) return [];
    const p = PERIODS.find((p) => p.label === period)!;
    if (p.days === Infinity) return data;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - p.days);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    return data.filter((d) => d.date >= cutoffStr);
  }, [data, period]);

  if (isLoading) {
    return (
      <div className="h-60 animate-pulse rounded-xl bg-surface-1 border border-border-subtle" />
    );
  }

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-secondary">Total P&L</h2>
        <div className="flex gap-1" role="group" aria-label="Time period filter">
          {PERIODS.map(({ label }) => (
            <button
              key={label}
              onClick={() => setPeriod(label)}
              aria-pressed={period === label}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                period === label
                  ? "bg-primary text-text-inverse"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={208}>
        <LineChart data={filteredData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            tick={{ fontSize: 10, fill: "#A3A3A3" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v: number) =>
              v === 0 ? "0" : `${v >= 0 ? "+" : ""}$${(v / 1000).toFixed(0)}k`
            }
            tick={{ fontSize: 10, fill: "#A3A3A3" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.20)" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={{
              background: "#262626",
              border: "1px solid rgba(255,255,255,0.20)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#A3A3A3", marginBottom: 4 }}
            formatter={(v: number) => [
              `${v >= 0 ? "+" : ""}$${v.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              "P&L",
            ]}
            labelFormatter={(l: string) =>
              new Date(l).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="pnlUsd"
            stroke="#CAFF5D"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#CAFF5D", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
