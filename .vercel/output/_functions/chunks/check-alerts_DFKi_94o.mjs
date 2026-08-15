import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
var supabase = createClient(void 0, void 0);
//#endregion
//#region src/pages/api/check-alerts.json.ts
var check_alerts_json_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => false
});
var resend = new Resend("");
var GET = async () => {
	try {
		const { data: favorites } = await supabase.from("favorites").select("*, profiles(email)");
		if (!favorites || favorites.length === 0) return new Response(JSON.stringify({ message: "No hay alertas pendientes" }));
		for (const fav of favorites) {
			const userEmail = fav.profiles?.email;
			if (userEmail && fav.target_price_pen) await resend.emails.send({
				from: "LaYapaGamer <ofertas@layapagamer.com>",
				to: userEmail,
				subject: `🔥 ¡YAPAZO! ${fav.game_title} bajó de precio`,
				html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; border-radius: 10px;">
              <h1 style="color: #facc15;">¡Tu juego favorito está en oferta!</h1>
              <p>El juego <strong>${fav.game_title}</strong> ya está disponible al precio que esperabas.</p>
              <a href="https://layapagamer.com" style="background: #d946ef; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Ver Oferta en LaYapaGamer</a>
            </div>
          `
			});
		}
		return new Response(JSON.stringify({ success: true }));
	} catch (err) {
		return new Response(JSON.stringify({ error: "Error procesando alertas" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/check-alerts.json@_@ts
var page = () => check_alerts_json_exports;
//#endregion
export { page };
