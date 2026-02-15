"use client";

import React, { useState, useMemo } from "react";
import { usePrompts } from "@/hooks/usePrompts";
import { useBrandStore } from "@/stores/brand-store";
import { useQueryClient } from "@tanstack/react-query";
import { PromptList, PromptListItem } from "@/components/prompts/PromptList";
import { AddPromptDialog } from "@/components/prompts/AddPromptDialog";
import { BulkAddDialog } from "@/components/prompts/BulkAddDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { Search, X } from "lucide-react";

const TAGS = ["AI", "Search", "Content", "Brand", "Competitor", "Feature", "FAQ", "General"];
const PROMPT_LIMIT = 100;

export default function PromptsPage() {
  const { activeBrandId } = useBrandStore();
  const { data: prompts = [], isLoading } = usePrompts(activeBrandId);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const filteredPrompts = useMemo(() => {
    return (prompts as Array<{
      id: string;
      content: string;
      tags?: string[];
      results?: Array<{ engine: string; score: number; timestamp: string }>;
    }>)
      .filter((p) => {
        const matchesSearch =
          p.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags =
          selectedTags.length === 0 ||
          (p.tags || []).some((tag) => selectedTags.includes(tag));
        return matchesSearch && matchesTags;
      })
      .map((p) => {
        // Transform to PromptListItem format
        const results = p.results || [];
        const chatgptResult = results.find((r) => r.engine === "chatgpt");
        const perplexityResult = results.find((r) => r.engine === "perplexity");
        const googleResult = results.find((r) => r.engine === "google");

        return {
          id: p.id,
          text: p.content,
          tags: p.tags || [],
          chatgptScore: chatgptResult?.score || 0,
          perplexityScore: perplexityResult?.score || 0,
          googleAIOScore: googleResult?.score || 0,
          lastChecked: results[0]?.timestamp || new Date().toISOString(),
        } as PromptListItem;
      });
  }, [prompts, searchTerm, selectedTags]);

  const handleAddPrompt = async (
    promptText: string,
    tags: string[]
  ) => {
    if (!activeBrandId) return;

    try {
      setIsAdding(true);
      await apiClient.post(`/brands/${activeBrandId}/prompts`, {
        content: promptText,
        tags,
      });
      await queryClient.invalidateQueries({
        queryKey: ["brands", activeBrandId, "prompts"],
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleBulkAdd = async (
    prompts: Array<{ text: string; tags: string[] }>
  ) => {
    if (!activeBrandId) return;

    try {
      setIsAdding(true);
      await Promise.all(
        prompts.map((p) =>
          apiClient.post(`/brands/${activeBrandId}/prompts`, {
            content: p.text,
            tags: p.tags,
          })
        )
      );
      await queryClient.invalidateQueries({
        queryKey: ["brands", activeBrandId, "prompts"],
      });
    } finally {
      setIsAdding(false);
    }
  };

  const usagePercent = (prompts.length / PROMPT_LIMIT) * 100;

  if (!activeBrandId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prompts</h2>
        </div>
        <div className="flex items-center justify-center h-96 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No brand selected</h3>
            <p className="text-text-secondary">
              Please select or create a brand to manage your prompts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prompts</h2>
        </div>
        <div className="flex gap-2">
          <AddPromptDialog
            onAdd={handleAddPrompt}
            isLoading={isAdding}
            availableTags={TAGS}
          />
          <BulkAddDialog onAdd={handleBulkAdd} isLoading={isAdding} />
        </div>
      </div>

      {/* Usage Indicator */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              Prompts Used: {prompts.length}/{PROMPT_LIMIT}
            </p>
            <p className="text-xs text-text-secondary">
              {PROMPT_LIMIT - prompts.length} remaining
            </p>
          </div>
          <Progress value={usagePercent} className="h-2" />
        </div>
      </Card>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                );
              }}
              className={`transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-blue-100 text-blue-900 border-blue-300"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              } border px-3 py-1 rounded-full text-sm`}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <X className="w-3 h-3 ml-1 inline" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <Card className="flex items-center justify-center h-80">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">No prompts yet</h3>
            <p className="text-text-secondary max-w-sm">
              Add your first prompt to analyze how your brand appears across different AI
              search engines.
            </p>
            <div className="flex gap-2 justify-center">
              <AddPromptDialog
                onAdd={handleAddPrompt}
                isLoading={isAdding}
                availableTags={TAGS}
              />
              <BulkAddDialog onAdd={handleBulkAdd} isLoading={isAdding} />
            </div>
          </div>
        </Card>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </p>
          <PromptList prompts={filteredPrompts} />
        </>
      )}
    </div>
  );
}
