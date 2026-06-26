import express from 'express';
import {
    getCampaigns,
    getCampaign,
    getCampaignBySlug,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    uploadCampaignImages,
    addCampaignUpdate,
    submitCampaignRequest,
    getCampaignRequests,
    approveCampaign,
    rejectCampaign,
    getAdminCampaigns,
} from '../controllers/campaignController.js';
import { protect } from '../middleware/auth.js';
import { campaignValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getCampaigns);
router.get('/slug/:slug', getCampaignBySlug);   // must come before /:id
router.get('/:id', getCampaign);

// Public campaign request submission
router.post('/request', submitCampaignRequest);

// ── Admin routes (protected) ──────────────────────────────────────────────────
router.get('/admin/all', protect, getAdminCampaigns);
router.get('/admin/requests', protect, getCampaignRequests);
router.put('/:id/approve', protect, approveCampaign);
router.put('/:id/reject', protect, rejectCampaign);

router.post('/', protect, campaignValidation, validate, createCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);
router.post('/:id/images', protect, uploadCampaignImages);
router.post('/:id/updates', protect, addCampaignUpdate);

export default router;
