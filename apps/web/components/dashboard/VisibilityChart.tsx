"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrends } from "@/hooks/useDashboard";
import { useBrandStore } from "@/stores/brand-store";
import { Skeleton } from "@/components/ui/skeleton";

export function VisibilityChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const { activeBrandId } = useBrandStore();
  const { data: trends, isLoading } = useTrends(activeBrandId, timeRange);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visibility Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80" />
        </CardContent>
      </Card>
    );
  }

  if (!trends || trends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visibility Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-text-secondary">
          No trend data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Visibility Over Time</CardTitle>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range as "7d" | "30d" | "90d")}
            >
              {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="chatgpt"
              stroke="#3b82f6"
              name="ChatGPT"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="perplexity"
              stroke="#a855f7"
              name="Perplexity"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="googleAIO"
              stroke="#10b981"
              name="Google AIO"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
