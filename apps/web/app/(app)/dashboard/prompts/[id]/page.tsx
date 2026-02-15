"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePrompt, usePromptResults } from "@/hooks/usePrompts";
import { useBrandStore } from "@/stores/brand-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit2, Trash2, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface PromptResponse {
  engine: string;
  text: string;
  position: number;
  sentiment: "positive" | "neutral" | "negative";
  citations: Array<{ text: string; url: string }>;
  mentions: {
    brand: number;
    competitors: number;
  };
  timestamp: string;
}

export default function PromptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const promptId = params?.id as string;
  const { activeBrandId } = useBrandStore();
  const queryClient = useQueryClient();

  const { data: prompt, isLoading: isPromptLoading } = usePrompt(
    activeBrandId,
    promptId
  );
  const { data: results = [], isLoading: isResultsLoading } = usePromptResults(
    activeBrandId,
    promptId
  );

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      setIsDeleting(true);
      await apiClient.del(
        `/brands/${activeBrandId}/prompts/${promptId}`
      );
      router.push("/dashboard/prompts");
    } catch (error) {
      console.error("Failed to delete prompt:", error);
      alert("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPromptLoading) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/prompts" className="flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Prompts
        </Link>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/prompts" className="flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Prompts
        </Link>
        <Card className="flex items-center justify-center h-96">
          <p className="text-text-secondary">Prompt not found</p>
        </Card>
      </div>
    );
  }

  // Transform API results to PromptResponse format
  const responses: PromptResponse[] = (results as any[]).map((r) => ({
    engine: r.engine,
    text: r.content || "",
    position: r.position || 0,
    sentiment: r.sentiment || "neutral",
    citations: r.citations || [],
    mentions: {
      brand: r.brandMentions || 0,
      competitors: r.competitorMentions || 0,
    },
    timestamp: r.timestamp || new Date().toISOString(),
  }));

  const sentimentColor = {
    positive: "bg-green-100 text-green-800",
    neutral: "bg-gray-100 text-gray-800",
    negative: "bg-red-100 text-red-800",
  };

  const highlightMentions = (text: string, brandName: string, competitors: string[]) => {
    // Simple implementation - in production, use a proper text parsing library
    let highlighted = text;
    const brandRegex = new RegExp(`(${brandName})`, "gi");
    highlighted = highlighted.replace(
      brandRegex,
      '<span class="bg-blue-200 font-semibold">$1</span>'
    );

    competitors.forEach((competitor) => {
      const regex = new RegExp(`(${competitor})`, "gi");
      highlighted = highlighted.replace(
        regex,
        '<span class="bg-orange-200 font-semibold">$1</span>'
      );
    });

    return highlighted;
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/prompts"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Prompts
      </Link>

      {/* Prompt Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-4">
                {(prompt as any).content || (prompt as any).title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {((prompt as any).tags || []).map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/prompts/${promptId}/edit`)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Engine Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Engine Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {isResultsLoading ? (
            <Skeleton className="h-96" />
          ) : responses.length === 0 ? (
            <p className="text-center py-8 text-text-secondary">
              No analysis results yet. Run this prompt to see responses from AI engines.
            </p>
          ) : (
            <Tabs defaultValue={responses[0]?.engine || ""} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {responses.map((response) => (
                  <TabsTrigger key={response.engine} value={response.engine}>
                    {response.engine === "chatgpt"
                      ? "ChatGPT"
                      : response.engine === "perplexity"
                      ? "Perplexity"
                      : "Google AIO"}
                  </TabsTrigger>
                ))}
              </TabsList>

              {responses.map((response) => (
                <TabsContent key={response.engine} value={response.engine} className="space-y-4">
                  {/* Response Metadata */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Position
                      </p>
                      <p className="text-2xl font-bold">#{response.position || "N/A"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary">Sentiment</p>
                      <Badge
                        className={sentimentColor[response.sentiment]}
                        variant="outline"
                      >
                        {response.sentiment.charAt(0).toUpperCase() +
                          response.sentiment.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Last Updated
                      </p>
                      <p className="text-sm">
                        {new Date(response.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Response Text */}
                  <div className="space-y-2">
                    <p className="text-sm text-text-secondary">Response</p>
                    <div className="bg-gray-50 p-4 rounded-lg min-h-48 text-sm leading-relaxed max-h-96 overflow-y-auto">
                      {response.text || "No response text available"}
                    </div>
                  </div>

                  {/* Mentions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p className="text-sm text-text-secondary mb-2">Brand Mentions</p>
                      <p className="text-2xl font-bold">{response.mentions.brand}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-text-secondary mb-2">Competitor Mentions</p>
                      <p className="text-2xl font-bold">{response.mentions.competitors}</p>
                    </Card>
                  </div>

                  {/* Citations */}
                  {response.citations && response.citations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-text-secondary">Citations</p>
                      <ul className="space-y-2">
                        {response.citations.map((citation, i) => (
                          <li key={i} className="text-sm">
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {citation.text || citation.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length > 0 ? (
            <div className="space-y-4">
              {responses.map((response, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {response.engine === "chatgpt"
                        ? "ChatGPT"
                        : response.engine === "perplexity"
                        ? "Perplexity"
                        : "Google AIO"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {new Date(response.timestamp).toLocaleDateString()} at{" "}
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge>{response.position ? `#${response.position}` : "N/A"}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No analysis history yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
