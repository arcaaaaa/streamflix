import { NextResponse } from "next/server";

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'trending/movie/week';
  const params = searchParams.toString().replace('endpoint=', '');
  
  try {
    const apiKey = process.env.TMDB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    const url = `${TMDB_BASE_URL}/${endpoint}${params ? '&' + params : ''}?api_key=${apiKey}&language=en-US`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB API Error: ${res.status}` },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
