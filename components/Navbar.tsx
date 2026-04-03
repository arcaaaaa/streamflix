"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Play, Heart, Menu, X, Plus, Info } from "lucide-react";
import { TMDBMovie, getBackdropUrl, formatRating, getYear } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Play className="w-8 h-8 text-accent" fill="currentColor" />
              <span className="text-xl font-bold tracking-tight">
                Stream<span className="text-accent">Flix</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/my-list"
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                My List
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-card border border-white/20 rounded px-3 py-1 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-accent-bright flex items-center justify-center">
                <span className="text-sm font-semibold text-black">A</span>
              </div>
            </div>
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-sm text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/my-list"
                className="text-sm text-text-secondary hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My List
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export function HeroSection({ movie }: { movie: TMDBMovie }) {
  const [inList, setInList] = useState(false);

  return (
    <div className="relative h-[70vh] md:h-[85vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'original')})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 md:px-16">
        <div className="max-w-2xl">
          <p className="text-accent font-semibold mb-2">Featured Today</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <span className="text-accent font-semibold flex items-center gap-1">
              <span className="text-green-400">★</span>
              {formatRating(movie.vote_average)} Match
            </span>
            <span>{getYear(movie.release_date)}</span>
            <span className="border border-text-secondary px-1 text-xs py-0.5">
              HD
            </span>
          </div>
          <p className="text-text-secondary text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/movie/${movie.id}`}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/90 transition-colors"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Play
            </Link>
            <Link
              href={`/movie/${movie.id}`}
              className="flex items-center gap-2 bg-white/20 backdrop-blur text-white px-8 py-3 rounded font-semibold hover:bg-white/30 transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
