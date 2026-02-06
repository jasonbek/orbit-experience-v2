"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Trajectory } from "@/components/simulation/Trajectory";
import { RoleSelect } from "@/components/simulation/RoleSelect";
import { MissionReport } from "@/components/simulation/MissionReport";
import { Challenges } from "@/components/hud/Challenges";
import { NavigationRail } from "@/components/simulation/NavigationRail";
import { OrientationShield } from "@/components/simulation/OrientationShield";

export function Viewport() {
    const role = useStore((state) => state.role);
    const currentStep = useStore((state) => state.currentStep);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Background map based on role
    const backgroundMap: Record<string, string> = {
        "commander": "/assets/cockpit.jpg",
        "mission-control": "/assets/ops-center.jpg",
    };

    // Determine active background
    const currentBg = role ? backgroundMap[role] : null;

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-950">

            {/* 1. Dynamic Environment Background (World Space) */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    {currentBg && (
                        <motion.div
                            key={currentBg}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            <Image
                                src={currentBg}
                                alt="Environment"
                                fill
                                className="object-cover mix-blend-screen"
                                priority
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Starfield Overlay */}
                <div
                    className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0))',
                        backgroundSize: '200px 200px'
                    }}
                />
            </div>

            {/* 2. Trajectory Simulation (World Space) */}
            <Trajectory />

            {/* 3. Interface Layer (HUD Space) */}
            <div className="relative z-20 w-full h-full pointer-events-none">
                <AnimatePresence mode="wait">

                    {/* STEP 0: Role Selection */}
                    {currentStep === 0 && (
                        <RoleSelect key="role-select" />
                    )}

                    {/* STEPS 1-10: Mission Loop */}
                    {currentStep >= 1 && currentStep <= 10 && (
                        <>
                            {/* The Quiz HUD */}
                            <Challenges key="hud" />

                            {/* The Navigation Rail (Bottom Bar) */}
                            <NavigationRail key="nav-rail" />
                        </>
                    )}

                    {/* STEP 11: Mission Report */}
                    {currentStep > 10 && (
                        <MissionReport key="report" />
                    )}

                </AnimatePresence>
            </div>

            {/* 4. Mobile Orientation Guard (Overlay) */}
            <OrientationShield />
        </div>
    );
}