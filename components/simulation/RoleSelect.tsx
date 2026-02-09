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
        nextStep();
    };

    const cards = [
        {
            id: "mission-control",
            title: "MISSION CONTROL",
            desc: "Navigate our commanders to their goal; the moon.",
            image: "/assets/mission-control-avatar.png",
            color: "from-amg-blue/30 to-amg-blue/0",
            variant: "blue",
        },
        {
            id: "commander",
            title: "COMMANDER",
            desc: "Command your vessel with the guidance of Mission Control.",
            image: "/assets/commander-avatar.png",
            color: "from-ici-red/30 to-ici-red/0",
            variant: "red",
        },
    ];

    return (
        // FIX 1: Use 'h-[100dvh]' to strictly fit mobile browser viewports (ignoring address bars)
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-2 md:p-8 pointer-events-auto bg-slate-950/90 backdrop-blur-md h-[100dvh] overflow-hidden">

            <div className="w-full max-w-5xl h-full flex flex-col space-y-1 md:space-y-8">

                {/* HEADER SECTION: Compact Mode */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    // FIX 2: Zero padding on top for mobile
                    className="text-center space-y-0.5 md:space-y-2 shrink-0 pt-0 md:pt-0"
                >
                    {/* FIX 3: Logo Constraints */}
                    <div className="flex justify-center mb-0.5 md:mb-4 opacity-90">
                        <Image
                            src="/assets/logo.svg"
                            alt="Canada ICI"
                            width={60}
                            height={20}
                            // KEY FIX: 'h-auto' allows the image to scale correctly without distortion
                            className="brightness-0 invert w-[60px] md:w-[120px] h-auto"
                            style={{ height: "auto" }}
                            priority
                        />
                    </div>

                    {/* FIX 4: Text-sm on mobile to prevent wrapping */}
                    <h1 className="text-sm md:text-6xl font-bold tracking-tighter text-white uppercase leading-tight">
                        YEAR IN REVIEW <span className="text-white/30 font-light">INITIALIZED</span>
                    </h1>

                    {/* FIX 5: Hidden on mobile */}
                    <p className="hidden md:block text-[8px] md:text-sm text-white/50 font-mono tracking-[0.3em] uppercase">
                        Identify your operating signature to begin 2025 orbital journey.
                    </p>
                </motion.div>

                {/* CARD CONTAINER */}
                <div className="flex-1 min-h-0 w-full pt-1">
                    <div className="grid grid-cols-2 gap-2 md:gap-6 h-full">
                        {cards.map((card, i) => (
                            <motion.button
                                key={card.id}
                                initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), type: "spring", stiffness: 300, damping: 30 }}
                                onClick={() => handleSelect(card.id as any)}
                                className="group relative text-left h-full w-full transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]"
                            >
                                <GlassContainer variant={card.variant as any} className="h-full relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    {/* Gradient */}
                                    <div className={cn("absolute inset-0 bg-gradient-to-b opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500", card.color)} />

                                    {/* Avatar */}
                                    <div className="absolute bottom-0 right-0 w-3/4 h-3/4 transition-all duration-700 origin-bottom-right opacity-20 md:opacity-60 group-hover:opacity-100 group-hover:scale-105 grayscale md:grayscale group-hover:grayscale-0">
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            className="object-contain object-bottom-right"
                                            sizes="(max-width: 768px) 50vw, 50vw"
                                        />
                                    </div>

                                    {/* Content */}
                                    {/* FIX 6: Reduced padding (p-3) */}
                                    <div className="relative z-10 p-3 md:p-8 flex flex-col justify-between h-full">
                                        <div className="space-y-1 md:space-y-3">
                                            <div className={cn("h-1 w-6 md:w-8 rounded-full mb-1 md:mb-2 transition-all duration-500", card.variant === "blue" ? "bg-[#009DD6]" : "bg-[#D80010]")} />

                                            {/* FIX 7: Smaller text-xs title */}
                                            <h2 className="text-xs md:text-3xl font-bold text-white tracking-widest drop-shadow-lg leading-tight">
                                                {card.title}
                                            </h2>

                                            {/* Hidden description on mobile */}
                                            <p className="hidden md:block text-white/60 text-sm leading-relaxed max-w-[200px]">
                                                {card.desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-[8px] md:text-xs font-mono uppercase text-white/40 group-hover:text-white transition-colors">
                                            Confirm Identity <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </GlassContainer>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}