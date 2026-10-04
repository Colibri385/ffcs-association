import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BoardCard from '../components/BoardCard';
import EditBoardModal from '../components/EditBoardModal';
import {
  Award,
  Shield,
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';

export const BoardPage = () => {
  const { isBoardMember, token } = useAuth();
  const [board, setBoard] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/board');
      if (!res.ok) throw new Error('Impossible de charger le bureau.');
      const data = await res.json();
      setBoard(data.board || []);
      setInfo(data.associationInfo || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleEditBoard = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSaveBoard = async (boardId, updates) => {
    if (!token) throw new Error('Non authentifié');

    const res = await fetch(`/api/board/${boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la modification de la fiche.');
    }

    setSuccess('La composition du bureau a été mise à jour avec succès.');
    setTimeout(() => setSuccess(null), 5000);
    fetchBoard();
  };

  const handleDeleteBoard = async (item) => {
    if (!token) return;
    const memberName = item.user?.name || item.title || 'ce membre';
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${memberName} du Bureau Fédéral ?\n\nCette action retirera sa fiche du bureau et réinitialisera son rôle à Membre Régulier.`
    );
    if (!confirmDelete) return;

    try {
      setError(null);
      const res = await fetch(`/api/board/${item.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      setSuccess(data.message || `${memberName} a été retiré du bureau fédéral avec succès.`);
      setTimeout(() => setSuccess(null), 5000);
      fetchBoard();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 6000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-widest text-blue-400">
          <Award size={15} />
          <span>Gouvernance & Statuts Fédéraux</span>
        </div>

        <h1 className="font-racing font-extrabold text-4xl sm:text-6xl text-white uppercase tracking-tight">
          Composition du Bureau Fédéral
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Le Bureau Fédéral de la Fédération Française des Conducteurs du Sport assure la direction exécutive de l'association, la supervision des épreuves sportives et l'application des règlements de sécurité sur les circuits.
        </p>

        {isBoardMember && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-800/60 rounded-xl text-xs font-semibold text-red-300">
            <ShieldCheck size={16} className="text-red-400" />
            <span>Vous êtes connecté en tant que membre du bureau : vous pouvez éditer les fiches et gérer les rôles.</span>
          </div>
        )}
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

      {/* Board Members Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-72 rounded-xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {board.map((item) => (
            <BoardCard
              key={item.id}
              item={item}
              onEdit={handleEditBoard}
              onDelete={handleDeleteBoard}
            />
          ))}
        </div>
      )}

      {/* Roles & Governance Explanatory Card */}
      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800 text-blue-400">
            <Building size={24} />
          </div>
          <div>
            <h2 className="font-racing font-bold text-2xl text-white">
              Organisation des Rôles au sein de la FFCS
            </h2>
            <p className="text-xs text-slate-400">
              Chaque membre adhérent se voit attribuer un rôle officiel selon les statuts de la fédération.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="font-racing font-bold text-lg text-amber-400 mb-1">
              Président & Vice-Président
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direction stratégique, représentation auprès des autorités sportives, animation des conseils d'administration et arbitrage fédéral.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="font-racing font-bold text-lg text-blue-400 mb-1">
              Secrétaire & Trésorier
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tenue des registres d'adhésion, gestion des adhérents, procès-verbaux légaux, gestion des budgets d'épreuves et polices d'assurance circuit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="font-racing font-bold text-lg text-slate-300 mb-1">
              Membres du Bureau & Membres Réguliers
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Les membres du bureau préparent les moyens et aident à l'organisation des évènements.
            </p>
          </div>
        </div>

        {/* Board Portal Link for Board Members */}
        {isBoardMember && (
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              <strong className="text-white">Administration des rôles :</strong> Vous pouvez attribuer et modifier les rôles de chaque adhérent de la fédération.
            </div>
            <Link
              to="/admin/members"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Users size={15} />
              <span>Gérer les Membres & Rôles</span>
            </Link>
          </div>
        )}
      </div>

      {/* Edit Board Modal */}
      {isBoardMember && (
        <EditBoardModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveBoard}
          item={editingItem}
        />
      )}
    </div>
  );
};

export default BoardPage;
