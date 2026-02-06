"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { Monitor, Rocket, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSelect() {
    const setUserRole = useStore((state) => state.setUserRole);
    const nextStep = useStore((state) => state.nextStep); // Advance to Step 1

    const handleSelect = (role: "mission-control" | "commander") => {
        setUserRole(role);
        nextStep(); // Moves currentStep from 0 -> 1 (Launch)
    };

    const cards = [
        {
            id: "mission-control",
            title: "MISSION CONTROL",
            desc: "Oversee the 2025 orbit from the Operations Center.",
            icon: Monitor,
            color: "bg-emerald-500",
            border: "group-hover:border-emerald-500/50",
            glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
        },
        {
            id: "commander",
            title: "COMMANDER",
            desc: "Pilot the vessel through the milestone trajectory.",
            icon: Rocket,
            color: "bg-sky-500",
            border: "group-hover:border-sky-500/50",
            glow: "group-hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]",
        },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto">
            <div className="w-full max-w-5xl space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        NEURAL LINK <span className="text-white/30">INITIALIZED</span>
                    </h1>
                    <p className="text-white/50 font-mono tracking-widest text-sm uppercase">
                        Select your operating protocols
                    </p>
                </motion.div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card, i) => (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1), type: "spring", stiffness: 300, damping: 30 }}
                            onClick={() => handleSelect(card.id as any)}
                            className={cn(
                                "group relative text-left h-64 md:h-80 w-full transition-all duration-300",
                                "hover:-translate-y-1 active:scale-[0.98]"
                            )}
                        >
                            <GlassContainer className={cn(
                                "h-full p-8 flex flex-col justify-between transition-colors duration-300 border-white/10",
                                card.border,
                                card.glow
                            )}>
                                {/* Icon & Title */}
                                <div className="space-y-4">
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-white/5", card.color)}>
                                        <card.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-wide">{card.title}</h2>
                                        <p className="text-white/60 mt-2 leading-relaxed">{card.desc}</p>
                                    </div>
                                </div>

                                {/* CTA Arrow */}
                                <div className="flex items-center gap-2 text-xs font-mono uppercase text-white/30 group-hover:text-white transition-colors">
                                    Initialize Sequence <ChevronRight className="w-4 h-4" />
                                </div>
                            </GlassContainer>
                        </motion.button>
                    ))}
                </div>

            </div>
        </div>
    );
}
