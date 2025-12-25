"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, MessageSquare, Shield, Users, AlertCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

/**
 * Community guidelines component with collapsible sections
 * Persists open/closed state in localStorage
 */
export function CommunityGuidelines() {
    const [isOpen, setIsOpen] = useState(true);

    // Load saved state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('community-guidelines-open');
        if (saved !== null) {
            setIsOpen(saved === 'true');
        }
    }, []);

    // Save state to localStorage when changed
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        localStorage.setItem('community-guidelines-open', String(open));
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={handleOpenChange}
            className="w-full border rounded-lg bg-card text-card-foreground shadow-sm"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-6 hover:bg-muted/50"
                >
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Community Guidelines</h2>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-4 pt-2">
                    {/* Purpose Section */}
                    <div className="flex gap-3">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">Purpose</h3>
                            <p className="text-sm text-muted-foreground">
                                This community space is dedicated to <strong>feedback and feature requests</strong> for MyGitStats.
                                Share your ideas, report issues, and help us improve the platform for everyone.
                            </p>
                        </div>
                    </div>

                    {/* Posting Guidelines */}
                    <div className="flex gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">Posting Guidelines</h3>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li><strong>Search first:</strong> Check if your suggestion already exists</li>
                                <li><strong>Be specific:</strong> Provide clear details and examples</li>
                                <li><strong>Stay on topic:</strong> Focus on feedback and feature requests</li>
                                <li><strong>Be respectful:</strong> Treat others with kindness and professionalism</li>
                            </ul>
                        </div>
                    </div>

                    {/* Moderation Policy */}
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">Moderation</h3>
                            <p className="text-sm text-muted-foreground">
                                We maintain a welcoming environment. Posts that are spam, off-topic, disrespectful,
                                or violate GitHub's community guidelines will be removed. Repeated violations may result
                                in being blocked from discussions.
                            </p>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
