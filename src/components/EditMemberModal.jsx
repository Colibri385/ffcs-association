import React, { useState, useEffect, useRef } from 'react';
import { X, Crown, Upload, Camera, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { ROLES } from '../context/AuthContext';
import { processImageFile } from '../utils/imageUpload';

const ROLE_OPTIONS = [
  { value: ROLES.REGULAR_MEMBER, label: 'Membre Régulier' },
  { value: ROLES.PRESIDENT, label: 'Président (Direction Générale)' },
  { value: ROLES.VICE_PRESIDENT, label: 'Vice-Président' },
  { value: ROLES.SECRETARY, label: 'Secrétaire (Administration & Licences)' },
  { value: ROLES.TREASURER, label: 'Trésorier (Finances & Assurances)' },
  { value: ROLES.BOARD_MEMBER, label: 'Membre du Bureau (Technique & Sécurité)' },
];

export const EditMemberModal = ({ isOpen, onClose, onSave, member }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    licenseNumber: '',
    bio: '',
    role: ROLES.REGULAR_MEMBER,
    avatar: '',
  });

  const [previewAvatar, setPreviewAvatar] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        vehicle: member.vehicle || '',
        licenseNumber: member.licenseNumber || '',
        bio: member.bio || '',
        role: member.role || ROLES.REGULAR_MEMBER,
        avatar: member.avatar || '',
      });
      setPreviewAvatar(member.avatar || '');
    }
    setError(null);
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      setPreviewAvatar(dataUrl);
      setFormData((prev) => ({ ...prev, avatar: dataUrl }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Le nom et l’adresse email sont obligatoires.');
      return;
    }

    try {
      setSaving(true);
      await onSave(member.id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification de la fiche.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1.5 w-full tricolore-bar" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Crown size={15} />
              <span>Pouvoir Présidentiel FFCS</span>
            </div>
            <h2 className="text-2xl font-racing font-bold text-white mt-0.5">
              Modifier la Fiche Membre : {member.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo de profil Upload section */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <img
                src={previewAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || 'avatar')}`}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/60 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] font-semibold gap-1"
              >
                <Camera size={18} className="text-blue-400" />
                <span>Changer</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <span className="text-xs font-bold text-slate-200 block uppercase">
                Photo de profil du membre
              </span>
              <p className="text-[11px] text-slate-400">
                Téléchargez une photo depuis votre ordinateur ou renseignez une URL externe.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Upload size={14} />
                  <span>Télécharger une photo</span>
                </button>
                {previewAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewAvatar('');
                      setFormData((prev) => ({ ...prev, avatar: '' }));
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Identity fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Adresse Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                N° de Licence Officiel
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="FFCS-FR-..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Rôle et Statut Fédéral *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                
              </label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="ex: Adhésion acquitée ou Adhésion non acquitée"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Biographie & Palmarès Pilote
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Présentation sportive, discipline de prédilection..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer actions */}
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
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? (
                'Enregistrement...'
              ) : (
                <>
                  <Check size={16} />
                  <span>Valider les modifications présidentielles</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;
