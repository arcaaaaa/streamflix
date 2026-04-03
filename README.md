# StreamFlix

A premium movie streaming platform with Netflix-inspired UI and Spotify's signature green aesthetic.

## Features

- 🎬 Browse movies from TMDB database
- 🔍 Search and filter by genre
- ⭐ Movie details with cast, rating, and similar recommendations
- ❤️ Personal "My List" (saved to localStorage)
- 📺 YouTube trailer playback
- 🌐 Data provided by The Movie Database (TMDB)
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd StreamFlix
vercel
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

## TMDB API

This project uses The Movie Database (TMDB) API for movie data.

- **API Key**: Already configured in the code
- **Rate Limit**: 40 requests/second
- **Documentation**: https://www.themoviedb.org/documentation/api

## Project Structure

```
StreamFlix/
├── public/
│   └── videos/           # Local video files (optional)
├── app/
│   ├── api/               # API routes
│   ├── browse/            # Browse/search movies
│   ├── movie/
│   │   └── [id]/         # Movie detail page
│   ├── watch/
│   │   └── [id]/         # Watch page with trailer
│   ├── my-list/           # Saved movies
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── Navbar.tsx         # Navigation + Hero
│   ├── MovieRow.tsx       # Movie cards and rows
│   └── VideoPlayer.tsx    # Video player
└── lib/
    └── data.ts            # TMDB API functions
```

## Features Overview

### Home Page
- Hero section with featured movie
- Movie rows by category (Trending, Popular, Top Rated, etc.)
- Genre-specific sections

### Browse Page
- Search movies by title
- Filter by genre
- Pagination with "Load More"

### Movie Detail
- Full movie information
- Cast and crew
- Similar movies
- Play button → Trailer page

### Watch Page
- YouTube trailer playback
- Movie info display
- Add to My List

### My List
- View saved movies
- Remove from list
- Persistent storage (localStorage)

## License

This project is for educational purposes. Movie data provided by TMDB.

---

Built with ❤️ using Next.js, Tailwind CSS, and TMDB API
