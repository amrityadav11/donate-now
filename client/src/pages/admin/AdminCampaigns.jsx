import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await campaignService.getAdminCampaigns({ limit: 100 });
            setCampaigns(data.campaigns);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        try {
            await campaignService.deleteCampaign(id);
            toast.success('Campaign deleted successfully');
            fetchCampaigns();
        } catch (error) {
            toast.error('Failed to delete campaign');
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Campaigns</h1>
                <Link to="/admin/campaigns/new" className="btn-primary flex items-center gap-2">
                    <FiPlus />
                    Add Campaign
                </Link>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Goal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Raised</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {campaigns.map((campaign) => (
                                <tr key={campaign._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={campaign.coverImage?.url || campaign.images[0]?.url || '/placeholder.jpg'}
                                                alt={campaign.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium">{campaign.title}</p>
                                                <p className="text-sm text-gray-500">{formatDate(campaign.createdAt)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{campaign.category?.name}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{formatCurrency(campaign.goalAmount)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-primary-600">{formatCurrency(campaign.raisedAmount)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/campaigns/${campaign.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                title="View"
                                            >
                                                <FiEye size={18} />
                                            </Link>
                                            <Link
                                                to={`/admin/campaigns/edit/${campaign._id}`}
                                                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                title="Edit"
                                            >
                                                <FiEdit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(campaign._id)}
                                                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {campaigns.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">No campaigns found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCampaigns;
