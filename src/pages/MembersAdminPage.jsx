import React, { useState, useEffect } from 'react';
import { useAuth, ROLES, BOARD_ROLES } from '../context/AuthContext';
import RoleBadge from '../components/RoleBadge';
import EditMemberModal from '../components/EditMemberModal';
import {
  ShieldCheck,
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  Award,
  Crown,
  Lock,
  Edit,
  UserCheck,
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: ROLES.REGULAR_MEMBER, label: 'Membre Régulier', isBoard: false },
  { value: ROLES.PRESIDENT, label: 'Président', isBoard: true },
  { value: ROLES.VICE_PRESIDENT, label: 'Vice-Président', isBoard: true },
  { value: ROLES.SECRETARY, label: 'Secrétaire', isBoard: true },
  { value: ROLES.TREASURER, label: 'Trésorier', isBoard: true },
  { value: ROLES.BOARD_MEMBER, label: 'Membre du Bureau', isBoard: true },
];

export const MembersAdminPage = () => {
  const { user, isBoardMember, token, refreshUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const isPresident = user?.role === ROLES.PRESIDENT;

  const handleSaveMemberFile = async (memberId, formData) => {
    if (!token) return;
    const res = await fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la modification de la fiche.');
    }

    setSuccessMessage(data.message);
    setTimeout(() => setSuccessMessage(null), 5000);
    fetchMembers();
    refreshUser();
  };

  const fetchMembers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors du chargement des membres.');
      }
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isBoardMember) {
      fetchMembers();
    }
  }, [token, isBoardMember]);

  // Handle changing a member's role
  const handleRoleChange = async (memberId, newRole) => {
    if (!token) return;
    setUpdatingId(memberId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/members/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la modification du rôle.');
      }

      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh members list and current user context
      fetchMembers();
      refreshUser();
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 6000);
    } finally {
      setUpdatingId(null);
    }
  };

  // Guard: if user is not a board member
  if (!isBoardMember) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-xl">
          <Lock size={32} />
        </div>
        <h1 className="font-racing font-extrabold text-3xl text-white uppercase mb-3">
          Accès Restreint au Bureau Fédéral
        </h1>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Conformément aux statuts de la Fédération Française des Conducteurs du Sport (FFCS), les modifications du site et l’attribution des rôles sont exclusivement réservées aux membres du bureau (Président, Vice-Président, Secrétaire, Trésorier, Membre du Bureau).
        </p>
        <p className="text-xs text-slate-400">
          Votre rôle actuel est : <span className="font-bold text-slate-200">{user?.role || 'Visiteur non connecté'}</span>. Vous pouvez tester un rôle de membre du bureau à tout moment via le sélecteur situé dans la barre de navigation.
        </p>
      </div>
    );
  }

  // Filtering
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.licenseNumber && m.licenseNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'board' ? BOARD_ROLES.includes(m.role) : m.role === roleFilter);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} />
            Espace d’Administration Fédérale
          </div>
          <h1 className="font-racing font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Gestion des Membres & Attribution des Rôles
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Attribuez ou modifiez les rôles des adhérents de la fédération (Président, Vice-Président, Secrétaire, Trésorier, Membre du bureau, Membre régulier).
          </p>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* President Exclusive Notice */}
      {isPresident && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/40 text-amber-300 shrink-0">
              <Crown size={20} />
            </div>
            <div>
              <strong className="text-sm font-bold text-white block">Privilège Exclusif de la Présidence Fédérale</strong>
              <span>En tant que Président, vous avez le pouvoir de modifier l’intégralité des fiches de tous les membres (coordonnées, photos de profil, licence, véhicule, bio, rôles).</span>
            </div>
          </div>
          <span className="hidden md:inline-block px-3 py-1 bg-amber-500 text-slate-950 rounded-full font-bold text-[10px] uppercase tracking-wider">
            Président Actif
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou n° de licence..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les rôles ({members.length})</option>
            <option value="board">Membres du Bureau uniquement</option>
            <option value={ROLES.REGULAR_MEMBER}>Membres Réguliers</option>
            <option value={ROLES.PRESIDENT}>Président</option>
            <option value={ROLES.VICE_PRESIDENT}>Vice-Président</option>
            <option value={ROLES.SECRETARY}>Secrétaire</option>
            <option value={ROLES.TREASURER}>Trésorier</option>
            <option value={ROLES.BOARD_MEMBER}>Membre du Bureau</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Adhérent</th>
                <th className="py-4 px-4">Licence & Véhicule</th>
                <th className="py-4 px-4">Rôle Actuel</th>
                <th className="py-4 px-4">Inscriptions</th>
                <th className="py-4 px-6 text-right">Actions Fédérales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Chargement des adhérents...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    Aucun membre trouvé avec ces filtres.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Member Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.name}`}
                          alt={m.name}
                          className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.id === user.id && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                                Vous
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{m.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* License & Vehicle */}
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs text-slate-300">
                        {m.licenseNumber || 'En attente'}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">
                        {m.vehicle || 'Pilote'}
                      </div>
                    </td>

                    {/* Current Role */}
                    <td className="py-4 px-4">
                      <RoleBadge role={m.role} size="xs" />
                    </td>

                    {/* Enrolled Events Count */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
                        <span className="text-blue-400 font-bold">{m.enrolledCount || 0}</span>
                        <span>épreuve{(m.enrolledCount || 0) > 1 ? 's' : ''}</span>
                      </span>
                    </td>

                    {/* Actions: President Edit File + Role Selector */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPresident && (
                          <button
                            onClick={() => setEditingMember(m)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02]"
                            title="Modifier l'intégralité de la fiche du membre (Pouvoir Présidentiel)"
                          >
                            <Edit size={13} />
                            <span className="hidden sm:inline">Modifier la fiche</span>
                          </button>
                        )}
                        <select
                          disabled={updatingId === m.id}
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label} {opt.isBoard ? '(Bureau)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* President Member Edit Modal */}
      {isPresident && (
        <EditMemberModal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleSaveMemberFile}
          member={editingMember}
        />
      )}
    </div>
  );
};

export default MembersAdminPage;

