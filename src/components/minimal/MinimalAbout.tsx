"use client";

import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";

interface MinimalAboutProps {
  delay?: number;
}

export default function MinimalAbout({ delay = 0 }: MinimalAboutProps) {
  const { t } = useTranslation();

  return (
    <section>
      <BlurFade inView delay={delay}>
        <h2 className="text-xl font-bold tracking-tight">{t("resume.aboutTitle")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-mn-muted-foreground">
          {t("cv.statusDescription")}
        </p>
      </BlurFade>
    </section>
  );
}
