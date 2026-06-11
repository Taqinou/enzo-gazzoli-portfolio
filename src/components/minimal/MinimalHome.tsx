"use client";

import MinimalHero from "@/components/minimal/MinimalHero";
import MinimalAbout from "@/components/minimal/MinimalAbout";
import MinimalResume from "@/components/minimal/MinimalResume";
import MinimalProjects from "@/components/minimal/MinimalProjects";
import MinimalContact from "@/components/minimal/MinimalContact";
import MinimalDock from "@/components/minimal/MinimalDock";

const BLUR_FADE_DELAY = 0.02;

export default function MinimalHome() {
  return (
    <main className="relative min-h-screen w-full bg-mn-background font-mn-sans text-mn-foreground antialiased">
      <div className="mx-auto flex w-full max-w-[39rem] flex-col gap-16 px-6 pb-32 pt-16 sm:pt-24">
        <MinimalHero delay={BLUR_FADE_DELAY} />
        <MinimalAbout delay={BLUR_FADE_DELAY * 3} />
        <MinimalResume delay={BLUR_FADE_DELAY * 5} />
        <MinimalProjects delay={BLUR_FADE_DELAY * 8} />
        <MinimalContact delay={BLUR_FADE_DELAY * 10} />
      </div>
      <MinimalDock />
    </main>
  );
}
