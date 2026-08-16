// src/components/SearchGames.tsx
import React, { useState } from 'react';
import { Search, Loader2, Globe, SearchX, Flame, Filter, Layers, Puzzle, Sparkles } from 'lucide-react';
import { COUNTRIES, searchITADDeals, type GameComparison, type GameItemType } from '../services/games';
import { DealCard } from './DealCard';
import { AuthModal } from './AuthModal';

export const SearchGames: React.FC = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('pe');
  const [games, setGames] = useState<GameComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | GameItemType>('ALL');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const POPULAR_SEARCHES = [
    'Elden Ring',
    'Cyberpunk 2077',
    'Resident Evil 4',
    'God of War',
    'Grand Theft Auto V',
    'Red Dead Redemption 2',
  ];

  const handleSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setHasSearched(true);
    setSelectedFilter('ALL');

    try {
      const results = await searchITADDeals(trimmed, country);
      setGames(results);
    } catch (err) {
      console.error('Error al realizar búsqueda:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const filteredGames = games.filter((g) => {
    if (selectedFilter === 'ALL') return true;
    return g.itemType === selectedFilter;
  });

  return (
    <div className="w-full space-y-8">
      {/* Formulario de Búsqueda Principal */}
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto bg-[#111114] border border-zinc-800 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-zinc-700 transition-colors"
      >
        {/* Selector de País */}
        <div className="w-full sm:w-auto flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl shrink-0">
          <Globe size={14} className="text-zinc-400 shrink-0" />
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              if (query.trim()) handleSearch(query);
            }}
            aria-label="Seleccionar región de cotización"
            className="bg-transparent text-xs font-semibold text-zinc-200 outline-none cursor-pointer w-full sm:w-auto"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="w-full flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe el nombre de tu juego (ej: Persona 5, Final Fantasy)..."
            className="w-full bg-zinc-900/50 sm:bg-transparent border sm:border-0 border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>

        {/* Botón Buscar */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 active:scale-98 disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-md shadow-emerald-950/20"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Search size={15} strokeWidth={2.4} />
          )}
          <span>{loading ? 'Buscando...' : 'Comparar'}</span>
        </button>
      </form>

      {/* Sugerencias Rápidas */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mr-1">
          <Flame size={13} className="text-emerald-400" /> Búsquedas populares:
        </span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setQuery(item);
              handleSearch(item);
            }}
            className="text-xs text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 hover:text-white border border-zinc-800 px-3 py-1 rounded-full transition-all"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Barra de Filtros por Tipo de Contenido (Aparece tras la búsqueda) */}
      {games.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Filter size={14} className="text-emerald-400" />
            <span>Filtrar por tipo:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'ALL'
                  ? 'bg-emerald-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Todos ({games.length})
            </button>
            <button
              onClick={() => setSelectedFilter('BASE_GAME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'BASE_GAME'
                  ? 'bg-emerald-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Juegos Base
            </button>
            <button
              onClick={() => setSelectedFilter('SPECIAL_EDITION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'SPECIAL_EDITION'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Ediciones Especiales
            </button>
            <button
              onClick={() => setSelectedFilter('DLC_EXPANSION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'DLC_EXPANSION'
                  ? 'bg-purple-400 text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              DLCs y Expansiones
            </button>
          </div>
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[380px] bg-[#111114] rounded-2xl border border-zinc-800/80" />
          ))}
        </div>
      ) : hasSearched && filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredGames.map((game) => (
            <DealCard
              key={game.id}
              game={game}
              onRequireAuth={() => setAuthModalOpen(true)}
            />
          ))}
        </div>
      ) : hasSearched && filteredGames.length === 0 ? (
        <div className="text-center py-14 bg-[#111114] border border-zinc-800/80 rounded-2xl max-w-md mx-auto p-6 space-y-2">
          <SearchX size={24} className="text-zinc-500 mx-auto" />
          <p className="text-zinc-300 text-sm font-medium">
            No se encontraron ediciones para el filtro seleccionado
          </p>
          <p className="text-zinc-500 text-xs">
            Intenta cambiar el filtro a "Todos" o busca otro término.
          </p>
        </div>
      ) : null}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};