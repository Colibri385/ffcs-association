import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, getRoleInfo } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import { processImageFile } from '../utils/imageUpload';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Car,
  Phone,
  Mail,
  User,
  Shield,
  Edit2,
  Trash2,
  FileText,
  ExternalLink,
  Camera,
  Upload,
  Download,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, token, updateProfile } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fileInputRef = useRef(null);
  const formFileInputRef = useRef(null);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    bio: '',
    avatar: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        vehicle: user.vehicle || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Handle uploading / updating profile picture
  const handlePhotoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      setError(null);
      const dataUrl = await processImageFile(file);
      await updateProfile({ avatar: dataUrl });
      setProfileData((prev) => ({ ...prev, avatar: dataUrl }));
      setSuccess('Photo de profil mise à jour avec succès !');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement de la photo.');
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle downloading profile picture
  const handleDownloadPhoto = () => {
    if (!user?.avatar) return;
    const link = document.createElement('a');
    link.href = user.avatar;
    link.download = `photo_profil_${user.name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchMyEvents = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/members/my-events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Impossible de charger vos épreuves.');
      const data = await res.json();
      setMyEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [token]);

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Confirmez-vous le désistement ? Votre place sera immédiatement libérée.')) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('Votre désistement a été validé.');
      setTimeout(() => setSuccess(null), 4000);
      fetchMyEvents();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileData);
      setSuccess('Profil mis à jour avec succès.');
      setEditingProfile(false);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-racing font-bold text-white mb-4">
          Connexion requise
        </h2>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold inline-block"
        >
          Se connecter à mon espace
        </Link>
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Espace Personnel Adhérent FFCS
        </span>
        <h1 className="font-racing font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
          Tableau de Bord Adhérent
        </h1>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Digital Membership / License Card */}
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border border-slate-700 p-6 shadow-2xl">
            {/* Top Tricolore stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 tricolore-bar" />

            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
                  Licence Fédérale Adhérent
                </span>
                <span className="font-racing font-bold text-xl text-white">
                  FFCS
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-950 p-1 border border-slate-700">
                <img src="/logo.svg" alt="FFCS" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Avatar & Driver Identity with Photo Upload & Download */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative group">
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=driver'}
                  alt={user.name}
                  className="w-16 h-16 rounded-xl border-2 border-blue-400/60 object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/70 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-semibold gap-0.5"
                  title="Télécharger / Changer ma photo de profil"
                >
                  <Camera size={16} className="text-blue-400" />
                  <span>Changer</span>
                </button>
              </div>

              <div className="flex-1">
                <h3 className="font-racing font-bold text-xl text-white leading-snug">
                  {user.name}
                </h3>
                <div className="mt-1">
                  <RoleBadge role={user.role} size="xs" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {user.licenseNumber || 'FFCS-FR-LICENCE'}
                </div>
              </div>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex-1 py-1.5 px-2.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Upload size={13} />
                <span>{uploadingPhoto ? 'Téléchargement...' : 'Télécharger ma photo'}</span>
              </button>

              {user.avatar && (
                <button
                  type="button"
                  onClick={handleDownloadPhoto}
                  className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                  title="Enregistrer / Télécharger ma photo sur mon ordinateur"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Exporter</span>
                </button>
              )}
            </div>

            {/* Driver Specs */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Adhésion FFCS :</span>
                <strong className="text-white truncate max-w-[170px]">
                  {user.vehicle || 'Non renseigné'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email :</span>
                <span className="text-slate-200 truncate max-w-[170px]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Téléphone :</span>
                  <span className="text-slate-200">{user.phone}</span>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>SAISON OFFICIELLE 2026</span>
              <span className="text-emerald-400 font-bold">● ACTIVE</span>
            </div>
          </div>

          {/* Quick Profile Edit Accordion */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-racing font-bold text-lg text-white">Mes Coordonnées</h3>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <Edit2 size={13} />
                <span>{editingProfile ? 'Fermer' : 'Modifier'}</span>
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+33 6 00 00 00 00"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    ADHÉSION
                  </label>
                  <input
                    type="text"
                    value={profileData.vehicle}
                    onChange={(e) => setProfileData({ ...profileData, vehicle: e.target.value })}
                    placeholder="ex: Adhésion acquitée ou Adhésion non acquitée."
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                    Bio / Palmarès
                  </label>
                  <textarea
                    rows={2}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Votre parcours ou vos objectifs de pilotage..."
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {savingProfile ? 'Enregistrement...' : 'Sauvegarder mon profil'}
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-xs text-slate-300">
                <p className="text-slate-400 italic">« {user.bio || 'Adhérent FFCS.'} »</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Enrolled Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-racing font-bold text-2xl text-white flex items-center gap-2">
                <Calendar size={22} className="text-red-500" />
                <span>Mes Engagements Sportifs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Épreuves auxquelles vous êtes inscrit. Vous pouvez libérer votre place à tout moment.
              </p>
            </div>

            <Link
              to="/events"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Découvrir d’autres épreuves</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 rounded-xl bg-slate-900/60 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <Calendar size={44} className="mx-auto text-slate-600 mb-3" />
              <h3 className="font-racing font-bold text-xl text-white mb-2">
                Aucune inscription en cours
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Vous n’êtes engagé sur aucune session sportive actuellement. Consultez le calendrier pour réserver votre place.
              </p>
              <Link
                to="/events"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-red-600 text-white font-bold text-xs rounded-xl shadow-lg inline-block"
              >
                Parcourir les épreuves ouvertes
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800">
                        {evt.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        Place confirmée
                      </span>
                    </div>

                    <Link
                      to={`/events/${evt.id}`}
                      className="font-racing font-bold text-xl text-white hover:text-red-400 transition-colors block"
                    >
                      {evt.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar size={13} className="text-red-500" />
                        {new Date(evt.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-blue-400" />
                        {evt.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin size={13} className="text-amber-400" />
                        {evt.location}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/events/${evt.id}`}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Détails
                    </Link>
                    <button
                      onClick={() => handleCancelRegistration(evt.id)}
                      className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/60 text-xs font-semibold rounded-lg transition-colors"
                      title="Annuler mon engagement et libérer ma place"
                    >
                      Annuler engagement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
