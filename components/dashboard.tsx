"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfile } from '@/components/user-profile';
import { RepositoryAnalytics } from '@/components/repository-analytics';
import { FollowerInsights } from '@/components/follower-insights';
import { LanguageStats } from '@/components/language-stats';
import { RateLimitStatus } from '@/components/rate-limit-status';
import { SearchFeatures } from '@/components/search-features';
import { GitHubTokenBanner } from '@/components/github-token-banner';
import { GitHubUser, Repository, GitHubFollower } from '@/types/github';
import { fetchUserRepositories, fetchUserFollowers, fetchUserFollowing, fetchRateLimit, hasGitHubToken } from '@/lib/github-api';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface DashboardProps {
  user: GitHubUser;
  onReset: () => void;
}

// Maximum number of followers/following to load initially for large profiles
const MAX_FOLLOWERS_TO_LOAD = 500;

export function Dashboard({ user, onReset }: DashboardProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [followers, setFollowers] = useState<GitHubFollower[]>([]);
  const [following, setFollowing] = useState<GitHubFollower[]>([]);
  const [rateLimit, setRateLimit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTokenBanner, setShowTokenBanner] = useState(false);
  const { user: authUser } = useAuth();

  useEffect(() => {
    // Check if token is configured (async)
    const checkToken = async () => {
      const hasToken = await hasGitHubToken();
      // Show banner if no token and user is not authenticated
      setShowTokenBanner(!hasToken && !authUser);
    };
    checkToken();

    const fetchData = async () => {
      setLoading(true);
      try {
        // Determine if we should limit followers/following based on profile size
        const shouldLimitFollowers = user.followers > MAX_FOLLOWERS_TO_LOAD;
        const shouldLimitFollowing = user.following > MAX_FOLLOWERS_TO_LOAD;
        
        // Show appropriate message based on whether we're limiting
        if (shouldLimitFollowers || shouldLimitFollowing) {
          toast.info(`Loading first ${MAX_FOLLOWERS_TO_LOAD} followers/following for faster performance. Insights will be approximate.`);
        } else if (user.followers > 100 || user.following > 100) {
          toast.info('Fetching all data with pagination. This may take a moment...');
        }

        const [reposData, followersData, followingData, rateLimitData] = await Promise.all([
          fetchUserRepositories(user.login),
          fetchUserFollowers(user.login, shouldLimitFollowers ? MAX_FOLLOWERS_TO_LOAD : undefined),
          fetchUserFollowing(user.login, shouldLimitFollowing ? MAX_FOLLOWERS_TO_LOAD : undefined),
          fetchRateLimit()
        ]);

        setRepositories(reposData);
        setFollowers(followersData);
        setFollowing(followingData);
        setRateLimit(rateLimitData);

        // Show success message with counts
        const followersMsg = shouldLimitFollowers 
          ? `${followersData.length} of ${user.followers.toLocaleString()} followers`
          : `${followersData.length} followers`;
        const followingMsg = shouldLimitFollowing
          ? `${followingData.length} of ${user.following.toLocaleString()} following`
          : `${followingData.length} following`;
        
        const message = `Loaded ${reposData.length} repositories, ${followersMsg}, ${followingMsg}`;
        toast.success(message);
      } catch (error) {
        toast.error('Failed to fetch some data');
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.login, authUser]);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Use same limits as initial fetch
      const shouldLimitFollowers = user.followers > MAX_FOLLOWERS_TO_LOAD;
      const shouldLimitFollowing = user.following > MAX_FOLLOWERS_TO_LOAD;

      const [reposData, followersData, followingData, rateLimitData] = await Promise.all([
        fetchUserRepositories(user.login),
        fetchUserFollowers(user.login, shouldLimitFollowers ? MAX_FOLLOWERS_TO_LOAD : undefined),
        fetchUserFollowing(user.login, shouldLimitFollowing ? MAX_FOLLOWERS_TO_LOAD : undefined),
        fetchRateLimit()
      ]);

      setRepositories(reposData);
      setFollowers(followersData);
      setFollowing(followingData);
      setRateLimit(rateLimitData);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showTokenBanner && <GitHubTokenBanner />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={onReset}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <RateLimitStatus rateLimit={rateLimit} />
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </motion.div>

      <UserProfile user={user} />

      <Tabs defaultValue="repositories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories">
          <RepositoryAnalytics 
            repositories={repositories} 
            username={user.login}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="followers">
          <FollowerInsights 
            followers={followers}
            following={following}
            loading={loading}
            totalFollowers={user.followers}
            totalFollowing={user.following}
            isLimited={user.followers > MAX_FOLLOWERS_TO_LOAD || user.following > MAX_FOLLOWERS_TO_LOAD}
          />
        </TabsContent>

        <TabsContent value="languages">
          <LanguageStats 
            repositories={repositories}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="search">
          <SearchFeatures />
        </TabsContent>
      </Tabs>
    </div>
  );
}