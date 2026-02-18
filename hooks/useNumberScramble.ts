import { useState, useEffect, useRef } from "react";

const SCRAMBLE_DURATION_MS = 1200;
const RESOLVE_DURATION_MS = 300;
const LOCKOUT_DURATION_MS = 300;

const DIGITS = "0123456789";

/**
 * Animates a number string through three phases:
 *   1. Scramble  (0 → SCRAMBLE_DURATION_MS): rapid random digit cycling per position
 *   2. Resolve   (SCRAMBLE_DURATION_MS → +RESOLVE_DURATION_MS): digits lock in left-to-right
 *   3. Lock-in   (resolved → +LOCKOUT_DURATION_MS): spring scale pulse (driven by `isLockedIn`)
 *
 * Non-digit characters (commas, %, spaces) are preserved throughout.
 * Resets automatically when `target` changes.
 */
export function useNumberScramble(target: string) {
    const [display, setDisplay] = useState(target);
    const [isLockedIn, setIsLockedIn] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lockoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear any in-flight animation from a previous target
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (lockoutRef.current) clearTimeout(lockoutRef.current);
        setIsLockedIn(false);
        setDisplay(target);

        const totalDuration = SCRAMBLE_DURATION_MS + RESOLVE_DURATION_MS;
        const tickMs = 50; // ~20fps
        const totalTicks = Math.round(totalDuration / tickMs);
        let tick = 0;

        // Separate interval rates per digit position for an organic feel
        const digitPositions = target.split("").map((char, i) => ({
            char,
            isDigit: DIGITS.includes(char),
            // Stagger the scramble rate slightly per position (±10ms)
            tickRate: 1 + (i % 3) * 0.15,
        }));

        intervalRef.current = setInterval(() => {
            tick++;
            const progress = tick / totalTicks;
            // How many digit positions have locked in (left-to-right resolve)
            const lockedCount = progress >= 1
                ? digitPositions.length
                : Math.floor((Math.max(0, progress - SCRAMBLE_DURATION_MS / totalDuration) / (RESOLVE_DURATION_MS / totalDuration)) * digitPositions.length);

            const scrambled = digitPositions
                .map((pos, i) => {
                    if (!pos.isDigit) return pos.char; // preserve separators
                    if (i < lockedCount) return pos.char; // digit locked in
                    // Scramble: vary the flip rate per position
                    const shouldFlip = (tick * pos.tickRate) % 1 < 0.85;
                    return shouldFlip
                        ? DIGITS[Math.floor(Math.random() * DIGITS.length)]
                        : pos.char;
                })
                .join("");

            setDisplay(scrambled);

            if (tick >= totalTicks) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplay(target);
                // Brief delay then trigger the lock-in pulse
                lockoutRef.current = setTimeout(() => {
                    setIsLockedIn(true);
                }, 50);
            }
        }, tickMs);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (lockoutRef.current) clearTimeout(lockoutRef.current);
        };
    }, [target]);

    return { display, isLockedIn, LOCKOUT_DURATION_MS };
}
