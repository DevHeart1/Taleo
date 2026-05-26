import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LibraryStoryPage } from "@/components/library-story-page";
import { getLibraryPost } from "@/lib/story-world-db";
import { hydratePersistedStoryImages } from "@/lib/supabase-storage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getLibraryPost(id);

  if (!post) {
    return { title: "Story not found — Taleo Story World" };
  }

  return {
    title: `${post.title} — Taleo Story World`,
    description: post.description || `A magical story by ${post.displayName} in Taleo Story World.`,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function LibraryStoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getLibraryPost(id);

  if (!post) {
    notFound();
  }

  // Hydrate storage image URLs
  let hydratedPost = post;
  try {
    const hydratedSession = await hydratePersistedStoryImages(post.session);
    hydratedPost = { ...post, session: hydratedSession };
  } catch {
    // Use unhydrated session as fallback
  }

  return <LibraryStoryPage post={hydratedPost} />;
}
