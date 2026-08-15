import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('¡Registro exitoso! Revisa tu correo.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        alert('¡Sesión iniciada!');
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold mb-4">{isRegister ? 'Crear Cuenta en LaYapaGamer' : 'Iniciar Sesión'}</h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-600"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-600"
            required
          />
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
            {isRegister ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <p className="text-xs text-zinc-500 text-center mt-4">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button onClick={() => setIsRegister(!isRegister)} className="text-white underline ml-1 font-semibold">
            {isRegister ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  );
};