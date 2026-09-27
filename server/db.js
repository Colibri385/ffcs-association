import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

const initialUsers = [
  {
    id: 'usr_president',
    name: 'Jean-Claude benoît',
    email: 'president@ffcs.fr',
    passwordHash: bcrypt.hashSync('President2026!', saltRounds),
    role: ROLES.PRESIDENT,
    licenseNumber: 'FFCS-FR-001',
    phone: '+33 6 12 34 56 78',
    vehicle: 'Adhésion acquitée',
    bio: 'Bénévole PARIS 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80',
    createdAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: 'usr_vice_president',
    name: 'Éléonore Vasseur',
    email: 'vice-president@ffcs.fr',
    passwordHash: bcrypt.hashSync('VicePres2026!', saltRounds),
    role: ROLES.VICE_PRESIDENT,
    licenseNumber: 'FFCS-FR-002',
    phone: '+33 6 23 45 67 89',
    vehicle: 'Alpine A110 R',
    bio: 'Pilote instructrice BPJEPS et responsable des partenariats circuits et relations avec les institutions sportives.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop&q=80',
    createdAt: '2025-01-02T10:00:00.000Z'
  },
  {
    id: 'usr_secretary',
    name: 'Marc Fontaine',
    email: 'secretaire@ffcs.fr',
    passwordHash: bcrypt.hashSync('Secretaire2026!', saltRounds),
    role: ROLES.SECRETARY,
    licenseNumber: 'FFCS-FR-003',
    phone: '+33 6 34 56 78 90',
    vehicle: 'BMW M3 Competition (G80)',
    bio: 'Coordinateur des homologations d’épreuves, procès-verbaux d’assemblée et suivi administratif des licences des adhérents.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&q=80',
    createdAt: '2025-01-03T10:00:00.000Z'
  },
  {
    id: 'usr_treasurer',
    name: 'Sophie Laurent',
    email: 'tresorier@ffcs.fr',
    passwordHash: bcrypt.hashSync('Tresorier2026!', saltRounds),
    role: ROLES.TREASURER,
    licenseNumber: 'FFCS-FR-004',
    phone: '+33 6 45 67 89 01',
    vehicle: 'Renault Mégane R.S. Trophy',
    bio: 'Experte-comptable de formation et passionnée de slalom. Gestionnaire de la conformité budgétaire et des assurances fédérales.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&fit=crop&q=80',
    createdAt: '2025-01-04T10:00:00.000Z'
  },
  {
    id: 'usr_board_member',
    name: 'Julien Rossi',
    email: 'bureau@ffcs.fr',
    passwordHash: bcrypt.hashSync('Bureau2026!', saltRounds),
    role: ROLES.BOARD_MEMBER,
    licenseNumber: 'FFCS-FR-005',
    phone: '+33 6 56 78 90 12',
    vehicle: 'Lotus Exige Cup 430',
    bio: 'Directeur de course fédéral et responsable des commissions de sécurité et des commissaires de piste bénévoles.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&fit=crop&q=80',
    createdAt: '2025-01-05T10:00:00.000Z'
  },
  {
    id: 'usr_regular_member',
    name: 'Lucas Moreau',
    email: 'pilote@ffcs.fr',
    passwordHash: bcrypt.hashSync('Pilote2026!', saltRounds),
    role: ROLES.REGULAR_MEMBER,
    licenseNumber: 'FFCS-FR-042',
    phone: '+33 6 98 76 54 32',
    vehicle: 'Toyota GR Yaris Circuit Pack',
    bio: 'Passionné de trackdays et d’asphalte, membre actif depuis 2 ans.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80',
    createdAt: '2025-02-01T14:20:00.000Z'
  },
  {
    id: 'usr_camille',
    name: 'Camille Bernard',
    email: 'camille@ffcs.fr',
    passwordHash: bcrypt.hashSync('Pilote2026!', saltRounds),
    role: ROLES.REGULAR_MEMBER,
    licenseNumber: 'FFCS-FR-089',
    phone: '+33 6 87 65 43 21',
    vehicle: 'Honda Civic Type R',
    bio: 'Pilote amateur de courses de côte et slalom.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&fit=crop&q=80',
    createdAt: '2025-02-10T09:15:00.000Z'
  }
];

const initialEvents = [
  {
    id: 'evt-paul-ricard',
    title: 'Track Day & Coaching Pilote - Circuit Paul Ricard',
    category: 'Arena Les Sables d Olonne',
    date: '2026-10-18',
    time: '08:30 - 18:00',
    location: 'Circuit Paul Ricard, Le Castellet (Var)',
    trackLength: '5.8 km (Tracé 1C V2)',
    description: 'Journée roulage libre exclusive réservée aux membres FFCS avec briefing de sécurité, chronométrage transpondeur officiel et sessions de coaching personnalisées par des pilotes instructeurs diplômés BPJEPS.',
    totalSpots: 25,
    requirements: 'Casque homologué, combinaison ou tenue couvrante, anneau de remorquage en place, bruit max 102 dB.',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80',
    createdBy: 'usr_president',
    createdAt: '2026-08-15T09:00:00.000Z',
    registeredUserIds: ['usr_regular_member', 'usr_vice_president', 'usr_board_member']
  },
  {
    id: 'evt-cevennes-rally',
    title: 'Rallye Asphalte FFCS - Cévennes & Garrigues',
    category: 'Rallye',
    date: '2026-11-07',
    time: '07:00 - 19:30',
    location: 'Alès & Cévennes Méridionales',
    trackLength: '142 km chronométrés',
    description: 'Épreuve de régularité et vitesse sur routes fermées sécurisées par les commissaires FFCS. 6 spéciales techniques réparties sur la journée, assistance mécanique et parc fermé au Pôle Mécanique d’Alès.',
    totalSpots: 20,
    requirements: 'Arceau de sécurité, harnais et extincteur valides, licence FFCS compétition à jour, casque FIA.',
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800&fit=crop&q=80',
    createdBy: 'usr_vice_president',
    createdAt: '2026-08-20T11:00:00.000Z',
    registeredUserIds: ['usr_camille', 'usr_regular_member']
  },
  {
    id: 'evt-karting-magny-cours',
    title: 'Championnat Fédéral Karting 2T - Magny-Cours',
    category: 'Karting',
    date: '2026-10-04',
    time: '09:00 - 17:00',
    location: 'Piste Karting Circuit de Nevers Magny-Cours',
    trackLength: '1 110 mètres',
    description: 'Coupe annuelle de Karting 2 Temps FFCS. Essais libres, qualifications au chrono, pré-finale et grande finale sous drapeau à damier avec podium et trophées fédéraux.',
    totalSpots: 3,
    requirements: 'Karts Rotax Max / IAME X30, minerve et protège-côtes obligatoires.',
    imageUrl: 'https://images.unsplash.com/photo-1516216628859-9bcceabb84ca?w=800&fit=crop&q=80',
    createdBy: 'usr_board_member',
    createdAt: '2026-08-01T10:00:00.000Z',
    // 3 spots taken = SOLD OUT
    registeredUserIds: ['usr_regular_member', 'usr_camille', 'usr_secretary']
  },
  {
    id: 'evt-loheac-glisse',
    title: 'Stage Pilotage Maîtrise & Glisse - Circuit de Lohéac',
    category: 'Stage de Pilotage',
    date: '2026-11-21',
    time: '09:30 - 16:30',
    location: 'Les Sables d Olonne)',
    trackLength: '2.2 km + Arroseurs',
    description: 'Perfectionnement du contrôle en survirage, freinage dégressif d’urgence et transfert de charge sur piste arrosée. Ateliers encadrés en petit comité pour affiner ses réflexes.',
    totalSpots: 16,
    requirements: 'Permis B valide, véhicule propre sans fuites de fluide, pneus bon état.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&fit=crop&q=80',
    createdBy: 'usr_president',
    createdAt: '2026-08-25T14:00:00.000Z',
    registeredUserIds: ['usr_camille']
  },
  {
    id: 'evt-mont-ventoux',
    title: 'Course de Côte FFCS - Mont Ventoux Trophy',
    category: 'Course de Côte',
    date: '2026-12-05',
    time: '08:00 - 17:30',
    location: 'Départ Bédoin - Arrivée Chalet Reynard (Vaucluse)',
    trackLength: '12.6 km de montée mythique',
    description: 'Montée historique et sportive sur les lacets légendaires du Géant de Provence. Chronométrage au millième de seconde, départ arrêté individuel toutes les 60 secondes.',
    totalSpots: 30,
    requirements: 'Combinaison ignifugée, contrôle technique fédéral le matin, passeport technique FFCS.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&fit=crop&q=80',
    createdBy: 'usr_secretary',
    createdAt: '2026-09-01T08:30:00.000Z',
    registeredUserIds: ['usr_regular_member']
  },
  {
    id: 'evt-simracing-lemans',
    title: 'Grand Prix SimRacing FFCS - 12 Heures de Spa-Francorchamps',
    category: 'SimRacing',
    date: '2026-12-19',
    time: '14:00 - 02:00',
    location: 'Serveurs Dédiés FFCS e-Sport (iRacing / Assetto Corsa)',
    trackLength: '7.004 km virtuel',
    description: 'Course endurance virtuelle par équipages de 2 ou 3 pilotes. Diffusion live streaming Twitch avec commentateurs professionnels, météo dynamique et pénalités de course en temps réel.',
    totalSpots: 40,
    requirements: 'Connexion filaire stable, volant retour de force, participation obligatoire au briefing Discord.',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&fit=crop&q=80',
    createdBy: 'usr_board_member',
    createdAt: '2026-09-05T12:00:00.000Z',
    registeredUserIds: ['usr_vice_president', 'usr_board_member']
  }
];

const initialBoardMembers = [
  {
    id: 'bureau_president',
    userId: 'usr_president',
    roleKey: ROLES.PRESIDENT,
    title: 'Président Fédéral',
    department: 'Direction Générale & Représentation',
    term: '2024 - 2028',
    order: 1,
    responsibilities: [
      'Représentation officielle de la FFCS auprès du Ministère des Sports et des circuits',
      'Définition des orientations stratégiques et du règlement sportif fédéral',
      'Présidence des assemblées générales et des conseils d’administration'
    ]
  },
  {
    id: 'bureau_vice_president',
    userId: 'usr_vice_president',
    roleKey: ROLES.VICE_PRESIDENT,
    title: 'Vice-Présidente',
    department: 'Coordination Opérationnelle & Circuits',
    term: '2024 - 2028',
    order: 2,
    responsibilities: [
      'Négociation des créneaux de piste et partenariats avec les circuits nationaux',
      'Supervision du corps des moniteurs diplômés et des stages de pilotage',
      'Suppléance du Président dans toutes les instances fédérales'
    ]
  },
  {
    id: 'bureau_secretary',
    userId: 'usr_secretary',
    roleKey: ROLES.SECRETARY,
    title: 'Secrétaire Général',
    department: 'Administration & Réglementation',
    term: '2024 - 2028',
    order: 3,
    responsibilities: [
      'Gestion des adhésions, registres officiels et délivrance des licences pilotes',
      'Rédaction des procès-verbaux, statuts et règlements intérieurs',
      'Veille juridique et conformité des dossiers préfectoraux d’épreuves'
    ]
  },
  {
    id: 'bureau_treasurer',
    userId: 'usr_treasurer',
    roleKey: ROLES.TREASURER,
    title: 'Trésorière Générale',
    department: 'Finances & Assurances',
    term: '2024 - 2028',
    order: 4,
    responsibilities: [
      'Établissement du budget prévisionnel et gestion des comptes bancaires',
      'Négociation des polices d’assurance responsabilité civile et corporelle circuit',
      'Contrôle financier des engagements sur chaque épreuve sportive'
    ]
  },
  {
    id: 'bureau_board_member',
    userId: 'usr_board_member',
    roleKey: ROLES.BOARD_MEMBER,
    title: 'Membre du Bureau & Directeur Technique',
    department: 'Sécurité Piste & Technique',
    term: '2024 - 2028',
    order: 5,
    responsibilities: [
      'Validation technique des véhicules engagés (sonomètre, arceau, freinage)',
      'Formation et coordination des commissaires de piste bénévoles',
      'Mise en place des protocoles d’intervention rapide et de secours'
    ]
  }
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.seed();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        JSON.parse(raw);
      } catch (err) {
        console.warn('Corrupted database file, re-seeding...', err);
        this.seed();
      }
    }
  }

  seed() {
    const data = {
      users: initialUsers,
      events: initialEvents,
      board: initialBoardMembers,
      associationInfo: {
        name: 'FFCS - Fédération Française des Conducteurs du Sport',
        acronym: 'FFCS',
        founded: 2012,
        slogan: 'Le plaisir de se laisser conduire',
        colors: {
          primary: '#123B70', // Blue
          secondary: '#FFFFFF', // White
          accent: '#DC2626' // Red
        },
        address: 'Les Sables d Olonne 85150, France',
        email: 'jean-claude.benoit1@orange.fr',
        phone: '+33 6 12 34 56 78'
      }
    };
    this.write(data);
    console.log('Database initialized and seeded successfully.');
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading database, restoring seed:', err);
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
    // Join board entry with user profile info
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

  // Association Info
  getAssociationInfo() {
    return this.read().associationInfo;
  }
}

export const db = new Database();
