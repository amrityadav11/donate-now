import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../hooks/useAuth';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiShield, FiUser } from 'react-icons/fi';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminManagement = () => {
    const { admin: currentAdmin } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAdmins();
            setAdmins(data.admins);
        } catch (error) {
            toast.error('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        try {
            setSubmitting(true);
            await adminService.createAdmin(formData);
            toast.success('Admin created successfully');
            setFormData({ name: '', email: '', password: '', role: 'admin' });
            setShowForm(false);
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const data = await adminService.toggleAdminStatus(id);
            toast.success(data.message);
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        try {
            await adminService.deleteAdmin(id);
            toast.success('Admin deleted successfully');
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage admin accounts — superadmin access only
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    <FiPlus />
                    Add Admin
                </button>
            </div>

            {/* Create Admin Form */}
            {showForm && (
                <div className="card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Create New Admin</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="input-field"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="input-field"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={submitting} className="btn-primary">
                                {submitting ? 'Creating...' : 'Create Admin'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setFormData({ name: '', email: '', password: '', role: 'admin' });
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admins Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Admin
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Role
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Last Login
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Created
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {admins.map((admin) => {
                                const isSelf = admin._id === currentAdmin?.id;
                                return (
                                    <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                                    <FiUser className="text-primary-600" size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {admin.name}
                                                        {isSelf && (
                                                            <span className="ml-2 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2 py-0.5 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${admin.role === 'superadmin'
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                    }`}
                                            >
                                                <FiShield size={12} />
                                                {admin.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${admin.isActive
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                    }`}
                                            >
                                                {admin.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {admin.lastLogin
                                                ? new Date(admin.lastLogin).toLocaleDateString()
                                                : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {!isSelf && (
                                                    <>
                                                        <button
                                                            onClick={() => handleToggleStatus(admin._id)}
                                                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                                                            className={`p-2 rounded-lg transition-colors ${admin.isActive
                                                                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {admin.isActive ? (
                                                                <FiToggleRight size={22} />
                                                            ) : (
                                                                <FiToggleLeft size={22} />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(admin._id, admin.name)}
                                                            title="Delete admin"
                                                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {admins.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No admins found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminManagement;
