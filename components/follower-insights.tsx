"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserMinus, UserPlus, ExternalLink, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitHubFollower } from '@/types/github';

interface FollowerInsightsProps {
  followers: GitHubFollower[];
  following: GitHubFollower[];
  loading: boolean;
  totalFollowers: number;
  totalFollowing: number;
  isLimited: boolean;
}

export function FollowerInsights({ 
  followers, 
  following, 
  loading, 
  totalFollowers, 
  totalFollowing, 
  isLimited 
}: FollowerInsightsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const insights = useMemo(() => {
    const followingIds = new Set(following.map(user => user.id));
    const followerIds = new Set(followers.map(user => user.id));
    
    const notFollowingBack = followers.filter(follower => !followingIds.has(follower.id));
    const notFollowedBack = following.filter(user => !followerIds.has(user.id));
    const mutualFollows = followers.filter(follower => followingIds.has(follower.id));

    return {
      notFollowingBack,
      notFollowedBack,
      mutualFollows,
      totalFollowers: followers.length,
      totalFollowing: following.length,
    };
  }, [followers, following]);

  const filterUsers = (users: GitHubFollower[]) => {
    return users.filter(user =>
      user.login.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatCount = (count: number) => {
    if (count > 100) {
      return `${count.toLocaleString()}`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-8 rounded-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, count, icon: Icon, color, isApproximate }: { 
    title: string; 
    count: number; 
    icon: any; 
    color: string;
    isApproximate?: boolean;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{formatCount(count)}</p>
            <p className="text-sm text-muted-foreground">
              {title}
              {isApproximate && (
                <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">(approx.)</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const UserList = ({ users, emptyMessage }: { users: GitHubFollower[], emptyMessage: string }) => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterUsers(users).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                    <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.login}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.type === 'Organization' ? 'Organization' : 'User'}
                    </p>
                  </div>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filterUsers(users).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? 'No users found matching your search.' : emptyMessage}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Warning Banner for Limited Data */}
      {isLimited && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertTitle className="text-orange-800 dark:text-orange-300">
            Limited Data - Approximate Insights
          </AlertTitle>
          <AlertDescription className="text-orange-700 dark:text-orange-400">
            For better performance, only the first {followers.length.toLocaleString()} of {totalFollowers.toLocaleString()} followers 
            and {following.length.toLocaleString()} of {totalFollowing.toLocaleString()} following have been loaded. 
            The calculations for "don't follow back", "don't follow you", and "mutual follows" are approximate based on this limited data.
          </AlertDescription>
        </Alert>
      )}

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Followers Loaded</p>
                <p className="text-2xl font-bold">
                  {followers.length.toLocaleString()}
                  {isLimited && totalFollowers > followers.length && (
                    <span className="text-lg font-normal text-muted-foreground">
                      {' '}/ {totalFollowers.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Following Loaded</p>
                <p className="text-2xl font-bold">
                  {following.length.toLocaleString()}
                  {isLimited && totalFollowing > following.length && (
                    <span className="text-lg font-normal text-muted-foreground">
                      {' '}/ {totalFollowing.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Don't Follow Back"
          count={insights.notFollowingBack.length}
          icon={UserMinus}
          color="bg-red-500"
          isApproximate={isLimited}
        />
        <StatCard
          title="Don't Follow You"
          count={insights.notFollowedBack.length}
          icon={UserPlus}
          color="bg-orange-500"
          isApproximate={isLimited}
        />
        <StatCard
          title="Mutual Follows"
          count={insights.mutualFollows.length}
          icon={Users}
          color="bg-green-500"
          isApproximate={isLimited}
        />
      </div>

      {/* Detailed Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="not-following-back" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="not-following-back">Don't Follow Back</TabsTrigger>
              <TabsTrigger value="not-followed-back">Don't Follow You</TabsTrigger>
              <TabsTrigger value="mutual">Mutual Follows</TabsTrigger>
            </TabsList>

            <TabsContent value="not-following-back">
              <UserList
                users={insights.notFollowingBack}
                emptyMessage="You follow back all your followers!"
              />
            </TabsContent>

            <TabsContent value="not-followed-back">
              <UserList
                users={insights.notFollowedBack}
                emptyMessage="All users you follow also follow you back!"
              />
            </TabsContent>

            <TabsContent value="mutual">
              <UserList
                users={insights.mutualFollows}
                emptyMessage="No mutual follows found."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}