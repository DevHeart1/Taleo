import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Taleo - Make bedtime easier with stories starring your kid",
  description:
    "Taleo turns your child's spoken idea into a narrated, illustrated bedtime book where they are the hero, helping bedtime feel calmer, safer, and easier to say yes to.",
  openGraph: {
    title: "Taleo - Make bedtime easier with stories starring your kid",
    description:
      "Voice-first bedtime books that reduce bedtime friction and turn your child into the hero. Try free tonight.",
    type: "website",
  },
};

export default function Page() {
  return <LandingPage />;
}
