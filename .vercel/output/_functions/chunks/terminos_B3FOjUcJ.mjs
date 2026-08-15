import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { h as renderHead, i as renderComponent, u as renderTemplate } from "./server_DNJHvdY8.mjs";
import { t as createComponent } from "./compiler_Cige1B-f.mjs";
import { t as $$Footer } from "./Footer_DcHMF-oM.mjs";
//#region src/pages/terminos.astro
var terminos_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Terminos,
	file: () => $$file,
	url: () => $$url
});
var $$Terminos = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="es" class="bg-zinc-950 text-zinc-200"><head><title>Términos y Condiciones | LaYapaGamer</title>${renderHead($$result)}</head><body class="max-w-4xl mx-auto px-4 py-12"><h1 class="text-3xl font-bold text-white mb-6">Términos y Condiciones de Uso</h1><div class="space-y-4 text-sm leading-relaxed text-zinc-400"><p>Bienvenido a <strong>LaYapaGamer</strong>. Al acceder a nuestra plataforma, aceptas cumplir con los siguientes términos:</p><h2 class="text-lg font-bold text-white mt-6">1. Naturaleza del Servicio</h2><p>LaYapaGamer es un motor de búsqueda y comparador informativo de precios. No vendemos ni almacenamos claves o códigos de licencias directamente en nuestros servidores.</p><h2 class="text-lg font-bold text-white mt-6">2. Exactitud de los Precios</h2><p>Los precios y la disponibilidad de las ofertas son provistos en tiempo real mediante las APIs de las tiendas oficiales (Steam, Epic Games, IsThereAnyDeal). Sin embargo, el precio final exacto es el que figura al momento del pago en la tienda de destino.</p><h2 class="text-lg font-bold text-white mt-6">3. Enlaces Externos y Afiliación</h2><p>Nuestra plataforma contiene enlaces a tiendas de terceros. LaYapaGamer puede recibir una comisión por las compras realizadas a través de dichos enlaces sin costo adicional para el usuario.</p></div>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/terminos.astro", void 0);
var $$file = "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/terminos.astro";
var $$url = "/terminos";
//#endregion
//#region \0virtual:astro:page:src/pages/terminos@_@astro
var page = () => terminos_exports;
//#endregion
export { page };
