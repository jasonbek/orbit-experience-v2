"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";
import { milestones } from "@/data/milestones";

export function NavigationRail() {
    const currentStep = useStore((state) => state.currentStep);
    const role = useStore((state) => state.role); // Corrected to 'role'

    // Determine Brand Colors based on Role
    const isCommander = role === "commander";
    const activeColor = isCommander ? "bg-[#D80010]" : "bg-[#009DD6]";
    const variant = isCommander ? "red" : "blue";

    // Keep progress calculation ONLY for the Moon activation effect (End of Mission)
    const progress = Math.min((currentStep / milestones.length) * 100, 100);

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

                    {/* --- TRACK REMOVED FOR SIMPLIFICATION --- */}

                    {/* MOON (Finish) */}
                    <div className="relative group">
                        {/* Glows only when mission is 100% complete */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 blur-md rounded-full transition-opacity duration-1000",
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