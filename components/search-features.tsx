"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Code, GitCommit, AlertCircle, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function SearchFeatures() {
  const [searchType, setSearchType] = useState('users');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchTypes = [
    { value: 'users', label: 'Users', icon: User },
    { value: 'repositories', label: 'Repositories', icon: Code },
    { value: 'commits', label: 'Commits', icon: GitCommit },
    { value: 'issues', label: 'Issues', icon: AlertCircle },
    { value: 'topics', label: 'Topics', icon: Hash },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/search/${searchType}?q=${encodeURIComponent(query)}&per_page=20`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.items || []);
      toast.success(`Found ${data.total_count} results`);
    } catch (error) {
      toast.error('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (item: any, index: number) => {
    switch (searchType) {
      case 'users':
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar>
              <AvatarImage src={item.avatar_url} alt={item.login || 'User'} />
              <AvatarFallback>{(item.login || '').slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold">{item.login || 'Unknown User'}</h4>
              {item.bio && <p className="text-sm text-muted-foreground">{item.bio}</p>}
            </div>
            <Badge variant="secondary">{item.type}</Badge>
          </motion.div>
        );
      
      case 'repositories':
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-primary">{item.full_name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">⭐ {item.stargazers_count}</span>
                <span className="text-sm text-muted-foreground">🍴 {item.forks_count}</span>
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            )}
            <div className="flex items-center space-x-2">
              {item.language && <Badge variant="outline">{item.language}</Badge>}
              <span className="text-xs text-muted-foreground">
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(item, null, 2)}
            </pre>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>GitHub Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent>
                  {searchTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder={`Search ${searchTypes.find(t => t.value === searchType)?.label.toLowerCase()}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((item, index) => renderResult(item, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !loading && query && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No results found. Try a different search term.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}