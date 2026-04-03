"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  getYouTubeTrailer,
  getImageUrl,
  formatRuntime,
  TMDBMovieDetail,
  TMDBVideosResponse,
  TMDBVideo,
} from "@/lib/data";
import { ChevronLeft, Play, Info, Clock, Star, Heart, Check, Loader2 } from "lucide-react";

const TMDB_API_KEY = 'a311131e9e1c359035bf62bf244da087';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function fetchTMDB(endpoint: string): Promise<any> {
  const res = await fetch(`${TMDB_BASE}/${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

function getYouTubeKey(videos: any[]): string | null {
  const officialTrailer = videos?.find(
    (v: any) => v.site === "YouTube" && 
           (v.type === "Trailer" || v.type === "Teaser") && 
           v.official
  );
  
  if (officialTrailer) return officialTrailer.key;
  
  const anyTrailer = videos?.find(
    (v: any) => v.site === "YouTube" && 
           (v.type === "Trailer" || v.type === "Teaser")
  );
  
  if (anyTrailer) return anyTrailer.key;
  
  const anyYouTube = videos?.find((v: any) => v.site === "YouTube");
  
  return anyYouTube?.key || null;
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<TMDBMovieDetail | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        const [movieData, videosData] = await Promise.all([
          fetchTMDB(`movie/${id}`),
          fetchTMDB(`movie/${id}/videos`),
        ]);

        if (!movieData || movieData.status_code) {
          setError(true);
          return;
        }

        setMovie(movieData);
        
        const trailer = getYouTubeKey(videosData?.results || []);
        setTrailerKey(trailer);

        const savedList = localStorage.getItem("streamflix-list");
        if (savedList) {
          const list = JSON.parse(savedList);
          setInList(list.includes(id));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const toggleList = () => {
    const savedList = localStorage.getItem("streamflix-list");
    let list: string[] = savedList ? JSON.parse(savedList) : [];

    if (inList) {
      list = list.filter((movieId) => movieId !== id);
    } else {
      list.push(id);
    }

    localStorage.setItem("streamflix-list", JSON.stringify(list));
    setInList(!inList);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white text-xl mb-4">Movie not found</p>
        <Link
          href="/"
          className="text-accent hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="relative">
        <div
          className="h-[50vh] md:h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-4 z-10">
          <Link
            href={`/movie/${id}`}
            className="flex items-center gap-2 text-white hover:text-accent transition-colors bg-black/50 backdrop-blur px-3 py-2 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleList}
            className={`p-3 rounded-full transition-colors ${
              inList
                ? "bg-accent text-black"
                : "bg-black/50 text-white hover:bg-accent hover:text-black backdrop-blur"
            }`}
          >
            {inList ? <Check className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4" fill="currentColor" />
            <span className="font-semibold">{(movie.vote_average * 10).toFixed(0)}%</span>
            <span className="text-gray-400">Match</span>
          </div>
          <span className="text-gray-300">{movie.release_date?.split("-")[0]}</span>
          {movie.runtime && (
            <span className="flex items-center gap-1 text-gray-300">
              <Clock className="w-4 h-4" />
              {formatRuntime(movie.runtime)}
            </span>
          )}
          <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-300">
            HD
          </span>
        </div>

        {trailerKey ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl shadow-black/50">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gray-800 rounded-lg flex flex-col items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-white text-xl font-semibold mb-2">No Trailer Available</p>
              <p className="text-gray-400">
                This demo uses YouTube trailers from TMDB.
                <br />
                Try another movie!
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-gray-300 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">About this movie</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Release Date</span>
                <span className="text-white">{movie.release_date || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Runtime</span>
                <span className="text-white">
                  {movie.runtime ? formatRuntime(movie.runtime) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-white">{movie.status || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rating</span>
                <span className="text-white">
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count?.toLocaleString() || 0} votes)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <p className="text-gray-400 text-sm text-center">
            <Info className="w-4 h-4 inline mr-2" />
            This is a demo website. Video playback shows the official movie trailer from YouTube.
          </p>
        </div>
      </div>
    </main>
  );
}
