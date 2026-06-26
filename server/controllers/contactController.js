import Contact from '../models/Contact.js';
import { sendContactEmail } from '../config/email.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
            ipAddress: req.ip,
        });

        // Send email notification to admin
        try {
            await sendContactEmail({
                name,
                email,
                subject,
                message,
            });
        } catch (emailError) {
            console.error('Failed to send contact email:', emailError);
            // Don't fail the contact form submission if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all contacts (admin)
// @route   GET /api/admin/contacts
// @access  Private (Admin)
export const getAllContacts = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Contact.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: contacts.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single contact
// @route   GET /api/admin/contacts/:id
// @access  Private (Admin)
export const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        // Mark as read
        if (contact.status === 'new') {
            contact.status = 'read';
            await contact.save();
        }

        res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id
// @access  Private (Admin)
export const updateContactStatus = async (req, res) => {
    try {
        const { status, replyMessage } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        contact.status = status || contact.status;

        if (replyMessage) {
            contact.reply = {
                message: replyMessage,
                repliedBy: req.admin._id,
                repliedAt: Date.now(),
            };
        }

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete contact
// @route   DELETE /api/admin/contacts/:id
// @access  Private (Admin)
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
