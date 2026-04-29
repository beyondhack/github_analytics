"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { UserSearch } from '@/components/user-search';
import { Dashboard } from '@/components/dashboard';
import { GitHubUser } from '@/types/github';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { clearTokenCache } from '@/lib/github-api';

function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();

  useEffect(() => {
    const error = searchParams.get('error');
    const hasCallback = searchParams.has('code') || searchParams.has('error');
    
    if (!hasCallback) return;

    if (error) {
      if (error === 'oauth_not_configured') {
        toast.error('GitHub OAuth is not configured. Please set up GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.');
      } else if (error === 'invalid_state') {
        toast.error('Invalid OAuth state. Please try logging in again.');
      } else if (error === 'oauth_failed') {
        toast.error('OAuth authentication failed. Please try again.');
      } else {
        toast.error(`Authentication error: ${error}`);
      }
      // Clean URL
      window.history.replaceState({}, '', '/');
    } else {
      // Success - refresh session to get user data
      refreshSession();
      clearTokenCache();
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, '', url.toString());
      toast.success('Successfully logged in with GitHub!');
    }
  }, [searchParams, refreshSession]);

  return null;
}

function HomeContent() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const u = searchParams.get('u');

  useEffect(() => {
    if (u) {
      if (!user || user.login.toLowerCase() !== u.toLowerCase()) {
        const fetchUser = async () => {
          setLoading(true);
          try {
            const { fetchGitHubUser } = await import('@/lib/github-api');
            const data = await fetchGitHubUser(u);
            setUser(data);
          } catch (error) {
            toast.error(`User ${u} not found`);
            // Clean up URL if invalid
            router.replace('/');
          } finally {
            setLoading(false);
          }
        };
        fetchUser();
      }
    } else {
      // If URL does not have 'u', ensure user state is cleared
      setUser(null);
    }
  }, [u, user, router]);

  const handleReset = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection />
            <UserSearch 
              onUserFound={setUser} 
              loading={loading} 
              setLoading={setLoading} 
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Dashboard user={user} onReset={handleReset} />
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" />}>
      <OAuthCallbackHandler />
      <HomeContent />
    </Suspense>
  );
}