"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OfferSection from "@/components/studio/OfferSection";
import OfferSommaire from "@/components/studio/offer/OfferSommaire";
import OfferViseur from "@/components/studio/offer/OfferViseur";
import OfferDescente from "@/components/studio/offer/OfferDescente";

// Aiguillage de recette : `/?offer=a|b|c` affiche une des trois refontes de
// la section offre dans la vraie page (hero au-dessus, travaux en dessous).
// Sans paramètre : la section actuelle. À retirer une fois la direction
// choisie — la page reste statique (lecture côté client, sous Suspense).
function Pick() {
  const params = useSearchParams();
  const v = params.get("offer");
  if (v === "a") return <OfferSommaire />;
  if (v === "b") return <OfferViseur />;
  if (v === "c") return <OfferDescente />;
  return <OfferSection />;
}

export default function OfferSwitch() {
  return (
    <Suspense fallback={<OfferSection />}>
      <Pick />
    </Suspense>
  );
}
