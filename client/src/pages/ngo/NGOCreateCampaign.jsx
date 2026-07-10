import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiX, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import itemCampaignService from '../../services/itemCampaignService';
import productService from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import Loading from '../../components/Loading';

const BENEFICIARY_TYPES = ['children', 'elderly', 'women', 'disabled', 'families', 'animals', 'community', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const STEPS = ['Basic Info', 'Organization', 'Items', 'Delivery', 'Review'];

const NGOCreateCampaign = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [form, setForm] = useState({
        title: '', shortDescription: '', description: '', story: '',
        category: '', deadline: '', featured: false, urgent: false,
        organization: { name: '', contact: '', email: '', address: '' },
        beneficiaries: { count: 1, type: 'families', description: '' },
        deliveryAddress: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India' },
        requiredItems: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        categoryService.getCategories().then(r => setCategories(r.categories || [])).catch(() => { });
        productService.getProducts({ limit: 50 }).then(r => setProducts(r.products || [])).catch(() => { });
        if (isEdit) {
            itemCampaignService.getItemCampaignById(id)
                .then(r => {
                    const c = r.campaign;
                    setForm({
                        title: c.title || '', shortDescription: c.shortDescription || '',
                        description: c.description || '', story: c.story || '',
                        category: c.category?._id || '', deadline: c.deadline?.substring(0, 10) || '',
                        featured: c.featured || false, urgent: c.urgent || false,
                        organization: c.organization || { name: '', contact: '', email: '', address: '' },
                        beneficiaries: c.beneficiaries || { count: 1, type: 'families', description: '' },
                        deliveryAddress: c.deliveryAddress || { addressLine1: '', city: '', state: '', pincode: '', country: 'India' },
                        requiredItems: (c.requiredItems || []).map(ri => ({
                            product: ri.product?._id || ri.product,
                            productName: ri.product?.name || '',
                            quantityNeeded: ri.quantityNeeded,
                            priority: ri.priority || 'medium',
                        })),
                    });
                })
                .catch(() => toast.error('Failed to load campaign'))
                .finally(() => setFetching(false));
        }
    }, []);

    const set = (path, value) => {
        const keys = path.split('.');
        setForm(f => {
            const updated = { ...f };
            if (keys.length === 1) { updated[keys[0]] = value; }
            else if (keys.length === 2) { updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value }; }
            return updated;
        });
    };

    const addProduct = (product) => {
        if (form.requiredItems.find(ri => ri.product === product._id)) {
            toast.error('Product already added');
            return;
        }
        setForm(f => ({
            ...f,
            requiredItems: [...f.requiredItems, {
                product: product._id,
                productName: product.name,
                quantityNeeded: 1,
                priority: 'medium',
            }],
        }));
        setProductSearch('');
    };

    const removeProduct = (productId) => {
        setForm(f => ({ ...f, requiredItems: f.requiredItems.filter(ri => ri.product !== productId) }));
    };

    const updateItem = (productId, field, value) => {
        setForm(f => ({
            ...f,
            requiredItems: f.requiredItems.map(ri =>
                ri.product === productId ? { ...ri, [field]: value } : ri
            ),
        }));
    };

    const validateStep = (s) => {
        const e = {};
        if (s === 0) {
            if (!form.title.trim()) e.title = 'Required';
            if (!form.shortDescription.trim()) e.shortDescription = 'Required';
            if (!form.story.trim()) e.story = 'Required';
            if (!form.category) e.category = 'Required';
            if (!form.deadline) e.deadline = 'Required';
        }
        if (s === 1) {
            if (!form.organization.name.trim()) e.orgName = 'Required';
        }
        if (s === 2) {
            if (form.requiredItems.length === 0) e.items = 'Add at least one item';
        }
        if (s === 3) {
            if (!form.deliveryAddress.city.trim()) e.city = 'Required';
            if (!form.deliveryAddress.state.trim()) e.state = 'Required';
            if (!form.deliveryAddress.pincode.trim()) e.pincode = 'Required';
            if (!form.deliveryAddress.addressLine1.trim()) e.addr1 = 'Required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextStep = () => { if (validateStep(step)) setStep(s => s + 1); };
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                description: form.story,
            };
            if (isEdit) {
                await itemCampaignService.updateItemCampaign(id, payload);
                toast.success('Campaign updated!');
            } else {
                await itemCampaignService.createItemCampaign(payload);
                toast.success('Campaign submitted for admin approval!');
            }
            navigate('/ngo/campaigns');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to save campaign');
        } finally { setSaving(false); }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase())
    );

    if (fetching) return <Loading />;

    const inputCls = (err) => `w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/ngo/campaigns')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{isEdit ? 'Edit Campaign' : 'Create Campaign'}</h1>
            </div>

            {/* Step indicator */}
            <div className="flex items-center mb-8">
                {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm flex-shrink-0 transition ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {i < step ? '✓' : i + 1}
                        </div>
                        <span className={`ml-2 text-sm font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                {/* Step 0 — Basic Info */}
                {step === 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-2">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Campaign Title *</label>
                            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                                className={inputCls(errors.title)} placeholder="e.g. Food Kits for 100 Families" />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Short Description * <span className="text-gray-400">(max 300)</span></label>
                            <textarea rows={2} maxLength={300} value={form.shortDescription}
                                onChange={e => set('shortDescription', e.target.value)}
                                className={inputCls(errors.shortDescription)} placeholder="One-liner about this campaign" />
                            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Campaign Story * <span className="text-gray-400">(explain the need in detail)</span></label>
                            <textarea rows={6} value={form.story} onChange={e => set('story', e.target.value)}
                                className={inputCls(errors.story)} placeholder="Tell donors why these items are needed, who will benefit, and how..." />
                            {errors.story && <p className="text-red-500 text-xs mt-1">{errors.story}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category *</label>
                                <select value={form.category} onChange={e => set('category', e.target.value)}
                                    className={inputCls(errors.category)}>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deadline *</label>
                                <input type="date" value={form.deadline} min={new Date().toISOString().substring(0, 10)}
                                    onChange={e => set('deadline', e.target.value)}
                                    className={inputCls(errors.deadline)} />
                                {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.urgent} onChange={e => set('urgent', e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
                                <span className="text-sm font-medium text-red-600">Mark as URGENT</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 1 — Organization */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-2">Organization Details</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Organization Name *</label>
                            <input type="text" value={form.organization.name} onChange={e => set('organization.name', e.target.value)}
                                className={inputCls(errors.orgName)} placeholder="Name of your NGO / Trust" />
                            {errors.orgName && <p className="text-red-500 text-xs mt-1">{errors.orgName}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Number</label>
                                <input type="tel" value={form.organization.contact} onChange={e => set('organization.contact', e.target.value)}
                                    className={inputCls()} placeholder="Phone number" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value={form.organization.email} onChange={e => set('organization.email', e.target.value)}
                                    className={inputCls()} placeholder="ngo@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea rows={2} value={form.organization.address} onChange={e => set('organization.address', e.target.value)}
                                className={inputCls()} placeholder="Full address" />
                        </div>
                        <div className="border dark:border-gray-700 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Beneficiaries</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Number of Beneficiaries *</label>
                                    <input type="number" min="1" value={form.beneficiaries.count}
                                        onChange={e => set('beneficiaries.count', parseInt(e.target.value) || 1)}
                                        className={inputCls()} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select value={form.beneficiaries.type} onChange={e => set('beneficiaries.type', e.target.value)}
                                        className={inputCls()}>
                                        {BENEFICIARY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input type="text" value={form.beneficiaries.description}
                                    onChange={e => set('beneficiaries.description', e.target.value)}
                                    className={inputCls()} placeholder="e.g. Flood-affected families in rural area" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2 — Items */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-2">Required Items</h2>
                        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}

                        {/* Search products */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Add products from catalog</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search products by name or category…" value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700" />
                            </div>
                            {productSearch && (
                                <div className="border dark:border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto">
                                    {filteredProducts.length === 0 ? (
                                        <p className="p-3 text-sm text-gray-500">No products found</p>
                                    ) : filteredProducts.slice(0, 8).map(p => (
                                        <button key={p._id} onClick={() => addProduct(p)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                                            <img src={p.coverImage?.url || p.images?.[0]?.url} className="w-10 h-10 rounded object-cover" alt={p.name} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{p.name}</p>
                                                <p className="text-xs text-gray-500">₹{p.price} · {p.category}</p>
                                            </div>
                                            <FiPlus className="text-blue-600 flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Added items */}
                        <div className="space-y-3">
                            {form.requiredItems.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-6">Search and add products that you need</p>
                            ) : form.requiredItems.map((ri, i) => (
                                <motion.div key={ri.product} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="border dark:border-gray-700 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{ri.productName}</span>
                                        <button onClick={() => removeProduct(ri.product)} className="text-red-500 hover:text-red-700 p-1">
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Quantity Needed *</label>
                                            <input type="number" min="1" value={ri.quantityNeeded}
                                                onChange={e => updateItem(ri.product, 'quantityNeeded', parseInt(e.target.value) || 1)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Priority</label>
                                            <select value={ri.priority} onChange={e => updateItem(ri.product, 'priority', e.target.value)}
                                                className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 text-sm">
                                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3 — Delivery Address */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-2">Delivery Address</h2>
                        <p className="text-sm text-gray-500">Where should the donated items be delivered?</p>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                            <input type="text" value={form.deliveryAddress.addressLine1}
                                onChange={e => set('deliveryAddress.addressLine1', e.target.value)}
                                className={inputCls(errors.addr1)} placeholder="Street, building, area" />
                            {errors.addr1 && <p className="text-red-500 text-xs mt-1">{errors.addr1}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address Line 2</label>
                            <input type="text" value={form.deliveryAddress.addressLine2}
                                onChange={e => set('deliveryAddress.addressLine2', e.target.value)}
                                className={inputCls()} placeholder="Landmark, etc." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">City *</label>
                                <input type="text" value={form.deliveryAddress.city}
                                    onChange={e => set('deliveryAddress.city', e.target.value)}
                                    className={inputCls(errors.city)} placeholder="Mumbai" />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State *</label>
                                <input type="text" value={form.deliveryAddress.state}
                                    onChange={e => set('deliveryAddress.state', e.target.value)}
                                    className={inputCls(errors.state)} placeholder="Maharashtra" />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Pincode *</label>
                                <input type="text" maxLength={6} value={form.deliveryAddress.pincode}
                                    onChange={e => set('deliveryAddress.pincode', e.target.value)}
                                    className={inputCls(errors.pincode)} placeholder="400001" />
                                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Country</label>
                                <input type="text" value={form.deliveryAddress.country}
                                    onChange={e => set('deliveryAddress.country', e.target.value)}
                                    className={inputCls()} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4 — Review */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold mb-2">Review & Submit</h2>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                            ℹ️ Your campaign will be submitted for admin review. It will go live once approved (usually within 24–48 hours).
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Campaign Title</p>
                                    <p className="font-semibold">{form.title}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Deadline</p>
                                    <p className="font-semibold">{form.deadline}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Organization</p>
                                    <p className="font-semibold">{form.organization.name}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Beneficiaries</p>
                                    <p className="font-semibold">{form.beneficiaries.count} {form.beneficiaries.type}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Delivery City</p>
                                    <p className="font-semibold">{form.deliveryAddress.city}, {form.deliveryAddress.state}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                                    <p className="text-gray-500 text-xs mb-1">Items Required</p>
                                    <p className="font-semibold">{form.requiredItems.length} products</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold mb-2 text-sm">Required Items:</p>
                            <div className="space-y-1">
                                {form.requiredItems.map(ri => (
                                    <div key={ri.product} className="flex justify-between text-sm px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded">
                                        <span>{ri.productName}</span>
                                        <span className="font-semibold">×{ri.quantityNeeded} <span className="text-gray-400 ml-2 capitalize">{ri.priority}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
                    <button onClick={prevStep} disabled={step === 0}
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
                        ← Back
                    </button>

                    {step < STEPS.length - 1 ? (
                        <button onClick={nextStep}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            Continue →
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold">
                            <FiSave /> {saving ? 'Submitting…' : (isEdit ? 'Update Campaign' : 'Submit Campaign')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NGOCreateCampaign;
