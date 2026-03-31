"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

interface SectionScores {
  format: number;
  content: number;
  keywords: number;
  readability: number;
}

interface SectionScoresChartProps {
  scores: SectionScores;
  height?: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

const tooltipFormatter = (value: unknown): [string, string] => {
  const numVal = typeof value === "number" ? value : Number(value);
  return [`${numVal}/100`, "Score"];
};

export function SectionScoresChart({
  scores,
  height = 300,
}: SectionScoresChartProps) {
  const data = [
    { name: "Format", score: scores.format },
    { name: "Content", score: scores.content },
    { name: "Keywords", score: scores.keywords },
    { name: "Readability", score: scores.readability },
  ];

  return (
    // Explicit pixel height on the wrapper — fixes the -1 measurement bug
    // when BarChart sits inside a flex/grid cell with no intrinsic height
    <div style={{ width: "100%", height }}>
      <BarChart
        width={500}
        height={height}
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        style={{ width: "100%" }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "13px",
          }}
          formatter={tooltipFormatter as any}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={64}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
