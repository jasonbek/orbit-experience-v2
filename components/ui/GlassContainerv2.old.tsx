"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    // v2.2 Upgrade: Role-based 'variant' replaces 'intensity'
    variant?: "red" | "blue" | "neutral";
    children: React.ReactNode;
}

export function GlassContainer({
    className,
    variant = "neutral",
    children,
    ...props
}: GlassContainerProps) {
    // v2.2 Requirement: 5% Opacity SVG Noise Texture
    const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl backdrop-blur-[12px] transition-all duration-500",
                // The Rauno Lighting Law: 1px inner highlights using box-shadow instead of border
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)]",
                {
                    // Commander Theme (ICI Red) - Fire
                    "bg-[#D80010]/10 shadow-[0_0_40px_-10px_rgba(216,0,16,0.3)]": variant === "red",
                    // Mission Control Theme (AMG Blue) - Ice
                    "bg-[#009DD6]/10 shadow-[0_0_40px_-10px_rgba(0,157,214,0.3)]": variant === "blue",
                    // Default Neutral - Void
                    "bg-slate-950/40": variant === "neutral",
                },
                className
            )}
            {...props}
        >
            {/* Noise Texture Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-10 mix-blend-overlay"
                style={{ backgroundImage: noiseOverlay }}
            />

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
