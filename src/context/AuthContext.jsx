import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  REGULAR_MEMBER: 'regular_member',
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
  BOARD_MEMBER: 'board_member',
};

export const BOARD_ROLES = [
  ROLES.PRESIDENT,
  ROLES.VICE_PRESIDENT,
  ROLES.SECRETARY,
  ROLES.TREASURER,
  ROLES.BOARD_MEMBER,
];

export const getRoleInfo = (role) => {
  switch (role) {
    case ROLES.PRESIDENT:
      return {
        label: 'Président',
        fullLabel: 'Président du Bureau Fédéral',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold',
        isBoard: true,
      };
    case ROLES.VICE_PRESIDENT:
      return {
        label: 'Vice-Président',
        fullLabel: 'Vice-Président du Bureau Fédéral',
        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        badgeColor: 'bg-indigo-600 text-white font-semibold',
        isBoard: true,
      };
    case ROLES.SECRETARY:
      return {
        label: 'Secrétaire',
        fullLabel: 'Secrétaire Général',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        badgeColor: 'bg-blue-600 text-white font-semibold',
        isBoard: true,
      };
    case ROLES.TREASURER:
      return {
        label: 'Trésorier',
        fullLabel: 'Trésorier Général',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        badgeColor: 'bg-emerald-600 text-white font-semibold',
        isBoard: true,
      };
    case ROLES.BOARD_MEMBER:
      return {
        label: 'Membre du Bureau',
        fullLabel: 'Membre du Conseil & Bureau Fédéral',
        color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        badgeColor: 'bg-cyan-700 text-white font-semibold',
        isBoard: true,
      };
    case ROLES.REGULAR_MEMBER:
    default:
      return {
        label: 'Membre Régulier',
        fullLabel: 'Pilote Adhérent FFCS',
        color: 'bg-slate-700/30 text-slate-300 border-slate-700',
        badgeColor: 'bg-slate-800 text-slate-300 font-medium',
        isBoard: false,
      };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ffcs_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('ffcs_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(savedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('ffcs_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error verifying auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Identifiants invalides');
    }

    localStorage.setItem('ffcs_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de l’inscription');
    }

    localStorage.setItem('ffcs_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ffcs_token');
    setToken(null);
    setUser(null);
  };

  // Quick Demo Login (switches user instantaneously for test convenience)
  const quickDemoLogin = async (role) => {
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors du basculement de compte');
    }

    localStorage.setItem('ffcs_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const updateProfile = async (updates) => {
    if (!token) throw new Error('Non authentifié');

    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur de mise à jour');
    }

    setUser(data.user);
    return data;
  };

  // Refresh user data (e.g. after a role change)
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const isBoardMember = user ? BOARD_ROLES.includes(user.role) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateProfile,
        refreshUser,
        isLoggedIn: !!user,
        isBoardMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
