import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import itemCampaignService from '../services/itemCampaignService';
import { categoryService } from '../services/categoryService';
import ItemCampaignCard from '../components/ItemCampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const ItemCampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        status: 'all',
        sort: 'latest',
        featured: false,
        urgent: false,
        page: 1,
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadCampaigns();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getCategories();
            setCategories(response.categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const params = {
                status: filters.status,
                page: filters.page,
                limit: 12,
            };

            if (filters.category) params.category = filters.category;
            if (filters.featured) params.featured = 'true';
            if (filters.urgent) params.urgent = 'true';
            if (filters.sort === 'ending_soon') params.sort = 'ending_soon';
            else if (filters.sort === 'popular') params.sort = 'popular';

            const response = await itemCampaignService.getItemCampaigns(params);
            setCampaigns(response.campaigns || []);
            setPagination(response.pagination);
        } catch (error) {
            toast.error('Failed to load campaigns');
            console.error('Error loading campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page on filter change
        }));
    };

    return (
        <>
            <SEO
                title="Item-Based Campaigns"
                description="Browse campaigns requesting specific items and make a direct impact"
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Item-Based Campaigns
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Help by donating specific items that NGOs need
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Category */}
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.icon} {category.name}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="latest">Latest</option>
                                <option value="ending_soon">Ending Soon</option>
                                <option value="popular">Most Popular</option>
                            </select>

                            {/* Quick Filters */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFilterChange('featured', !filters.featured)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${filters.featured
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Featured
                                </button>
                                <button
                                    onClick={() => handleFilterChange('urgent', !filters.urgent)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${filters.urgent
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Urgent
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Campaign Grid */}
                    {loading ? (
                        <Loading />
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-16">
                            <FiFilter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                No campaigns found
                            </p>
                            <p className="text-gray-500 dark:text-gray-500">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {campaigns.map((campaign) => (
                                    <ItemCampaignCard key={campaign._id} campaign={campaign} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                        disabled={filters.page === 1}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2">
                                        Page {filters.page} of {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                        disabled={filters.page === pagination.pages}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ItemCampaignsPage;
