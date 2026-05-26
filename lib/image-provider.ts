import { GoogleGenAI } from "@google/genai";
import { ART_STYLE, type Scene, type StoryBible } from "@/lib/story-schema";
import { resolvedImageModel, type ImageQualityTier } from "@/lib/openai-model-config";
import { dataUrlToBlob, uploadStoryImage } from "@/lib/supabase-storage";
import type { ImageStyle } from "@/lib/story-settings";

type ChildReferenceImage = {
  childName: string;
  faceDataUrl: string;
};

export const PIXAR_ART_STYLE = [
  "Pixar-quality 3D animated cartoon style, stylized cinematic CG render in the look of a modern Disney/Pixar/Dreamworks feature film",
  "stylized cartoon characters with large expressive eyes, soft subsurface skin shading, fluffy stylized hair, gentle rounded silhouettes, friendly proportions",
  "painterly volumetric lighting with warm golden rim light, soft ambient bounce, cinematic depth of field with creamy bokeh",
  "lush detailed environments with hand-crafted set dressing, atmospheric haze, magical mood",
  "vibrant but harmonious color palette, polished feature-film CGI look, high-end studio quality",
  "family-friendly children's movie aesthetic, single subject focus, full-bleed cinematic composition",
  "absolutely no text or watermarks anywhere: no words, letters, numbers, captions, subtitles, signs, logos, UI, or typography of any language",
  "no book mockup, no open book, no page layout, no panels, no borders, pure standalone illustrated scene",
].join(", ");

/** Azure blob image URLs expire, so refresh them if one somehow survives from older generations. */
export function looksLikeExpiredProneImageUrl(url: string): boolean {
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  try {
    return new URL(url).hostname.endsWith(".blob.core.windows.net");
  } catch {
    return false;
  }
}

export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fee2e2"/>
      <stop offset="50%" stop-color="#fef3c7"/>
      <stop offset="100%" stop-color="#bfdbfe"/>
    </linearGradient>
    <linearGradient id="taleo-cover-placeholder" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#a78bfa" offset="0%" />
      <stop stop-color="#6366f1" offset="100%" />
    </linearGradient>
    <linearGradient id="taleo-pages-placeholder" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#ffffff" offset="0%" />
      <stop stop-color="#fef3c7" offset="100%" />
    </linearGradient>
    <linearGradient id="taleo-star-placeholder" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fffead" offset="0%" />
      <stop stop-color="#fbbf24" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <circle cx="280" cy="320" r="120" fill="#fff7ed" opacity="0.8"/>
  <circle cx="720" cy="300" r="90" fill="#dbeafe" opacity="0.85"/>
  <path d="M160 760 C310 590 430 650 520 530 C650 365 820 510 900 760 Z" fill="#86efac" opacity="0.8"/>
  <path d="M246 604 C330 520 450 512 546 596 C638 678 744 650 816 584" fill="none" stroke="#7c3aed" stroke-width="34" stroke-linecap="round" opacity="0.45"/>
  <g transform="translate(278, 180) scale(6) rotate(-8 39 40)">
    <path d="M16 28 C28 22 38 29 38 29 L38 58 C38 58 28 51 16 57 Z" fill="url(#taleo-cover-placeholder)" stroke="#1e1b4b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M62 28 C50 22 40 29 40 29 L40 58 C40 58 50 51 62 57 Z" fill="url(#taleo-cover-placeholder)" stroke="#1e1b4b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M18 29 C28 24 37 30 37 30 L37 56 C37 56 28 50 18 55 Z" fill="url(#taleo-pages-placeholder)" stroke="#1e1b4b" stroke-width="2"/>
    <path d="M60 29 C50 24 41 30 41 30 L41 56 C41 56 50 50 60 55 Z" fill="url(#taleo-pages-placeholder)" stroke="#1e1b4b" stroke-width="2"/>
    <path d="M38 30 L40 30 L40 64 L37 61 L34 64 L34 30 Z" fill="#f43f5e"/>
    <path d="M39 12 L42.5 19.5 L50.5 20.5 L44.5 26 L46 34 L39 30 L32 34 L33.5 26 L27.5 20.5 L35.5 19.5 Z" fill="url(#taleo-star-placeholder)" stroke="#1e1b4b" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="36.5" cy="22.5" r="1.5" fill="#1e1b4b" />
    <circle cx="41.5" cy="22.5" r="1.5" fill="#1e1b4b" />
    <path d="M37.5 25.5 Q39 27 40.5 25.5" stroke="#1e1b4b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <circle cx="56" cy="16" r="3" fill="#fbbf24" />
    <path d="M12 20l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5Z" fill="#38bdf8" />
  </g>
  <text x="512" y="894" text-anchor="middle" font-family="Arial" font-size="64" font-weight="bold" fill="#7c2d12">Taleo</text>
</svg>`);

export function isPlaceholderImageUrl(imageUrl?: string) {
  return imageUrl === PLACEHOLDER_IMAGE;
}

export class StoryImageGenerationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StoryImageGenerationError";
  }
}

function dataUrlToImageBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  return {
    buffer: Buffer.from(match[2], "base64"),
    mimeType,
  };
}

function imageQualityDirection(tier: ImageQualityTier | undefined) {
  if (tier === "high") {
    return "Push detail, texture fidelity, polished lighting, and richer environmental finish while staying child-friendly and clear.";
  }

  return "Keep the composition clean, readable, and polished with one clear focal moment.";
}

function createGeminiPrompt(
  scene: Scene,
  storyBible: StoryBible,
  options?: {
    imageQualityTier?: ImageQualityTier;
    imageStyle?: ImageStyle;
    economyGuestMode?: boolean;
    childReferenceImage?: ChildReferenceImage;
  },
) {
  const isPixar = options?.imageStyle === "disney-pixar";
  const artDirection = isPixar ? PIXAR_ART_STYLE : storyBible.artStyle || ART_STYLE;
  const sceneDirection = isPixar
    ? [
        "Create one full-bleed cinematic scene render only.",
        "Output must look like a single still frame from a modern animated family film, not a photographed book, not a printed page, not a collage, and not a two-page spread.",
        "No written words, letters, numbers, captions, subtitles, labels, signs, UI, callouts, arrows, speech bubbles, or typography of any kind.",
        "Keep character proportions, colors, clothing, accessories, face shapes, and silhouettes consistent across scenes.",
      ].join(" ")
    : [
        "Create one full-bleed storybook illustration only.",
        "Output must look like a standalone story moment, not a photographed book, not a printed page, not a collage, and not a two-page spread.",
        "No written words, letters, numbers, captions, subtitles, labels, signs, UI, callouts, arrows, speech bubbles, or typography of any kind.",
        "Keep character proportions, colors, clothing, accessories, face shapes, and silhouettes consistent across scenes.",
      ].join(" ");

  return [
    artDirection,
    sceneDirection,
    imageQualityDirection(options?.imageQualityTier),
    options?.economyGuestMode ? "Favor a simple composition with one focal subject and uncluttered background storytelling." : "",
    storyBible.characterDesigns
      ? `Use these exact recurring character designs in every image: ${storyBible.characterDesigns}`
      : "",
    `Keep this story consistent: ${storyBible.plotSummary}`,
    `Scene moment to illustrate: ${scene.imagePrompt}`,
    options?.childReferenceImage
      ? `The protagonist is ${options.childReferenceImage.childName}. Preserve their face shape, skin tone, hair, eye shape, and smile while translating them into the illustration style. Do not render the source photo itself.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function extractGeneratedImageDataUrl(response: {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
      }>;
    };
  }>;
}) {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const mimeType = part.inlineData?.mimeType;
    const data = part.inlineData?.data;
    if (mimeType?.startsWith("image/") && data) {
      return `data:${mimeType};base64,${data}`;
    }
  }
  return null;
}

async function generateImageWithGemini(
  prompt: string,
  reference?: ChildReferenceImage,
) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const parts: Array<
    | { text: string }
    | {
        inlineData: {
          mimeType: string;
          data: string;
        };
      }
  > = [{ text: prompt }];

  if (reference) {
    const imageData = dataUrlToImageBuffer(reference.faceDataUrl);
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.buffer.toString("base64"),
        },
      });
    }
  }

  const response = await ai.models.generateContent({
    model: resolvedImageModel(),
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  const imageDataUrl = extractGeneratedImageDataUrl(response);
  if (!imageDataUrl) {
    throw new StoryImageGenerationError("Gemini image model returned no image data");
  }

  return imageDataUrl;
}

function errorDetail(error: unknown): string {
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "";
}

export async function generateSceneImage(
  scene: Scene,
  storyBible: StoryBible,
  options?: {
    imageQualityTier?: ImageQualityTier;
    imageStyle?: ImageStyle;
    childReferenceImage?: ChildReferenceImage;
    economyGuestMode?: boolean;
  },
) {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new StoryImageGenerationError("GEMINI_API_KEY is not configured");
  }

  const prompt = createGeminiPrompt(scene, storyBible, options);

  try {
    return await generateImageWithGemini(prompt, options?.childReferenceImage);
  } catch (error) {
    console.error("Gemini image generation failed", error);
    const detail = errorDetail(error);
    const prefix = options?.imageStyle === "disney-pixar" ? "Pixar-style" : "Image";
    throw new StoryImageGenerationError(
      detail ? `${prefix} generation failed: ${detail}` : `${prefix} generation failed`,
      { cause: error },
    );
  }
}

export async function generateAndUploadStoryImage(
  scene: Scene,
  storyBible: StoryBible,
  storyId: string,
  sceneIndex: number,
  options?: {
    imageQualityTier?: ImageQualityTier;
    childReference?: ChildReferenceImage;
    imageStyle?: ImageStyle;
    economyGuestMode?: boolean;
  },
): Promise<string> {
  const dataUrl = await generateSceneImage(scene, storyBible, {
    imageQualityTier: options?.imageQualityTier,
    imageStyle: options?.imageStyle,
    childReferenceImage: options?.childReference,
    economyGuestMode: options?.economyGuestMode,
  });

  const imageBlob = dataUrlToBlob(dataUrl);
  if (!imageBlob) {
    throw new StoryImageGenerationError("Could not decode generated image for upload");
  }

  const uploadedUrl = await uploadStoryImage(imageBlob, storyId, sceneIndex);
  if (!uploadedUrl) {
    console.warn("Failed to upload image to Supabase, using data URL");
    return dataUrl;
  }

  console.log(`Image uploaded to Supabase Storage: ${uploadedUrl}`);
  return uploadedUrl;
}
