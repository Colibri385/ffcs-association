import express from 'express';
import { db } from '../db.js';
import { requireBoardMember } from '../middleware/auth.js';

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

export default router;
