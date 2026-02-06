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
    // Atomic Selectors for Performance
    const activeMilestoneId = useStore((state) => state.activeMilestoneId);
    const isShaking = useStore((state) => state.isShaking);
    const role = useStore((state) => state.role);
    const checkAnswer = useStore((state) => state.checkAnswer);
    const closeTransmission = useStore((state) => state.closeTransmission);
    const { playClick, playSuccess, playError } = useSoundSystem();

    // Retrieve the active mission data
    const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);

    // If data missing, render nothing
    if (!activeMilestone) return null;

    const brandColor = role === "mission-control" ? "amg-blue" : "ici-red";
    const brandHex = role === "mission-control" ? "#009DD6" : "#D80010";

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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 md:p-4 z-50">
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
                    // V2.2 Specification: w-[95%] on mobile, max-h-[85vh] with scroll
                    className="pointer-events-auto w-[95%] md:w-full max-w-2xl max-h-[85vh] overflow-hidden"
                >
                    <GlassContainer className="p-0 overflow-hidden flex flex-col h-full shadow-[0_32px_128px_rgba(0,0,0,0.8)]">
                        {/* Header: Incoming Transmission */}
                        <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                {/* V2.2: Pulsing ICI Red indicator */}
                                <span className="w-2 h-2 rounded-full bg-ici-red animate-pulse shadow-[0_0_8px_#D80010]" />
                                <h2 className="text-[10px] md:text-xs font-mono tracking-widest text-amg-blue uppercase font-bold">
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

                        {/* Payload: Challenge Question (Scrollable Content Area) */}
                        <div className="p-5 md:p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <h3 className="text-[10px] md:text-sm font-mono text-ici-light-grey uppercase tracking-[0.2em]">
                                    {activeMilestone.subject}
                                </h3>
                                <p className="text-lg md:text-2xl font-light text-white leading-relaxed">
                                    {activeMilestone.challenge}
                                </p>
                            </div>

                            {/* Interaction Grid: V2.2 specifies grid-cols-2 on mobile */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 pb-8">
                                {activeMilestone.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionClick(option)}
                                        className={cn(
                                            "group relative px-4 py-4 text-center md:text-left rounded-lg transition-all duration-300",
                                            "border border-white/5 bg-white/5 hover:bg-white/10",
                                            "active:scale-[0.98]",
                                            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                                        )}
                                    >
                                        <span className="text-sm md:text-base text-white/90 group-hover:text-white font-medium">
                                            {option}
                                        </span>
                                        {/* Brand Highlight Glow */}
                                        <div className={cn(
                                            "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity",
                                            role === "mission-control" ? "bg-amg-blue" : "bg-ici-red"
                                        )} />

                                        {/* Hover Border Law */}
                                        <div className={cn(
                                            "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100",
                                            role === "mission-control" ? "bg-amg-blue shadow-[0_0_10px_#009DD6]" : "bg-ici-red shadow-[0_0_10px_#D80010]"
                                        )} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Footer */}
                        <div className="p-3 md:p-4 bg-black/40 border-t border-white/5 shrink-0 flex justify-end">
                            <div className="flex items-center gap-4">
                                <span className="animate-pulse text-[8px] font-mono text-ici-light-grey uppercase">Encryption: AES_2025_ICI</span>
                                <span className="text-[8px] md:text-[10px] font-mono text-white/30 uppercase tracking-tighter">
                                    Waiting for Command Input...
                                </span>
                            </div>
                        </div>
                    </GlassContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
