import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import React from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  sparkline?: Array<{ value: number }>;
  suffix?: string;
  decimals?: number;
}

export function MetricCard({
  title,
  value,
  trend,
  sparkline,
  suffix = "",
  decimals = 0,
}: MetricCardProps) {
  const isPositive = trend ? trend > 0 : false;
  const trendColor = isPositive ? "text-green-600" : "text-red-600";
  const trendBgColor = isPositive ? "bg-green-50" : "bg-red-50";
  const displayValue =
    typeof value === "number"
      ? decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value)
      : value;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold">
            {displayValue}
            {suffix && <span className="text-xl ml-1">{suffix}</span>}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded ${trendBgColor}`}>
              {isPositive ? (
                <ArrowUp className={`w-4 h-4 ${trendColor}`} />
              ) : (
                <ArrowDown className={`w-4 h-4 ${trendColor}`} />
              )}
              <span className={`text-sm font-semibold ${trendColor}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="h-8 flex items-end gap-0.5">
            {sparkline.map((point, i) => {
              const maxValue = Math.max(...sparkline.map((p) => p.value));
              const height =
                maxValue > 0 ? (point.value / maxValue) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-200 rounded-sm"
                  style={{ height: `${height}%`, minHeight: "2px" }}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
