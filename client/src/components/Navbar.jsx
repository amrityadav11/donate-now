import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiHeart } from 'react-icons/fi';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDark, toggleDarkMode] = useDarkMode();
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/campaigns', label: 'Campaigns' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 gap-8">

                    {/* Logo — left */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                            <FiHeart className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            DonateNow
                        </span>
                    </Link>

                    {/* Desktop nav links — left side after logo */}
                    <div className="hidden md:flex items-center gap-6 flex-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-medium text-sm transition-colors whitespace-nowrap ${isActive(link.path)
                                    ? 'text-primary-600'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side — dark mode + Start a Campaign */}
                    <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        <Link
                            to="/campaigns"
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors px-2"
                        >
                            Donate Now
                        </Link>

                        <Link
                            to="/start-campaign"
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2 px-5 rounded-full transition-colors shadow-sm"
                        >
                            Start a Campaign
                        </Link>
                    </div>

                    {/* Mobile — dark mode + hamburger */}
                    <div className="md:hidden flex items-center gap-2 ml-auto">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-1 border-t border-gray-200 dark:border-gray-700">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive(link.path)
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 px-4 flex flex-col gap-2">
                            <Link
                                to="/campaigns"
                                onClick={() => setIsOpen(false)}
                                className="text-center py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full"
                            >
                                Donate Now
                            </Link>
                            <Link
                                to="/start-campaign"
                                onClick={() => setIsOpen(false)}
                                className="text-center py-2.5 text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                            >
                                Start a Campaign
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
