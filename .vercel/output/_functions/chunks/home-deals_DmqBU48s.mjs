import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/home-deals.json.ts
var home_deals_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		const res = await fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=8&sortBy=Savings");
		if (!res.ok) return new Response(JSON.stringify([]), { status: 200 });
		const formatted = (await res.json()).map((d) => {
			const sale = parseFloat(d.salePrice);
			const normal = parseFloat(d.normalPrice);
			const penSale = (sale * 3.75).toFixed(2);
			const penNormal = (normal * 3.75).toFixed(2);
			return {
				id: d.dealID,
				title: d.title,
				pricePEN: `S/ ${penSale}`,
				priceUSD: `$${sale.toFixed(2)} USD`,
				originalPEN: `S/ ${penNormal}`,
				savings: Math.round(parseFloat(d.savings)),
				imageUrl: d.steamAppID && d.steamAppID !== "0" ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${d.steamAppID}/header.jpg` : d.thumb,
				dealUrl: `https://www.cheapshark.com/redirect?dealID=${d.dealID}`
			};
		});
		return new Response(JSON.stringify(formatted), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify([]), { status: 200 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/home-deals.json@_@ts
var page = () => home_deals_json_exports;
//#endregion
export { page };
