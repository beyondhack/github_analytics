"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Repository } from '@/types/github';
import { ChevronDown, ChevronRight, ExternalLink, Star, GitFork } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LanguageStatsProps {
  repositories: Repository[];
  loading: boolean;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

interface LanguageDetailItemProps {
  lang: {
    language: string;
    repositories: number;
    size: number;
    color: string;
    repos: Repository[];
  };
  index: number;
}

function LanguageDetailItem({ lang, index }: LanguageDetailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border rounded-lg overflow-hidden"
    >
      {/* Header - Always Visible */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3 flex-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: lang.color }}
          />
          <span className="font-medium">{lang.language}</span>
          <Badge variant="secondary" className="ml-2">
            {lang.repositories} {lang.repositories === 1 ? 'repo' : 'repos'}
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right mr-2">
            <p className="text-sm text-muted-foreground">{lang.size} KB</p>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expandable Repository List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t bg-muted/20"
          >
            <div className="p-4 space-y-2">
              {lang.repos
                .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                .map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-md hover:bg-background border border-transparent hover:border-border transition-all group"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      <span className="font-medium truncate group-hover:text-primary">
                        {repo.name}
                      </span>
                      {repo.description && (
                        <span className="text-sm text-muted-foreground truncate hidden md:inline">
                          - {repo.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                      {repo.stargazers_count > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-3.5 h-3.5" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      )}
                      {repo.forks_count > 0 && (
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <GitFork className="w-3.5 h-3.5" />
                          <span>{repo.forks_count}</span>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function LanguageStats({ repositories, loading }: LanguageStatsProps) {
  const languageData = useMemo(() => {
    const languageCounts: Record<string, number> = {};
    const languageRepos: Record<string, number> = {};
    const languageRepositories: Record<string, Repository[]> = {};

    repositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + repo.size;
        languageRepos[repo.language] = (languageRepos[repo.language] || 0) + 1;

        // Store repositories for each language
        if (!languageRepositories[repo.language]) {
          languageRepositories[repo.language] = [];
        }
        languageRepositories[repo.language].push(repo);
      }
    });

    // Sort by repository count (most repos first)
    const sortedByRepoCount = Object.entries(languageRepos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const pieData = sortedByRepoCount.map(([language, count], index) => ({
      name: language,
      value: count,
      size: languageCounts[language],
      color: COLORS[index % COLORS.length]
    }));

    const barData = sortedByRepoCount.map(([language, count], index) => ({
      language,
      repositories: count,
      size: Math.round(languageCounts[language] / 1024), // Convert to KB
      color: COLORS[index % COLORS.length],
      repos: languageRepositories[language] || []
    }));

    // Find language with most repositories
    const mostUsedLanguage = sortedByRepoCount[0]?.[0] || 'N/A';

    // Find language with largest total size
    const largestBySize = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return {
      pieData,
      barData,
      totalLanguages: Object.keys(languageCounts).length,
      mostUsedLanguage,
      largestBySize
    };
  }, [repositories]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.language || data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.repositories || data.value} repositories
          </p>
          {data.size && (
            <p className="text-sm text-muted-foreground">
              {data.size} KB
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{languageData.totalLanguages}</p>
              <p className="text-sm text-muted-foreground">Languages Used</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {languageData.mostUsedLanguage}
              </p>
              <p className="text-sm text-muted-foreground">Most Used Language</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {repositories.filter(r => r.language).length}
              </p>
              <p className="text-sm text-muted-foreground">Repos with Languages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={languageData.pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => {
                      // Only show percentage if it is greater than 3% to avoid overlap
                      return percent > 0.03 ? `${(percent * 100).toFixed(0)}%` : '';
                    }}
                    labelLine={false}
                  >
                    {languageData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={60}
                    formatter={(value, entry: any) => {
                      const percent = ((entry.payload.value / languageData.pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                      return `${value} (${percent}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Repository Count by Language</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={languageData.barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="language"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="repositories" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Language List with Expandable Repositories */}
      <Card>
        <CardHeader>
          <CardTitle>Language Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {languageData.barData.map((lang, index) => (
              <LanguageDetailItem
                key={lang.language}
                lang={lang}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}