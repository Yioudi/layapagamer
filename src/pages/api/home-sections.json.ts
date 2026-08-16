// src/pages/api/home-sections.json.ts
export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const rawgKey = import.meta.env.RAWG_API_KEY || '';

  try {
    const [dealsRes, rawgRes] = await Promise.allSettled([
      fetch('https://www.cheapshark.com/api/1.0/deals?pageSize=8&sortBy=Savings', {
        signal: AbortSignal.timeout(4000),
      }).then((r) => (r.ok ? r.json() : [])),
      rawgKey
        ? fetch(`https://api.rawg.io/api/games?key=${rawgKey}&dates=2026-08-01,2027-01-01&ordering=released&page_size=6`, {
            signal: AbortSignal.timeout(4000),
          }).then((r) => (r.ok ? r.json() : { results: [] }))
        : Promise.resolve({ results: [] }),
    ]);

    return new Response(
      JSON.stringify({
        dailyDeals: dealsRes.status === 'fulfilled' ? dealsRes.value : [],
        upcomingReleases: rawgRes.status === 'fulfilled' ? rawgRes.value.results || [] : [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=600' },
      }
    );
  } catch {
    return new Response(JSON.stringify({ dailyDeals: [], upcomingReleases: [] }), { status: 200 });
  }
};