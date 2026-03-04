"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

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
  pageSize?: number;
}

export function PromptList({
  prompts,
  isLoading = false,
  onRowClick,
  pageSize = 10,
}: PromptListProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"chatgpt" | "perplexity" | "google">("chatgpt");
  const [page, setPage] = useState(1);

  const handleRowClick = (prompt: PromptListItem) => {
    if (onRowClick) {
      onRowClick(prompt.id);
    } else {
      router.push(`/dashboard/prompts/${prompt.id}`);
    }
  };

  const sortedPrompts = useMemo(
    () =>
      [...prompts].sort((a, b) => {
        if (sortBy === "chatgpt") return b.chatgptScore - a.chatgptScore;
        if (sortBy === "perplexity") return b.perplexityScore - a.perplexityScore;
        return b.googleAIOScore - a.googleAIOScore;
      }),
    [prompts, sortBy],
  );

  const columns: DataTableColumn<PromptListItem>[] = [
    {
      id: "text",
      header: "Prompt Text",
      cell: (row) => (
        <span className="truncate block font-normal max-w-xs">{row.text}</span>
      ),
    },
    {
      id: "tags",
      header: "Tags",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {row.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "chatgpt",
      header: "ChatGPT",
      sortKey: "chatgpt",
      align: "right",
      cell: (row) => `${row.chatgptScore}%`,
    },
    {
      id: "perplexity",
      header: "Perplexity",
      sortKey: "perplexity",
      align: "right",
      cell: (row) => `${row.perplexityScore}%`,
    },
    {
      id: "google",
      header: "Google AIO",
      sortKey: "google",
      align: "right",
      cell: (row) => `${row.googleAIOScore}%`,
    },
    {
      id: "trend",
      header: "Trend",
      align: "center",
      cell: (row) =>
        row.trend !== undefined ? (
          <div className="flex items-center gap-1 justify-center">
            {row.trend > 0 ? (
              <ArrowUpIcon className="w-4 h-4 text-success" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-destructive" />
            )}
            <span
              className={`text-sm font-semibold ${row.trend > 0 ? "text-success" : "text-destructive"
                }`}
            >
              {Math.abs(row.trend)}%
            </span>
          </div>
        ) : null,
    },
    {
      id: "lastChecked",
      header: "Last Checked",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.lastChecked).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <DataTable<PromptListItem>
      data={sortedPrompts}
      columns={columns}
      keyExtractor={(row) => row.id}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      sortBy={sortBy}
      onSort={(key) => setSortBy(key as "chatgpt" | "perplexity" | "google")}
      onRowClick={handleRowClick}
      isLoading={isLoading}
      emptyMessage="No prompts yet"
    />
  );
}
