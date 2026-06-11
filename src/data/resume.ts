export interface ResumeExperience {
  id: string;
  titleKey: string;
  subtitleKey: string;
  periodKey: string;
  descriptionKey: string;
}

export interface ResumeEducation {
  id: string;
  degreeKey: string;
  school: string;
  periodKey: string;
}

export const RESUME_EXPERIENCES: ResumeExperience[] = [
  {
    id: "freelance",
    titleKey: "resume.experience.freelance.title",
    subtitleKey: "resume.experience.freelance.subtitle",
    periodKey: "resume.experience.freelance.period",
    descriptionKey: "resume.experience.freelance.description",
  },
  {
    id: "internship",
    titleKey: "resume.experience.internship.title",
    subtitleKey: "resume.experience.internship.subtitle",
    periodKey: "resume.experience.internship.period",
    descriptionKey: "resume.experience.internship.description",
  },
];

export const RESUME_EDUCATION: ResumeEducation[] = [
  {
    id: "licence",
    degreeKey: "resume.education.licence.degree",
    school: "INU Champollion",
    periodKey: "resume.education.licence.period",
  },
  {
    id: "bac",
    degreeKey: "resume.education.bac.degree",
    school: "Lycée Paul Sabatier",
    periodKey: "resume.education.bac.period",
  },
];

export const RESUME_SKILLS: string[] = [
  "Next.js",
  "React",
  "TypeScript",
  "Framer Motion",
  "Tailwind",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Redis",
  "MongoDB",
  "Shopify",
  "Docker",
  "Git",
];
