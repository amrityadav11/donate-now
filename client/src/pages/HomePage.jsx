import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { homepageService } from '../services/homepageService';
import { campaignService } from '../services/campaignService';
import { categoryService } from '../services/categoryService';
import { FiArrowRight } from 'react-icons/fi';
import CampaignCard from '../components/CampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

// ─── Marquee trust strip ──────────────────────────────────────────────────────
const Marquee = ({ items }) => {
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden bg-primary-600 text-white py-2.5 select-none">
            <div className="flex animate-marquee whitespace-nowrap">
                {doubled.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm font-medium">
                        <span className="text-primary-200">{item.icon}</span>
                        {item.text}
                    </span>
                ))}
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const HomePage = () => {
    const [homepage, setHomepage] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [homepageData, campaignsData, categoriesData] = await Promise.all([
                homepageService.getHomepage(),
                campaignService.getCampaigns({ limit: 50, status: 'active' }),
                categoryService.getCategories({ isActive: true }),
            ]);
            setHomepage(homepageData.homepage);
            setCampaigns(campaignsData.campaigns);
            setCategories(categoriesData.categories);
        } catch (error) {
            console.error('Failed to fetch homepage data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns =
        activeCategory === 'all'
            ? campaigns
            : campaigns.filter(
                (c) => c.category?._id === activeCategory || c.category === activeCategory
            );

    const scrollCards = (dir) => {
        cardScrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
    };

    if (loading) return <Loading fullScreen />;

    const marqueeItems = [
        { icon: '✅', text: '100% Transparent Donations' },
        { icon: '🔒', text: 'Secure & Verified Payments' },
        { icon: '🏆', text: 'Trusted by 10,000+ Donors' },
        { icon: '💚', text: 'Every Rupee Counts' },
        { icon: '📢', text: 'Real Impact, Real Stories' },
        { icon: '🌍', text: 'Helping Communities Nationwide' },
    ];

    const heroBg = homepage?.hero?.backgroundImage?.url;

    // active category label for "View All" link
    const activeCatObj = categories.find((c) => c._id === activeCategory);

    return (
        <>
            <SEO />

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section
                className="relative min-h-[85vh] flex items-center"
                style={
                    heroBg
                        ? { backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : {}
                }
            >
                <div
                    className={`absolute inset-0 ${heroBg
                        ? 'bg-gradient-to-r from-black/70 via-black/50 to-transparent'
                        : 'bg-gradient-to-br from-primary-700 to-primary-900'
                        }`}
                />
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="max-w-xl">
                        <span className="inline-block bg-primary-500/80 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                            Make a difference
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                            {homepage?.hero?.title || 'When Kindness Moves, The World Shifts.'}
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                            {homepage?.hero?.subtitle || 'Your donation can change lives. Support causes that matter to you.'}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to={homepage?.hero?.ctaLink || '/campaigns'}
                                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-semibold py-3.5 px-8 rounded-full transition-all shadow-lg"
                            >
                                {homepage?.hero?.ctaText || 'Explore Now'}
                                <FiArrowRight />
                            </Link>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3.5 px-8 rounded-full border border-white/30 transition-all"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Marquee trust strip ───────────────────────────────────────── */}
            <Marquee items={marqueeItems} />

            {/* ── Explore Causes ────────────────────────────────────────────── */}
            <section className="py-14 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section heading */}
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Choose the cause you love</p>
                            <h2 className="text-3xl font-extrabold">Explore Causes</h2>
                        </div>
                        <Link
                            to={activeCatObj ? `/categories/${activeCatObj.slug}` : '/campaigns'}
                            className="text-primary-600 font-semibold text-sm hover:underline hidden sm:flex items-center gap-1"
                        >
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>

                    {/* ── Category tab bar — single horizontal scrollable line ── */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700 mb-8">

                        {/* All tab */}
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3 transition-all border-b-2 ${activeCategory === 'all'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            <span className="text-2xl leading-none">🌟</span>
                            <span className="text-xs font-medium whitespace-nowrap">All</span>
                        </button>

                        {/* Category tabs */}
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setActiveCategory(cat._id)}
                                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-3 transition-all border-b-2 ${activeCategory === cat._id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <span className="text-2xl leading-none">{cat.icon || '🎯'}</span>
                                <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* ── Campaign cards — wrapping grid ────────────────────── */}
                    {filteredCampaigns.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCampaigns.map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-gray-400 text-lg">
                            No campaigns in this category yet.
                        </div>
                    )}

                    {/* View all */}
                    <div className="text-center mt-10">
                        <Link
                            to={activeCatObj ? `/categories/${activeCatObj.slug}` : '/campaigns'}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            View All Campaigns <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── About ─────────────────────────────────────────────────────── */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
                            <img
                                src={homepage?.about?.image?.url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                                alt="About Us"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wide">Who we are</span>
                            <h2 className="text-3xl font-extrabold mt-2 mb-4">
                                {homepage?.about?.title || 'About Our Mission'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                {homepage?.about?.content || 'We are dedicated to making a positive impact in the world by connecting generous donors with meaningful causes.'}
                            </p>
                            <Link to="/about" className="inline-flex items-center gap-2 btn-primary">
                                Learn More <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────────────────────── */}
            {homepage?.testimonials?.filter((t) => t.isActive).length > 0 && (
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <p className="text-sm text-gray-500 mb-1">Real stories from real people</p>
                            <h2 className="text-3xl font-extrabold">What Donors Say</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {homepage.testimonials
                                .filter((t) => t.isActive)
                                .slice(0, 3)
                                .map((t, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                                        <div className="flex text-yellow-400 mb-4">
                                            {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 italic mb-5">"{t.message}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                {t.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{t.name}</p>
                                                {t.designation && <p className="text-xs text-gray-500">{t.designation}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ───────────────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Make a Difference?</h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        Every donation counts. Join thousands of donors helping communities across India.
                    </p>
                    <Link
                        to="/campaigns"
                        className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-10 rounded-full transition-all shadow-xl"
                    >
                        Start Donating <FiArrowRight />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default HomePage;
