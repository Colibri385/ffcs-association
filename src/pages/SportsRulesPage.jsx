import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Clock, ArrowLeft, Mail } from 'lucide-react';

export const SportsRulesPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Navigation retour */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
      </div>

      {/* En-tête */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm mb-8">
        <div className="flex items-center gap-3 text-red-500 font-semibold text-xs tracking-wider uppercase mb-2">
          <Shield size={16} />
          <span>Fédération Française des Conducteurs du Sport</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Règlement Sportif Fédéral
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Réglementation officielle régissant les interventions des conducteurs bénévoles et les protocoles sur les épreuves sportives.
        </p>
      </div>

      {/* Contenu principal / À venir */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
          <FileText size={32} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium mb-4">
          <Clock size={14} className="text-amber-400" />
          <span>Document officiel en cours de finalisation</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          À venir...
        </h2>

        <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
          Le règlement sportif fédéral complet est actuellement en cours de relecture et de validation par le bureau de la FFCS. Il sera consultable et téléchargeable directement ici très prochainement.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
          >
            Retourner à l'accueil
          </Link>
          <a
            href="mailto:jean-claude.benoit1@orange.fr"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-lg shadow-red-600/20"
          >
            <Mail size={16} />
            Contacter le secrétariat
          </a>
        </div>
      </div>
    </div>
  );
};

export default SportsRulesPage;
