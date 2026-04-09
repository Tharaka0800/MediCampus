import express from 'express';
import { login, register } from '../middleware/auth.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Registration (admin only for creating users)
router.post('/register', authenticateToken, requireAdmin, register);

export default router;