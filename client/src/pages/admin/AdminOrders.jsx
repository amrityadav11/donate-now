import { useState, useEffect } from 'react';
import { FiEye, FiX, FiSearch, FiTruck, FiPackage, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import Loading from '../../components/Loading';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    packing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-violet-100 text-violet-800',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    refunded: 'bg-gray-100 text-gray-800',
};

const VALID_TRANSITIONS = {
    confirmed: ['packing', 'cancelled'],
    packing: ['shipped'],
    shipped: ['in_transit'],
    in_transit: ['delivered'],
    delivered: [],
    cancelled: [],
    refunded: [],
    pending: ['confirmed', 'cancelled'],
};

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const handleUpdate = async () => {
        if (!newStatus) return;
        setSaving(true);
        try {
            await orderService.updateOrderStatus(order._id, { status: newStatus, description: note || `Status changed to ${newStatus}` });
            toast.success('Status updated');
            onStatusChange();
            onClose();
        } catch { toast.error('Failed to update'); }
        finally { setSaving(false); }
    };

    const transitions = VALID_TRANSITIONS[order.status] || [];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 p-6"
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX /></button>
                </div>

                {/* Donor */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2">Donor Information</h3>
                    <p><span className="text-gray-500">Name:</span> {order.isAnonymous ? 'Anonymous' : order.donorInfo?.name}</p>
                    {!order.isAnonymous && <>
                        <p><span className="text-gray-500">Email:</span> {order.donorInfo?.email}</p>
                        <p><span className="text-gray-500">Phone:</span> {order.donorInfo?.phone}</p>
                    </>}
                </div>

                {/* Items */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-3">Items ({order.items.length})</h3>
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center border dark:border-gray-700 rounded-lg p-3">
                                {item.productImage && <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded object-cover" />}
                                <div className="flex-1">
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Campaign: {item.campaign?.title || '—'}</p>
                                    <p className="text-sm">Qty: {item.quantity} × ₹{item.price} = <span className="font-semibold">₹{item.quantity * item.price}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-sm text-green-600 mb-1"><span>Discount</span><span>-₹{order.discount}</span></div>}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-600"><span>Total</span><span>₹{order.total}</span></div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2">
                        {(order.timeline || []).map((t, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <span className="text-gray-400 w-36 flex-shrink-0">{new Date(t.timestamp).toLocaleString()}</span>
                                <span className="capitalize font-medium">{t.status.replace('_', ' ')}</span>
                                {t.description && <span className="text-gray-500">— {t.description}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status update */}
                {transitions.length > 0 && (
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Update Status</h3>
                        <div className="flex gap-3 mb-3">
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700">
                                <option value="">Select new status</option>
                                {transitions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <input type="text" placeholder="Note (optional)" value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 mb-3" />
                        <button onClick={handleUpdate} disabled={!newStatus || saving}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">
                            {saving ? 'Updating…' : 'Update Status'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => { loadOrders(); }, [statusFilter, page]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15, status: statusFilter };
            if (search.trim()) params.search = search.trim();
            const res = await orderService.getAllOrders(params);
            setOrders(res.orders || []);
            setPagination(res.pagination);
        } catch { toast.error('Failed to load orders'); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        loadOrders();
    };

    const statuses = ['all', 'pending', 'confirmed', 'packing', 'shipped', 'in_transit', 'delivered', 'cancelled'];

    const stats = {
        total: pagination?.total || 0,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <button onClick={loadOrders} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    <FiRefreshCw /> Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Orders', value: stats.total, icon: FiPackage, color: 'blue' },
                    { label: 'Pending', value: stats.pending, icon: FiClock, color: 'yellow' },
                    { label: 'Delivered', value: stats.delivered, icon: FiCheckCircle, color: 'green' },
                    { label: 'Cancelled', value: stats.cancelled, icon: FiX, color: 'red' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search order # or donor…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
                </form>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700">
                    {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
                </select>
            </div>

            {loading ? <Loading /> : (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-sm">
                                <tr>
                                    {['Order #', 'Date', 'Customer', 'Items', 'Amount', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No orders found</td></tr>
                                ) : orders.map(order => (
                                    <tr key={order._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="px-4 py-3 font-mono text-sm font-semibold">{order.orderNumber}</td>
                                        <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-sm">{order.isAnonymous ? <span className="italic text-gray-400">Anonymous</span> : order.donorInfo?.name}</td>
                                        <td className="px-4 py-3 text-sm">{order.items.length}</td>
                                        <td className="px-4 py-3 font-semibold text-blue-600">₹{order.total}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || ''}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setSelected(order)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                                                <FiEye /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40">Previous</button>
                            <span className="px-4 py-2">Page {page} of {pagination.pages}</span>
                            <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40">Next</button>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} onStatusChange={loadOrders} />}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
