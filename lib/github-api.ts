import { GitHubUser, Repository, GitHubFollower, RateLimit } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

// Cache for user token to avoid repeated API calls
let userTokenCache: string | null | undefined = undefined;
let tokenCacheTime: number = 0;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get user's GitHub token from authenticated session
 * Falls back to shared token if user is not authenticated
 */
async function getUserToken(): Promise<string | null> {
  // Check cache first
  if (userTokenCache !== undefined && Date.now() - tokenCacheTime < TOKEN_CACHE_DURATION) {
    return userTokenCache || null;
  }

  try {
    // Try to get user's token from API
    const response = await fetch('/api/auth/token');
    const data = await response.json();
    
    if (data.token) {
      userTokenCache = data.token;
      tokenCacheTime = Date.now();
      return data.token;
    }
  } catch (error) {
    console.error('Failed to fetch user token:', error);
  }

  // Fallback to shared token
  const sharedToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  userTokenCache = sharedToken || null;
  tokenCacheTime = Date.now();
  return sharedToken || null;
}

// Get GitHub token from environment (optional, fallback only)
const getGitHubToken = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GITHUB_TOKEN;
};

// Check if any token is configured (user token or shared token)
export const hasGitHubToken = async (): Promise<boolean> => {
  const token = await getUserToken();
  return !!token;
};

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

/**
 * Base fetch function for GitHub API with optional authentication
 * Uses user's authenticated token if available, falls back to shared token
 */
async function fetchGitHubAPI(endpoint: string): Promise<any> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Analytics-Dashboard',
  };

  // Get token (user token takes priority over shared token)
  const token = await getUserToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubAPIError('User not found', 404);
    }
    if (response.status === 403) {
      throw new GitHubAPIError('API rate limit exceeded. Please login with GitHub or add a GitHub token for higher limits.', 403);
    }
    throw new GitHubAPIError(`GitHub API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

/**
 * Fetch paginated data from GitHub API
 * Automatically fetches all pages until no more data is available
 * @param endpoint - GitHub API endpoint
 * @param perPage - Number of items per page (default: 100)
 * @param maxItems - Optional maximum number of items to fetch. If provided, stops fetching when reached
 */
async function fetchPaginatedData<T>(
  endpoint: string,
  perPage: number = 100,
  maxItems?: number
): Promise<T[]> {
  const allData: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const separator = endpoint.includes('?') ? '&' : '?';
    try {
      const data = await fetchGitHubAPI(
        `${endpoint}${separator}per_page=${perPage}&page=${page}`
      );

      if (Array.isArray(data) && data.length > 0) {
        // If maxItems is set, only add items up to the limit
        if (maxItems !== undefined) {
          const remaining = maxItems - allData.length;
          if (remaining > 0) {
            allData.push(...data.slice(0, remaining));
          }
          // Stop if we've reached the limit
          if (allData.length >= maxItems) {
            hasMore = false;
            break;
          }
        } else {
          allData.push(...data);
        }
        
        hasMore = data.length === perPage; // Continue if we got a full page
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      // If we get a rate limit error and have some data, return what we have
      if (error instanceof GitHubAPIError && error.status === 403 && allData.length > 0) {
        console.warn('Rate limit reached, returning partial data');
        break;
      }
      throw error;
    }
  }

  return allData;
}

/**
 * Clear token cache (useful after login/logout)
 */
export function clearTokenCache(): void {
  userTokenCache = undefined;
  tokenCacheTime = 0;
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
 * Fetch followers for a user with pagination
 * @param username - GitHub username
 * @param maxItems - Optional maximum number of followers to fetch. If not provided, fetches all followers
 */
export async function fetchUserFollowers(username: string, maxItems?: number): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/followers`, 100, maxItems);
}

/**
 * Fetch following for a user with pagination
 * @param username - GitHub username
 * @param maxItems - Optional maximum number of users being followed to fetch. If not provided, fetches all following
 */
export async function fetchUserFollowing(username: string, maxItems?: number): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/following`, 100, maxItems);
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