"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { playClick } = useSound();

  useEffect(() => {
    console.error(error);
    document.body.classList.add("cursor-question");
    return () => {
      document.body.classList.remove("cursor-question");
    };
  }, [error]);

  const handleClick = () => {
    playClick();
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-blue flex items-center justify-center select-none"
      onClick={handleClick}
    >
      <div className="text-center">
        <h1 className="font-mono text-white text-[15px] font-bold tracking-widest">
          SOMETHING WENT WRONG — CLICK TO RETRY
        </h1>
      </div>
    </div>
  );
}
