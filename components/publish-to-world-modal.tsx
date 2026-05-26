"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Globe, Loader2, X } from "lucide-react";
import { autoFillPublishForm, STORY_CATEGORIES } from "@/lib/story-world-autofill";
import type { StoryCategory } from "@/lib/story-world";
import type { StorySession } from "@/lib/story-schema";

type PublishStatus = "idle" | "submitting" | "success" | "error";

type PublishToWorldModalProps = {
  session: StorySession;
  onClose: () => void;
  userDisplayName?: string | null;
};

export function PublishToWorldModal({
  session,
  onClose,
  userDisplayName,
}: PublishToWorldModalProps) {
  const autoFill = autoFillPublishForm(session, userDisplayName);

  const [title, setTitle] = useState(autoFill.title);
  const [description, setDescription] = useState(autoFill.description);
  const [category, setCategory] = useState(autoFill.category);
  const [displayName, setDisplayName] = useState(autoFill.displayName);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!confirmed || status !== "idle") return;

      setStatus("submitting");
      setErrorMsg("");

      try {
        const res = await fetch("/api/library/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            storyId: session.id,
            title: title.trim(),
            description: description.trim(),
            category,
            displayName: displayName.trim() || "Little Storyteller",
            coverImageUrl: autoFill.coverImageUrl ?? "",
            confirmed: true,
          }),
        });

        const data = (await res.json()) as { postId?: string; error?: string };

        if (!mountedRef.current) return;

        if (!res.ok || !data.postId) {
          setErrorMsg(data.error ?? "Something went wrong. Please try again.");
          setStatus("error");
          return;
        }

        setStatus("success");
      } catch {
        if (mountedRef.current) {
          setErrorMsg("No internet connection. Please try again.");
          setStatus("error");
        }
      }
    },
    [autoFill.coverImageUrl, category, confirmed, description, displayName, session.id, status, title],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current && status !== "submitting") onClose();
    },
    [onClose, status],
  );

  return (
    <div
      className="publish-overlay"
      role="dialog"
      aria-modal
      aria-label="Publish to Taleo Story World"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="publish-modal">
        {/* Header */}
        <div className="publish-modal-header">
          <div className="publish-modal-title-row">
            <Globe size={22} className="publish-modal-globe" />
            <h2 className="publish-modal-title">Publish to Taleo Story World</h2>
          </div>
          <button
            type="button"
            className="publish-modal-close"
            onClick={onClose}
            aria-label="Close"
            disabled={status === "submitting"}
          >
            <X size={20} />
          </button>
        </div>

        {status === "success" ? (
          /* Success state */
          <div className="publish-success">
            <span className="publish-success-icon">🌟</span>
            <h3>Your story is live!</h3>
            <p>
              Other readers can now find, read, and react to your magical story in{" "}
              <strong>Taleo Story World</strong>.
            </p>
            <a href="/library" className="publish-success-link">
              <Globe size={16} />
              Visit Taleo Story World
            </a>
            <button type="button" className="publish-success-done" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="publish-form" onSubmit={(e) => void handleSubmit(e)}>
            {/* Cover preview */}
            {autoFill.coverImageUrl && (
              <div className="publish-cover-preview">
                <Image
                  src={autoFill.coverImageUrl}
                  alt="Story cover"
                  width={80}
                  height={80}
                  className="publish-cover-img"
                />
                <p className="publish-cover-hint">✨ Cover image from your story</p>
              </div>
            )}

            {/* Title */}
            <label className="publish-field">
              <span>Story title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
                placeholder="My magical story"
                className="publish-input"
              />
            </label>

            {/* Description */}
            <label className="publish-field">
              <span>Short description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={400}
                rows={3}
                placeholder="What is this story about?"
                className="publish-input publish-textarea"
              />
            </label>

            {/* Category */}
            <label className="publish-field">
              <span>Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StoryCategory)}
                className="publish-input publish-select"
              >
                {STORY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            {/* Display name */}
            <label className="publish-field">
              <span>
                Your name in Story World{" "}
                <small>(only your display name is shown, never your real name)</small>
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                required
                placeholder="Little Storyteller"
                className="publish-input"
              />
            </label>

            {/* Consent */}
            <label className="publish-consent">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="publish-checkbox"
              />
              <span>
                I understand this story may be visible to other readers in Taleo Story World.
              </span>
            </label>

            {errorMsg && (
              <p className="publish-error" role="alert">
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="publish-submit"
              disabled={!confirmed || status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={18} className="publish-spinner" />
                  Publishing…
                </>
              ) : (
                <>
                  <Check size={18} />
                  Publish my story ✨
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
