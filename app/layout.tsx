import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GitHub Analytics Dashboard - Analyze Profiles, Followers & Repositories',
  description: 'Analyze GitHub profiles with advanced follower insights, repository analytics, language statistics, and powerful search. Track who follows you back, sort repos by stars, and discover GitHub trends.',
  keywords: [
    'GitHub',
    'analytics',
    'dashboard',
    'developer',
    'insights',
    'followers',
    'repositories',
    'statistics',
    'GitHub API',
    'profile analysis',
    'follower tracking',
    'repository analytics',
    'programming languages',
    'GitHub search',
    'developer tools',
  ],
  authors: [{ name: 'GitHub Analytics Dashboard' }],
  openGraph: {
    title: 'GitHub Analytics Dashboard',
    description: 'Analyze GitHub profiles with advanced follower insights, repository analytics, and language statistics',
    type: 'website',
    siteName: 'GitHub Analytics Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Analytics Dashboard',
    description: 'Analyze GitHub profiles with advanced follower insights and repository analytics',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}