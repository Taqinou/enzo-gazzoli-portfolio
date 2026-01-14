"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink p-6 md:p-20 font-sans">
      <nav className="fixed top-6 left-6 md:top-10 md:left-10 z-50 mix-blend-difference text-white">
        <Link 
          href="/services" 
          className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto pt-20"
      >
        <header className="mb-20 border-b border-ink/10 pb-10">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Grille Tarifaire</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 font-mono text-sm opacity-60">
            <div>
              <p>DATE: JAN 2026</p>
            </div>
            <div className="md:text-right">
              <p>ENZO GAZZOLI</p>
              <p>FULLSTACK CREATIVE DEV</p>
            </div>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest mb-8 opacity-40">01. Formules & Projets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/10 font-mono text-xs uppercase opacity-40">
                  <th className="py-4 font-normal">Service</th>
                  <th className="py-4 font-normal">Délai Commercial</th>
                  <th className="py-4 font-normal text-right">Prix (HT)</th>
                </tr>
              </thead>
              <tbody className="font-serif text-lg md:text-xl">
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Landing Page</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Website</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">1-2 semaines</td>
                  <td className="py-6 text-right font-bold">1 750 €</td>
                </tr>
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Portfolio Créatif</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Website</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">2-3 semaines</td>
                  <td className="py-6 text-right font-bold">3 000 €</td>
                </tr>
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Site Vitrine</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Website</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">3-4 semaines</td>
                  <td className="py-6 text-right font-bold">4 250 €</td>
                </tr>

                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">MVP</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Application</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">4-6 semaines</td>
                  <td className="py-6 text-right font-bold">6 250 €</td>
                </tr>
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Dashboard Métier</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Application</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">6-8 semaines</td>
                  <td className="py-6 text-right font-bold">8 750 €</td>
                </tr>
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">SaaS Complet</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Application</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">8-12 semaines</td>
                  <td className="py-6 text-right font-bold">12 500 €</td>
                </tr>

                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Boutique Headless</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Shopify</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">5-7 semaines</td>
                  <td className="py-6 text-right font-bold">7 500 €</td>
                </tr>

                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Audit Technique</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Consulting</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">3-5 jours</td>
                  <td className="py-6 text-right font-bold">1 200 €</td>
                </tr>
                <tr className="border-b border-ink/5 group hover:bg-ink/[0.02] transition-colors">
                  <td className="py-6 pr-4">
                    <span className="block">Journée Dev</span>
                    <span className="font-mono text-xs text-ink/40 uppercase tracking-wide">Régie</span>
                  </td>
                  <td className="py-6 pr-4 font-mono text-sm opacity-60">1 jour</td>
                  <td className="py-6 text-right font-bold">300 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest mb-8 opacity-40">02. Options (+20%)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { cat: "Technique", name: "Authentification", price: "300 €" },
              { cat: "Technique", name: "CMS (Strapi/Sanity)", price: "300 €" },
              { cat: "Technique", name: "Paiement Stripe", price: "250 €" },
              { cat: "Technique", name: "Emails Transac.", price: "200 €" },
              { cat: "Technique", name: "Multilingue", price: "150 €" },
              { cat: "Technique", name: "Formulaire Avancé", price: "100 €" },
              { cat: "Marketing", name: "SEO Technique", price: "150 €" },
              { cat: "Marketing", name: "Newsletter", price: "150 €" },
              { cat: "Marketing", name: "Analytics", price: "75 €" },
              { cat: "Design", name: "Animations Avancées", price: "200 €" },
              { cat: "Design", name: "Dark Mode", price: "150 €" },
              { cat: "Support", name: "Maintenance (3 mois)", price: "600 €" },
            ].map((opt) => (
              <div key={opt.name} className="flex justify-between items-baseline border-b border-ink/5 py-3">
                <div>
                  <span className="block font-serif text-lg">{opt.name}</span>
                  <span className="font-mono text-[10px] uppercase text-ink/30 tracking-wider">{opt.cat}</span>
                </div>
                <span className="font-mono font-bold text-blue">{opt.price}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-ink/10 pt-10 font-mono text-xs text-ink/40 flex justify-between">
          <p>© 2026 ENZO GAZZOLI</p>
        </footer>
      </motion.div>
    </div>
  );
}
