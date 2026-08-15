import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { C as createAstro, g as addAttribute, h as renderHead, i as renderComponent, m as maybeRenderHead, s as renderSlot, u as renderTemplate } from "./server_DNJHvdY8.mjs";
import { t as createComponent } from "./compiler_Cige1B-f.mjs";
import { t as $$Footer } from "./Footer_DcHMF-oM.mjs";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clock, ExternalLink, Flame, Gamepad2, Globe, Loader2, Monitor, Search, Sparkles } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "La Yapa Gamer | Comparador de Precios y Ofertas de Videojuegos", description = "Compara precios de videojuegos en Steam, Epic Games, GOG y más en tiempo real en Soles y Dólares." } = Astro.props;
	return renderTemplate`<html lang="es" class="dark bg-[#09090b]"><head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><title>${title}</title>${renderHead($$result)}</head><body class="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black"><!-- Navbar Global con Logo y Título Pegado --><header class="sticky top-0 z-50 w-full backdrop-blur-md bg-[#09090b]/90 border-b border-zinc-800/80"><div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"><!-- Enlace y Logo --><a href="/" class="flex items-center gap-2.5 group"><img src="/logo.png" alt="Logo" class="h-8 w-auto object-contain rounded-md" onerror="this.style.display='none'"><!-- Título con espaciado natural único (sin doble gap) --><span class="text-xl font-black tracking-tight text-white">LA YAPA <span class="text-emerald-400 group-hover:text-emerald-300 transition-colors">GAMER</span></span></a><!-- Acciones --><div class="flex items-center gap-3"><button id="loginBtn" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-zinc-700/60 hover:border-zinc-500">Iniciar Sesión</button></div></div></header><!-- Contenido -->${renderSlot($$result, $$slots["default"])}<!-- Footer -->${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/layouts/Layout.astro", void 0);
//#endregion
//#region src/services/games.ts
var COUNTRIES = [
	{
		code: "pe",
		name: "🇵🇪 Perú"
	},
	{
		code: "mx",
		name: "🇲🇽 México"
	},
	{
		code: "ar",
		name: "🇦🇷 Argentina"
	},
	{
		code: "cl",
		name: "🇨🇱 Chile"
	},
	{
		code: "co",
		name: "🇨🇴 Colombia"
	},
	{
		code: "es",
		name: "🇪🇸 España"
	},
	{
		code: "us",
		name: "🇺🇸 EE.UU."
	}
];
async function searchITADDeals(query, country = "pe") {
	if (!query.trim()) return [];
	try {
		const res = await fetch(`/api/search.json?q=${encodeURIComponent(query)}&country=${country}`);
		if (res.ok) return await res.json();
	} catch (err) {
		console.error("Error en la búsqueda:", err);
	}
	return [];
}
//#endregion
//#region src/components/DealCard.tsx
var DealCard = ({ game }) => {
	const [imgError, setImgError] = useState(false);
	const [showAllStores, setShowAllStores] = useState(false);
	const cheapestStore = game.stores && game.stores.length > 0 ? game.stores[0] : null;
	const isUpcoming = Boolean(game.isUpcoming && !game.isFree);
	const isFree = Boolean(game.isFree || cheapestStore?.isFree || cheapestStore && cheapestStore.rawPrice === 0 && !isUpcoming);
	const INITIAL_LIMIT = 3;
	const hasMoreStores = game.stores.length > INITIAL_LIMIT;
	const visibleStores = showAllStores ? game.stores : game.stores.slice(0, INITIAL_LIMIT);
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-[#111114] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/90 transition-all duration-300 flex flex-col shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 group w-full self-start",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative w-full h-48 sm:h-52 bg-zinc-950 overflow-hidden flex items-center justify-center shrink-0 border-b border-zinc-800/60",
			children: [!imgError && game.imageUrl ? /* @__PURE__ */ jsx("img", {
				src: game.imageUrl,
				alt: game.title,
				className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
				loading: "lazy",
				onError: () => setImgError(true)
			}) : /* @__PURE__ */ jsxs("div", {
				className: "w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900/80",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-emerald-400 font-extrabold text-sm tracking-wider uppercase",
					children: "LA YAPA GAMER"
				}), /* @__PURE__ */ jsx("span", {
					className: "text-zinc-500 text-xs mt-1 line-clamp-1",
					children: game.title
				})]
			}), isUpcoming ? /* @__PURE__ */ jsxs("div", {
				className: "absolute top-3 right-3 bg-amber-500 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5 backdrop-blur-sm",
				children: [/* @__PURE__ */ jsx(Clock, {
					size: 12,
					strokeWidth: 2.5
				}), /* @__PURE__ */ jsx("span", { children: "PRÓXIMAMENTE" })]
			}) : isFree ? /* @__PURE__ */ jsxs("div", {
				className: "absolute top-3 right-3 bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsx(Gamepad2, {
					size: 13,
					strokeWidth: 2.5
				}), /* @__PURE__ */ jsx("span", { children: "FREE TO PLAY" })]
			}) : cheapestStore && cheapestStore.savings > 0 ? /* @__PURE__ */ jsxs("div", {
				className: "absolute top-3 right-3 bg-emerald-500 text-black font-black text-xs px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(Sparkles, {
					size: 11,
					strokeWidth: 2.5
				}), /* @__PURE__ */ jsxs("span", { children: [
					"-",
					cheapestStore.savings,
					"% YAPA"
				] })]
			}) : null]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4 sm:p-5 flex flex-col gap-3.5",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-2 mb-1",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-white font-bold text-base sm:text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors",
						children: game.title
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 shrink-0 flex items-center gap-1 mt-0.5",
						children: [/* @__PURE__ */ jsx(Monitor, { size: 11 }), /* @__PURE__ */ jsx("span", { children: "PC" })]
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[11px] text-zinc-500 font-semibold uppercase tracking-wider block",
					children: isUpcoming ? "Lanzamiento pendiente" : isFree ? "Acceso Gratuito" : `${game.stores.length} ${game.stores.length === 1 ? "tienda comparada" : "tiendas comparadas"}`
				})] }),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: visibleStores.map((store, index) => {
						const isCheapest = index === 0 && !store.isUpcoming && !store.isFree;
						return /* @__PURE__ */ jsxs("div", {
							className: `flex items-center justify-between p-3 rounded-xl border text-xs gap-3 transition-colors ${store.isUpcoming ? "bg-amber-950/20 border-amber-500/30 text-amber-200" : store.isFree ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-200" : isCheapest ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold text-zinc-100 text-xs sm:text-sm truncate",
									children: store.storeName
								}), isCheapest && /* @__PURE__ */ jsx("span", {
									className: "bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide shrink-0",
									children: "MÁS BARATO"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2.5 shrink-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("span", {
										className: `font-black text-xs sm:text-sm block leading-none ${store.isUpcoming ? "text-amber-400" : store.isFree ? "text-cyan-400" : "text-white"}`,
										children: store.priceFormatted
									}), store.priceUSD && /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-zinc-400 block mt-0.5",
										children: store.priceUSD
									})]
								}), /* @__PURE__ */ jsxs("a", {
									href: store.dealUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: `px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 flex items-center gap-1 ${store.isUpcoming ? "bg-amber-500 hover:bg-amber-400 text-black" : store.isFree ? "bg-cyan-500 hover:bg-cyan-400 text-black" : isCheapest ? "bg-emerald-400 hover:bg-emerald-300 text-black" : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"}`,
									children: [/* @__PURE__ */ jsx("span", { children: store.isFree ? "Jugar" : "Ver" }), /* @__PURE__ */ jsx(ExternalLink, {
										size: 11,
										strokeWidth: 2.5
									})]
								})]
							})]
						}, store.storeID + index);
					})
				}),
				hasMoreStores && /* @__PURE__ */ jsx("button", {
					onClick: () => setShowAllStores(!showAllStores),
					className: "w-full py-2 px-3 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-800/60 rounded-lg border border-zinc-800/60 transition-colors flex items-center justify-center gap-1.5",
					children: showAllStores ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", { children: "Mostrar menos" }), /* @__PURE__ */ jsx(ChevronUp, { size: 13 })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("span", { children: [
						"Ver ",
						game.stores.length - INITIAL_LIMIT,
						" tiendas más"
					] }), /* @__PURE__ */ jsx(ChevronDown, { size: 13 })] })
				})
			]
		})]
	});
};
//#endregion
//#region src/components/SearchGames.tsx
var SearchGames = () => {
	const [query, setQuery] = useState("Resident Evil");
	const [country, setCountry] = useState("pe");
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(false);
	const handleSearch = async (e) => {
		if (e) e.preventDefault();
		if (!query.trim()) return;
		setLoading(true);
		try {
			const results = await searchITADDeals(query, country);
			setGames(results);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		handleSearch();
	}, [country]);
	return /* @__PURE__ */ jsxs("div", {
		className: "w-full space-y-8",
		children: [/* @__PURE__ */ jsxs("form", {
			onSubmit: handleSearch,
			className: "max-w-3xl mx-auto bg-[#111114] border border-zinc-800/90 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-center gap-2",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "w-full sm:w-auto flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-2 rounded-xl shrink-0",
					children: [/* @__PURE__ */ jsx(Globe, {
						size: 15,
						className: "text-zinc-400 shrink-0"
					}), /* @__PURE__ */ jsx("select", {
						value: country,
						onChange: (e) => setCountry(e.target.value),
						"aria-label": "Seleccionar país para comparar precios",
						className: "bg-transparent text-xs sm:text-sm font-semibold text-zinc-200 outline-none cursor-pointer w-full sm:w-auto",
						children: COUNTRIES.map((c) => /* @__PURE__ */ jsx("option", {
							value: c.code,
							className: "bg-zinc-900 text-white",
							children: c.name
						}, c.code))
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "relative w-full flex-1 flex items-center",
					children: /* @__PURE__ */ jsx("input", {
						type: "text",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Busca un juego (ej: Resident Evil, FIFA, Cyberpunk)...",
						className: "w-full bg-zinc-900/40 sm:bg-transparent border sm:border-0 border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-1 sm:focus:ring-0 focus:ring-emerald-500/50"
					})
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: loading,
					className: "w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 active:scale-95 disabled:opacity-50 text-black font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-emerald-500/10",
					children: [loading ? /* @__PURE__ */ jsx(Loader2, {
						size: 16,
						className: "animate-spin"
					}) : /* @__PURE__ */ jsx(Search, {
						size: 16,
						strokeWidth: 2.5
					}), /* @__PURE__ */ jsx("span", { children: loading ? "Buscando..." : "Comparar" })]
				})
			]
		}), loading ? /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse",
			children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-96 bg-zinc-900/40 rounded-2xl border border-zinc-800/60" }, i))
		}) : games.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start",
			children: games.map((game) => /* @__PURE__ */ jsx(DealCard, { game }, game.id))
		}) : /* @__PURE__ */ jsx("div", {
			className: "text-center py-16 bg-[#111114] border border-zinc-800/60 rounded-2xl max-w-lg mx-auto",
			children: /* @__PURE__ */ jsxs("p", {
				className: "text-zinc-400 text-sm font-medium",
				children: [
					"No se encontraron resultados para ",
					/* @__PURE__ */ jsxs("span", {
						className: "text-white font-bold",
						children: [
							"\"",
							query,
							"\""
						]
					}),
					"."
				]
			})
		})]
	});
};
//#endregion
//#region src/components/HomeDeals.tsx
var HomeDeals = () => {
	const [deals, setDeals] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch("/api/home-deals.json").then((res) => res.json()).then((data) => {
			setDeals(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse",
		children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-60 bg-zinc-900/60 rounded-2xl border border-zinc-800/80" }, i))
	});
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
		children: deals.map((item) => /* @__PURE__ */ jsxs("a", {
			href: item.dealUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "group bg-[#111114] hover:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative h-36 bg-black overflow-hidden",
				children: [/* @__PURE__ */ jsx("img", {
					src: item.imageUrl,
					alt: item.title,
					className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
					loading: "lazy"
				}), /* @__PURE__ */ jsxs("span", {
					className: "absolute top-2.5 right-2.5 bg-emerald-500 text-black font-black text-xs px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1",
					children: [/* @__PURE__ */ jsx(Flame, {
						size: 11,
						strokeWidth: 3
					}), /* @__PURE__ */ jsxs("span", { children: [
						"-",
						item.savings,
						"% YAPA"
					] })]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-4 flex-1 flex flex-col justify-between",
				children: [/* @__PURE__ */ jsx("h4", {
					className: "text-zinc-100 font-bold text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors",
					children: item.title
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-zinc-500 line-through block leading-none",
						children: item.originalPEN
					}), /* @__PURE__ */ jsx("span", {
						className: "text-base font-extrabold text-white",
						children: item.pricePEN
					})] }), /* @__PURE__ */ jsxs("span", {
						className: "bg-zinc-800 text-zinc-300 group-hover:bg-emerald-500 group-hover:text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1",
						children: [/* @__PURE__ */ jsx("span", { children: "Ver" }), /* @__PURE__ */ jsx(ExternalLink, {
							size: 11,
							strokeWidth: 2.5
						})]
					})]
				})]
			})]
		}, item.id))
	});
};
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "La Yapa Gamer | Comparador de Precios y Ofertas" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16"><!-- 1. Hero Header Centrado --><section class="text-center max-w-3xl mx-auto space-y-4"><div class="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full"><span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Comparador en tiempo real de Steam, Epic, GOG y más</div><h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight title-float">Encuentra tu juego al <br class="hidden sm:inline"><span class="text-alive font-black">precio más bajo</span></h1><p class="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">Compara todas las ediciones oficiales en Soles peruanos y Dólares antes de comprar.</p></section><!-- 2. Buscador en Vivo y Grid de Resultados a Ancho Completo --><section class="w-full">${renderComponent($$result, "SearchGames", SearchGames, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/components/SearchGames.tsx",
		"client:component-export": "SearchGames"
	})}</section><!-- 3. Ofertas del Día --><section class="space-y-6 pt-6 border-t border-zinc-900/60"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><span class="text-xl"></span><h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">Ofertas Destacadas</h2></div><span class="text-xs text-zinc-500">Actualizado cada hora</span></div>${renderComponent($$result, "HomeDeals", HomeDeals, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/components/HomeDeals.tsx",
		"client:component-export": "HomeDeals"
	})}</section></main>` })}`;
}, "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/index.astro", void 0);
var $$file = "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
