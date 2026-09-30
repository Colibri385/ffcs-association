import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import {
  Calendar,
  Search,
  Filter,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Gauge,
  Sparkles,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  'Toutes',
  'Arena Les Sables d Olonne',
  'Parkings',
  'Tennis',
  'Escrime',
  'Basket',
  'Football',
  'Tennis de table',
  'Patinage',
  'Volley'
];

export const EventsPage = () => {
  const { user, isLoggedIn, isBoardMember, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'registered'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/events', { headers });
      if (!res.ok) throw new Error('Impossible de charger les événements.');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // Sign up for an event (Free registration based on spots)
  const handleRegister = async (eventId) => {
    if (!token) {
      setError('Veuillez vous connecter pour vous inscrire à une épreuve.');
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      fetchEvents();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 6000);
    }
  };

  // Cancel participation
  const handleUnregister = async (eventId) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      fetchEvents();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 6000);
    }
  };

  // Create or Update event (Board Members Only)
  const handleSaveEvent = async (formData, eventId = null) => {
    if (!token) throw new Error('Non authentifié');

    const url = eventId ? `/api/events/${eventId}` : '/api/events';
    const method = eventId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de l’enregistrement de l’épreuve.');
    }

    setSuccessMessage(data.message);
    setTimeout(() => setSuccessMessage(null), 5000);
    fetchEvents();
  };

  // Delete event (Board Members Only)
  const handleDeleteEvent = async (eventId) => {
    if (!token) return;
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette épreuve ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccessMessage('Épreuve supprimée avec succès.');
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchEvents();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 6000);
    }
  };

  // Filter logic
  const filteredEvents = events.filter((e) => {
    const matchesCategory =
      selectedCategory === 'Toutes' || e.category === selectedCategory;

    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesAvailability = true;
    if (availabilityFilter === 'available') {
      matchesAvailability = e.remainingSpots > 0;
    } else if (availabilityFilter === 'registered') {
      matchesAvailability = e.isRegistered;
    }

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const totalOpenSpots = events.reduce((sum, e) => sum + (e.remainingSpots || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/60 border border-blue-700/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Gauge size={13} />
            Calendrier Officiel FFCS
          </div>
          <h1 className="font-racing font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Événements Sportifs
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Consultez le calendrier des évènements sportifs et engagez-vous selon les places disponibles.
          </p>
        </div>

        {/* Board member create action */}
        {isBoardMember && (
          <button
            onClick={() => {
              setEditingEvent(null);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <PlusCircle size={18} />
            <span>Ajouter une Épreuve (Bureau)</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-sm shadow-lg animate-in fade-in">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-sm shadow-lg animate-in fade-in">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats overview bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Épreuves au calendrier</span>
          <div className="font-racing text-2xl font-bold text-white mt-0.5">{events.length}</div>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Places libres totales</span>
          <div className="font-racing text-2xl font-bold text-blue-400 mt-0.5">
            {totalOpenSpots} places disponibles
          </div>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Mes inscriptions</span>
          <div className="font-racing text-2xl font-bold text-emerald-400 mt-0.5">
            {isLoggedIn ? events.filter((e) => e.isRegistered).length : '0 (Non connecté)'}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par épreuve, circuit ou ville (ex: Paul Ricard, Cévennes)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          {/* Availability filter tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                availabilityFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                availabilityFilter === 'available'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Places Libres
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setAvailabilityFilter('registered')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  availabilityFilter === 'registered'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mes Inscriptions
              </button>
            )}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="font-racing font-bold text-2xl text-white mb-2">
            Aucun événement ne correspond à vos critères
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Essayez de modifier vos filtres ou de réinitialiser votre recherche.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Toutes');
              setSearchQuery('');
              setAvailabilityFilter('all');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
              onEdit={(event) => {
                setEditingEvent(event);
                setModalOpen(true);
              }}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {/* Board Member Event Create/Edit Modal */}
      {isBoardMember && (
        <EventModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          eventToEdit={editingEvent}
        />
      )}
    </div>
  );
};

export default EventsPage;
