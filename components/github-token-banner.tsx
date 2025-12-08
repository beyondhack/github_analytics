"use client";

import { AlertCircle, ExternalLink, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function GitHubTokenBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { user, login } = useAuth();

  if (dismissed) return null;

  // Don't show banner if user is authenticated
  if (user) return null;

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertTitle className="text-orange-800 dark:text-orange-300">
        Running without GitHub Authentication
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-400">
        <p className="mb-2">
          You're currently using the GitHub API without authentication, which limits you to{' '}
          <strong>60 requests per hour</strong>. To increase your limit to{' '}
          <strong>5,000 requests per hour</strong> and unlock full pagination support:
        </p>
        <div className="mb-3 space-y-2">
          <p className="text-sm font-medium">Recommended: Login with GitHub (Easiest)</p>
          <Button
            onClick={login}
            size="sm"
            className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
          >
            <LogIn className="h-4 w-4" />
            Login with GitHub
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDismissed(true)}
          className="border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900"
        >
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  );
}

