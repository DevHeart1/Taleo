"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, Globe } from "lucide-react";
import { StorybookSpread } from "@/components/storybook-spread";
import { StoryAudioPlayer, type StoryAudioPlayerHandle } from "@/components/story-audio-player";
import { ReactionBar } from "@/components/reaction-bar";
import { TaleoLogo } from "@/components/taleo-logo";
import type { NarrationLine, StorySession } from "@/lib/story-schema";
import type { LibraryPost } from "@/lib/story-world";

type LibraryStoryPageProps = {
  post: LibraryPost & { session: StorySession };
};

export function LibraryStoryPage({ post }: LibraryStoryPageProps) {
  const { session } = post;
  const audioPlayerRef = useRef<StoryAudioPlayerHandle | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeLine, setActiveLine] = useState<NarrationLine | null>(null);

  const currentScene = session.scenes[currentPageIndex] ?? session.scenes[0];
  const totalPages = session.scenes.length;

  const goToPage = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalPages) {
        setCurrentPageIndex(index);
      }
    },
    [totalPages],
  );

  const handleSceneChange = useCallback(
    (sceneId: string | null) => {
      if (sceneId) {
        const idx = session.scenes.findIndex((s) => s.id === sceneId);
        if (idx >= 0) setCurrentPageIndex(idx);
      }
    },
    [session.scenes],
  );

  return (
    <div className="sw-story-page">
      {/* Book decorations — same as existing book-view */}
      <div className="book-decorations" aria-hidden>
        <span className="book-flower book-flower-tl" />
        <span className="book-flower book-flower-tr" />
        <span className="book-flower book-flower-bl" />
        <span className="book-flower book-flower-br" />
        <span className="book-leaf book-leaf-l" />
        <span className="book-leaf book-leaf-r" />
      </div>

      {/* Top bar */}
      <header className="book-topbar sw-story-topbar">
        <div className="book-topbar-left">
          <Link href="/library" className="book-back-btn" aria-label="Back to Story World">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </Link>
          <Link href="/library" className="sw-story-world-badge">
            <Globe size={13} /> Story World
          </Link>
        </div>

        <div className="book-topbar-center">
          <Link href="/" aria-label="Taleo home">
            <TaleoLogo className="taleo-logo sw-story-logo" title="Taleo" />
          </Link>
        </div>

        <div className="book-topbar-right">
          <StoryAudioPlayer
            ref={audioPlayerRef}
            session={session}
            onSceneChange={handleSceneChange}
            onLineChange={(payload) => setActiveLine(payload?.line ?? null)}
            onPlaybackChange={() => {}}
          />
        </div>
      </header>

      {/* Meta */}
      <div className="sw-story-meta">
        <span className="sw-card-category">{post.category}</span>
        <span className="sw-story-protagonist">
          {(session.storyBible.protagonist || "Story").charAt(0).toUpperCase()}
          {session.storyBible.protagonist?.slice(1)}
        </span>
        <span className="sw-story-by">
          ✨ by {post.displayName}
        </span>
        <span className="sw-story-pages">
          Page {currentPageIndex + 1} of {totalPages}
        </span>
      </div>

      {/* Book spread — reuses existing component untouched */}
      <StorybookSpread scene={currentScene} activeLine={activeLine} />

      {/* Page navigation */}
      <nav className="book-bottom-nav sw-story-page-nav" aria-label="Page navigation">
        <button
          type="button"
          className="book-nav-btn"
          onClick={() => goToPage(currentPageIndex - 1)}
          disabled={currentPageIndex === 0}
          aria-label="Previous page"
        >
          <ArrowLeft size={18} />
          <span>Prev</span>
        </button>

        <Link href="/library" className="book-nav-btn">
          <Globe size={18} />
          <span>Story World</span>
        </Link>

        <button
          type="button"
          className="book-nav-btn"
          onClick={() => goToPage(currentPageIndex + 1)}
          disabled={currentPageIndex >= totalPages - 1}
          aria-label="Next page"
        >
          <span>Next</span>
          <ArrowRight size={18} />
        </button>
      </nav>

      {/* Reactions */}
      <section className="sw-story-reactions" aria-label="React to this story">
        <ReactionBar
          postId={post.id}
          initialReactions={post.reactions}
          variant="full"
        />
      </section>

      {/* Story info footer */}
      <footer className="sw-story-info">
        <p className="sw-story-premise">{session.storyBible.premise}</p>
        <div className="sw-story-footer-links">
          <Link href="/play" className="sw-story-cta">
            Create your own story ✨
          </Link>
        </div>
      </footer>
    </div>
  );
}
