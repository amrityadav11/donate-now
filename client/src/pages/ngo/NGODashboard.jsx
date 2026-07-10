import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTrendingUp, FiUsers, FiShoppingBag, FiPlus, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useUser } from '../../hooks/useUser';
import itemCampaignService from '../../services/itemCampaignService';
import orderService from '../../services/orderService';
import Loading from '../../components/Loading';

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className={`inline-flex p-3 rounded-lg mb-3 bg-${color}-100 dark:bg-${color}-900/30`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
);

const NGODashboard = () => {
    const { user } = useUser();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (user) load(); }, [user]);

    const load = async () => {
        try {
            const res = await itemCampaignService.getItemCampaigns({ limit: 100 });
            // Filter to this user's campaigns on the frontend (backend already filters by session)
            setCampaigns(res.campaigns || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const stats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'active').length,
        pending: campaigns.filter(c => c.status === 'pending').length,
        orders: campaigns.reduce((s, c) => s + (c.orderCount || 0), 0),
        beneficiaries: campaigns.reduce((s, c) => s + (c.beneficiaries?.count || 0), 0),
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">NGO Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
                </div>
                <Link to="/ngo/campaigns/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    <FiPlus /> New Campaign
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Campaigns" value={stats.total} icon={FiPackage} color="blue" delay={0} />
                <StatCard label="Active Campaigns" value={stats.active} icon={FiTrendingUp} color="green" delay={0.1} />
                <StatCard label="Total Orders" value={stats.orders} icon={FiShoppingBag} color="purple" delay={0.2} />
                <StatCard label="Beneficiaries Helped" value={stats.beneficiaries} icon={FiUsers} color="orange" delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Campaigns */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg">Recent Campaigns</h2>
                        <Link to="/ngo/campaigns" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                            View all <FiArrowRight size={14} />
                        </Link>
                    </div>
                    {campaigns.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <FiPackage className="w-10 h-10 mx-auto mb-3" />
                            <p>No campaigns yet.</p>
                            <Link to="/ngo/campaigns/new" className="text-blue-600 hover:underline text-sm">Create your first campaign</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {campaigns.slice(0, 5).map(c => (
                                <div key={c._id} className="flex gap-3 items-center border dark:border-gray-700 rounded-lg p-3">
                                    <img src={c.coverImage?.url || c.images?.[0]?.url || 'https://via.placeholder.com/48'}
                                        alt={c.title} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{c.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${c.progressPercentage}%` }} />
                                            </div>
                                            <span className="text-xs text-gray-500 flex-shrink-0">{c.progressPercentage}%</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 capitalize ${c.status === 'active' ? 'bg-green-100 text-green-700' :
                                            c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'}`}>
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                    <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { to: '/ngo/campaigns/new', label: 'Create New Campaign', primary: true },
                            { to: '/ngo/campaigns', label: 'Manage Campaigns' },
                            { to: '/item-campaigns', label: 'Browse All Campaigns' },
                        ].map(({ to, label, primary }) => (
                            <Link key={to} to={to}
                                className={`block px-4 py-3 rounded-lg text-center font-medium transition ${primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {stats.pending > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                                ⏳ {stats.pending} campaign{stats.pending > 1 ? 's' : ''} awaiting admin approval
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGODashboard;
