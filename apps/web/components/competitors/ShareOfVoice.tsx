"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useShareOfVoice } from "@/hooks/useCompetitors";
import { useBrandStore } from "@/stores/brand-store";

const COLORS = [
  "#3b82f6", // Blue for brand
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

export function ShareOfVoice() {
  const { activeBrandId } = useBrandStore();
  const { data: shareData, isLoading } = useShareOfVoice(activeBrandId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share of Voice</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80" />
        </CardContent>
      </Card>
    );
  }

  if (!shareData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Share of Voice</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-text-secondary">
          No data available
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Your Brand", value: shareData.brand },
    ...shareData.competitors.map((c) => ({
      name: c.name,
      value: c.value,
    })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share of Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
