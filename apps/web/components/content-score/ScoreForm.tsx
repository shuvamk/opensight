"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const scoreFormSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type ScoreFormInputs = z.infer<typeof scoreFormSchema>;

interface ScoreFormProps {
  onScoreSubmit: (url: string) => Promise<void>;
  isLoading?: boolean;
}

export function ScoreForm({ onScoreSubmit, isLoading = false }: ScoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ScoreFormInputs>({
    resolver: zodResolver(scoreFormSchema),
  });

  const onSubmit = async (data: ScoreFormInputs) => {
    try {
      await onScoreSubmit(data.url);
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to score page"
      );
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Page URL</Label>
          <Input
            id="url"
            placeholder="https://example.com/page"
            {...register("url")}
            disabled={isLoading}
            aria-describedby={errors.url ? "url-error" : undefined}
          />
          {errors.url && (
            <p id="url-error" className="text-sm text-red-500">
              {errors.url.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing page...
            </>
          ) : (
            "Score"
          )}
        </Button>
      </form>
    </Card>
  );
}
