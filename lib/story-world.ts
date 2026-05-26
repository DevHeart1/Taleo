// Shared types and constants for Taleo Story World.

export type ReactionType = "love_it" | "funny" | "magical" | "great_story";

export type ReactionCounts = Record<ReactionType, number>;

export type LibraryPost = {
  id: string; // story_world_posts.id
  storyId: string; // taleo_stories.id — used for /story/[id] reader
  title: string;
  description: string;
  category: string;
  displayName: string;
  coverImageUrl?: string;
  reactions: ReactionCounts;
  totalReactions: number;
  createdAt: string;
};

export const STORY_CATEGORIES = [
  "Adventure",
  "Animals",
  "Princess",
  "Funny",
  "Bedtime",
  "Friendship",
  "Magical",
  "Bible/Moral",
  "Family",
  "Learning",
] as const;

export type StoryCategory = (typeof STORY_CATEGORIES)[number];

export const REACTIONS: {
  type: ReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "love_it", emoji: "❤️", label: "Love it" },
  { type: "funny", emoji: "😂", label: "Funny" },
  { type: "magical", emoji: "🌟", label: "Magical" },
  { type: "great_story", emoji: "👏", label: "Great story" },
];

export const EMPTY_REACTIONS: ReactionCounts = {
  love_it: 0,
  funny: 0,
  magical: 0,
  great_story: 0,
};
