"use client";

import { useState, useEffect, forwardRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import type { Project } from "@/data/projects";

interface ProjectSectionProps {
  project: Project;
  isActive: boolean;
  isProjectActive: boolean;
  onToggle: (isOpen: boolean) => void;
}

const ProjectSection = memo(
  forwardRef<HTMLElement, ProjectSectionProps>(
    ({ project, isActive, isProjectActive, onToggle }, ref) => {
      const [isOpen, setIsOpen] = useState(false);
      const { playMechanicalClack, playExit } = useSound();
      const { t } = useTranslation();

      // Get translated content for this project
      const projectTitle = t(`projects.${project.index}.title`);
      const projectDescription = t(`projects.${project.index}.description`);
      const linkText = project.linkText === "visiter" || project.linkText === "visit" 
        ? t("projects.visit") 
        : t("projects.github");

      // Sync local state with parent when closed externally (e.g., via IdentityCircle)
      useEffect(() => {
        if (!isProjectActive && isOpen) {
          setIsOpen(false);
        }
      }, [isProjectActive, isOpen]);

      const toggleProject = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onToggle(newState);

        if (newState) {
          playMechanicalClack(120, 0.5);
        } else {
          playExit();
        }
      };

      return (
        <section
          ref={ref}
          className={`h-screen w-full snap-section flex flex-col items-center justify-center
                     relative border-b border-black/5 overflow-hidden
                     transition-colors duration-[600ms] ease-out-expo
                     ${isProjectActive ? "bg-blue" : "bg-bg"}`}
        >
          {/* Background Number */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       font-mono text-[clamp(4rem,25vw,30rem)] opacity-[0.015] pointer-events-none z-[1]
                       ${isProjectActive ? "text-white" : "text-ink"}`}
            style={{ lineHeight: 1 }}
          >
            {project.index}
          </div>

          {/* Project Content */}
          <div
            className="flex items-center justify-center w-full h-full px-4 md:px-[10vw]
                      relative"
          >
            {/* Project Title - Closed State */}
            <AnimatePresence mode="wait">
              {!isOpen && (
                <motion.button
                  className={`font-serif text-[11vw] md:text-[14vw] lowercase text-center cursor-pointer z-10 mx-auto
                             leading-085 tracking-[-0.05em] bg-transparent border-none appearance-none p-0
                             ${isProjectActive ? "text-white" : "text-ink"}
                             hover:text-blue`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: isActive ? 0 : "110%", opacity: isActive ? 1 : 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  onClick={toggleProject}
                  aria-label={`Open project ${projectTitle}`}
                >
                  {projectTitle}.
                </motion.button>
              )}
            </AnimatePresence>

            {/* Open Project Overlay */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-blue px-4 md:px-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Background Title */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
                    <h3 className="font-serif text-[clamp(4rem,25vw,45rem)] md:text-[clamp(8rem,28vw,45rem)] leading-none text-white lowercase whitespace-nowrap">
                      {projectTitle}.
                    </h3>
                  </div>

                  {/* Content */}
                  <motion.div
                    className="z-10 text-center flex flex-col items-center relative px-2 md:px-0"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  >
                    {/* Description */}
                    <motion.div
                      className="text-[clamp(1.1rem,4.5vw,6rem)] md:text-[clamp(1.5rem,3.5vw,6rem)] font-mono font-extrabold uppercase
                               tracking-[-0.05em] leading-[0.95] md:leading-[0.9] text-white mb-6 md:mb-10 max-w-[95vw] md:max-w-[90vw] text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {projectDescription}
                    </motion.div>

                    {/* Link */}
                    <motion.div
                      className="flex gap-4 md:gap-8 mt-3 md:mt-5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <a
                        href={project.linkUrl}
                        className="font-serif text-lg md:text-xl lowercase border-b border-white
                                  pb-0.5 inline-block text-white hover:text-ink hover:border-ink transition-colors duration-200"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {linkText}
                      </a>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          className="font-serif text-lg md:text-xl lowercase border-b border-white
                                    pb-0.5 inline-block text-white hover:text-ink hover:border-ink transition-colors duration-200"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {t("projects.github")}
                        </a>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      );
    }
  )
);

ProjectSection.displayName = "ProjectSection";

export default ProjectSection;
