"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { X } from "lucide-react";

export function Challenges() {
    const activeMilestoneId = useStore((state) => state.activeMilestoneId);
    const isShaking = useStore((state) => state.isShaking);
    const role = useStore((state) => state.role);
    const checkAnswer = useStore((state) => state.checkAnswer);
    const closeTransmission = useStore((state) => state.closeTransmission);
    const { playClick, playSuccess, playError } = useSoundSystem();

    const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);
    if (!activeMilestone) return null;

    // Determine Variant based on Role
    const containerVariant = role === "commander" ? "red" : "blue";
    const highlightColor = role === "commander" ? "bg-[#D80010]" : "bg-[#009DD6]";
    const textColor = role === "commander" ? "text-[#D80010]" : "text-[#009DD6]";

    const handleOptionClick = (option: string) => {
        playClick();
        if (checkAnswer(activeMilestone.id, option)) {
            playSuccess();
        } else {
            playError();
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 md:p-4 z-50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMilestone.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        // Physics-based Shake Effect on Failure
                        x: isShaking ? [-10, 10, -10, 10, 0] : 0
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.4,
                        x: { duration: 0.4 } // Shake duration
                    }}
                    className="pointer-events-auto w-[95%] md:w-full max-w-2xl"
                >
                    <GlassContainer variant={containerVariant} className="flex flex-col h-full overflow-hidden shadow-2xl">
                        {/* Header: Incoming Transmission */}
                        <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full animate-pulse shadow-lg", highlightColor)} />
                                <h2 className={cn("text-[10px] md:text-xs font-mono tracking-widest uppercase font-bold", textColor)}>
                                    Incoming Transmission // {activeMilestone.heading}
                                </h2>
                            </div>
                            <button
                                onClick={closeTransmission}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body: Challenge Question */}
                        <div className="p-5 md:p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <h3 className="text-[10px] md:text-sm font-mono text-zinc-400 uppercase tracking-[0.2em]">
                                    {activeMilestone.subject}
                                </h3>
                                <p className="text-lg md:text-2xl font-light text-white leading-relaxed">
                                    {activeMilestone.challenge}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-8">
                                {activeMilestone.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionClick(option)}
                                        className="group relative px-4 py-4 text-left rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
                                    >
                                        <span className="text-sm md:text-base text-white/90 font-medium relative z-10">
                                            {option}
                                        </span>
                                        {/* Brand Highlight Glow */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                                            highlightColor
                                        )} />

                                        {/* Hover Border */}
                                        <div className={cn(
                                            "absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300",
                                            highlightColor
                                        )} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
