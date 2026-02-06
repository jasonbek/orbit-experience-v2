"use client";

import { useCallback } from "react";

export function useSoundSystem() {

    const play = useCallback((path: string, volume: number = 0.5) => {
        try {
            const audio = new Audio(path);
            audio.volume = volume;
            audio.play().catch(() => {
                // Ignore autoplay blocks
            });
        } catch (err) {
            console.warn("Audio system unreachable");
        }
    }, []);

    const playClick = () => play("/sounds/click.mp3", 0.4);
    const playNotification = () => play("/sounds/notification.mp3", 0.6);
    const playSuccess = () => play("/sounds/success.mp3", 0.6);
    const playError = () => play("/sounds/error.mp3", 0.5);

    return { playClick, playNotification, playSuccess, playError };
}
