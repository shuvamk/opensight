const GITHUB_REPO_API = "https://api.github.com/repos/shuvamk/opensight";

export interface GitHubRepoResponse {
  stargazers_count: number;
  html_url: string;
  name: string;
  [key: string]: unknown;
}

export async function fetchGitHubRepo(): Promise<GitHubRepoResponse> {
  const res = await fetch(GITHUB_REPO_API, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub repo");
  return res.json();
}
