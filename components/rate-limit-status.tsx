"use client";

import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RateLimitStatusProps {
  rateLimit: any;
}

export function RateLimitStatus({ rateLimit }: RateLimitStatusProps) {
  if (!rateLimit || !rateLimit.core) return null;

  const { remaining, limit, reset } = rateLimit.core;
  const percentage = (remaining / limit) * 100;
  const resetTime = new Date(reset * 1000);
  
  const getStatusColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIcon = () => {
    if (percentage > 50) return CheckCircle;
    if (percentage > 20) return Clock;
    return AlertTriangle;
  };

  const Icon = getIcon();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="flex items-center space-x-2">
            <Icon className="w-3 h-3" />
            <span>{remaining}/{limit}</span>
            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getStatusColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>API Rate Limit: {remaining}/{limit}</p>
            <p>Resets at: {resetTime.toLocaleTimeString()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}