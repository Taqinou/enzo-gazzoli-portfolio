"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { options, TJM } from "@/data/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink p-6 md:p-20 font-sans">
      <nav className="fixed top-6 left-6 md:top-10 md:left-10 z-50 mix-blend-difference text-white">
        <Link
          href="/services"
          className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Services</span>
        </Link>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto pt-20"
      >
        <header className="mb-20 border-b border-ink/10 pb-10">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Transparence Tarifaire</h1>
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
          <h2 className="font-mono text-xs uppercase tracking-widest mb-8 opacity-40">01. Mon approche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink/30 mb-3">Taux journalier</p>
              <p className="font-serif text-6xl md:text-7xl leading-none mb-4">
                {TJM} <span className="text-3xl opacity-50">€/j</span>
              </p>
              <p className="font-mono text-xs text-ink/40 uppercase tracking-wider">HT — Freelance</p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="font-serif italic text-xl md:text-2xl text-ink/70 leading-snug">
                &ldquo;Chaque projet est unique.&rdquo;
              </p>
              <p className="font-mono text-xs text-ink/40 leading-relaxed">
                Je ne vends pas de forfaits au kilo. Le simulateur ci-dessous vous donne un ordre de grandeur — la vraie estimation se fait après un échange sur vos objectifs, vos contraintes et votre calendrier.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors duration-300 group mt-2"
              >
                <span>Simuler mon projet</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="font-mono text-xs uppercase tracking-widest mb-8 opacity-40">02. Options disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {options.map((opt) => (
              <div key={opt.id} className="flex justify-between items-baseline border-b border-ink/5 py-3">
                <div>
                  <span className="block font-serif text-lg">{opt.name}</span>
                  <span className="font-mono text-[10px] uppercase text-ink/30 tracking-wider">{opt.category}</span>
                </div>
                <span className="font-mono font-bold text-blue">{opt.price.toLocaleString("fr-FR")} €</span>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase text-ink/25 tracking-wider">
            Ces options s&apos;ajoutent à la base calculée selon le TJM et la durée estimée du projet.
          </p>
        </section>

        <footer className="border-t border-ink/10 pt-10 font-mono text-xs text-ink/40 flex justify-between">
          <p>© 2026 ENZO GAZZOLI</p>
        </footer>
      </motion.div>
    </div>
  );
}
