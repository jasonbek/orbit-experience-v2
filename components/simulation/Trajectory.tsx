"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { milestones } from "@/data/milestones";
import { useStore } from "@/store/useStore";
import { getTrajectoryNodes } from "@/lib/bezier";
import { cn } from "@/lib/utils";
import { useSoundSystem } from "@/hooks/useSoundSystem";
import { GlassContainer } from "@/components/ui/GlassContainer";

// --- Auto-advance ---
const AUTO_ADVANCE_DELAY_MS = 5000;

// --- Comet ---
const COMET_DURATION_MS = 5000;

// --- Stagger timings (seconds) for the "Systems Online" onboarding sequence ---
const STAGGER_HUD_DELAY_S = 0.3;
const STAGGER_EARTH_DELAY_S = 0.7;
const STAGGER_MOON_DELAY_S = 1.1;
const STAGGER_PATH_DELAY_S = 1.5;
const STAGGER_NODES_BASE_DELAY_S = 2.0;
const STAGGER_NODE_INTERVAL_S = 0.08;

export function Trajectory() {
    const currentStep = useStore((state) => state.currentStep);
    const unlockedIndex = useStore((state) => state.unlockedIndex);
    const role = useStore((state) => state.role);
    const openTransmission = useStore((state) => state.openTransmission);
    const activeMilestoneId = useStore((state) => state.activeMilestoneId);
    const { playNotification } = useSoundSystem();

    const [countdownProgress, setCountdownProgress] = useState(0);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownStartRef = useRef<number>(0);
    const prevActiveMilestoneIdRef = useRef<string | null>(null);

    // 1. Unified Brand Logic
    const isMissionControl = role === "mission-control";
    // S3: Commander uses white as the primary UI color; red is reserved for CTA/active-node accents
    const brandColor = isMissionControl ? "#009DD6" : "#FFFFFF";
    const accentColor = isMissionControl ? "#009DD6" : "#D80010"; // active node pulse ring, CTA
    const variant = isMissionControl ? "blue" : "white";

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

    // Cancel the auto-advance countdown (stable — only uses refs and state setters)
    const cancelCountdown = useCallback(() => {
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
        if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
        autoAdvanceTimerRef.current = null;
        pulseIntervalRef.current = null;
        setIsCountingDown(false);
        setCountdownProgress(0);
    }, []);

    // Watch activeMilestoneId: start countdown on close
    useEffect(() => {
        const prev = prevActiveMilestoneIdRef.current;
        prevActiveMilestoneIdRef.current = activeMilestoneId;

        if (prev !== null && activeMilestoneId === null) {
            // Card just closed — start countdown if there is a next node to open
            const freshState = useStore.getState();
            if (freshState.unlockedIndex <= milestones.length) {
                countdownStartRef.current = Date.now();

                // State updates are inside the async callback (satisfies no-setState-in-effect rule)
                pulseIntervalRef.current = setInterval(() => {
                    const elapsed = Date.now() - countdownStartRef.current;
                    setIsCountingDown(true);
                    setCountdownProgress(Math.min(elapsed / AUTO_ADVANCE_DELAY_MS, 1));
                }, 50);

                autoAdvanceTimerRef.current = setTimeout(() => {
                    if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
                    pulseIntervalRef.current = null;
                    setIsCountingDown(false);
                    setCountdownProgress(0);
                    // Use fresh store state to avoid stale closure
                    const { unlockedIndex: nextIndex, openTransmission: open } = useStore.getState();
                    open(String(nextIndex));
                }, AUTO_ADVANCE_DELAY_MS);
            }
        }
    }, [activeMilestoneId, cancelCountdown]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => cancelCountdown();
    }, [cancelCountdown]);

    const handleNodeClick = (id: string) => {
        cancelCountdown();
        playNotification();
        openTransmission(id);
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-auto flex items-center justify-center p-2 md:p-4 lg:p-6 transition-all duration-700">

            {/* Glass Dashboard */}
            <GlassContainer
                variant={variant}
                className="relative w-full h-full shadow-2xl border-white/10"
            >
                {/* --- LAYER A: PLANETS --- */}

                {/* Earth (Launch) - Bottom Left */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 0.8, delay: STAGGER_EARTH_DELAY_S }}
                    className="absolute bottom-0 left-0 w-[30%] h-[30%] md:w-[25%] md:h-[25%] opacity-20 pointer-events-none z-0"
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
                    transition={{ duration: 0.8, delay: STAGGER_MOON_DELAY_S }}
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
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background Trace */}
                    <path
                        d={pathData}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="12 12"
                    />

                    {/* Active Progress Line — draws itself after stagger delay */}
                    <motion.path
                        d={pathData}
                        stroke={brandColor}
                        strokeWidth="4"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: (unlockedIndex - 1) / (milestones.length - 1) }}
                        transition={{ ...springConfig, delay: STAGGER_PATH_DELAY_S }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_10px_currentColor]"
                    />

                    {/* --- COMET: travelling light along the trajectory --- */}
                    <style>{`
                        @keyframes cometTravel {
                            from { offset-distance: 0%; }
                            to   { offset-distance: 100%; }
                        }
                        .comet-element {
                            offset-path: path("${pathData}");
                            animation: cometTravel ${COMET_DURATION_MS}ms linear infinite;
                            will-change: offset-distance;
                        }
                        .comet-tail {
                            offset-rotate: auto;
                        }
                    `}</style>

                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: STAGGER_PATH_DELAY_S + 0.6, duration: 0.8 }}
                    >
                        {/* Directional tail — elongated ellipse aligned to path direction */}
                        <ellipse
                            rx={18} ry={3}
                            fill={brandColor}
                            opacity={0.45}
                            className="comet-element comet-tail"
                            style={{ filter: "blur(3px)" }}
                        />

                        {/* Soft glow halo */}
                        <circle
                            r={7}
                            fill={brandColor}
                            opacity={0.3}
                            className="comet-element"
                            style={{ filter: "blur(5px)" }}
                        />

                        {/* Bright head */}
                        <circle
                            r={2.5}
                            fill="white"
                            opacity={0.95}
                            className="comet-element"
                        />
                    </motion.g>

                    {/* Interactive Nodes — blink on one by one */}
                    {nodes.map((node, i) => {
                        const isUnlocked = (i + 1) <= unlockedIndex;
                        const isCurrent = (i + 1) === currentStep;
                        const milestoneId = milestones[i].id;
                        const targetRadius = isCurrent ? 10 : 6;
                        // The next pending node is the one the countdown will open
                        const isNextPending = isCountingDown && (i + 1) === unlockedIndex;

                        return (
                            <motion.g
                                key={milestoneId}
                                className={cn(
                                    "cursor-pointer group",
                                    !isUnlocked && "pointer-events-none"
                                )}
                                onClick={() => handleNodeClick(milestoneId)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isUnlocked ? 1 : 0.2 }}
                                transition={{
                                    delay: STAGGER_NODES_BASE_DELAY_S + i * STAGGER_NODE_INTERVAL_S,
                                    duration: 0.15
                                }}
                            >
                                {/* 1. Active Pulse Ring — uses accentColor so Commander keeps red here */}
                                {isCurrent && (
                                    <motion.circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={25}
                                        fill={accentColor}
                                        initial={{ opacity: 0.4, scale: 0.5 }}
                                        animate={{ opacity: 0, scale: 3 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                    />
                                )}

                                {/* 2. Countdown glow — grows and brightens as timer approaches zero */}
                                {isNextPending && (
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={20 + countdownProgress * 45}
                                        fill={brandColor}
                                        opacity={0.06 + countdownProgress * 0.36}
                                        style={{ pointerEvents: "none" }}
                                    />
                                )}

                                {/* 3. Invisible Hit Area */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={30}
                                    fill="transparent"
                                    className="cursor-pointer"
                                />

                                {/* 4. Core Node (The Dot) */}
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
                            </motion.g>
                        );
                    })}
                </svg>
            </GlassContainer>
        </div>
    );
}
