"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionReport() {
    const resetMission = useStore((state) => state.resetMission);

    // Extract key stats for the summary (V2.2 Audit: Consistent withICI branding)
    const summaryStats = [
        { label: "Deal Volume", value: milestones[0].correctAnswer },
        { label: "Underwriting", value: milestones[2].correctAnswer },
        { label: "Market Reach", value: milestones[3].correctAnswer },
        { label: "Community", value: milestones[9].correctAnswer },
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-2 md:p-4 z-50 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-2xl px-2 md:px-0"
            >
                <GlassContainer className="p-6 md:p-12 text-center space-y-4 md:space-y-8 shadow-[0_0_100px_rgba(0,157,214,0.1)]">

                    {/* Header Section (Mobile Optimized: text-2xl & space-y-3) */}
                    <div className="space-y-2 md:space-y-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-12 h-12 md:w-20 md:h-20 bg-amg-blue/10 rounded-full flex items-center justify-center mx-auto border border-amg-blue/20"
                        >
                            <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10 text-amg-blue" />
                        </motion.div>

                        <h1 className={cn(
                            "text-2xl md:text-5xl font-bold tracking-tight uppercase transition-all duration-700",
                            "bg-gradient-to-r from-amg-blue to-white bg-clip-text text-transparent"
                        )}>
                            Mission Accomplished
                        </h1>
                        <p className="text-xs md:text-lg text-white/40 max-w-md mx-auto font-light leading-relaxed hidden md:block">
                            The 2025 Orbital Stream has been successfully verified. Canada ICI systems are operating at peak efficiency.
                        </p>
                        <p className="text-[10px] text-white/40 md:hidden uppercase tracking-widest">
                            Verification Complete // System Nominal
                        </p>
                    </div>

                    {/* Stats Grid: V2.2 specifies ici-light-grey for labels */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 py-4 md:py-8 border-y border-white/5">
                        {summaryStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="space-y-1 p-2 bg-white/[0.02] rounded-lg"
                            >
                                <div className="text-[8px] md:text-[10px] font-mono uppercase text-ici-light-grey tracking-wider">
                                    {stat.label}
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-white">
                                    {stat.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA: V2.2 specifies solid ici-red */}
                    <div className="pt-2 md:pt-4">
                        <button
                            onClick={resetMission}
                            className={cn(
                                "group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 transition-all duration-300 active:scale-95",
                                "bg-ici-red hover:bg-ici-red/90 text-white rounded-lg shadow-[0_10px_40px_-10px_rgba(216,0,16,0.6)]",
                                "hover:shadow-[0_15px_50px_-5px_rgba(216,0,16,0.8)]"
                            )}
                        >
                            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-180 transition-transform duration-700" />
                            <span className="font-mono text-[10px] md:text-sm tracking-widest uppercase font-bold">
                                Re-Initialize Sequence
                            </span>

                            {/* Inner Button Highlight Law */}
                            <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] pointer-events-none" />
                        </button>
                    </div>

                    {/* Secondary Link */}
                    <div className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em] pt-2">
                        System Terminal // Canada ICI 2025
                    </div>

                </GlassContainer>
            </motion.div>
        </div>
    );
}
