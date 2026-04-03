"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { MovieCardLarge } from "@/components/MovieRow";
import { TMDBMovie, GENRES } from "@/lib/data";
import { Search, Filter, Loader2 } from "lucide-react";

const TMDB_API_KEY = 'a311131e9e1c359035bf62bf244da087';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint: string): Promise<any> {
  const res = await fetch(`${TMDB_BASE}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(async (genreId: string, search: string, pageNum: number, append: boolean = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      let results: TMDBMovie[] = [];

      if (search.trim()) {
        const data = await fetchFromTMDB(`search/movie?query=${encodeURIComponent(search)}&page=${pageNum}`);
        results = data.results || [];
        setHasMore(false);
      } else if (genreId === "All") {
        const data = await fetchFromTMDB(`discover/movie?with_genres=28&sort_by=popularity.desc&page=${pageNum}`);
        results = data.results || [];
      } else {
        const data = await fetchFromTMDB(`discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${pageNum}`);
        results = data.results || [];
      }

      if (append && pageNum > 1) {
        setMovies((prev) => [...prev, ...results]);
      } else {
        setMovies(results);
      }

      setHasMore(results.length > 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchMovies(selectedGenre, searchQuery, 1, false);
  }, [selectedGenre, searchQuery, fetchMovies]);

  useEffect(() => {
    if (initialSearch && initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(selectedGenre, searchQuery, nextPage, true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            {searchQuery ? `Search: "${searchQuery}"` : "Browse Movies"}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none bg-card border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="All">All Genres</option>
                {GENRES.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-text-secondary mb-4">
                {movies.length} movies found
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <MovieCardLarge key={movie.id} movie={movie} />
                ))}
              </div>

              {movies.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-text-secondary text-lg">
                    No movies found. Try a different search or genre.
                  </p>
                </div>
              )}

              {hasMore && movies.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-card border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingMore && <Loader2 className="w-5 h-5 animate-spin" />}
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
