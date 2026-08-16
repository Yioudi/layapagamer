// src/components/HomeDeals.tsx
import React, { useEffect, useState } from 'react';
import { ExternalLink, TrendingDown, AlertCircle } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  pricePEN: string;
  priceUSD?: string;
  originalPEN: string;
  savings: number;
  imageUrl: string;
  dealUrl: string;
}

export const HomeDeals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch('/api/home-deals.json', { signal: controller.signal });
        if (!res.ok) throw new Error('Error al cargar ofertas');
        const data: Deal[] = await res.json();
        setDeals(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#111114] border border-zinc-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
          >
            <div className="w-full aspect-[16/9] bg-zinc-900/80" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-zinc-800/60 rounded-md w-3/4" />
              <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center">
                <div className="space-y-1 w-1/2">
                  <div className="h-3 bg-zinc-800/40 rounded w-1/3" />
                  <div className="h-4 bg-zinc-800/80 rounded w-2/3" />
                </div>
                <div className="h-8 w-16 bg-zinc-800/60 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || deals.length === 0) {
    return (
      <div className="p-8 text-center bg-[#111114] border border-zinc-800/80 rounded-2xl max-w-md mx-auto">
        <AlertCircle size={24} className="text-zinc-500 mx-auto mb-2" />
        <p className="text-xs text-zinc-400 font-medium">
          No hay ofertas destacadas disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {deals.map((item) => (
        <article
          key={item.id}
          className="group bg-[#111114] hover:bg-zinc-900/70 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
        >
          {/* Portada */}
          <div className="relative aspect-[16/9] bg-zinc-950 overflow-hidden border-b border-zinc-800/60">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {item.savings > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-emerald-400 text-black font-black text-[11px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                <TrendingDown size={12} strokeWidth={2.5} />
                -{item.savings}%
              </span>
            )}
          </div>

          {/* Información */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <h4 className="text-zinc-100 font-bold text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h4>

            <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 line-through block leading-none">
                  {item.originalPEN}
                </span>
                <span className="text-sm sm:text-base font-black text-white block mt-0.5">
                  {item.pricePEN}
                </span>
              </div>

              <a
                href={item.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-emerald-400 text-zinc-200 hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                aria-label={`Ver oferta de ${item.title}`}
              >
                <span>Ver</span>
                <ExternalLink size={12} strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};