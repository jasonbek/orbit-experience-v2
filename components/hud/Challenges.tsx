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
    const completedMilestoneIds = useStore((state) => state.completedMilestoneIds); // FIX 1: Get completed list
    const isShaking = useStore((state) => state.isShaking);
    const role = useStore((state) => state.role);
    const checkAnswer = useStore((state) => state.checkAnswer);
    const closeTransmission = useStore((state) => state.closeTransmission);
    const { playClick, playSuccess, playError } = useSoundSystem();

    const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);
    if (!activeMilestone) return null;

    // Check completion status
    const isCompleted = completedMilestoneIds.includes(activeMilestone.id);

    // Determine Variant based on Role
    const containerVariant = role === "commander" ? "red" : "blue";
    const highlightColor = role === "commander" ? "bg-[#D80010]" : "bg-[#009DD6]";
    const textColor = role === "commander" ? "text-[#D80010]" : "text-[#009DD6]";

    const handleOptionClick = (option: string) => {
        if (isCompleted) return; // FIX 2: Prevent interaction if already done

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
                        x: isShaking ? [-10, 10, -10, 10, 0] : 0
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.4,
                        x: { duration: 0.4 }
                    }}
                    className="pointer-events-auto w-[95%] md:w-full max-w-2xl"
                >
                    <GlassContainer variant={containerVariant} className="flex flex-col h-full overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                {/* If completed, show a solid light instead of pulsing */}
                                <span className={cn(
                                    "w-2 h-2 rounded-full shadow-lg",
                                    isCompleted ? highlightColor : `animate-pulse ${highlightColor}`
                                )} />
                                <h2 className={cn("text-[10px] md:text-xs font-mono tracking-widest uppercase font-bold", textColor)}>
                                    {isCompleted ? "ARCHIVED TRANSMISSION" : "INCOMING TRANSMISSION"} // {activeMilestone.heading}
                                </h2>
                            </div>
                            <button
                                onClick={closeTransmission}
                                className="text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 md:p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-2">
                                <h3 className="text-[10px] md:text-sm font-mono text-zinc-400 uppercase tracking-[0.2em]">
                                    {activeMilestone.subject}
                                </h3>
                                <p className="text-lg md:text-2xl font-light text-white leading-relaxed">
                                    {activeMilestone.challenge}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {activeMilestone.options.map((option) => {
                                    // Logic for visual states
                                    const isCorrect = option === activeMilestone.correctAnswer;

                                    // If completed & this is the correct answer -> Brand Color Background
                                    // If completed & NOT correct -> Dim opacity
                                    // If not completed -> Standard behavior
                                    const buttonStyle = isCompleted
                                        ? isCorrect
                                            ? `${highlightColor} border-transparent text-white`
                                            : "bg-white/5 border-white/5 opacity-40 grayscale"
                                        : "bg-white/5 border-white/5 hover:bg-white/10";

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={isCompleted} // Lock button if done
                                            className={cn(
                                                "group relative px-4 py-4 text-left rounded-lg border active:scale-[0.98] transition-all duration-500",
                                                buttonStyle
                                            )}
                                        >
                                            <span className="text-sm md:text-base font-medium relative z-10">
                                                {option}
                                            </span>

                                            {/* Glows only show if active mission */}
                                            {!isCompleted && (
                                                <>
                                                    <div className={cn(
                                                        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
                                                        highlightColor
                                                    )} />
                                                    <div className={cn(
                                                        "absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300",
                                                        highlightColor
                                                    )} />
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* FIX 3: Footer Message for Completed State */}
                            {isCompleted && (
                                <div className="text-center pt-2 pb-2 animate-pulse">
                                    <span className={cn("text-[10px] font-mono tracking-[0.3em] uppercase opacity-70", textColor)}>
                                        // MILESTONE COMPLETED //
                                    </span>
                                </div>
                            )}
                        </div>
                    </GlassContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}