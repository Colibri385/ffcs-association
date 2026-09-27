import jwt from 'jsonwebtoken';
import { db, isBoardRole } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'ffcs-motorsport-secret-key-2026';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.id);
    if (!user) {
      req.user = null;
      return next();
    }
    // Return sanitized user without passwordHash
    const { passwordHash, ...sanitized } = user;
    req.user = sanitized;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Veuillez vous connecter pour effectuer cette action.' });
  }
  next();
};

export const requireBoardMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }

  if (!isBoardRole(req.user.role)) {
    return res.status(403).json({
      error: 'Accès restreint : Seuls les membres du bureau ont l’autorisation de modifier le site.',
      userRole: req.user.role
    });
  }

  next();
};
