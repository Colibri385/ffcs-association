import express from 'express';
import { db } from '../db.js';
import { requireNewsManager } from '../middleware/auth.js';

const router = express.Router();

// GET /api/news - List all news items (Public)
router.get('/', (req, res) => {
  try {
    const news = db.getNews();

    // Sort: high priority first, then date descending
    const sorted = [...news].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    res.json({
      news: sorted,
      totalNews: sorted.length
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des actualités.' });
  }
});

// GET /api/news/:id - Single news item (Public)
router.get('/:id', (req, res) => {
  try {
    const item = db.getNewsById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Actualité introuvable.' });
    }
    res.json({ news: item });
  } catch (err) {
    console.error('Error fetching news item:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’actualité.' });
  }
});

// POST /api/news - Create news item (President, Vice-President, Webmaster ONLY)
router.post('/', requireNewsManager, (req, res) => {
  try {
    const { title, content, category, priority, authorName, linkUrl, linkText } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants : Titre et Contenu de l’actualité.'
      });
    }

    const newNews = {
      id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : 'Information',
      priority: priority === 'high' ? 'high' : 'normal',
      authorName: authorName && authorName.trim() ? authorName.trim() : (req.user?.name || 'Bureau Fédéral'),
      linkUrl: linkUrl ? linkUrl.trim() : '',
      linkText: linkText ? linkText.trim() : '',
      createdBy: req.user.id,
      createdAt: new Date().toISOString()
    };

    db.createNews(newNews);

    res.status(201).json({
      message: 'Actualité publiée avec succès.',
      news: newNews
    });
  } catch (err) {
    console.error('Error creating news:', err);
    res.status(500).json({ error: 'Erreur lors de la publication de l’actualité.' });
  }
});

// PUT /api/news/:id - Update news item (President, Vice-President, Webmaster ONLY)
router.put('/:id', requireNewsManager, (req, res) => {
  try {
    const existing = db.getNewsById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Actualité introuvable.' });
    }

    const { title, content, category, priority, authorName, linkUrl, linkText } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (category !== undefined) updates.category = category.trim();
    if (priority !== undefined) updates.priority = priority === 'high' ? 'high' : 'normal';
    if (authorName !== undefined) updates.authorName = authorName.trim();
    if (linkUrl !== undefined) updates.linkUrl = linkUrl.trim();
    if (linkText !== undefined) updates.linkText = linkText.trim();

    const updated = db.updateNews(req.params.id, updates);

    res.json({
      message: 'Actualité mise à jour avec succès.',
      news: updated
    });
  } catch (err) {
    console.error('Error updating news:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’actualité.' });
  }
});

// DELETE /api/news/:id - Delete news item (President, Vice-President, Webmaster ONLY)
router.delete('/:id', requireNewsManager, (req, res) => {
  try {
    const deleted = db.deleteNews(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Actualité introuvable.' });
    }

    res.json({ message: 'Actualité supprimée avec succès.' });
  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’actualité.' });
  }
});

export default router;
