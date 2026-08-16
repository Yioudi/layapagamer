// src/services/covers.ts

const SGDB_KEY =
  import.meta.env.STEAMGRIDDB_API_KEY ||
  import.meta.env.SGDB_API_KEY ||
  '';

const coverCache = new Map<string, string>();
const FALLBACK_COVER =
  'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220/header.jpg';

/**
 * Resuelve la carátula en alta definición con estrategia en cascada:
 * 1. CDN oficial de Steam (Cápsula 616x353) si se dispone del AppID.
 * 2. SteamGridDB (600x900 / 920x430) si existe API Key configurada.
 * 3. Fallback genérico de alta disponibilidad.
 */
export async function getGameCover(
  steamAppId?: string | number,
  gameTitle?: string
): Promise<string> {
  const normalizedKey = `${steamAppId || ''}_${gameTitle || ''}`.trim();
  if (!normalizedKey) return FALLBACK_COVER;

  if (coverCache.has(normalizedKey)) {
    return coverCache.get(normalizedKey)!;
  }

  // 1. Steam Direct Capsule CDN
  if (steamAppId && steamAppId !== '0') {
    const steamUrl = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${steamAppId}/capsule_616x353.jpg`;
    coverCache.set(normalizedKey, steamUrl);
    return steamUrl;
  }

  // 2. SteamGridDB API (si la clave está presente)
  if (SGDB_KEY && gameTitle) {
    try {
      const searchRes = await fetch(
        `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameTitle)}`,
        {
          headers: { Authorization: `Bearer ${SGDB_KEY}` },
          signal: AbortSignal.timeout(3000),
        }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.success && searchData.data?.length > 0) {
          const gameId = searchData.data[0].id;
          const gridRes = await fetch(
            `https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900,920x430`,
            {
              headers: { Authorization: `Bearer ${SGDB_KEY}` },
              signal: AbortSignal.timeout(3000),
            }
          );

          if (gridRes.ok) {
            const gridData = await gridRes.json();
            if (gridData.success && gridData.data?.length > 0) {
              const resultUrl = gridData.data[0].url;
              coverCache.set(normalizedKey, resultUrl);
              return resultUrl;
            }
          }
        }
      }
    } catch {
      // Fallback silencioso sin interrumpir la interfaz
    }
  }

  return FALLBACK_COVER;
}