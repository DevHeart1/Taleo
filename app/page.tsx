import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Taleo — Bedtime stories starring your kid",
  description:
    "Taleo turns one tap and a few spoken words into a fully illustrated, narrated bedtime book starring your child as the hero. No screens to tap. No keyboards. Just imagination, out loud.",
  openGraph: {
    title: "Taleo — Bedtime stories starring your kid",
    description:
      "Voice-first AI bedtime books your kid will ask for twice. Try free tonight.",
    type: "website",
  },
};

export default function Page() {
  return <LandingPage />;
}
