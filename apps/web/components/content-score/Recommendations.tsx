"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface Recommendation {
  id: string;
  dimension: string;
  action: string;
  severity: "high" | "medium" | "low";
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const getSeverityIcon = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return <AlertCircle className="h-4 w-4" />;
    case "medium":
      return <AlertTriangle className="h-4 w-4" />;
    case "low":
      return <Info className="h-4 w-4" />;
  }
};

const getSeverityBadge = (severity: "high" | "medium" | "low") => {
  switch (severity) {
    case "high":
      return (
        <Badge className="bg-red-100 text-red-800 border-0 hover:bg-red-100">
          High Priority
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-0 hover:bg-amber-100">
          Medium Priority
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-0 hover:bg-blue-100">
          Low Priority
        </Badge>
      );
  }
};

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600">
          No recommendations at this time. Great job!
        </p>
      </Card>
    );
  }

  // Sort by severity
  const sorted = [...recommendations].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
      <div className="space-y-3">
        {sorted.map((rec) => (
          <div
            key={rec.id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getSeverityIcon(rec.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <Badge variant="secondary">{rec.dimension}</Badge>
                {getSeverityBadge(rec.severity)}
              </div>
              <p className="text-sm text-gray-700">{rec.action}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
