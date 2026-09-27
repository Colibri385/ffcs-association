import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, ROLES, isBoardRole } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

// Register (Free registration for any sports driver)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, vehicle, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Le nom, l’adresse email et le mot de passe sont obligatoires.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 6 caractères.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cette adresse email.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Auto-generate official membership license code
    const existingCount = db.getUsers().length;
    const licenseNumber = `FFCS-FR-${String(existingCount + 1).padStart(3, '0')}`;

    // Any public registration gets REGULAR_MEMBER role by default
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: ROLES.REGULAR_MEMBER, // regular member
      licenseNumber,
      phone: phone || '',
      vehicle: vehicle || '',
      bio: bio || 'Pilote passionné adhérent à la FFCS.',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const token = generateToken(newUser);
    const userSafe = sanitizeUser(newUser);

    res.status(201).json({
      message: 'Inscription gratuite réussie ! Bienvenue à la Fédération Française des Conducteurs du Sport.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erreur lors de l’inscription.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = generateToken(user);
    const userSafe = sanitizeUser(user);

    res.json({
      message: 'Connexion réussie.',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// Quick Demo Login (switches to pre-configured accounts for testing)
router.post('/demo-login', (req, res) => {
  try {
    const { role } = req.body;
    let targetEmail;

    switch (role) {
      case ROLES.PRESIDENT:
        targetEmail = 'president@ffcs.fr';
        break;
      case ROLES.VICE_PRESIDENT:
        targetEmail = 'vice-president@ffcs.fr';
        break;
      case ROLES.SECRETARY:
        targetEmail = 'secretaire@ffcs.fr';
        break;
      case ROLES.TREASURER:
        targetEmail = 'tresorier@ffcs.fr';
        break;
      case ROLES.BOARD_MEMBER:
        targetEmail = 'bureau@ffcs.fr';
        break;
      case ROLES.REGULAR_MEMBER:
      default:
        targetEmail = 'pilote@ffcs.fr';
        break;
    }

    const user = db.getUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ error: 'Compte de démonstration introuvable.' });
    }

    const token = generateToken(user);
    res.json({
      message: `Connexion rapide réussie en tant que ${user.name} (${user.role}).`,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Erreur démo login.' });
  }
});

// Get Current User Profile
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Update Profile
router.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, phone, vehicle, bio, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone;
    if (vehicle !== undefined) updates.vehicle = vehicle;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const updatedUser = db.updateUser(req.user.id, updates);
    res.json({
      message: 'Profil mis à jour avec succès.',
      user: sanitizeUser(updatedUser)
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

export default router;
