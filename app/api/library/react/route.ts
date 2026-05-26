import { NextResponse } from "next/server";
import { z } from "zod";
import { reactToStory } from "@/lib/story-world-db";
import { getAuthSessionUser } from "@/lib/supabase/auth-server";
import { EMPTY_REACTIONS } from "@/lib/story-world";

export const runtime = "nodejs";

const reactSchema = z.object({
  postId: z.string().uuid(),
  reactionType: z.enum(["love_it", "funny", "magical", "great_story"]),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reactions: EMPTY_REACTIONS }, { status: 200 });
  }

  const parsed = reactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ reactions: EMPTY_REACTIONS }, { status: 200 });
  }

  const { postId, reactionType, sessionId } = parsed.data;
  const user = await getAuthSessionUser();

  const reactions = await reactToStory({
    postId,
    reactionType,
    userId: user?.id ?? null,
    sessionId: sessionId ?? null,
  });

  // Always return 200 — reaction failure must never crash the page
  return NextResponse.json({ reactions: reactions ?? EMPTY_REACTIONS });
}
