"use client";

import { motion } from "framer-motion";
import { milestones } from "@/data/milestones";
import { useStore } from "@/store/useStore";
import { getTrajectoryNodes } from "@/lib/bezier";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { Globe, Moon } from "lucide-react";

export function Trajectory() {
    const currentStep = useStore((state) => state.currentStep);
    const unlockedIndex = useStore((state) => state.unlockedIndex);
    const role = useStore((state) => state.role);
    const openTransmission = useStore((state) => state.openTransmission);
    const { playNotification } = useSoundSystem();

    const currentIdx = milestones.findIndex(m => m.id === currentStep.toString());

    // Brand color logic
    const brandColor = role === "mission-control" ? "#009DD6" : "#D80010";

    // SVG ViewBox dimensions (matches the 16:9 aspect ratio coordinate system)
    const width = 1920;
    const height = 1080;

    // Visual path definition (matches getTrajectoryNodes in bezier.ts)
    const start = "150,900";
    const end = "1700,150";
    const control1 = "800,900";
    const control2 = "1200,100";
    const pathData = `M ${start} C ${control1} ${control2} ${end}`;

    // Mathematically calculated precise node positions
    const nodes = getTrajectoryNodes(milestones.length);

    // Physics Config (Matt Perry Standard)
    const springConfig = { stiffness: 400, damping: 30 };

    const handleNodeClick = (id: string) => {
        playNotification();
        openTransmission(id);
    };

    return (
        <div className="absolute inset-0 z-0 pointer-events-auto">
            {/* Simulation Celestial Layer */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-24 opacity-20 grayscale">
                {/* These are just visual anchors behind the SVG path */}
                <Globe className="w-16 h-16 self-end text-white/50" />
                <Moon className="w-16 h-16 self-start text-white/50 ml-auto" />
            </div>

            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Background Trace (The "Ghost" Path) */}
                <path
                    d={pathData}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="12 12"
                />

                {/* Active Trajectory (The "Live" Path) */}
                <motion.path
                    d={pathData}
                    stroke={brandColor} // Canada ICI Brand Color based on Role
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{
                        // Calculate percentage based on current progress
                        pathLength: (unlockedIndex - 1) / (milestones.length - 1)
                    }}
                    transition={springConfig}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />

                {/* Milestone Nodes */}
                {nodes.map((node, i) => {
                    const isUnlocked = (i + 1) <= unlockedIndex;
                    const isCurrent = (i + 1) === currentStep;
                    const milestoneId = milestones[i].id;

                    return (
                        <g
                            key={milestoneId}
                            className={cn(
                                "cursor-pointer group",
                                !isUnlocked && "pointer-events-none opacity-30"
                            )}
                            onClick={() => handleNodeClick(milestoneId)}
                        >
                            {/* Pulse Effect for the Active Node (Simulation Pivot V2.2) */}
                            {isCurrent && (
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="15"
                                    fill={brandColor}
                                    initial={{ opacity: 0.3, scale: 0.8 }}
                                    animate={{ opacity: 0, scale: 2.5 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                />
                            )}

                            {/* Outer Glow for Unlocked Nodes */}
                            {isUnlocked && (
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="12"
                                    className={cn(
                                        "transition-all duration-500",
                                        isCurrent ? "fill-white/10 opacity-100 scale-150" : "fill-white/5 opacity-50 scale-100"
                                    )}
                                />
                            )}

                            {/* Main Node Point */}
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={isCurrent ? 8 : 4}
                                initial={false}
                                animate={{
                                    fill: isUnlocked ? brandColor : "#27272a",
                                    r: isCurrent ? 8 : 4
                                }}
                                transition={springConfig}
                                className={cn(
                                    "stroke-black stroke-2 shadow-2xl",
                                    !isUnlocked && "opacity-50"
                                )}
                            />

                            {/* Node Label */}
                            <text
                                x={node.x}
                                y={node.y + (i % 2 === 0 ? 35 : -25)} // Alternate placement for spacing
                                textAnchor="middle"
                                className={cn(
                                    "font-mono text-[9px] md:text-[11px] uppercase tracking-widest transition-all duration-300 pointer-events-none",
                                    isCurrent ? "opacity-100 fill-white scale-110" : "opacity-0 fill-zinc-500 group-hover:opacity-100"
                                )}
                            >
                                {milestones[i].title}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
