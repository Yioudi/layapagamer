// src/pages/api/search.json.ts
export const prerender = false;
import type { APIRoute } from 'astro';

const ITAD_KEY = import.meta.env.ITAD_API_KEY || 'bbd85142fead27c3efd53a1bbd1b7ad7e91e5dbe';
const EXCHANGE_RATE_PEN = 3.75;

interface CacheEntry {
  data: any[];
  expires: number;
}

const memoryCache = new Map<string, CacheEntry>();
const TTL = 1000 * 60 * 10; // 10 minutos

function cleanKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim() || '';
  const country = url.searchParams.get('country')?.trim() || 'pe';

  if (!query) {
    return new Response(JSON.stringify({ deals: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cacheKey = `${cleanKey(query)}_${country}`;
  const now = Date.now();

  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey)!;
    if (now < cached.expires) {
      return new Response(JSON.stringify({ deals: cached.data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }
    memoryCache.delete(cacheKey);
  }

  const encoded = encodeURIComponent(query);
  const itemsMap = new Map<string, any>();

  try {
    // 1. Consultas simultáneas con timeout protegido
    const [steamRes, itadRes] = await Promise.allSettled([
      fetch(`https://store.steampowered.com/api/storesearch/?term=${encoded}&cc=${country}&l=spanish`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000),
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.isthereanydeal.com/games/search/v1?key=${ITAD_KEY}&title=${encoded}&results=6`, {
        signal: AbortSignal.timeout(4000),
      }).then((r) => (r.ok ? r.json() : null)),
    ]);

    // 2. Procesar resultados de Steam Store
    const steamData = steamRes.status === 'fulfilled' ? steamRes.value : null;
    if (steamData?.items?.length) {
      for (const item of steamData.items) {
        const key = cleanKey(item.name);
        const priceInfo = item.price;
        
        let rawPrice = 0;
        let regularPrice = 0;
        let savings = 0;
        let isFree = false;

        if (priceInfo) {
          rawPrice = (priceInfo.final || 0) / 100;
          regularPrice = (priceInfo.initial || priceInfo.final || 0) / 100;
          savings = priceInfo.discount_percent || 0;
          isFree = rawPrice === 0 && savings === 0;
        } else {
          isFree = true;
        }

        const priceFormatted = isFree ? 'Gratis' : `S/ ${rawPrice.toFixed(2)}`;
        const regularFormatted = regularPrice > rawPrice ? `S/ ${regularPrice.toFixed(2)}` : undefined;
        const priceUSD = isFree ? undefined : `$${(rawPrice / EXCHANGE_RATE_PEN).toFixed(2)} USD`;

        itemsMap.set(key, {
          id: `steam-${item.id}`,
          title: item.name,
          imageUrl: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
          stores: [
            {
              storeID: 'steam',
              storeName: 'Steam',
              rawPrice,
              regularPrice,
              priceFormatted,
              regularFormatted,
              priceUSD,
              savings,
              dealUrl: `https://store.steampowered.com/app/${item.id}`,
              isFree,
              isUpcoming: false,
            },
          ],
        });
      }
    }

    // 3. Procesar resultados de IsThereAnyDeal (Epic, GOG, Fanatical)
    const itadData = itadRes.status === 'fulfilled' ? itadRes.value : null;
    if (Array.isArray(itadData) && itadData.length > 0) {
      const itadIds = itadData.map((g: any) => g.id);

      const pricesRes = await fetch(`https://api.isthereanydeal.com/games/prices/v2?key=${ITAD_KEY}&country=US`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itadIds),
        signal: AbortSignal.timeout(4000),
      });

      if (pricesRes.ok) {
        const pricesList: any[] = await pricesRes.json();
        const priceMap = new Map(pricesList.map((p) => [p.id, p.deals || []]));

        for (const game of itadData) {
          const deals = priceMap.get(game.id) || [];
          if (!deals.length) continue;

          const key = cleanKey(game.title);
          const formattedDeals = deals.map((d: any) => {
            const usd = d.price?.amount ?? 0;
            const regUsd = d.regular?.amount ?? usd;
            const savings = d.cut || 0;
            const rawPrice = Number((usd * EXCHANGE_RATE_PEN).toFixed(2));
            const regularPrice = Number((regUsd * EXCHANGE_RATE_PEN).toFixed(2));
            const isFree = usd === 0;

            return {
              storeID: String(d.shop?.id || d.shop?.name).toLowerCase(),
              storeName: d.shop?.name || 'Tienda Digital',
              rawPrice,
              regularPrice,
              priceFormatted: isFree ? 'Gratis' : `S/ ${rawPrice.toFixed(2)}`,
              regularFormatted: regularPrice > rawPrice ? `S/ ${regularPrice.toFixed(2)}` : undefined,
              priceUSD: isFree ? undefined : `$${usd.toFixed(2)} USD`,
              savings,
              dealUrl: d.url || `https://isthereanydeal.com`,
              isFree,
              isUpcoming: false,
            };
          });

          if (itemsMap.has(key)) {
            const existing = itemsMap.get(key);
            for (const offer of formattedDeals) {
              if (!existing.stores.some((s: any) => s.storeName.toLowerCase() === offer.storeName.toLowerCase())) {
                existing.stores.push(offer);
              }
            }
          } else {
            itemsMap.set(key, {
              id: `itad-${game.id}`,
              title: game.title,
              imageUrl: game.assets?.banner300 || game.assets?.boxart || 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220/header.jpg',
              stores: formattedDeals,
            });
          }
        }
      }
    }

    const deals = Array.from(itemsMap.values()).map((game) => {
      game.stores.sort((a: any, b: any) => a.rawPrice - b.rawPrice);
      return game;
    });

    memoryCache.set(cacheKey, { data: deals, expires: now + TTL });

    return new Response(JSON.stringify({ deals }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ deals: [] }), { status: 200 });
  }
};