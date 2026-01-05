"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import { GiscusComments } from '@/components/giscus-comments';
import { CommunityGuidelines } from '@/components/community-guidelines';
import { Loader2, MessageSquareText, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

/**
 * Community page for feedback and feature requests
 * Requires GitHub authentication to access
 */
export default function CommunityPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            toast.error('Please sign in with GitHub to access the community section');
            router.push('/');
        }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </main>
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    {/* Back Button */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Hero Header with Gradient Background */}
                    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/10 p-12 text-center shadow-lg">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="relative">
                                    <MessageSquareText className="h-12 w-12 text-primary" />
                                    <Sparkles className="h-5 w-5 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent">
                                    Community Feedback
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                    Share your ideas, report issues, and help shape the future of <span className="font-semibold text-foreground">MyGitStats</span>
                                </p>
                                <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto">
                                    Your feedback drives our development roadmap. Join the conversation and make your voice heard! 🚀
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Community Guidelines */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <CommunityGuidelines />
                    </motion.div>

                    {/* Giscus Comments Section - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="border rounded-xl bg-card text-card-foreground shadow-lg p-8 md:p-12"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">💬 Join the Discussion</h2>
                            <p className="text-muted-foreground">
                                Start a new conversation or contribute to existing discussions below
                            </p>
                        </div>
                        <GiscusComments />
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
