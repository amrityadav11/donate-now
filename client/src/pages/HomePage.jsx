import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homepageService } from '../services/homepageService';
import { campaignService } from '../services/campaignService';
import { categoryService } from '../services/categoryService';
import { FiArrowRight, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import CampaignCard from '../components/CampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

/* ── Hero Slider ─────────────────────────────────────────────────────────── */
const HeroSlider = ({ slides, fallbackHero, fallbackBg }) => {
    const active = slides.filter(s => s.isActive);
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);
    const touchStartX = useRef(null);
    const navigate = useNavigate();

    const next = useCallback(() => setCurrent(i => (i + 1) % active.length), [active.length]);
    const prev = useCallback(() => setCurrent(i => (i - 1 + active.length) % active.length), [active.length]);

    useEffect(() => {
        if (active.length <= 1) return;
        timerRef.current = setInterval(next, 5000);
        return () => clearInterval(timerRef.current);
    }, [next, active.length]);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        touchStartX.current = null;
    };

    // No slides — render static hero
    if (!active.length) {
        return (
            <section
                className="relative flex items-center min-h-[70vh] sm:min-h-[80vh]"
                style={fallbackBg ? { backgroundImage: `url(${fallbackBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                <div className={`absolute inset-0 ${fallbackBg ? 'bg-black/55' : 'bg-gradient-to-br from-primary-700 via-primary-600 to-orange-500'}`} />
                <div className="relative z-10 section-container w-full py-16 sm:py-24">
                    <div className="max-w-2xl">
                        <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                            Make a difference
                        </span>
                        <h1 className="heading-1 text-white mb-5 leading-[1.15]">
                            {fallbackHero?.title || 'When Kindness Moves, The World Shifts.'}
                        </h1>
                        <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                            {fallbackHero?.subtitle || 'Your donation can change lives. Support causes that matter to you.'}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to={fallbackHero?.ctaLink || '/campaigns'}
                                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-lg">
                                {fallbackHero?.ctaText || 'Explore Campaigns'} <FiArrowRight size={16} />
                            </Link>
                            <Link to="/start-campaign"
                                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-all">
                                Start a Campaign
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative overflow-hidden min-h-[70vh] sm:min-h-[80vh]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Slides */}
            <div className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)`, minHeight: 'inherit' }}>
                {active.map((slide, i) => {
                    const bg = slide.image?.url;
                    return (
                        <div
                            key={slide._id || i}
                            className="relative min-w-full flex items-center min-h-[70vh] sm:min-h-[80vh] cursor-pointer select-none"
                            style={bg ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                            onClick={() => slide.url && navigate(slide.url)}
                        >
                            {/* Overlay */}
                            <div className={`absolute inset-0 ${bg ? 'bg-black/55' : 'bg-gradient-to-br from-primary-700 via-primary-600 to-orange-500'}`} />

                            {/* Content */}
                            <div className="relative z-10 section-container w-full py-16 sm:py-24 pointer-events-none">
                                <div className="max-w-2xl">
                                    <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                                        Make a difference
                                    </span>
                                    <h1 className="heading-1 text-white mb-5 leading-[1.15]">
                                        {slide.title || fallbackHero?.title || 'When Kindness Moves, The World Shifts.'}
                                    </h1>
                                    {slide.subtitle && (
                                        <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-3 pointer-events-auto">
                                        {slide.url && (
                                            <Link
                                                to={slide.url}
                                                onClick={e => e.stopPropagation()}
                                                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-lg"
                                            >
                                                {slide.buttonText || 'Donate Now'} <FiArrowRight size={16} />
                                            </Link>
                                        )}
                                        <Link
                                            to="/start-campaign"
                                            onClick={e => e.stopPropagation()}
                                            className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-all"
                                        >
                                            Start a Campaign
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Prev / Next arrows */}
            {active.length > 1 && (
                <>
                    <button onClick={prev}
                        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Previous slide">
                        <FiChevronLeft size={22} />
                    </button>
                    <button onClick={next}
                        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Next slide">
                        <FiChevronRight size={22} />
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {active.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {active.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide counter */}
            {active.length > 1 && (
                <div className="absolute bottom-5 right-5 z-20 text-white/60 text-xs font-medium tabular-nums">
                    {current + 1} / {active.length}
                </div>
            )}
        </section>
    );
};

/* ── Marquee ─────────────────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
    { icon: '✅', text: '100% Transparent' },
    { icon: '🔒', text: 'Secure Payments' },
    { icon: '🏆', text: '10,000+ Donors' },
    { icon: '💚', text: 'Verified Campaigns' },
    { icon: '📢', text: 'Real Impact' },
    { icon: '🌍', text: 'Nationwide Reach' },
    { icon: '❤️', text: 'Every Rupee Counts' },
];

const Marquee = () => {
    const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
    return (
        <div className="overflow-hidden bg-primary-600 dark:bg-primary-700 py-2.5 select-none">
            <div className="flex animate-marquee whitespace-nowrap">
                {items.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 mx-6 text-white text-sm font-medium">
                        <span>{item.icon}</span>
                        {item.text}
                        <span className="text-primary-300 mx-2">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

/* ── Main ────────────────────────────────────────────────────────────────── */
const HomePage = () => {
    const [homepage, setHomepage] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            homepageService.getHomepage(),
            campaignService.getCampaigns({ limit: 50, status: 'active' }),
            categoryService.getCategories({ isActive: true }),
        ]).then(([hp, cp, cat]) => {
            setHomepage(hp.homepage);
            setCampaigns(cp.campaigns);
            setCategories(cat.categories);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = activeCategory === 'all'
        ? campaigns
        : campaigns.filter(c => c.category?._id === activeCategory || c.category === activeCategory);

    const activeCat = categories.find(c => c._id === activeCategory);
    const heroBg = homepage?.hero?.backgroundImage?.url;

    if (loading) return <Loading fullScreen />;

    return (
        <>
            <SEO />

            {/* ── Hero Slider ───────────────────────────────────────── */}
            <HeroSlider
                slides={homepage?.bannerSlides || []}
                fallbackHero={homepage?.hero}
                fallbackBg={heroBg}
            />

            {/* ── Marquee ───────────────────────────────────────────────── */}
            <Marquee />

            {/* ── Explore Causes ────────────────────────────────────────── */}
            <section className="section-padding bg-white dark:bg-gray-950">
                <div className="section-container">

                    {/* Header */}
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Discover</p>
                            <h2 className="heading-2">Explore Causes</h2>
                        </div>
                        <Link
                            to={activeCat ? `/categories/${activeCat.slug}` : '/campaigns'}
                            className="hidden sm:flex items-center gap-1 text-primary-600 text-sm font-semibold hover:gap-2 transition-all"
                        >
                            View All <FiChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Category tab bar */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100 dark:border-gray-800 mb-8">
                        {[{ _id: 'all', name: 'All', icon: '🌟' }, ...categories].map(cat => {
                            const active = activeCategory === cat._id;
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveCategory(cat._id)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 pt-3 pb-3 border-b-2 transition-all ${active
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className="text-xl leading-none">{cat.icon}</span>
                                    <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Campaign grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map(c => <CampaignCard key={c._id} campaign={c} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-base">No campaigns in this category yet.</p>
                            <Link to="/campaigns" className="mt-3 inline-flex items-center gap-1 text-primary-600 text-sm font-semibold hover:underline">
                                Browse all <FiArrowRight size={14} />
                            </Link>
                        </div>
                    )}

                    {/* Mobile view all */}
                    <div className="mt-8 text-center sm:hidden">
                        <Link to="/campaigns" className="btn-outline">
                            View All Campaigns
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── About ─────────────────────────────────────────────────── */}
            <section className="section-padding bg-gray-50 dark:bg-gray-900">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl order-last lg:order-first">
                            <img
                                src={homepage?.about?.image?.url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                                alt="About"
                                className="w-full h-full object-cover"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div>
                            <p className="text-xs text-primary-600 font-bold uppercase tracking-widest mb-3">Who We Are</p>
                            <h2 className="heading-2 mb-4">{homepage?.about?.title || 'About Our Mission'}</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm sm:text-base">
                                {homepage?.about?.content || 'We are dedicated to making a positive impact in the world by connecting generous donors with meaningful causes. Every donation, no matter the size, helps create lasting change.'}
                            </p>
                            <Link to="/about" className="btn-primary">
                                Learn More <FiArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────────────────── */}
            {homepage?.testimonials?.some(t => t.isActive) && (
                <section className="section-padding bg-white dark:bg-gray-950">
                    <div className="section-container">
                        <div className="text-center mb-10">
                            <p className="text-xs text-primary-600 font-bold uppercase tracking-widest mb-2">Community</p>
                            <h2 className="heading-2">What Donors Say</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {homepage.testimonials.filter(t => t.isActive).slice(0, 3).map((t, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                                    <div className="flex gap-0.5 mb-4">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <span key={s} className={`text-base ${s < (t.rating || 5) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5 italic">"{t.message}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                                            {t.designation && <p className="text-xs text-gray-400">{t.designation}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── App Download ──────────────────────────────────────────── */}
            {homepage?.appDownload?.isEnabled && (homepage?.appDownload?.playStoreUrl || homepage?.appDownload?.appStoreUrl) && (
                <section className="section-padding bg-gray-50 dark:bg-gray-900">
                    <div className="section-container">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Text */}
                            <div>
                                <p className="text-xs text-primary-600 font-bold uppercase tracking-widest mb-3">Mobile App</p>
                                <h2 className="heading-2 mb-4">
                                    {homepage.appDownload.title || 'Donate on the Go'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-sm sm:text-base">
                                    {homepage.appDownload.subtitle || 'Download our app and make a difference anytime, anywhere.'}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {homepage.appDownload.playStoreUrl && (
                                        <a
                                            href={homepage.appDownload.playStoreUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-gray-900 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 text-white px-5 py-3 rounded-xl transition-colors shadow-md"
                                        >
                                            {/* Google Play icon */}
                                            <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                                                <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-11.52-3.24-3.24L3.18 23.76zM20.54 10.2l-2.7-1.56-3.6 3.3 3.6 3.36 2.73-1.58a1.74 1.74 0 0 0 0-3.52zM3 1.06a1.74 1.74 0 0 0-.6 1.32v19.2c0 .5.21.96.6 1.32l.09.08 10.77-10.77v-.24L3.09.98 3 1.06zm10.53 11.1L3 23.4v.05c.35.04.7-.03 1-.2l12.36-7.14-2.83-2.83v.88z" />
                                            </svg>
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-300 leading-none">GET IT ON</p>
                                                <p className="text-sm font-semibold leading-tight">Google Play</p>
                                            </div>
                                        </a>
                                    )}
                                    {homepage.appDownload.appStoreUrl && (
                                        <a
                                            href={homepage.appDownload.appStoreUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-gray-900 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 text-white px-5 py-3 rounded-xl transition-colors shadow-md"
                                        >
                                            {/* Apple icon */}
                                            <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                            </svg>
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-300 leading-none">DOWNLOAD ON THE</p>
                                                <p className="text-sm font-semibold leading-tight">App Store</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                            {/* App image / mockup */}
                            <div className="flex justify-center lg:justify-end">
                                {homepage.appDownload.appImage?.url ? (
                                    <img
                                        src={homepage.appDownload.appImage.url}
                                        alt="App preview"
                                        className="max-h-80 sm:max-h-96 object-contain drop-shadow-2xl"
                                    />
                                ) : (
                                    <div className="w-48 sm:w-56 h-80 sm:h-96 bg-gradient-to-br from-primary-600 to-orange-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 text-white">
                                        <svg viewBox="0 0 24 24" className="w-16 h-16 opacity-80" fill="currentColor">
                                            <path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-5 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-4H7V4h10v13z" />
                                        </svg>
                                        <p className="text-sm font-semibold opacity-90">App Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA banner ────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-primary-600 to-orange-500 text-white">
                <div className="section-container py-14 sm:py-16 text-center">
                    <h2 className="heading-2 mb-3">Ready to Make a Difference?</h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                        Every donation counts. Join thousands of donors helping communities across India.
                    </p>
                    <Link
                        to="/campaigns"
                        className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl transition-all shadow-lg text-sm"
                    >
                        Start Donating <FiArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </>
    );
};

export default HomePage;
