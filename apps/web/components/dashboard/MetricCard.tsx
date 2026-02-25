import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

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
  const displayValue =
    typeof value === "number"
      ? decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value)
      : value;

  return (
    <Card className="hover:shadow-medium transition-shadow duration-200">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isPositive
                  ? "bg-success/15 text-success-foreground"
                  : "bg-destructive/15 text-destructive-foreground"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="text-3xl font-bold text-primary">
          {displayValue}
          {suffix && <span className="text-lg ml-0.5 text-text-secondary">{suffix}</span>}
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="h-8 flex items-end gap-0.5 pt-1">
            {sparkline.map((point, i) => {
              const maxValue = Math.max(...sparkline.map((p) => p.value));
              const height =
                maxValue > 0 ? (point.value / maxValue) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 bg-primary/30 rounded-sm hover:bg-primary/50 transition-colors"
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
