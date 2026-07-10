import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiCheckCircle, FiCircle, FiPackage, FiTruck, FiMapPin,
    FiClock, FiArrowLeft, FiPhone, FiX
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const STEPS = [
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Your donation order was confirmed', icon: FiCheckCircle },
    { key: 'packing', label: 'Packing', desc: 'Items are being packed for delivery', icon: FiPackage },
    { key: 'shipped', label: 'Shipped', desc: 'Package has been handed to delivery', icon: FiTruck },
    { key: 'in_transit', label: 'In Transit', desc: 'Package is on its way to the NGO', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', desc: 'Items delivered to the NGO successfully', icon: FiMapPin },
];

const ORDER_INDEX = {
    pending: -1, confirmed: 0, packing: 1, shipped: 2, in_transit: 3, delivered: 4,
    cancelled: -2, refunded: -2,
};

const TrackOrderPage = () => {
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
        } catch {
            toast.error('Order not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <FiPackage className="w-16 h-16 text-gray-400" />
            <p className="text-xl font-semibold">Order not found</p>
            <Link to="/my-orders" className="text-blue-600 hover:underline">Back to orders</Link>
        </div>
    );

    const currentStep = ORDER_INDEX[order.status] ?? -1;
    const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

    const getStepTimestamp = (stepKey) => {
        const entry = (order.timeline || []).find(t => t.status === stepKey);
        return entry ? new Date(entry.timestamp).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        }) : null;
    };

    return (
        <>
            <SEO title={`Track Order #${order.orderNumber}`} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Back */}
                    <Link to="/my-orders"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6">
                        <FiArrowLeft /> Back to orders
                    </Link>

                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">Track Order</h1>
                                <p className="text-gray-500 mt-1">#{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-blue-600">₹{order.total}</p>
                                <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cancelled state */}
                    {isCancelled ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-5 text-center">
                            <FiX className="w-10 h-10 mx-auto text-red-500 mb-2" />
                            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-1">
                                Order {order.status === 'refunded' ? 'Refunded' : 'Cancelled'}
                            </h2>
                            {order.cancellation?.reason && (
                                <p className="text-sm text-red-600 dark:text-red-400">Reason: {order.cancellation.reason}</p>
                            )}
                        </div>
                    ) : (
                        /* Timeline */
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-5">
                            <h2 className="font-bold text-lg mb-6">Delivery Progress</h2>
                            <div className="space-y-0">
                                {STEPS.map((step, idx) => {
                                    const isCompleted = idx <= currentStep;
                                    const isCurrent = idx === currentStep;
                                    const timestamp = getStepTimestamp(step.key);
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.key} className="flex gap-4">
                                            {/* Line + circle */}
                                            <div className="flex flex-col items-center">
                                                <motion.div
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: isCurrent ? [1, 1.1, 1] : 1 }}
                                                    transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                                        } ${isCurrent ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </motion.div>
                                                {idx < STEPS.length - 1 && (
                                                    <div className={`w-0.5 h-12 mt-1 ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`pt-2 pb-8 flex-1 ${idx === STEPS.length - 1 ? 'pb-0' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <h3 className={`font-semibold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {step.label}
                                                        {isCurrent && (
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                Current
                                                            </span>
                                                        )}
                                                    </h3>
                                                    {timestamp && (
                                                        <span className="text-xs text-gray-400">{timestamp}</span>
                                                    )}
                                                </div>
                                                <p className={`text-sm mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300 dark:text-gray-600'}`}>
                                                    {step.desc}
                                                </p>
                                                {/* Timeline entry notes */}
                                                {(() => {
                                                    const entry = (order.timeline || []).find(t => t.status === step.key);
                                                    if (entry?.description && entry.description !== step.key) {
                                                        return <p className="text-xs text-blue-600 mt-1">{entry.description}</p>;
                                                    }
                                                    if (entry?.location) {
                                                        return <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><FiMapPin size={11} />{entry.location}</p>;
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Estimated delivery */}
                            {order.tracking?.estimatedDelivery && order.status !== 'delivered' && (
                                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <FiClock className="text-blue-600" />
                                    Estimated delivery: <span className="font-semibold text-gray-900 dark:text-white">
                                        {new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-5">
                        <h2 className="font-bold text-lg mb-4">Items Donated</h2>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex gap-4 items-center border dark:border-gray-700 rounded-lg p-3">
                                    {item.productImage && (
                                        <img src={item.productImage} alt={item.productName}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.productName}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        {item.campaign?.title && (
                                            <p className="text-xs text-blue-600 mt-0.5">Campaign: {item.campaign.title}</p>
                                        )}
                                    </div>
                                    <p className="font-bold text-blue-600">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t dark:border-gray-700 flex justify-between font-bold text-lg">
                            <span>Total Donated</span>
                            <span className="text-blue-600">₹{order.total}</span>
                        </div>
                    </div>

                    {/* Delivery info */}
                    {order.deliveryPartner && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                            <h2 className="font-bold text-lg mb-3">Delivery Partner</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <FiTruck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold">{order.deliveryPartner.name}</p>
                                    {order.deliveryPartner.phone && (
                                        <a href={`tel:${order.deliveryPartner.phone}`}
                                            className="text-sm text-blue-600 flex items-center gap-1 mt-0.5">
                                            <FiPhone size={12} /> {order.deliveryPartner.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrackOrderPage;
