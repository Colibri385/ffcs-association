import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Gauge,
  ArrowRight,
  Info,
} from 'lucide-react';

export const EventCard = ({ event, onRegister, onUnregister, onEdit, onDelete }) => {
  const { user, isLoggedIn, isBoardMember } = useAuth();
  const [loadingAction, setLoadingAction] = useState(false);

  const {
    id,
    title,
    category,
    date,
    time,
    location,
    trackLength,
    description,
    totalSpots,
    registeredCount,
    remainingSpots,
    isRegistered,
    isFull,
    imageUrl,
    hasRegistration,
    isInformational,
  } = event;

  const isInfoOnly = isInformational || hasRegistration === false;
  const percentageTaken = totalSpots > 0 ? Math.min(100, Math.round((registeredCount / totalSpots) * 100)) : 0;

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setLoadingAction(true);
    try {
      await onRegister(id);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUnregisterClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    if (window.confirm('Voulez-vous vraiment annuler votre participation à cet événement ?')) {
      setLoadingAction(true);
      try {
        await onUnregister(id);
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="racing-card overflow-hidden flex flex-col group relative">
      {/* Event Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-900/90 text-blue-200 border border-blue-600/50 backdrop-blur-sm shadow-md">
            {category}
          </span>
        </div>

        {/* Registration status / Spots Remaining Badge */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {isInfoOnly ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 border border-amber-300 shadow-md backdrop-blur-sm flex items-center gap-1">
              <Info size={13} />
              Informatif
            </span>
          ) : (
            <>
              {isRegistered && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600/90 text-white border border-emerald-400 shadow-md backdrop-blur-sm animate-in fade-in">
                  <CheckCircle2 size={13} />
                  Inscrit
                </span>
              )}

              {isFull ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-rose-600 text-white border border-rose-400 shadow-md">
                  Complet
                </span>
              ) : remainingSpots <= 3 ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 border border-amber-300 shadow-md">
                  Plus que {remainingSpots} place{remainingSpots > 1 ? 's' : ''} !
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/90 text-slate-200 border border-slate-700 shadow-md backdrop-blur-sm">
                  {remainingSpots} places dispo
                </span>
              )}
            </>
          )}
        </div>

        {/* Board Actions Floating Toolbar (Board members only) */}
        {isBoardMember && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(event)}
              className="p-1.5 bg-slate-900/90 hover:bg-blue-600 text-slate-200 hover:text-white rounded-md border border-slate-700 transition-colors shadow"
              title="Modifier l’épreuve (Bureau Fédéral)"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 bg-slate-900/90 hover:bg-rose-600 text-slate-200 hover:text-white rounded-md border border-slate-700 transition-colors shadow"
              title="Supprimer l’épreuve (Bureau Fédéral)"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to={`/events/${id}`}
            className="block font-racing font-bold text-xl text-white hover:text-red-400 transition-colors line-clamp-1 mb-2"
          >
            {title}
          </Link>

          {/* Quick info list */}
          <div className="space-y-1.5 text-xm text-slate-300 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-red-500 shrink-0" />
              <span className="capitalize">{formattedDate}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                {time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            {trackLength && (
              <div className="flex items-center gap-2">
                <Gauge size={14} className="text-amber-400 shrink-0" />
                <span className="text-slate-400">{trackLength}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Spots progress & action footer */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {isInfoOnly ? (
            <>
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200 flex items-center gap-2">
                <Info size={14} className="text-amber-400 shrink-0" />
                <span>Événement informatif • Entrée libre sans inscription</span>
              </div>

              <div className="flex items-center">
                <Link
                  to={`/events/${id}`}
                  className="w-full py-2.5 px-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Consulter les informations</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Spots Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Users size={13} className="text-slate-400" />
                    <span>Places :</span>
                    <strong className={isFull ? 'text-rose-400' : 'text-white'}>
                      {registeredCount} / {totalSpots} inscrits
                    </strong>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {remainingSpots} libre{remainingSpots > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull
                        ? 'bg-rose-600'
                        : percentageTaken > 80
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-blue-600 to-red-500'
                    }`}
                    style={{ width: `${percentageTaken}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/events/${id}`}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Détails</span>
                  <ArrowRight size={13} />
                </Link>

                {isLoggedIn ? (
                  isRegistered ? (
                    <button
                      onClick={handleUnregisterClick}
                      disabled={loadingAction}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors text-center"
                    >
                      {loadingAction ? 'Désinscription...' : 'Annuler inscription'}
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="flex-1 py-2 px-3 text-xs font-semibold text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded-lg cursor-not-allowed text-center"
                    >
                      Complet (0 place)
                    </button>
                  ) : (
                    <button
                      onClick={handleRegisterClick}
                      disabled={loadingAction}
                      className="flex-1 py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 rounded-lg shadow-md transition-all text-center hover:scale-[1.01]"
                    >
                      {loadingAction ? 'Enregistrement...' : 'S’inscrire (Gratuit)'}
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg shadow transition-colors text-center"
                  >
                    Connexion pour s'inscrire
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
