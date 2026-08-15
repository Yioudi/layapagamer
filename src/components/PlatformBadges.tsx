import React from 'react';

export type PlatformType = 'pc' | 'ps' | 'xbox' | 'switch';

interface Props {
  platforms?: PlatformType[];
}

export const PlatformBadges: React.FC<Props> = ({ platforms = ['pc'] }) => {
  const platformMap: Record<PlatformType, { label: string; color: string; bg: string }> = {
    pc: { label: 'PC', color: 'text-zinc-300', bg: 'bg-zinc-800/80 border-zinc-700' },
    ps: { label: 'PlayStation', color: 'text-blue-400', bg: 'bg-blue-950/50 border-blue-800/60' },
    xbox: { label: 'Xbox', color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-800/60' },
    switch: { label: 'Nintendo', color: 'text-red-400', bg: 'bg-red-950/50 border-red-800/60' },
  };

  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {platforms.map((plat) => {
        const info = platformMap[plat] || platformMap.pc;
        return (
          <span
            key={plat}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${info.bg} ${info.color} flex items-center gap-1`}
          >
            {plat === 'pc' && '💻'}
            {plat === 'ps' && '🟦'}
            {plat === 'xbox' && '🟩'}
            {plat === 'switch' && '🟥'}
            {info.label}
          </span>
        );
      })}
    </div>
  );
};