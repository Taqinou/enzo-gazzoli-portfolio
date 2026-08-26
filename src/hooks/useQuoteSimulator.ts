"use client";

import { useState, useCallback } from "react";
import { Formula, ProjectType, projects } from "@/data/pricing";

export interface QuoteState {
  projectType: ProjectType | null;
  formulaId: string;
}

export interface QuoteSimulatorReturn {
  state: QuoteState;
  setProjectType: (type: ProjectType | null) => void;
  toggleProjectType: (type: ProjectType) => void;
  setFormula: (id: string) => void;
  getFormulas: () => Formula[];
  getCurrentFormula: () => Formula | null;
  reset: () => void;
  generateSummary: (locale: "fr" | "en") => string;
}

function getInitialState(): QuoteState {
  return {
    projectType: null,
    formulaId: "",
  };
}

// Sélecteur d'offre de /services : mémorise l'offre ouverte et, pour les offres
// qui proposent plusieurs formules, celle qui est retenue. Les forfaits étant
// value-based et sans option facturée à l'unité, il n'y a plus de total à
// calculer : le prix affiché est celui de la formule ou le plancher de l'offre.
export function useQuoteSimulator(): QuoteSimulatorReturn {
  const [state, setState] = useState<QuoteState>(getInitialState);

  const setProjectType = useCallback((type: ProjectType | null) => {
    if (type === null) {
      setState(getInitialState());
      return;
    }
    setState({ projectType: type, formulaId: projects[type].formulas[0]?.id ?? "" });
  }, []);

  const toggleProjectType = useCallback((type: ProjectType) => {
    setState((prev) =>
      prev.projectType === type
        ? getInitialState()
        : { projectType: type, formulaId: projects[type].formulas[0]?.id ?? "" }
    );
  }, []);

  const setFormula = useCallback((id: string) => {
    setState((prev) => ({ ...prev, formulaId: id }));
  }, []);

  const getFormulas = useCallback((): Formula[] => {
    if (!state.projectType) return [];
    return projects[state.projectType].formulas;
  }, [state.projectType]);

  const getCurrentFormula = useCallback((): Formula | null => {
    if (!state.projectType) return null;
    const formulas = projects[state.projectType].formulas;
    return formulas.find((f) => f.id === state.formulaId) ?? formulas[0] ?? null;
  }, [state.projectType, state.formulaId]);

  const reset = useCallback(() => {
    setState(getInitialState());
  }, []);

  const generateSummary = useCallback(
    (locale: "fr" | "en"): string => {
      if (!state.projectType) return "";

      const isFr = locale === "fr";
      const project = projects[state.projectType];
      const formula = project.formulas.find((f) => f.id === state.formulaId) ?? project.formulas[0];
      const price = (formula?.price ?? project.fromPrice).toLocaleString(isFr ? "fr-FR" : "en-US");

      const lines = [
        isFr ? "=== DEMANDE DE DEVIS ===" : "=== QUOTE REQUEST ===",
        "",
        isFr ? `Offre : ${OFFER_LABELS[state.projectType][0]}` : `Offer: ${OFFER_LABELS[state.projectType][1]}`,
      ];

      if (formula) {
        lines.push(isFr ? `Formule : ${formula.name}` : `Package: ${formula.nameEn}`);
      }

      lines.push(
        "",
        isFr ? "Inclus dans le forfait :" : "Included in the package:",
        ...project.includes.map((item) => `  + ${isFr ? item.name : item.nameEn}`),
        "",
        isFr ? `À partir de ${price} € HT` : `From ${price} € excl. tax`
      );

      return lines.join("\n");
    },
    [state]
  );

  return {
    state,
    setProjectType,
    toggleProjectType,
    setFormula,
    getFormulas,
    getCurrentFormula,
    reset,
    generateSummary,
  };
}

// Libellés [FR, EN] employés hors composant React (pas d'accès à `t` ici).
const OFFER_LABELS: Record<ProjectType, [string, string]> = {
  website: ["Site vitrine et landing page", "Website and landing page"],
  application: ["Application métier", "Business application"],
  shopify: ["Boutique en ligne", "Online store"],
  ai: ["IA sur une application existante", "AI on an existing application"],
};
