import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NewsModal from './NewsModal';
import {
  Bell,
  Radio,
  Flame,
  PlusCircle,
  Edit3,
  Trash2,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Tag,
} from 'lucide-react';

export const NewsSection = () => {
  const { user, token, canManageNews } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNewsList(data.news || []);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSaveNews = async (formData, newsId = null) => {
    if (!token) throw new Error('Authentification requise.');

    const url = newsId ? `/api/news/${newsId}` : '/api/news';
    const method = newsId ? 'PUT' : 'POST';

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
      throw new Error(data.error || 'Erreur lors de l’enregistrement.');
    }

    setSuccessMessage(data.message);
    setTimeout(() => setSuccessMessage(null), 4000);
    fetchNews();
  };

  const handleDeleteNews = async (newsId, title) => {
    if (!token) return;
    if (!window.confirm(`Confirmez-vous la suppression de l’actualité : "${title}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la suppression.');

      setSuccessMessage('Actualité supprimée avec succès.');
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchNews();
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      return new Date(isoStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast notifications */}
      {successMessage && (
        <div className="mb-4 flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-sm shadow-lg animate-in fade-in">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 flex items-center gap-3 p-3.5 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-sm shadow-lg animate-in fade-in">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main News Card Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950/95 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-80 h-40 bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-36 bg-red-600/10 blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-950/60 border border-red-700/50 text-red-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Flash Info & Actualités
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • Communications officielles FFCS
              </span>
            </div>
            <h2 className="font-racing font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
              <span>Fenêtre des Actualités Fédérales</span>
            </h2>
          </div>

          {/* Admin Management Privilege / Button */}
          {canManageNews && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setEditingNews(null);
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 shadow-md shadow-red-900/20 transition-all hover:scale-[1.02]"
              >
                <PlusCircle size={16} />
                <span>Ajouter une News</span>
              </button>
            </div>
          )}
        </div>

        {/* News Content */}
        <div className="mt-6 relative z-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800" />
              <div className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800" />
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/60">
              <Radio size={40} className="mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-300 mb-1">
                Aucune actualité publiée pour le moment
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Les prochaines annonces de la présidence et du bureau fédéral s’afficheront directement ici.
              </p>
              {canManageNews && (
                <button
                  onClick={() => {
                    setEditingNews(null);
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <PlusCircle size={14} />
                  <span>Publier la première actualité</span>
                </button>
              )}
            </div>
          ) : (
            <div className={`grid gap-5 ${newsList.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {newsList.map((item) => {
                const isHighPriority = item.priority === 'high';
                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 border ${
                      isHighPriority
                        ? 'bg-gradient-to-b from-red-950/30 via-slate-900/90 to-slate-900/90 border-red-500/40 shadow-lg shadow-red-950/20 ring-1 ring-red-500/20'
                        : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Category pill */}
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              isHighPriority
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
                            }`}
                          >
                            {item.category || 'Information'}
                          </span>

                          {/* Priority flame */}
                          {isHighPriority && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Flame size={11} className="text-amber-400" />
                              <span>Prioritaire</span>
                            </span>
                          )}
                        </div>

                        {/* Management Buttons for President / VP / Webmaster */}
                        {canManageNews && (
                          <div className="flex items-center gap-1 shrink-0 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
                            <button
                              onClick={() => {
                                setEditingNews(item);
                                setModalOpen(true);
                              }}
                              title="Modifier cette news (Président/VP/Webmaster)"
                              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id, item.title)}
                              title="Supprimer cette news"
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* News Title */}
                      <h3 className="font-racing font-bold text-lg text-white mb-2 leading-snug">
                        {item.title}
                      </h3>

                      {/* Content text */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-4">
                        {item.content}
                      </p>
                    </div>

                    {/* Bottom Metadata & Link */}
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 mt-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar size={12} className="text-slate-500" />
                          <span>{formatDate(item.createdAt)}</span>
                        </span>
                        {item.authorName && (
                          <span className="flex items-center gap-1 text-slate-300 font-medium truncate max-w-[170px]">
                            <User size={12} className="text-slate-500 shrink-0" />
                            <span className="truncate">{item.authorName}</span>
                          </span>
                        )}
                      </div>

                      {/* Optional Action Link */}
                      {item.linkUrl && (
                        <div className="shrink-0">
                          {item.linkUrl.startsWith('http') ? (
                            <a
                              href={item.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <span>{item.linkText || 'En savoir plus'}</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <Link
                              to={item.linkUrl}
                              className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <span>{item.linkText || 'En savoir plus'}</span>
                              <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Small footer note for unauthorized users */}
        {canManageNews && (
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>
              Privilège actif : En tant que Président, Vice-Président ou Webmaster, vous disposez des droits complets d’ajout, modification et suppression des actualités.
            </span>
          </div>
        )}
      </div>

      {/* News Modal */}
      {modalOpen && (
        <NewsModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingNews(null);
          }}
          onSave={handleSaveNews}
          newsToEdit={editingNews}
          currentUser={user}
        />
      )}
    </section>
  );
};

export default NewsSection;
