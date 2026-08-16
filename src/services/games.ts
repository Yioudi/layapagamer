// src/services/games.ts

export type GameItemType = 'BASE_GAME' | 'SPECIAL_EDITION' | 'DLC_EXPANSION' | 'BUNDLE';
export type PriceStatus = 'DISCOUNTED' | 'REGULAR' | 'FREE' | 'UPCOMING';

export interface StoreDeal {
  storeID: string;
  storeName: string;
  rawPrice: number;
  regularPrice: number;
  priceFormatted: string;
  regularFormatted?: string;
  priceUSD?: string;
  savings: number;
  dealUrl: string;
  isFree: boolean;
  isUpcoming: boolean;
}

export interface GameComparison {
  id: string;
  title: string;
  imageUrl: string;
  itemType: GameItemType;
  priceStatus: PriceStatus;
  isUpcoming: boolean;
  isFree: boolean;
  savings: number;
  lowestPriceFormatted: string;
  regularPriceFormatted?: string;
  stores: StoreDeal[];
}

export interface CountryOption {
  code: string;
  name: string;
  currency: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'pe', name: 'Perú (PEN)', currency: 'PEN' },
  { code: 'us', name: 'Estados Unidos (USD)', currency: 'USD' },
  { code: 'ar', name: 'Argentina (ARS)', currency: 'ARS' },
  { code: 'cl', name: 'Chile (CLP)', currency: 'CLP' },
  { code: 'co', name: 'Colombia (COP)', currency: 'COP' },
  { code: 'mx', name: 'México (MXN)', currency: 'MXN' },
];

export function detectItemType(title: string): GameItemType {
  const lower = title.toLowerCase();

  const dlcKeywords = [
    'dlc', 'expansion', 'season pass', 'pass', 'soundtrack', 'ost',
    'pack', 'addon', 'add-on', 'content pack', 'upgrade pack', 'extra content'
  ];
  if (dlcKeywords.some((kw) => lower.includes(kw))) {
    return 'DLC_EXPANSION';
  }

  const editionKeywords = [
    'deluxe', 'ultimate', 'gold edition', 'premium edition',
    'definitive edition', 'goty', 'game of the year', 'collector',
    'director\'s cut', 'enhanced edition', 'complete edition'
  ];
  if (editionKeywords.some((kw) => lower.includes(kw))) {
    return 'SPECIAL_EDITION';
  }

  const bundleKeywords = ['bundle', 'collection', 'trilogy', 'anthology', 'franchise pack'];
  if (bundleKeywords.some((kw) => lower.includes(kw))) {
    return 'BUNDLE';
  }

  return 'BASE_GAME';
}

export async function searchITADDeals(
  query: string,
  country: string = 'pe'
): Promise<GameComparison[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const res = await fetch(
      `/api/search.json?q=${encodeURIComponent(cleanQuery)}&country=${encodeURIComponent(country)}`
    );
    if (!res.ok) throw new Error('Error en la comunicación con el servidor');

    const data = await res.json();
    const rawList = Array.isArray(data.deals) ? data.deals : Array.isArray(data) ? data : [];

    return rawList.map((game: any): GameComparison => {
      const itemType = detectItemType(game.title);
      const stores: StoreDeal[] = (game.stores || []).map((s: any) => {
        const rawPrice = Number(s.rawPrice) || 0;
        const regularPrice = Number(s.regularPrice) || rawPrice;
        const savings = Math.max(0, Number(s.savings) || 0);
        const isUpcoming = Boolean(s.isUpcoming);
        const isFree = Boolean(s.isFree || (rawPrice === 0 && savings === 0 && !isUpcoming));

        return {
          storeID: s.storeID || 'store',
          storeName: s.storeName || 'Tienda Digital',
          rawPrice,
          regularPrice,
          priceFormatted: s.priceFormatted || (isFree ? 'Gratis' : `S/ ${rawPrice.toFixed(2)}`),
          regularFormatted: s.regularFormatted || (regularPrice > rawPrice ? `S/ ${regularPrice.toFixed(2)}` : undefined),
          priceUSD: s.priceUSD,
          savings,
          dealUrl: s.dealUrl || '#',
          isFree,
          isUpcoming,
        };
      });

      stores.sort((a, b) => a.rawPrice - b.rawPrice);

      const cheapest = stores[0];
      let priceStatus: PriceStatus = 'REGULAR';
      let isFree = false;
      let isUpcoming = false;
      let savings = 0;

      if (cheapest) {
        isUpcoming = cheapest.isUpcoming;
        isFree = cheapest.isFree;
        savings = cheapest.savings;

        if (isUpcoming) {
          priceStatus = 'UPCOMING';
        } else if (isFree) {
          priceStatus = 'FREE';
        } else if (savings > 0) {
          priceStatus = 'DISCOUNTED';
        } else {
          priceStatus = 'REGULAR';
        }
      }

      return {
        id: game.id || String(Math.random()),
        title: game.title,
        imageUrl: game.imageUrl || '',
        itemType,
        priceStatus,
        isUpcoming,
        isFree,
        savings,
        lowestPriceFormatted: cheapest ? cheapest.priceFormatted : 'Consultar',
        regularPriceFormatted: cheapest?.regularFormatted,
        stores,
      };
    });
  } catch (error) {
    console.error('Error al obtener datos comparativos:', error);
    return [];
  }
}