# GitHub Analytics Dashboard

<div align="center">
  <img src="/public/GitHub-Symbol.png" alt="GitHub Analytics" width="100" />
  <p><strong>A powerful analytics dashboard for GitHub profiles with enhanced follower insights</strong></p>
</div>

## 🚀 Features

### Follower Analytics
- **Smart Follower Insights**: See who follows you back and who doesn't
- **Mutual Connections**: Discover your mutual followers
- **Follower Tracking**: Identify users you follow but don't follow you back
- **Unlimited Followers**: View ALL followers and following users (not limited to 100)

### Repository Analytics
- **Comprehensive Stats**: View all your repositories with detailed metrics
- **Smart Sorting**: Sort by stars, forks, creation date, or last update
- **Search & Filter**: Quickly find specific repositories
- **Language Insights**: Visualize your most-used programming languages

### Additional Features
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Real-time Data**: Fresh data from GitHub API with pagination support
- **Rate Limit Monitor**: Track your API usage in real-time
- **GitHub Search**: Search for users, repositories, commits, issues, and topics
- **No Login Required**: Analyze any public GitHub profile

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

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-analytics.git
   cd github-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub Token (Optional but Recommended)**
   
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your GitHub Personal Access Token:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 GitHub Token Setup (Optional)

Without a token, you're limited to **60 API requests per hour**. With a token, you get **5,000 requests per hour** and can fetch unlimited followers/following.

### How to Create a GitHub Token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "GitHub Analytics Dashboard")
4. Select the following scopes:
   - `public_repo` - Access public repositories
   - `read:user` - Read user profile data
5. Click "Generate token"
6. Copy the token immediately (you won't see it again!)
7. Paste it in your `.env.local` file:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
   ```
8. Restart your development server

**⚠️ Important**: 
- Never commit your `.env.local` file to git (it's already in `.gitignore`)
- Keep your token private and secure
- The token only needs read access to public data

## 📖 Usage

### Analyzing a GitHub Profile

1. **Enter a Username**: Type any GitHub username in the search box
2. **Click "Analyze Profile"**: Or use "I'm Feeling Lucky" for a random famous developer
3. **View Insights**: Explore tabs for repositories, followers, languages, and search

### Understanding Follower Insights

- **Don't Follow Back**: Users who follow you but you don't follow them
- **Don't Follow You**: Users you follow but they don't follow you back
- **Mutual Follows**: Users with bidirectional following relationships

### Searching GitHub

Use the Search tab to find:
- Users by username or name
- Repositories by name or description
- Commits, issues, and topics

## 🏗️ Project Structure

```
github-analytics/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard.tsx        # Main dashboard view
│   ├── follower-insights.tsx
│   ├── repository-analytics.tsx
│   ├── language-stats.tsx
│   └── ...                  # Other components
├── lib/                     # Utility libraries
│   ├── github-api.ts        # GitHub API integration
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
│   └── github.ts            # GitHub API types
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

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variable:
   - Key: `NEXT_PUBLIC_GITHUB_TOKEN`
   - Value: Your GitHub token
4. Deploy!

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to:
- Netlify
- Railway
- Render
- Any Node.js hosting service

## 🔒 Privacy & Security

- **No Data Storage**: This application doesn't store any user data
- **Client-Side Only**: All API calls are made from the browser
- **Read-Only Access**: Only reads public GitHub data
- **Token Security**: Your GitHub token is stored locally and never sent to any server except GitHub

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

- Built with [Bolt](https://bolt.new/) - AI-powered web development
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the need for better GitHub follower management

## 📧 Contact

Have questions or suggestions? Feel free to open an issue or reach out!

---

<div align="center">
  Made with ❤️ using Next.js and GitHub API
</div>
