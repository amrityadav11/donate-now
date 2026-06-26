import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignService } from '../../services/campaignService';
import { categoryService } from '../../services/categoryService';
import { fileToBase64 } from '../../utils/helpers';
import { FiSave, FiArrowLeft, FiUpload, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminCampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        story: '',
        category: '',
        goalAmount: '',
        featured: false,
        organization: {
            name: '',
            contact: '',
            email: '',
            address: '',
        },
    });

    useEffect(() => {
        fetchCategories();
        if (id) fetchCampaign();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories({ isActive: true });
            setCategories(data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchCampaign = async () => {
        try {
            const data = await campaignService.getCampaign(id);
            const c = data.campaign;
            setFormData({
                title: c.title || '',
                shortDescription: c.shortDescription || '',
                description: c.description || '',
                story: c.story || '',
                category: c.category?._id || c.category || '',
                goalAmount: c.goalAmount || '',
                featured: c.featured || false,
                organization: {
                    name: c.organization?.name || '',
                    contact: c.organization?.contact || '',
                    email: c.organization?.email || '',
                    address: c.organization?.address || '',
                },
            });
            setExistingImages(c.images || []);
        } catch (error) {
            toast.error('Failed to load campaign');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('organization.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                organization: { ...formData.organization, [field]: value },
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleImageSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const maxFiles = 5;
        const totalImages = existingImages.length + newImageFiles.length + files.length;
        if (totalImages > maxFiles) {
            toast.error(`Maximum ${maxFiles} images allowed`);
            return;
        }

        const previews = await Promise.all(
            files.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => resolve(ev.target.result);
                    reader.readAsDataURL(file);
                });
            })
        );

        setNewImageFiles((prev) => [...prev, ...files]);
        setNewImagePreviews((prev) => [...prev, ...previews]);
    };

    const removeNewImage = (index) => {
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            let campaignId = id;

            if (id) {
                await campaignService.updateCampaign(id, formData);
            } else {
                const res = await campaignService.createCampaign(formData);
                campaignId = res.campaign._id || res.campaign.id;
            }

            // Upload new images if any
            if (newImageFiles.length > 0) {
                setUploadingImages(true);
                try {
                    const base64Images = await Promise.all(
                        newImageFiles.map((file) => fileToBase64(file))
                    );
                    await campaignService.uploadImages(campaignId, base64Images);
                } catch (imgError) {
                    toast.error('Campaign saved but image upload failed. You can re-upload from edit.');
                    console.error('Image upload error:', imgError);
                } finally {
                    setUploadingImages(false);
                }
            }

            toast.success(id ? 'Campaign updated successfully' : 'Campaign created successfully');
            navigate('/admin/campaigns');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const isSubmitting = loading || uploadingImages;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/campaigns')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                    <FiArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-bold">{id ? 'Edit' : 'Add'} Campaign</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                {/* Basic Info */}
                <div className="card p-6 space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="Campaign title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Short Description * <span className="text-gray-400 font-normal">({formData.shortDescription.length}/300)</span>
                        </label>
                        <textarea
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            required
                            rows="2"
                            className="input-field resize-none"
                            placeholder="Brief description shown on campaign cards"
                            maxLength="300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="input-field resize-none"
                            placeholder="Detailed description of the campaign"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Full Story *</label>
                        <textarea
                            name="story"
                            value={formData.story}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="input-field resize-none"
                            placeholder="Complete campaign story that appears on the campaign detail page"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Goal Amount (₹) *</label>
                            <input
                                type="number"
                                name="goalAmount"
                                value={formData.goalAmount}
                                onChange={handleChange}
                                required
                                min="1"
                                className="input-field"
                                placeholder="e.g. 100000"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">
                            Mark as featured campaign (shown on homepage)
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Campaign Images</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Upload up to 5 images. The first image will be used as the cover image.
                    </p>

                    {/* Existing images (edit mode) */}
                    {existingImages.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">Current Images</p>
                            <div className="flex flex-wrap gap-3">
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className="relative w-24 h-24">
                                        <img
                                            src={img.url}
                                            alt={`Campaign image ${idx + 1}`}
                                            className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                        />
                                        {idx === 0 && (
                                            <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-primary-600 text-white rounded-b-lg py-0.5">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New image previews */}
                    {newImagePreviews.length > 0 && (
                        <div>
                            <p className="text-sm font-medium mb-2">New Images to Upload</p>
                            <div className="flex flex-wrap gap-3">
                                {newImagePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative w-24 h-24">
                                        <img
                                            src={preview}
                                            alt={`New image ${idx + 1}`}
                                            className="w-full h-full object-cover rounded-lg border-2 border-primary-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                        >
                                            <FiX size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload button */}
                    {existingImages.length + newImageFiles.length < 5 && (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-gray-500 dark:text-gray-400 hover:text-primary-600"
                            >
                                <FiImage size={20} />
                                <span className="text-sm">Click to select images</span>
                                <span className="text-xs text-gray-400">
                                    ({5 - existingImages.length - newImageFiles.length} remaining)
                                </span>
                            </button>
                        </div>
                    )}

                    {uploadingImages && (
                        <div className="flex items-center gap-2 text-primary-600 text-sm">
                            <div className="spinner w-4 h-4 border-2"></div>
                            Uploading images to Cloudinary...
                        </div>
                    )}
                </div>

                {/* Organization Details */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Organization Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Organization Name</label>
                            <input
                                type="text"
                                name="organization.name"
                                value={formData.organization.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Organization name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Contact Number</label>
                            <input
                                type="tel"
                                name="organization.contact"
                                value={formData.organization.contact}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="organization.email"
                                value={formData.organization.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="org@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                                type="text"
                                name="organization.address"
                                value={formData.organization.address}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="City, State"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner w-4 h-4 border-2"></div>
                                {uploadingImages ? 'Uploading images...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <FiSave />
                                {id ? 'Update Campaign' : 'Create Campaign'}
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/campaigns')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCampaignForm;
