"use client";

import { motion } from "framer-motion";
import { milestones } from "@/data/milestones";
import { useStore } from "@/store/useStore";
import { getTrajectoryNodes } from "@/lib/bezier";
import { cn } from "@/lib/utils";

export function Trajectory() {
    const currentMilestoneIndex = useStore((state) => state.currentMilestoneIndex);
    const unlockedIndex = useStore((state) => state.unlockedIndex);
    const checkAnswer = useStore((state) => state.checkAnswer);

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

    return (
        <div className="absolute inset-0 z-0 pointer-events-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
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
                    stroke="#38bdf8" // Canada ICI Teal
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{
                        // Calculate percentage based on current milestone
                        pathLength: (unlockedIndex + 1) / milestones.length
                    }}
                    transition={springConfig}
                    strokeLinecap="round"
                />

                {/* Milestone Nodes */}
                {nodes.map((node, i) => {
                    const isUnlocked = i <= unlockedIndex;
                    const isCurrent = i === currentMilestoneIndex;

                    return (
                        <g key={milestones[i].id} className="cursor-pointer group">
                            {/* Outer Glow for Unlocked Nodes */}
                            {isUnlocked && (
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="12"
                                    className={cn(
                                        "fill-indigo-500/20 transition-all duration-500",
                                        isCurrent ? "scale-150 opacity-100" : "scale-100 opacity-50"
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
                                    fill: isUnlocked ? "#38bdf8" : "#27272a",
                                    r: isCurrent ? 8 : 4
                                }}
                                transition={springConfig}
                                className={cn(
                                    "stroke-black stroke-2 shadow-2xl",
                                    !isUnlocked && "opacity-50"
                                )}
                            />

                            {/* Node Label (Optional/Hover) */}
                            <text
                                x={node.x}
                                y={node.y + 30}
                                textAnchor="middle"
                                className={cn(
                                    "font-mono text-[10px] uppercase tracking-widest transition-opacity duration-300 pointer-events-none fill-zinc-500",
                                    isCurrent ? "opacity-100 fill-indigo-400" : "opacity-0 group-hover:opacity-100"
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
