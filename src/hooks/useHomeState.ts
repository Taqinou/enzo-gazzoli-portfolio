import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useSound } from "@/hooks/useSound";
import { projects } from "@/data/projects";
import { ANIMATION } from "@/data/constants";

export function useHomeState() {
  const searchParams = useSearchParams();
  const skipIntroParam = searchParams.get("skipIntro") === "true";
  const { t } = useTranslation();
  const { playScrollTick } = useSound();

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
  const activeSectionRef = useRef(0);
  const playScrollTickRef = useRef(playScrollTick);

  // Keep playScrollTick ref updated
  useEffect(() => {
    playScrollTickRef.current = playScrollTick;
  }, [playScrollTick]);

  // Scroll handling with throttle
  const handleScroll = useCallback(() => {
    if (!mainPageRef.current || scrollThrottleRef.current) return;

    scrollThrottleRef.current = true;
    requestAnimationFrame(() => {
      if (!mainPageRef.current) return;

      const scrollTop = mainPageRef.current.scrollTop;
      const scrollHeight =
        mainPageRef.current.scrollHeight - mainPageRef.current.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      // Calculate velocity
      const velocity = Math.abs(scrollTop - lastScrollTop.current);
      lastScrollTop.current = scrollTop;
      setScrollVelocity(velocity);

      // Reset velocity after stop
      if (velocityTimeout.current) clearTimeout(velocityTimeout.current);
      velocityTimeout.current = setTimeout(() => setScrollVelocity(0), ANIMATION.velocityResetDelay);

      setScrollProgress(progress);
      scrollThrottleRef.current = false;
    });
  }, []);

  // Intersection observer for sections
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
              playScrollTickRef.current?.();
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
      { threshold: ANIMATION.intersectionThreshold }
    );

    // Observe hero section
    const heroSection = mainPageRef.current?.querySelector("[data-index='0']");
    if (heroSection) observer.observe(heroSection);

    // Observe project sections
    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [introComplete, activeSections, t]); // Added t dependency

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
      // Re-enable scrolling with iOS fix
      if (mainPageRef.current) {
        mainPageRef.current.style.scrollSnapType = "none";
        mainPageRef.current.style.overflowY = "";
        mainPageRef.current.style.touchAction = "";
        void mainPageRef.current.offsetHeight;
        requestAnimationFrame(() => {
          if (mainPageRef.current) {
            mainPageRef.current.style.scrollSnapType = "";
          }
        });
        scrollThrottleRef.current = false;
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
      if (isOpen) {
        mainPageRef.current.style.overflowY = "hidden";
        mainPageRef.current.style.touchAction = "none";
      } else {
        // Temporarily disable scroll-snap to fix iOS touch scroll bug
        mainPageRef.current.style.scrollSnapType = "none";
        mainPageRef.current.style.overflowY = "";
        mainPageRef.current.style.touchAction = "";

        // Force reflow
        void mainPageRef.current.offsetHeight;

        // Re-enable scroll-snap after a frame
        requestAnimationFrame(() => {
          if (mainPageRef.current) {
            mainPageRef.current.style.scrollSnapType = "";
          }
        });

        // Reset scroll throttle in case it was stuck
        scrollThrottleRef.current = false;
      }
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
            // iOS scroll fix
            mainPageRef.current.style.scrollSnapType = "none";
            mainPageRef.current.style.overflowY = "";
            mainPageRef.current.style.touchAction = "";
            void mainPageRef.current.offsetHeight;
            requestAnimationFrame(() => {
              if (mainPageRef.current) {
                mainPageRef.current.style.scrollSnapType = "";
              }
            });
            scrollThrottleRef.current = false;
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

  return {
    state: {
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
    },
    actions: {
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
    },
    refs: {
      mainPageRef,
      projectRefs,
    },
  };
}
