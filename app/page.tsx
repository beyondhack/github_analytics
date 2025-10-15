"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { UserSearch } from '@/components/user-search';
import { Dashboard } from '@/components/dashboard';
import { GitHubUser } from '@/types/github';

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);

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
            <Dashboard user={user} onReset={() => setUser(null)} />
          </motion.div>
        )}
      </main>
    </div>
  );
}