import React, { useState, useEffect } from 'react';
import { Search, Loader2, Globe } from 'lucide-react';
import { COUNTRIES, searchITADDeals, type GameComparison } from '../services/games';
import { DealCard } from './DealCard';

export const SearchGames: React.FC = () => {
  const [query, setQuery] = useState('Resident Evil');
  const [country, setCountry] = useState('pe');
  const [games, setGames] = useState<GameComparison[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchITADDeals(query, country);
      setGames(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [country]);

  return (
    <div className="w-full space-y-8">
      {/* Barra de Búsqueda Responsiva (Móvil: vertical | PC: barra unificada) */}
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto bg-[#111114] border border-zinc-800/90 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
      >
        {/* Selector de País */}
        <div className="w-full sm:w-auto flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-2 rounded-xl shrink-0">
          <Globe size={15} className="text-zinc-400 shrink-0" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Seleccionar país para comparar precios"
            className="bg-transparent text-xs sm:text-sm font-semibold text-zinc-200 outline-none cursor-pointer w-full sm:w-auto"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input de Texto */}
        <div className="relative w-full flex-1 flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca un juego (ej: Resident Evil, FIFA, Cyberpunk)..."
            className="w-full bg-zinc-900/40 sm:bg-transparent border sm:border-0 border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-1 sm:focus:ring-0 focus:ring-emerald-500/50"
          />
        </div>

        {/* Botón de Buscar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 active:scale-95 disabled:opacity-50 text-black font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-500/10"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Search size={16} strokeWidth={2.5} />
          )}
          <span>{loading ? 'Buscando...' : 'Comparar'}</span>
        </button>
      </form>

      {/* Grid de Resultados: 1 col en Móvil, 2 en Tablet, 3 en Desktop */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-zinc-900/40 rounded-2xl border border-zinc-800/60"></div>
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {games.map((game) => (
            <DealCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#111114] border border-zinc-800/60 rounded-2xl max-w-lg mx-auto">
          <p className="text-zinc-400 text-sm font-medium">
            No se encontraron resultados para <span className="text-white font-bold">"{query}"</span>.
          </p>
        </div>
      )}
    </div>
  );
};