import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    FiHome, FiHeart, FiGrid, FiDollarSign, FiMessageSquare,
    FiSettings, FiLogOut, FiMenu, FiX, FiUser, FiUsers, FiInbox
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { campaignService } from '../services/campaignService';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const location = useLocation();
    const { admin, logout } = useAuth();

    useEffect(() => {
        campaignService.getCampaignRequests({ status: 'pending' })
            .then((d) => setPendingCount(d.total || 0))
            .catch(() => { });
    }, [location.pathname]);

    const navItems = [
        { path: '/admin', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/campaigns', icon: FiHeart, label: 'Campaigns' },
        { path: '/admin/campaign-requests', icon: FiInbox, label: 'Requests', badge: pendingCount },
        { path: '/admin/categories', icon: FiGrid, label: 'Categories' },
        { path: '/admin/donations', icon: FiDollarSign, label: 'Donations' },
        { path: '/admin/contacts', icon: FiMessageSquare, label: 'Contacts' },
        { path: '/admin/homepage', icon: FiSettings, label: 'Homepage' },
        ...(admin?.role === 'superadmin'
            ? [{ path: '/admin/admins', icon: FiUsers, label: 'Admins' }]
            : []),
        { path: '/admin/profile', icon: FiUser, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out`}
                >
                    <div className="h-full flex flex-col">
                        {/* Logo */}
                        <div className="hidden lg:flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium flex-1">{item.label}</span>
                                        {item.badge > 0 && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/30 text-white' : 'bg-red-500 text-white'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User info & logout */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3 px-2">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                    <FiUser className="text-primary-600" size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{admin?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <FiLogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
