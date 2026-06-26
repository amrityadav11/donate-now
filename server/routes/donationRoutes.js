import express from 'express';
import {
    getAllDonations,
    getCampaignDonations,
    createDonation,
    getDonation,
    getDonationReceipt,
} from '../controllers/donationController.js';
import { protect } from '../middleware/auth.js';
import { donationValidation, validate } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/', donationValidation, validate, createDonation);
router.get('/campaign/:id', getCampaignDonations); // must come before /:id
router.get('/:id', getDonation);
router.get('/:id/receipt', getDonationReceipt);

// Admin routes (protected)
router.get('/', protect, getAllDonations);

export default router;
