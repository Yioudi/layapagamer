import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  gameId: string;
  gameTitle: string;
  imageUrl: string;
  currentPricePEN: number;
}

export const FavoriteButton: React.FC<Props> = ({ gameId, gameTitle, imageUrl, currentPricePEN }) => {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Debes iniciar sesión para guardar este juego en tus favoritos.');
      setLoading(false);
      return;
    }

    if (isFav) {
      // Eliminar de favoritos
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('game_id', gameId);
      setIsFav(false);
    } else {
      // Guardar en favoritos
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        game_id: gameId,
        game_title: gameTitle,
        image_url: imageUrl,
        target_price_pen: currentPricePEN,
      });

      if (!error) setIsFav(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-lg border transition-colors ${
        isFav 
          ? 'bg-rose-950/80 border-rose-500 text-rose-400' 
          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
      }`}
      title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos y activar alertas'}
    >
      {isFav ? '❤️ Guardado' : '🤍 Favorito'}
    </button>
  );
};