"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

interface StackPanelProps {
    isOpen: boolean;
    onClose: () => void;
    stack: string;
}

export default function StackPanel({ isOpen, onClose, stack }: StackPanelProps) {
    const { playExit } = useSound();
    const { t } = useTranslation();

    const handleClose = () => {
        playExit();
        onClose();
    };

    const stackItems = stack ? stack.split(" / ") : [];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed top-0 right-0 w-[100vw] sm:w-[50vw] h-full bg-white z-[15000] 
                     border-l border-ink shadow-[-20px_0_60px_rgba(0,0,0,0.1)]
                     flex flex-col overflow-hidden"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Close Area */}
                    <div
                        className="absolute top-0 right-0 p-10 z-20 cursor-pointer font-serif text-lg lowercase tracking-widest hover:text-blue"
                        onClick={handleClose}
                    >
                        {t("stack.close")}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col px-[5vw] pt-[15vh] pb-[10vh]">
                        <div className="overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar">
                            {stackItems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="font-serif text-[clamp(3.5rem,10vh,12vh)] lowercase leading-[0.9] tracking-[-0.05em] text-ink mb-6 break-words"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
