import type { Metadata } from "next";
import { LibraryPage } from "@/components/library-page";
import { listLibraryPosts } from "@/lib/story-world-db";

export const metadata: Metadata = {
  title: "Taleo Story World — Magical stories by children",
  description:
    "Browse, read, and react to illustrated bedtime stories created by children inside Taleo. Find your next magical adventure in Taleo Story World.",
};

export default async function LibraryIndexPage() {
  // Server-side initial load for fast first paint
  const initialPosts = await listLibraryPosts({ sort: "newest", limit: 40 });

  return <LibraryPage initialPosts={initialPosts} />;
}
