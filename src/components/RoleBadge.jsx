import React from 'react';
import { Crown, Shield, FileText, Landmark, Users, User, Award } from 'lucide-react';
import { ROLES, getRoleInfo } from '../context/AuthContext';

export const RoleBadge = ({ role, showIcon = true, size = 'sm' }) => {
  const info = getRoleInfo(role);

  const getIcon = () => {
    const iconSize = size === 'xs' ? 12 : size === 'sm' ? 14 : 16;
    switch (role) {
      case ROLES.PRESIDENT:
        return <Crown size={iconSize} className="text-amber-400" />;
      case ROLES.VICE_PRESIDENT:
        return <Award size={iconSize} className="text-indigo-300" />;
      case ROLES.SECRETARY:
        return <FileText size={iconSize} className="text-blue-300" />;
      case ROLES.TREASURER:
        return <Landmark size={iconSize} className="text-emerald-300" />;
      case ROLES.BOARD_MEMBER:
        return <Shield size={iconSize} className="text-cyan-300" />;
      case ROLES.REGULAR_MEMBER:
      default:
        return <User size={iconSize} className="text-slate-400" />;
    }
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm ${info.color} ${sizeClasses}`}
      title={info.fullLabel}
    >
      {showIcon && getIcon()}
      <span>{info.label}</span>
      {info.isBoard && (
        <span className="ml-0.5 text-[10px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-red-600/80 text-white leading-tight">
          Bureau
        </span>
      )}
    </span>
  );
};

export default RoleBadge;
