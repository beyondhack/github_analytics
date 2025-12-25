"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface GiscusCommentsProps {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
}

/**
 * Giscus comments component with lazy loading and theme integration
 * Only loads Giscus scripts when component mounts
 */
export function GiscusComments({
    repo = "beyondhack/github_analytics",
    repoId = "", // Will be auto-detected by Giscus
    category = "Feedback",
    categoryId = "", // Will be auto-detected by Giscus
}: Partial<GiscusCommentsProps>) {
    const { theme, resolvedTheme } = useTheme();
    const commentsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!commentsRef.current) return;

        // Determine the theme to use for Giscus
        const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', repo);
        script.setAttribute('data-repo-id', repoId || ''); // Giscus will auto-detect if empty
        script.setAttribute('data-category', category);
        script.setAttribute('data-category-id', categoryId || ''); // Giscus will auto-detect if empty
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', giscusTheme);
        script.setAttribute('data-lang', 'en');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;

        // Clear any existing Giscus content
        commentsRef.current.innerHTML = '';

        // Append script to trigger Giscus load
        commentsRef.current.appendChild(script);

        // Cleanup function
        return () => {
            if (commentsRef.current) {
                commentsRef.current.innerHTML = '';
            }
        };
    }, [repo, repoId, category, categoryId, resolvedTheme]);

    return (
        <div className="w-full">
            <div ref={commentsRef} className="giscus-container" />
        </div>
    );
}
