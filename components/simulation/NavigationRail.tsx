"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { milestones } from "@/data/milestones";

export function NavigationRail() {
    const currentStep = useStore((state) => state.currentStep);
    const role = useStore((state) => state.role);
    const [mounted, setMounted] = useState(false);

    // Hydration guard to prevent SSR mismatches
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Determine Brand Colors based on Role
    const isCommander = role === "commander";
    const activeColor = isCommander ? "bg-[#D80010]" : "bg-[#009DD6]";
    const shadowColor = isCommander ? "shadow-[0_0_15px_#D80010]" : "shadow-[0_0_15px_#009DD6]";
    const variant = isCommander ? "red" : "blue";

    // V2.2 Progress Fill Logic: (currentStep - 1) / (total - 1)
    // currentStep 1 is start (0%), currentStep 10 is end (100%)
    const progress = Math.min(Math.max(((currentStep - 1) / (milestones.length - 1)) * 100, 0), 100);

    return (
        <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full max-w-3xl"
            >
                <GlassContainer variant={variant} className="h-16 md:h-20 flex items-center justify-between px-6 md:px-10">

                    {/* EARTH (Start) */}
                    <div className="relative group">
                        <div className={cn("absolute inset-0 opacity-20 blur-md rounded-full", activeColor)} />
                        <div className="relative w-8 h-8 md:w-10 md:h-10 opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <Image
                                src="/assets/earth.png"
                                alt="Earth"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 32px, 40px"
                            />
                        </div>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 tracking-widest uppercase">
                            GEO
                        </span>
                    </div>

                    {/* THE TRACK (Timeline) */}
                    <div className="flex-1 mx-6 md:mx-10 relative h-[2px] bg-white/10 rounded-full overflow-visible">

                        {/* Background Nodes (The Milestones) */}
                        <div className="absolute inset-0 flex justify-between items-center z-0 px-[1%]">
                            {milestones.map((m, i) => {
                                // milestones are 1-indexed in ids, i is 0-indexed
                                const milestoneNumber = i + 1;
                                const isCompleted = milestoneNumber < currentStep;
                                const isNext = milestoneNumber === currentStep;

                                return (
                                    <div key={m.id} className="relative flex items-center justify-center">
                                        {/* The Dot */}
                                        <motion.div
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all duration-500",
                                                isCompleted ? activeColor : "bg-white/10",
                                                isNext && "scale-150 animate-pulse bg-white"
                                            )}
                                        />

                                        {/* The Label (Desktop Only) */}
                                        {isNext && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: -20 }}
                                                className={cn(
                                                    "absolute top-0 whitespace-nowrap text-[8px] font-mono tracking-widest uppercase hidden md:block",
                                                    isCommander ? "text-[#D80010]" : "text-[#009DD6]"
                                                )}
                                            >
                                                Milestone {m.id}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* The Active Progress Fill */}
                        <motion.div
                            className={cn("absolute left-0 top-0 bottom-0 rounded-full z-10", activeColor, shadowColor)}
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        />
                    </div>

                    {/* MOON (Finish) */}
                    <div className="relative group">
                        <div className={cn(
                            "absolute inset-0 blur-md rounded-full transition-opacity duration-1000",
                            progress === 100 ? "opacity-50" : "opacity-0",
                            activeColor
                        )} />
                        <div className="relative w-6 h-6 md:w-8 md:h-8 opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <Image
                                src="/assets/moon.png"
                                alt="Moon"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 32px, 40px"
                            />
                        </div>
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 tracking-widest uppercase">
                            LUN
                        </span>
                    </div>

                </GlassContainer>
            </motion.div>
        </div>
    );
}