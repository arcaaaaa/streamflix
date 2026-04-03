# StreamFlix - Netflix UI with Spotify Green Theme

## Concept & Vision

StreamFlix adalah platform streaming film dengan desain premium yang menggabungkan UI minimalis Netflix dengan nuansa warna hijau khas Spotify. Pengalaman pengguna yang immersive dengan transisi smooth, dark mode default, dan aksen hijau yang memberikan kesan modern dan sleek.

## Design Language

### Aesthetic Direction
Dark cinema aesthetic dengan sentuhan Spotify - deep blacks, gradients yang smooth, dan aksen hijau yang vibrant sebagai highlight. UI terasa seperti bioskop digital premium.

### Color Palette
```
Primary Background: #0a0a0a (near black)
Secondary Background: #141414 (Netflix dark)
Card Background: #1a1a1a
Surface: #222222

Primary Accent: #1DB954 (Spotify Green)
Secondary Accent: #1ed760 (Bright Green)
Accent Hover: #169c46 (Darker Green)

Text Primary: #ffffff
Text Secondary: #b3b3b3
Text Muted: #666666

Gradient Start: #1DB954
Gradient End: #191414
```

### Typography
- **Primary Font**: Inter (sans-serif fallback)
- **Headings**: Bold, tracking tight
- **Body**: Regular weight, good line height

### Motion Philosophy
- Smooth hover transitions (200-300ms ease-out)
- Scale on hover for movie cards (1.05x)
- Fade-in animations for content loading
- Subtle slide-up for hero content

## Layout & Structure

### Pages
1. **Home** - Hero banner + rows of movies by category
2. **Browse** - Grid view all movies with filters
3. **Movie Detail** - Full info + similar movies
4. **My List** - User's saved movies

### Visual Pacing
- Hero section takes 70-80vh
- Movie rows with horizontal scroll
- Generous padding, breathing room
- Gradient overlays for depth

## Features & Interactions

### Core Features
- Browse movies by category (Trending, Action, Comedy, Horror, etc.)
- Featured/Hero movie with large backdrop
- Movie detail with synopsis, cast, similar movies
- Add to My List functionality
- Search movies

### Interactions
- Hover on movie card: scale up + show play icon overlay
- Click movie: navigate to detail page
- Add to list: heart icon toggle with animation
- Horizontal scroll on movie rows with scroll arrows

## Component Inventory

### Navbar
- Logo on left
- Navigation links center
- Search icon + user avatar right
- Transparent on hero, solid on scroll

### Hero Banner
- Full-width backdrop image
- Gradient overlay bottom
- Title, description, buttons (Play, Add to List)

### MovieRow
- Category title
- Horizontal scrollable row
- Left/Right scroll arrows

### MovieCard
- Poster image
- Hover: scale + overlay with play icon
- Green border on hover

### MovieDetail
- Large backdrop
- Poster, title, year, rating, duration
- Synopsis
- Cast horizontal scroll
- Similar movies row

## Technical Approach

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: React hooks (useState, useEffect)
- **Icons**: Lucide React

### API Routes
- `/api/movies` - Get all movies
- `/api/movies/[id]` - Get single movie
- `/api/categories` - Get categories

### Data Model
```typescript
interface Movie {
  id: string;
  title: string;
  year: number;
  rating: string;
  duration: string;
  synopsis: string;
  backdrop: string;
  poster: string;
  category: string[];
  cast: string[];
  director: string;
}
```

### Deployment
- Platform: Vercel
- Build: `npm run build`
- Output: Static + Serverless functions
