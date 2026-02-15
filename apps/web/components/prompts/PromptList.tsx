"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface PromptListItem {
  id: string;
  text: string;
  tags: string[];
  chatgptScore: number;
  perplexityScore: number;
  googleAIOScore: number;
  trend?: number;
  lastChecked: string;
}

interface PromptListProps {
  prompts: PromptListItem[];
  isLoading?: boolean;
  onRowClick?: (promptId: string) => void;
}

export function PromptList({
  prompts,
  isLoading = false,
  onRowClick,
}: PromptListProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"chatgpt" | "perplexity" | "google">(
    "chatgpt"
  );

  const handleRowClick = (promptId: string) => {
    if (onRowClick) {
      onRowClick(promptId);
    } else {
      router.push(`/dashboard/prompts/${promptId}`);
    }
  };

  const sortedPrompts = [...prompts].sort((a, b) => {
    if (sortBy === "chatgpt") return b.chatgptScore - a.chatgptScore;
    if (sortBy === "perplexity") return b.perplexityScore - a.perplexityScore;
    return b.googleAIOScore - a.googleAIOScore;
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="border-b p-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (prompts.length === 0) {
    return (
      <Card className="flex items-center justify-center h-48">
        <p className="text-text-secondary">No prompts yet</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Prompt Text</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSortBy("chatgpt")}
            >
              ChatGPT{" "}
              {sortBy === "chatgpt" && (
                <span className="ml-1 text-xs">↓</span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSortBy("perplexity")}
            >
              Perplexity{" "}
              {sortBy === "perplexity" && (
                <span className="ml-1 text-xs">↓</span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSortBy("google")}
            >
              Google AIO{" "}
              {sortBy === "google" && (
                <span className="ml-1 text-xs">↓</span>
              )}
            </TableHead>
            <TableHead>Trend</TableHead>
            <TableHead>Last Checked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPrompts.map((prompt) => (
            <TableRow
              key={prompt.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(prompt.id)}
            >
              <TableCell className="font-medium max-w-xs">
                <span className="truncate block">
                  {prompt.text}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{prompt.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">{prompt.chatgptScore}%</TableCell>
              <TableCell className="text-right">{prompt.perplexityScore}%</TableCell>
              <TableCell className="text-right">{prompt.googleAIOScore}%</TableCell>
              <TableCell>
                {prompt.trend !== undefined && (
                  <div className="flex items-center gap-1 justify-center">
                    {prompt.trend > 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        prompt.trend > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.abs(prompt.trend)}%
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-sm text-text-secondary">
                {new Date(prompt.lastChecked).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
