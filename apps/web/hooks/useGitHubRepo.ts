"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGitHubRepo } from "@/lib/github";

export function useGitHubRepo() {
  return useQuery({
    queryKey: ["githubRepo", "shuvamk/opensight"],
    queryFn: fetchGitHubRepo,
    staleTime: 1000 * 60 * 5,
  });
}
