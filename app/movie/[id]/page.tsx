"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { MovieRow } from "@/components/MovieRow";
import {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBCredits,
  getImageUrl,
  getBackdropUrl,
  formatRating,
  formatRuntime,
  getYear,
  getGenreNames,
  GENRES,
} from "@/lib/data";
import { Play, Heart, ChevronLeft, Clock, Calendar, Star, Users, Film, Check, Loader2 } from "lucide-react";

const TMDB_API_KEY = 'a311131e9e1c359035bf62bf244da087';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function fetchTMDB(endpoint: string): Promise<any> {
  const res = await fetch(`${TMDB_BASE}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<TMDBMovieDetail | null>(null);
  const [credits, setCredits] = useState<TMDBCredits | null>(null);
  const [similarMovies, setSimilarMovies] = useState<TMDBMovie[]>([]);
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;

      setLoading(true);
      setError(false);

      try {
        const [movieData, creditsData, similarData] = await Promise.all([
          fetchTMDB(`movie/${params.id}`),
          fetchTMDB(`movie/${params.id}/credits`),
          fetchTMDB(`movie/${params.id}/similar?page=1`),
        ]);

        if (!movieData || movieData.status_code) {
          setError(true);
          return;
        }

        setMovie(movieData);
        setCredits(creditsData);
        setSimilarMovies(similarData.results?.slice(0, 10) || []);

        const savedList = localStorage.getItem("streamflix-list");
        if (savedList) {
          const list = JSON.parse(savedList);
          setInList(list.includes(params.id));
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  const toggleList = () => {
    if (!params.id) return;

    const savedList = localStorage.getItem("streamflix-list");
    let list: string[] = savedList ? JSON.parse(savedList) : [];

    if (inList) {
      list = list.filter((id) => id !== params.id);
    } else {
      list.push(params.id as string);
    }

    localStorage.setItem("streamflix-list", JSON.stringify(list));
    setInList(!inList);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-text-secondary text-xl mb-4">Movie not found</p>
          <Link
            href="/"
            className="text-accent hover:underline flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const director = credits?.crew.find((c) => c.job === "Director")?.name || "Unknown";
  const topCast = credits?.cast.slice(0, 6) || [];
  const genres = movie.genres?.map((g) => g.name) || getGenreNames(movie.genre_ids || []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="relative">
        <div
          className="h-[50vh] md:h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        <div className="absolute top-20 md:top-28 left-4 md:left-8 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4" fill="currentColor" />
                <span className="font-semibold">{formatRating(movie.vote_average)}</span>
                <span className="text-text-secondary">Match</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span>{getYear(movie.release_date)}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              <span className="border border-text-secondary px-2 py-0.5 text-xs">
                HD
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href={`/watch/${movie.id}`}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/90 transition-colors"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Play
              </Link>
              <button
                onClick={toggleList}
                className={`p-3 rounded-full transition-colors ${
                  inList
                    ? "bg-accent text-black"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {inList ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Heart className="w-6 h-6" />
                )}
              </button>
            </div>

            {movie.tagline && (
              <p className="text-text-muted italic mb-4">{movie.tagline}</p>
            )}

            <p className="text-text-secondary leading-relaxed mb-6">
              {movie.overview || "No overview available."}
            </p>

            <div className="mb-6">
              <h3 className="text-sm text-text-muted mb-2">Director</h3>
              <p className="text-white">{director}</p>
            </div>

            {topCast.length > 0 && (
              <div>
                <h3 className="text-sm text-text-muted mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topCast.map((cast) => (
                    <span key={cast.id} className="text-white text-sm">
                      {cast.name}
                      {cast.character && (
                        <span className="text-text-muted"> as {cast.character}</span>
                      )}
                      {topCast.indexOf(cast) < topCast.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-6">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-text-secondary"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-card rounded-lg border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Film className="w-5 h-5 text-accent" />
            <span className="font-medium">Streaming Info</span>
          </div>
          <p className="text-sm text-text-secondary">
            This is a demo website using TMDB data. In production, this would connect to a video streaming service.
          </p>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <div className="mt-12 pb-12">
          <MovieRow
            title={`More like ${movie.title}`}
            movies={similarMovies}
          />
        </div>
      )}
    </main>
  );
}
