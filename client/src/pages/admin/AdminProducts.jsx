import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import Loading from '../../components/Loading';

const CATEGORIES = ['All', 'Food Kit', 'School Kit', 'Blanket', 'Medical Kit', 'Wheelchair',
    'Books', 'Shoes', 'Sanitary Pads', 'Baby Care Kit', 'Water Filter', 'Clothes', 'Medicines', 'Other'];

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => { loadProducts(); }, [page, category]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (category) params.category = category;
            if (search.trim()) params.search = search.trim();
            const res = await productService.getProducts(params);
            setProducts(res.products || []);
            setPagination(res.pagination);
        } catch { toast.error('Failed to load products'); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); loadProducts(); };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await productService.deleteProduct(id);
            toast.success('Product deleted');
            loadProducts();
        } catch { toast.error('Failed to delete'); }
    };

    const handleToggleActive = async (product) => {
        try {
            await productService.updateProduct(product._id, { isActive: !product.isActive });
            toast.success(product.isActive ? 'Product hidden' : 'Product visible');
            loadProducts();
        } catch { toast.error('Update failed'); }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link to="/admin/products/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    <FiPlus /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg dark:bg-gray-700" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Search</button>
                </form>
                <select value={category} onChange={e => { setCategory(e.target.value === 'All' ? '' : e.target.value); setPage(1); }}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700">
                    {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                </select>
            </div>

            {loading ? <Loading /> : (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-sm">
                                <tr>
                                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'SKU', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No products found. <Link to="/admin/products/new" className="text-blue-600 hover:underline">Add one</Link></td></tr>
                                ) : products.map((product, i) => (
                                    <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                                        <td className="px-4 py-3">
                                            <img src={product.coverImage?.url || product.images?.[0]?.url || 'https://via.placeholder.com/48'}
                                                alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{product.name}</td>
                                        <td className="px-4 py-3 text-sm">{product.category}</td>
                                        <td className="px-4 py-3 font-semibold text-blue-600">₹{product.price}</td>
                                        <td className="px-4 py-3">
                                            <span className={product.stock > 10 ? 'text-green-600 font-semibold' : product.stock > 0 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold'}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono text-gray-500">{product.sku}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggleActive(product)}
                                                className={`flex items-center gap-1 text-sm ${product.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                                {product.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                                {product.isActive ? 'Active' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link to={`/admin/products/edit/${product._id}`}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                                                    <FiEdit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(product._id, product.name)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
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
        </div>
    );
};

export default AdminProducts;
