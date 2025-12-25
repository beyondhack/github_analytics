"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/header';
import { GiscusComments } from '@/components/giscus-comments';
import { CommunityGuidelines } from '@/components/community-guidelines';
import { Loader2, MessageSquareText } from 'lucide-react';
import { toast } from 'sonner';

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

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Page Header */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <MessageSquareText className="h-8 w-8 text-primary" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                                Community Feedback
                            </h1>
                        </div>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Share your ideas, report issues, and help shape the future of MyGitStats.
                            Your feedback drives our development roadmap.
                        </p>
                    </div>

                    {/* Community Guidelines */}
                    <CommunityGuidelines />

                    {/* Giscus Comments Section */}
                    <div className="border rounded-lg bg-card text-card-foreground shadow-sm p-6">
                        <GiscusComments />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
