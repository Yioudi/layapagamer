// src/services/covers.ts

const SGDB_API_KEY = import.meta.env.SGDB_API_KEY || ''; // Opcional si tienes key de steamgriddb.com

const coverCache = new Map<string, string>();

/**
 * Obtiene la portada en la máxima resolución posible.
 * 1. Intenta SteamGridDB si hay API Key.
 * 2. Si no, usa el formato de cápsula HD de Steam (616x353 px).
 * 3. Fallback al header tradicional de Steam.
 */
export async function getGameCover(steamAppId?: string | number, gameTitle?: string): Promise<string> {
  const cacheKey = `${steamAppId || ''}_${gameTitle || ''}`;
  if (coverCache.has(cacheKey)) {
    return coverCache.get(cacheKey)!;
  }

  // 1. Si tenemos AppID de Steam, construir la carátula HD oficial directa (sin límites de cuota)
  if (steamAppId) {
    const steamHdUrl = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/capsule_616x353.jpg`;
    coverCache.set(cacheKey, steamHdUrl);
    return steamHdUrl;
  }

  // 2. Si es de otra tienda (Epic, GOG) y tenemos clave de SteamGridDB
  if (SGDB_API_KEY && gameTitle) {
    try {
      const searchRes = await fetch(
        `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameTitle)}`,
        { headers: { Authorization: `Bearer ${SGDB_API_KEY}` } }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.success && searchData.data.length > 0) {
          const gameId = searchData.data[0].id;
          const gridRes = await fetch(
            `https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900,920x430`,
            { headers: { Authorization: `Bearer ${SGDB_API_KEY}` } }
          );

          if (gridRes.ok) {
            const gridData = await gridRes.json();
            if (gridData.success && gridData.data.length > 0) {
              const coverUrl = gridData.data[0].url;
              coverCache.set(cacheKey, coverUrl);
              return coverUrl;
            }
          }
        }
      }
    } catch {
      // Fallback silencioso
    }
  }

  // 3. Fallback genérico de alta resolución
  return 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220/header.jpg';
}