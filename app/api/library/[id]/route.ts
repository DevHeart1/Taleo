import { NextResponse } from "next/server";
import { getLibraryPost } from "@/lib/story-world-db";
import { hydratePersistedStoryImages } from "@/lib/supabase-storage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const post = await getLibraryPost(id);

  if (!post) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  // Hydrate signed storage URLs for scene images
  try {
    const hydratedSession = await hydratePersistedStoryImages(post.session);
    return NextResponse.json({ post: { ...post, session: hydratedSession } });
  } catch {
    return NextResponse.json({ post });
  }
}
