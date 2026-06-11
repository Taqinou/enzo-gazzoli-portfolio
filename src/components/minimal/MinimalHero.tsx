"use client";

import Image from "next/image";
import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";

interface MinimalHeroProps {
  delay?: number;
}

export default function MinimalHero({ delay = 0 }: MinimalHeroProps) {
  const { t } = useTranslation();

  return (
    <section className="flex items-start justify-between gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <BlurFade delay={delay}>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-[2.5rem]">
            {t("resume.heroTitle")}
          </h1>
        </BlurFade>
        <BlurFade delay={delay * 2}>
          <p className="max-w-[30rem] text-sm text-mn-muted-foreground sm:text-base">
            {t("resume.heroSubtitle")}
          </p>
        </BlurFade>
      </div>
      <BlurFade delay={delay}>
        <Image
          src="/images/profile-picture.jpg"
          alt={t("resume.avatarAlt")}
          width={112}
          height={112}
          className="h-24 w-24 shrink-0 rounded-full border border-mn-border object-cover sm:h-28 sm:w-28"
        />
      </BlurFade>
    </section>
  );
}
