const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  belongs_to_collection: null | object;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBCast[];
  crew: { id: number; name: string; job: string }[];
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

export interface Genre {
  id: number;
  name: string;
}

export const GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export function getImageUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Poster';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'
): string {
  if (!path) return 'https://via.placeholder.com/1920x1080/1a1a1a/666666?text=No+Backdrop';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function formatRating(rating: number): string {
  return `${(rating * 10).toFixed(0)}%`;
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getGenreNames(genreIds: number[]): string[] {
  return genreIds
    .map((id) => GENRES.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[];
}

export function getYear(dateString: string): string {
  if (!dateString) return 'N/A';
  return dateString.split('-')[0];
}

// Server-side fetch function (for server components)
async function fetchTMDB(endpoint: string): Promise<any> {
  const apiKey = process.env.TMDB_API_KEY;
  
  if (!apiKey) {
    throw new Error('TMDB API key not configured');
  }
  
  const url = `${TMDB_BASE_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US`;
  
  const res = await fetch(url, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) {
    throw new Error(`TMDB Error: ${res.status}`);
  }
  
  return res.json();
}

export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB('trending/movie/week');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
}

export async function getPopularMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB('movie/popular?page=1');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching popular:', error);
    return [];
  }
}

export async function getTopRatedMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB('movie/top_rated?page=1');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching top rated:', error);
    return [];
  }
}

export async function getUpcomingMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB('movie/upcoming?page=1');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching upcoming:', error);
    return [];
  }
}

export async function getMovieDetail(id: string): Promise<TMDBMovieDetail | null> {
  try {
    const data = await fetchTMDB(`movie/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    return null;
  }
}

export async function getMovieCredits(id: string): Promise<TMDBCredits | null> {
  try {
    const data = await fetchTMDB(`movie/${id}/credits`);
    return data;
  } catch (error) {
    console.error('Error fetching credits:', error);
    return null;
  }
}

export async function getSimilarMovies(id: string): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB(`movie/${id}/similar?page=1`);
    return data.results?.slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching similar:', error);
    return [];
  }
}

export async function getMovieVideos(id: string): Promise<TMDBVideosResponse | null> {
  try {
    const data = await fetchTMDB(`movie/${id}/videos`);
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return null;
  }
}

export function getYouTubeTrailer(videos: TMDBVideo[]): string | null {
  const officialTrailer = videos.find(
    (v) => v.site === "YouTube" && 
           (v.type === "Trailer" || v.type === "Teaser") && 
           v.official
  );
  
  if (officialTrailer) return officialTrailer.key;
  
  const anyTrailer = videos.find(
    (v) => v.site === "YouTube" && 
           (v.type === "Trailer" || v.type === "Teaser")
  );
  
  if (anyTrailer) return anyTrailer.key;
  
  const anyYouTube = videos.find((v) => v.site === "YouTube");
  
  return anyYouTube?.key || null;
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
  try {
    const data = await fetchTMDB(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    return data.results || [];
  } catch (error) {
    console.error('Error fetching by genre:', error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return [];
  try {
    const data = await fetchTMDB(`search/movie?query=${encodeURIComponent(query)}&page=1`);
    return data.results || [];
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
}

export const categories = [
  { id: "trending", name: "Trending Now", fetchFn: getTrendingMovies },
  { id: "popular", name: "Popular on StreamFlix", fetchFn: getPopularMovies },
  { id: "toprated", name: "Top Rated", fetchFn: getTopRatedMovies },
  { id: "upcoming", name: "Upcoming", fetchFn: getUpcomingMovies },
  { id: "28", name: "Action", fetchFn: () => getMoviesByGenre(28) },
  { id: "12", name: "Adventure", fetchFn: () => getMoviesByGenre(12) },
  { id: "35", name: "Comedy", fetchFn: () => getMoviesByGenre(35) },
  { id: "27", name: "Horror", fetchFn: () => getMoviesByGenre(27) },
  { id: "878", name: "Science Fiction", fetchFn: () => getMoviesByGenre(878) },
  { id: "10749", name: "Romance", fetchFn: () => getMoviesByGenre(10749) },
  { id: "18", name: "Drama", fetchFn: () => getMoviesByGenre(18) },
];
