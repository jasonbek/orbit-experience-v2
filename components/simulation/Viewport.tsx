"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Trajectory } from "@/components/simulation/Trajectory";

export function Viewport() {
    const role = useStore((state) => state.role);

    // Background map based on role
    const backgroundMap = {
        "commander": "/assets/cockpit.jpg",
        "mission-control": "/assets/ops-center.jpg",
    };

    const currentBg = role ? backgroundMap[role] : null;

    return (
        <div className="absolute inset-0 z-0 bg-[#020202]">
            {/* Dynamic Environment Background */}
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

            {/* Trajectory Simulation */}
            <Trajectory />
        </div>
    );
}
