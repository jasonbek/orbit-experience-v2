"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSelect() {
    const setUserRole = useStore((state) => state.setUserRole);
    const nextStep = useStore((state) => state.nextStep);

    const handleSelect = (role: "mission-control" | "commander") => {
        setUserRole(role);
        nextStep(); // Moves currentStep from 0 -> 1 (Launch)
    };

    const cards = [
        {
            id: "mission-control",
            title: "MISSION CONTROL",
            desc: "Oversee the 2025 orbit from the Operations Center.",
            image: "/assets/mission-control-avatar.png",
            color: "from-emerald-500/20 to-emerald-500/0",
            border: "group-hover:border-emerald-500/50",
        },
        {
            id: "commander",
            title: "COMMANDER",
            desc: "Pilot the vessel through the milestone trajectory.",
            image: "/assets/commander-avatar.png",
            color: "from-sky-500/20 to-sky-500/0",
            border: "group-hover:border-sky-500/50",
        },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-auto bg-slate-950/80 backdrop-blur-sm">
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
                        Identify your operating signature
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
                                "group relative text-left h-[400px] w-full transition-all duration-500",
                                "hover:-translate-y-2 active:scale-[0.98]"
                            )}
                        >
                            <GlassContainer className={cn(
                                "h-full relative overflow-hidden transition-colors duration-500 border-white/10",
                                card.border
                            )}>
                                {/* Background Gradient */}
                                <div className={cn("absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500", card.color)} />

                                {/* Character Headshot (Absolute Positioned) */}
                                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0 origin-bottom-right">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        className="object-contain object-bottom-right"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Text Content (Layered on top) */}
                                <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">{card.title}</h2>
                                        <p className="text-sky-100/80 mt-2 leading-relaxed max-w-[200px] drop-shadow-md font-light">
                                            {card.desc}
                                        </p>
                                    </div>

                                    {/* CTA Arrow */}
                                    <div className="flex items-center gap-2 text-xs font-mono uppercase text-white/50 group-hover:text-white transition-colors">
                                        Confirm Identity <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </GlassContainer>
                        </motion.button>
                    ))}
                </div>

            </div>
        </div>
    );
}
