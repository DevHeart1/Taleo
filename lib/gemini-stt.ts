import { GoogleGenAI } from "@google/genai";

/**
 * Transcribes audio blob using Google Gemini Flash model.
 * Fits as a fallback when ElevenLabs Scribe is not configured.
 */
export async function transcribeWithGemini(audio: Blob): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const buffer = Buffer.from(await audio.arrayBuffer());
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: audio.type || "audio/webm",
          },
        },
        "Please transcribe the spoken words in this audio recording. Return ONLY the transcribed text. Do not include any tags, explanations, or notes. If the audio is silent or contains no speech, return an empty string.",
      ],
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini audio transcription failed:", error);
    return null;
  }
}
