import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single unique database file: store.json at project root (same as used in production)
const DB_FILE = path.join(__dirname, '..', 'store.json');

// Obsolete local database path (to remove if present)
const OBSOLETE_LOCAL_DB = path.join(__dirname, 'data', 'store.json');

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

export const isBoardRole = (role) => BOARD_ROLES.includes(role);

const saltRounds = 10;

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Clean up obsolete duplicate local database if it exists
    if (fs.existsSync(OBSOLETE_LOCAL_DB)) {
      try {
        fs.unlinkSync(OBSOLETE_LOCAL_DB);
        console.log('Ancienne base locale server/data/store.json retirée.');
      } catch (e) {
        // Ignorer si verrouillé
      }
    }

    if (!fs.existsSync(DB_FILE)) {
      this.seed();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        JSON.parse(raw);
        console.log(`Base de données unique chargée depuis ${DB_FILE}`);
      } catch (err) {
        console.warn('Fichier store.json corrompu, réinitialisation...', err);
        this.seed();
      }
    }
  }

  seed() {
    const data = {
      users: [
        {
          id: 'usr_president',
          name: 'Jean-Claude BENOIT',
          email: 'jean-claude.benoit1@orange.fr',
          passwordHash: bcrypt.hashSync('President2026!', saltRounds),
          role: ROLES.PRESIDENT,
          licenseNumber: 'FFCS-FR-001',
          phone: '+33 6 12 34 56 78',
          vehicle: 'Adhésion Acquittée',
          bio: 'Président de la FFCS.',
          avatar: '',
          createdAt: new Date().toISOString()
        }
      ],
      events: [],
      board: [
        {
          id: 'bureau_president',
          userId: 'usr_president',
          roleKey: ROLES.PRESIDENT,
          title: 'Président Fédéral',
          department: 'Direction Générale & Représentation',
          term: '2024 - 2028',
          order: 1,
          responsibilities: [
            'Représentation officielle de la FFCS auprès des autorités et des circuits',
            'Définition des orientations stratégiques et du règlement sportif fédéral',
            'Présidence des assemblées générales et des conseils d’administration'
          ]
        }
      ],
      associationInfo: {
        name: 'FFCS - Fédération Française des Conducteurs du Sport',
        acronym: 'FFCS',
        founded: 2012,
        slogan: 'La passion du pilotage, l’exigence de la sécurité',
        colors: {
          primary: '#123B70',
          secondary: '#FFFFFF',
          accent: '#DC2626'
        },
        address: "Les Sables d'Olonne",
        email: 'jean-claude.benoit1@orange.fr',
        phone: '+33 6 12 34 56 78'
      }
    };
    this.write(data);
    console.log('Database initialized and seeded.');
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Erreur lecture store.json, restauration...', err);
      this.seed();
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Users
  getUsers() {
    return this.read().users;
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const data = this.read();
    data.users.push(userData);
    this.write(data);
    return userData;
  }

  updateUser(id, updates) {
    const data = this.read();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates };
    this.write(data);
    return data.users[index];
  }

  // Events
  getEvents() {
    return this.read().events;
  }

  getEventById(id) {
    return this.getEvents().find(e => e.id === id);
  }

  createEvent(eventData) {
    const data = this.read();
    data.events.unshift(eventData);
    this.write(data);
    return eventData;
  }

  updateEvent(id, updates) {
    const data = this.read();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    data.events[index] = { ...data.events[index], ...updates };
    this.write(data);
    return data.events[index];
  }

  deleteEvent(id) {
    const data = this.read();
    const initialLen = data.events.length;
    data.events = data.events.filter(e => e.id !== id);
    if (data.events.length !== initialLen) {
      this.write(data);
      return true;
    }
    return false;
  }

  // Event Registrations
  registerUserForEvent(eventId, userId) {
    const data = this.read();
    const event = data.events.find(e => e.id === eventId);
    if (!event) {
      return { success: false, error: 'Événement introuvable.' };
    }
    if (!event.registeredUserIds) {
      event.registeredUserIds = [];
    }
    if (event.registeredUserIds.includes(userId)) {
      return { success: false, error: 'Vous êtes déjà inscrit à cet événement.' };
    }
    const remainingSpots = event.totalSpots - event.registeredUserIds.length;
    if (remainingSpots <= 0) {
      return { success: false, error: 'Désolé, cet événement est complet (plus de places disponibles).' };
    }

    event.registeredUserIds.push(userId);
    this.write(data);
    return {
      success: true,
      event,
      remainingSpots: event.totalSpots - event.registeredUserIds.length
    };
  }

  unregisterUserFromEvent(eventId, userId) {
    const data = this.read();
    const event = data.events.find(e => e.id === eventId);
    if (!event) {
      return { success: false, error: 'Événement introuvable.' };
    }
    if (!event.registeredUserIds || !event.registeredUserIds.includes(userId)) {
      return { success: false, error: 'Vous n’étiez pas inscrit à cet événement.' };
    }

    event.registeredUserIds = event.registeredUserIds.filter(id => id !== userId);
    this.write(data);
    return {
      success: true,
      event,
      remainingSpots: event.totalSpots - event.registeredUserIds.length
    };
  }

  // Board
  getBoard() {
    const data = this.read();
    return data.board.map(entry => {
      const user = data.users.find(u => u.id === entry.userId) || {};
      return {
        ...entry,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
          bio: user.bio,
          vehicle: user.vehicle,
          licenseNumber: user.licenseNumber
        }
      };
    }).sort((a, b) => (a.order || 99) - (b.order || 99));
  }

  updateBoardMember(boardId, updates) {
    const data = this.read();
    const index = data.board.findIndex(b => b.id === boardId);
    if (index === -1) return null;
    data.board[index] = { ...data.board[index], ...updates };
    this.write(data);
    return this.getBoard().find(b => b.id === boardId);
  }

  // Remove board member by boardId (used on BoardPage)
  removeBoardMember(boardId) {
    const data = this.read();
    const entry = data.board.find(b => b.id === boardId);
    if (!entry) return null;

    if (entry.roleKey === ROLES.PRESIDENT) {
      throw new Error('Impossible de retirer le Président du bureau.');
    }

    // Remove from board
    data.board = data.board.filter(b => b.id !== boardId);

    // Demote user role to regular_member
    const userIndex = data.users.findIndex(u => u.id === entry.userId);
    if (userIndex !== -1) {
      data.users[userIndex].role = ROLES.REGULAR_MEMBER;
    }

    this.write(data);
    return true;
  }

  // Remove board member by userId (used on MembersAdminPage)
  removeUserFromBoard(userId) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (!user) return null;

    if (user.role === ROLES.PRESIDENT) {
      throw new Error('Impossible de retirer le Président du bureau.');
    }

    // Remove from board
    data.board = data.board.filter(b => b.userId !== userId);

    // Demote user role to regular_member
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      data.users[userIndex].role = ROLES.REGULAR_MEMBER;
    }

    this.write(data);
    return true;
  }

  // Association Info
  getAssociationInfo() {
    return this.read().associationInfo;
  }
}

export const db = new Database();
