import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEye, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import Loading from '../../components/Loading';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-violet-100 text-violet-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const NGOOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            // Get all orders via admin endpoint (NGO uses same admin token flow)
            const res = await orderService.getAllOrders({ limit: 100 });
            setOrders(res.orders || []);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

    if (loading) return <Loading />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Campaign Orders</h1>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {['all', 'confirmed', 'packing', 'shipped', 'delivered'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap text-sm font-medium ${statusFilter === s ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
                    <FiShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['Order #', 'Date', 'Donor', 'Items', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order, i) => (
                                <motion.tr key={order._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                    <td className="px-4 py-3 font-mono text-sm font-semibold">{order.orderNumber}</td>
                                    <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-sm">{order.isAnonymous ? 'Anonymous' : order.donorInfo?.name}</td>
                                    <td className="px-4 py-3 text-sm">{order.items.length}</td>
                                    <td className="px-4 py-3 font-semibold text-green-600">₹{order.total}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || ''}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link to={`/track-order/${order._id}`}
                                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm">
                                            <FiEye size={14} /> View
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NGOOrders;
