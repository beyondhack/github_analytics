"use client";

import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function GitHubTokenBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertTitle className="text-orange-800 dark:text-orange-300">
        Running without GitHub Token
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-400">
        <p className="mb-2">
          You're currently using the GitHub API without authentication, which limits you to{' '}
          <strong>60 requests per hour</strong>. To increase your limit to{' '}
          <strong>5,000 requests per hour</strong> and unlock full pagination support:
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-3 text-sm">
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

