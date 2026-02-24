"use client";

import { useQuery } from "@tanstack/react-query";
import { getGitHubRepo } from "@/lib/github";

const STALE_TIME_MS = 60_000; // 1 minute

export function useGitHubRepo(owner: string | null, repo: string | null) {
  return useQuery({
    queryKey: ["github", "repo", owner, repo],
    queryFn: () => getGitHubRepo(owner!, repo!),
    enabled: !!owner && !!repo,
    staleTime: STALE_TIME_MS,
  });
}
