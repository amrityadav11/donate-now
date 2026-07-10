import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome, FiPackage, FiLogOut, FiMenu, FiX,
    FiUser, FiPlus, FiShoppingBag, FiMessageSquare
} from 'react-icons/fi';
import { useState } from 'react';
import { useUser } from '../hooks/useUser';

const NGOLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { path: '/ngo', icon: FiHome, label: 'Dashboard' },
        { path: '/ngo/campaigns', icon: FiPackage, label: 'My Campaigns' },
        { path: '/ngo/campaigns/new', icon: FiPlus, label: 'New Campaign' },
        { path: '/ngo/orders', icon: FiShoppingBag, label: 'Orders' },
    ];

    const isActive = (path) =>
        path === '/ngo'
            ? location.pathname === '/ngo'
            : location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <FiPackage className="text-white" size={16} />
                    </div>
                    <h1 className="text-lg font-bold text-green-600">NGO Portal</h1>
                </div>
                <button onClick={() => setSidebarOpen(s => !s)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64
                  bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                  transition-transform duration-300 ease-in-out flex flex-col`}
                >
                    {/* Logo — desktop */}
                    <div className="hidden lg:flex items-center gap-3 px-5 h-16 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <FiPackage className="text-white" size={16} />
                        </div>
                        <h1 className="text-xl font-bold text-green-600">NGO Portal</h1>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <Link key={path} to={path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(path)
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}>
                                <Icon size={18} />
                                <span className="font-medium">{label}</span>
                            </Link>
                        ))}

                        <div className="pt-3 border-t dark:border-gray-700 mt-3">
                            <Link to="/item-campaigns"
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FiShoppingBag size={18} />
                                <span className="font-medium">Browse Campaigns</span>
                            </Link>
                        </div>
                    </nav>

                    {/* User info */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                {user?.avatar?.url
                                    ? <img src={user.avatar.url} className="w-9 h-9 rounded-full object-cover" alt="" />
                                    : <FiUser className="text-green-600" size={18} />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                            <FiLogOut size={16} /> Logout
                        </button>
                    </div>
                </aside>

                {/* Overlay mobile */}
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-8 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default NGOLayout;
