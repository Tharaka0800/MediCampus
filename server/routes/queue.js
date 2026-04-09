import express from 'express';
import { updateQueueStatus, getCurrentServing } from '../controllers/queue.js';
import { validateQueueStatusUpdate } from '../middleware/validation.js';

const router = express.Router();

router.put('/queue/:id', validateQueueStatusUpdate, updateQueueStatus);
router.get('/queue/current', getCurrentServing);

export default router;