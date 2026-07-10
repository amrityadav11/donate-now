import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const CATEGORIES = ['Food Kit', 'School Kit', 'Blanket', 'Medical Kit', 'Wheelchair',
    'Books', 'Shoes', 'Sanitary Pads', 'Baby Care Kit', 'Water Filter', 'Clothes', 'Medicines', 'Other'];

const ProductCard = ({ product }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
        <div className="relative h-48">
            <img
                src={product.coverImage?.url || product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
            />
            {product.featured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                    Featured
                </span>
            )}
        </div>
        <div className="p-4">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{product.category}</span>
            <h3 className="font-bold text-lg mt-1 mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
            </div>
            <Link
                to="/item-campaigns"
                className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
            >
                Donate via Campaign →
            </Link>
        </div>
    </motion.div>
);

const ProductCatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [categories] = useState(CATEGORIES);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('name');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const LIMIT = 12;

    useEffect(() => { loadProducts(); }, [page, category, sort]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params = { page, limit: LIMIT, sort };
            if (category) params.category = category;
            if (search.trim()) params.search = search.trim();
            const res = await productService.getProducts(params);
            setProducts(res.products || []);
            setPagination(res.pagination);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); loadProducts(); };

    return (
        <>
            <SEO title="Product Catalog" description="Browse items you can donate to NGO campaigns" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Product Catalog</h1>
                        <p className="text-gray-500">Browse all donation items. Visit <Link to="/item-campaigns" className="text-blue-600 hover:underline">campaigns</Link> to donate specific items.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-8">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="relative md:col-span-2">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search products…" value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                                className="px-3 py-2 border rounded-lg dark:bg-gray-700">
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                className="px-3 py-2 border rounded-lg dark:bg-gray-700">
                                <option value="name">Name A–Z</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </form>
                    </div>

                    {/* Results count */}
                    {pagination && (
                        <p className="text-sm text-gray-500 mb-4">
                            Showing {products.length} of {pagination.total} products
                        </p>
                    )}

                    {loading ? <Loading /> : products.length === 0 ? (
                        <div className="text-center py-16">
                            <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((p, i) => (
                                <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-10">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
                                ← Prev
                            </button>
                            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`px-4 py-2 border rounded-lg ${page === p ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    {p}
                                </button>
                            ))}
                            <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
                                Next →
                            </button>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
                        <h2 className="text-2xl font-bold mb-2">Ready to Make a Difference?</h2>
                        <p className="mb-6 opacity-90">Browse active campaigns and select specific items to donate</p>
                        <Link to="/item-campaigns"
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50">
                            Browse Campaigns <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCatalogPage;
