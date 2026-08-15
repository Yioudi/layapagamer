const RAWG_KEY = import.meta.env.RAWG_API_KEY || '';

export async function getGameCover(gameTitle: string): Promise<string | null> {
  if (!RAWG_KEY) return null;

  try {
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(gameTitle)}&page_size=1`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].background_image;
      }
    }
  } catch (err) {
    console.error('Error al obtener carátula de RAWG:', err);
  }
  return null;
}