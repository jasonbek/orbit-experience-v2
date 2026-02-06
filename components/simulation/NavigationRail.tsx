"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { milestones } from "@/data/milestones";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { Globe, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationRail() {
    const currentStep = useStore((state) => state.currentStep);
    const role = useStore((state) => state.role);
    const unlockedIndex = useStore((state) => state.unlockedIndex);

    // Brand color logic (AMG Blue for Mission Control, ICI Red for Commander)
    const brandColorClass = role === "mission-control" ? "bg-amg-blue" : "bg-ici-red";
    const brandShadowClass = role === "mission-control" ? "shadow-amg-blue/50" : "shadow-ici-red/50";
    const brandTextClass = role === "mission-control" ? "text-amg-blue" : "text-ici-red";

    // Calculate mission progress percentage (0 to 1)
    // currentStep 0 to 11
    const progress = Math.min(Math.max((unlockedIndex - 1) / milestones.length, 0), 1);

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 pointer-events-auto">
            <GlassContainer className="px-6 py-3 flex items-center gap-6 overflow-visible">

                {/* Celestial Anchor: Earth (t=0) */}
                <div className="relative group">
                    <Globe className={cn(
                        "w-5 h-5 transition-colors duration-500",
                        unlockedIndex > 0 ? brandTextClass : "text-ici-grey"
                    )} />
                    <div className={cn(
                        "absolute inset-0 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full",
                        brandColorClass
                    )} />
                </div>

                {/* The Navigation Trace */}
                <div className="relative flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    {/* Background Trace (Grey) */}
                    <div className="absolute inset-0 bg-ici-grey/20" />

                    {/* Active Trace (Brand Color) */}
                    <motion.div
                        className={cn("absolute inset-y-0 left-0", brandColorClass, brandShadowClass, "shadow-[0_0_10px_rgba(0,0,0,0.5)]")}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />

                    {/* Milestone Ticks */}
                    <div className="absolute inset-0 flex justify-between px-1">
                        {milestones.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1 h-full rounded-full transition-colors duration-500",
                                    (i + 1) < unlockedIndex ? "bg-white/20" : "bg-white/5"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Celestial Anchor: Moon (t=1.0) */}
                <div className="relative group">
                    <Moon className={cn(
                        "w-5 h-5 transition-colors duration-500",
                        unlockedIndex > milestones.length ? brandTextClass : "text-ici-grey"
                    )} />
                    <div className={cn(
                        "absolute inset-0 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full",
                        brandColorClass
                    )} />
                </div>

                {/* Mission Status Tag */}
                <div className="hidden md:flex flex-col items-end border-l border-white/10 pl-6 min-w-[120px]">
                    <span className="text-[9px] font-mono text-ici-light-grey uppercase tracking-widest">Trajectory</span>
                    <span className="text-[10px] font-mono text-white/80 font-bold uppercase">
                        {progress < 1 ? `T+ ${Math.round(progress * 100)}%` : "Orbital Match"}
                    </span>
                </div>
            </GlassContainer>
        </div>
    );
}
