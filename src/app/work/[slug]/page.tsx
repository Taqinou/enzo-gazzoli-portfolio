import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyContent from "@/components/studio/CaseStudyContent";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import fr from "@/data/translations/fr.json";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

// La metadata est servie en FR (cohérent avec l'OG locale fr_FR du layout) ;
// le contenu de la page suit ensuite la locale du visiteur côté client.
export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};

  const content = fr.caseStudies[slug as keyof typeof fr.caseStudies];
  const hasContent =
    typeof content === "object" && "title" in content;
  const title = hasContent ? `${content.title} — enzo gazzoli.` : slug;
  const description = hasContent ? content.metaDescription : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://enzo-gazzoli.com/work/${slug}`,
      type: "article",
      ...(caseStudy.imageUrl && { images: [{ url: caseStudy.imageUrl }] }),
    },
    alternates: {
      canonical: `/work/${slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyContent slug={slug} />;
}
