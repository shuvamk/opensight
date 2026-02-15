"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface BulkAddDialogProps {
  onAdd: (prompts: Array<{ text: string; tags: string[] }>) => Promise<void>;
  isLoading?: boolean;
}

export function BulkAddDialog({
  onAdd,
  isLoading = false,
}: BulkAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [textArea, setTextArea] = useState("");

  const handleSubmit = async () => {
    const lines = textArea
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;

    try {
      const prompts = lines.map((text) => ({
        text,
        tags: [],
      }));

      await onAdd(prompts);
      setTextArea("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add prompts:", error);
    }
  };

  const isValid = textArea.trim().split("\n").some((line) => line.trim());
  const promptCount = textArea
    .trim()
    .split("\n")
    .filter((line) => line.trim()).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Add Prompts</DialogTitle>
          <DialogDescription>
            Enter one prompt per line. Each prompt will be analyzed across all engines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-textarea">Prompts (one per line)</Label>
            <textarea
              id="bulk-textarea"
              placeholder="How to use our platform?&#10;What is the best price?&#10;Customer support options..."
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              className="w-full min-h-48 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {promptCount > 0 && (
            <p className="text-sm text-text-secondary">
              {promptCount} prompt{promptCount !== 1 ? "s" : ""} ready to add
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Adding..." : `Add ${promptCount} Prompt${promptCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
