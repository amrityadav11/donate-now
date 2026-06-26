import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    FiFacebook, FiTwitter, FiInstagram, FiLinkedin,
    FiHeart, FiMail, FiPhone, FiMapPin, FiGlobe
} from 'react-icons/fi';
import { homepageService } from '../services/homepageService';
import { categoryService } from '../services/categoryService';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [contact, setContact] = useState(null);
    const [socialMedia, setSocialMedia] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch contact info and top categories for the footer
        const loadFooterData = async () => {
            try {
                const [hpData, catData] = await Promise.allSettled([
                    homepageService.getHomepage(),
                    categoryService.getCategories({ isActive: true, limit: 6 }),
                ]);

                if (hpData.status === 'fulfilled') {
                    setContact(hpData.value.homepage?.contact || null);
                    setSocialMedia(hpData.value.homepage?.contact?.socialMedia || {});
                }
                if (catData.status === 'fulfilled') {
                    setCategories(catData.value.categories || []);
                }
            } catch {
                // Fail silently — footer still renders with fallbacks
            }
        };

        loadFooterData();
    }, []);

    const socialLinks = [
        { key: 'facebook', icon: FiFacebook },
        { key: 'twitter', icon: FiTwitter },
        { key: 'instagram', icon: FiInstagram },
        { key: 'linkedin', icon: FiLinkedin },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="section-container section-padding">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FiHeart className="text-primary-500 text-2xl" />
                            <h3 className="text-xl font-bold text-white">DonateNow</h3>
                        </div>
                        <p className="text-sm mb-4">
                            Making a positive impact by connecting generous donors with meaningful causes.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map(({ key, icon: Icon }) =>
                                socialMedia[key] ? (
                                    <a
                                        key={key}
                                        href={socialMedia[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors"
                                        aria-label={key}
                                    >
                                        <Icon size={18} />
                                    </a>
                                ) : (
                                    <span key={key} className="p-2 bg-gray-800 rounded-lg opacity-40 cursor-default">
                                        <Icon size={18} />
                                    </span>
                                )
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/campaigns', label: 'All Campaigns' },
                                { to: '/about', label: 'About Us' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className="hover:text-primary-400 transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories — dynamic */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
                        <ul className="space-y-2 text-sm">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <li key={cat._id}>
                                        <Link
                                            to={`/categories/${cat.slug}`}
                                            className="hover:text-primary-400 transition-colors"
                                        >
                                            {cat.icon} {cat.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                // Static fallback while loading
                                ['Education', 'Medical Help', 'Animal Welfare', 'Disaster Relief'].map((c) => (
                                    <li key={c} className="text-gray-500">{c}</li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Contact Info — dynamic */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            {(contact?.email || 'contact@donation.com') && (
                                <li className="flex items-start gap-2">
                                    <FiMail className="mt-0.5 flex-shrink-0 text-primary-400" size={15} />
                                    <a
                                        href={`mailto:${contact?.email || 'contact@donation.com'}`}
                                        className="hover:text-primary-400 transition-colors break-all"
                                    >
                                        {contact?.email || 'contact@donation.com'}
                                    </a>
                                </li>
                            )}
                            {(contact?.phone || '+91 1234567890') && (
                                <li className="flex items-start gap-2">
                                    <FiPhone className="mt-0.5 flex-shrink-0 text-primary-400" size={15} />
                                    <a
                                        href={`tel:${contact?.phone || '+911234567890'}`}
                                        className="hover:text-primary-400 transition-colors"
                                    >
                                        {contact?.phone || '+91 1234567890'}
                                    </a>
                                </li>
                            )}
                            {(contact?.address) && (
                                <li className="flex items-start gap-2">
                                    <FiMapPin className="mt-0.5 flex-shrink-0 text-primary-400" size={15} />
                                    <span>{contact.address}</span>
                                </li>
                            )}
                            {contact?.website && (
                                <li className="flex items-start gap-2">
                                    <FiGlobe className="mt-0.5 flex-shrink-0 text-primary-400" size={15} />
                                    <a
                                        href={contact.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary-400 transition-colors"
                                    >
                                        {contact.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
                    <p>&copy; {currentYear} DonateNow. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-primary-400 transition-colors">
                            Terms &amp; Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
