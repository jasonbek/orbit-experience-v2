'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrientationShield } from '@/components/simulation/OrientationShield';
import { Trajectory } from '@/components/simulation/Trajectory';
import { Challenges } from '@/components/hud/Challenges';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OrbitDashboard() {
  const _hasHydrated = useStore((state) => state._hasHydrated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !_hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="animate-pulse font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-500">
          Initializing Orbital Downlink...
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050505] p-4 md:p-12 overflow-hidden">
      {/* Mobile Safety Rail */}
      <OrientationShield />

      {/* Unified Viewport: 16:9 Aspect Ratio Lock */}
      <div className="w-full max-w-[1920px] mx-auto">
        <div className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)]",
          "before:absolute before:inset-0 before:z-50 before:pointer-events-none before:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]"
        )}>

          {/* Layer 1: Simulation (Trajectory & Space) */}
          <div className="absolute inset-0 z-0 bg-[#020202]">
            {/* Subtle Starfield Overlay */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0))',
                backgroundSize: '200px 200px'
              }}
            />
            <Trajectory />
          </div>

          {/* Layer 2: HUD Interface (Challenges) */}
          <div className="z-10">
            <Challenges />
          </div>

          {/* Layer 3: Perimeter Data (Cosmetic HUD) */}
          <div className="absolute inset-0 z-20 pointer-events-none p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="font-mono text-[10px] text-zinc-500 tracking-tighter">MISSION STATUS</div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <div className="font-mono text-xs text-white uppercase tracking-widest">TELEM_ACTIVE</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] text-zinc-500 tracking-tighter">COORD_SYSTEM</div>
                <div className="font-mono text-xs text-zinc-300">UTM_WGS84_V2.1</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="font-mono text-[9px] text-zinc-700 tracking-[0.3em] uppercase">
                © 2025 Canada ICI // Orbital Dynamics
              </div>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-[1px] bg-white/5" />
                ))}
              </div>
            </div>
          </div>

          {/* Layer 4: Grain/Noise (Rauno Texture) */}
          <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

          {/* Rauno 1px Inner Lighting */}
          <div className="absolute inset-0 z-50 pointer-events-none rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
        </div>
      </div>
    </main>
  );
}
