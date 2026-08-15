import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/search.json.ts
var search_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var ITAD_KEY = "bbd85142fead27c3efd53a1bbd1b7ad7e91e5dbe";
var searchCache = /* @__PURE__ */ new Map();
var CACHE_TTL_MS = 9e5;
function normalizeTitle(title) {
	return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}
var GET = async ({ url }) => {
	const query = url.searchParams.get("q") || "Resident Evil";
	const country = url.searchParams.get("country") || "pe";
	if (!query.trim()) return new Response(JSON.stringify([]), { status: 200 });
	const cacheKey = `${normalizeTitle(query)}_${country}`;
	const now = Date.now();
	if (searchCache.has(cacheKey)) {
		const cached = searchCache.get(cacheKey);
		if (now < cached.expiry) return new Response(JSON.stringify(cached.data), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"X-Cache-Status": "HIT"
			}
		});
		searchCache.delete(cacheKey);
	}
	const encodedQuery = encodeURIComponent(query);
	try {
		const [steamRes, itadRes] = await Promise.allSettled([fetch(`https://store.steampowered.com/api/storesearch/?term=${encodedQuery}&cc=${country}&l=spanish`, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.json()), fetch(`https://api.isthereanydeal.com/games/search/v1?key=${ITAD_KEY}&title=${encodedQuery}&results=8`).then((r) => r.json())]);
		const steamData = steamRes.status === "fulfilled" ? steamRes.value : null;
		const itadGames = itadRes.status === "fulfilled" ? itadRes.value : null;
		const gameMap = /* @__PURE__ */ new Map();
		if (steamData && steamData.items && steamData.items.length > 0) {
			const detailsPromises = steamData.items.slice(0, 6).map(async (item) => {
				try {
					const detailRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=${country}&l=spanish`, { headers: { "User-Agent": "Mozilla/5.0" } });
					if (detailRes.ok) {
						const detailJson = await detailRes.json();
						return {
							id: item.id,
							details: detailJson[item.id]?.data || null
						};
					}
				} catch {}
				return {
					id: item.id,
					details: null
				};
			});
			const detailsResults = await Promise.allSettled(detailsPromises);
			const detailsMap = /* @__PURE__ */ new Map();
			detailsResults.forEach((res) => {
				if (res.status === "fulfilled" && res.value.details) detailsMap.set(res.value.id, res.value.details);
			});
			for (const item of steamData.items) {
				const key = normalizeTitle(item.name);
				const details = detailsMap.get(item.id);
				let isUpcoming = false;
				let isFree = false;
				let priceText = "S/ 0.00";
				let priceUSDText = void 0;
				let rawPrice = 0;
				let savings = 0;
				let originalPriceFormatted = null;
				if (details) {
					const comingSoon = details.release_date?.coming_soon === true;
					const steamIsFree = details.is_free === true;
					const priceOverview = details.price_overview;
					if (comingSoon) {
						isUpcoming = true;
						priceText = "Próximamente";
						priceUSDText = details.release_date?.date || "Fecha por anunciar";
						rawPrice = 999999;
					} else if (steamIsFree) {
						isFree = true;
						priceText = "Free to Play";
						priceUSDText = "Gratis";
						rawPrice = 0;
					} else if (priceOverview) {
						const finalCents = priceOverview.final;
						const initialCents = priceOverview.initial;
						savings = priceOverview.discount_percent || 0;
						if (finalCents === 0 && savings === 100) {
							isFree = true;
							priceText = "¡GRATIS (-100%)!";
							priceUSDText = "Gratis por tiempo limitado";
						} else {
							priceText = `S/ ${(finalCents / 100).toFixed(2)}`;
							priceUSDText = `$${(finalCents / 100 / 3.75).toFixed(2)} USD`;
							rawPrice = finalCents / 100;
							if (initialCents > finalCents) originalPriceFormatted = `S/ ${(initialCents / 100).toFixed(2)}`;
						}
					} else {
						isFree = true;
						priceText = "Free to Play";
						priceUSDText = "Gratis";
						rawPrice = 0;
					}
				} else if (item.price) {
					const finalCents = item.price.final;
					const initialCents = item.price.initial;
					savings = item.price.discount_percent || 0;
					if (finalCents === 0) {
						isFree = true;
						priceText = savings === 100 ? "¡GRATIS (-100%)!" : "Free to Play";
						priceUSDText = "Gratis";
					} else {
						priceText = `S/ ${(finalCents / 100).toFixed(2)}`;
						priceUSDText = `$${(finalCents / 100 / 3.75).toFixed(2)} USD`;
						rawPrice = finalCents / 100;
						if (initialCents > finalCents) originalPriceFormatted = `S/ ${(initialCents / 100).toFixed(2)}`;
					}
				} else {
					isFree = true;
					priceText = "Free to Play";
					priceUSDText = "Gratis";
					rawPrice = 0;
				}
				gameMap.set(key, {
					id: `steam-${item.id}`,
					title: item.name,
					imageUrl: `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${item.id}/header.jpg`,
					isUpcoming,
					isFree,
					stores: [{
						storeID: "steam",
						storeName: "Steam Store",
						priceFormatted: priceText,
						priceUSD: priceUSDText,
						originalPriceFormatted,
						savings,
						rawPrice,
						isUpcoming,
						isFree,
						dealUrl: `https://store.steampowered.com/app/${item.id}`
					}]
				});
			}
		}
		if (Array.isArray(itadGames) && itadGames.length > 0) {
			const gameIds = itadGames.map((g) => g.id);
			try {
				const pricesRes = await fetch(`https://api.isthereanydeal.com/games/prices/v2?key=${ITAD_KEY}&country=US`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(gameIds)
				});
				if (pricesRes.ok) {
					const pricesData = await pricesRes.json();
					const pricesMap = /* @__PURE__ */ new Map();
					if (Array.isArray(pricesData)) pricesData.forEach((p) => pricesMap.set(p.id, p.deals || []));
					for (const game of itadGames) {
						const deals = pricesMap.get(game.id) || [];
						if (deals.length === 0) continue;
						const storeOffers = deals.map((d) => {
							const usdPrice = d.price?.amount ?? 0;
							const usdRegular = d.regular?.amount ?? usdPrice;
							const cut = d.cut || 0;
							const penPrice = (usdPrice * 3.75).toFixed(2);
							const penRegular = (usdRegular * 3.75).toFixed(2);
							let priceText = `S/ ${penPrice}`;
							let isFree = false;
							if (usdPrice === 0) {
								isFree = true;
								priceText = cut === 100 ? "¡GRATIS (-100%)!" : "Free to Play";
							}
							return {
								storeID: String(d.shop?.id || d.shop?.name),
								storeName: d.shop?.name || "Tienda Digital",
								priceFormatted: priceText,
								priceUSD: usdPrice === 0 ? "Gratis" : `$${usdPrice.toFixed(2)} USD`,
								originalPriceFormatted: cut > 0 ? `S/ ${penRegular}` : null,
								savings: cut,
								rawPrice: usdPrice,
								isUpcoming: false,
								isFree,
								dealUrl: d.url || `https://isthereanydeal.com/game/${game.slug}/`
							};
						});
						const key = normalizeTitle(game.title);
						const fallbackImage = game.assets?.banner300 || game.assets?.banner600 || game.assets?.boxart || "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/220/header.jpg";
						if (gameMap.has(key)) {
							const existing = gameMap.get(key);
							for (const offer of storeOffers) if (!existing.stores.some((s) => s.storeName.toLowerCase() === offer.storeName.toLowerCase())) existing.stores.push(offer);
						} else gameMap.set(key, {
							id: `itad-${game.id}`,
							title: game.title,
							imageUrl: fallbackImage,
							isUpcoming: false,
							isFree: storeOffers.some((s) => s.isFree),
							stores: storeOffers
						});
					}
				}
			} catch (e) {
				console.error("Error procesando ITAD:", e);
			}
		}
		const finalGames = Array.from(gameMap.values()).map((game) => {
			game.stores.sort((a, b) => a.rawPrice - b.rawPrice);
			return game;
		});
		searchCache.set(cacheKey, {
			data: finalGames,
			expiry: now + CACHE_TTL_MS
		});
		return new Response(JSON.stringify(finalGames), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"X-Cache-Status": "MISS"
			}
		});
	} catch (err) {
		console.error("Error en servidor:", err);
		return new Response(JSON.stringify([]), { status: 200 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/search.json@_@ts
var page = () => search_json_exports;
//#endregion
export { page };
