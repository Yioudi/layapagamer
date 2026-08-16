// src/components/PlatformBadges.tsx
import React from 'react';
import { Monitor, Gamepad2, Tv, Radio } from 'lucide-react';

export type PlatformType = 'pc' | 'ps' | 'xbox' | 'switch';

interface Props {
  platforms?: PlatformType[];
}

const PLATFORM_CONFIG: Record<
  PlatformType,
  { label: string; icon: React.FC<{ size: number; className?: string }>; color: string; bg: string }
> = {
  pc: {
    label: 'PC',
    icon: Monitor,
    color: 'text-zinc-300',
    bg: 'bg-zinc-900 border-zinc-800',
  },
  ps: {
    label: 'PlayStation',
    icon: Gamepad2,
    color: 'text-blue-400',
    bg: 'bg-blue-950/40 border-blue-800/50',
  },
  xbox: {
    label: 'Xbox',
    icon: Tv,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40 border-emerald-800/50',
  },
  switch: {
    label: 'Nintendo',
    icon: Radio,
    color: 'text-red-400',
    bg: 'bg-red-950/40 border-red-800/50',
  },
};

export const PlatformBadges: React.FC<Props> = ({ platforms = ['pc'] }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {platforms.map((plat) => {
        const config = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.pc;
        const IconComponent = config.icon;

        return (
          <span
            key={plat}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.bg} ${config.color} flex items-center gap-1`}
          >
            <IconComponent size={11} className="shrink-0" />
            <span>{config.label}</span>
          </span>
        );
      })}
    </div>
  );
};