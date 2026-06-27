import { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';
import { categoryService } from '../services/categoryService';
import CampaignCard from '../components/CampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import { FiSearch, FiChevronLeft, FiChevronRight, FiSliders } from 'react-icons/fi';

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

    useEffect(() => { categoryService.getCategories({ isActive: true }).then(d => setCategories(d.categories)).catch(() => { }); }, []);
    useEffect(() => { setPage(1); }, [selectedCategory, sortBy, search]);
    useEffect(() => { fetchCampaigns(); }, [selectedCategory, sortBy, search, page]);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (selectedCategory) params.category = selectedCategory;
            if (sortBy) params.sort = sortBy;
            if (search) params.search = search;
            const data = await campaignService.getCampaigns(params);
            setCampaigns(data.campaigns);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || data.campaigns.length);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    return (
        <>
            <SEO title="All Campaigns" description="Browse all active donation campaigns" />

            {/* Page header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="section-container py-8 sm:py-10">
                    <h1 className="heading-2 mb-1">All Campaigns</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {total > 0 ? `${total} campaigns — support a cause that matters to you` : 'Explore campaigns and make a difference'}
                    </p>
                </div>
            </div>

            <div className="section-container py-6 sm:py-8">

                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    {/* Sort */}
                    <div className="relative">
                        <FiSliders className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="input-field pl-10 pr-8 w-full sm:w-44 appearance-none cursor-pointer"
                        >
                            <option value="">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="amount">Highest Raised</option>
                            <option value="ending">Ending Soon</option>
                        </select>
                    </div>
                </div>

                {/* Category chips */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${!selectedCategory
                                ? 'bg-primary-600 border-primary-600 text-white'
                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 bg-white dark:bg-gray-900'
                            }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat._id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedCategory === cat._id
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 bg-white dark:bg-gray-900'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                <div className="skeleton aspect-[16/9]" />
                                <div className="p-4 space-y-3">
                                    <div className="skeleton h-4 w-3/4" />
                                    <div className="skeleton h-3 w-full" />
                                    <div className="skeleton h-3 w-5/6" />
                                    <div className="skeleton h-1.5 w-full rounded-full" />
                                    <div className="skeleton h-8 w-full rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : campaigns.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {campaigns.map(campaign => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-10">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <FiChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .reduce((acc, p, idx, arr) => {
                                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, idx) => p === '...' ? (
                                        <span key={`e${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                    ) : (
                                        <button key={p} onClick={() => setPage(p)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${p === page
                                                    ? 'bg-primary-600 text-white'
                                                    : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))
                                }
                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <FiChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FiSearch size={24} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">No campaigns found</h3>
                        <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CampaignsPage;
