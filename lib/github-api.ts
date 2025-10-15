import { GitHubUser, Repository, GitHubFollower, RateLimit } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

async function fetchGitHubAPI(endpoint: string): Promise<any> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Analytics-Dashboard',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubAPIError('User not found', 404);
    }
    if (response.status === 403) {
      throw new GitHubAPIError('API rate limit exceeded', 403);
    }
    throw new GitHubAPIError(`GitHub API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchGitHubAPI(`/users/${username}`);
}

export async function fetchUserRepositories(username: string): Promise<Repository[]> {
  const repos = await fetchGitHubAPI(`/users/${username}/repos?per_page=100&sort=updated`);
  return repos;
}

export async function fetchUserFollowers(username: string): Promise<GitHubFollower[]> {
  const followers = await fetchGitHubAPI(`/users/${username}/followers?per_page=100`);
  return followers;
}

export async function fetchUserFollowing(username: string): Promise<GitHubFollower[]> {
  const following = await fetchGitHubAPI(`/users/${username}/following?per_page=100`);
  return following;
}

export async function fetchUserStarred(username: string): Promise<Repository[]> {
  const starred = await fetchGitHubAPI(`/users/${username}/starred?per_page=100`);
  return starred;
}

export async function fetchUserGists(username: string): Promise<any[]> {
  const gists = await fetchGitHubAPI(`/users/${username}/gists?per_page=100`);
  return gists;
}

export async function fetchRateLimit(): Promise<RateLimit> {
  return fetchGitHubAPI('/rate_limit');
}

export async function searchGitHub(type: string, query: string, perPage: number = 20): Promise<any> {
  return fetchGitHubAPI(`/search/${type}?q=${encodeURIComponent(query)}&per_page=${perPage}`);
}