"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface SubDimension {
  name: string;
  score: number;
}

interface ScoreBreakdownProps {
  totalScore: number;
  dimensions: SubDimension[];
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

const getScoreBackgroundColor = (score: number): string => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-amber-100";
  return "bg-red-100";
};

const getBarColor = (score: number): string => {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
};

const CircularScore = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={getBarColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-xs text-gray-500">out of 100</div>
        </div>
      </div>
      <Badge
        className={`mt-4 ${getScoreBackgroundColor(score)} ${getScoreColor(
          score
        )} border-0`}
      >
        {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
      </Badge>
    </div>
  );
};

export function ScoreBreakdown({
  totalScore,
  dimensions,
}: ScoreBreakdownProps) {
  const chartData = dimensions.map((dim) => ({
    name: dim.name,
    score: dim.score,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6 flex items-center justify-center">
        <CircularScore score={totalScore} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Score Breakdown</h3>
        <div className="space-y-6">
          {dimensions.map((dimension) => (
            <div key={dimension.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{dimension.name}</span>
                <span className={`text-sm font-semibold ${getScoreColor(dimension.score)}`}>
                  {dimension.score}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${dimension.score}%`,
                    backgroundColor: getBarColor(dimension.score),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Visual Breakdown</h3>
        <div className="w-full overflow-x-auto">
          <BarChart
            width={Math.min(600, typeof window !== "undefined" ? window.innerWidth - 100 : 500)}
            height={300}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
              formatter={(value) => `${value}`}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </Card>
    </div>
  );
}
