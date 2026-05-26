// Server-only DB helpers for Taleo Story World.
// All functions use the service-role admin client — never called from the browser.

import { getSupabaseAdmin } from "@/lib/supabase";
import type { StorySession } from "@/lib/story-schema";
import {
  EMPTY_REACTIONS,
  type LibraryPost,
  type ReactionCounts,
  type ReactionType,
} from "@/lib/story-world";

// ────────────────────────────────────────────────────────────
// Types mirroring DB rows
// ────────────────────────────────────────────────────────────

type PostRow = {
  id: string;
  story_id: string;
  title: string;
  description: string;
  category: string;
  display_name: string;
  cover_image_url: string | null;
  created_at: string;
};

type ReactionRow = {
  post_id: string;
  reaction_type: string;
};

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function buildReactionCounts(rows: ReactionRow[], postId: string): ReactionCounts {
  const counts = { ...EMPTY_REACTIONS };
  for (const row of rows) {
    if (row.post_id !== postId) continue;
    const key = row.reaction_type as ReactionType;
    if (key in counts) counts[key] += 1;
  }
  return counts;
}

function rowToLibraryPost(row: PostRow, reactions: ReactionCounts): LibraryPost {
  const totalReactions = Object.values(reactions).reduce((s, n) => s + n, 0);
  return {
    id: row.id,
    storyId: row.story_id,
    title: row.title,
    description: row.description,
    category: row.category,
    displayName: row.display_name,
    coverImageUrl: row.cover_image_url ?? undefined,
    reactions,
    totalReactions,
    createdAt: row.created_at,
  };
}

// ────────────────────────────────────────────────────────────
// Queries
// ────────────────────────────────────────────────────────────

export type ListLibraryPostsOptions = {
  sort?: "newest" | "most_reacted";
  category?: string;
  limit?: number;
};

export async function listLibraryPosts(opts: ListLibraryPostsOptions = {}): Promise<LibraryPost[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { sort = "newest", category, limit = 40 } = opts;

  let query = supabase
    .from("story_world_posts")
    .select("id, story_id, title, description, category, display_name, cover_image_url, created_at")
    .eq("is_public", true)
    .eq("is_approved", true);

  if (category) {
    query = query.eq("category", category);
  }

  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  }

  query = query.limit(limit);

  const { data: posts, error } = await query;

  if (error || !posts) {
    console.error("[story-world-db] listLibraryPosts error", error);
    return [];
  }

  if (posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const { data: reactionRows } = await supabase
    .from("story_world_reactions")
    .select("post_id, reaction_type")
    .in("post_id", postIds);

  const reactions = reactionRows ?? [];

  const result: LibraryPost[] = posts.map((row) =>
    rowToLibraryPost(row as PostRow, buildReactionCounts(reactions as ReactionRow[], row.id)),
  );

  if (sort === "most_reacted") {
    result.sort((a, b) => b.totalReactions - a.totalReactions);
  }

  return result;
}

export async function getLibraryPost(
  id: string,
): Promise<(LibraryPost & { session: StorySession }) | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: post, error } = await supabase
    .from("story_world_posts")
    .select("id, story_id, title, description, category, display_name, cover_image_url, created_at")
    .eq("id", id)
    .eq("is_public", true)
    .eq("is_approved", true)
    .maybeSingle();

  if (error || !post) return null;

  // Fetch the underlying story session
  const { data: storyRow, error: storyError } = await supabase
    .from("taleo_stories")
    .select("session")
    .eq("id", (post as PostRow).story_id)
    .maybeSingle();

  if (storyError || !storyRow) return null;

  // Fetch reaction counts
  const { data: reactionRows } = await supabase
    .from("story_world_reactions")
    .select("post_id, reaction_type")
    .eq("post_id", id);

  const reactions = buildReactionCounts((reactionRows ?? []) as ReactionRow[], id);

  return {
    ...rowToLibraryPost(post as PostRow, reactions),
    session: storyRow.session as StorySession,
  };
}

// ────────────────────────────────────────────────────────────
// Mutations
// ────────────────────────────────────────────────────────────

export type PublishStoryInput = {
  storyId: string;
  title: string;
  description: string;
  category: string;
  displayName: string;
  coverImageUrl?: string;
  publisherUserId?: string | null;
};

export async function publishStory(input: PublishStoryInput): Promise<{ postId: string } | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("story_world_posts")
    .upsert(
      {
        story_id: input.storyId,
        title: input.title,
        description: input.description,
        category: input.category,
        display_name: input.displayName,
        cover_image_url: input.coverImageUrl ?? null,
        publisher_user_id: input.publisherUserId ?? null,
        is_public: true,
        is_approved: true,
      },
      { onConflict: "story_id" },
    )
    .select("id")
    .single();

  if (error || !data) {
    console.error("[story-world-db] publishStory error", error);
    return null;
  }

  return { postId: data.id };
}

export type ReactToStoryInput = {
  postId: string;
  reactionType: ReactionType;
  userId?: string | null;
  sessionId?: string | null;
};

export async function reactToStory(input: ReactToStoryInput): Promise<ReactionCounts | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  // Insert with conflict handling: silently ignore duplicates
  const row: Record<string, unknown> = {
    post_id: input.postId,
    reaction_type: input.reactionType,
  };

  if (input.userId) {
    row.user_id = input.userId;
  } else if (input.sessionId) {
    row.session_id = input.sessionId;
  }

  const { error } = await supabase
    .from("story_world_reactions")
    .upsert(row, {
      onConflict: input.userId
        ? "post_id,user_id"
        : "post_id,session_id",
      ignoreDuplicates: true,
    });

  if (error) {
    console.error("[story-world-db] reactToStory error", error);
    return null;
  }

  // Return fresh counts
  const { data: reactionRows } = await supabase
    .from("story_world_reactions")
    .select("post_id, reaction_type")
    .eq("post_id", input.postId);

  return buildReactionCounts((reactionRows ?? []) as ReactionRow[], input.postId);
}
