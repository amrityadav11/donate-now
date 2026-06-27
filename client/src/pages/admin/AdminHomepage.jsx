import { useState, useEffect, useRef } from 'react';
import { homepageService } from '../../services/homepageService';
import { fileToBase64 } from '../../utils/helpers';
import {
    FiSave, FiUpload, FiPlus, FiTrash2, FiEdit2, FiX,
    FiAlertCircle, FiPhone, FiMail, FiMapPin, FiGlobe, FiLink,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Loading from '../../components/Loading';

const Section = ({ title, children }) => (
    <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">{title}</h2>
        {children}
    </div>
);

const AdminHomepage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const heroImageRef = useRef(null);
    const aboutImageRef = useRef(null);
    const bannerImageRef = useRef(null);

    // Hero
    const [hero, setHero] = useState({ title: '', subtitle: '' });
    const [heroImagePreview, setHeroImagePreview] = useState('');
    const [heroImageFile, setHeroImageFile] = useState(null);

    // About
    const [about, setAbout] = useState({ title: '', content: '' });
    const [aboutImagePreview, setAboutImagePreview] = useState('');
    const [aboutImageFile, setAboutImageFile] = useState(null);

    // Contact
    const [contact, setContact] = useState({
        email: '', phone: '', address: '', website: '',
        socialMedia: { facebook: '', twitter: '', instagram: '', linkedin: '' },
    });

    // Testimonials
    const [testimonials, setTestimonials] = useState([]);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialForm, setTestimonialForm] = useState({ name: '', designation: '', message: '', rating: 5 });
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Banner Slides
    const [bannerSlides, setBannerSlides] = useState([]);
    const [showBannerForm, setShowBannerForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', url: '/campaigns', buttonText: 'Donate Now' });
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerImagePreview, setBannerImagePreview] = useState('');
    const [deleteBannerConfirm, setDeleteBannerConfirm] = useState(null);

    const setSavingKey = (key, val) => setSaving(prev => ({ ...prev, [key]: val }));

    const fetchHomepage = async () => {
        try {
            const data = await homepageService.getHomepage();
            const hp = data.homepage;
            setHero({ title: hp?.hero?.title || '', subtitle: hp?.hero?.subtitle || '' });
            setHeroImagePreview(hp?.hero?.backgroundImage?.url || '');
            setAbout({ title: hp?.about?.title || '', content: hp?.about?.content || '' });
            setAboutImagePreview(hp?.about?.image?.url || '');
            setTestimonials(hp?.testimonials || []);
            setBannerSlides(hp?.bannerSlides || []);
            setContact({
                email: hp?.contact?.email || '',
                phone: hp?.contact?.phone || '',
                address: hp?.contact?.address || '',
                website: hp?.contact?.website || '',
                socialMedia: {
                    facebook: hp?.contact?.socialMedia?.facebook || '',
                    twitter: hp?.contact?.socialMedia?.twitter || '',
                    instagram: hp?.contact?.socialMedia?.instagram || '',
                    linkedin: hp?.contact?.socialMedia?.linkedin || '',
                },
            });
        } catch (err) {
            toast.error('Failed to load homepage data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHomepage(); }, []);

    // ── Hero ──────────────────────────────────────────────────────────────────
    const handleHeroImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setHeroImageFile(file);
        setHeroImagePreview(await fileToBase64(file));
    };

    const saveHero = async () => {
        try {
            setSavingKey('hero', true);
            await homepageService.updateHero(hero);
            if (heroImageFile) {
                await homepageService.uploadHeroImage(await fileToBase64(heroImageFile));
                setHeroImageFile(null);
            }
            toast.success('Hero section saved');
        } catch { toast.error('Failed to save hero section'); }
        finally { setSavingKey('hero', false); }
    };

    // ── About ─────────────────────────────────────────────────────────────────
    const handleAboutImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAboutImageFile(file);
        setAboutImagePreview(await fileToBase64(file));
    };

    const saveAbout = async () => {
        try {
            setSavingKey('about', true);
            const payload = { ...about };
            if (aboutImageFile) { payload.image = await fileToBase64(aboutImageFile); setAboutImageFile(null); }
            await homepageService.updateAbout(payload);
            toast.success('About section saved');
        } catch { toast.error('Failed to save about section'); }
        finally { setSavingKey('about', false); }
    };

    // ── Contact ───────────────────────────────────────────────────────────────
    const saveContact = async () => {
        try {
            setSavingKey('contact', true);
            await homepageService.updateContact(contact);
            toast.success('Contact info saved');
        } catch { toast.error('Failed to save contact info'); }
        finally { setSavingKey('contact', false); }
    };

    // ── Testimonials ──────────────────────────────────────────────────────────
    const openAddTestimonial = () => {
        setEditingTestimonial(null);
        setTestimonialForm({ name: '', designation: '', message: '', rating: 5 });
        setShowTestimonialForm(true);
    };
    const openEditTestimonial = (t) => {
        setEditingTestimonial(t._id);
        setTestimonialForm({ name: t.name, designation: t.designation || '', message: t.message, rating: t.rating || 5 });
        setShowTestimonialForm(true);
    };
    const saveTestimonial = async () => {
        if (!testimonialForm.name.trim() || !testimonialForm.message.trim()) { toast.error('Name and message are required'); return; }
        try {
            setSavingKey('testimonial', true);
            if (editingTestimonial) {
                const data = await homepageService.updateTestimonial(editingTestimonial, testimonialForm);
                setTestimonials(prev => prev.map(t => t._id === editingTestimonial ? (data.testimonial || { ...t, ...testimonialForm }) : t));
                toast.success('Testimonial updated');
            } else {
                const data = await homepageService.addTestimonial(testimonialForm);
                setTestimonials(prev => [...prev, data.testimonial || { ...testimonialForm, _id: Date.now().toString() }]);
                toast.success('Testimonial added');
            }
            setShowTestimonialForm(false);
        } catch { toast.error('Failed to save testimonial'); }
        finally { setSavingKey('testimonial', false); }
    };
    const deleteTestimonial = async (id) => {
        try {
            await homepageService.deleteTestimonial(id);
            setTestimonials(prev => prev.filter(t => t._id !== id));
            setDeleteConfirm(null);
            toast.success('Testimonial deleted');
        } catch { toast.error('Failed to delete testimonial'); }
    };

    // ── Banner Slides ─────────────────────────────────────────────────────────
    const openAddBanner = () => {
        setEditingSlide(null);
        setBannerForm({ title: '', subtitle: '', url: '/campaigns', buttonText: 'Donate Now' });
        setBannerImageFile(null);
        setBannerImagePreview('');
        setShowBannerForm(true);
    };
    const openEditBanner = (slide) => {
        setEditingSlide(slide._id);
        setBannerForm({ title: slide.title || '', subtitle: slide.subtitle || '', url: slide.url || '/campaigns', buttonText: slide.buttonText || 'Donate Now' });
        setBannerImagePreview(slide.image?.url || '');
        setBannerImageFile(null);
        setShowBannerForm(true);
    };
    const handleBannerImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBannerImageFile(file);
        setBannerImagePreview(await fileToBase64(file));
    };
    const saveBanner = async () => {
        if (!bannerForm.title.trim()) { toast.error('Title is required'); return; }
        try {
            setSavingKey('banner', true);
            const payload = { ...bannerForm };
            if (bannerImageFile) payload.image = await fileToBase64(bannerImageFile);
            if (editingSlide) {
                const data = await homepageService.updateBannerSlide(editingSlide, payload);
                setBannerSlides(data.homepage?.bannerSlides || []);
                toast.success('Slide updated');
            } else {
                const data = await homepageService.addBannerSlide(payload);
                setBannerSlides(data.homepage?.bannerSlides || []);
                toast.success('Slide added');
            }
            setShowBannerForm(false);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to save slide';
            toast.error(msg);
            console.error('Save banner error:', err?.response?.data || err);
        }
        finally { setSavingKey('banner', false); }
    };
    const toggleBannerActive = async (slide) => {
        try {
            const data = await homepageService.updateBannerSlide(slide._id, { isActive: !slide.isActive });
            setBannerSlides(data.homepage?.bannerSlides || []);
        } catch { toast.error('Failed to update slide'); }
    };
    const deleteBanner = async (id) => {
        try {
            const data = await homepageService.deleteBannerSlide(id);
            setBannerSlides(data.homepage?.bannerSlides || []);
            setDeleteBannerConfirm(null);
            toast.success('Slide deleted');
        } catch { toast.error('Failed to delete slide'); }
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Homepage Settings</h1>

            {/* ── Banner Slides ─────────────────────────────────────────── */}
            <Section title="Banner Slides (Top Slider)">
                <p className="text-sm text-gray-500">These slides appear at the top of the homepage below the hero. Click a slide to go to its URL.</p>
                <div className="flex justify-end">
                    <button onClick={openAddBanner} className="btn-primary flex items-center gap-2 text-sm">
                        <FiPlus size={14} /> Add Slide
                    </button>
                </div>
                {bannerSlides.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No slides yet. Add one above.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bannerSlides.map(slide => (
                            <div key={slide._id} className={`border rounded-lg overflow-hidden ${slide.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-dashed border-gray-300 dark:border-gray-600 opacity-60'}`}>
                                {slide.image?.url && (
                                    <img src={slide.image.url} alt={slide.title} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-3 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm truncate">{slide.title || '(no title)'}</p>
                                            {slide.subtitle && <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>}
                                            {slide.url && (
                                                <p className="text-xs text-primary-600 truncate flex items-center gap-1 mt-0.5">
                                                    <FiLink size={10} /> {slide.url}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button onClick={() => toggleBannerActive(slide)} title={slide.isActive ? 'Deactivate' : 'Activate'}
                                                className="p-1.5 text-gray-400 hover:text-primary-600 rounded">
                                                {slide.isActive ? '👁' : '🚫'}
                                            </button>
                                            <button onClick={() => openEditBanner(slide)} className="p-1.5 text-gray-400 hover:text-primary-600 rounded">
                                                <FiEdit2 size={13} />
                                            </button>
                                            <button onClick={() => setDeleteBannerConfirm(slide._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* ── Hero Section ─────────────────────────────────────────── */}
            <Section title="Hero Section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Title</label>
                            <input type="text" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })}
                                className="input-field" placeholder="e.g. Together We Can Change Lives" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                            <textarea value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })}
                                rows="3" className="input-field resize-none" placeholder="Brief compelling message for visitors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
                            style={{ height: 160 }} onClick={() => heroImageRef.current?.click()}>
                            {heroImagePreview
                                ? <img src={heroImagePreview} alt="Hero" className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center justify-center h-full text-gray-400"><FiUpload size={28} className="mb-2" /><span className="text-sm">Click to upload image</span></div>}
                            {heroImagePreview && <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><FiUpload className="text-white" size={24} /></div>}
                        </div>
                        <input ref={heroImageRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageSelect} />
                        {heroImageFile && <p className="text-xs text-primary-600 mt-1">New image selected — save to upload</p>}
                    </div>
                </div>
                <button onClick={saveHero} disabled={saving.hero} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {saving.hero ? <><div className="spinner w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save Hero</>}
                </button>
            </Section>

            {/* ── About Section ────────────────────────────────────────── */}
            <Section title="About Section">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">About Title</label>
                            <input type="text" value={about.title} onChange={e => setAbout({ ...about, title: e.target.value })}
                                className="input-field" placeholder="e.g. About Our Mission" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">About Content</label>
                            <textarea value={about.content} onChange={e => setAbout({ ...about, content: e.target.value })}
                                rows="5" className="input-field resize-none" placeholder="Describe your organization and mission" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">About Section Image</label>
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
                            style={{ height: 160 }} onClick={() => aboutImageRef.current?.click()}>
                            {aboutImagePreview
                                ? <img src={aboutImagePreview} alt="About" className="w-full h-full object-cover" />
                                : <div className="flex flex-col items-center justify-center h-full text-gray-400"><FiUpload size={28} className="mb-2" /><span className="text-sm">Click to upload image</span></div>}
                            {aboutImagePreview && <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><FiUpload className="text-white" size={24} /></div>}
                        </div>
                        <input ref={aboutImageRef} type="file" accept="image/*" className="hidden" onChange={handleAboutImageSelect} />
                        {aboutImageFile && <p className="text-xs text-primary-600 mt-1">New image selected — save to upload</p>}
                    </div>
                </div>
                <button onClick={saveAbout} disabled={saving.about} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {saving.about ? <><div className="spinner w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save About</>}
                </button>
            </Section>

            {/* ── Contact Info ─────────────────────────────────────────── */}
            <Section title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FiMail size={12} /> Email</label>
                        <input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                            className="input-field" placeholder="contact@example.org" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FiPhone size={12} /> Phone</label>
                        <input type="tel" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })}
                            className="input-field" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FiMapPin size={12} /> Address</label>
                        <input type="text" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })}
                            className="input-field" placeholder="City, State, Country" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FiGlobe size={12} /> Website</label>
                        <input type="url" value={contact.website} onChange={e => setContact({ ...contact, website: e.target.value })}
                            className="input-field" placeholder="https://yourwebsite.org" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium mb-2">Social Media Links</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['facebook', 'twitter', 'instagram', 'linkedin'].map(platform => (
                            <div key={platform}>
                                <label className="block text-xs text-gray-500 mb-1 capitalize">{platform}</label>
                                <input type="url" value={contact.socialMedia[platform]}
                                    onChange={e => setContact({ ...contact, socialMedia: { ...contact.socialMedia, [platform]: e.target.value } })}
                                    className="input-field" placeholder={`https://${platform}.com/yourpage`} />
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={saveContact} disabled={saving.contact} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    {saving.contact ? <><div className="spinner w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save Contact Info</>}
                </button>
            </Section>

            {/* ── Testimonials ─────────────────────────────────────────── */}
            <Section title="Testimonials">
                <div className="flex justify-end">
                    <button onClick={openAddTestimonial} className="btn-primary flex items-center gap-2 text-sm">
                        <FiPlus size={14} /> Add Testimonial
                    </button>
                </div>
                {testimonials.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No testimonials yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map(t => (
                            <div key={t._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        {t.designation && <p className="text-xs text-gray-500">{t.designation}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditTestimonial(t)} className="p-1 text-gray-400 hover:text-primary-600 rounded"><FiEdit2 size={14} /></button>
                                        <button onClick={() => setDeleteConfirm(t._id)} className="p-1 text-gray-400 hover:text-red-500 rounded"><FiTrash2 size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{t.message}</p>
                                <div className="flex text-yellow-400 text-xs">{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* Banner Slide Form Modal */}
            {showBannerForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="card p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">{editingSlide ? 'Edit Slide' : 'Add Slide'}</h3>
                            <button onClick={() => setShowBannerForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><FiX size={18} /></button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title * <span className="text-xs text-gray-400">(use comma to split into colored/plain parts, e.g. "They Need Help, Don't Look Away")</span></label>
                            <input type="text" value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                                className="input-field" placeholder="They Escaped Abuse, Don't Scroll Away" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subtitle</label>
                            <input type="text" value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                                className="input-field" placeholder="e.g. Support 50+ Vulnerable Girls" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 flex items-center gap-1"><FiLink size={12} /> Link URL</label>
                            <input type="text" value={bannerForm.url} onChange={e => setBannerForm({ ...bannerForm, url: e.target.value })}
                                className="input-field" placeholder="/campaigns or /campaigns/some-campaign-slug" />
                            <p className="text-xs text-gray-400 mt-1">Internal path (e.g. /campaigns/help-children) or external URL</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Button Text</label>
                            <input type="text" value={bannerForm.buttonText} onChange={e => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                                className="input-field" placeholder="Donate Now" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slide Image</label>
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
                                style={{ height: 130 }} onClick={() => bannerImageRef.current?.click()}>
                                {bannerImagePreview
                                    ? <img src={bannerImagePreview} alt="Banner" className="w-full h-full object-cover" />
                                    : <div className="flex flex-col items-center justify-center h-full text-gray-400"><FiUpload size={24} className="mb-1" /><span className="text-sm">Click to upload</span></div>}
                                {bannerImagePreview && <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"><FiUpload className="text-white" size={22} /></div>}
                            </div>
                            <input ref={bannerImageRef} type="file" accept="image/*" className="hidden" onChange={handleBannerImageSelect} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={saveBanner} disabled={saving.banner}
                                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving.banner ? <><div className="spinner w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save Slide</>}
                            </button>
                            <button onClick={() => setShowBannerForm(false)} className="flex-1 btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonial Form Modal */}
            {showTestimonialForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="card p-6 max-w-lg w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                            <button onClick={() => setShowTestimonialForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><FiX size={18} /></button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name *</label>
                            <input type="text" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                                className="input-field" placeholder="Donor name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Designation / Location</label>
                            <input type="text" value={testimonialForm.designation} onChange={e => setTestimonialForm({ ...testimonialForm, designation: e.target.value })}
                                className="input-field" placeholder="e.g. Regular Donor, Mumbai" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message *</label>
                            <textarea value={testimonialForm.message} onChange={e => setTestimonialForm({ ...testimonialForm, message: e.target.value })}
                                rows="3" className="input-field resize-none" placeholder="What do they say about donating?" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} type="button" onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                                        className={`text-2xl ${star <= testimonialForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={saveTestimonial} disabled={saving.testimonial}
                                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving.testimonial ? <><div className="spinner w-4 h-4 border-2" /> Saving...</> : <><FiSave /> Save</>}
                            </button>
                            <button onClick={() => setShowTestimonialForm(false)} className="flex-1 btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Banner Confirm */}
            {deleteBannerConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="card p-6 max-w-sm w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FiAlertCircle className="text-red-500" size={24} />
                            <h3 className="text-lg font-bold">Delete Slide</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this banner slide?</p>
                        <div className="flex gap-3">
                            <button onClick={() => deleteBanner(deleteBannerConfirm)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Delete</button>
                            <button onClick={() => setDeleteBannerConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Testimonial Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="card p-6 max-w-sm w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FiAlertCircle className="text-red-500" size={24} />
                            <h3 className="text-lg font-bold">Delete Testimonial</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this testimonial?</p>
                        <div className="flex gap-3">
                            <button onClick={() => deleteTestimonial(deleteConfirm)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHomepage;
