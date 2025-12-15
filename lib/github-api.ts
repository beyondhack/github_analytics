import { GitHubUser, Repository, GitHubFollower, RateLimit, CommitStats, GitHubCommit } from '@/types/github';

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
 * @param startPage - Optional page number to start from (default: 1)
 */
async function fetchPaginatedData<T>(
  endpoint: string,
  perPage: number = 100,
  maxItems?: number,
  startPage: number = 1
): Promise<T[]> {
  const allData: T[] = [];
  let page = startPage;
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
 * @param startPage - Optional page number to start from (default: 1)
 */
export async function fetchUserFollowers(username: string, maxItems?: number, startPage: number = 1): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/followers`, 100, maxItems, startPage);
}

/**
 * Fetch following for a user with pagination
 * @param username - GitHub username
 * @param maxItems - Optional maximum number of users being followed to fetch. If not provided, fetches all following
 * @param startPage - Optional page number to start from (default: 1)
 */
export async function fetchUserFollowing(username: string, maxItems?: number, startPage: number = 1): Promise<GitHubFollower[]> {
  return fetchPaginatedData<GitHubFollower>(`/users/${username}/following`, 100, maxItems, startPage);
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
 * Fetch commit statistics for a user across all repositories
 * @param username - GitHub username
 * @param repositories - Array of user's repositories
 */
export async function fetchUserCommitStats(username: string, repositories: Repository[]): Promise<CommitStats> {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  let totalCommits = 0;
  let commitsThisWeek = 0;
  let commitsThisMonth = 0;
  let commitsThisYear = 0;
  let lastCommitDate: Date | null = null;

  const dayCommits: Record<string, number> = {};
  const monthCommits: Record<string, number> = {};

  // Filter out forked repos and limit to most recent repos to avoid rate limits
  const ownRepos = repositories
    .filter(repo => !repo.fork)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 20); // Limit to 20 most recently updated repos

  // Fetch commits from each repository
  for (const repo of ownRepos) {
    try {
      // Fetch commits from the last year only to reduce API calls
      const since = oneYearAgo.toISOString();
      const commits = await fetchPaginatedData<GitHubCommit>(
        `/repos/${repo.full_name}/commits?since=${since}`,
        100,
        500 // Limit to 500 commits per repo
      );

      for (const commit of commits) {
        const commitDate = new Date(commit.commit.author.date);
        totalCommits++;

        // Track last commit
        if (!lastCommitDate || commitDate > lastCommitDate) {
          lastCommitDate = commitDate;
        }

        // Count commits by time period
        if (commitDate >= oneWeekAgo) commitsThisWeek++;
        if (commitDate >= oneMonthAgo) commitsThisMonth++;
        if (commitDate >= oneYearAgo) commitsThisYear++;

        // Track by day of week
        const dayName = commitDate.toLocaleDateString('en-US', { weekday: 'long' });
        dayCommits[dayName] = (dayCommits[dayName] || 0) + 1;

        // Track by month
        const monthName = commitDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthCommits[monthName] = (monthCommits[monthName] || 0) + 1;
      }
    } catch (error) {
      console.error(`Failed to fetch commits for ${repo.name}:`, error);
      // Continue with other repos even if one fails
    }
  }

  // Calculate most productive day
  let mostProductiveDay = 'N/A';
  let maxDayCommits = 0;
  for (const [day, count] of Object.entries(dayCommits)) {
    if (count > maxDayCommits) {
      maxDayCommits = count;
      mostProductiveDay = day;
    }
  }

  // Calculate most productive month
  let mostProductiveMonth = 'N/A';
  let maxMonthCommits = 0;
  for (const [month, count] of Object.entries(monthCommits)) {
    if (count > maxMonthCommits) {
      maxMonthCommits = count;
      mostProductiveMonth = month;
    }
  }

  // Calculate average commits per day (based on account age)
  const accountCreatedDate = new Date(repositories[0]?.created_at || now);
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - accountCreatedDate.getTime()) / (24 * 60 * 60 * 1000)));
  const averageCommitsPerDay = totalCommits / daysSinceCreation;

  return {
    totalCommits,
    commitsThisWeek,
    commitsThisMonth,
    commitsThisYear,
    averageCommitsPerDay: parseFloat(averageCommitsPerDay.toFixed(2)),
    mostProductiveDay,
    mostProductiveMonth,
    lastCommitDate: lastCommitDate ? lastCommitDate.toISOString() : new Date().toISOString(),
  };
}

/**
 * Search GitHub for various types of content
 */
export async function searchGitHub(type: string, query: string, perPage: number = 20): Promise<any> {
  return fetchGitHubAPI(`/search/${type}?q=${encodeURIComponent(query)}&per_page=${perPage}`);
}