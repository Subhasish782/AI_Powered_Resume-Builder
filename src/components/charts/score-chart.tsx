"use client";

import { PieChart, Pie, Cell } from "recharts";

interface ScoreChartProps {
  score: number;
  size?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

export function ScoreChart({ score, size = 200 }: ScoreChartProps) {
  const color = getScoreColor(score);
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  return (
    // Fixed pixel container — no ResponsiveContainer needed for a fixed-size donut
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          innerRadius={size * 0.35}
          outerRadius={size * 0.45}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>

      {/* Score label in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">/100</span>
      </div>
    </div>
  );
}
