import React from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import RoleBadge from './RoleBadge';
import { Mail, Phone, Calendar, ShieldCheck, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export const BoardCard = ({ item, onEdit, onDelete }) => {
  const { user: currentUser, isBoardMember } = useAuth();
  const { id, title, department, term, responsibilities = [], user = {} } = item;

  const isPresident = currentUser?.role === ROLES.PRESIDENT;
  const canDelete = isPresident && item.roleKey !== ROLES.PRESIDENT && user.id !== currentUser?.id;

  return (
    <div className="racing-card overflow-hidden flex flex-col group relative border-t-4 border-t-blue-600 hover:border-t-red-600 transition-all duration-300">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header with Avatar & Official Title */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'member')}`
                  }
                  alt={user.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 group-hover:border-red-500/80 transition-colors shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2">
                  <span className="p-1 rounded-md bg-slate-900 border border-slate-700 shadow-sm flex items-center justify-center">
                    <ShieldCheck size={14} className="text-blue-400" />
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-racing font-bold text-xl text-white group-hover:text-blue-400 transition-colors">
                  {user.name || 'Membre du Bureau'}
                </h3>
                <div className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                  {title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {department}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isBoardMember && onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-blue-600 rounded-lg border border-slate-700 transition-colors"
                  title="Modifier les missions du bureau"
                >
                  <Edit3 size={15} />
                </button>
              )}

              {canDelete && onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 text-rose-400 hover:text-white bg-slate-800/80 hover:bg-rose-600 rounded-lg border border-slate-700 transition-colors"
                  title="Supprimer ce membre du bureau (Pouvoir Présidentiel)"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Role badge & Mandate */}
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <RoleBadge role={user.role} size="sm" />
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={12} className="text-slate-500" />
              Mandat {term || '2024 - 2028'}
            </span>
          </div>

          {/* Bio preview if available */}
          {user.bio && (
            <p className="text-xs text-slate-300 italic mb-4 line-clamp-2">
              « {user.bio} »
            </p>
          )}

          {/* Responsibilities list */}
          <div className="space-y-2 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Missions Fédérales :
            </span>
            <ul className="space-y-1.5">
              {responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                  <CheckCircle2 size={13} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info footer */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-1.5 hover:text-blue-300 transition-colors"
            >
              <Mail size={13} className="text-blue-400" />
              <span>{user.email}</span>
            </a>
          )}
          {user.vehicle && (
            <span className="text-[11px] text-slate-400 truncate">
              🏁 {user.vehicle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
