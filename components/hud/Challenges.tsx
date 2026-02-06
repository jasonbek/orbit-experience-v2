"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";

export function Challenges() {
    // Atomic Selectors for Performance (State Lead Requirement)
    const currentStep = useStore((state) => state.currentStep);
    const isShaking = useStore((state) => state.isShaking);
    const checkAnswer = useStore((state) => state.checkAnswer);
    const { playClick, playSuccess, playError } = useSoundSystem();

    // Retrieve the active mission data
    const activeMilestone = milestones.find((m) => m.id === currentStep.toString());

    // If mission is complete or data missing, render nothing
    if (!activeMilestone) return null;

    const handleOptionClick = (option: string) => {
        playClick();
        const isCorrect = checkAnswer(activeMilestone.id, option);
        if (isCorrect) {
            playSuccess();
        } else {
            playError();
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMilestone.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        // Physics-based Shake Effect on Failure
                        x: isShaking ? [-10, 10, -10, 10, 0] : 0
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        x: { duration: 0.4 } // Shake duration
                    }}
                    // CRITICAL: Re-enable clicks on the card itself
                    className="pointer-events-auto w-full max-w-2xl"
                >
                    <GlassContainer className="p-0 overflow-hidden">
                        {/* Header: Incoming Transmission */}
                        <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h2 className="text-xs font-mono tracking-widest text-emerald-500 uppercase">
                                    Incoming Transmission // {activeMilestone.heading}
                                </h2>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono">
                                SECURE CHANNEL
                            </span>
                        </div>

                        {/* Payload: Challenge Question */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-mono text-sky-400/80 uppercase tracking-wider">
                                    {activeMilestone.subject}
                                </h3>
                                <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                                    {activeMilestone.challenge}
                                </p>
                            </div>

                            {/* Interaction Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {activeMilestone.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionClick(option)}
                                        className={cn(
                                            "group relative px-4 py-4 text-left rounded-lg transition-all duration-200",
                                            "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                                            "active:scale-[0.98]",
                                            // If logic requires highlighting specific states, add conditionals here
                                        )}
                                    >
                                        <span className="text-sm md:text-base text-white/90 group-hover:text-white font-medium">
                                            {option}
                                        </span>
                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500/5" />
                                    </button>
                                ))}
                            </div>

                            {/* Footer / CTA Status */}
                            <div className="pt-2 border-t border-white/10 flex justify-end">
                                <span className="text-[10px] font-mono text-white/30">
                                    WAITING FOR COMMAND INPUT...
                                </span>
                            </div>
                        </div>
                    </GlassContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
