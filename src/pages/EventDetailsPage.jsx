import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Share2,
  Download,
  Gauge,
  FileCheck,
  Info,
} from 'lucide-react';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isBoardMember, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/events/${id}`, { headers });
      if (!res.ok) throw new Error('Épreuve introuvable.');
      const data = await res.json();
      setEvent(data.event);
      setParticipants(data.participants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, token]);

  const handleRegister = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(data.message);
      fetchEventDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!token) return;
    if (!window.confirm('Confirmez-vous l’annulation de votre participation ? Une place sera libérée pour les autres pilotes.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/events/${id}/unregister`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(data.message);
      fetchEventDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Export participant list to CSV for board members
  const handleExportCSV = () => {
    if (!participants || participants.length === 0) return;
    const headers = ['Nom', 'Licence', 'Véhicule', 'Rôle', 'Email', 'Téléphone'];
    const rows = participants.map((p) => [
      `"${p.name || ''}"`,
      `"${p.licenseNumber || ''}"`,
      `"${p.vehicle || ''}"`,
      `"${p.role || ''}"`,
      `"${p.email || 'N/A'}"`,
      `"${p.phone || 'N/A'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `liste_engages_${event.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Chargement des données de l’épreuve...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-racing font-bold text-white mb-2">{error}</h2>
        <Link to="/events" className="text-sm font-semibold text-blue-400 hover:underline">
          ← Retourner au calendrier des évènements
        </Link>
      </div>
    );
  }

  const {
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
    requirements,
    imageUrl,
    hasRegistration,
    isInformational,
  } = event;

  const isInfoOnly = isInformational || hasRegistration === false;
  const percentageTaken = totalSpots > 0 ? Math.min(100, Math.round((registeredCount / totalSpots) * 100)) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Retour aux événements sportifs</span>
      </Link>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle size={20} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Event Header Banner with Hero Image */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-900/90 text-blue-200 border border-blue-600/50 backdrop-blur-md">
              {category}
            </span>
            {isInfoOnly ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 border border-amber-300 backdrop-blur-md shadow-md">
                <Info size={14} />
                Événement Informatif (Sans inscription)
              </span>
            ) : isRegistered ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-600/90 text-white border border-emerald-400 backdrop-blur-md">
                <CheckCircle2 size={14} />
                Vous participez à cette épreuve
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-racing font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mb-3">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-red-500 shrink-0" />
                <span>
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-400 shrink-0" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Spot Management Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Circuit Details & Safety Rules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h2 className="font-racing font-bold text-2xl text-white">Présentation de l’Épreuve</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Technical Requirements & Track Specs */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h2 className="font-racing font-bold text-2xl text-white flex items-center gap-2">
              <ShieldCheck size={22} className="text-red-500" />
              <span>Réglementation & Sécurité FFCS</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                  Fournitures
                </span>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Gauge size={16} className="text-blue-400" />
                  <span>{trackLength || 'Tracé homologué FFCS'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase block mb-1">
                  Adhésion
                </span>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-400" />
                  <span>Adhésion FFCS en cours de validité</span>
                </div>
              </div>
            </div>

            {requirements && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-200 block mb-1">
                  Équipements obligatoires :
                </span>
                {requirements}
              </div>
            )}
          </div>

          {/* Informational notice or Registered Drivers List */}
          {isInfoOnly ? (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h2 className="font-racing font-bold text-2xl text-white flex items-center gap-2">
                <Info size={22} className="text-amber-400" />
                <span>Modalités de l’Épreuve</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cet événement est proposé à titre exclusivement informatif pour l’ensemble des membres et passionnés de la FFCS. Aucune inscription préalable de pilote n’est requise sur le site pour y assister ou y prendre part. Rendez-vous directement sur place aux horaires indiqués pour profiter de l’événement !
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-racing font-bold text-2xl text-white flex items-center gap-2">
                    <Users size={22} className="text-blue-400" />
                    <span>Pilotes Engagés ({participants.length} / {totalSpots})</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Liste officielle des participants enregistrés sur cette épreuve.
                  </p>
                </div>

                {isBoardMember && participants.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/80 hover:bg-blue-900 border border-blue-700/50 transition-colors"
                    title="Exporter la liste des engagés au format CSV (Bureau)"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>

              {participants.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm italic">
                  Aucun pilote inscrit pour le moment. Soyez le premier à prendre le départ !
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {participants.map((p, idx) => (
                    <div key={p.id || idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.name}`}
                          alt={p.name}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{p.name}</span>
                            <RoleBadge role={p.role} size="xs" />
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>{p.vehicle || 'Pilote Sportif'}</span>
                            {p.licenseNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[11px] text-slate-500">
                                  {p.licenseNumber}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Board members can see driver contacts for organization */}
                      {isBoardMember && (p.email || p.phone) && (
                        <div className="text-right text-xs text-slate-400 hidden sm:block">
                          {p.email && <div>{p.email}</div>}
                          {p.phone && <div className="text-slate-500">{p.phone}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Spot Counter & Registration Callout */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl sticky top-24">
            {isInfoOnly ? (
              <>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-3">
                  <Info size={16} />
                  <span>Épreuve Informative</span>
                </div>

                <h3 className="font-racing font-bold text-xl text-white mb-2">
                  Accès Libre & Information
                </h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Cette épreuve ne nécessite aucune inscription préalable sur le site. Les spectateurs et membres de la fédération peuvent s'y rendre librement aux dates et lieux mentionnés ci-dessous.
                </p>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={15} className="text-red-500 shrink-0" />
                    <span>
                      {new Date(date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={15} className="text-blue-400 shrink-0" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin size={15} className="text-amber-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>

                <Link
                  to="/events"
                  className="block w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
                >
                  Voir les autres épreuves du calendrier
                </Link>
              </>
            ) : (
              <>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
                  Gestion des Places
                </span>

                <div className="flex items-baseline justify-between mb-4">
                  <div className="font-racing font-extrabold text-4xl text-white">
                    {remainingSpots}
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <span className="block font-semibold text-slate-300">
                      place{remainingSpots > 1 ? 's' : ''} restante{remainingSpots > 1 ? 's' : ''}
                    </span>
                    <span>sur {totalSpots} au total</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-6">
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

                {/* Status indicator */}
                <div className="mb-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  {isFull ? (
                    <div className="text-rose-400 font-bold flex items-center gap-1.5">
                      <AlertCircle size={15} />
                      <span>Épreuve complète (plus de places disponibles).</span>
                    </div>
                  ) : remainingSpots <= 3 ? (
                    <div className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Clock size={15} />
                      <span>Dernières places disponibles ! Inscription urgente conseillée.</span>
                    </div>
                  ) : (
                    <div className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 size={15} />
                      <span>Inscriptions ouvertes à tous les membres FFCS.</span>
                    </div>
                  )}
                </div>

                {/* Registration Action Button */}
                {isLoggedIn ? (
                  isRegistered ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        <span>Vous êtes officiellement inscrit à cette épreuve.</span>
                      </div>
                      <button
                        onClick={handleUnregister}
                        disabled={actionLoading}
                        className="w-full py-3 px-4 rounded-xl font-bold text-xs text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 transition-colors text-center"
                      >
                        {actionLoading ? 'Traitement...' : 'Se désister (Libérer ma place)'}
                      </button>
                    </div>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed text-center"
                    >
                      Complet - Inscriptions closes
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={actionLoading}
                      className="w-full py-4 px-6 rounded-xl font-racing font-bold text-lg text-white bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 hover:from-blue-600 hover:to-red-500 shadow-xl shadow-red-900/20 transition-all transform hover:scale-[1.02] text-center"
                    >
                      {actionLoading ? 'Enregistrement...' : 'Confirmer Mon Inscription (Gratuit)'}
                    </button>
                  )
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors text-center shadow-lg"
                    >
                      Se connecter pour participer
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors text-center"
                    >
                      Créer un compte membre gratuit
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Federation Guarantee Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>{isInfoOnly ? 'Événement labellisé FFCS' : 'Inscription pour les membres'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck size={13} className="text-blue-400" />
                <span>{isInfoOnly ? 'Règlement intérieur applicable' : 'Encadrement FFCS inclus'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
