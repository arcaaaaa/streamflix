import { NextResponse } from "next/server";
import { movies, categories } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let filteredMovies = [...movies];

  if (category) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.category.includes(category)
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchLower) ||
        movie.director.toLowerCase().includes(searchLower) ||
        movie.cast.some((c) => c.toLowerCase().includes(searchLower))
    );
  }

  return NextResponse.json({
    movies: filteredMovies,
    categories: categories,
    total: filteredMovies.length,
  });
}
