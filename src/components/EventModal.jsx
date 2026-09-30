import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { processImageFile } from '../utils/imageUpload';

const CATEGORIES = [
  'TENNIS',
  'ARENA LES SABLES D OLONNE',
  'FOOTBALL',
  'ESCRIME',
  'RUGBY',
  'GOLF',
  'TENNIS DE TABLE'
];

export const EventModal = ({ isOpen, onClose, onSave, eventToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    hasRegistration: true, // true = avec inscription, false = informatif uniquement
    date: '',
    time: '09:00 - 18:00',
    location: '',
    trackLength: '',
    description: '',
    totalSpots: 20,
    requirements: 'Casque homologué, permis de conduire et licence FFCS.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80',
  });

  const [previewImage, setPreviewImage] = useState('');
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (eventToEdit) {
      const isReg = eventToEdit.hasRegistration !== false;
      setFormData({
        title: eventToEdit.title || '',
        category: eventToEdit.category || CATEGORIES[0],
        hasRegistration: isReg,
        date: eventToEdit.date || '',
        time: eventToEdit.time || '09:00 - 18:00',
        location: eventToEdit.location || '',
        trackLength: eventToEdit.trackLength || '',
        description: eventToEdit.description || '',
        totalSpots: eventToEdit.totalSpots || (isReg ? 20 : 0),
        requirements: eventToEdit.requirements || '',
        imageUrl: eventToEdit.imageUrl || '',
      });
      setPreviewImage(eventToEdit.imageUrl || '');
    } else {
      // Defaults for new event
      setFormData({
        title: '',
        category: CATEGORIES[0],
        hasRegistration: true,
        date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        time: '08:30 - 17:30',
        location: 'Circuit de Nevers Magny-Cours, Club',
        trackLength: '2.5 km',
        description: 'Journée roulage et entraînement encadrée par la FFCS.',
        totalSpots: 25,
        requirements: 'Casque homologué, permis B et licence FFCS.',
        imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80',
      });
      setPreviewImage('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80');
    }
    setShowUrlFallback(false);
    setError(null);
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image Upload handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError(null);
      // Compress to high-quality banner (1200x800 max)
      const dataUrl = await processImageFile(file, 1200, 800, 0.85);
      setPreviewImage(dataUrl);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement de l’image.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.date || !formData.location) {
      setError('Veuillez renseigner tous les champs obligatoires (Titre, Date, Lieu).');
      return;
    }

    let spots = 0;
    if (formData.hasRegistration) {
      spots = parseInt(formData.totalSpots, 10);
      if (isNaN(spots) || spots <= 0) {
        setError('Pour un événement avec inscription, le nombre de places doit être un nombre supérieur à 0.');
        return;
      }

      if (eventToEdit && spots < (eventToEdit.registeredCount || 0)) {
        setError(`Le nombre de places ne peut être inférieur au nombre actuel d’inscrits (${eventToEdit.registeredCount}).`);
        return;
      }
    }

    try {
      setSaving(true);
      await onSave(
        {
          ...formData,
          totalSpots: formData.hasRegistration ? spots : 0,
        },
        eventToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Tricolore top line */}
        <div className="h-1.5 w-full tricolore-bar" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Espace Bureau Fédéral
            </span>
            <h2 className="text-2xl font-racing font-bold text-white">
              {eventToEdit ? 'Modifier la Fiche Événement' : 'Créer une Nouvelle Fiche Événement'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Choice of Event Type: With Registration vs. Informative Only */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Type de participation / Modalité d’accès *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: With Registration */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, hasRegistration: true }))}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  formData.hasRegistration
                    ? 'bg-blue-950/80 border-blue-500 shadow-md ring-1 ring-blue-500 text-white'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    formData.hasRegistration ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Users size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold">Avec Inscription</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Épreuve sportive avec quota de places et engagement des pilotes.
                  </div>
                </div>
              </button>

              {/* Option: Informative Only */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, hasRegistration: false }))}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  !formData.hasRegistration
                    ? 'bg-amber-950/70 border-amber-500 shadow-md ring-1 ring-amber-500 text-white'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    !formData.hasRegistration ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Info size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold">Juste Informatif</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                    Sans inscription. Événement public, salon, gala ou information.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Direct Image Upload Section */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Image d’illustration de l’épreuve
              </span>
              <button
                type="button"
                onClick={() => setShowUrlFallback(!showUrlFallback)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
              >
                {showUrlFallback ? 'Masquer le champ URL' : 'Renseigner via URL'}
              </button>
            </div>

            {/* Live Image Banner Preview */}
            {previewImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 h-44 sm:h-52 bg-slate-900 group">
                <img
                  src={previewImage}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4">
                  <span className="text-xs font-semibold text-white/90 bg-slate-950/60 px-2.5 py-1 rounded-md backdrop-blur-sm">
                    Aperçu de la bannière
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Camera size={14} />
                      <span>Remplacer</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg transition-colors shadow"
                      title="Supprimer cette image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/80 bg-slate-900/60 hover:bg-slate-900/90 p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400">
                  <Upload size={24} />
                </div>
                <div className="text-xs font-bold text-slate-200">
                  Cliquez pour télécharger directement une photo ou image
                </div>
                <div className="text-[11px] text-slate-400">
                  Formats supportés : JPG, PNG, WebP (optimisation et compression automatiques)
                </div>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Action Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <Upload size={14} />
                <span>{uploadingImage ? 'Téléchargement...' : 'Télécharger une image depuis votre appareil'}</span>
              </button>
            </div>

            {/* Fallback URL input (optional) */}
            {showUrlFallback && (
              <div className="pt-2 animate-in fade-in">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Titre de l’épreuve / Événement *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ex: Track Day & Coaching Pilote - Circuit Paul Ricard"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Spots (Visible only if hasRegistration is true) */}
            {formData.hasRegistration ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Nombre de places disponibles (Capacité max) *
                </label>
                <input
                  type="number"
                  name="totalSpots"
                  value={formData.totalSpots}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                {eventToEdit && (
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Actuellement : {eventToEdit.registeredCount} pilote(s) inscrit(s)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col justify-center p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300">
                <span className="font-semibold flex items-center gap-1">
                  <Info size={14} />
                  Événement Informatif
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Aucun quota de places requis.
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Time / Horaires */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Horaires / Programme
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="ex: 08:30 - 18:00"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Lieu / Circuit *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="ex: Circuit de Nevers Magny-Cours, Nièvre"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Track length */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Spécificité / Prestations
              </label>
              <input
                type="text"
                name="trackLength"
                value={formData.trackLength}
                onChange={handleChange}
                placeholder="ex: Tracé F1 4.411 km, Paddock VIP..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Description complète de l’événement
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Programme, déroulé, consignes pratiques, accès..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Requirements (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Conditions d’accès / Équipements (Facultatif)
            </label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="ex: Entrée libre spectateurs, ou Casque FIA obligatoire pour les pilotes"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-600 hover:to-red-500 rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : eventToEdit ? 'Mettre à jour' : 'Publier la fiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
