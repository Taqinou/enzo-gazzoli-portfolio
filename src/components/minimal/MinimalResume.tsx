"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RESUME_EXPERIENCES,
  RESUME_EDUCATION,
  RESUME_SKILLS,
} from "@/data/resume";

interface MinimalResumeProps {
  delay?: number;
}

export default function MinimalResume({ delay = 0 }: MinimalResumeProps) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-12">
      <BlurFade inView delay={delay}>
        <h2 className="text-xl font-bold tracking-tight">{t("resume.workTitle")}</h2>
        <div className="mt-4 flex flex-col gap-6">
          {RESUME_EXPERIENCES.map((exp) => (
            <div key={exp.id}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mn-muted">
                  <Briefcase size={16} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-none">{t(exp.titleKey)}</p>
                  <p className="mt-1 truncate text-xs text-mn-muted-foreground">
                    {t(exp.subtitleKey)}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-mn-muted-foreground">
                  {t(exp.periodKey)}
                </span>
              </div>
              <p className="mt-2 pl-14 text-xs leading-relaxed text-mn-muted-foreground">
                {t(exp.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </BlurFade>
      <BlurFade inView delay={delay + 0.04}>
        <h2 className="text-xl font-bold tracking-tight">{t("resume.educationTitle")}</h2>
        <div className="mt-4 flex flex-col gap-6">
          {RESUME_EDUCATION.map((edu) => (
            <div key={edu.id} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mn-muted">
                <GraduationCap size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-none">{t(edu.degreeKey)}</p>
                <p className="mt-1 truncate text-xs text-mn-muted-foreground">{edu.school}</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-mn-muted-foreground">
                {t(edu.periodKey)}
              </span>
            </div>
          ))}
        </div>
      </BlurFade>
      <BlurFade inView delay={delay + 0.08}>
        <h2 className="text-xl font-bold tracking-tight">{t("resume.skillsTitle")}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {RESUME_SKILLS.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md bg-mn-primary px-2.5 py-0.5 text-xs font-semibold text-mn-primary-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
