import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data.categories);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await categoryService.updateCategory(editingId, formData);
                toast.success('Category updated successfully');
            } else {
                await categoryService.createCategory(formData);
                toast.success('Category created successfully');
            }
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData({
            name: category.name,
            description: category.description,
            icon: category.icon,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await categoryService.deleteCategory(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', icon: '' });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Categories</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus />
                    Add Category
                </button>
            </div>

            {showForm && (
                <div className="card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Category</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="Category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="input-field"
                                    placeholder="🎯"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows="3"
                                className="input-field resize-none"
                                placeholder="Category description"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-4xl">{category.icon}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <FiEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-600"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
                        <p className="text-sm text-primary-600 font-semibold">
                            {category.campaignCount} Campaign{category.campaignCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCategories;
