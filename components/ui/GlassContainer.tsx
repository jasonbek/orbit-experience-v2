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

    // 5% Opacity SVG Digital Noise (V2.2 Spec)
    const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl",
                // THE LIGHTING LAW (V2.2): Box-shadow instead of standard borders
                // 1px Inner highlight (Top/Left) + subtle outer glow/shadow
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.02),0_4px_24px_rgba(0,0,0,0.5)]",
                "backdrop-blur-[12px] transition-all duration-300",
                {
                    "bg-slate-950/40": intensity === "low",
                    "bg-slate-950/60": intensity === "medium",
                    "bg-slate-950/80": intensity === "high",
                },
                className
            )}
            {...props}
        >
            {/* Noise Texture Layer (5% Opacity as per Brief 2.2) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
                style={{ backgroundImage: noiseOverlay }}
            />

            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
