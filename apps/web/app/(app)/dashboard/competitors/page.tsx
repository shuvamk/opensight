"use client";

import React, { useState } from "react";
import { useCompetitors, useAddCompetitor, useRemoveCompetitor } from "@/hooks/useCompetitors";
import { useBrandStore } from "@/stores/brand-store";
import { CompetitorTable, CompetitorTableItem } from "@/components/competitors/CompetitorTable";
import { ShareOfVoice } from "@/components/competitors/ShareOfVoice";
import { GapAnalysis } from "@/components/competitors/GapAnalysis";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState as useQueryState } from "react";

// Mock trend data for comparison chart
const mockTrendData = [
  { date: "Jan 1", brand: 45, competitor: 35 },
  { date: "Jan 8", brand: 48, competitor: 37 },
  { date: "Jan 15", brand: 52, competitor: 38 },
  { date: "Jan 22", brand: 55, competitor: 40 },
  { date: "Jan 29", brand: 58, competitor: 42 },
  { date: "Feb 5", brand: 62, competitor: 45 },
  { date: "Feb 12", brand: 65, competitor: 47 },
];

export default function CompetitorsPage() {
  const { activeBrandId } = useBrandStore();
  const { data: competitors = [], isLoading: isLoadingCompetitors } = useCompetitors(activeBrandId);
  const { mutateAsync: addCompetitor, isPending: isAddingCompetitor } = useAddCompetitor(
    activeBrandId
  );
  const { mutateAsync: removeCompetitor, isPending: isRemovingCompetitor } = useRemoveCompetitor(
    activeBrandId
  );
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);

  if (!activeBrandId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Competitors</h2>
        </div>
        <div className="flex items-center justify-center h-96 rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No brand selected</h3>
            <p className="text-text-secondary">
              Please select or create a brand to track competitors.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddCompetitor = async (name: string, url: string) => {
    try {
      await addCompetitor({ name, url });
    } catch (error) {
      console.error("Failed to add competitor:", error);
      alert("Failed to add competitor");
    }
  };

  const handleRemoveCompetitor = async (id: string) => {
    try {
      await removeCompetitor(id);
    } catch (error) {
      console.error("Failed to remove competitor:", error);
      alert("Failed to remove competitor");
    }
  };

  const competitorItems: CompetitorTableItem[] = (competitors as any[]).map((c) => ({
    id: c.id,
    name: c.name,
    url: c.url,
    latestScore: c.latestScore || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Competitors</h2>
          <p className="text-text-secondary mt-1">
            Track and compare your brand against competitors
          </p>
        </div>
      </div>

      {/* Main Content */}
      {isLoadingCompetitors ? (
        <div className="space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-80" />
        </div>
      ) : competitors.length === 0 ? (
        /* Empty State */
        <Card className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">No competitors tracked yet</h3>
            <p className="text-text-secondary max-w-sm">
              Add competitors to see how your brand compares across AI search engines. Track up to
              5 competitors.
            </p>
            <Button
              onClick={() => {
                // The CompetitorTable component has the "Add Competitor" button
              }}
            >
              Start Comparing
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Competitor Table */}
          <CompetitorTable
            competitors={competitorItems}
            isLoading={isLoadingCompetitors}
            onAdd={handleAddCompetitor}
            onRemove={handleRemoveCompetitor}
            maxCompetitors={5}
          />

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Share of Voice */}
            <ShareOfVoice />

            {/* Trend Comparison */}
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Trend Comparison</h3>
                {selectedCompetitorId && competitorItems.find((c) => c.id === selectedCompetitorId) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={mockTrendData}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => `${value}%`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="brand"
                        stroke="#3b82f6"
                        name="Your Brand"
                        dot={false}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="competitor"
                        stroke="#ef4444"
                        name={
                          competitorItems.find((c) => c.id === selectedCompetitorId)
                            ?.name || "Competitor"
                        }
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : competitorItems.length > 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <p className="text-text-secondary mb-3">Select a competitor to see trend comparison</p>
                    <div className="space-y-2 max-w-xs">
                      {competitorItems.map((c) => (
                        <Button
                          key={c.id}
                          variant="outline"
                          className="w-full text-sm"
                          onClick={() => setSelectedCompetitorId(c.id)}
                        >
                          {c.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-text-secondary">
                    No competitors to compare
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Gap Analysis */}
          <GapAnalysis />
        </>
      )}
    </div>
  );
}
