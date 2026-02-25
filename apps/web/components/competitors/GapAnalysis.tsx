"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGapAnalysis, type GapAnalysisItem } from "@/hooks/useCompetitors";
import { useBrandStore } from "@/stores/brand-store";
import { TrendingUp } from "lucide-react";

export function GapAnalysis() {
  const { activeBrandId } = useBrandStore();
  const { data: gaps = [], isLoading } = useGapAnalysis(activeBrandId ?? undefined);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gaps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-text-secondary">
            No gaps found. Your brand is performing well in tracked searches.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getOpportunitySeverity = (score: number) => {
    if (score >= 80) return { color: "bg-destructive/15 text-destructive-foreground", label: "Critical" };
    if (score >= 60) return { color: "bg-warning/15 text-warning-foreground", label: "High" };
    if (score >= 40) return { color: "bg-warning/10 text-warning-foreground", label: "Medium" };
    return { color: "bg-primary/20 text-primary", label: "Low" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Gap Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Prompt</TableHead>
              <TableHead>Competitors Present</TableHead>
              <TableHead className="text-right">Opportunity Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gaps.map((gap: GapAnalysisItem, idx: number) => {
              const severity = getOpportunitySeverity(gap.opportunityScore);
              return (
                <TableRow key={idx}>
                  <TableCell className="font-medium max-w-sm">
                    <span className="truncate block">{gap.promptText}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {gap.competitorsPresent.slice(0, 3).map((comp: string) => (
                        <Badge key={comp} variant="outline" className="text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {gap.competitorsPresent.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{gap.competitorsPresent.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={severity.color}>
                      {gap.opportunityScore}% - {severity.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
