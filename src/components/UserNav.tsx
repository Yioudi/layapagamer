// src/components/UserNav.tsx
import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { User as UserIcon, LogOut, LogIn } from 'lucide-react';

export const UserNav: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const username = user?.email ? user.email.split('@')[0] : 'Usuario';

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <UserIcon size={14} className="text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px]">
              {username}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Cerrar sesión"
            className="bg-zinc-900 hover:bg-red-950/40 hover:border-red-500/40 hover:text-red-400 text-zinc-400 p-2 rounded-xl border border-zinc-800 transition-colors disabled:opacity-50"
            aria-label="Cerrar sesión"
          >
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700 flex items-center gap-1.5 shadow-sm"
        >
          <LogIn size={13} className="text-emerald-400" />
          <span>Acceder</span>
        </button>
      )}

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};