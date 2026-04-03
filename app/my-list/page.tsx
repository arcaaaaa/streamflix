"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MovieCardLarge } from "@/components/MovieRow";
import { TMDBMovie } from "@/lib/data";
import { Heart, Trash2, Loader2, Plus } from "lucide-react";

const TMDB_API_KEY = 'a311131e9e1c359035bf62bf244da087';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function fetchTMDB(endpoint: string): Promise<any> {
  const res = await fetch(`${TMDB_BASE}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export default function MyListPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedList = localStorage.getItem("streamflix-list");
    const list = savedList ? JSON.parse(savedList) : [];
    setSavedIds(list);

    async function fetchSavedMovies() {
      if (list.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const moviePromises = list.map((id: string) => fetchTMDB(`movie/${id}`));
        const movieResults = await Promise.all(moviePromises);
        const validMovies = movieResults.filter((m: any) => m && !m.status_code) as TMDBMovie[];
        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedMovies();
  }, []);

  const removeFromList = (id: string) => {
    const newList = savedIds.filter((movieId) => movieId !== id);
    localStorage.setItem("streamflix-list", JSON.stringify(newList));
    setSavedIds(newList);
    setMovies((prev) => prev.filter((m) => m.id.toString() !== id));
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-accent" fill="currentColor" />
            <h1 className="text-3xl font-bold">My List</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : movies.length > 0 ? (
            <>
              <p className="text-text-secondary mb-6">
                {movies.length} {movies.length === 1 ? "movie" : "movies"} in your list
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <MovieCardLarge movie={movie} />
                    <button
                      onClick={() => removeFromList(movie.id.toString())}
                      className="absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary text-lg mb-6">
                Your list is empty. Add movies to watch later!
              </p>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded font-semibold hover:bg-accent-hover transition-colors"
              >
                <Plus className="w-5 h-5" />
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
