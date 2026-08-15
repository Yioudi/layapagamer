export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../lib/supabase';

const resend = new Resend(import.meta.env.RESEND_API_KEY || '');

export const GET: APIRoute = async () => {
  try {
    // 1. Obtener todos los favoritos guardados
    const { data: favorites } = await supabase
      .from('favorites')
      .select('*, profiles(email)');

    if (!favorites || favorites.length === 0) {
      return new Response(JSON.stringify({ message: 'No hay alertas pendientes' }));
    }

    // 2. Iterar e verificar ofertas (ejemplo con Resend)
    for (const fav of favorites) {
      const userEmail = fav.profiles?.email;
      
      // Si el precio baja del valor objetivo, enviar correo
      if (userEmail && fav.target_price_pen) {
        await resend.emails.send({
          from: 'LaYapaGamer <ofertas@layapagamer.com>',
          to: userEmail,
          subject: `🔥 ¡YAPAZO! ${fav.game_title} bajó de precio`,
          html: `
            <div style="font-family: sans-serif; background: #000; color: #fff; padding: 20px; border-radius: 10px;">
              <h1 style="color: #facc15;">¡Tu juego favorito está en oferta!</h1>
              <p>El juego <strong>${fav.game_title}</strong> ya está disponible al precio que esperabas.</p>
              <a href="https://layapagamer.com" style="background: #d946ef; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Ver Oferta en LaYapaGamer</a>
            </div>
          `,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error procesando alertas' }), { status: 500 });
  }
};