import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiEye, FiMapPin, FiCalendar, FiUsers, FiPackage, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import itemCampaignService from '../../services/itemCampaignService';
import Loading from '../../components/Loading';

const ReviewModal = ({ campaign, onClose, onDone }) => {
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);

    const handle = async (action) => {
        if (action === 'reject' && !reason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setSaving(true);
        try {
            await itemCampaignService.reviewItemCampaign(campaign._id, { action, rejectionReason: reason });
            toast.success(`Campaign ${action}d!`);
            onDone();
            onClose();
        } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    const daysLeft = campaign.deadline
        ? Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 px-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 p-5 border-b dark:border-gray-700 flex justify-between items-center rounded-t-xl">
                    <h2 className="text-xl font-bold">Review Campaign</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX /></button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Cover */}
                    {(campaign.coverImage?.url || campaign.images?.[0]?.url) && (
                        <img src={campaign.coverImage?.url || campaign.images[0]?.url} alt={campaign.title}
                            className="w-full h-48 object-cover rounded-lg" />
                    )}

                    <h3 className="text-2xl font-bold">{campaign.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{campaign.shortDescription}</p>

                    {/* Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { icon: FiUsers, label: 'Beneficiaries', val: campaign.beneficiaries?.count },
                            { icon: FiPackage, label: 'Items', val: campaign.requiredItems?.length },
                            { icon: FiCalendar, label: 'Days Left', val: daysLeft > 0 ? daysLeft : 'Expired' },
                            { icon: FiMapPin, label: 'Location', val: campaign.deliveryAddress?.city },
                        ].map(m => (
                            <div key={m.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <m.icon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <p className="text-xs text-gray-500">{m.label}</p>
                                <p className="font-semibold text-sm">{m.val || '—'}</p>
                            </div>
                        ))}
                    </div>

                    {/* NGO info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-1">NGO / Organization</h4>
                        <p>{campaign.organization?.name}</p>
                        <p className="text-sm text-gray-500">{campaign.organization?.email} · {campaign.organization?.contact}</p>
                    </div>

                    {/* Required Items */}
                    <div>
                        <h4 className="font-semibold mb-2">Required Items</h4>
                        <div className="space-y-2">
                            {(campaign.requiredItems || []).map((ri, i) => (
                                <div key={i} className="flex justify-between items-center border dark:border-gray-700 rounded-lg p-3 text-sm">
                                    <span className="font-medium">{ri.product?.name || '—'}</span>
                                    <div className="flex gap-4 text-gray-500">
                                        <span>Need: <strong>{ri.quantityNeeded}</strong></span>
                                        <span>Got: <strong className="text-green-600">{ri.quantityDonated}</strong></span>
                                        <span className={`font-semibold capitalize px-2 py-0.5 rounded ${ri.priority === 'urgent' ? 'bg-red-100 text-red-700' : ri.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {ri.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Story */}
                    <div>
                        <h4 className="font-semibold mb-2">Campaign Story</h4>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">{campaign.story}</p>
                    </div>

                    {/* Rejection reason (only needed if rejecting) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Rejection Reason <span className="text-gray-400">(required if rejecting)</span></label>
                        <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                            placeholder="Explain why this campaign is being rejected…"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button disabled={saving} onClick={() => handle('approve')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold">
                            <FiCheck /> {saving ? 'Saving…' : 'Approve Campaign'}
                        </button>
                        <button disabled={saving} onClick={() => handle('reject')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold">
                            <FiX /> Reject Campaign
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const AdminItemCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => { loadCampaigns(); }, [filter, page]);

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const params = { status: filter, page, limit: 10 };
            if (search.trim()) params.search = search.trim();
            const res = await itemCampaignService.getItemCampaigns(params);
            setCampaigns(res.campaigns || []);
            setPagination(res.pagination);
        } catch { toast.error('Failed to load campaigns'); }
        finally { setLoading(false); }
    };

    const STATUS_TABS = ['pending', 'approved', 'active', 'completed', 'rejected'];

    const STATUS_BADGE = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-blue-100 text-blue-800',
        active: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        rejected: 'bg-red-100 text-red-800',
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Item Campaigns</h1>
                <button onClick={loadCampaigns} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    <FiRefreshCw /> Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
                {STATUS_TABS.map(s => (
                    <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                        className={`px-4 py-2 rounded-lg capitalize font-medium whitespace-nowrap transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        {s}
                        {s === 'pending' && pagination?.total > 0 && filter === 'pending' && (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5">{pagination.total}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); loadCampaigns(); }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search campaigns…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
            </form>

            {loading ? <Loading /> : (
                <>
                    <div className="space-y-4">
                        {campaigns.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-400">
                                No {filter} campaigns found
                            </div>
                        ) : campaigns.map(campaign => {
                            const daysLeft = campaign.deadline
                                ? Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000) : 0;
                            return (
                                <motion.div key={campaign._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 flex flex-col sm:flex-row gap-4">
                                    <img
                                        src={campaign.coverImage?.url || campaign.images?.[0]?.url || 'https://via.placeholder.com/128'}
                                        alt={campaign.title}
                                        className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{campaign.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 capitalize ${STATUS_BADGE[campaign.status]}`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{campaign.shortDescription}</p>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><FiMapPin size={13} /> {campaign.deliveryAddress?.city}, {campaign.deliveryAddress?.state}</span>
                                            <span className="flex items-center gap-1"><FiUsers size={13} /> {campaign.beneficiaries?.count} beneficiaries</span>
                                            <span className="flex items-center gap-1"><FiPackage size={13} /> {campaign.requiredItems?.length} items</span>
                                            <span className="flex items-center gap-1"><FiCalendar size={13} /> {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">By: <span className="font-semibold">{campaign.organization?.name}</span></p>
                                    </div>
                                    <div className="flex sm:flex-col gap-2 justify-end">
                                        <button onClick={() => setSelected(campaign)}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                            <FiEye size={14} /> {filter === 'pending' ? 'Review' : 'View'}
                                        </button>
                                        {filter === 'pending' && (
                                            <>
                                                <button onClick={async () => {
                                                    try {
                                                        await itemCampaignService.reviewItemCampaign(campaign._id, { action: 'approve' });
                                                        toast.success('Approved!');
                                                        loadCampaigns();
                                                    } catch { toast.error('Failed'); }
                                                }} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                                                    <FiCheck size={14} /> Approve
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40">Previous</button>
                            <span className="px-4 py-2">Page {page} / {pagination.pages}</span>
                            <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40">Next</button>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selected && <ReviewModal campaign={selected} onClose={() => setSelected(null)} onDone={loadCampaigns} />}
            </AnimatePresence>
        </div>
    );
};

export default AdminItemCampaigns;
