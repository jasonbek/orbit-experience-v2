import { cn } from "@/lib/utils";
import React from "react";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    intensity?: "low" | "medium" | "high";
    children: React.ReactNode;
}

export function GlassContainer({
    className,
    intensity = "medium",
    children,
    ...props
}: GlassContainerProps) {

    // Base64 noise texture for film grain effect (Visual Lead Requirement)
    const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]", // Top inner light
                "backdrop-blur-xl transition-all duration-300",
                {
                    "bg-slate-950/40": intensity === "low",
                    "bg-slate-950/60": intensity === "medium",
                    "bg-slate-950/80": intensity === "high",
                },
                className
            )}
            {...props}
        >
            {/* Noise Texture Layer */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{ backgroundImage: noiseOverlay }}
            />

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
