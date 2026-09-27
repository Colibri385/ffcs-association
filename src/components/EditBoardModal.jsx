import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export const EditBoardModal = ({ isOpen, onClose, onSave, item }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [term, setTerm] = useState('');
  const [responsibilities, setResponsibilities] = useState([]);
  const [newResp, setNewResp] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDepartment(item.department || '');
      setTerm(item.term || '2024 - 2028');
      setResponsibilities(item.responsibilities || []);
    }
    setError(null);
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleAddResponsibility = () => {
    if (!newResp.trim()) return;
    setResponsibilities([...responsibilities, newResp.trim()]);
    setNewResp('');
  };

  const handleRemoveResponsibility = (index) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);
      await onSave(item.id, {
        title,
        department,
        term,
        responsibilities,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1 w-full tricolore-bar" />

        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <ShieldCheck size={14} />
              Gouvernance Fédérale
            </span>
            <h2 className="text-xl font-racing font-bold text-white mt-0.5">
              Modifier la Fiche : {item.user?.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-sm flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Titre / Fonction Officielle
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Pôle / Département
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Mandat
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Responsibilities list editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Missions & Responsabilités Fédérales
            </label>

            <div className="space-y-2 mb-3">
              {responsibilities.map((resp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-200"
                >
                  <span className="flex-1">{resp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add responsibility row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newResp}
                onChange={(e) => setNewResp(e.target.value)}
                placeholder="Ajouter une mission statutaire..."
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddResponsibility();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus size={14} />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

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
              {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoardModal;
