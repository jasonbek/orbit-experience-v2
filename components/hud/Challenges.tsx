"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { useNumberScramble } from "@/hooks/useNumberScramble";
import Image from "next/image";
import { X } from "lucide-react";

export function Challenges() {
    const activeMilestoneId = useStore((state) => state.activeMilestoneId);
    const completedMilestoneIds = useStore((state) => state.completedMilestoneIds);
    const role = useStore((state) => state.role);
    const confirmStatement = useStore((state) => state.confirmStatement);
    const closeTransmission = useStore((state) => state.closeTransmission);
    const { playSuccess, playClick } = useSoundSystem();
    const prefersReduced = useReducedMotion();

    const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);

    // Hook must be called unconditionally (before early return)
    const { display: scrambledStat, isLockedIn, LOCKOUT_DURATION_MS } = useNumberScramble(
        activeMilestone?.statNumber ?? ""
    );

    if (!activeMilestone) return null;

    // Respect reduced-motion preference — skip the scramble animation
    const displayStat = prefersReduced ? activeMilestone.statNumber : scrambledStat;

    const isCompleted = completedMilestoneIds.includes(activeMilestone.id);

    // S3: Commander uses white as primary UI color; red reserved for CTA and logo glow only
    const containerVariant = role === "commander" ? "white" : "blue";
    const highlightColor = role === "commander" ? "bg-[#D80010]" : "bg-[#009DD6]"; // CTA stays red
    const textColor = role === "commander" ? "text-white" : "text-[#009DD6]";
    const borderColor = role === "commander" ? "border-white/30" : "border-[#009DD6]/40";
    const glowColor = role === "commander" ? "#D80010" : "#009DD6"; // pulsing logo glow stays red

    const handleConfirm = () => {
        playSuccess();
        confirmStatement(activeMilestone.id);
    };

    const handleClose = () => {
        playClick();
        closeTransmission();
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 md:p-4 z-50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMilestone.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="pointer-events-auto w-[95%] md:w-full max-w-2xl"
                >
                    <GlassContainer variant={containerVariant} className="flex flex-col overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="bg-white/5 border-b border-white/10 p-3 md:p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                {/* S2 — pulsing logo replaces the dot indicator */}
                                <motion.div
                                    animate={{
                                        filter: [
                                            `brightness(0) invert(1) drop-shadow(0 0 2px ${glowColor})`,
                                            `brightness(0) invert(1) drop-shadow(0 0 8px ${glowColor})`,
                                            `brightness(0) invert(1) drop-shadow(0 0 2px ${glowColor})`,
                                        ],
                                    }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Image
                                        src="/assets/logo.svg"
                                        alt=""
                                        width={16}
                                        height={7}
                                        style={{ height: "auto" }}
                                        aria-hidden
                                    />
                                </motion.div>
                                <h2 className={cn("text-[10px] md:text-xs font-mono tracking-widest uppercase font-bold", textColor)}>
                                    {isCompleted ? "ARCHIVED TRANSMISSION" : "INCOMING TRANSMISSION"} // {activeMilestone.heading}
                                </h2>
                            </div>
                            <button
                                onPointerDown={handleClose}
                                className="text-white/20 hover:text-white/50 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Body — max-h on this div (not outer) because GlassContainer's inner wrapper breaks the flex chain */}
                        <div className="p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto max-h-[65dvh] md:max-h-none">

                            {/* Subject + Statement */}
                            <div className="space-y-2">
                                <h3 className="text-[10px] md:text-sm font-mono text-zinc-400 uppercase tracking-[0.2em]">
                                    {activeMilestone.subject}
                                </h3>
                                <p className="text-lg md:text-2xl font-light text-white leading-relaxed">
                                    {activeMilestone.statement}
                                </p>
                            </div>

                            {/* Stat Number — hero element */}
                            <div className={cn(
                                "flex items-center justify-center py-4 md:py-8 rounded-lg border",
                                borderColor,
                                "bg-white/[0.03]"
                            )}>
                                <motion.span
                                    key={activeMilestone.id}
                                    animate={isLockedIn && !prefersReduced
                                        ? { scale: [1, 1.04, 1] }
                                        : {}
                                    }
                                    transition={{ duration: LOCKOUT_DURATION_MS / 1000, ease: "easeOut" }}
                                    className={cn(
                                        "text-4xl md:text-8xl font-black tracking-tight tabular-nums",
                                        textColor
                                    )}
                                >
                                    {displayStat}
                                </motion.span>
                            </div>

                            {/* Footer */}
                            {isCompleted ? (
                                <div className="text-center py-2">
                                    <span className={cn("text-[10px] font-mono tracking-[0.3em] uppercase opacity-60", textColor)}>
                                        // TRANSMISSION ARCHIVED //
                                    </span>
                                </div>
                            ) : (
                                <button
                                    onPointerDown={handleConfirm}
                                    className={cn(
                                        "w-full py-3 md:py-4 rounded-lg font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-bold",
                                        "transition-all duration-200 active:scale-[0.98]",
                                        highlightColor,
                                        "text-white shadow-lg"
                                    )}
                                >
                                    {activeMilestone.cta}
                                </button>
                            )}
                        </div>

                    </GlassContainer>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
