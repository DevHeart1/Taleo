"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { StorybookView } from "@/components/storybook-view";
import { getStoriesFromBrowser } from "@/lib/story-storage";
import type { StorySession } from "@/lib/story-schema";

interface StoryPageClientProps {
  storyId: string;
  serverSession: StorySession | null;
}

export function StoryPageClient({ storyId, serverSession }: StoryPageClientProps) {
  const [session, setSession] = useState<StorySession | null>(serverSession);
  const [isLoading, setIsLoading] = useState(!serverSession);

  useEffect(() => {
    if (serverSession) {
      setTimeout(() => {
        setSession(serverSession);
        setIsLoading(false);
      }, 0);
      return;
    }

    // If no server session, check browser storage
    const browserStories = getStoriesFromBrowser();
    const browserStory = browserStories.find(story => story.id === storyId);
    
    setTimeout(() => {
      if (browserStory) {
        console.log('Found story in browser storage:', storyId);
        setSession(browserStory);
      }
      setIsLoading(false);
    }, 0);
  }, [storyId, serverSession]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading story...
      </div>
    );
  }

  if (!session) {
    notFound();
  }

  return <StorybookView session={session} />;
}