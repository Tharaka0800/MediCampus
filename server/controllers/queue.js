import Queue from '../models/Queue.js';
import { io } from '../server.js';

export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['waiting', 'active', 'done', 'emergency'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        errors: [`Status must be one of: ${validStatuses.join(', ')}`]
      });
    }

    // Check if queue entry exists
    const queue = await Queue.findById(id);
    if (!queue) {
      return res.status(404).json({
        message: 'Queue entry not found',
        errors: ['No queue entry found with the provided ID']
      });
    }

    // Business logic validations
    if (status === 'active' && queue.status === 'done') {
      return res.status(400).json({
        message: 'Invalid status transition',
        errors: ['Cannot activate a completed queue entry']
      });
    }

    if (status === 'waiting' && queue.status === 'done') {
      return res.status(400).json({
        message: 'Invalid status transition',
        errors: ['Cannot move a completed queue entry back to waiting']
      });
    }

    const updatedQueue = await Queue.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedQueue) {
      return res.status(404).json({
        message: 'Queue entry not found',
        errors: ['Failed to update queue status']
      });
    }

    // Emit real-time update
    io.emit('queueUpdate', { type: 'statusUpdate', queue: updatedQueue });

    res.status(200).json({
      message: 'Queue status updated successfully',
      queue: updatedQueue
    });
  } catch (error) {
    console.error('Error updating queue status:', error);
    res.status(500).json({
      message: 'Internal server error',
      errors: ['An unexpected error occurred while updating queue status']
    });
  }
};

export const getCurrentServing = async (req, res) => {
  try {
    const current = await Queue.findOne({ status: 'active' }).populate('appointmentId');
    if (!current) {
      return res.status(200).json({
        message: 'No patient currently being served',
        current: null
      });
    }

    res.status(200).json({
      message: 'Current serving patient retrieved',
      current
    });
  } catch (error) {
    console.error('Error getting current serving:', error);
    res.status(500).json({
      message: 'Internal server error',
      errors: ['An unexpected error occurred while retrieving current serving patient']
    });
  }
};