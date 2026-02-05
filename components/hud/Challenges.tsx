'use client';

import { useStore } from '@/store/useStore';
import { milestones } from '@/data/milestones';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Challenges() {
    // Atomic Selectors for performance
    const currentMilestoneIndex = useStore((state) => state.currentMilestoneIndex);
    const isShaking = useStore((state) => state.isShaking);
    const correctPulse = useStore((state) => state.correctPulse);
    const checkAnswer = useStore((state) => state.checkAnswer);

    const milestone = milestones[currentMilestoneIndex];

    if (!milestone) return null;

    return (
        <div className="flex w-full max-w-md flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        x: isShaking ? [0, -4, 4, -4, 4, 0] : 0
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        y: { type: 'spring', stiffness: 400, damping: 30 },
                        x: { duration: 0.4, ease: 'easeInOut' }
                    }}
                    className={cn(
                        "relative w-full rounded-xl p-px",
                        "bg-gradient-to-b from-white/10 to-transparent",
                        "shadow-2xl backdrop-blur-xl",
                        correctPulse && "animate-pulse-line"
                    )}
                >
                    {/* Inner Content Area - Rauno 1px Law */}
                    <div className="flex flex-col space-y-4 rounded-[11px] bg-black/80 p-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <div className="flex flex-col">
                                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                                    Transmission #{milestone.number}
                                </span>
                                <span className="text-xs font-medium text-indigo-400 capitalize">
                                    {milestone.subject}
                                </span>
                            </div>
                            <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </div>

                        <h2 className="text-lg font-semibold tracking-tight text-white">
                            {milestone.question}
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {milestone.options.map((option) => (
                                <button
                                    key={option}
                                    onPointerDown={() => checkAnswer(milestone.id, option)}
                                    className={cn(
                                        "group relative flex items-center justify-center rounded-lg border border-white/5 bg-white/5 py-4 transition-all hover:bg-white/10 active:scale-95",
                                        "before:absolute before:inset-0 before:rounded-lg before:opacity-0 before:transition-opacity hover:before:opacity-100",
                                        "before:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                                    )}
                                >
                                    <span className="font-mono text-sm text-zinc-400 group-hover:text-white">
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <button
                            className={cn(
                                "w-full rounded-lg border border-indigo-500/20 bg-indigo-500/10 py-3 font-mono text-xs font-bold tracking-widest text-indigo-400 uppercase transition-all hover:bg-indigo-500/20 active:scale-98",
                                "shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                            )}
                        >
                            {milestone.cta}
                        </button>
                    </div>

                    {/* Grain/Noise Overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.03]"
                        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
