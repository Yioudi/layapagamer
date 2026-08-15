// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Loader2, LogIn, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.session) {
          setSuccessMsg('¡Cuenta creada exitosamente!');
          setTimeout(() => {
            onClose();
            if (onSuccess) onSuccess();
          }, 1000);
        } else {
          setSuccessMsg('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setSuccessMsg('¡Sesión iniciada!');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-[100dvh] p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Contenedor con centrado absoluto y márgenes automáticos */}
      <div className="relative w-full max-w-md bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Cabecera */}
        <div className="text-center mb-6">
          <div className="inline-block mb-2">
            <span className="text-emerald-400 font-black text-xs tracking-widest uppercase bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              LA YAPA GAMER
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {isSignUp
              ? 'Regístrate para guardar tus juegos favoritos y recibir alertas de precio'
              : 'Accede a tus alertas y precios guardados'}
          </p>
        </div>

        {/* Mensajes de Estado */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-300 block">Correo electrónico</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-300 block">Contraseña</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-zinc-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus size={16} strokeWidth={2.5} />
                <span>Registrarse</span>
              </>
            ) : (
              <>
                <LogIn size={16} strokeWidth={2.5} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Alternar modo */}
        <div className="mt-6 text-center pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="text-xs text-zinc-400 hover:text-emerald-400 font-semibold transition-colors"
          >
            {isSignUp
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>

      </div>
    </div>
  );
};