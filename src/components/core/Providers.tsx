"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SoundProvider } from "@/contexts/SoundContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SoundProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SoundProvider>
  );
}
