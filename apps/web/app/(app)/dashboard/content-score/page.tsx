"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ScoreForm } from "@/components/content-score/ScoreForm";
import { ScoreBreakdown } from "@/components/content-score/ScoreBreakdown";
import { Recommendations, Recommendation } from "@/components/content-score/Recommendations";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "sonner";

interface ScoreResult {
  id: string;
  url: string;
  score: number;
  dimensions: Array<{
    name: string;
    score: number;
  }>;
  recommendations: Recommendation[];
  createdAt: string;
}

interface HistoryItem {
  id: string;
  url: string;
  score: number;
  createdAt: string;
  previousScore?: number;
}

const getTrendIndicator = (current: number, previous?: number) => {
  if (!previous) return <Minus className="h-4 w-4 text-gray-400" />;
  if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ContentScorePage() {
  const [currentScore, setCurrentScore] = useState<ScoreResult | null>(null);
  const queryClient = useQueryClient();

  // Fetch history
  const { data: history = [], isLoading: historyLoading } = useQuery<HistoryItem[]>({
    queryKey: ["contentScoreHistory"],
    queryFn: () => apiClient.get("/content/score/history"),
  });

  // Score mutation
  const { mutate: scoreUrl, isPending: isScoring } = useMutation({
    mutationFn: async (url: string) => {
      const result = await apiClient.post<ScoreResult>("/api/content/score", { url });
      return result;
    },
    onSuccess: (data) => {
      setCurrentScore(data);
      toast.success("Page scored successfully!");
      queryClient.invalidateQueries({ queryKey: ["contentScoreHistory"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to score page"
      );
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Score</h1>
        <p className="text-gray-600 mt-2">
          Analyze your page content quality and get actionable recommendations
        </p>
      </div>

      {/* Score Form */}
      <ScoreForm onScoreSubmit={(url) => scoreUrl(url)} isLoading={isScoring} />

      {/* Current Score Results */}
      {currentScore && (
        <div className="space-y-6">
          <ScoreBreakdown
            totalScore={currentScore.score}
            dimensions={currentScore.dimensions}
          />
          <Recommendations recommendations={currentScore.recommendations} />
        </div>
      )}

      {/* History Table */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Score History</h2>

        {historyLoading ? (
          <div className="text-center py-8 text-gray-600">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No scores yet. Analyze a page to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium truncate max-w-xs">
                      {item.url}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          item.score >= 80
                            ? "default"
                            : item.score >= 60
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {item.score}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIndicator(item.score, item.previousScore)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
