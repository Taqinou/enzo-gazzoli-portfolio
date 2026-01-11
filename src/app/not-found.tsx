"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSound } from "@/hooks/useSound";

export default function NotFound() {
  const router = useRouter();
  const { t } = useTranslation();
  const { playClick } = useSound();
  
  // Custom cursor for this page
  useEffect(() => {
    document.body.classList.add("cursor-question");
    return () => {
      document.body.classList.remove("cursor-question");
    };
  }, []);

  const handleClick = () => {
    playClick();
    router.push("/?skipIntro=true");
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-blue flex items-center justify-center cursor-question select-none"
      onClick={handleClick}
    >
       <div className="text-center">
        <h1 className="font-mono text-white text-[15px] font-bold tracking-widest">
          {t("notFound.label")}
        </h1>
      </div>
    </div>
  );
}
