import Navbar, { HeroSection } from "@/components/Navbar";
import { MovieRow } from "@/components/MovieRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  TMDBMovie,
} from "@/lib/data";
import { Play } from "lucide-react";

async function getHomeData() {
  try {
    const [trending, popular, topRated, upcoming, action, comedy, horror] = await Promise.all([
      getTrendingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
      getMoviesByGenre(28),
      getMoviesByGenre(35),
      getMoviesByGenre(27),
    ]);

    return {
      featured: trending[0] || null,
      trending,
      popular,
      topRated,
      upcoming,
      action,
      comedy,
      horror,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      featured: null,
      trending: [],
      popular: [],
      topRated: [],
      upcoming: [],
      action: [],
      comedy: [],
      horror: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      {data.featured && <HeroSection movie={data.featured} />}

      <div className="relative z-10 -mt-10 pb-12">
        <MovieRow title="Trending Now" movies={data.trending} />
        <MovieRow title="Popular on StreamFlix" movies={data.popular} />
        <MovieRow title="Top Rated" movies={data.topRated} />
        <MovieRow title="Upcoming" movies={data.upcoming} />
        <MovieRow title="Action & Adventure" movies={data.action} />
        <MovieRow title="Comedy" movies={data.comedy} />
        <MovieRow title="Horror" movies={data.horror} />
      </div>

      <footer className="border-t border-white/10 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Play className="w-6 h-6 text-accent" fill="currentColor" />
            <span className="text-lg font-bold">
              Stream<span className="text-accent">Flix</span>
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-text-secondary">
            <div>
              <p className="mb-2">Help Center</p>
              <p className="mb-2">Terms of Use</p>
              <p className="mb-2">Privacy</p>
            </div>
            <div>
              <p className="mb-2">Cancellation</p>
              <p className="mb-2">Speed Test</p>
              <p className="mb-2">Only on StreamFlix</p>
            </div>
            <div>
              <p className="mb-2">Account</p>
              <p className="mb-2">Supported Devices</p>
              <p className="mb-2">Contact Us</p>
            </div>
            <div>
              <p className="mb-2">Jobs</p>
              <p className="mb-2">Gift Cards</p>
              <p className="mb-2">Media Center</p>
            </div>
          </div>
          <p className="mt-8 text-xs text-text-muted">
            © 2024 StreamFlix. Data provided by TMDB.
          </p>
        </div>
      </footer>
    </main>
  );
}
