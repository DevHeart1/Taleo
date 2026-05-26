import { NextResponse } from "next/server";
import { z } from "zod";
import { publishStory } from "@/lib/story-world-db";
import { getAuthSessionUser } from "@/lib/supabase/auth-server";
import { STORY_CATEGORIES } from "@/lib/story-world";

export const runtime = "nodejs";

const publishSchema = z.object({
  storyId: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(400).default(""),
  category: z.enum(STORY_CATEGORIES).default("Adventure"),
  displayName: z.string().min(1).max(60).default("Little Storyteller"),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  confirmed: z.boolean().refine((v) => v === true, {
    message: "You must confirm before publishing.",
  }),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const { storyId, title, description, category, displayName, coverImageUrl } = parsed.data;

  const user = await getAuthSessionUser();

  const result = await publishStory({
    storyId,
    title,
    description,
    category,
    displayName,
    coverImageUrl: coverImageUrl || undefined,
    publisherUserId: user?.id ?? null,
  });

  if (!result) {
    return NextResponse.json(
      { error: "Could not publish story. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ postId: result.postId });
}
