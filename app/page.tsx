'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const _hasHydrated = useStore((state) => state._hasHydrated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent flickering by waiting for both client mounting and store hydration
  if (!isMounted || !_hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="animate-pulse font-mono text-sm tracking-widest uppercase">
          Initializing Orbital Systems...
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 md:p-8">
      {/* 16:9 Aspect Ratio Locked Container */}
      <div className="w-full max-w-7xl">
        <div className={cn(
          "relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-2xl shadow-indigo-500/10",
          "aspect-video" // This provides the 16:9 aspect ratio lock
        )}>
          {/* Dashboard Content Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-6xl">
              ORBIT V2
            </h1>
            <p className="max-w-[600px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Main dashboard container locked to 16:9 aspect ratio for visual stability.
            </p>

            <div className="flex gap-4">
              <div className="h-2 w-32 rounded-full bg-zinc-800">
                <div className="h-full w-2/3 rounded-full bg-indigo-500" />
              </div>
              <span className="font-mono text-xs text-indigo-400">SYS: STABLE</span>
            </div>
          </div>

          {/* Decorative Corner Brackets */}
          <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-indigo-500/50" />
          <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-indigo-500/50" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-indigo-500/50" />
          <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-indigo-500/50" />
        </div>
      </div>

      <footer className="mt-8 font-mono text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
        Canada ICI // Orbital Experience v2.0
      </footer>
    </main>
  );
}
