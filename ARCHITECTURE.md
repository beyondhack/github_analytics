# Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Data Flow](#data-flow)
- [Component Hierarchy](#component-hierarchy)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)
- [Type System](#type-system)

## Overview

GitHub Analytics Dashboard is a Next.js 13 application built with the App Router architecture. It provides a comprehensive analytics interface for GitHub profiles with a focus on follower insights and repository analytics.

### Core Technologies

- **Next.js 13.5.1**: React framework with App Router
- **TypeScript 5.2.2**: Type safety and developer experience
- **Tailwind CSS 3.3.3**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Framer Motion 11.0.0**: Animations and transitions
- **Recharts 2.12.7**: Data visualization

## Project Structure

```
github-analytics/
│
├── app/                          # Next.js 13 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page with search
│   └── globals.css              # Global styles and Tailwind
│
├── components/                   # React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── dashboard.tsx            # Main dashboard orchestrator
│   ├── user-search.tsx          # Username search interface
│   ├── user-profile.tsx         # User profile display
│   ├── follower-insights.tsx   # Follower analytics
│   ├── repository-analytics.tsx # Repository analytics
│   ├── language-stats.tsx       # Language statistics
│   ├── search-features.tsx      # GitHub search interface
│   ├── rate-limit-status.tsx    # API rate limit display
│   ├── github-token-banner.tsx  # Token setup banner
│   ├── hero-section.tsx         # Landing page hero
│   ├── header.tsx               # App header with theme toggle
│   └── theme-provider.tsx       # Dark mode provider
│
├── lib/                         # Utilities and services
│   ├── github-api.ts           # GitHub API client
│   └── utils.ts                # Helper functions
│
├── types/                       # TypeScript definitions
│   └── github.ts               # GitHub API types
│
├── hooks/                       # Custom React hooks
│   └── use-toast.ts            # Toast notifications
│
└── public/                      # Static assets
    ├── GitHub-Symbol.png
    └── black_circle_360x360.png
```

## Data Flow

### 1. User Search Flow

```
User Input (page.tsx)
    ↓
UserSearch Component
    ↓
fetchGitHubUser() [github-api.ts]
    ↓
GitHub API
    ↓
GitHubUser Object
    ↓
Dashboard Component
```

### 2. Dashboard Data Flow

```
Dashboard Mount
    ↓
Parallel API Calls:
  ├─→ fetchUserRepositories()
  ├─→ fetchUserFollowers()
  ├─→ fetchUserFollowing()
  └─→ fetchRateLimit()
    ↓
Pagination Logic (if needed)
    ↓
State Updates
    ↓
Child Component Rendering:
  ├─→ UserProfile
  ├─→ FollowerInsights
  ├─→ RepositoryAnalytics
  └─→ LanguageStats
```

### 3. Pagination Flow

```
Initial API Call (page 1)
    ↓
Check Response Length
    ↓
If length === 100:
  ├─→ Fetch Next Page
  ├─→ Accumulate Results
  └─→ Repeat Until length < 100
    ↓
Return All Results
```

## Component Hierarchy

```
App Layout (layout.tsx)
└── ThemeProvider
    └── Page (page.tsx)
        ├── Header
        │   ├── Logo
        │   ├── Theme Toggle
        │   └── Bolt Link
        │
        └── Main Content
            ├── Hero Section (if no user)
            ├── User Search (if no user)
            │
            └── Dashboard (if user selected)
                ├── GitHub Token Banner
                ├── Controls
                │   ├── Back Button
                │   ├── Rate Limit Status
                │   └── Refresh Button
                │
                ├── User Profile Card
                │
                └── Tabs
                    ├── Repositories Tab
                    │   └── Repository Analytics
                    │       ├── Top Repos Cards
                    │       └── All Repos List
                    │
                    ├── Followers Tab
                    │   └── Follower Insights
                    │       ├── Stats Cards
                    │       └── User Lists
                    │           ├── Don't Follow Back
                    │           ├── Don't Follow You
                    │           └── Mutual Follows
                    │
                    ├── Languages Tab
                    │   └── Language Stats
                    │       ├── Overview Cards
                    │       ├── Pie Chart
                    │       ├── Bar Chart
                    │       └── Details List
                    │
                    └── Search Tab
                        └── Search Features
                            ├── Search Form
                            └── Results Display
```

## API Integration

### GitHub API Client (`lib/github-api.ts`)

#### Architecture Patterns

1. **Centralized API Configuration**
   ```typescript
   const GITHUB_API_BASE = 'https://api.github.com';
   ```

2. **Optional Authentication**
   ```typescript
   const getGitHubToken = (): string | undefined => {
     return process.env.NEXT_PUBLIC_GITHUB_TOKEN;
   };
   ```

3. **Base Fetch Function**
   - Handles authentication headers
   - Error handling with custom error class
   - Rate limit detection

4. **Pagination Helper**
   ```typescript
   async function fetchPaginatedData<T>(
     endpoint: string,
     perPage: number = 100
   ): Promise<T[]>
   ```
   - Automatically fetches all pages
   - Accumulates results
   - Stops when partial page received

#### API Functions

| Function | Purpose | Pagination |
|----------|---------|------------|
| `fetchGitHubUser()` | Get user profile | No |
| `fetchUserRepositories()` | Get all repos | Yes |
| `fetchUserFollowers()` | Get all followers | Yes |
| `fetchUserFollowing()` | Get all following | Yes |
| `fetchUserStarred()` | Get starred repos | Yes |
| `fetchUserGists()` | Get gists | Yes |
| `fetchRateLimit()` | Get rate limit status | No |
| `searchGitHub()` | Search GitHub | No |

### Error Handling

```typescript
class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}
```

Errors are caught at component level and displayed via toast notifications.

## State Management

### Approach: Local Component State

This application uses React's built-in state management with `useState` and `useEffect`. No global state management library is needed due to:

1. **Flat Data Flow**: Data flows down from Dashboard to child components
2. **No Shared State**: Each view has isolated state
3. **Simple Updates**: Refresh button refetches all data

### State Structure

#### Page Component (`page.tsx`)
```typescript
const [user, setUser] = useState<GitHubUser | null>(null);
const [loading, setLoading] = useState(false);
```

#### Dashboard Component (`dashboard.tsx`)
```typescript
const [repositories, setRepositories] = useState<Repository[]>([]);
const [followers, setFollowers] = useState<GitHubFollower[]>([]);
const [following, setFollowing] = useState<GitHubFollower[]>([]);
const [rateLimit, setRateLimit] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [showTokenBanner, setShowTokenBanner] = useState(false);
```

#### Child Components
- Receive data as props
- Manage local UI state (search, filters, sort)
- No data mutations

### Data Fetching Strategy

1. **Initial Load**: Parallel fetch on dashboard mount
2. **Refresh**: Manual refresh refetches all data
3. **No Caching**: Fresh data on every fetch
4. **Optimistic UI**: Loading states during fetches

## Styling Architecture

### Tailwind CSS Configuration

```javascript
// tailwind.config.ts
{
  darkMode: ["class"], // Class-based dark mode
  plugins: [require("tailwindcss-animate")]
}
```

### Design System

#### Colors
- **Primary**: Neutral tones (800-400 light, 200-400 dark)
- **Semantic Colors**: 
  - Success: Green
  - Warning: Orange/Yellow
  - Error: Red
  - Info: Blue

#### Component Patterns

1. **Cards**: `Card`, `CardHeader`, `CardContent`
2. **Layouts**: Flexbox and Grid
3. **Responsive**: Mobile-first breakpoints
4. **Animations**: Framer Motion for page transitions

### shadcn/ui Integration

Components are installed individually and customizable:
```bash
npx shadcn-ui@latest add button
```

Customization via:
- `components/ui/` - Component files
- `lib/utils.ts` - `cn()` utility for class merging

## Type System

### Core Types (`types/github.ts`)

```typescript
interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  // ... more fields
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  // ... more fields
}

interface GitHubFollower {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

interface RateLimit {
  core: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  search: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
}
```

### Type Safety Benefits

1. **API Responses**: Typed responses from GitHub API
2. **Component Props**: Strict prop types
3. **State**: Typed useState and useEffect
4. **Error Prevention**: Catch errors at compile time

## Performance Considerations

### Optimizations

1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next.js Image component
3. **Lazy Loading**: Components render on demand
4. **Memoization**: `useMemo` for expensive calculations
5. **Debouncing**: Search inputs debounced

### Pagination Benefits

- Fetches all data upfront (better UX for small-medium accounts)
- Avoids multiple page loads in UI
- Trades initial load time for better experience

### Areas for Improvement

1. **Virtual Scrolling**: For users with 1000+ followers
2. **Data Caching**: Cache API responses with SWR or React Query
3. **Progressive Loading**: Show data as it arrives
4. **Service Worker**: Offline support

## Security Considerations

### Token Security

1. **Environment Variables**: Token stored in `.env.local`
2. **Client-Side**: Token used only in browser
3. **No Server Exposure**: No server-side token usage
4. **Public Scopes Only**: Only read public data

### API Safety

1. **No Write Operations**: Read-only API usage
2. **Error Handling**: Graceful degradation
3. **Rate Limiting**: Monitored and displayed
4. **CORS**: GitHub API handles CORS

## Deployment Architecture

### Recommended: Vercel

1. **Build**: `next build` creates optimized production build
2. **Edge Network**: Deployed to Vercel's edge network
3. **Environment Variables**: Set via Vercel dashboard
4. **Automatic HTTPS**: SSL certificates included

### Environment Variables

```env
NEXT_PUBLIC_GITHUB_TOKEN=<optional>
```

The `NEXT_PUBLIC_` prefix exposes the variable to the browser.

## Future Architecture Considerations

### Potential Enhancements

1. **Backend API**: Add Next.js API routes for:
   - Token storage (encrypted)
   - Response caching
   - Analytics tracking

2. **Database**: Store user preferences and history

3. **Authentication**: GitHub OAuth for private repos

4. **Real-time**: WebSocket for live updates

5. **Testing**: Add Jest + React Testing Library

6. **CI/CD**: GitHub Actions for automated testing

---

Last Updated: 2024

