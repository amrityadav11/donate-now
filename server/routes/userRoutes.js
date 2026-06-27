import express from 'express';
import {
    register, login, getProfile, updateProfile,
    changePassword, toggleSaveCampaign,
} from '../controllers/userController.js';
import { protectUser } from '../middleware/userAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protectUser, getProfile);
router.put('/profile', protectUser, updateProfile);
router.put('/change-password', protectUser, changePassword);
router.put('/save-campaign/:id', protectUser, toggleSaveCampaign);

export default router;
