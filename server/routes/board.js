import express from 'express';
import { db, ROLES } from '../db.js';
import { requireAuth, requireBoardMember } from '../middleware/auth.js';

const router = express.Router();

// GET /api/board - Official Board composition page data
router.get('/', (req, res) => {
  try {
    const board = db.getBoard();
    const info = db.getAssociationInfo();

    res.json({
      board,
      associationInfo: info
    });
  } catch (err) {
    console.error('Error fetching board:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la composition du bureau.' });
  }
});

// PUT /api/board/:id - Update board member display details (BOARD MEMBERS ONLY)
router.put('/:id', requireBoardMember, (req, res) => {
  try {
    const { title, department, term, responsibilities, order } = req.body;
    const updates = {};

    if (title) updates.title = title.trim();
    if (department) updates.department = department.trim();
    if (term) updates.term = term.trim();
    if (Array.isArray(responsibilities)) updates.responsibilities = responsibilities;
    if (order !== undefined) updates.order = parseInt(order, 10);

    const updated = db.updateBoardMember(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Fiche de membre du bureau introuvable.' });
    }

    res.json({
      message: 'Fiche du bureau fédéral mise à jour avec succès.',
      boardMember: updated
    });
  } catch (err) {
    console.error('Error updating board member:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// DELETE /api/board/:id - Delete a member from the board (PRESIDENT ONLY)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    if (req.user.role !== ROLES.PRESIDENT) {
      return res.status(403).json({
        error: 'Accès réservé : Seul le Président de la FFCS a l’autorisation de supprimer un membre du bureau.'
      });
    }

    const boardId = req.params.id;
    const board = db.read().board;
    const entry = board.find(b => b.id === boardId);
    if (!entry) {
      return res.status(404).json({ error: 'Membre du bureau introuvable.' });
    }

    if (entry.roleKey === ROLES.PRESIDENT) {
      return res.status(400).json({
        error: 'Action impossible : Le Président en exercice ne peut pas être supprimé du bureau.'
      });
    }

    db.removeBoardMember(boardId);

    res.json({
      message: 'Le membre a été retiré du Bureau Fédéral avec succès et redevient Membre Régulier.'
    });
  } catch (err) {
    console.error('Error removing board member:', err);
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression du membre du bureau.' });
  }
});

export default router;
