export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // 1. Obtener Ofertas del Día desde CheapShark / Steam
    const dealsRes = await fetch('https://www.cheapshark.com/api/1.0/deals?pageSize=8&sortBy=Savings');
    const deals = dealsRes.ok ? await dealsRes.json() : [];

    // 2. Próximos Lanzamientos (RAWG API)
    const RAWG_KEY = import.meta.env.RAWG_API_KEY || '';
    let upcoming = [];
    if (RAWG_KEY) {
      const rawgRes = await fetch(
        `https://api.rawg.io/api/games?key=${RAWG_KEY}&dates=2026-08-01,2027-01-01&ordering=released&page_size=6`
      );
      if (rawgRes.ok) {
        const rawgData = await rawgRes.json();
        upcoming = rawgData.results;
      }
    }

    return new Response(
      JSON.stringify({
        dailyDeals: deals,
        upcomingReleases: upcoming,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ dailyDeals: [], upcomingReleases: [] }), { status: 200 });
  }
};