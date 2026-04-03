import { NextResponse } from "next/server";
import { categories } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      filter: cat.filter,
    })),
  });
}
