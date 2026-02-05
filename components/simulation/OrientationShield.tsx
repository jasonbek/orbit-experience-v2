'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, RotateCw } from 'lucide-react';

export function OrientationShield() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    return (
        <AnimatePresence>
            {isPortrait && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl text-white p-8 text-center"
                >
                    <motion.div
                        animate={{ rotate: 90 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="mb-8 p-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                    >
                        <Smartphone size={64} className="text-indigo-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                        SYSTEM ROTATION REQUIRED
                    </h1>

                    <p className="max-w-[300px] text-zinc-400 font-mono text-sm leading-relaxed uppercase tracking-widest">
                        The Orbit Experience is optimized for hardware landscape telemetry. Please rotate your device to initiate downlink.
                    </p>

                    <div className="mt-12 flex items-center gap-2 text-zinc-600 font-mono text-[10px] tracking-widest uppercase">
                        <RotateCw size={12} className="animate-spin-slow" />
                        Waiting for Signal Orientation
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
