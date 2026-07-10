import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../../services/productService';

const CATEGORIES = [
    'Food Kit', 'School Kit', 'Blanket', 'Medical Kit', 'Wheelchair',
    'Books', 'Shoes', 'Sanitary Pads', 'Baby Care Kit', 'Water Filter',
    'Clothes', 'Medicines', 'Other'
];

const EMPTY_FORM = {
    name: '', description: '', category: '', price: '',
    stock: '', sku: '', featured: false, isActive: true,
    vendor: { name: '', contact: '', email: '' },
    coverImage: { url: '', public_id: '' },
    images: [],
    tags: '',
};

const AdminProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [fetchingProduct, setFetchingProduct] = useState(isEdit);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            productService.getProductById(id)
                .then(res => {
                    const p = res.product;
                    setForm({
                        name: p.name || '',
                        description: p.description || '',
                        category: p.category || '',
                        price: p.price || '',
                        stock: p.stock || '',
                        sku: p.sku || '',
                        featured: p.featured || false,
                        isActive: p.isActive ?? true,
                        vendor: p.vendor || { name: '', contact: '', email: '' },
                        coverImage: p.coverImage || { url: '', public_id: '' },
                        images: p.images || [],
                        tags: (p.tags || []).join(', '),
                    });
                    if (p.coverImage?.url) setImagePreview(p.coverImage.url);
                })
                .catch(() => toast.error('Failed to load product'))
                .finally(() => setFetchingProduct(false));
        }
    }, [id, isEdit]);

    const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
    const setVendor = (field, value) => setForm(f => ({ ...f, vendor: { ...f.vendor, [field]: value } }));

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setForm(f => ({ ...f, coverImage: { url: reader.result, public_id: '' } }));
        };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.category) e.category = 'Category is required';
        if (!form.price || form.price <= 0) e.price = 'Valid price is required';
        if (form.stock === '' || form.stock < 0) e.stock = 'Valid stock is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            };
            if (isEdit) {
                await productService.updateProduct(id, payload);
                toast.success('Product updated!');
            } else {
                await productService.createProduct(payload);
                toast.success('Product created!');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProduct) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
    );

    const field = (label, name, type = 'text', req = false) => (
        <div>
            <label className="block text-sm font-medium mb-1">{label}{req && <span className="text-red-500 ml-1">*</span>}</label>
            <input
                type={type}
                value={form[name]}
                onChange={e => set(name, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Product Info</h2>
                        {field('Product Name', 'name', 'text', true)}
                        <div>
                            <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {field('Price (₹)', 'price', 'number', true)}
                            {field('Stock Quantity', 'stock', 'number', true)}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {field('SKU', 'sku')}
                            {field('Tags (comma separated)', 'tags')}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Vendor Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Vendor Name</label>
                                <input type="text" value={form.vendor.name} onChange={e => setVendor('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact</label>
                                <input type="text" value={form.vendor.contact} onChange={e => setVendor('contact', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value={form.vendor.email} onChange={e => setVendor('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="font-semibold text-lg mb-4">Cover Image</h2>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                            {imagePreview ? (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => { setImagePreview(''); set('coverImage', { url: '', public_id: '' }); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <FiUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload image</p>
                                    <p className="text-xs text-gray-400 mt-1">Max 5 MB</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                        {!imagePreview && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium mb-1">Or paste image URL</label>
                                <input
                                    type="url"
                                    value={form.coverImage.url}
                                    onChange={e => { set('coverImage', { url: e.target.value, public_id: '' }); setImagePreview(e.target.value); }}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-3">
                        <h2 className="font-semibold text-lg">Settings</h2>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Active (visible to users)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm">Featured product</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                    >
                        <FiSave />
                        {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
