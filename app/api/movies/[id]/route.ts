import { NextResponse } from "next/server";
import { getMovieById } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const movie = getMovieById(params.id);

  if (!movie) {
    return NextResponse.json(
      { error: "Movie not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(movie);
}
