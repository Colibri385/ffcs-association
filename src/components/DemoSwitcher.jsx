import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { ShieldCheck, ChevronDown, Check, Sparkles, UserCheck } from 'lucide-react';

export const DemoSwitcher = () => {
  const { user, quickDemoLogin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const demoAccounts = [
    {
      role: ROLES.PRESIDENT,
      name: 'Pierre de Courcelles',
      title: 'Président',
      desc: 'Pouvoirs complets, gestion bureau & événements',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      role: ROLES.VICE_PRESIDENT,
      name: 'Éléonore Vasseur',
      title: 'Vice-Présidente',
      desc: 'Membre du bureau, gestion des circuits & épreuves',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      role: ROLES.SECRETARY,
      name: 'Marc Fontaine',
      title: 'Secrétaire Général',
      desc: 'Membre du bureau, administration & rôles',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      role: ROLES.TREASURER,
      name: 'Sophie Laurent',
      title: 'Trésorière',
      desc: 'Membre du bureau, finances & validation épreuves',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      role: ROLES.BOARD_MEMBER,
      name: 'Julien Rossi',
      title: 'Membre du Bureau',
      desc: 'Membre du bureau, directeur technique & sécurité',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      role: ROLES.REGULAR_MEMBER,
      name: 'Lucas Moreau',
      title: 'Membre Régulier',
      desc: 'Pilote adhérent, inscription épreuves sans droits bureau',
      badgeColor: 'bg-slate-700/40 text-slate-300 border-slate-600',
    },
  ];

  const handleSwitch = async (role) => {
    try {
      setSwitching(true);
      await quickDemoLogin(role);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm transition-all duration-200"
        title="Tester instantanément les différents rôles et privilèges"
      >
        <Sparkles size={14} className="text-amber-400 animate-pulse" />
        <span className="hidden sm:inline">Tester un rôle</span>
        <span className="sm:hidden">Rôles</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-2 text-slate-200 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-blue-400" />
                Sélecteur de Rôle (Démonstration)
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                Changez de profil en 1 clic pour tester les permissions de chaque rôle (Bureau vs Membre régulier).
              </p>
            </div>

            <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
              {demoAccounts.map((acc) => {
                const isCurrent = user?.role === acc.role;
                return (
                  <button
                    key={acc.role}
                    disabled={switching}
                    onClick={() => handleSwitch(acc.role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-blue-950/60 border border-blue-600/40 text-blue-200'
                        : 'hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100">{acc.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${acc.badgeColor}`}>
                          {acc.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{acc.desc}</p>
                    </div>
                    {isCurrent && <Check size={16} className="text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {user && (
              <div className="pt-1.5 px-2">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md font-medium transition-colors"
                >
                  Se déconnecter (Mode Visiteur)
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DemoSwitcher;
