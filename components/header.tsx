"use client";

import { Moon, Sun, MessageSquare, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user: authUser } = useAuth();



  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="relative block">
            <Image
              src="/lytgitheader.png"
              alt="LytGit Logo"
              width={64}
              height={64}
              priority
              className="object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/community">
            <Button
              variant={pathname === '/community' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </Button>
          </Link>

          {authUser && (
            <Link href={`/?u=${authUser.login}`}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/50 hover:bg-primary/10 text-primary"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">My Profile</span>
              </Button>
            </Link>
          )}

          <AuthButton />


          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-muted"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

        </div>
      </div>
    </header>
  );
}