import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { LogIn, AlertCircle, Sparkles, Check, Shield } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Tricolore top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 tricolore-bar" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 p-1 border border-slate-700 mx-auto mb-3">
            <img src="/logo.svg" alt="FFCS" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-racing font-bold text-3xl text-white uppercase tracking-wide">
            Espace Adhérent FFCS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connectez-vous pour gérer vos inscriptions aux évènements sportifs.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Adresse Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pilote@ffcs.fr"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 shadow-lg shadow-red-950/40 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* 1-Click Fast Login Test Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-400" />
              Connexion Rapide (Comptes Démo)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(ROLES.PRESIDENT)}
              className="p-2 text-left bg-slate-800/80 hover:bg-slate-800 border border-amber-500/30 rounded-lg text-xs transition-colors"
            >
              <div className="font-bold text-amber-300">Président</div>
              <div className="text-[10px] text-slate-400">P. de Courcelles</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(ROLES.TREASURER)}
              className="p-2 text-left bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 rounded-lg text-xs transition-colors"
            >
              <div className="font-bold text-emerald-300">Trésorière</div>
              <div className="text-[10px] text-slate-400">S. Laurent</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(ROLES.SECRETARY)}
              className="p-2 text-left bg-slate-800/80 hover:bg-slate-800 border border-blue-500/30 rounded-lg text-xs transition-colors"
            >
              <div className="font-bold text-blue-300">Secrétaire</div>
              <div className="text-[10px] text-slate-400">M. Fontaine</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(ROLES.REGULAR_MEMBER)}
              className="p-2 text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-600 rounded-lg text-xs transition-colors"
            >
              <div className="font-bold text-slate-300">Membre Régulier</div>
              <div className="text-[10px] text-slate-400">L. Moreau</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Pas encore membre de la fédération ?{' '}
          <Link to="/register" className="font-bold text-red-400 hover:text-red-300">
            Inscription gratuite ici
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
