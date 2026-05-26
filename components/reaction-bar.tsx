"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { REACTIONS, type LibraryPost, type ReactionCounts, type ReactionType } from "@/lib/story-world";

/** Returns or creates a stable session ID stored in sessionStorage. */
function getOrCreateSessionId(): string {
  const key = "taleo_sw_session_id";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return "anon";
  }
}

/** Returns the set of post IDs this session has already reacted to. */
function getReactedPosts(): Set<string> {
  const key = "taleo_sw_reacted";
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markReacted(postId: string) {
  const key = "taleo_sw_reacted";
  try {
    const set = getReactedPosts();
    set.add(postId);
    sessionStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    // Silently ignore
  }
}

type ReactionBarProps = {
  postId: string;
  initialReactions: ReactionCounts;
  variant?: "card" | "full";
};

export function ReactionBar({ postId, initialReactions, variant = "full" }: ReactionBarProps) {
  const [reactions, setReactions] = useState<ReactionCounts>(initialReactions);
  const [hasReacted, setHasReacted] = useState(false);
  const [pendingType, setPendingType] = useState<ReactionType | null>(null);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // Check if this session already reacted
    const reacted = getReactedPosts();
    if (reacted.has(postId)) {
      setTimeout(() => {
        if (mountedRef.current) {
          setHasReacted(true);
        }
      }, 0);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [postId]);

  const react = useCallback(
    async (type: ReactionType) => {
      if (hasReacted || pendingType) return;

      // Optimistic update
      setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      setHasReacted(true);
      setPendingType(type);
      setError(false);

      try {
        const sessionId = getOrCreateSessionId();
        const res = await fetch("/api/library/react", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ postId, reactionType: type, sessionId }),
        });
        const data = (await res.json()) as { reactions?: ReactionCounts };
        if (mountedRef.current && data.reactions) {
          setReactions(data.reactions);
          markReacted(postId);
        }
      } catch {
        // Roll back optimistic update gracefully
        if (mountedRef.current) {
          setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
          setHasReacted(false);
          setError(true);
        }
      } finally {
        if (mountedRef.current) setPendingType(null);
      }
    },
    [hasReacted, pendingType, postId],
  );

  const totalReactions = Object.values(reactions).reduce((s, n) => s + n, 0);

  if (variant === "card") {
    return (
      <div className="reaction-bar reaction-bar-card" aria-label="Reactions">
        {REACTIONS.map(({ type, emoji }) => (
          <span key={type} className="reaction-chip-mini">
            {emoji} <span>{reactions[type] > 0 ? reactions[type] : ""}</span>
          </span>
        ))}
        {totalReactions > 0 && (
          <span className="reaction-total-mini">{totalReactions}</span>
        )}
      </div>
    );
  }

  return (
    <div className="reaction-bar reaction-bar-full" aria-label="React to this story">
      <p className="reaction-bar-label">
        {hasReacted ? "You reacted! ✨" : "How did this story make you feel?"}
      </p>
      <div className="reaction-buttons">
        {REACTIONS.map(({ type, emoji, label }) => (
          <button
            key={type}
            type="button"
            className={`reaction-btn${pendingType === type ? " reaction-btn-pending" : ""}${hasReacted ? " reaction-btn-done" : ""}`}
            onClick={() => void react(type)}
            disabled={hasReacted || pendingType !== null}
            aria-label={`React: ${label}`}
            aria-pressed={pendingType === type}
          >
            <span className="reaction-emoji" role="img" aria-hidden>
              {emoji}
            </span>
            <span className="reaction-count">{reactions[type] > 0 ? reactions[type] : ""}</span>
            <span className="reaction-label">{label}</span>
          </button>
        ))}
      </div>
      {error && (
        <p className="reaction-error" role="alert">
          Couldn&apos;t save your reaction. Try again!
        </p>
      )}
    </div>
  );
}

/** Compact inline version used on the library browse grid card */
export function ReactionBarCard({ post }: { post: LibraryPost }) {
  return (
    <ReactionBar postId={post.id} initialReactions={post.reactions} variant="card" />
  );
}
