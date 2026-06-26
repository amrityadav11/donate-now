import { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { categoryService } from '../services/categoryService';
import CampaignCard from '../components/CampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Reset to page 1 when filters change
        setPage(1);
    }, [selectedCategory, sortBy, search]);

    useEffect(() => {
        fetchCampaigns();
    }, [selectedCategory, sortBy, search, page]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories({ isActive: true });
            setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 12 };
            if (selectedCategory) params.category = selectedCategory;
            if (sortBy) params.sort = sortBy;
            if (search) params.search = search;

            const data = await campaignService.getCampaigns(params);
            setCampaigns(data.campaigns);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || data.campaigns.length);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="All Campaigns"
                description="Browse all active donation campaigns and support causes that matter to you"
            />

            <div className="section-container section-padding">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="heading-1 mb-4">All Campaigns</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore all active campaigns and make a difference today
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search */}
                    <div className="relative max-w-xl mx-auto">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>

                    {/* Category and Sort */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                            <FiFilter className="text-gray-600 dark:text-gray-400" />
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedCategory
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategory(category._id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category._id
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field w-full sm:w-auto"
                        >
                            <option value="">Sort By</option>
                            <option value="popular">Most Popular</option>
                            <option value="amount">Highest Raised</option>
                            <option value="ending">Ending Soon</option>
                        </select>
                    </div>
                </div>

                {/* Campaigns Grid */}
                {loading ? (
                    <Loading />
                ) : campaigns.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-500 mb-4">{total} campaigns found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiChevronLeft size={18} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, idx) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page
                                                        ? 'bg-primary-600 text-white'
                                                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No campaigns found. Try adjusting your filters.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CampaignsPage;
