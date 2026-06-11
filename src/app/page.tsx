"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import BackgroundName from "@/components/ui/BackgroundName";
import IntroOverlay from "@/components/overlays/IntroOverlay";
import TopRibbon from "@/components/layout/TopRibbon";
import IdentityCircle from "@/components/ui/IdentityCircle";
import HeroSection from "@/components/sections/HeroSection";
import ProjectSection from "@/components/sections/ProjectSection";
import LinksTrigger from "@/components/ui/LinksTrigger";
import ScrollProgress from "@/components/ui/ScrollProgress";
import MinimalHome from "@/components/minimal/MinimalHome";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useHomeState } from "@/hooks/useHomeState";
import { useTheme } from "@/hooks/useTheme";
import { projects } from "@/data/projects";

// Lazy load overlays for better initial load performance
const EllipsePanel = dynamic(() => import("@/components/overlays/EllipsePanel"), { ssr: false });
const LinksOverlay = dynamic(() => import("@/components/overlays/LinksOverlay"), { ssr: false });
const StackPanel = dynamic(() => import("@/components/overlays/StackPanel"), { ssr: false });

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { theme } = useTheme();
  const [introPlayed, setIntroPlayed] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {theme === "minimal" ? (
          <motion.div
            key="minimal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <MinimalHome />
          </motion.div>
        ) : (
          <motion.div
            key="default"
            data-theme-root="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <Suspense fallback={<div className="h-screen bg-blue" />}>
              <DefaultHome
                initialIntroComplete={introPlayed}
                onIntroComplete={() => setIntroPlayed(true)}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      <ThemeToggle visible={theme === "minimal" || introPlayed} />
    </>
  );
}

interface DefaultHomeProps {
  initialIntroComplete: boolean;
  onIntroComplete: () => void;
}

function DefaultHome({ initialIntroComplete, onIntroComplete }: DefaultHomeProps) {
  const { state, actions, refs } = useHomeState({ initialIntroComplete });

  const {
    introComplete,
    ellipsePanelOpen,
    linksOverlayOpen,
    stackPanelOpen,
    activeProjectIndex,
    isProjectActive,
    isHero,
    currentProject,
    scrollProgress,
    scrollVelocity,
    activeSections,
  } = state;

  const {
    setIntroComplete,
    setEllipsePanelOpen,
    setLinksOverlayOpen,
    setStackPanelOpen,
    scrollToProject,
    handleIdentityClick,
    handleStackToggle,
    handleLinksToggle,
    handleProjectToggle,
    handleScroll,
  } = actions;

  const { mainPageRef, projectRefs } = refs;

  // Remonte l'info "intro jouée" (couvre aussi ?skipIntro=true)
  useEffect(() => {
    if (introComplete) onIntroComplete();
  }, [introComplete, onIntroComplete]);

  return (
    <>
      {/* Intro Animation */}
      {!introComplete && (
        <IntroOverlay onComplete={() => setIntroComplete(true)} />
      )}

      {/* Background Name */}
      <BackgroundName />

      {/* Top Ribbon */}
      <TopRibbon
        isVisible={introComplete}
        currentProject={currentProject}
        isProjectActive={isProjectActive}
      />

      {/* Main Scrollable Page */}
      <div
        ref={mainPageRef}
        className={`h-screen overflow-y-scroll scroll-snap-container
                   ${introComplete ? "pointer-events-auto" : "pointer-events-none"}
                   ${linksOverlayOpen ? "invisible" : "visible"}`}
        onScroll={handleScroll}
      >
        <div className="w-full relative">
          {/* Hero Section */}
          <div data-index="0">
            <HeroSection
              isActive={activeSections.has(0)}
              onScrollToProject={scrollToProject}
            />
          </div>

          {/* Project Sections */}
          {projects.map((project, i) => (
            <ProjectSection
              key={project.index}
              ref={(el) => {
                projectRefs.current[i] = el;
                if (el) el.setAttribute("data-index", String(i + 1));
              }}
              project={project}
              isActive={activeSections.has(i + 1)}
              isProjectActive={isProjectActive}
              onToggle={handleProjectToggle}
            />
          ))}
        </div>
      </div>

      {/* Identity Circle */}
      <IdentityCircle
        onClick={handleIdentityClick}
        isProjectActive={isProjectActive}
        isHero={isHero}
        scrollVelocity={scrollVelocity}
        showExit={isProjectActive}
      />

      {/* Ellipse Panel (Bio) */}
      <EllipsePanel isOpen={ellipsePanelOpen} onClose={() => setEllipsePanelOpen(false)} />

      {/* Unified Trigger (STACK if project is open, OU? otherwise) */}
      <LinksTrigger
        isOpen={isProjectActive ? stackPanelOpen : linksOverlayOpen}
        onClick={() => {
          if (isProjectActive) {
            handleStackToggle();
          } else {
            handleLinksToggle();
          }
        }}
        isProjectActive={isProjectActive}
        isHero={isHero}
      />

      {/* Stack Panel */}
      <StackPanel
        isOpen={stackPanelOpen}
        onClose={() => setStackPanelOpen(false)}
        stack={activeProjectIndex > 0 ? projects[activeProjectIndex - 1].stack : ""}
      />

      {/* Links Overlay */}
      <LinksOverlay isOpen={linksOverlayOpen} onClose={() => setLinksOverlayOpen(false)} />

      {/* Scroll Progress */}
      <ScrollProgress
        progress={scrollProgress}
        isVisible={introComplete}
        isHero={isHero}
        isProjectActive={isProjectActive}
      />
    </>
  );
}
