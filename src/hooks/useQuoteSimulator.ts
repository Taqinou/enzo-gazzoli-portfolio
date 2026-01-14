"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ProjectType,
  projects,
  options,
  calculateTotal,
  getIncludedOptions,
} from "@/data/pricing";

export interface QuoteState {
  projectType: ProjectType | null;
  subTypeId: string;
  selectedOptions: Set<string>;
}

export interface QuoteSimulatorReturn {
  state: QuoteState;
  total: number;
  includedOptions: Set<string>;
  setProjectType: (type: ProjectType | null) => void;
  toggleProjectType: (type: ProjectType) => void;
  setSubType: (id: string) => void;
  toggleOption: (id: string) => void;
  isOptionSelected: (id: string) => boolean;
  isOptionIncluded: (id: string) => boolean;
  getSubTypes: () => typeof projects.website.subtypes;
  getCurrentSubType: () => typeof projects.website.subtypes[0] | null;
  reset: () => void;
  generateSummary: (locale: "fr" | "en") => string;
}

function getInitialState(): QuoteState {
  return {
    projectType: null,
    subTypeId: "",
    selectedOptions: new Set<string>(),
  };
}

export function useQuoteSimulator(): QuoteSimulatorReturn {
  const [state, setState] = useState<QuoteState>(getInitialState);

  const includedOptions = useMemo(() => {
    if (!state.projectType) return new Set<string>();
    return getIncludedOptions(state.projectType, state.subTypeId);
  }, [state.projectType, state.subTypeId]);

  const total = useMemo(() => {
    if (!state.projectType) return 0;
    return calculateTotal(state.projectType, state.subTypeId, state.selectedOptions);
  }, [state.projectType, state.subTypeId, state.selectedOptions]);

  const setProjectType = useCallback((type: ProjectType | null) => {
    if (type === null) {
      setState(getInitialState());
      return;
    }
    setState(() => {
      const newSubTypeId = projects[type].subtypes[0].id;
      return {
        projectType: type,
        subTypeId: newSubTypeId,
        selectedOptions: new Set<string>(),
      };
    });
  }, []);

  const toggleProjectType = useCallback((type: ProjectType) => {
    setState((prev) => {
      if (prev.projectType === type) {
        return getInitialState();
      }
      const newSubTypeId = projects[type].subtypes[0].id;
      return {
        projectType: type,
        subTypeId: newSubTypeId,
        selectedOptions: new Set<string>(),
      };
    });
  }, []);

  const setSubType = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subTypeId: id,
      selectedOptions: new Set<string>(),
    }));
  }, []);

  const toggleOption = useCallback((id: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedOptions);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...prev, selectedOptions: newSelected };
    });
  }, []);

  const isOptionSelected = useCallback(
    (id: string) => state.selectedOptions.has(id) || includedOptions.has(id),
    [state.selectedOptions, includedOptions]
  );

  const isOptionIncluded = useCallback(
    (id: string) => includedOptions.has(id),
    [includedOptions]
  );

  const getSubTypes = useCallback(() => {
    if (!state.projectType) return projects.website.subtypes;
    return projects[state.projectType].subtypes;
  }, [state.projectType]);

  const getCurrentSubType = useCallback(() => {
    if (!state.projectType) return null;
    const subtypes = projects[state.projectType].subtypes;
    return subtypes.find((s) => s.id === state.subTypeId) || subtypes[0];
  }, [state.projectType, state.subTypeId]);

  const reset = useCallback(() => {
    setState(getInitialState());
  }, []);

  const generateSummary = useCallback(
    (locale: "fr" | "en"): string => {
      if (!state.projectType) return "";
      
      const subType = getCurrentSubType();
      if (!subType) return "";
      
      const isFr = locale === "fr";

      const projectLabel = isFr
        ? state.projectType === "website"
          ? "Site Web"
          : state.projectType === "application"
          ? "Application"
          : "Sur Mesure"
        : state.projectType === "website"
        ? "Website"
        : state.projectType === "application"
        ? "Application"
        : "Custom";

      const subTypeLabel = isFr ? subType.name : subType.nameEn;
      const duration = isFr ? subType.duration : subType.durationEn;

      const selectedOptionsList = options
        .filter(
          (opt) =>
            state.selectedOptions.has(opt.id) && !includedOptions.has(opt.id)
        )
        .map((opt) => `${isFr ? opt.name : opt.nameEn} (+${opt.price}€)`);

      const includedOptionsList = options
        .filter((opt) => includedOptions.has(opt.id))
        .map((opt) => (isFr ? opt.name : opt.nameEn));

      let summary = isFr
        ? `=== SIMULATION DE DEVIS ===\n\n`
        : `=== QUOTE SIMULATION ===\n\n`;

      summary += isFr
        ? `Type de projet: ${projectLabel}\n`
        : `Project type: ${projectLabel}\n`;

      summary += isFr
        ? `Formule: ${subTypeLabel}\n`
        : `Package: ${subTypeLabel}\n`;

      summary += isFr
        ? `Durée estimée: ${duration}\n\n`
        : `Estimated duration: ${duration}\n\n`;

      if (includedOptionsList.length > 0) {
        summary += isFr
          ? `Inclus dans la formule:\n${includedOptionsList.map((o) => `  ✓ ${o}`).join("\n")}\n\n`
          : `Included in package:\n${includedOptionsList.map((o) => `  ✓ ${o}`).join("\n")}\n\n`;
      }

      if (selectedOptionsList.length > 0) {
        summary += isFr
          ? `Options supplémentaires:\n${selectedOptionsList.map((o) => `  + ${o}`).join("\n")}\n\n`
          : `Additional options:\n${selectedOptionsList.map((o) => `  + ${o}`).join("\n")}\n\n`;
      }

      summary += isFr
        ? `ESTIMATION: à partir de ${total.toLocaleString("fr-FR")} €`
        : `ESTIMATE: from ${total.toLocaleString("en-US")} €`;

      return summary;
    },
    [state, includedOptions, total, getCurrentSubType]
  );

  return {
    state,
    total,
    includedOptions,
    setProjectType,
    toggleProjectType,
    setSubType,
    toggleOption,
    isOptionSelected,
    isOptionIncluded,
    getSubTypes,
    getCurrentSubType,
    reset,
    generateSummary,
  };
}
