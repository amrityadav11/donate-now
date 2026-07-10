import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiEye, FiTrash2, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import itemCampaignService from '../../services/itemCampaignService';
import { useUser } from '../../hooks/useUser';
import Loading from '../../components/Loading';

const STATUS_BADGE = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-800',
    paused: 'bg-orange-100 text-orange-800',
};

const NGOCampaigns = () => {
    const { user } = useUser();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { if (user) load(); }, [user]);

    const load = async () => {
        setLoading(true);
        try {
            const params = { limit: 100 };
            if (filter !== 'all') params.status = filter;
            const res = await itemCampaignService.getItemCampaigns(params);
            setCampaigns(res.campaigns || []);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (user) load(); }, [filter]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await itemCampaignService.deleteItemCampaign(id);
            toast.success('Campaign deleted');
            load();
        } catch { toast.error('Cannot delete — orders may exist for this campaign'); }
    };

    const TABS = ['all', 'pending', 'active', 'completed', 'rejected'];

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">My Campaigns</h1>
                <Link to="/ngo/campaigns/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    <FiPlus /> Create Campaign
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {TABS.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`px-4 py-2 rounded-lg capitalize font-medium whitespace-nowrap transition ${filter === t ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {campaigns.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
                    <FiPackage className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No campaigns found.</p>
                    <Link to="/ngo/campaigns/new" className="text-blue-600 hover:underline">Create your first campaign</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {campaigns.map((c, i) => {
                        const daysLeft = c.deadline ? Math.ceil((new Date(c.deadline) - new Date()) / 86400000) : 0;
                        return (
                            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col sm:flex-row gap-4">
                                <img src={c.coverImage?.url || c.images?.[0]?.url || 'https://via.placeholder.com/128'}
                                    alt={c.title} className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-lg leading-tight">{c.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 capitalize ${STATUS_BADGE[c.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {c.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{c.shortDescription}</p>

                                    {/* Progress */}
                                    <div className="mb-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Progress</span>
                                            <span className="font-semibold">{c.progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${c.progressPercentage}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>{c.requiredItems?.length || 0} items</span>
                                        <span>{c.orderCount || 0} orders</span>
                                        <span>{c.views || 0} views</span>
                                        <span className={daysLeft < 7 && daysLeft > 0 ? 'text-red-600 font-semibold' : ''}>
                                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                                        </span>
                                    </div>

                                    {c.status === 'rejected' && c.rejectionReason && (
                                        <p className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded p-2">
                                            ❌ Rejected: {c.rejectionReason}
                                        </p>
                                    )}
                                </div>

                                <div className="flex sm:flex-col gap-2 flex-shrink-0 justify-end">
                                    <Link to={`/item-campaigns/${c.slug}`} target="_blank"
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="View">
                                        <FiEye size={18} />
                                    </Link>
                                    <Link to={`/ngo/campaigns/edit/${c._id}`}
                                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Edit">
                                        <FiEdit size={18} />
                                    </Link>
                                    <button onClick={() => handleDelete(c._id, c.title)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete">
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NGOCampaigns;
