import { NextResponse } from "next/server";
import { listLibraryPosts } from "@/lib/story-world-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sort = (url.searchParams.get("sort") ?? "newest") as "newest" | "most_reacted";
  const category = url.searchParams.get("category") ?? undefined;

  const posts = await listLibraryPosts({ sort, category });
  return NextResponse.json({ posts });
}
