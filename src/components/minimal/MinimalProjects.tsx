"use client";

import { memo } from "react";
import Image from "next/image";
import { Globe, Github } from "lucide-react";
import BlurFade from "@/components/ui/BlurFade";
import { useTranslation } from "@/hooks/useTranslation";
import { projects, type Project } from "@/data/projects";

interface MinimalProjectCardProps {
  project: Project;
}

const MinimalProjectCard = memo(({ project }: MinimalProjectCardProps) => {
  const { t } = useTranslation();

  const isGithubLink = project.linkText === "github";
  const websiteUrl = isGithubLink ? undefined : project.linkUrl;
  const sourceUrl = project.githubUrl ?? (isGithubLink ? project.linkUrl : undefined);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-mn-border bg-mn-background">
      {project.imageUrl ? (
        <Image
          src={project.imageUrl}
          alt={t(`projects.${project.index}.title`)}
          width={640}
          height={360}
          className="h-40 w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-mn-muted">
          <span className="font-mono text-2xl font-bold text-mn-muted-foreground">
            {project.index}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold leading-none">
          {t(`projects.${project.index}.title`)}
        </h3>
        <p className="text-xs leading-relaxed text-mn-muted-foreground">
          {t(`projects.${project.index}.description`)}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.stack.split(" / ").map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md border border-mn-border px-1.5 py-0.5 text-[0.625rem] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-mn-primary px-2.5 py-1 text-[0.625rem] font-semibold text-mn-primary-foreground"
            >
              <Globe size={12} aria-hidden="true" />
              {t("resume.projectWebsite")}
            </a>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-mn-primary px-2.5 py-1 text-[0.625rem] font-semibold text-mn-primary-foreground"
            >
              <Github size={12} aria-hidden="true" />
              {t("resume.projectSource")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

MinimalProjectCard.displayName = "MinimalProjectCard";

interface MinimalProjectsProps {
  delay?: number;
}

export default function MinimalProjects({ delay = 0 }: MinimalProjectsProps) {
  const { t } = useTranslation();

  return (
    <section id="projects">
      <BlurFade inView delay={delay}>
        <div className="text-center">
          <div className="inline-block rounded-lg bg-mn-primary px-3 py-1 text-sm text-mn-primary-foreground">
            {t("resume.projectsChip")}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("resume.projectsTitle")}
          </h2>
          <p className="mt-3 text-sm text-mn-muted-foreground sm:text-base">
            {t("resume.projectsSubtitle")}
          </p>
        </div>
      </BlurFade>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project, i) => (
          <BlurFade key={project.index} className="h-full" inView delay={delay + 0.02 * i}>
            <MinimalProjectCard project={project} />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
