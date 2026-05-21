import type { StorySession } from "@/lib/story-schema";

const globalForStories = globalThis as typeof globalThis & {
  taleoStories?: Map<string, StorySession>;
};

export const memoryStories =
  globalForStories.taleoStories ?? new Map<string, StorySession>();

globalForStories.taleoStories = memoryStories;
