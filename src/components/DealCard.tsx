// src/components/DealCard.tsx
import React, { useState } from 'react';
import { Clock, Gamepad2, ExternalLink, Monitor, ChevronDown, ChevronUp, ArrowDownRight, Layers, Puzzle, Sparkles } from 'lucide-react';
import type { GameComparison, GameItemType } from '../services/games';
import { FavoriteButton } from './FavoriteButton';

interface Props {
  game: GameComparison;
  onRequireAuth?: () => void;
}

export const DealCard: React.FC<Props> = ({ game, onRequireAuth }) => {
  const [imgError, setImgError] = useState(false);
  const [showAllStores, setShowAllStores] = useState(false);

  const cheapestStore = game.stores?.[0] || null;
  const INITIAL_LIMIT = 3;
  const hasMoreStores = (game.stores?.length || 0) > INITIAL_LIMIT;
  const visibleStores = showAllStores ? game.stores : game.stores?.slice(0, INITIAL_LIMIT) || [];

  const renderTypeBadge = (type: GameItemType) => {
    switch (type) {
      case 'DLC_EXPANSION':
        return (
          <span className="bg-purple-950/70 border border-purple-500/40 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Puzzle size={10} /> DLC / Expansión
          </span>
        );
      case 'SPECIAL_EDITION':
        return (
          <span className="bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles size={10} /> Edición Especial
          </span>
        );
      case 'BUNDLE':
        return (
          <span className="bg-blue-950/70 border border-blue-500/40 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Layers size={10} /> Pack / Bundle
          </span>
        );
      default:
        return (
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Monitor size={10} /> Juego Base
          </span>
        );
    }
  };

  return (
    <article className="group bg-[#111114] rounded-2xl border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col shadow-lg shadow-black/40 overflow-hidden">
      
      {/* Portada */}
      <div className="relative w-full aspect-[16/9] bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-800/60">
        {!imgError && game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900">
            <span className="text-zinc-500 font-bold text-xs tracking-widest uppercase">LA YAPA GAMER</span>
            <span className="text-zinc-600 text-[11px] mt-1 line-clamp-1">{game.title}</span>
          </div>
        )}

        {/* Botón Favorito */}
        <div className="absolute top-3 left-3 z-10">
          <FavoriteButton
            gameId={game.id}
            gameTitle={game.title}
            imageUrl={game.imageUrl}
            currentPricePEN={cheapestStore?.rawPrice || 0}
            onRequireAuth={onRequireAuth}
          />
        </div>

        {/* Badge de Estado Comercial */}
        <div className="absolute top-3 right-3 z-10">
          {game.priceStatus === 'UPCOMING' ? (
            <span className="bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <Clock size={11} strokeWidth={2.5} /> Próximamente
            </span>
          ) : game.priceStatus === 'FREE' ? (
            <span className="bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <Gamepad2 size={11} strokeWidth={2.5} /> Gratuito
            </span>
          ) : game.priceStatus === 'DISCOUNTED' && game.savings > 0 ? (
            <span className="bg-emerald-400 text-black font-black text-xs px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <ArrowDownRight size={13} strokeWidth={3} /> -{game.savings}% OFF
            </span>
          ) : (
            <span className="bg-zinc-800/90 text-zinc-300 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-md border border-zinc-700">
              Precio Regular
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {renderTypeBadge(game.itemType)}
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              {game.stores.length} {game.stores.length === 1 ? 'tienda' : 'tiendas'}
            </span>
          </div>

          <h3 className="text-zinc-100 font-bold text-base leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {game.title}
          </h3>
        </div>

        {/* Tiendas */}
        <div className="space-y-1.5">
          {visibleStores.map((store, index) => {
            const isCheapest = index === 0 && !store.isUpcoming && !store.isFree;

            return (
              <div
                key={`${store.storeID}-${index}`}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                  isCheapest
                    ? 'bg-emerald-950/25 border-emerald-500/40'
                    : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-semibold text-zinc-200 truncate text-xs">
                    {store.storeName}
                  </span>
                  {isCheapest && (
                    <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase shrink-0">
                      Mínimo
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`font-black text-xs sm:text-sm block ${
                      store.isUpcoming
                        ? 'text-amber-400'
                        : store.isFree
                        ? 'text-cyan-400'
                        : isCheapest
                        ? 'text-emerald-400'
                        : 'text-zinc-200'
                    }`}>
                      {store.priceFormatted}
                    </span>
                    {store.regularFormatted && store.savings > 0 && (
                      <span className="text-[10px] text-zinc-500 line-through block -mt-0.5">
                        {store.regularFormatted}
                      </span>
                    )}
                  </div>

                  <a
                    href={store.dealUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg font-bold transition-all flex items-center justify-center ${
                      isCheapest
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-black'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                    aria-label={`Ver oferta en ${store.storeName}`}
                  >
                    <ExternalLink size={13} strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ver más tiendas */}
        {hasMoreStores && (
          <button
            onClick={() => setShowAllStores(!showAllStores)}
            className="w-full py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/60 rounded-xl border border-zinc-800/60 transition-colors flex items-center justify-center gap-1.5"
          >
            {showAllStores ? (
              <>
                <span>Mostrar menos</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Ver {game.stores.length - INITIAL_LIMIT} tiendas adicionales</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};