import express from 'express';
import { db, isBoardRole } from '../db.js';
import { requireAuth, requireBoardMember } from '../middleware/auth.js';

const router = express.Router();

const formatEvent = (event, currentUserId = null) => {
  const isInformational = event.hasRegistration === false;
  const registeredCount = (event.registeredUserIds || []).length;
  const remainingSpots = isInformational ? null : Math.max(0, (event.totalSpots || 0) - registeredCount);
  const isRegistered = currentUserId ? (event.registeredUserIds || []).includes(currentUserId) : false;
  const isFull = isInformational ? false : remainingSpots <= 0;

  return {
    ...event,
    hasRegistration: !isInformational,
    isInformational,
    registeredCount,
    remainingSpots,
    isRegistered,
    isFull
  };
};

// GET /api/events - List all events
router.get('/', (req, res) => {
  try {
    const currentUserId = req.user?.id || null;
    const events = db.getEvents().map(e => formatEvent(e, currentUserId));
    
    // Sort by date ascending
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des événements.' });
  }
});

// GET /api/events/:id - Single event details
router.get('/:id', (req, res) => {
  try {
    const event = db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement sportif introuvable.' });
    }

    const currentUserId = req.user?.id || null;
    const isUserBoard = req.user ? isBoardRole(req.user.role) : false;

    // Fetch participant previews
    const allUsers = db.getUsers();
    const participants = (event.registeredUserIds || []).map(id => {
      const u = allUsers.find(user => user.id === id);
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        vehicle: u.vehicle,
        licenseNumber: u.licenseNumber,
        // Board members get to see contact info for race coordination
        ...(isUserBoard ? { email: u.email, phone: u.phone } : {})
      };
    }).filter(Boolean);

    res.json({
      event: formatEvent(event, currentUserId),
      participants
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’événement.' });
  }
});

// POST /api/events/:id/register - Member signs up to participate (Spots check)
router.post('/:id/register', requireAuth, (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = db.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Événement introuvable.' });
    }

    if (event.hasRegistration === false) {
      return res.status(400).json({
        error: 'Cet événement est à titre informatif uniquement et ne nécessite pas d’inscription.'
      });
    }

    const result = db.registerUserForEvent(eventId, userId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      message: 'Inscription confirmée ! Vous êtes officiellement engagé pour cet événement sportif.',
      event: formatEvent(result.event, userId),
      remainingSpots: result.remainingSpots
    });
  } catch (err) {
    console.error('Error registering for event:', err);
    res.status(500).json({ error: 'Erreur lors de l’inscription à l’événement.' });
  }
});

// POST /api/events/:id/unregister - Member cancels their participation
router.post('/:id/unregister', requireAuth, (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const result = db.unregisterUserFromEvent(eventId, userId);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      message: 'Votre désistement a été pris en compte. Une place a été libérée pour les autres pilotes.',
      event: formatEvent(result.event, userId),
      remainingSpots: result.remainingSpots
    });
  } catch (err) {
    console.error('Error unregistering from event:', err);
    res.status(500).json({ error: 'Erreur lors de l’annulation de l’inscription.' });
  }
});

// POST /api/events - Create new event (BOARD MEMBERS ONLY)
router.post('/', requireBoardMember, (req, res) => {
  try {
    const {
      title,
      category,
      date,
      time,
      location,
      trackLength,
      description,
      totalSpots,
      requirements,
      imageUrl,
      hasRegistration
    } = req.body;

    const registrationRequired = hasRegistration !== false && hasRegistration !== 'false';

    if (!title || !category || !date || !location) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants : Titre, Catégorie, Date et Lieu.'
      });
    }

    let parsedSpots = 0;
    if (registrationRequired) {
      if (totalSpots === undefined || totalSpots === null || totalSpots === '') {
        return res.status(400).json({
          error: 'Le nombre total de places est obligatoire pour un événement avec inscription.'
        });
      }
      parsedSpots = parseInt(totalSpots, 10);
      if (isNaN(parsedSpots) || parsedSpots < 1) {
        return res.status(400).json({ error: 'Le nombre total de places doit être un entier supérieur à 0.' });
      }
    }

    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category: category.trim(),
      hasRegistration: registrationRequired,
      date,
      time: time || '09:00 - 18:00',
      location: location.trim(),
      trackLength: trackLength || 'Circuit homologué FFCS',
      description: description || 'Épreuve officielle organisée sous l’égide de la FFCS.',
      totalSpots: parsedSpots,
      requirements: requirements || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&fit=crop&q=80',
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      registeredUserIds: []
    };

    db.createEvent(newEvent);

    res.status(201).json({
      message: registrationRequired
        ? 'Nouvel événement sportif avec inscriptions créé avec succès.'
        : 'Nouvel événement informatif créé avec succès.',
      event: formatEvent(newEvent, req.user.id)
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Erreur lors de la création de l’événement.' });
  }
});

// PUT /api/events/:id - Update event (BOARD MEMBERS ONLY)
router.put('/:id', requireBoardMember, (req, res) => {
  try {
    const event = db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement introuvable.' });
    }

    const {
      title,
      category,
      date,
      time,
      location,
      trackLength,
      description,
      totalSpots,
      requirements,
      imageUrl,
      hasRegistration
    } = req.body;

    const updates = {};
    if (title) updates.title = title.trim();
    if (category) updates.category = category.trim();
    if (date) updates.date = date;
    if (time) updates.time = time;
    if (location) updates.location = location.trim();
    if (trackLength !== undefined) updates.trackLength = trackLength;
    if (description !== undefined) updates.description = description;
    if (requirements !== undefined) updates.requirements = requirements;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    if (hasRegistration !== undefined) {
      const regReq = hasRegistration !== false && hasRegistration !== 'false';
      updates.hasRegistration = regReq;
      if (!regReq) {
        updates.totalSpots = 0;
      }
    }

    const isRegRequired = updates.hasRegistration !== undefined
      ? updates.hasRegistration
      : event.hasRegistration !== false;

    if (isRegRequired && totalSpots !== undefined) {
      const parsedSpots = parseInt(totalSpots, 10);
      if (isNaN(parsedSpots) || parsedSpots < 1) {
        return res.status(400).json({ error: 'Le nombre total de places doit être supérieur à 0.' });
      }
      const currentRegistered = (event.registeredUserIds || []).length;
      if (parsedSpots < currentRegistered) {
        return res.status(400).json({
          error: `Impossible de réduire les places en-dessous du nombre actuel d’inscrits (${currentRegistered} inscrits).`
        });
      }
      updates.totalSpots = parsedSpots;
    }

    const updated = db.updateEvent(req.params.id, updates);

    res.json({
      message: 'Événement mis à jour avec succès.',
      event: formatEvent(updated, req.user.id)
    });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l’événement.' });
  }
});


// DELETE /api/events/:id - Delete event (BOARD MEMBERS ONLY)
router.delete('/:id', requireBoardMember, (req, res) => {
  try {
    const deleted = db.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Événement introuvable.' });
    }

    res.json({ message: 'Événement supprimé avec succès.' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’événement.' });
  }
});

export default router;
