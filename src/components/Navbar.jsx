import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import {
  Calendar,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  Award,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isLoggedIn, isBoardMember, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800 shadow-md">
      {/* Tricolore French top accent stripe */}
      <div className="h-1 w-full tricolore-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-700 p-0.5 shadow-sm">
              <img src="/logo.svg" alt="FFCS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-racing font-bold text-2xl tracking-wider text-white group-hover:text-red-500 transition-colors">
                  FFCS
                </span>
                
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight block -mt-1">
                Fédération des Conducteurs du Sport
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Accueil
            </Link>

            <Link
              to="/events"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar size={16} />
              <span>Événements Sportifs</span>
            </Link>

            <Link
              to="/bureau"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/bureau')
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award size={16} className="text-amber-400" />
              <span>Bureau Fédéral</span>
            </Link>

            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-700/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Mon Espace</span>
              </Link>
            )}

            {isBoardMember && (
              <Link
                to="/admin/members"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border ${
                  isActive('/admin/members')
                    ? 'bg-red-950/60 text-red-300 border-red-700/50 shadow-sm'
                    : 'text-red-400 border-red-900/40 hover:bg-red-950/40 hover:text-red-300'
                }`}
                title="Portail de modification réservé aux membres du bureau"
              >
                <ShieldCheck size={16} className="text-red-400" />
                <span>Gestion Bureau</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons & User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=pilot'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-blue-500/50 object-cover"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <RoleBadge role={user.role} showIcon={false} size="xs" />
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  Inscription Gratuite
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2">
          {isLoggedIn && (
            <div className="flex items-center gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 mb-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-blue-500"
              />
              <div className="flex-1">
                <div className="font-bold text-sm text-white">{user.name}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
                <div className="mt-1">
                  <RoleBadge role={user.role} size="xs" />
                </div>
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/') ? 'bg-blue-900/40 text-blue-300' : 'text-slate-300'
            }`}
          >
            Accueil
          </Link>

          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/events') ? 'bg-blue-900/40 text-blue-300' : 'text-slate-300'
            }`}
          >
            <Calendar size={18} />
            <span>Événements Sportifs</span>
          </Link>

          <Link
            to="/bureau"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              isActive('/bureau') ? 'bg-blue-900/40 text-blue-300' : 'text-slate-300'
            }`}
          >
            <Award size={18} className="text-amber-400" />
            <span>Bureau Fédéral</span>
          </Link>

          {isLoggedIn && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/dashboard') ? 'bg-blue-900/40 text-blue-300' : 'text-slate-300'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Mon Espace Membre</span>
            </Link>
          )}

          {isBoardMember && (
            <Link
              to="/admin/members"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border ${
                isActive('/admin/members')
                  ? 'bg-red-950/60 text-red-300 border-red-700/50'
                  : 'text-red-400 border-red-900/40 bg-red-950/20'
              }`}
            >
              <ShieldCheck size={18} className="text-red-400" />
              <span>Gestion Bureau Fédéral</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-rose-400 bg-rose-950/30 rounded-lg hover:bg-rose-950/50"
              >
                <LogOut size={16} />
                <span>Se déconnecter</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-red-600 rounded-lg shadow"
                >
                  Inscription Gratuite
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
