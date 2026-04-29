"use client";

import { motion } from 'framer-motion';
import { BarChart3, GitBranch, Users, Star } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  const features = [
    { icon: BarChart3, text: "Repository Analytics" },
    { icon: Users, text: "Follower Insights" },
    { icon: Star, text: "Star Tracking" },
    { icon: GitBranch, text: "Code Analysis" }
  ];

  return (
    <div className="text-center py-16 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/lytgitheader.png"
              alt="LytGit Logo"
              width={256}
              height={256}
              priority
              className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
            />
          </div>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Unlock powerful insights from any GitHub profile. Discover follower patterns,
          repository analytics, and development trends with beautiful visualizations.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-6 pt-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="flex items-center space-x-2 bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm"
          >
            <feature.icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}