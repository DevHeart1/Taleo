"use client";

import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { StorySceneImage } from "@/components/story-scene-image";
import { ReactionBarCard } from "@/components/reaction-bar";
import type { LibraryPost } from "@/lib/story-world";

type LibraryStoryCardProps = {
  post: LibraryPost;
};

export function LibraryStoryCard({ post }: LibraryStoryCardProps) {
  const sceneCount = 0; // We don't expose the full session in list view for perf
  void sceneCount;

  return (
    <article className="sw-card">
      {/* Cover image */}
      <Link href={`/library/${post.id}`} className="sw-card-cover" aria-label={`Read ${post.title}`}>
        {post.coverImageUrl ? (
          <StorySceneImage
            src={post.coverImageUrl}
            alt={post.title}
            width={512}
            height={512}
          />
        ) : (
          <div className="sw-card-cover-placeholder" aria-hidden>
            <BookOpen size={52} strokeWidth={1.3} />
          </div>
        )}
        <span className="sw-card-read-overlay">
          <BookOpen size={18} />
          Read Story
        </span>
        {/* Category badge */}
        <span className="sw-card-category">{post.category}</span>
      </Link>

      {/* Content */}
      <div className="sw-card-body">
        <h2 className="sw-card-title">
          <Link href={`/library/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="sw-card-description">{post.description}</p>

        <div className="sw-card-meta">
          <span className="sw-card-publisher">
            ✨ {post.displayName}
          </span>
          <span className="sw-card-dot" aria-hidden>·</span>
          <span className="sw-card-date">
            <Clock size={13} />
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <ReactionBarCard post={post} />
      </div>
    </article>
  );
}
