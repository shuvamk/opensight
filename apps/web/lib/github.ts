/**
 * GitHub API helpers with stale-while-revalidate caching.
 * @see https://api.github.com/repos/{owner}/{repo}
 */

const GITHUB_API_BASE = "https://api.github.com/repos";

export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  [key: string]: unknown;
}

/**
 * Fetches repo metadata from GitHub API.
 * Use with React Query (e.g. useGitHubRepo) for caching and stale-while-revalidate.
 */
export async function getGitHubRepo(
  owner: string,
  repo: string,
): Promise<GitHubRepoResponse | null> {
  const res = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;
  return (await res.json()) as GitHubRepoResponse;
}

/** Parse owner and repo from a GitHub URL (e.g. https://github.com/shuvamk/opensight). */
export function parseGitHubRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
  if (!match) return null;
  const fullMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!fullMatch) return null;
  return { owner: fullMatch[1], repo: fullMatch[2].replace(/\/?$/, "") };
}
