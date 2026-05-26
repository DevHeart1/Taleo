/**
 * Central place for Taleo's fixed Gemini model selection used by story and illustrations.
 */

export const DEFAULT_GEMINI_STORY_MODEL = "gemini-3-flash-preview";
export const DEFAULT_GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
export const PIXAR_IMAGE_MODEL = "gemini-2.5-flash-image";

export type ImageQualityTier = "low" | "medium" | "high";

/** Native Gemini model for structured story turns. */
export function resolvedStoryModel(): string {
  return DEFAULT_GEMINI_STORY_MODEL;
}

/** Native Gemini image model for all Taleo illustration paths. */
export function resolvedImageModel(): string {
  return DEFAULT_GEMINI_IMAGE_MODEL;
}
