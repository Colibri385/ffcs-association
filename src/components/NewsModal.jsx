import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Sparkles,
  AlertCircle,
  Tag,
  User,
  Link as LinkIcon,
  CheckCircle2,
  Send,
  Flame,
} from 'lucide-react';

const NEWS_CATEGORIES = [
  'Officiel',
  'Information',
  'Événement',
  'Important',
  'Flash Info',
  'Règlement',
  'Assemblée Générale',
];

export const NewsModal = ({
  isOpen,
  onClose,
  onSave,
  newsToEdit = null,
  currentUser = null,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Officiel',
    priority: 'normal',
    authorName: '',
    content: '',
    linkUrl: '',
    linkText: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (newsToEdit) {
      setFormData({
        title: newsToEdit.title || '',
        category: newsToEdit.category || 'Officiel',
        priority: newsToEdit.priority || 'normal',
        authorName: newsToEdit.authorName || '',
        content: newsToEdit.content || '',
        linkUrl: newsToEdit.linkUrl || '',
        linkText: newsToEdit.linkText || '',
      });
    } else {
      // Default author signature based on user
      let defaultAuthor = 'Bureau Fédéral';
      if (currentUser) {
        if (currentUser.role === 'president') {
          defaultAuthor = `${currentUser.name} (Président)`;
        } else if (currentUser.role === 'vice_president') {
          defaultAuthor = `${currentUser.name} (Vice-Président)`;
        } else if (currentUser.role === 'webmaster') {
          defaultAuthor = `${currentUser.name} (Webmaster)`;
        } else if (currentUser.name) {
          defaultAuthor = currentUser.name;
        }
      }

      setFormData({
        title: '',
        category: 'Officiel',
        priority: 'normal',
        authorName: defaultAuthor,
        content: '',
        linkUrl: '',
        linkText: '',
      });
    }
    setError(null);
  }, [newsToEdit, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Veuillez saisir un titre pour cette actualité.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Veuillez renseigner le contenu ou message de cette actualité.');
      return;
    }

    try {
      setSaving(true);
      await onSave(formData, newsToEdit?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de l’enregistrement de l’actualité.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Tricolore top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-white to-red-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bell size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Administration News
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Présidence • Vice-Présidence • Webmaster
                </span>
              </div>
              <h2 className="text-xl font-racing font-bold text-white mt-0.5">
                {newsToEdit ? 'Modifier l’Actualité' : 'Publier une Nouvelle Actualité'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Titre de l’actualité *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ex: Inscriptions ouvertes pour les épreuves 2027"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Category & Priority in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Tag size={13} className="text-slate-400" />
                <span>Catégorie / Badge</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Flame size={13} className="text-slate-400" />
                <span>Niveau d'importance</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: 'normal' }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    formData.priority === 'normal'
                      ? 'bg-blue-900/60 border-blue-500 text-blue-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Normale
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: 'high' }))}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    formData.priority === 'high'
                      ? 'bg-red-900/60 border-red-500 text-red-200 shadow-sm shadow-red-900/40'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame size={12} className="text-red-400" />
                  <span>Prioritaire</span>
                </button>
              </div>
            </div>
          </div>

          {/* Author Signature */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              <span>Signature / Auteur affiché</span>
            </label>
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              placeholder="ex: Jean-Claude BENOIT (Président) ou La Présidence"
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Contenu du message officiel *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              placeholder="Rédigez ici le texte de votre actualité ou information à destination des adhérents et visiteurs..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
              required
            />
          </div>

          {/* Optional Link in 2 columns */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon size={12} />
              <span>Lien d’action optionnel (Bouton cliquable)</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                placeholder="URL ou page (ex: /events ou https://...)"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="linkText"
                value={formData.linkText}
                onChange={handleChange}
                placeholder="Texte du bouton (ex: Consulter le calendrier)"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <span>Enregistrement...</span>
              ) : (
                <>
                  <Send size={14} />
                  <span>{newsToEdit ? 'Mettre à jour la News' : 'Publier la News'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsModal;
