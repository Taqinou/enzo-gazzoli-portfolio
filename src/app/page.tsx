"use client";

import { Suspense } from "react";
import BackgroundName from "@/components/ui/BackgroundName";
import IntroOverlay from "@/components/overlays/IntroOverlay";
import TopRibbon from "@/components/layout/TopRibbon";
import IdentityCircle from "@/components/ui/IdentityCircle";
import EllipsePanel from "@/components/overlays/EllipsePanel";
import HeroSection from "@/components/sections/HeroSection";
import ProjectSection from "@/components/sections/ProjectSection";
import LinksTrigger from "@/components/ui/LinksTrigger";
import LinksOverlay from "@/components/overlays/LinksOverlay";
import StackPanel from "@/components/overlays/StackPanel";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { projects } from "@/data/projects";
import { useHomeState } from "@/hooks/useHomeState";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-blue" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { state, actions, refs } = useHomeState();

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
