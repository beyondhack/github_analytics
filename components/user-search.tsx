"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { GitHubUser } from '@/types/github';
import { fetchGitHubUser } from '@/lib/github-api';

interface UserSearchProps {
  onUserFound: (user: GitHubUser) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FAMOUS_USERS = [
  'torvalds', 'gaearon', 'sindresorhus', 'tj', 'addyosmani', 'paulirish',
  'kentcdodds', 'wesbos', 'bradtraversy', 'getify', 'mdo', 'fat',
  'dhh', 'jeresig', 'defunkt', 'mojombo', 'schacon', 'pjhyett'
];

export function UserSearch({ onUserFound, loading, setLoading }: UserSearchProps) {
  const [username, setUsername] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    try {
      const user = await fetchGitHubUser(username.trim());
      onUserFound(user);
      toast.success(`Found ${user.name || user.login}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleLuckySearch = async () => {
    const randomUser = FAMOUS_USERS[Math.floor(Math.random() * FAMOUS_USERS.length)];
    setUsername(randomUser);
    
    setLoading(true);
    try {
      const user = await fetchGitHubUser(randomUser);
      onUserFound(user);
      toast.success(`Found ${user.name || user.login}! 🍀`);
    } catch (error) {
      toast.error('Lucky search failed, try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
              GitHub Username
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="username"
                type="text"
                placeholder="Enter GitHub username (e.g., octocat)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-12 text-lg"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-neutral-800 to-neutral-600 hover:from-neutral-900 hover:to-neutral-700 dark:from-neutral-200 dark:to-neutral-400 dark:hover:from-neutral-100 dark:hover:to-neutral-300 text-white dark:text-black relative overflow-hidden group"
              disabled={loading}
            >
              <div className="absolute inset-0 gradient-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Profile
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleLuckySearch}
              disabled={loading}
              className="h-12 px-6 font-semibold border-2 hover:bg-muted/50 transition-all duration-300 group"
            >
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              I'm Feeling Lucky
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Try popular usernames: 
            <button 
              onClick={() => setUsername('torvalds')}
              className="ml-1 text-primary hover:underline"
              disabled={loading}
            >
              torvalds
            </button>
            ,
            <button 
              onClick={() => setUsername('gaearon')}
              className="ml-1 text-primary hover:underline"
              disabled={loading}
            >
              gaearon
            </button>
            ,
            <button 
              onClick={() => setUsername('sindresorhus')}
              className="ml-1 text-primary hover:underline"
              disabled={loading}
            >
              sindresorhus
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}