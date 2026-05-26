"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Globe, SlidersHorizontal, Sparkles } from "lucide-react";
import { TaleoLogo } from "@/components/taleo-logo";
import { LibraryStoryCard } from "@/components/library-story-card";
import { STORY_CATEGORIES, type LibraryPost } from "@/lib/story-world";

type SortOption = "newest" | "most_reacted";

type LibraryPageProps = {
  initialPosts: LibraryPost[];
};

export function LibraryPage({ initialPosts }: LibraryPageProps) {
  const [posts, setPosts] = useState<LibraryPost[]>(initialPosts);
  const [sort, setSort] = useState<SortOption>("newest");
  const [category, setCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const loadPosts = async (s: SortOption, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: s });
      if (cat !== "all") params.set("category", cat);
      const res = await fetch(`/api/library?${params.toString()}`);
      const data = (await res.json()) as { posts?: LibraryPost[] };
      setPosts(data.posts ?? []);
    } catch {
      // Keep existing posts on error
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    void loadPosts(newSort, category);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    void loadPosts(sort, newCat);
  };

  return (
    <div className="sw-page">
      {/* Background decoration */}
      <div className="sw-bg-deco" aria-hidden>
        <span className="sw-bg-blob sw-bg-blob-1" />
        <span className="sw-bg-blob sw-bg-blob-2" />
        <span className="sw-bg-blob sw-bg-blob-3" />
      </div>

      {/* Nav */}
      <header className="sw-nav">
        <Link href="/" className="sw-nav-brand" aria-label="Taleo home">
          <TaleoLogo className="taleo-logo" title="Taleo" />
        </Link>
        <nav className="sw-nav-links" aria-label="Primary">
          <Link href="/play">Start a story</Link>
          <Link href="/stories">My books</Link>
          <Link href="/library" aria-current="page" className="sw-nav-active">
            <Globe size={15} />
            Story World
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="sw-hero">
        <span className="sw-eyebrow">
          <Sparkles size={14} /> Taleo Story World
        </span>
        <h1 className="sw-title">
          Magical stories made by children, <em>just like you.</em>
        </h1>
        <p className="sw-subtitle">
          Pick any story, read it, listen to the narration, and leave a little reaction to
          brighten the author&apos;s day. ✨
        </p>
        <Link href="/play" className="sw-hero-cta">
          Create your own story →
        </Link>
      </section>

      {/* Filters */}
      <section className="sw-filters" aria-label="Filter and sort stories">
        <div className="sw-filters-inner">
          <span className="sw-filter-label">
            <SlidersHorizontal size={14} /> Sort
          </span>
          <div className="sw-sort-tabs" role="group" aria-label="Sort order">
            <button
              type="button"
              className={`sw-filter-tab${sort === "newest" ? " sw-filter-tab-active" : ""}`}
              onClick={() => handleSortChange("newest")}
            >
              Newest
            </button>
            <button
              type="button"
              className={`sw-filter-tab${sort === "most_reacted" ? " sw-filter-tab-active" : ""}`}
              onClick={() => handleSortChange("most_reacted")}
            >
              Most loved
            </button>
          </div>

          <span className="sw-filter-divider" aria-hidden />

          <div className="sw-category-chips" role="group" aria-label="Filter by category">
            <button
              type="button"
              className={`sw-category-chip${category === "all" ? " sw-category-chip-active" : ""}`}
              onClick={() => handleCategoryChange("all")}
            >
              All
            </button>
            {STORY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`sw-category-chip${category === cat ? " sw-category-chip-active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="sw-main" id="stories">
        {loading ? (
          <section className="sw-empty" aria-live="polite">
            <BookOpen size={52} strokeWidth={1.4} />
            <h2>Loading magical stories…</h2>
          </section>
        ) : posts.length > 0 ? (
          <section className="sw-grid" aria-label="Published stories">
            {posts.map((post) => (
              <LibraryStoryCard key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <section className="sw-empty">
            <BookOpen size={52} strokeWidth={1.4} />
            <h2>No stories here yet.</h2>
            <p>
              {category !== "all"
                ? `No ${category} stories published yet — try a different category!`
                : "Be the first to share a magical story with the world!"}
            </p>
            <Link href="/play" className="sw-empty-cta">
              <Sparkles size={16} />
              Create the first story
            </Link>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="sw-footer">
        <span>Taleo Story World — Made with care for little readers</span>
        <div className="sw-footer-links">
          <Link href="/play">Start a story</Link>
          <Link href="/stories">My books</Link>
          <Link href="/settings">Parent settings</Link>
        </div>
      </footer>
    </div>
  );
}
