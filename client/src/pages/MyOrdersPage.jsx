import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiPackage, FiClock, FiTruck, FiCheckCircle, FiX,
    FiEye, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import { useUser } from '../hooks/useUser';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const STATUS_COLOR = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    packing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-violet-100 text-violet-800',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-700',
};

const STATUS_ICON = {
    pending: FiClock,
    confirmed: FiClock,
    packing: FiPackage,
    shipped: FiTruck,
    in_transit: FiTruck,
    delivered: FiCheckCircle,
    cancelled: FiX,
    refunded: FiX,
};

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);
    const Icon = STATUS_ICON[order.status] || FiPackage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow"
        >
            {/* Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-500 mb-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_COLOR[order.status] || ''}`}>
                        <Icon className="w-4 h-4" />
                        {order.status.replace('_', ' ')}
                    </span>
                    <span className="text-xl font-bold text-blue-600">₹{order.total}</span>
                </div>
            </div>

            {/* Items preview */}
            <div className="px-5 pb-3 flex gap-2 overflow-x-auto">
                {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                        {item.productImage && (
                            <img src={item.productImage} alt={item.productName}
                                className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                            <p className="text-xs font-medium leading-tight max-w-[100px] truncate">{item.productName}</p>
                            <p className="text-xs text-gray-500">×{item.quantity}</p>
                        </div>
                    </div>
                ))}
                {order.items.length > 4 && (
                    <div className="flex-shrink-0 flex items-center px-3 text-sm text-gray-500">
                        +{order.items.length - 4} more
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 pb-4 flex flex-wrap gap-2 border-t dark:border-gray-700 pt-3">
                <Link to={`/track-order/${order._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    <FiTruck size={14} /> Track Order
                </Link>
                <Link to={`/order-confirmation/${order._id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
                    <FiEye size={14} /> View Details
                </Link>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 text-sm ml-auto"
                >
                    {expanded ? <><FiChevronUp size={14} /> Less</> : <><FiChevronDown size={14} /> More</>}
                </button>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 border-t dark:border-gray-700 pt-4 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Payment</p>
                                    <p className="font-semibold capitalize">{order.payment?.method || '—'}</p>
                                    <p className="text-xs text-gray-500 capitalize">{order.payment?.status || '—'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Donor</p>
                                    <p className="font-semibold">{order.isAnonymous ? 'Anonymous' : order.donorInfo?.name}</p>
                                    {!order.isAnonymous && <p className="text-xs text-gray-500">{order.donorInfo?.email}</p>}
                                </div>
                            </div>
                            {order.giftDonation?.isGift && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-sm">
                                    <p className="font-semibold">🎁 Gift to: {order.giftDonation.recipientName}</p>
                                    {order.giftDonation.message && <p className="text-gray-600 mt-1">"{order.giftDonation.message}"</p>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const MyOrdersPage = () => {
    const { user, isLoggedIn } = useUser();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }
        loadOrders();
    }, [isLoggedIn]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getUserOrders(user._id);
            setOrders(response.orders || []);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const FILTERS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    if (loading) return <Loading />;

    return (
        <>
            <SEO title="My Orders" description="View and track your donation orders" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">My Orders</h1>
                        <p className="text-gray-500 mt-1">{orders.length} total donation{orders.length !== 1 ? 's' : ''}</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg capitalize text-sm font-medium whitespace-nowrap transition ${filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}>
                                {f}
                                {f !== 'all' && orders.filter(o => o.status === f).length > 0 && (
                                    <span className="ml-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded-full px-1.5">
                                        {orders.filter(o => o.status === f).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Orders */}
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
                            <FiPackage className="w-14 h-14 mx-auto text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
                            </p>
                            <Link to="/item-campaigns"
                                className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                Start Donating
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyOrdersPage;
