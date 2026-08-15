// src/components/UserNav.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
import { User, LogOut } from 'lucide-react';

export const UserNav: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 1. Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <User size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-zinc-200 truncate max-w-[120px]">
              {user.email?.split('@')[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="bg-zinc-800/80 hover:bg-red-950/40 hover:border-red-500/50 hover:text-red-400 text-zinc-400 p-2 rounded-xl border border-zinc-700/60 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-zinc-700/60 hover:border-zinc-500"
        >
          Iniciar Sesión
        </button>
      )}

      {/* Modal interactivo */}
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};