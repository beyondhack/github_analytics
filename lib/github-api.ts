import { GitHubUser, Repository, GitHubFollower, RateLimit } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// Get GitHub token from environment (optional)
const getGitHubToken = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GITHUB_TOKEN;
};

// Check if token is configured
export const hasGitHubToken = (): boolean => {
  return !!getGitHubToken();
};

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

/**
 * Base fetch function for GitHub API with optional authentication
 */
async function fetchGitHubAPI(endpoint: string): Promise<any> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Analytics-Dashboard',
  };

  // Add authorization header if token is available
  const token = getGitHubToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubAPIError('User not found', 404);
    }
    if (response.status === 403) {
      throw new GitHubAPIError('API rate limit exceeded. Consider adding a GitHub token for higher limits.', 403);
    }
    throw new GitHubAPIError(`GitHub API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

/**
 * Fetch paginated data from GitHub API
 * Automatically fetches all pages until no more data is available
 */
async function fetchPaginatedData<T>(
  endpoint: string,
  perPage: number = 100
): Promise<T[]> {
  const allData: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const separator = endpoint.includes('?') ? '&' : '?';
    const data = await fetchGitHubAPI(
      `${endpoint}${separator}per_page=${perPage}&page=${page}`
    );

    if (Array.isArray(data) && data.length > 0) {
      allData.push(...data);
      hasMore = data.length === perPage; // Continue if we got a full page
      page++;
    } else {
      hasMore = false;
    }
  }

  return allData;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchGitHubAPI(`/users/${username}`);
}

/**
 * Fetch all repositories for a user with pagination
 * This will fetch ALL repositories, not just the first 100
 */
export async function fetchUserRepositories(username: string): Promise<Repository[]> {
  return fetchPaginatedData<Repository>(`/users/${username}/repos?sort=updated`);
}

/**
 * Fetch all followers for a user with pagination
 * This will fetch ALL followers, not just the first 100
 */
export async function fetchUserFollowers(username: string): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/followers`);
}

/**
 * Fetch all following for a user with pagination
 * This will fetch ALL users being followed, not just the first 100
 */
export async function fetchUserFollowing(username: string): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/following`);
}

/**
 * Fetch all starred repositories for a user with pagination
 */
export async function fetchUserStarred(username: string): Promise<Repository[]> {
  return fetchPaginatedData<Repository>(`/users/${username}/starred`);
}

/**
 * Fetch all gists for a user with pagination
 */
export async function fetchUserGists(username: string): Promise<any[]> {
  return fetchPaginatedData<any>(`/users/${username}/gists`);
}

/**
 * Fetch current rate limit status
 */
export async function fetchRateLimit(): Promise<RateLimit> {
  return fetchGitHubAPI('/rate_limit');
}

/**
 * Search GitHub for various types of content
 */
export async function searchGitHub(type: string, query: string, perPage: number = 20): Promise<any> {
  return fetchGitHubAPI(`/search/${type}?q=${encodeURIComponent(query)}&per_page=${perPage}`);
}