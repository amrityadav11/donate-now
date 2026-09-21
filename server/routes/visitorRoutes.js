import express from 'express';
import * as visitorController from '../controllers/visitorController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Visitor API is running' });
});

// Get total visitors and statistics
router.get('/stats', visitorController.getVisitorStats);

// Get online visitors count
router.get('/online', visitorController.getOnlineVisitors);

// Get total visitors count (quick endpoint)
router.get('/total', visitorController.getTotalVisitors);

// Record new visitor or update session
router.post('/record', visitorController.recordVisitor);

// Update visitor activity (heartbeat)
router.post('/activity', visitorController.updateVisitorActivity);

export default router;
