import express from 'express';
import { db, ROLES, isBoardRole, BOARD_ROLES } from '../db.js';
import { requireAuth, requireBoardMember } from '../middleware/auth.js';

const router = express.Router();

// GET /api/members/my-events - Get events registered by current logged in user
router.get('/my-events', requireAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const allEvents = db.getEvents();

    const myEvents = allEvents
      .filter(event => (event.registeredUserIds || []).includes(userId))
      .map(event => {
        const registeredCount = (event.registeredUserIds || []).length;
        return {
          ...event,
          registeredCount,
          remainingSpots: Math.max(0, event.totalSpots - registeredCount),
          isRegistered: true
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ events: myEvents });
  } catch (err) {
    console.error('Error fetching user events:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de vos inscriptions.' });
  }
});

// GET /api/members - List all members (BOARD MEMBERS ONLY)
router.get('/', requireBoardMember, (req, res) => {
  try {
    const users = db.getUsers().map(({ passwordHash, ...rest }) => {
      // Calculate how many events they signed up for
      const enrolledCount = db.getEvents().filter(e => (e.registeredUserIds || []).includes(rest.id)).length;
      return {
        ...rest,
        enrolledCount
      };
    });

    res.json({
      members: users,
      roles: ROLES
    });
  } catch (err) {
    console.error('Error listing members:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des membres.' });
  }
});

// PUT /api/members/:id/role - Assign or change a member's role (BOARD MEMBERS ONLY)
router.put('/:id/role', requireBoardMember, (req, res) => {
  try {
    const { role } = req.body;
    const targetUserId = req.params.id;

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Rôle invalide. Rôles autorisés: ${validRoles.join(', ')}`
      });
    }

    const targetUser = db.getUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Membre introuvable.' });
    }

    // Safety: check if changing a president's role would leave 0 presidents
    if (targetUser.role === ROLES.PRESIDENT && role !== ROLES.PRESIDENT) {
      const allPresidents = db.getUsers().filter(u => u.role === ROLES.PRESIDENT && u.id !== targetUserId);
      if (allPresidents.length === 0) {
        return res.status(400).json({
          error: 'Impossible de rétrograder le Président : La FFCS doit toujours avoir au moins un Président en exercice.'
        });
      }
    }

    // Update user role
    const updatedUser = db.updateUser(targetUserId, { role });

    // Sync board table if needed
    const data = db.read();
    const existingBoardEntryIndex = data.board.findIndex(b => b.userId === targetUserId);

    if (isBoardRole(role)) {
      // If newly promoted to board or changed board role, make sure they are in board list
      let title = 'Membre du Bureau';
      let dept = 'Commission Fédérale';
      if (role === ROLES.PRESIDENT) { title = 'Président Fédéral'; dept = 'Direction Générale'; }
      if (role === ROLES.VICE_PRESIDENT) { title = 'Vice-Président(e)'; dept = 'Coordination Sportive'; }
      if (role === ROLES.SECRETARY) { title = 'Secrétaire Général(e)'; dept = 'Administration & Licences'; }
      if (role === ROLES.TREASURER) { title = 'Trésorier(ère) Général(e)'; dept = 'Finances & Assurances'; }

      if (existingBoardEntryIndex >= 0) {
        data.board[existingBoardEntryIndex].roleKey = role;
        data.board[existingBoardEntryIndex].title = title;
        data.board[existingBoardEntryIndex].department = dept;
      } else {
        data.board.push({
          id: `bureau_${Date.now()}`,
          userId: targetUserId,
          roleKey: role,
          title,
          department: dept,
          term: '2024 - 2028',
          order: data.board.length + 1,
          responsibilities: [
            'Participation aux délibérations du bureau directeur fédéral',
            'Soutien à l’organisation des épreuves et à la sécurité'
          ]
        });
      }
      db.write(data);
    } else {
      // Demoted to regular member: remove from official board composition if present
      if (existingBoardEntryIndex >= 0) {
        data.board.splice(existingBoardEntryIndex, 1);
        db.write(data);
      }
    }

    const { passwordHash, ...safeUser } = updatedUser;

    res.json({
      message: `Rôle mis à jour avec succès : ${updatedUser.name} est maintenant ${role}.`,
      member: safeUser
    });
  } catch (err) {
    console.error('Error updating member role:', err);
    res.status(500).json({ error: 'Erreur lors de la modification du rôle.' });
  }
});

// PUT /api/members/:id - President can modify any member's file (Nom, email, phone, licence, véhicule, bio, avatar, rôle)
router.put('/:id', requireAuth, (req, res) => {
  try {
    // Only the President can modify all members' files
    if (req.user.role !== ROLES.PRESIDENT) {
      return res.status(403).json({
        error: 'Accès réservé : Seul le Président de la FFCS a l’autorisation de modifier les fiches de l’ensemble des membres.'
      });
    }

    const targetUserId = req.params.id;
    const targetUser = db.getUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Membre introuvable.' });
    }

    const { name, email, phone, vehicle, bio, licenseNumber, role, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (phone !== undefined) updates.phone = phone;
    if (vehicle !== undefined) updates.vehicle = vehicle;
    if (bio !== undefined) updates.bio = bio;
    if (licenseNumber !== undefined) updates.licenseNumber = licenseNumber.trim();
    if (avatar !== undefined) updates.avatar = avatar;

    // If role changed, validate and synchronize
    if (role && role !== targetUser.role) {
      const validRoles = Object.values(ROLES);
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: `Rôle invalide: ${role}` });
      }
      if (targetUser.role === ROLES.PRESIDENT && role !== ROLES.PRESIDENT) {
        const allPresidents = db.getUsers().filter(u => u.role === ROLES.PRESIDENT && u.id !== targetUserId);
        if (allPresidents.length === 0) {
          return res.status(400).json({ error: 'La FFCS doit toujours avoir au moins un Président en exercice.' });
        }
      }
      updates.role = role;
    }

    const updatedUser = db.updateUser(targetUserId, updates);

    // Synchronize board table
    const data = db.read();
    const existingBoardEntryIndex = data.board.findIndex(b => b.userId === targetUserId);
    const effectiveRole = updates.role || targetUser.role;

    if (isBoardRole(effectiveRole)) {
      if (existingBoardEntryIndex >= 0) {
        data.board[existingBoardEntryIndex].roleKey = effectiveRole;
      } else {
        data.board.push({
          id: `bureau_${Date.now()}`,
          userId: targetUserId,
          roleKey: effectiveRole,
          title: effectiveRole === ROLES.PRESIDENT ? 'Président Fédéral' : 'Membre du Bureau',
          department: 'Commission Fédérale',
          term: '2024 - 2028',
          order: data.board.length + 1,
          responsibilities: [
            'Participation aux délibérations du bureau directeur fédéral',
            'Soutien à l’organisation des épreuves et à la sécurité'
          ]
        });
      }
      db.write(data);
    } else {
      if (existingBoardEntryIndex >= 0) {
        data.board.splice(existingBoardEntryIndex, 1);
        db.write(data);
      }
    }

    const { passwordHash, ...safeUser } = updatedUser;
    res.json({
      message: `Fiche de ${updatedUser.name} mise à jour avec succès par la Présidence.`,
      member: safeUser
    });
  } catch (err) {
    console.error('Error updating member file:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la fiche du membre.' });
  }
});

// DELETE /api/members/:id/board - President can remove a member from the board
router.delete('/:id/board', requireAuth, (req, res) => {
  try {
    if (req.user.role !== ROLES.PRESIDENT) {
      return res.status(403).json({
        error: 'Accès réservé : Seul le Président de la FFCS a l’autorisation de retirer un membre du bureau.'
      });
    }

    const targetUserId = req.params.id;
    const targetUser = db.getUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Membre introuvable.' });
    }

    if (targetUser.role === ROLES.PRESIDENT) {
      return res.status(400).json({
        error: 'Action impossible : Le Président ne peut pas être retiré du bureau.'
      });
    }

    db.removeUserFromBoard(targetUserId);

    res.json({
      message: `${targetUser.name} a été retiré(e) du Bureau Fédéral avec succès et redevient Membre Régulier.`
    });
  } catch (err) {
    console.error('Error removing member from board:', err);
    res.status(500).json({ error: err.message || 'Erreur lors du retrait du membre du bureau.' });
  }
});

export default router;
