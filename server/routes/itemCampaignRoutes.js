import express from 'express';
import {
    getItemCampaigns,
    getItemCampaignBySlug,
    getItemCampaignById,
    createItemCampaign,
    updateItemCampaign,
    reviewItemCampaign,
    deleteItemCampaign,
} from '../controllers/itemCampaignController.js';
import { protect } from '../middleware/auth.js';
import { protectUser } from '../middleware/userAuth.js';

const router = express.Router();

// Static & collection routes FIRST
router.get('/', getItemCampaigns);
router.post('/', protectUser, createItemCampaign);
router.get('/id/:id', getItemCampaignById);           // edit lookup by MongoDB ID

// ID-based mutations
router.put('/:id/review', protect, reviewItemCampaign);
router.put('/:id', protectUser, updateItemCampaign);
router.delete('/:id', protectUser, deleteItemCampaign);

// Slug-based public detail page — MUST be last
router.get('/:slug', getItemCampaignBySlug);

export default router;
