"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CompetitorTableItem {
  id: string;
  name: string;
  url: string;
  latestScore: number;
}

interface CompetitorTableProps {
  competitors: CompetitorTableItem[];
  isLoading?: boolean;
  onAdd?: (name: string, url: string) => Promise<void>;
  onRemove?: (id: string) => Promise<void>;
  maxCompetitors?: number;
}

export function CompetitorTable({
  competitors,
  isLoading = false,
  onAdd,
  onRemove,
  maxCompetitors = 5,
}: CompetitorTableProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCompetitor = async () => {
    if (!name.trim() || !url.trim()) return;

    try {
      setIsSubmitting(true);
      if (onAdd) {
        await onAdd(name.trim(), url.trim());
      }
      setName("");
      setUrl("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this competitor?")) return;

    try {
      if (onRemove) {
        await onRemove(id);
      }
    } catch (error) {
      console.error("Failed to remove competitor:", error);
    }
  };

  const canAddMore = competitors.length < maxCompetitors;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="space-y-2 p-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">Tracked Competitors</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              disabled={!canAddMore}
              title={!canAddMore ? `Maximum ${maxCompetitors} competitors allowed` : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Competitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Competitor</DialogTitle>
              <DialogDescription>
                Add a competitor to track their performance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competitor-name">Company Name</Label>
                <Input
                  id="competitor-name"
                  placeholder="e.g., Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitor-url">Website URL</Label>
                <Input
                  id="competitor-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCompetitor}
                disabled={!name.trim() || !url.trim() || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {competitors.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-center p-4">
          <p className="text-text-secondary">No competitors tracked yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Latest Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor) => (
              <TableRow key={competitor.id}>
                <TableCell className="font-medium">{competitor.name}</TableCell>
                <TableCell>
                  <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-xs block"
                  >
                    {competitor.url}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{competitor.latestScore}%</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(competitor.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
