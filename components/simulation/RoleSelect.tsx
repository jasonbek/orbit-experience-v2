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
            color: "from-amg-blue/30 to-amg-blue/0",
            border: "group-hover:shadow-[0_0_20px_rgba(0,157,214,0.3)]",
            accent: "amg-blue",
        },
        {
            id: "commander",
            title: "COMMANDER",
            desc: "Pilot the vessel through the milestone trajectory.",
            image: "/assets/commander-avatar.png",
            color: "from-ici-red/30 to-ici-red/0",
            border: "group-hover:shadow-[0_0_20px_rgba(216,0,16,0.3)]",
            accent: "ici-red",
        },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-2 md:p-8 pointer-events-auto bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-5xl space-y-4 md:space-y-8">

                {/* Branding: Canada ICI Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center mb-2"
                >
                    <Image
                        src="/assets/logo.svg"
                        alt="Canada ICI"
                        width={120}
                        height={40}
                        className="brightness-0 invert opacity-90"
                    />
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-1 md:space-y-2"
                >
                    <h1 className="text-2xl md:text-6xl font-bold tracking-tighter text-white uppercase">
                        NEURAL LINK <span className="text-white/30 font-light">INITIALIZED</span>
                    </h1>
                    <p className="text-[10px] md:text-sm text-white/50 font-mono tracking-[0.3em] uppercase">
                        Identify your operating signature
                    </p>
                </motion.div>

                {/* Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 px-2 md:px-0">
                    {cards.map((card, i) => (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1), type: "spring", stiffness: 300, damping: 30 }}
                            onClick={() => handleSelect(card.id as any)}
                            className={cn(
                                "group relative text-left h-[220px] md:h-[400px] w-full transition-all duration-500",
                                "hover:scale-[1.01] active:scale-[0.98]"
                            )}
                        >
                            <GlassContainer className={cn(
                                "h-full relative overflow-hidden transition-all duration-500",
                                // Lighting Law: Box shadow highlights
                                card.border
                            )}>
                                {/* Brand Background Gradient */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-b opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                    card.color
                                )} />

                                {/* Character Headshot (Absolute Positioned) */}
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-3/4 h-3/4 transition-all duration-700 origin-bottom-right",
                                    "opacity-20 md:opacity-60 group-hover:opacity-100 group-hover:scale-105",
                                    "grayscale-0 md:grayscale group-hover:grayscale-0"
                                )}>
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        className="object-contain object-bottom-right"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Text Content (Layered on top) */}
                                <div className="relative z-10 p-4 md:p-8 flex flex-col justify-between h-full">
                                    <div className="space-y-1 md:space-y-3">
                                        <div className={cn(
                                            "h-1 w-8 rounded-full mb-2 md:mb-4 transition-all duration-500",
                                            card.accent === "amg-blue" ? "bg-amg-blue shadow-[0_0_10px_#009DD6]" : "bg-ici-red shadow-[0_0_10px_#D80010]"
                                        )} />
                                        <h2 className="text-xl md:text-3xl font-bold text-white tracking-widest drop-shadow-lg">{card.title}</h2>
                                        <p className="hidden md:block text-white/60 text-sm leading-relaxed max-w-[200px] drop-shadow-md font-light">
                                            {card.desc}
                                        </p>
                                    </div>

                                    {/* CTA Arrow */}
                                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase text-white/40 group-hover:text-white transition-colors">
                                        Confirm Identity <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white/50" />
                                    </div>
                                </div>

                                {/* Bottom Scanline Effect */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                    card.accent === "amg-blue" ? "bg-amg-blue shadow-[0_0_15px_#009DD6]" : "bg-ici-red shadow-[0_0_15px_#D80010]"
                                )} />
                            </GlassContainer>
                        </motion.button>
                    ))}
                </div>

                {/* Compliance Footer */}
                <div className="text-[8px] md:text-[10px] text-center text-white/20 font-mono tracking-widest pt-4">
                    EST_2025 // ORBITAL_DYNAMICS // DATA_SECURE
                </div>
            </div>
        </div>
    );
}
