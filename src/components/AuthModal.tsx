// src/components/AuthModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, Loader2, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [mounted, setMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    },
    [onClose, loading]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setErrorMessage(null);
      setSuccessMessage(null);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          setSuccessMessage('Cuenta creada exitosamente');
          setTimeout(() => {
            onClose();
            onSuccess?.();
          }, 800);
        } else {
          setSuccessMessage('Registro exitoso. Revisa tu correo de confirmación.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setSuccessMessage('Sesión iniciada correctamente');
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 600);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMessage('Credenciales incorrectas. Verifica tus datos.');
      } else if (msg.includes('User already registered')) {
        setErrorMessage('El correo electrónico ya está registrado.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage('Debes confirmar tu cuenta por correo antes de ingresar.');
      } else {
        setErrorMessage(msg || 'Error en el proceso de autenticación');
      }
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={!loading ? onClose : undefined} 
        aria-hidden="true" 
      />

      {/* Contenedor Modal */}
      <div className="relative w-full max-w-md my-auto bg-[#111114] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X size={16} />
        </button>

        {/* Cabecera */}
        <div className="text-center mb-6">
          <span className="inline-block text-[10px] font-extrabold tracking-widest text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full uppercase mb-2.5">
            ACCESO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isSignUp ? 'Crear una cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 max-w-xs mx-auto">
            {isSignUp
              ? 'Guarda tus juegos favoritos y recibe alertas de precio'
              : 'Accede a tus alertas y lista de seguimiento'}
          </p>
        </div>

        {/* Notificaciones */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-300 text-xs">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-300">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/80 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-300">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/80 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-black text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-emerald-500/10"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus size={16} strokeWidth={2.4} />
                <span>Registrarse</span>
              </>
            ) : (
              <>
                <LogIn size={16} strokeWidth={2.4} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>

        {/* Alternar Registro / Login */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-zinc-400 hover:text-emerald-400 font-semibold transition-colors"
          >
            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};