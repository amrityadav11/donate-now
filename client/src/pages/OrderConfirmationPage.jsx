import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiMapPin, FiPackage, FiShare2, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const response = await orderService.getOrderById(orderId);
            setOrder(response.order);
        } catch (error) {
            toast.error('Failed to load order');
            console.error('Error loading order:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Donation',
                text: `I just donated ₹${order.total} to help those in need!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const downloadReceipt = () => {
        toast.success('Receipt download will be available soon!');
    };

    if (loading) return <Loading />;
    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Order not found</h2>
                <Link to="/item-campaigns" className="text-blue-600 hover:underline">
                    Browse campaigns
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <SEO title="Order Confirmation" description="Thank you for your donation!" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                            <FiCheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Thank You for Your Donation!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your generosity will make a real difference
                        </p>
                    </motion.div>

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Order Details</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Order #{order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={downloadReceipt}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <FiDownload /> Receipt
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    <FiShare2 /> Share
                                </button>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t dark:border-gray-700 pt-4 mb-4">
                            <h3 className="font-semibold mb-3">Items Donated</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{item.productName}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-blue-600">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t dark:border-gray-700 pt-4">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{order.discount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                                    <span>Total Amount</span>
                                    <span className="text-blue-600">₹{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* What's Next */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
                    >
                        <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Order Processing</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Your order is being prepared for delivery to the NGO
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Delivery</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Items will be delivered to the NGO within 5-7 business days
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Impact Report</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        You'll receive an impact report showing how your donation helped
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to={`/track-order/${order._id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            <FiMapPin /> Track Order
                        </Link>
                        <Link
                            to="/item-campaigns"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
                        >
                            <FiPackage /> Browse More Campaigns
                        </Link>
                    </div>

                    {/* Tax Receipt Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
                    >
                        <p>A tax receipt will be emailed to you within 24 hours</p>
                        <p className="mt-1">Order ID: {order.orderNumber}</p>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default OrderConfirmationPage;
