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
import { toast } from 'sonner';

interface DashboardProps {
  user: GitHubUser;
  onReset: () => void;
}

export function Dashboard({ user, onReset }: DashboardProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [followers, setFollowers] = useState<GitHubFollower[]>([]);
  const [following, setFollowing] = useState<GitHubFollower[]>([]);
  const [rateLimit, setRateLimit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTokenBanner, setShowTokenBanner] = useState(false);

  useEffect(() => {
    // Check if token is configured
    setShowTokenBanner(!hasGitHubToken());

    const fetchData = async () => {
      setLoading(true);
      try {
        // Show a toast for large accounts about pagination
        if (user.followers > 100 || user.following > 100) {
          toast.info('Fetching all data with pagination. This may take a moment...');
        }

        const [reposData, followersData, followingData, rateLimitData] = await Promise.all([
          fetchUserRepositories(user.login),
          fetchUserFollowers(user.login),
          fetchUserFollowing(user.login),
          fetchRateLimit()
        ]);

        setRepositories(reposData);
        setFollowers(followersData);
        setFollowing(followingData);
        setRateLimit(rateLimitData);

        // Show success message with counts
        const message = `Loaded ${reposData.length} repositories, ${followersData.length} followers, ${followingData.length} following`;
        toast.success(message);
      } catch (error) {
        toast.error('Failed to fetch some data');
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.login]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [reposData, followersData, followingData, rateLimitData] = await Promise.all([
        fetchUserRepositories(user.login),
        fetchUserFollowers(user.login),
        fetchUserFollowing(user.login),
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