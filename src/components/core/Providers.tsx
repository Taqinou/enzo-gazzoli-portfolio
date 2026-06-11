"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SoundProvider } from "@/contexts/SoundContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SoundProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
