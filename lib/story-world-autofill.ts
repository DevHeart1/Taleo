// Client-side helper that auto-fills the Story World publish form
// using data already present in the completed StorySession.

import type { StorySession } from "@/lib/story-schema";
import { STORY_CATEGORIES, type StoryCategory } from "@/lib/story-world";
import { hasGeneratedStoryImageUrl } from "@/lib/story-image-utils";

// Keyword → category mapping (order matters: first match wins)
const CATEGORY_KEYWORDS: Array<{ keywords: string[]; category: StoryCategory }> = [
  { keywords: ["dragon", "knight", "quest", "adventure", "sword", "hero", "rescue"], category: "Adventure" },
  { keywords: ["dog", "cat", "bear", "bunny", "rabbit", "animal", "fox", "owl", "bird", "fish", "horse", "lion", "tiger"], category: "Animals" },
  { keywords: ["princess", "fairy", "castle", "prince", "queen", "king", "crown", "magic wand"], category: "Princess" },
  { keywords: ["funny", "silly", "laugh", "joke", "clown", "giggle", "prank", "hiccup"], category: "Funny" },
  { keywords: ["bedtime", "sleep", "dream", "night", "moon", "stars", "pajama", "cozy"], category: "Bedtime" },
  { keywords: ["friend", "friendship", "together", "share", "kind", "help"], category: "Friendship" },
  { keywords: ["magic", "wizard", "witch", "spell", "enchant", "potion", "wand", "dragon"], category: "Magical" },
  { keywords: ["bible", "god", "angel", "moral", "honest", "kind", "prayer", "faith"], category: "Bible/Moral" },
  { keywords: ["family", "mum", "mom", "dad", "sister", "brother", "grandma", "grandpa", "baby"], category: "Family" },
  { keywords: ["learn", "school", "count", "number", "letter", "colour", "color", "read", "discover"], category: "Learning" },
];

/** Infer the most likely category from the story bible content. */
function inferCategory(session: StorySession): StoryCategory {
  const text = [
    session.storyBible.premise,
    session.storyBible.protagonist,
    session.storyBible.setting,
    session.storyBible.tone,
    session.storyBible.plotSummary,
  ]
    .join(" ")
    .toLowerCase();

  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }

  return "Adventure"; // sensible default
}

/** Build a short child-friendly title from the protagonist and premise. */
function inferTitle(session: StorySession): string {
  const protagonist = session.storyBible.protagonist?.trim();
  const premise = session.storyBible.premise?.trim();

  if (protagonist && premise) {
    // e.g. "Maya and the Dragon Quest"
    const shortPremise = premise.split(/[.,!?]/)[0].slice(0, 60).trim();
    return `${protagonist} and ${shortPremise}`;
  }

  if (protagonist) {
    return `${protagonist}'s Adventure`;
  }

  if (premise) {
    return premise.split(/[.,!?]/)[0].slice(0, 70).trim();
  }

  return "My Magical Story";
}

/** Extract a short child-friendly summary from the plot summary. */
function inferDescription(session: StorySession): string {
  const plot = session.storyBible.plotSummary?.trim();
  if (plot) {
    // Keep the first sentence or up to 160 characters
    const firstSentence = plot.split(/[.!?]/)[0].trim();
    if (firstSentence.length > 20) {
      return firstSentence.slice(0, 160);
    }
    return plot.slice(0, 160);
  }

  const premise = session.storyBible.premise?.trim();
  if (premise) {
    return premise.slice(0, 160);
  }

  return "A magical adventure waiting to be discovered!";
}

/** Find the best cover image from the completed story. */
function findCoverImage(session: StorySession): string | undefined {
  // Prefer the first scene with a durable image URL
  for (const scene of session.scenes) {
    if (hasGeneratedStoryImageUrl(scene.imageUrl)) {
      return scene.imageUrl;
    }
  }
  return undefined;
}

export type PublishFormAutoFill = {
  title: string;
  description: string;
  category: StoryCategory;
  displayName: string;
  coverImageUrl?: string;
};

/**
 * Derive pre-filled values for the Story World publish form
 * from the just-completed StorySession. The child/parent can
 * edit any field before submitting.
 */
export function autoFillPublishForm(
  session: StorySession,
  userDisplayName?: string | null,
): PublishFormAutoFill {
  return {
    title: inferTitle(session),
    description: inferDescription(session),
    category: inferCategory(session),
    displayName: userDisplayName?.trim() || "Little Storyteller",
    coverImageUrl: findCoverImage(session),
  };
}

export { STORY_CATEGORIES };
