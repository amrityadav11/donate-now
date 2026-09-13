import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMail, FiPhone, FiGift, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';
import orderService from '../services/orderService';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [donorInfo, setDonorInfo] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [isAnonymous, setIsAnonymous] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errors, setErrors] = useState({});

    const [giftDonation, setGiftDonation] = useState({
        isGift: false,
        recipientName: '',
        recipientEmail: '',
        message: '',
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        setLoading(true);
        try {
            const sessionId = localStorage.getItem('cartSessionId');
            if (!sessionId) {
                toast.error('Cart is empty');
                navigate('/item-campaigns');
                return;
            }

            const response = await cartService.getCart(sessionId);
            if (!response.cart || response.cart.items.length === 0) {
                toast.error('Cart is empty');
                navigate('/item-campaigns');
                return;
            }

            setCart(response.cart);
        } catch (error) {
            toast.error('Failed to load cart');
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isAnonymous) {
            if (!donorInfo.name.trim()) {
                newErrors.name = 'Name is required';
            }
            if (!donorInfo.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(donorInfo.email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!donorInfo.phone.trim()) {
                newErrors.phone = 'Phone is required';
            } else if (!/^\d{10}$/.test(donorInfo.phone.replace(/\D/g, ''))) {
                newErrors.phone = 'Phone must be 10 digits';
            }
        }

        if (giftDonation.isGift) {
            if (!giftDonation.recipientName.trim()) {
                newErrors.recipientName = 'Recipient name is required';
            }
            if (!giftDonation.recipientEmail.trim()) {
                newErrors.recipientEmail = 'Recipient email is required';
            }
        }

        if (!agreeTerms) {
            newErrors.terms = 'You must agree to terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        setProcessing(true);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway');
                setProcessing(false);
                return;
            }

            // Create order
            const sessionId = localStorage.getItem('cartSessionId');
            const orderResponse = await orderService.createOrder({
                sessionId,
                donorInfo: isAnonymous ? null : donorInfo,
                isAnonymous,
                giftDonation: giftDonation.isGift ? giftDonation : null,
            });

            const { order, razorpayOrderId, razorpayKeyId } = orderResponse;

            // Configure Razorpay options
            const options = {
                key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.total * 100,
                currency: 'INR',
                name: 'DaanSathi',
                description: 'Item Donation',
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResponse = await orderService.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: order._id,
                            sessionId,
                        });

                        toast.success('Payment successful!');
                        navigate(`/order-confirmation/${order._id}`);
                    } catch (error) {
                        toast.error('Payment verification failed');
                        console.error('Verification error:', error);
                    }
                },
                prefill: {
                    name: donorInfo.name,
                    email: donorInfo.email,
                    contact: donorInfo.phone,
                },
                theme: {
                    color: '#2563eb',
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                        toast.error('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create order');
            console.error('Payment error:', error);
            setProcessing(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <SEO title="Checkout" description="Complete your donation" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Checkout
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Complete your donation to help those in need
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Donor Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                            >
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiUser /> Donor Information
                                </h2>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => setIsAnonymous(e.target.checked)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            Donate anonymously
                                        </span>
                                    </label>
                                </div>

                                {!isAnonymous && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={donorInfo.name}
                                                onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={donorInfo.email}
                                                onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={donorInfo.phone}
                                                onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="9876543210"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Gift Donation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                            >
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiGift /> Gift Donation
                                </h2>

                                <div className="mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={giftDonation.isGift}
                                            onChange={(e) => setGiftDonation({ ...giftDonation, isGift: e.target.checked })}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            This is a gift donation
                                        </span>
                                    </label>
                                </div>

                                {giftDonation.isGift && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Recipient Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={giftDonation.recipientName}
                                                onChange={(e) => setGiftDonation({ ...giftDonation, recipientName: e.target.value })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${errors.recipientName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="Recipient's name"
                                            />
                                            {errors.recipientName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Recipient Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={giftDonation.recipientEmail}
                                                onChange={(e) => setGiftDonation({ ...giftDonation, recipientEmail: e.target.value })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${errors.recipientEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                                placeholder="recipient@example.com"
                                            />
                                            {errors.recipientEmail && (
                                                <p className="text-red-500 text-sm mt-1">{errors.recipientEmail}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Personal Message (Optional)
                                            </label>
                                            <textarea
                                                value={giftDonation.message}
                                                onChange={(e) => setGiftDonation({ ...giftDonation, message: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                                rows="3"
                                                placeholder="Write a message to the recipient..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Terms & Conditions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                            >
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 mt-1"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        I agree to the{' '}
                                        <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                                            Terms & Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                                {errors.terms && (
                                    <p className="text-red-500 text-sm mt-2">{errors.terms}</p>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4"
                            >
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FiShoppingBag /> Order Summary
                                </h2>

                                <div className="space-y-3 mb-4">
                                    {cart.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 pb-3 border-b dark:border-gray-700">
                                            <img
                                                src={item.product.coverImage?.url || item.product.images[0]?.url}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-sm">{item.product.name}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-blue-600">
                                                    ₹{item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 mb-4 pb-4 border-b dark:border-gray-700">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cart.subtotal}</span>
                                    </div>
                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{cart.discount}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-lg font-bold mb-6">
                                    <span>Total</span>
                                    <span>₹{cart.total}</span>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiLock /> Proceed to Payment
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    <FiLock className="inline mr-1" />
                                    Secure payment powered by Razorpay
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
