/**
 * Central place for env-driven Gemini model selection used by story + illustrations.
 */

export const DEFAULT_GEMINI_STORY_MODEL = "gemini-3-flash";
/**
 * Default image model (`images.generate`)
 * Prefer `imagen-3.0-generate-002` for high spend/quality.
 */
export const DEFAULT_GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002";
/** Forced model for the "Disney / Pixar 3D animation" style — always max quality. */
export const PIXAR_IMAGE_MODEL = "imagen-3.0-generate-002";

const DALL_E_2_SIZES = ["256x256", "512x512", "1024x1024"] as const;

/** Maps deprecated Images API models to supported Imagen slugs. */
export function remapDeprecatedOpenAIImageModels(model: string): string {
  const m = model.trim().toLowerCase();
  if (m.startsWith("dall-e-") || m.startsWith("gpt-image-")) {
    return "imagen-3.0-generate-002";
  }
  return model.trim();
}

/** Chat / completions model for story turns (`GEMINI_*`). */
export function resolvedStoryModel(): string {
  const raw =
    process.env.GEMINI_STORY_MODEL?.trim() ||
    process.env.GEMINI_CHAT_MODEL?.trim();
  return raw || DEFAULT_GEMINI_STORY_MODEL;
}

/**
 * Images API model for watercolor / editor defaults (`images.generate` in `generateSceneImage`).
 */
export function resolvedImageModel(): string {
  const raw =
    process.env.GEMINI_IMAGE_MODEL?.trim() || process.env.IMAGE_MODEL?.trim();
  const slug = raw || DEFAULT_GEMINI_IMAGE_MODEL;
  return remapDeprecatedOpenAIImageModels(slug);
}

export function isDallE2Model(model: string): boolean {
  return model.trim().startsWith("dall-e-2");
}


/** Subset passed to `openai.images.generate` beside `prompt`. */
export type ImageGenerationBase = {
  model: string;
  size: "1024x1024" | "512x512" | "256x256" | "1024x1792" | "1792x1024";
  quality?: "standard" | "hd" | "low" | "medium" | "high";
  n: 1;
};

export type ImageQualityTier = "low" | "medium" | "high";

/**
 * Builds `images.generate` fields for supported families. Prefer setting
 * `OPENAI_IMAGE_QUALITY` for cost vs fidelity (meaning depends on model family).
 */
export function imageGenerationParams(modelFromEnv: string): ImageGenerationBase {
  const model = modelFromEnv.trim();
  const q = process.env.OPENAI_IMAGE_QUALITY?.trim().toLowerCase();
  const n = 1 as const;

  if (isDallE2Model(model)) {
    const requested = process.env.OPENAI_IMAGE_SIZE?.trim() as (typeof DALL_E_2_SIZES)[number] | undefined;
    const size =
      requested && DALL_E_2_SIZES.includes(requested) ? requested : "512x512";
    return {
      model,
      size,
      n,
    };
  }

  if (model.startsWith("dall-e-3")) {
    const quality = q === "hd" ? "hd" : "standard";
    return {
      model,
      size: "1024x1024",
      quality,
      n,
    };
  }

  // gpt-image-1 (and dated snapshots): quality medium | high — avoid "low" (unreliable on mini/full).
  const quality: "medium" | "high" =
    q === "high" ? "high" : "medium";

  return {
    model,
    size: "1024x1024",
    quality,
    n,
  };
}

/** Parent-facing tier: maps to size (DALL·E 2), quality (gpt-image), or hd flag (DALL·E 3). */
export function imageGenerationParamsForTier(
  modelFromEnv: string,
  tier: ImageQualityTier,
): ImageGenerationBase {
  const model = modelFromEnv.trim();
  const n = 1 as const;
  /** `quality: "low"` on gpt-image-* has been unreliable; product minimum is medium. */
  const tierFloor: ImageQualityTier = tier === "low" ? "medium" : tier;

  if (isDallE2Model(model)) {
    const size =
      tierFloor === "medium" ? "512x512" : tierFloor === "high" ? "1024x1024" : "512x512";
    return { model, size, n };
  }

  if (model.startsWith("dall-e-3")) {
    const quality = tierFloor === "high" ? "hd" : "standard";
    return { model, size: "1024x1024", quality, n };
  }

  const quality: "medium" | "high" = tierFloor === "medium" ? "medium" : "high";
  return { model, size: "1024x1024", quality, n };
}

export function resolveImageGenerationParams(
  modelFromEnv: string,
  tier?: ImageQualityTier,
): ImageGenerationBase {
  return tier ? imageGenerationParamsForTier(modelFromEnv, tier) : imageGenerationParams(modelFromEnv);
}

/**
 * Anonymous guest path: watercolor-only UX, capped to `gpt-image-1-mini` unless env already resolves to mini.
 */
export function economyGuestImageGenerationParams(): ImageGenerationBase {
  const resolved = resolvedImageModel();
  const capped = resolved.startsWith("gpt-image-1-mini") ? resolved : "gpt-image-1-mini";
  return imageGenerationParamsForTier(capped, "medium");
}

/**
 * Fixed top-quality image params for the Disney / Pixar 3D animation style.
 * Bypasses env / tier resolution: always `gpt-image-1` at `1024x1024` quality `high`.
 */
export function pixarImageGenerationParams(): ImageGenerationBase {
  return {
    model: PIXAR_IMAGE_MODEL,
    size: "1024x1024",
    quality: "high",
    n: 1,
  };
}
