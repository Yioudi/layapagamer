// src/pages/api/check-alerts.json.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabase } from '../../lib/supabase';

const resend = new Resend(import.meta.env.RESEND_API_KEY || '');

export const GET: APIRoute = async () => {
  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*, profiles(email)');

    if (error || !favorites?.length) {
      return new Response(JSON.stringify({ message: 'Sin alertas pendientes' }), { status: 200 });
    }

    const emailQueue = favorites
      .filter((fav) => fav.profiles?.email && fav.target_price_pen)
      .map((fav) =>
        resend.emails.send({
          from: 'La Yapa Gamer <alertas@layapagamer.com>',
          to: fav.profiles.email,
          subject: `Notificación de precio: ${fav.game_title}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 32px; border-radius: 16px; max-width: 480px; margin: auto;">
              <h2 style="color: #34d399; font-size: 20px; font-weight: 800; margin-bottom: 12px;">Alerta de Precio Alcanzada</h2>
              <p style="font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px;">
                El título <strong>${fav.game_title}</strong> ha entrado dentro del margen de cotización que estableciste.
              </p>
              <a href="https://layapagamer.vercel.app" style="display: inline-block; background-color: #34d399; color: #000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                Ver Comparativa de Tiendas
              </a>
            </div>
          `,
        })
      );

    await Promise.allSettled(emailQueue);

    return new Response(JSON.stringify({ success: true, dispatched: emailQueue.length }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Fallo al procesar alertas' }), { status: 500 });
  }
};