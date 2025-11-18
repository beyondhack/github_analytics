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
        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Alternative: Manual Token Setup</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Go to{' '}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center hover:text-orange-900 dark:hover:text-orange-200"
              >
                GitHub Token Settings
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </li>
            <li>Create a new token with <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">public_repo</code> and <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">read:user</code> scopes</li>
            <li>Create a <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">.env.local</code> file in your project root</li>
            <li>Add: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">NEXT_PUBLIC_GITHUB_TOKEN=your_token</code></li>
            <li>Restart the development server</li>
          </ol>
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

