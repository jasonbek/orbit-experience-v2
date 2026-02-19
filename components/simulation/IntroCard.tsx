"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";

// Delay before the intro card slides in — allows the trajectory stagger to complete first
const INTRO_CARD_DELAY_S = 3.0;

const roleContent = {
    "mission-control": {
        body: "In 2025, we mastered the orbit, providing the strategy and certainty of execution that our clients rely on to fund more than three loans every single business day. Your mission today is to serve as the signal through the noise, guiding our brave commanders across the lunar landscape to a successful landing.\n\nInitiate Launch Sequence by clicking the launch milestone.",
    },
    commander: {
        body: "2025 was a year of extraordinary transit, where your vision shaped the cityscapes we see today. In a market of shifting gravity and atmospheric pressure, you stayed the course. Your objective today is to reach the moon and secure your project's future with the unwavering guidance of Mission Control.\n\nInitiate Launch Sequence by clicking the launch milestone.",
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            delay: INTRO_CARD_DELAY_S,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.25, ease: "easeIn" as const },
    },
};

export function IntroCard() {
    const role = useStore((state) => state.role);
    const hasSeenIntro = useStore((state) => state.hasSeenIntro);
    const setHasSeenIntro = useStore((state) => state.setHasSeenIntro);
    const { playClick } = useSoundSystem();

    if (!role) return null;

    const content = roleContent[role];
    const containerVariant = role === "commander" ? "white" : "blue";
    const highlightColor = role === "commander" ? "bg-[#D80010]" : "bg-[#009DD6]";
    const textColor = role === "commander" ? "text-white" : "text-[#009DD6]";
    const accentColor = role === "commander" ? "#D80010" : "#009DD6";

    const handleInitiate = () => {
        playClick();
        setHasSeenIntro();
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 md:p-4 z-50">
            <AnimatePresence>
                {!hasSeenIntro && (
                    <motion.div
                        key="intro-card-content"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="pointer-events-auto w-[95%] md:w-full max-w-2xl max-h-[90dvh] flex flex-col"
                    >
                        <GlassContainer variant={containerVariant} className="flex flex-col overflow-hidden shadow-2xl">

                            {/* Header */}
                            <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex items-center gap-2 shrink-0">
                                <span className={cn("w-2 h-2 rounded-full shadow-lg animate-pulse", highlightColor)} />
                                <h2 className={cn("text-[10px] md:text-xs font-mono tracking-widest uppercase font-bold", textColor)}>
                                    INCOMING TRANSMISSION // ROLE BRIEFING
                                </h2>
                            </div>

                            {/* Body — max-h on this div (not outer) is required because GlassContainer's inner wrapper breaks the flex chain */}
                            <div className="p-4 md:p-8 space-y-3 md:space-y-6 overflow-y-auto max-h-[60dvh]">
                                <p className="text-sm md:text-xl font-light text-white leading-relaxed whitespace-pre-line">
                                    {content.body}
                                </p>

                                {/* A2 — directional arrow toward Launch node (bottom-left) */}
                                <div className="flex justify-center py-1">
                                    <motion.div
                                        animate={{
                                            x: [0, -6, 0],
                                            y: [0, 4, 0],
                                            opacity: [1, 0.4, 1],
                                        }}
                                        transition={{
                                            duration: 1.6,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        style={{ color: accentColor }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                                            {/* Dashed diagonal pointing down-left */}
                                            <line
                                                x1="24" y1="4" x2="6" y2="22"
                                                stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="square" strokeDasharray="4 3"
                                            />
                                            {/* Angular arrowhead corner */}
                                            <path
                                                d="M 6 13 L 6 22 L 15 22"
                                                stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="square" fill="none"
                                            />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* CTA */}
                                <button
                                    onPointerDown={handleInitiate}
                                    className={cn(
                                        "w-full py-3 md:py-4 rounded-lg font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-bold",
                                        "transition-all duration-200 active:scale-[0.98]",
                                        highlightColor,
                                        "text-white shadow-lg"
                                    )}
                                >
                                    INITIATE SEQUENCE
                                </button>
                            </div>

                        </GlassContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
