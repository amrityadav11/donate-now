import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { paymentService } from '../services/paymentService';
import { formatCurrency } from '../utils/helpers';
import { FiHeart } from 'react-icons/fi';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const DonatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        amount: '',
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        isAnonymous: false,
        message: '',
    });

    const suggestedAmounts = [500, 1000, 2500, 5000];

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const data = await campaignService.getCampaign(id);
            setCampaign(data.campaign);
        } catch (error) {
            console.error('Failed to fetch campaign:', error);
            toast.error('Campaign not found');
            navigate('/campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAmountSelect = (amount) => {
        setFormData({ ...formData, amount: amount.toString() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.amount || parseFloat(formData.amount) < 1) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!formData.isAnonymous && !formData.donorName) {
            toast.error('Please enter your name or select anonymous donation');
            return;
        }

        try {
            setProcessing(true);

            // Create donation
            const donationData = await donationService.createDonation({
                campaignId: id,
                amount: parseFloat(formData.amount),
                donorName: formData.isAnonymous ? null : formData.donorName,
                donorEmail: formData.isAnonymous ? null : formData.donorEmail,
                donorPhone: formData.isAnonymous ? null : formData.donorPhone,
                isAnonymous: formData.isAnonymous,
                message: formData.message,
            });

            // Process payment — resolves on success, rejects on cancel or failure
            await paymentService.processPayment(donationData.donation.id, {
                donorName: formData.donorName,
                donorEmail: formData.donorEmail,
                donorPhone: formData.donorPhone,
            });

        } catch (error) {
            const msg = error?.message || error?.response?.data?.message || 'Failed to process donation';
            if (msg !== 'Payment cancelled by user') {
                toast.error(msg);
            }
            setProcessing(false);
        }
    };

    if (loading) return <Loading fullScreen />;
    if (!campaign) return null;

    return (
        <>
            <SEO title={`Donate to ${campaign.title}`} />

            <div className="section-container section-padding">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Campaign Info */}
                        <div>
                            <div className="card p-6 sticky top-20">
                                <img
                                    src={campaign.coverImage?.url || campaign.images[0]?.url || '/placeholder.jpg'}
                                    alt={campaign.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {campaign.shortDescription}
                                </p>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Goal:</span>
                                        <span className="font-semibold">{formatCurrency(campaign.goalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Raised:</span>
                                        <span className="font-semibold text-primary-600">
                                            {formatCurrency(campaign.raisedAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Donors:</span>
                                        <span className="font-semibold">{campaign.donationCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donation Form */}
                        <div className="card p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FiHeart className="text-primary-600" />
                                Make Your Donation
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Amount Selection */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select or Enter Amount *
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        {suggestedAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => handleAmountSelect(amount)}
                                                className={`p-3 rounded-lg font-semibold transition-colors ${formData.amount === amount.toString()
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                {formatCurrency(amount)}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Enter custom amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                        className="input-field"
                                    />
                                </div>

                                {/* Anonymous Donation */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isAnonymous"
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isAnonymous" className="text-sm font-medium">
                                        Make this an anonymous donation
                                    </label>
                                </div>

                                {!formData.isAnonymous && (
                                    <>
                                        {/* Donor Name */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="donorName"
                                                placeholder="Enter your name"
                                                value={formData.donorName}
                                                onChange={handleChange}
                                                required={!formData.isAnonymous}
                                                className="input-field"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email Address (optional)
                                            </label>
                                            <input
                                                type="email"
                                                name="donorEmail"
                                                placeholder="your@email.com"
                                                value={formData.donorEmail}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                We'll send your receipt to this email
                                            </p>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Phone Number (optional)
                                            </label>
                                            <input
                                                type="tel"
                                                name="donorPhone"
                                                placeholder="10-digit phone number"
                                                value={formData.donorPhone}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Message (optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        placeholder="Leave a message of support..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="3"
                                        className="input-field resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="spinner w-5 h-5 border-2"></div>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <FiHeart />
                                            Proceed to Payment
                                        </span>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Secure payment powered by Razorpay. Your information is encrypted and safe.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonatePage;
