"use client";

import { useRef, useCallback } from "react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { CVContent } from "@/components/sections/CVContent";

export default function CVPage() {
  const router = useRouter();
  const { playExit, playPdfSave } = useSound();
  const { t } = useTranslation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/");
    }, 80);
  };

  const handleDownload = async () => {
    playPdfSave();
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const element = document.getElementById("cv-print-template");
    if (!element) return;

    // Use a higher scale for printing quality
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#f7f6f5",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Safety: if the rendered template still slightly exceeds A4 height, scale it down to fit
    if (imgHeight > pdfHeight) {
      const scale = pdfHeight / imgHeight;
      pdf.addImage(imgData, "JPEG", (pdfWidth - pdfWidth * scale) / 2, 0, pdfWidth * scale, pdfHeight);
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
    }

    pdf.save("enzo-gazzoli-cv.pdf");
  };

  return (
    <div className="min-h-screen bg-bg text-ink overflow-x-hidden p-0 m-0">
      {/* --- HIDDEN PRINT TEMPLATE --- */}
      <div className="absolute left-[-9999px] top-0">
        <CVContent variant="print" />
      </div>

      {/* --- WEB NAV --- */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline gap-4 px-6 md:px-10 py-6 md:py-8 z-[100] mix-blend-difference pointer-events-none">
        <a
          href="/"
          onClick={handleBack}
          className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors"
        >
          {t("cv.index")}
        </a>
        <button
          onClick={handleDownload}
          className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors text-right"
        >
          {t("cv.saveAsPdf")}
        </button>
      </nav>

      {/* --- WEB MAIN CONTENT --- */}
      <CVContent variant="web" />

      {/* --- TEXTURE --- */}
    </div >
  );
}
