# 📊 MyGitStats - GitHub Analytics Dashboard

> A beautiful, modern analytics dashboard for exploring GitHub profiles, repositories, and follower insights.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-domain.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)


## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [GitHub Authentication Setup](#-github-authentication-setup)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 GitHub OAuth Authentication

- **No Manual Token Setup**: Simplified authentication - no need to create personal access tokens
- **Session Management**: Persistent login sessions with secure httpOnly cookies
- **Automatic Rate Limit Boost**: Get 5,000 requests/hour when logged in (vs 60 without login)

### 👥 Follower Analytics
- **Smart Follower Insights**: Analyze your follower relationships with three key categories:
  - **Don't Follow Back**: Users who follow you but you don't follow them
  - **Don't Follow You**: Users you follow but they don't follow you back
  - **Mutual Follows**: Users with bidirectional following relationships
- **Unlimited Followers**: View ALL followers and following users (not limited to 100)
- **Load More Functionality**: Progressively load followers/following in batches of 100
- **Real-time Search**: Filter followers and following by username
- **Visual Statistics**: See follower counts with color-coded stat cards

### 📊 Repository Analytics
- **Comprehensive Repository List**: View all repositories with detailed metrics:
  - Star count, fork count, and watcher count
  - Primary programming language
  - Creation date and last update timestamp
  - Repository description
- **Advanced Sorting**: Sort repositories by:
  - Stars (most to least)
  - Forks (most to least)
  - Creation date (newest/oldest)
  - Last update (most/least recent)
- **Search & Filter**: Quickly find specific repositories by name
- **Direct Links**: Click to open any repository on GitHub
- **Repository Stats**: Total count and aggregate statistics

### 📈 Language Statistics
- **Visual Language Breakdown**: Interactive bar chart showing programming language distribution
- **Language Metrics**: See the number of repositories per language
- **Color-Coded Display**: Each language has a distinct color for easy identification
- **Percentage Calculation**: View what percentage of your repos use each language

### 🔍 GitHub Search
- **Multi-Type Search**: Search across five different GitHub entity types:
  - **Users**: Find GitHub users by username or name
  - **Repositories**: Search repos by name or description
  - **Commits**: Find commits across GitHub
  - **Issues**: Search for issues and pull requests
  - **Topics**: Discover repositories by topic tags
- **Rich Results**: Display detailed information for each result type
- **Pagination**: View up to 20 results per search
- **Result Count**: See total number of matches found

### 🎨 User Experience
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Dark Mode Support**: Automatic theme switching with next-themes
- **Real-time Data**: Fresh data from GitHub API with pagination support
- **Rate Limit Monitor**: Track your API usage in real-time with visual indicator
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders for smooth user experience
- **Toast Notifications**: User-friendly feedback for all actions
- **No Login Required**: Analyze any public GitHub profile (with limited rate limits)

## 🛠️ Tech Stack

- **Framework**: [Next.js 13](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- (Optional) GitHub Personal Access Token for higher rate limits

## 🚀 Quick Start

### Deploy to Vercel (Fastest Way)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/github-analytics)

1. Click the button above
2. Set up your environment variables (see below)
3. Deploy!

### Run Locally

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-analytics.git
   cd github-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub Authentication (Recommended)**
   
   See the [GitHub Authentication Setup](#-github-authentication-setup) section below for detailed instructions on setting up GitHub OAuth.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 GitHub Authentication Setup

Without authentication, you're limited to **60 API requests per hour**. With GitHub OAuth login, users get **5,000 requests per hour** and can fetch unlimited followers/following.

### GitHub OAuth Setup

This allows users to login with their GitHub account directly in the app. Each user gets their own rate limit and personalized experience.

#### Setup Steps:

1. **Create a GitHub OAuth App**
   - Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in the form:
     - **Application name**: GitHub Analytics Dashboard (or your preferred name)
     - **Homepage URL**: `http://localhost:3000` (for development) or your production URL
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (for development) or `https://your-domain.com/api/auth/callback/github` (for production)
   - Click "Register application"
   - Copy the **Client ID** and generate a **Client Secret**

2. **Configure Environment Variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # GitHub OAuth Configuration (Required)
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Restart your development server**
   ```bash
   npm run dev
   ```

**For Production:**
- Update the OAuth App's callback URL to your production domain
- Set `NEXT_PUBLIC_APP_URL` to your production URL
- Add the environment variables to your hosting platform (Vercel, etc.)

**⚠️ Important**: 
- Never commit your `.env.local` file to git (it's already in `.gitignore`)
- Keep your Client ID and Client Secret private and secure
- The OAuth app only needs access to public data (no special scopes required)
- Users will be prompted to authorize the app when they first login

## 📖 Usage

### Logging In (Recommended)

1. **Click "Login with GitHub"**: Click the login button in the top-right corner or in the banner
2. **Authorize the App**: You'll be redirected to GitHub to authorize the application
3. **Automatic Redirect**: After authorization, you'll be redirected back to the dashboard
4. **Enjoy Higher Limits**: You now have 5,000 requests/hour instead of 60

### Analyzing a GitHub Profile

1. **Enter a Username**: Type any GitHub username in the search box on the home page
2. **Click "Analyze Profile"**: Or use "I'm Feeling Lucky" for a random famous developer
3. **View Dashboard**: Explore the comprehensive analytics dashboard with multiple tabs

### Using Follower Insights

The Followers tab shows three key categories:

- **Don't Follow Back**: Users who follow you but you don't follow them
  - Great for finding potential connections to follow back
- **Don't Follow You**: Users you follow but they don't follow you back
  - Helpful for managing your following list
- **Mutual Follows**: Users with bidirectional following relationships
  - Your true connections on GitHub

**Load More Feature**: 
- If a user has more than 500 followers/following, use the "Load More" buttons
- Each click loads an additional 100 users
- Search functionality works across all loaded users

### Exploring Repository Analytics

The Repositories tab provides comprehensive repository information:

1. **View All Repos**: See all repositories with stars, forks, and watchers
2. **Sort Repositories**: Use the dropdown to sort by:
   - Stars (highest to lowest)
   - Forks (most to least)
   - Created (newest first or oldest first)
   - Updated (most recently updated)
3. **Search Repos**: Use the search box to filter by repository name
4. **Click to Visit**: Click any repository card to open it on GitHub

### Viewing Language Statistics

The Languages tab shows:
- **Bar Chart**: Visual representation of language distribution
- **Repository Count**: Number of repos using each language
- **Percentage**: What portion of repos use each language
- **Color Coding**: Each language has a distinct color

### Searching GitHub

The Search tab allows you to search across GitHub:

1. **Select Search Type**: Choose from Users, Repositories, Commits, Issues, or Topics
2. **Enter Query**: Type your search term
3. **Click Search**: View up to 20 results with detailed information
4. **Browse Results**: Each result type shows relevant information:
   - **Users**: Avatar, username, and bio
   - **Repositories**: Name, description, stars, forks, and language
   - **Commits/Issues/Topics**: Relevant metadata for each type

## 🏗️ Project Structure

```
github-analytics/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── auth/            # Authentication routes
│   │       ├── github/      # OAuth initiation
│   │       ├── callback/    # OAuth callback handler
│   │       ├── logout/      # Logout endpoint
│   │       ├── session/     # Session management
│   │       └── token/       # Token retrieval
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth-button.tsx      # Login/logout button
│   ├── dashboard.tsx        # Main dashboard view
│   ├── follower-insights.tsx
│   ├── repository-analytics.tsx
│   ├── language-stats.tsx
│   └── ...                  # Other components
├── contexts/                # React contexts
│   └── auth-context.tsx     # Authentication context
├── providers/               # React providers
│   └── auth-provider.tsx    # Authentication provider
├── lib/                     # Utility libraries
│   ├── github-api.ts        # GitHub API integration
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
│   ├── github.ts            # GitHub API types
│   └── auth.ts              # Authentication types
└── public/                  # Static assets
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server at localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import your repository on [Vercel](https://vercel.com)**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Update GitHub OAuth App**
   - Go to your [GitHub OAuth App settings](https://github.com/settings/developers)
   - Update **Homepage URL**: `https://your-app.vercel.app`
   - Update **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

5. **Deploy!**
   - Click "Deploy"
   - Your app will be live in minutes

### Production Checklist

Before going live, make sure you've completed:

- [ ] Set up GitHub OAuth App with production URLs
- [ ] Added all environment variables to Vercel
- [ ] Updated callback URLs in GitHub OAuth settings
- [ ] Tested OAuth login flow in production
- [ ] Verified API rate limits are working correctly
- [ ] Updated README with your actual repository URL
- [ ] Added custom domain (optional)
- [ ] Tested on mobile devices
- [ ] Checked all links work correctly

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to:
- **Netlify**: Similar process to Vercel
- **Railway**: Supports Next.js out of the box
- **Render**: Great for full-stack apps
- **Any Node.js hosting**: Requires Node.js 16+

**Important**: Make sure to set the same environment variables on any platform you choose.

## 🔒 Privacy & Security

- **No Data Storage**: This application doesn't store any user data permanently in a database
- **Secure Token Storage**: OAuth access tokens are stored in httpOnly cookies (server-side only, not accessible to JavaScript)
- **Session-Based Authentication**: User sessions are managed securely with automatic expiration
- **Read-Only Access**: The app only reads public GitHub data - no write permissions
- **Token Security**: OAuth tokens are never exposed to client-side JavaScript
- **CSRF Protection**: OAuth flow includes state parameter for CSRF protection
- **No Third-Party Tracking**: No analytics or tracking scripts
- **Automatic Logout**: Users can logout anytime to clear their session and tokens
- **Secure API Routes**: All authentication endpoints use secure HTTP-only cookies

## 📊 API Rate Limits

| Without Token | With Token |
|--------------|------------|
| 60 requests/hour | 5,000 requests/hour |
| Limited to 100 followers | Unlimited followers |
| Limited to 100 following | Unlimited following |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/) and the [GitHub API](https://docs.github.com/en/rest)

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/github-analytics/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/github-analytics/discussions)
- **Email**: your-email@example.com (optional)

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the codebase

---

<div align="center">
  
**Made with ❤️ using Next.js and the GitHub API**

[Live Demo](https://your-domain.vercel.app) • [Report Bug](https://github.com/YOUR_USERNAME/github-analytics/issues) • [Request Feature](https://github.com/YOUR_USERNAME/github-analytics/issues)

</div>
