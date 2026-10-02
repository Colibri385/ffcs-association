import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import {
  Flag,
  Shield,
  Award,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  CheckCircle,
  Gauge,
} from 'lucide-react';

export const HomePage = () => {
  const { isLoggedIn, isBoardMember } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        // Take first 3 upcoming events
        setFeaturedEvents((data.events || []).slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching featured events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegisterEvent = async (eventId) => {
    const token = localStorage.getItem('ffcs_token');
    if (!token) return;
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnregisterEvent = async (eventId) => {
    const token = localStorage.getItem('ffcs_token');
    if (!token) return;
    try {
      const res = await fetch(`/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Glows & Tricolore Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tricolore Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 mb-6 shadow-xl backdrop-blur-md">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                Fédération Française des Conducteurs du Sport
              </span>
            </div>

            <h1 className="font-racing font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-[1.08] mb-6">
              Vivez la Passion <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">du Sport</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Rejoignez la fédération officielle des passionnés du sport. Consultez les évènements sportifs en cours et engagez-vous comme bénévoles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/events"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 shadow-xl shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                <span>Voir les Événements & Places</span>
              </Link>

              {!isLoggedIn && (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Zap size={18} className="text-amber-400" />
                  <span>Inscription Gratuite Adhérent</span>
                </Link>
              )}

              <Link
                to="/bureau"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Award size={18} className="text-blue-400" />
                <span>Bureau Fédéral</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="font-racing font-extrabold text-3xl sm:text-4xl text-white"><span>{}8</span></div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Membres Adhérents
            </div>
          </div>
          
          <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="font-racing font-extrabold text-3xl sm:text-4xl text-red-500"><span>{featuredEvents.length}</span></div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Épreuves en cours
            </div>
          </div>
          
        </div>
      </section>

      {/* Featured Ongoing Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 mb-1">
              <Gauge size={14} />
              Calendrier Sportif FFCS
            </div>
            <h2 className="font-racing font-extrabold text-3xl sm:text-4xl text-white">
              Événements Sportifs en Cours
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Inscrivez-vous directement selon les places encore disponibles.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Voir tout le calendrier ({featuredEvents.length}+)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-slate-900/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onRegister={handleRegisterEvent}
                onUnregister={handleUnregisterEvent}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </section>

      {/* Federation Values & Governance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 block">
                Organisation Fédérale
              </span>
              <h2 className="font-racing font-extrabold text-3xl sm:text-4xl text-white uppercase mb-4">
                Une Gouvernance Démocratique & Engagée
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                La Fédération Française des Conducteurs du Sport est administrée par un Bureau Fédéral élu comprenant le Président, le Vice-Président, la Secrétaire, la Trésorière et les membres du bureau. Les décisions et modifications du site sont validées collégialement par les membres du bureau.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">
                    <strong>Rôles statutaires clairs :</strong> Président, Vice-Président, Secrétaire, Trésorier, Membre du Bureau et Membre régulier.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">
                    <strong>Accès libre & gratuit :</strong> Tout bénévoles licenciés peut s’inscrire gratuitement pour accéder aux évènements sportifs proposés.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">
                    <strong>Sécurité :</strong> Lors des évènements utilisation des effets fournis par la FFCS.
                  </span>
                </div>
              </div>

              <Link
                to="/bureau"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-colors"
              >
                <Award size={16} />
                <span>Découvrir la Composition du Bureau</span>
              </Link>
            </div>

            {/* Federation Emblem / Graphic Card */}
            <div className="relative flex items-center justify-center p-8 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden p-2 bg-slate-900 border border-slate-700 shadow-2xl">
                  <img src="/logo.svg" alt="FFCS Logo" className="w-full h-full object-contain" />
                </div>
                <div className="font-racing font-bold text-2xl text-white">
                  FFCS • Bureau Fédéral
                </div>
                <div className="text-xs text-slate-400 max-w-xs mx-auto">
                  Gestionnaire officiel du calendrier des évènements conventionnés.
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    Présidence
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                    Secrétariat
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                    Trésorerie
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      {!isLoggedIn && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-red-800/40 bg-gradient-to-r from-blue-950 via-slate-900 to-red-950/60 text-center">
            <h2 className="font-racing font-extrabold text-3xl sm:text-5xl text-white uppercase mb-4">
              Prêt à Prendre le Départ ?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Créez votre compte membre gratuitement en 30 secondes pour réserver vos places sur les prochaines journées piste et rallyes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-xl shadow-red-900/40 transition-all duration-200 hover:scale-[1.03]"
            >
              <Zap size={18} />
              <span>Créer Mon Compte Membre Gratuitement</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
