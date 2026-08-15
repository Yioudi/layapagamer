import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/home-sections.json.ts
var home_sections_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var GET = async () => {
	try {
		const dealsRes = await fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=8&sortBy=Savings");
		const deals = dealsRes.ok ? await dealsRes.json() : [];
		return new Response(JSON.stringify({
			dailyDeals: deals,
			upcomingReleases: []
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({
			dailyDeals: [],
			upcomingReleases: []
		}), { status: 200 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/home-sections.json@_@ts
var page = () => home_sections_json_exports;
//#endregion
export { page };
