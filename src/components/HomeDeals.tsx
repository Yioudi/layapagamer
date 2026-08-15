import React, { useEffect, useState } from 'react';
import { ExternalLink, Flame } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  pricePEN: string;
  priceUSD: string;
  originalPEN: string;
  savings: number;
  imageUrl: string;
  dealUrl: string;
}

export const HomeDeals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home-deals.json')
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-60 bg-zinc-900/60 rounded-2xl border border-zinc-800/80"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {deals.map((item) => (
        <a
          key={item.id}
          href={item.dealUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-[#111114] hover:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20"
        >
          <div className="relative h-36 bg-black overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-black font-black text-xs px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Flame size={11} strokeWidth={3} />
              <span>-{item.savings}% YAPA</span>
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <h4 className="text-zinc-100 font-bold text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h4>

            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 line-through block leading-none">
                  {item.originalPEN}
                </span>
                <span className="text-base font-extrabold text-white">
                  {item.pricePEN}
                </span>
              </div>
              <span className="bg-zinc-800 text-zinc-300 group-hover:bg-emerald-500 group-hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                <span>Ver</span>
                <ExternalLink size={11} strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};