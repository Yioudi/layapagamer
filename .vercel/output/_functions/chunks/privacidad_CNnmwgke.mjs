import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { h as renderHead, i as renderComponent, u as renderTemplate } from "./server_DNJHvdY8.mjs";
import { t as createComponent } from "./compiler_Cige1B-f.mjs";
import { t as $$Footer } from "./Footer_DcHMF-oM.mjs";
//#region src/pages/privacidad.astro
var privacidad_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Privacidad,
	file: () => $$file,
	url: () => $$url
});
var $$Privacidad = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="es" class="bg-zinc-950 text-zinc-200"><head><title>Política de Privacidad | LaYapaGamer</title>${renderHead($$result)}</head><body class="max-w-4xl mx-auto px-4 py-12"><h1 class="text-3xl font-bold text-white mb-6">Política de Privacidad</h1><div class="space-y-4 text-sm leading-relaxed text-zinc-400"><p>En <strong>LaYapaGamer</strong> respetamos la privacidad de nuestros usuarios y protegemos sus datos personales.</p><h2 class="text-lg font-bold text-white mt-6">1. Datos Recopilados</h2><p>Recopilamos únicamente la información necesaria para el inicio de sesión (correo electrónico) cuando el usuario decide registrarse voluntariamente en la plataforma.</p><h2 class="text-lg font-bold text-white mt-6">2. Uso de Cookies</h2><p>Utilizamos cookies técnicas y de rendimiento para recordar las preferencias de región, país y mantener activa la sesión del usuario.</p></div>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/privacidad.astro", void 0);
var $$file = "/home/alejandro/Documentos/LaYapaGamer/layapagamer/src/pages/privacidad.astro";
var $$url = "/privacidad";
//#endregion
//#region \0virtual:astro:page:src/pages/privacidad@_@astro
var page = () => privacidad_exports;
//#endregion
export { page };
