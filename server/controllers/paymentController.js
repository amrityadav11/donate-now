import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import Donation from '../models/Donation.js';
import Payment from '../models/Payment.js';
import Campaign from '../models/Campaign.js';
import { sendDonationReceipt } from '../config/email.js';

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res) => {
    try {
        const { donationId } = req.body;

        // Get donation details
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found',
            });
        }

        // Create Razorpay order
        const options = {
            amount: donation.amount * 100, // Amount in paise
            currency: 'INR',
            receipt: donation.orderId,
            notes: {
                donationId: donation._id.toString(),
                campaignId: donation.campaign.toString(),
            },
        };

        const order = await razorpay.orders.create(options);

        // Create payment record
        await Payment.create({
            orderId: donation.orderId,
            razorpayOrderId: order.id,
            amount: donation.amount,
            currency: 'INR',
            status: 'created',
            donation: donation._id,
            campaign: donation.campaign,
            notes: options.notes,
        });

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message,
        });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            donationId,
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            // Update donation status to failed
            await Donation.findByIdAndUpdate(donationId, {
                status: 'failed',
            });

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Get payment details from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        // Update donation
        const donation = await Donation.findByIdAndUpdate(
            donationId,
            {
                status: 'success',
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                paymentMethod: payment.method,
            },
            { new: true }
        ).populate('campaign');

        // Update payment record
        await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: 'captured',
                method: payment.method,
            }
        );

        // Update campaign raised amount
        const campaign = await Campaign.findById(donation.campaign._id);
        campaign.raisedAmount += donation.amount;
        campaign.donationCount += 1;
        await campaign.save();

        // Send receipt email if email provided
        if (donation.donorEmail && !donation.isAnonymous) {
            try {
                await sendDonationReceipt({
                    donorEmail: donation.donorEmail,
                    donorName: donation.donorName || 'Generous Donor',
                    amount: donation.amount,
                    campaignTitle: donation.campaign.title,
                    transactionId: razorpay_payment_id,
                    date: donation.createdAt,
                });

                donation.receiptSent = true;
                await donation.save();
            } catch (emailError) {
                console.error('Failed to send receipt email:', emailError);
                // Don't fail the payment if email fails
            }
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            donation: {
                id: donation._id,
                amount: donation.amount,
                status: donation.status,
                paymentId: razorpay_payment_id,
                campaign: donation.campaign.title,
            },
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message,
        });
    }
};

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (Razorpay)
export const paymentWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature',
            });
        }

        const event = req.body.event;
        const paymentEntity = req.body.payload.payment.entity;

        // Handle different events
        switch (event) {
            case 'payment.captured':
                console.log('✅ Payment captured:', paymentEntity.id);
                break;
            case 'payment.failed':
                console.log('❌ Payment failed:', paymentEntity.id);
                await Payment.findOneAndUpdate(
                    { paymentId: paymentEntity.id },
                    {
                        status: 'failed',
                        errorCode: paymentEntity.error_code,
                        errorDescription: paymentEntity.error_description,
                    }
                );
                break;
            default:
                console.log('Unhandled event:', event);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed',
        });
    }
};
