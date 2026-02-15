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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface AddPromptDialogProps {
  onAdd: (promptText: string, tags: string[]) => Promise<void>;
  isLoading?: boolean;
  availableTags?: string[];
}

export function AddPromptDialog({
  onAdd,
  isLoading = false,
  availableTags = ["AI", "Search", "Content", "Brand", "Competitor"],
}: AddPromptDialogProps) {
  const [open, setOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!promptText.trim()) return;

    try {
      await onAdd(promptText.trim(), selectedTags);
      setPromptText("");
      setSelectedTags([]);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add prompt:", error);
    }
  };

  const isValid = promptText.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Prompt</DialogTitle>
          <DialogDescription>
            Enter a prompt to analyze across AI search engines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-text">Prompt Text</Label>
            <Input
              id="prompt-text"
              placeholder="e.g., How to use our product..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-20"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Select value={tagInput} onValueChange={handleAddTag}>
              <SelectTrigger id="tags">
                <SelectValue placeholder="Select tags..." />
              </SelectTrigger>
              <SelectContent>
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
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
            {isLoading ? "Adding..." : "Add Prompt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
