"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { milestones } from "@/data/milestones";
import { useStore } from "@/store/useStore";
import { getTrajectoryNodes } from "@/lib/bezier";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { GlassContainer } from "@/components/ui/GlassContainer";

export function Trajectory() {
    const currentStep = useStore((state) => state.currentStep);
    const unlockedIndex = useStore((state) => state.unlockedIndex);
    const role = useStore((state) => state.role);
    const openTransmission = useStore((state) => state.openTransmission);
    const { playNotification } = useSoundSystem();

    // 1. Unified Brand Logic
    const isMissionControl = role === "mission-control";
    const brandColor = isMissionControl ? "#009DD6" : "#D80010";
    const variant = isMissionControl ? "blue" : "red";

    const width = 1920;
    const height = 1080;

    // Visual path definition
    const start = "150,900";
    const end = "1700,150";
    const control1 = "800,900";
    const control2 = "1200,100";
    const pathData = `M ${start} C ${control1} ${control2} ${end}`;

    const nodes = getTrajectoryNodes(milestones.length);
    const springConfig = { stiffness: 400, damping: 30 };

    const handleNodeClick = (id: string) => {
        playNotification();
        openTransmission(id);
    };

    return (
        // FIXED: Added z-10 to ensure it sits ABOVE the background
        <div className="absolute inset-0 z-10 pointer-events-auto flex items-center justify-center p-2 md:p-4 lg:p-6 transition-all duration-700">

            {/* Glass Dashboard */}
            <GlassContainer
                variant={variant}
                className="relative w-full h-full shadow-2xl border-white/10"
            >
                {/* --- LAYER A: PLANETS --- */}
                {/* FIXED: Removed negative positioning (-10%) so they aren't clipped by overflow-hidden */}
                {/* FIXED: Added 'sizes' prop to silence performance warning */}

                {/* Earth (Launch) - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute bottom-0 left-0 w-[40%] h-[40%] md:w-[25%] md:h-[25%] opacity-20 pointer-events-none z-0"
                >
                    <div className="relative w-full h-full grayscale opacity-40 mix-blend-screen">
                        <Image
                            src="/assets/earth.png"
                            alt="Earth"
                            fill
                            className="object-contain object-bottom-left"
                            sizes="(max-width: 768px) 40vw, 25vw"
                        />
                    </div>
                </motion.div>

                {/* Moon (Target) - Top Right */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute top-0 right-0 w-[30%] h-[30%] md:w-[20%] md:h-[20%] opacity-20 pointer-events-none z-0"
                >
                    <div className="relative w-full h-full grayscale opacity-40 mix-blend-screen">
                        <Image
                            src="/assets/moon.png"
                            alt="Moon"
                            fill
                            className="object-contain object-top-right"
                            sizes="(max-width: 768px) 30vw, 20vw"
                        />
                    </div>
                </motion.div>

                {/* --- LAYER B: THE TRAJECTORY (3D SVG) --- */}
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="absolute inset-0 w-full h-full z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {/* Background Trace */}
                    <path
                        d={pathData}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="12 12"
                    />

                    {/* Active Progress Line */}
                    <motion.path
                        d={pathData}
                        stroke={brandColor}
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: (unlockedIndex - 1) / (milestones.length - 1) }}
                        transition={springConfig}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_10px_currentColor]"
                    />

                    {/* Interactive Nodes */}
                    {nodes.map((node, i) => {
                        const isUnlocked = (i + 1) <= unlockedIndex;
                        const isCurrent = (i + 1) === currentStep;
                        const milestoneId = milestones[i].id;

                        // FIXED: Pre-calculate radius to prevent "undefined" animation error
                        const targetRadius = isCurrent ? 10 : 6;

                        return (
                            <g
                                key={milestoneId}
                                className={cn(
                                    "cursor-pointer group transition-opacity duration-300",
                                    !isUnlocked && "pointer-events-none opacity-20"
                                )}
                                onClick={() => handleNodeClick(milestoneId)}
                            >
                                {/* Active Pulse Ring */}
                                {isCurrent && (
                                    <motion.circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={25} // FIXED: Passed as number, not string
                                        fill={brandColor}
                                        initial={{ opacity: 0.4, scale: 0.5 }}
                                        animate={{ opacity: 0, scale: 3 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                    />
                                )}

                                {/* Outer Ring (Hover Target) */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={15} // FIXED: Passed as number
                                    className={cn(
                                        "transition-all duration-300",
                                        isCurrent ? "fill-white/20 scale-125" : "fill-transparent group-hover:fill-white/10"
                                    )}
                                />

                                {/* Core Node */}
                                {/* FIXED: Added 'initial' prop to prevent 'r: undefined' crash */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    initial={{
                                        r: targetRadius,
                                        fill: isUnlocked ? brandColor : "#555"
                                    }}
                                    animate={{
                                        fill: isUnlocked ? brandColor : "#555",
                                        r: targetRadius
                                    }}
                                    transition={springConfig}
                                    className="stroke-white/10 stroke-1"
                                />

                                {/* Label */}
                                <text
                                    x={node.x}
                                    y={node.y + (i % 2 === 0 ? 45 : -35)}
                                    textAnchor="middle"
                                    className={cn(
                                        "font-mono text-[16px] uppercase tracking-[0.2em] font-bold pointer-events-none transition-all duration-300",
                                        isCurrent ? "opacity-100 fill-white" : "opacity-0 fill-white/50 group-hover:opacity-100"
                                    )}
                                >
                                    {milestones[i].title}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </GlassContainer>
        </div>
    );
}