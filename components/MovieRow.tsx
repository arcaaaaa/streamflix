"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { TMDBMovie, getImageUrl, formatRating, getYear } from "@/lib/data";

export function MovieRow({
  title,
  movies,
}: {
  title: string;
  movies: TMDBMovie[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export function MovieCard({ movie }: { movie: TMDBMovie }) {
  return (
    <Link href={`/movie/${movie.id}`} className="flex-shrink-0 w-44 group">
      <div className="relative aspect-video rounded-md overflow-hidden bg-card transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-accent">
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-3 rounded-full bg-accent">
            <Play className="w-6 h-6 text-black" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-sm font-medium truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
            <span className="text-accent font-medium">
              {formatRating(movie.vote_average)}
            </span>
            <span>{getYear(movie.release_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MovieCardLarge({ movie }: { movie: TMDBMovie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="flex-shrink-0 w-64 md:w-72 group"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-accent">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-4 rounded-full bg-accent">
            <Play className="w-8 h-8 text-black" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-base font-semibold truncate">{movie.title}</h3>
          <p className="text-sm text-text-secondary mt-1">
            {getYear(movie.release_date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
