import { NextResponse } from "next/server";
import { transcribeWithElevenLabs } from "@/lib/elevenlabs";
import { transcribeWithGemini } from "@/lib/gemini-stt";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");

  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio blob" }, { status: 400 });
  }

  let transcript = await transcribeWithElevenLabs(audio);

  if (transcript === null) {
    // Fall back to Gemini transcription if ElevenLabs is not configured
    transcript = await transcribeWithGemini(audio);
  }

  if (transcript === null) {
    return NextResponse.json(
      {
        error: "Neither ElevenLabs nor Gemini STT is configured",
        transcript: "",
      },
      { status: 501 },
    );
  }

  return NextResponse.json({ transcript });
}
