"use client";

import { useState, useCallback } from "react";
import { ProjectType } from "@/data/pricing";

export interface QuoteState {
  /** Offre dont le volet est ouvert. */
  projectType: ProjectType | null;
  /** Formule retenue dans ce volet ("" si l'offre n'en propose pas). */
  formulaId: string;
}

export interface QuoteSimulatorReturn {
  state: QuoteState;
  toggleProjectType: (type: ProjectType) => void;
  setFormula: (id: string) => void;
}

function getInitialState(): QuoteState {
  return {
    projectType: null,
    formulaId: "",
  };
}

// Sélecteur d'offre de /services. Les forfaits sont value-based et sans option
// facturée à l'unité : il n'y a plus de total à calculer, le prix affiché est
// celui de la formule ou le plancher de l'offre. Ce hook ne retient donc que
// l'offre ouverte et la formule retenue, qui alimentent le message de contact.
export function useQuoteSimulator(): QuoteSimulatorReturn {
  const [state, setState] = useState<QuoteState>(getInitialState);

  // Aucune formule n'est présélectionnée à l'ouverture : le liseré bleu ne doit
  // signaler qu'un choix réel du visiteur.
  const toggleProjectType = useCallback((type: ProjectType) => {
    setState((prev) =>
      prev.projectType === type ? getInitialState() : { projectType: type, formulaId: "" }
    );
  }, []);

  const setFormula = useCallback((id: string) => {
    setState((prev) => ({ ...prev, formulaId: id }));
  }, []);

  return { state, toggleProjectType, setFormula };
}
