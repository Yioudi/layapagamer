const SGDB_KEY = import.meta.env.STEAMGRIDDB_API_KEY || '';

export async function getGameGridCover(gameTitle: string): Promise<string | null> {
  if (!SGDB_KEY) return null;

  try {
    // 1. Buscar el ID del juego en SteamGridDB
    const searchRes = await fetch(
      `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(gameTitle)}`,
      {
        headers: {
          Authorization: `Bearer ${SGDB_KEY}`,
        },
      }
    );

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    if (searchData.success && searchData.data.length > 0) {
      const gameId = searchData.data[0].id;

      // 2. Obtener las carátulas verticales (600x900) del juego
      const gridRes = await fetch(
        `https://www.steamgriddb.com/api/v2/grids/game/${gameId}?dimensions=600x900`,
        {
          headers: {
            Authorization: `Bearer ${SGDB_KEY}`,
          },
        }
      );

      if (gridRes.ok) {
        const gridData = await gridRes.json();
        if (gridData.success && gridData.data.length > 0) {
          return gridData.data[0].url; // URL directa de la carátula en alta definición
        }
      }
    }
  } catch (err) {
    console.error('Error al obtener imagen de SteamGridDB:', err);
  }

  return null;
}