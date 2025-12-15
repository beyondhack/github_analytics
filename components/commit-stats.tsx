"use client";

import { motion } from 'framer-motion';
import { GitCommit, TrendingUp, Calendar, Clock, Award, Activity, Zap, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CommitStats } from '@/types/github';

interface CommitStatsProps {
    stats: CommitStats | null;
    loading: boolean;
}

export function CommitStatsComponent({ stats, loading }: CommitStatsProps) {
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <GitCommit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No commit data available</p>
            </div>
        );
    }

    const formatLastCommit = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const statCards = [
        {
            title: 'Total Commits',
            value: stats.totalCommits.toLocaleString(),
            description: 'All-time contributions',
            icon: GitCommit,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
        {
            title: 'This Week',
            value: stats.commitsThisWeek.toLocaleString(),
            description: 'Last 7 days',
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            borderColor: 'border-green-200 dark:border-green-800',
        },
        {
            title: 'This Month',
            value: stats.commitsThisMonth.toLocaleString(),
            description: 'Last 30 days',
            icon: Calendar,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
        },
        {
            title: 'This Year',
            value: stats.commitsThisYear.toLocaleString(),
            description: 'Last 12 months',
            icon: Activity,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            borderColor: 'border-orange-200 dark:border-orange-800',
        },
        {
            title: 'Daily Average',
            value: stats.averageCommitsPerDay.toFixed(2),
            description: 'Commits per day',
            icon: Zap,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
        },
        {
            title: 'Most Productive Day',
            value: stats.mostProductiveDay,
            description: 'Day of the week',
            icon: Award,
            color: 'text-pink-500',
            bgColor: 'bg-pink-50 dark:bg-pink-950/20',
            borderColor: 'border-pink-200 dark:border-pink-800',
        },
        {
            title: 'Most Productive Month',
            value: stats.mostProductiveMonth,
            description: 'Peak activity period',
            icon: Clock,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800',
        },
        {
            title: 'Last Commit',
            value: formatLastCommit(stats.lastCommitDate),
            description: 'Most recent activity',
            icon: History,
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
            borderColor: 'border-cyan-200 dark:border-cyan-800',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Commit Statistics</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Based on the last year of activity across your top 20 most recently updated repositories (excluding forks)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className={`h-full hover:shadow-lg transition-all border ${card.borderColor} ${card.bgColor}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                            <Icon className={`w-5 h-5 ${card.color}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {card.title}
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {card.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {card.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Commit statistics are calculated from your most recent repositories to optimize API usage.
                    The data represents commits from the last year where you are listed as the author.
                </p>
            </div>
        </div>
    );
}
