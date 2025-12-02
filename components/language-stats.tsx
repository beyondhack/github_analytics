"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Repository } from '@/types/github';

interface LanguageStatsProps {
  repositories: Repository[];
  loading: boolean;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function LanguageStats({ repositories, loading }: LanguageStatsProps) {
  const languageData = useMemo(() => {
    const languageCounts: Record<string, number> = {};
    const languageRepos: Record<string, number> = {};

    repositories.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + repo.size;
        languageRepos[repo.language] = (languageRepos[repo.language] || 0) + 1;
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
      color: COLORS[index % COLORS.length]
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

      {/* Language List */}
      <Card>
        <CardHeader>
          <CardTitle>Language Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {languageData.barData.map((lang, index) => (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium">{lang.language}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{lang.repositories} repos</p>
                  <p className="text-sm text-muted-foreground">{lang.size} KB</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}