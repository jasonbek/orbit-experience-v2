"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { RotateCcw, CheckCircle2 } from "lucide-react";

export function MissionReport() {
    const resetMission = useStore((state) => state.resetMission);

    // Extract key stats for the summary (using the correct answers)
    // This creates a "Receipt" of the user's journey
    const summaryStats = [
        { label: "Deal Volume", value: milestones[0].correctAnswer }, // Launch
        { label: "Underwriting", value: milestones[2].correctAnswer }, // Burn
        { label: "Market Reach", value: milestones[3].correctAnswer }, // Vector
        { label: "Community", value: milestones[9].correctAnswer },   // Splashdown
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-3xl"
            >
                <GlassContainer className="p-8 md:p-12 text-center space-y-8">

                    {/* Header */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"
                        >
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            MISSION ACCOMPLISHED
                        </h1>
                        <p className="text-lg text-sky-200/60 max-w-xl mx-auto font-light leading-relaxed">
                            The 2025 Orbital Stream has been successfully verified. Canada ICI systems are operating at peak efficiency.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/10">
                        {summaryStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="space-y-1"
                            >
                                <div className="text-xs font-mono uppercase text-sky-400/60 tracking-wider">
                                    {stat.label}
                                </div>
                                <div className="text-xl md:text-2xl font-semibold text-white">
                                    {stat.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                        <button
                            onClick={resetMission}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-lg transition-all duration-200 active:scale-95"
                        >
                            <RotateCcw className="w-5 h-5 text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="font-mono text-sm tracking-widest text-white uppercase">
                                Re-Initialize Sequence
                            </span>
                        </button>
                    </div>

                </GlassContainer>
            </motion.div>
        </div>
    );
}
