import React, { useState } from 'react';
import { Clock, Gamepad2, Sparkles, ExternalLink, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import type { GameComparison } from '../services/games';

interface Props {
  game: GameComparison;
}

export const DealCard: React.FC<Props> = ({ game }) => {
  const [imgError, setImgError] = useState(false);
  const [showAllStores, setShowAllStores] = useState(false);

  const cheapestStore = game.stores && game.stores.length > 0 ? game.stores[0] : null;
  const isUpcoming = Boolean(game.isUpcoming && !game.isFree);
  const isFree = Boolean(game.isFree || cheapestStore?.isFree || (cheapestStore && cheapestStore.rawPrice === 0 && !isUpcoming));

  const INITIAL_LIMIT = 3;
  const hasMoreStores = game.stores.length > INITIAL_LIMIT;
  const visibleStores = showAllStores ? game.stores : game.stores.slice(0, INITIAL_LIMIT);

  return (
    <div className="bg-[#111114] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/90 transition-all duration-300 flex flex-col shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 group w-full self-start">
      
      {/* 1. Portada HD con altura adaptable */}
      <div className="relative w-full h-48 sm:h-52 bg-zinc-950 overflow-hidden flex items-center justify-center shrink-0 border-b border-zinc-800/60">
        {!imgError && game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900/80">
            <span className="text-emerald-400 font-extrabold text-sm tracking-wider uppercase">
              LA YAPA GAMER
            </span>
            <span className="text-zinc-500 text-xs mt-1 line-clamp-1">{game.title}</span>
          </div>
        )}

        {/* Badges de Estado */}
        {isUpcoming ? (
          <div className="absolute top-3 right-3 bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <Clock size={12} strokeWidth={2.5} />
            <span>PRÓXIMAMENTE</span>
          </div>
        ) : isFree ? (
          <div className="absolute top-3 right-3 bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5">
            <Gamepad2 size={13} strokeWidth={2.5} />
            <span>FREE TO PLAY</span>
          </div>
        ) : cheapestStore && cheapestStore.savings > 0 ? (
          <div className="absolute top-3 right-3 bg-emerald-500 text-black font-black text-xs px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
            <Sparkles size={11} strokeWidth={2.5} />
            <span>-{cheapestStore.savings}% YAPA</span>
          </div>
        ) : null}
      </div>

      {/* 2. Información del Juego */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-white font-bold text-base sm:text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {game.title}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 shrink-0 flex items-center gap-1 mt-0.5">
              <Monitor size={11} />
              <span>PC</span>
            </span>
          </div>

          <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider block">
            {isUpcoming 
              ? 'Lanzamiento pendiente' 
              : isFree 
              ? 'Acceso Gratuito' 
              : `${game.stores.length} ${game.stores.length === 1 ? 'tienda comparada' : 'tiendas comparadas'}`}
          </span>
        </div>

        {/* 3. Filas de Tiendas con Espaciado Blindado */}
        <div className="space-y-2">
          {visibleStores.map((store, index) => {
            const isCheapest = index === 0 && !store.isUpcoming && !store.isFree;

            return (
              <div
                key={store.storeID + index}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs gap-3 transition-colors ${
                  store.isUpcoming
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : store.isFree
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                    : isCheapest
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300'
                }`}
              >
                {/* Lado Izquierdo: Nombre + Badge (Nunca se desborda) */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-bold text-zinc-100 text-xs sm:text-sm truncate">
                    {store.storeName}
                  </span>
                  {isCheapest && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide shrink-0">
                      MÁS BARATO
                    </span>
                  )}
                </div>

                {/* Lado Derecho: Precios + Botón (Fijos y Alineados) */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className={`font-black text-xs sm:text-sm block leading-none ${
                      store.isUpcoming 
                        ? 'text-amber-400' 
                        : store.isFree 
                        ? 'text-cyan-400' 
                        : 'text-white'
                    }`}>
                      {store.priceFormatted}
                    </span>
                    {store.priceUSD && (
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {store.priceUSD}
                      </span>
                    )}
                  </div>

                  <a
                    href={store.dealUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 flex items-center gap-1 ${
                      store.isUpcoming
                        ? 'bg-amber-500 hover:bg-amber-400 text-black'
                        : store.isFree
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                        : isCheapest
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    <span>{store.isFree ? 'Jugar' : 'Ver'}</span>
                    <ExternalLink size={11} strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Botón Ver más tiendas */}
        {hasMoreStores && (
          <button
            onClick={() => setShowAllStores(!showAllStores)}
            className="w-full py-2 px-3 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-800/60 rounded-lg border border-zinc-800/60 transition-colors flex items-center justify-center gap-1.5"
          >
            {showAllStores ? (
              <>
                <span>Mostrar menos</span>
                <ChevronUp size={13} />
              </>
            ) : (
              <>
                <span>Ver {game.stores.length - INITIAL_LIMIT} tiendas más</span>
                <ChevronDown size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};