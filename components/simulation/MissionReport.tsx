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

    // Extract key stats for the summary (V2.2 Audit: Consistent with ICI branding)
    const summaryStats = [
        { label: "Deal Volume", value: milestones[0].correctAnswer },
        { label: "Underwriting", value: milestones[2].correctAnswer },
        { label: "Market Reach", value: milestones[3].correctAnswer },
        { label: "Community", value: milestones[9].correctAnswer },
    ];

    return (
        // FIX 1: Changed md:p-4 to lg:p-4 (Keeps padding tight on landscape mobile)
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-2 lg:p-4 z-50 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                // FIX 2: Changed md:px-0 to lg:px-0
                className="w-full max-w-2xl px-2 lg:px-0"
            >
                {/* FIX 3: Changed md:p-12 to lg:p-12 (Prevents massive padding on phones) */}
                <GlassContainer className="p-6 lg:p-12 text-center space-y-4 lg:space-y-8 shadow-[0_0_100px_rgba(0,157,214,0.1)]">

                    {/* Header Section */}
                    {/* FIX 4: Changed md:space-y-4 to lg:space-y-4 */}
                    <div className="space-y-2 lg:space-y-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            // FIX 5: Icon sizing md: -> lg:
                            className="w-12 h-12 lg:w-20 lg:h-20 bg-amg-blue/10 rounded-full flex items-center justify-center mx-auto border border-amg-blue/20"
                        >
                            <CheckCircle2 className="w-6 h-6 lg:w-10 lg:h-10 text-amg-blue" />
                        </motion.div>

                        <h1 className={cn(
                            // FIX 6: Text sizing md:text-5xl -> lg:text-5xl
                            "text-2xl lg:text-5xl font-bold tracking-tight uppercase transition-all duration-700",
                            "bg-gradient-to-r from-amg-blue to-white bg-clip-text text-transparent"
                        )}>
                            Mission Accomplished
                        </h1>

                        {/* FIX 7: Paragraph Visibility. 
                            'hidden lg:block' ensures this large text stays HIDDEN on mobile landscape 
                            (which has very little vertical height). */}
                        <p className="text-xs lg:text-lg text-white/40 max-w-md mx-auto font-light leading-relaxed hidden lg:block">
                            The 2025 Orbital Journey has been successfully Completed. Canada ICI thanks you for your bravery in making last year a success.
                        </p>

                        {/* FIX 8: Mobile Subtitle. 
                            'lg:hidden' ensures this shows up on everything smaller than a laptop. */}
                        <p className="text-[10px] text-white/40 lg:hidden uppercase tracking-widest">
                            Verification Complete // System Nominal
                        </p>
                    </div>

                    {/* CTA Section */}
                    {/* FIX 9: Padding md:pt-4 -> lg:pt-4 */}
                    <div className="pt-2 lg:pt-4">
                        <button
                            onClick={resetMission}
                            className={cn(
                                // FIX 10: Button sizing all shifted to lg: to keep it compact on phones
                                "group relative inline-flex items-center gap-2 lg:gap-3 px-6 lg:px-10 py-3 lg:py-4 transition-all duration-300 active:scale-95",
                                "bg-ici-red hover:bg-ici-red/90 text-white rounded-lg shadow-[0_10px_40px_-10px_rgba(216,0,16,0.6)]",
                                "hover:shadow-[0_15px_50px_-5px_rgba(216,0,16,0.8)]"
                            )}
                        >
                            <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform duration-700" />
                            <span className="font-mono text-[10px] lg:text-sm tracking-widest uppercase font-bold">
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