import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    next();
};

export const campaignValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('shortDescription')
        .trim()
        .notEmpty()
        .withMessage('Short description is required')
        .isLength({ max: 300 })
        .withMessage('Short description cannot exceed 300 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    body('story')
        .trim()
        .notEmpty()
        .withMessage('Story is required'),
    body('category')
        .notEmpty()
        .withMessage('Category is required'),
    body('goalAmount')
        .isNumeric()
        .withMessage('Goal amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Goal amount must be at least 1'),
];

export const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Category description is required'),
];

export const donationValidation = [
    body('campaignId')
        .notEmpty()
        .withMessage('Campaign ID is required'),
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 1 })
        .withMessage('Amount must be at least 1'),
    body('donorEmail')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email'),
];

export const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required'),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];
