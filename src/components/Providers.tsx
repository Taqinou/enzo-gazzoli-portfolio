"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
