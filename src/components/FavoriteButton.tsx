// src/components/FavoriteButton.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bookmark, Loader2 } from 'lucide-react';

interface Props {
  gameId: string;
  gameTitle: string;
  imageUrl: string;
  currentPricePEN: number;
  initialFavorite?: boolean;
  onRequireAuth?: () => void;
}

export const FavoriteButton: React.FC<Props> = ({
  gameId,
  gameTitle,
  imageUrl,
  currentPricePEN,
  initialFavorite = false,
  onRequireAuth,
}) => {
  const [isFav, setIsFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabase
        .from('favorites')
        .select('game_id')
        .eq('user_id', session.user.id)
        .eq('game_id', gameId)
        .maybeSingle();

      if (isMounted && data) {
        setIsFav(true);
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [gameId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      onRequireAuth?.();
      return;
    }

    const previousState = isFav;
    setIsFav(!previousState);
    setLoading(true);

    try {
      if (previousState) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('game_id', gameId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('favorites').upsert({
          user_id: session.user.id,
          game_id: gameId,
          game_title: gameTitle,
          image_url: imageUrl,
          target_price_pen: currentPricePEN,
          updated_at: new Date().toISOString(),
        });

        if (error) throw error;
      }
    } catch {
      setIsFav(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 flex items-center justify-center ${
        isFav
          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/10'
          : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700'
      }`}
      aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-zinc-400" />
      ) : (
        <Bookmark
          size={16}
          className={`transition-transform duration-200 active:scale-90 ${isFav ? 'fill-current' : ''}`}
        />
      )}
    </button>
  );
};