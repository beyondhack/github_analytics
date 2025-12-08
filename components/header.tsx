"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';
import Image from 'next/image';

export function Header() {
  const { theme, setTheme } = useTheme();

  const handleBoltClick = () => {
    window.open('https://bolt.new/', '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 relative">
            <Image
              src="/statspet.png"
              alt="GitHub Analytics Logo"
              width={32}
              height={32}
              className="rounded-lg dark:brightness-110 dark:contrast-110"
            />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
            GitHub Analytics
          </h1>
        </div>

        <div className="flex items-center space-x-4">
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

          <button
            onClick={handleBoltClick}
            className="w-10 h-10 relative cursor-pointer transition-transform hover:scale-110 float-animation group"
            aria-label="Visit Bolt.new"
          >
            <Image
              src="/black_circle_360x360.png"
              alt="Bolt Logo"
              width={40}
              height={40}
              className="rounded-full group-hover:spin-slow transition-all duration-300"
            />
          </button>
        </div>
      </div>
    </header>
  );
}