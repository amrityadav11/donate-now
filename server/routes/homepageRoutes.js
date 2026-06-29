import express from 'express';
import {
    getHomepage,
    updateHero,
    uploadHeroImage,
    updateAbout,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateContact,
    addBannerSlide,
    updateBannerSlide,
    deleteBannerSlide,
    updateAppDownload,
} from '../controllers/homepageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getHomepage);

// Admin routes (protected)
router.put('/hero', protect, updateHero);
router.post('/hero/image', protect, uploadHeroImage);
router.put('/about', protect, updateAbout);
router.post('/testimonials', protect, addTestimonial);
router.put('/testimonials/:id', protect, updateTestimonial);
router.delete('/testimonials/:id', protect, deleteTestimonial);
router.put('/contact', protect, updateContact);
router.post('/banner-slides', protect, addBannerSlide);
router.put('/banner-slides/:id', protect, updateBannerSlide);
router.delete('/banner-slides/:id', protect, deleteBannerSlide);
router.put('/app-download', protect, updateAppDownload);

export default router;
