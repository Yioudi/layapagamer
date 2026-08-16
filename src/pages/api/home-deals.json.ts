// src/pages/api/home-deals.json.ts
export const prerender = false;
import type { APIRoute } from 'astro';

const EXCHANGE_RATE = 3.75;

export const GET: APIRoute = async () => {
  try {
    const res = await fetch('https://www.cheapshark.com/api/1.0/deals?pageSize=8&sortBy=Savings', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error();

    const data = await res.json();
    const deals = data.map((d: any) => {
      const saleUSD = parseFloat(d.salePrice) || 0;
      const normalUSD = parseFloat(d.normalPrice) || saleUSD;
      const savings = Math.round(parseFloat(d.savings) || 0);

      return {
        id: d.dealID,
        title: d.title,
        pricePEN: `S/ ${(saleUSD * EXCHANGE_RATE).toFixed(2)}`,
        priceUSD: `$${saleUSD.toFixed(2)} USD`,
        originalPEN: `S/ ${(normalUSD * EXCHANGE_RATE).toFixed(2)}`,
        savings,
        imageUrl: d.steamAppID && d.steamAppID !== '0'
          ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${d.steamAppID}/header.jpg`
          : d.thumb,
        dealUrl: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`,
      };
    });

    return new Response(JSON.stringify(deals), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};