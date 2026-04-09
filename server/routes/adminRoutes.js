import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getSystemAnalytics
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);

// System analytics
router.get('/analytics', getSystemAnalytics);

export default router;