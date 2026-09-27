import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Flag, Award, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-700 p-0.5">
                <img src="/logo.svg" alt="FFCS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-racing font-bold text-2xl tracking-wider text-white">
                  FFCS
                </span>
                <span className="block text-xs text-slate-400 font-medium">
                  Fédération Française des Conducteurs du Sport
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Association sportive officielle dédiée au bénévolat pour des épreuves sportives, locales, départementales, régionales, nationales et internationales. Nos missions conduires les sportifs lors de leurs transferts, gestion de parkings, placement du public ect... Inscription d'un montant annuel de 20 € pour tous les passionnés.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-block w-4 h-3 bg-blue-600 rounded-sm"></span>
              <span className="inline-block w-4 h-3 bg-white rounded-sm"></span>
              <span className="inline-block w-4 h-3 bg-red-600 rounded-sm"></span>
              <span className="text-xs text-slate-500 font-semibold tracking-wide ml-1">
                Fédération Française des Conducteurs du Sport
              </span>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Navigation Fédérale
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Calendrier des Évènements
                </Link>
              </li>
              <li>
                <Link to="/bureau" className="hover:text-white transition-colors">
                  Composition du Bureau
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Adhésion au Site
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Espace Adhérent
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Siège & Contact */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Siège Fédéral
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                <span>Les Sables d'Olonne Vendée</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <a href="mailto:jean-claude.benoit1@orange.fr" className="hover:text-white transition-colors">
                  jean-claude.benoit1@orange.fr
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>+33 6 12 34 56 78</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FFCS - Fédération Française des Conducteurs du Sport. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Règlement Sportif Fédéral</span>
            <span>Charte Sécurité Circuit</span>
            <span>Statuts de l’Association</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
