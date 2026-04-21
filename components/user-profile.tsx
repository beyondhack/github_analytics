"use client";

import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, Users, BookOpen, Star, FileText, GitFork } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GitHubUser } from '@/types/github';
import { formatDate } from '@/lib/utils';

interface UserProfileProps {
  user: GitHubUser;
  totalStars?: number;
  totalForks?: number;
}

export function UserProfile({ user, totalStars = 0, totalForks = 0 }: UserProfileProps) {
  const getAccountAgeAndAnniversary = () => {
    const createdDate = new Date(user.created_at);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);

    let ageStr = `${years} year${years !== 1 ? 's' : ''}`;
    if (years === 0) {
      ageStr = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }

    const nextAnniversary = new Date(now.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(now.getFullYear() + 1);
    }
    
    const daysToAnniversary = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let anniversaryStr = '';
    if (daysToAnniversary === 0) {
      anniversaryStr = "🎉 Anniversary Today!";
    } else {
      anniversaryStr = `Anniversary in ${daysToAnniversary} day${daysToAnniversary !== 1 ? 's' : ''}`;
    }

    return { ageStr, anniversaryStr };
  };

  const { ageStr, anniversaryStr } = getAccountAgeAndAnniversary();

  const stats = [
    { label: 'Repositories', value: user.public_repos, icon: BookOpen },
    { label: 'Total Stars', value: totalStars, icon: Star },
    { label: 'Total Forks', value: totalForks, icon: GitFork },
    { label: 'Followers', value: user.followers, icon: Users },
    { label: 'Following', value: user.following, icon: Users },
    { label: 'Gists', value: user.public_gists, icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-400 dark:from-neutral-200 dark:via-neutral-400 dark:to-neutral-600" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <Avatar className="w-24 h-24 border-4 border-background -mt-12 mb-4 md:mb-0">
              <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
              <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
                <p className="text-muted-foreground">@{user.login}</p>
                {user.bio && (
                  <p className="mt-2 text-sm leading-relaxed">{user.bio}</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a 
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {user.blog}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Joined {formatDate(user.created_at)}</span>
                  <span className="text-muted-foreground mx-1">•</span>
                  <span className="text-primary font-medium">{ageStr}</span>
                  <span className="text-muted-foreground mx-1">•</span>
                  <span className="text-muted-foreground">{anniversaryStr}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center p-3 rounded-lg bg-muted/50"
                  >
                    <stat.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {user.company && (
                <Badge variant="secondary" className="w-fit">
                  {user.company}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}