export interface StoreOffer {
  storeID: string;
  storeName: string;
  priceFormatted: string;
  priceUSD?: string;
  originalPriceFormatted?: string | null;
  savings: number;
  rawPrice: number;
  isUpcoming?: boolean;
  isFree?: boolean;
  dealUrl: string;
}

export interface GameComparison {
  id: string;
  title: string;
  type?: string;
  imageUrl: string;
  isUpcoming?: boolean;
  isFree?: boolean;
  stores: StoreOffer[];
}

export const COUNTRIES = [
  { code: 'pe', name: '🇵🇪 Perú' },
  { code: 'mx', name: '🇲🇽 México' },
  { code: 'ar', name: '🇦🇷 Argentina' },
  { code: 'cl', name: '🇨🇱 Chile' },
  { code: 'co', name: '🇨🇴 Colombia' },
  { code: 'es', name: '🇪🇸 España' },
  { code: 'us', name: '🇺🇸 EE.UU.' },
];

export async function searchITADDeals(query: string, country = 'pe'): Promise<GameComparison[]> {
  if (!query.trim()) return [];

  try {
    const res = await fetch(`/api/search.json?q=${encodeURIComponent(query)}&country=${country}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error en la búsqueda:', err);
  }
  return [];
}

export const searchAllEditions = searchITADDeals;