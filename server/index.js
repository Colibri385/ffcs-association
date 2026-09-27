import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import boardRoutes from './routes/board.js';
import memberRoutes from './routes/members.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup to allow Vite frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Global auth token parser (attaches req.user if present)
app.use(authenticate);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/members', memberRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    association: 'FFCS - Fédération Française des Conducteurs du Sport',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend production build if dist directory exists
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur FFCS.' });
});

app.listen(PORT, () => {
  console.log(`🏁 Serveur API FFCS en ligne sur http://localhost:${PORT}`);
});
