"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ProjectType, projects } from "@/data/pricing";
import { useSound } from "@/hooks/useSound";

interface ProjectTypeCardProps {
  type: ProjectType;
  isSelected: boolean;
  onSelect: (type: ProjectType) => void;
  label: string;
}

const ProjectTypeCard = memo(function ProjectTypeCard({
  type,
  isSelected,
  onSelect,
  label,
}: ProjectTypeCardProps) {
  const { playClick } = useSound();
  const project = projects[type];

  const handleClick = () => {
    playClick();
    onSelect(type);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative flex flex-col items-center justify-center gap-3 p-6 md:p-8
        border transition-colors duration-300
        ${isSelected
          ? "border-blue bg-blue/5 text-blue"
          : "border-ink/20 bg-transparent text-ink hover:border-ink/40"
        }
      `}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isSelected}
    >
      <span className="text-3xl md:text-4xl">{project.icon}</span>
      <span className="font-mono text-xs md:text-sm uppercase tracking-wider font-bold">
        {label}
      </span>
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-blue pointer-events-none"
          layoutId="selectedProject"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </motion.button>
  );
});

ProjectTypeCard.displayName = "ProjectTypeCard";

export default ProjectTypeCard;
