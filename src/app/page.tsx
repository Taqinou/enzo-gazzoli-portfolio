"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BackgroundName from "@/components/BackgroundName";
import IntroOverlay from "@/components/IntroOverlay";
import TopRibbon from "@/components/TopRibbon";
import IdentityCircle from "@/components/IdentityCircle";
import EllipsePanel from "@/components/EllipsePanel";
import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import LinksTrigger from "@/components/LinksTrigger";
import LinksOverlay from "@/components/LinksOverlay";
import StackPanel from "@/components/StackPanel";
import ScrollProgress from "@/components/ScrollProgress";
import { projects } from "@/data/projects";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-blue" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const skipIntroParam = searchParams.get("skipIntro") === "true";
  const { t } = useTranslation();

  // State
  const [introComplete, setIntroComplete] = useState(skipIntroParam);
  const [ellipsePanelOpen, setEllipsePanelOpen] = useState(false);
  const [linksOverlayOpen, setLinksOverlayOpen] = useState(false);
  const [stackPanelOpen, setStackPanelOpen] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isProjectActive, setIsProjectActive] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [currentProject, setCurrentProject] = useState(t("nav.homeWelcome"));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeSections, setActiveSections] = useState<Set<number>>(new Set([0]));

  // Refs
  const mainPageRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLElement | null)[]>([]);
  const lastScrollTop = useRef(0);
  const velocityTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollThrottleRef = useRef(false);

  const { playClick, playScrollTick } = useSound();
  const playClickRef = useRef(playClick);
  const playScrollTickRef = useRef(playScrollTick);

  // Keep playClick and playScrollTick refs updated
  useEffect(() => {
    playClickRef.current = playClick;
    playScrollTickRef.current = playScrollTick;
  }, [playClick, playScrollTick]);

  // Scroll handling with throttle
  const handleScroll = useCallback(() => {
    if (!mainPageRef.current || scrollThrottleRef.current) return;

    scrollThrottleRef.current = true;
    requestAnimationFrame(() => {
      if (!mainPageRef.current) return;

      const scrollTop = mainPageRef.current.scrollTop;
      const scrollHeight = mainPageRef.current.scrollHeight - mainPageRef.current.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      // Calculate velocity
      const velocity = Math.abs(scrollTop - lastScrollTop.current);
      lastScrollTop.current = scrollTop;
      setScrollVelocity(velocity);

      // Reset velocity after stop
      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
      velocityTimeout.current = setTimeout(() => setScrollVelocity(0), 100);

      setScrollProgress(progress);
      scrollThrottleRef.current = false;
    });
  }, []);

  // Intersection observer for sections
  const activeSectionRef = useRef(0);

  useEffect(() => {
    if (!introComplete) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let needsActiveUpdate = false;
        const newActiveSections = new Set(activeSections);

        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");

          if (entry.isIntersecting) {
            newActiveSections.add(index);
            needsActiveUpdate = true;

            // Only update active project if this is the most prominent section
            // Threshold is 0.5, so only one should be intersecting at > 0.5 usually
            if (index !== activeSectionRef.current) {
              activeSectionRef.current = index;

              if (index === 0) {
                setIsHero(true);
                setCurrentProject(t("nav.index"));
                setActiveProjectIndex(0);
              } else {
                setIsHero(false);
                const project = projects[index - 1];
                if (project) {
                  setCurrentProject(project.title.toLowerCase());
                  setActiveProjectIndex(index);
                }
              }
              playScrollTickRef.current?.(); // Changed from playClickRef.current?.();
            }
          } else {
            if (newActiveSections.has(index)) {
              newActiveSections.delete(index);
              needsActiveUpdate = true;
            }
          }
        });

        if (needsActiveUpdate) {
          setActiveSections(newActiveSections);
        }
      },
      { threshold: 0.5 }
    );

    // Observe hero section
    const heroSection = mainPageRef.current?.querySelector("[data-index='0']");
    if (heroSection) observer.observe(heroSection);

    // Observe project sections
    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [introComplete]);

  // Scroll to project
  const scrollToProject = (index: number) => {
    const target = projectRefs.current[index - 1];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle handlers
  const handleIdentityClick = () => {
    if (isProjectActive) {
      setIsProjectActive(false);
      document.body.classList.remove("project-active");
      // Re-enable scrolling
      if (mainPageRef.current) {
        mainPageRef.current.style.overflowY = "scroll";
      }
    } else {
      setEllipsePanelOpen(!ellipsePanelOpen);
    }
  };

  const handleStackToggle = () => {
    setStackPanelOpen(!stackPanelOpen);
    if (!stackPanelOpen) {
      setEllipsePanelOpen(false);
    }
  };

  const handleLinksToggle = () => {
    setLinksOverlayOpen(!linksOverlayOpen);
    if (!linksOverlayOpen) {
      setEllipsePanelOpen(false);
    }
  };

  const handleProjectToggle = (isOpen: boolean) => {
    setIsProjectActive(isOpen);
    if (mainPageRef.current) {
      mainPageRef.current.style.overflowY = isOpen ? "hidden" : "scroll";
    }
    // Toggle body class for custom cursor
    if (isOpen) {
      document.body.classList.add("project-active");
    } else {
      document.body.classList.remove("project-active");
    }
  };

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEllipsePanelOpen(false);
        setLinksOverlayOpen(false);
        setStackPanelOpen(false);
        if (isProjectActive) {
          setIsProjectActive(false);
          document.body.classList.remove("project-active");
          if (mainPageRef.current) {
            mainPageRef.current.style.overflowY = "scroll";
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isProjectActive]);

  // Cleanup body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("project-active");
    };
  }, []);

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
