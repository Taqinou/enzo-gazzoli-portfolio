"use client";

import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL, SOCIAL_LINKS } from "@/data/constants";

interface MinimalContactProps {
  delay?: number;
}

export default function MinimalContact({ delay = 0 }: MinimalContactProps) {
  const { t } = useTranslation();

  return (
    <BlurFade inView delay={delay}>
      <section className="text-center">
        <div className="inline-block rounded-lg bg-mn-primary px-3 py-1 text-sm text-mn-primary-foreground">
          {t("resume.contactChip")}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {t("resume.contactTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-mn-muted-foreground sm:text-base">
          {t("resume.contactLead")}{" "}
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-mn-foreground underline underline-offset-4 hover:text-mn-muted-foreground"
          >
            {t("resume.contactLinkedin")}
          </a>{" "}
          {t("resume.contactOr")}{" "}
          <a
            href={`mailto:${PERSONAL.email}`}
            className="font-medium text-mn-foreground underline underline-offset-4 hover:text-mn-muted-foreground"
          >
            {t("resume.contactEmail")}
          </a>{" "}
          {t("resume.contactTail")}
        </p>
      </section>
    </BlurFade>
  );
}
