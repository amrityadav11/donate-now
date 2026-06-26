import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FiHeart, FiUsers, FiTarget, FiDollarSign } from 'react-icons/fi';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await dashboardService.getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    const stats = dashboard?.statistics || {};

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <FiDollarSign className="text-primary-600 text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Amount</h3>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount || 0)}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <FiHeart className="text-green-600 text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Donations</h3>
                    <p className="text-2xl font-bold">{stats.totalDonations || 0}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FiTarget className="text-blue-600 text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Total Campaigns</h3>
                    <p className="text-2xl font-bold">{stats.totalCampaigns || 0}</p>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <FiUsers className="text-purple-600 text-2xl" />
                        </div>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Active Campaigns</h3>
                    <p className="text-2xl font-bold">{stats.activeCampaigns || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Donations */}
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Donations</h2>
                    <div className="space-y-4">
                        {dashboard?.recentDonations?.slice(0, 5).map((donation) => (
                            <div key={donation._id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium">{donation.donorName || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{donation.campaign?.title}</p>
                                    <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary-600">{formatCurrency(donation.amount)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Campaigns */}
                <div className="card p-6">
                    <h2 className="text-xl font-bold mb-4">Top Campaigns</h2>
                    <div className="space-y-4">
                        {dashboard?.topCampaigns?.map((campaign, index) => (
                            <div key={campaign._id} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center font-bold text-primary-600">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{campaign.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.category?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{formatCurrency(campaign.raisedAmount)}</p>
                                    <p className="text-xs text-gray-500">{campaign.donationCount} donors</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
