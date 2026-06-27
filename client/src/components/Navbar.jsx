import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiHeart, FiUser, FiLogOut, FiSettings, FiBookmark } from 'react-icons/fi';
import { useDarkMode } from '../hooks/useDarkMode';
import { useUser } from '../hooks/useUser';
import UserAuthModal from './UserAuthModal';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, toggleDarkMode] = useDarkMode();
    const [showAuth, setShowAuth] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const { user, isLoggedIn, logout, refresh } = useUser();
    const dropdownRef = useRef(null);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/campaigns', label: 'Campaigns' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const isActive = (path) => location.pathname === path;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setIsOpen(false); }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        setIsOpen(false);
    };

    const avatar = user?.avatar?.url;
    const initials = user?.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <>
            <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-6">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <FiHeart className="text-white text-base" />
                            </div>
                            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight hidden sm:block">
                                DonateNow
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-5 flex-1">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}
                                    className={`font-medium text-sm transition-colors whitespace-nowrap ${isActive(link.path)
                                            ? 'text-primary-600'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'
                                        }`}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side */}
                        <div className="hidden md:flex items-center gap-2 ml-auto flex-shrink-0">
                            <button onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                                aria-label="Toggle dark mode">
                                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>

                            {/* User auth section */}
                            {isLoggedIn ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button onClick={() => setShowDropdown(p => !p)}
                                        className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        {avatar ? (
                                            <img src={avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                                                {initials}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50">
                                            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            {[
                                                { to: '/profile', icon: FiSettings, label: 'My Profile' },
                                                { to: '/profile/saved', icon: FiBookmark, label: 'Saved Campaigns' },
                                                { to: '/start-campaign', icon: FiHeart, label: 'Start a Campaign' },
                                            ].map(({ to, icon: Icon, label }) => (
                                                <Link key={to} to={to} onClick={() => setShowDropdown(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <Icon size={15} />
                                                    {label}
                                                </Link>
                                            ))}
                                            <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                                                <button onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    <FiLogOut size={15} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button onClick={() => setShowAuth(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-primary-500 hover:text-primary-600 transition-colors">
                                    <FiUser size={15} />
                                    Login
                                </button>
                            )}

                            <Link to="/start-campaign"
                                className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors shadow-sm">
                                Start a Campaign
                            </Link>
                        </div>

                        {/* Mobile right */}
                        <div className="md:hidden flex items-center gap-1.5 ml-auto">
                            <button onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Toggle dark mode">
                                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </button>
                            {isLoggedIn ? (
                                <button onClick={() => setIsOpen(p => !p)} className="flex items-center">
                                    {avatar ? (
                                        <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                                            {initials}
                                        </div>
                                    )}
                                </button>
                            ) : (
                                <button onClick={() => setShowAuth(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <FiUser size={20} />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(p => !p)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Toggle menu">
                                {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isOpen && (
                        <div className="md:hidden py-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}
                                    className={`flex items-center px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive(link.path)
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}>
                                    {link.label}
                                </Link>
                            ))}

                            {isLoggedIn && (
                                <>
                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <FiSettings size={15} /> My Profile
                                    </Link>
                                    <Link to="/profile/saved" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <FiBookmark size={15} /> Saved Campaigns
                                    </Link>
                                </>
                            )}

                            <div className="pt-2 px-3 flex flex-col gap-2">
                                {!isLoggedIn && (
                                    <button onClick={() => { setShowAuth(true); setIsOpen(false); }}
                                        className="text-center py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full">
                                        Login / Register
                                    </button>
                                )}
                                <Link to="/start-campaign"
                                    className="text-center py-2.5 text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors">
                                    Start a Campaign
                                </Link>
                                {isLoggedIn && (
                                    <button onClick={handleLogout}
                                        className="text-center py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-full hover:bg-red-50">
                                        Sign Out
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {showAuth && (
                <UserAuthModal onClose={() => setShowAuth(false)} onSuccess={refresh} />
            )}
        </>
    );
};

export default Navbar;
