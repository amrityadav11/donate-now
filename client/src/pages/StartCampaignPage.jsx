import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FiUser, FiMail, FiPhone, FiFileText, FiTarget, FiCheckCircle,
    FiArrowRight, FiHeart, FiUpload, FiX, FiCalendar, FiImage,
    FiShield, FiAlertCircle
} from 'react-icons/fi';
import { contactService } from '../services/contactService';
import { categoryService } from '../services/categoryService';
import { campaignService } from '../services/campaignService';
import { fileToBase64 } from '../utils/helpers';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = ['Campaigner', 'Beneficiary', 'Campaign', 'KYC & Docs', 'Review'];

const StepBar = ({ current }) => (
    <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2">
        {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <div key={i} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? 'bg-primary-600 border-primary-600 text-white'
                            : active ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {done ? <FiCheckCircle size={14} /> : i + 1}
                        </div>
                        <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? 'text-primary-600' : done ? 'text-primary-500' : 'text-gray-400'
                            }`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={`w-10 sm:w-16 h-0.5 mx-1 mb-5 flex-shrink-0 ${i < current ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── Reusable field ───────────────────────────────────────────────────────────
const Field = ({ icon: Icon, error, className = '', ...props }) => (
    <div className="relative">
        <input
            {...props}
            className={`w-full border-b-2 py-3 pr-10 pl-0 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition-colors text-sm ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                } ${className}`}
        />
        {Icon && <Icon className="absolute right-2 top-3.5 text-gray-400" size={16} />}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

// ─── File upload box ──────────────────────────────────────────────────────────
const DocUpload = ({ label, hint, value, onChange, accept = 'image/*,.pdf', required, error }) => {
    const ref = useRef(null);
    return (
        <div>
            <p className="text-sm font-medium mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </p>
            {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
            <div
                onClick={() => ref.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors ${value ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : error ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 bg-gray-50 dark:bg-gray-700/30'
                    }`}
            >
                {value ? (
                    <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                        <FiCheckCircle size={18} />
                        <span className="truncate max-w-xs">{value.name}</span>
                    </div>
                ) : (
                    <>
                        <FiUpload className="text-gray-400" size={22} />
                        <span className="text-xs text-gray-500">Click to upload</span>
                        <span className="text-xs text-gray-400">JPG, PNG or PDF · Max 5MB</span>
                    </>
                )}
            </div>
            <input ref={ref} type="file" accept={accept} className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] || null)} />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};

// ─── Photo upload strip ───────────────────────────────────────────────────────
const PhotoStrip = ({ photos, onAdd, onRemove }) => {
    const ref = useRef(null);
    return (
        <div>
            <p className="text-sm font-medium mb-2">Campaign Photos <span className="text-gray-400 font-normal">(up to 5)</span></p>
            <div className="flex gap-3 flex-wrap">
                {photos.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={p.preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onRemove(i)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                            <FiX size={10} />
                        </button>
                    </div>
                ))}
                {photos.length < 5 && (
                    <button type="button" onClick={() => ref.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-primary-500 transition-colors">
                        <FiImage size={20} />
                        <span className="text-xs">Add</span>
                    </button>
                )}
            </div>
            <input ref={ref} type="file" accept="image/*" multiple className="hidden"
                onChange={async (e) => {
                    const files = Array.from(e.target.files || []).slice(0, 5 - photos.length);
                    for (const file of files) {
                        const preview = await fileToBase64(file);
                        onAdd({ file, preview });
                    }
                    e.target.value = '';
                }} />
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const StartCampaignPage = () => {
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [photos, setPhotos] = useState([]);          // { file, preview }[]

    // KYC documents
    const [docs, setDocs] = useState({
        aadhar: null,
        pan: null,
        ngoCert: null,
        bankPassbook: null,
        campaignDoc: null,
    });

    const [form, setForm] = useState({
        // Step 0
        name: '', email: '', phone: '',
        // Step 1
        beneficiaryName: '', beneficiaryRelation: '', beneficiaryAge: '',
        // Step 2
        campaignTitle: '', goalAmount: '', endDate: '', shortDesc: '', story: '',
        // Step 3 (KYC text)
        panNumber: '', aadharNumber: '',
    });

    useEffect(() => {
        categoryService.getCategories({ isActive: true })
            .then((d) => setCategories(d.categories))
            .catch(() => { });
    }, []);

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    // Min end date = tomorrow
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    const validate = () => {
        const e = {};
        if (step === 0) {
            if (!form.name.trim()) e.name = 'Name is required';
            if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
            if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit mobile required';
            if (!selectedCategory) e.category = 'Please select a cause';
        }
        if (step === 1) {
            if (!form.beneficiaryName.trim()) e.beneficiaryName = 'Beneficiary name is required';
            if (!form.beneficiaryRelation) e.beneficiaryRelation = 'Please select a relation';
        }
        if (step === 2) {
            if (!form.campaignTitle.trim()) e.campaignTitle = 'Campaign title is required';
            if (!form.shortDesc.trim()) e.shortDesc = 'Short description is required';
            if (!form.goalAmount || isNaN(form.goalAmount) || Number(form.goalAmount) < 100)
                e.goalAmount = 'Enter a valid goal amount (min ₹100)';
            if (!form.endDate) e.endDate = 'End date is required';
            if (!form.story.trim() || form.story.length < 50) e.story = 'Please write at least 50 characters';
        }
        if (step === 3) {
            if (!docs.aadhar) e.aadhar = 'Aadhaar card is required';
            if (!docs.pan) e.pan = 'PAN card is required';
            if (!form.panNumber.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panNumber.toUpperCase()))
                e.panNumber = 'Enter valid PAN (e.g. ABCDE1234F)';
            if (!form.aadharNumber.trim() || !/^\d{12}$/.test(form.aadharNumber.replace(/\s/g, '')))
                e.aadharNumber = 'Enter valid 12-digit Aadhaar number';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) { setStep((s) => s + 1); window.scrollTo(0, 0); } };
    const back = () => { setErrors({}); setStep((s) => s - 1); window.scrollTo(0, 0); };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await campaignService.submitRequest({
                title: form.campaignTitle,
                shortDescription: form.shortDesc,
                description: form.story,
                story: form.story,
                category: selectedCategory?._id,
                goalAmount: Number(form.goalAmount),
                endDate: form.endDate,
                organization: {
                    name: form.beneficiaryRelation === 'Organization / NGO' ? form.beneficiaryName : form.name,
                    contact: form.phone,
                    email: form.email,
                },
                requestedBy: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                },
            });
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success screen ──────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-3">Request Submitted!</h2>
                    <p className="text-gray-500 mb-2">Thank you <strong>{form.name}</strong>!</p>
                    <p className="text-gray-500 mb-8 text-sm">
                        Our team will review your campaign and KYC documents, then reach out to <strong>{form.email}</strong> within 24–48 hours.
                    </p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        Back to Home <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO title="Start a Campaign" description="Start your fundraising campaign" />
            <div className="min-h-screen bg-blue-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-2xl mx-auto">

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                                <FiHeart className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-extrabold text-gray-900 dark:text-white">DonateNow</span>
                        </Link>
                    </div>

                    <StepBar current={step} />

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-6 sm:px-10 py-10">

                        {/* ── STEP 0: Campaigner ─────────────────────────── */}
                        {step === 0 && (
                            <>
                                <h2 className="text-2xl font-extrabold text-center mb-1">Basic Details</h2>
                                <p className="text-center text-gray-500 text-sm mb-8">I am raising funds for a <strong>Social</strong> cause</p>

                                {/* Category pills */}
                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl mb-2">
                                    {categories.slice(0, 4).map((cat) => (
                                        <button key={cat._id} type="button" onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-lg border-2 font-medium text-xs transition-all ${selectedCategory?._id === cat._id
                                                ? 'bg-primary-600 border-primary-600 text-white'
                                                : 'bg-white dark:bg-gray-700 border-gray-200 text-gray-700 dark:text-gray-200 hover:border-primary-300'
                                                }`}>
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                    {categories.length > 4 && (
                                        <select
                                            className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
                                            value={selectedCategory && !categories.slice(0, 4).find(c => c._id === selectedCategory._id) ? selectedCategory._id : ''}
                                            onChange={(e) => { const c = categories.find(x => x._id === e.target.value); if (c) setSelectedCategory(c); }}>
                                            <option value="">More ▾</option>
                                            {categories.slice(4).map((cat) => (
                                                <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                {errors.category && <p className="text-xs text-red-500 mb-4">{errors.category}</p>}

                                <div className="space-y-5 mt-6">
                                    <Field icon={FiUser} placeholder="Your Full Name" value={form.name} onChange={set('name')} error={errors.name} />
                                    <Field icon={FiMail} placeholder="Email Address" type="email" value={form.email} onChange={set('email')} error={errors.email} />
                                    <div>
                                        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary-500 transition-colors">
                                            <span className="text-xl mr-2">🇮🇳</span>
                                            <span className="text-gray-500 text-xs mr-2">+91</span>
                                            <input type="tel" placeholder="Mobile Number (10 digit)" value={form.phone} onChange={set('phone')} maxLength={10}
                                                className="flex-1 py-3 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none" />
                                            <FiPhone className="text-gray-400" size={16} />
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-6 mb-8">
                                    By continuing, you agree to our{' '}
                                    <Link to="/terms" className="text-primary-600 hover:underline">Terms of Use</Link> and{' '}
                                    <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                                </p>
                                <button onClick={next} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl tracking-widest text-sm transition-colors">CONTINUE</button>
                            </>
                        )}

                        {/* ── STEP 1: Beneficiary ────────────────────────── */}
                        {step === 1 && (
                            <>
                                <h2 className="text-2xl font-extrabold text-center mb-1">Beneficiary Details</h2>
                                <p className="text-center text-gray-500 text-sm mb-8">Who are you raising funds for?</p>
                                <div className="space-y-5">
                                    <Field icon={FiUser} placeholder="Beneficiary Full Name" value={form.beneficiaryName} onChange={set('beneficiaryName')} error={errors.beneficiaryName} />
                                    <div>
                                        <select value={form.beneficiaryRelation} onChange={set('beneficiaryRelation')}
                                            className={`w-full border-b-2 py-3 bg-transparent text-sm focus:outline-none transition-colors ${errors.beneficiaryRelation ? 'border-red-400' : 'border-gray-200 focus:border-primary-500'} text-gray-700 dark:text-gray-200`}>
                                            <option value="">Relation to Beneficiary</option>
                                            <option>Myself</option>
                                            <option>Spouse / Partner</option>
                                            <option>Child</option>
                                            <option>Parent</option>
                                            <option>Sibling</option>
                                            <option>Other Family Member</option>
                                            <option>Friend</option>
                                            <option>Organization / NGO</option>
                                            <option>Community / Society</option>
                                            <option>Animal / Wildlife</option>
                                            <option>Other</option>
                                        </select>
                                        {errors.beneficiaryRelation && <p className="text-xs text-red-500 mt-1">{errors.beneficiaryRelation}</p>}
                                    </div>
                                    <Field placeholder="Beneficiary Age (optional)" type="number" min={0} max={120} value={form.beneficiaryAge} onChange={set('beneficiaryAge')} />
                                </div>
                                <div className="flex gap-3 mt-10">
                                    <button onClick={back} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 text-sm">BACK</button>
                                    <button onClick={next} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl tracking-widest text-sm">CONTINUE</button>
                                </div>
                            </>
                        )}

                        {/* ── STEP 2: Campaign Details ───────────────────── */}
                        {step === 2 && (
                            <>
                                <h2 className="text-2xl font-extrabold text-center mb-1">Campaign Details</h2>
                                <p className="text-center text-gray-500 text-sm mb-8">Tell donors about your campaign</p>
                                <div className="space-y-5">
                                    <Field icon={FiFileText} placeholder="Campaign Title" value={form.campaignTitle} onChange={set('campaignTitle')} error={errors.campaignTitle} />
                                    <Field placeholder="Short Description (1-2 lines shown on card)" value={form.shortDesc} onChange={set('shortDesc')} error={errors.shortDesc} />

                                    {/* Goal + End Date side by side */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary-500 transition-colors">
                                                <span className="text-gray-500 mr-1 text-sm">₹</span>
                                                <input type="number" placeholder="Goal Amount" min={100} value={form.goalAmount} onChange={set('goalAmount')}
                                                    className="flex-1 py-3 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none" />
                                                <FiTarget className="text-gray-400" size={15} />
                                            </div>
                                            {errors.goalAmount && <p className="text-xs text-red-500 mt-1">{errors.goalAmount}</p>}
                                        </div>
                                        <div>
                                            <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary-500 transition-colors">
                                                <input type="date" min={minDateStr} value={form.endDate} onChange={set('endDate')}
                                                    className="flex-1 py-3 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none" />
                                                <FiCalendar className="text-gray-400" size={15} />
                                            </div>
                                            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                                        </div>
                                    </div>

                                    {/* Story */}
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1.5">Your Story <span className="text-red-500">*</span></label>
                                        <textarea placeholder="Tell your full story — why are you raising funds, what happened, how will the money be used? (min 50 chars)" value={form.story} onChange={set('story')} rows={6}
                                            className={`w-full border-2 rounded-xl p-3 text-sm bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none transition-colors ${errors.story ? 'border-red-400' : 'border-gray-200 focus:border-primary-500'}`} />
                                        <div className="flex justify-between mt-1">
                                            {errors.story ? <p className="text-xs text-red-500">{errors.story}</p> : <span />}
                                            <p className="text-xs text-gray-400">{form.story.length} chars</p>
                                        </div>
                                    </div>

                                    {/* Photo upload */}
                                    <PhotoStrip
                                        photos={photos}
                                        onAdd={(p) => setPhotos((prev) => [...prev, p])}
                                        onRemove={(i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                                    />
                                </div>
                                <div className="flex gap-3 mt-10">
                                    <button onClick={back} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 text-sm">BACK</button>
                                    <button onClick={next} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl tracking-widest text-sm">CONTINUE</button>
                                </div>
                            </>
                        )}

                        {/* ── STEP 3: KYC & Documents ────────────────────── */}
                        {step === 3 && (
                            <>
                                <div className="flex items-center gap-2 justify-center mb-1">
                                    <FiShield className="text-primary-600" size={22} />
                                    <h2 className="text-2xl font-extrabold">KYC & Documents</h2>
                                </div>
                                <p className="text-center text-gray-500 text-sm mb-2">Required for campaign verification and fund disbursement</p>
                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-8">
                                    <FiAlertCircle className="text-blue-500 flex-shrink-0" size={16} />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">All documents are encrypted and stored securely. They will only be used for verification purposes.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* PAN */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Field placeholder="PAN Number (e.g. ABCDE1234F)" value={form.panNumber}
                                                onChange={(e) => setForm(p => ({ ...p, panNumber: e.target.value.toUpperCase() }))}
                                                maxLength={10} error={errors.panNumber} />
                                        </div>
                                        <div>
                                            <Field placeholder="Aadhaar Number (12 digits)" value={form.aadharNumber}
                                                onChange={set('aadharNumber')} maxLength={12} error={errors.aadharNumber} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DocUpload label="PAN Card" hint="Front side of PAN card" required
                                            value={docs.pan} onChange={(f) => setDocs(p => ({ ...p, pan: f }))} error={errors.pan} />
                                        <DocUpload label="Aadhaar Card" hint="Front & back (combine in 1 PDF if possible)" required
                                            value={docs.aadhar} onChange={(f) => setDocs(p => ({ ...p, aadhar: f }))} error={errors.aadhar} />
                                        <DocUpload label="Bank Passbook / Cheque" hint="For fund disbursement"
                                            value={docs.bankPassbook} onChange={(f) => setDocs(p => ({ ...p, bankPassbook: f }))} />
                                        <DocUpload label="NGO / Trust Certificate" hint="If fundraising for an organization"
                                            value={docs.ngoCert} onChange={(f) => setDocs(p => ({ ...p, ngoCert: f }))} />
                                    </div>

                                    <DocUpload label="Campaign Supporting Document" hint="Medical report, admission letter, death certificate, or any relevant proof"
                                        value={docs.campaignDoc} onChange={(f) => setDocs(p => ({ ...p, campaignDoc: f }))} />
                                </div>

                                <div className="flex gap-3 mt-10">
                                    <button onClick={back} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 text-sm">BACK</button>
                                    <button onClick={next} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl tracking-widest text-sm">CONTINUE</button>
                                </div>
                            </>
                        )}

                        {/* ── STEP 4: Review & Submit ────────────────────── */}
                        {step === 4 && (
                            <>
                                <h2 className="text-2xl font-extrabold text-center mb-1">Review & Submit</h2>
                                <p className="text-center text-gray-500 text-sm mb-8">Please confirm everything before submitting</p>

                                {/* Summary sections */}
                                {[
                                    {
                                        title: 'Campaigner',
                                        rows: [
                                            ['Name', form.name], ['Email', form.email], ['Phone', `+91 ${form.phone}`],
                                            ['Category', selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : '—'],
                                        ],
                                    },
                                    {
                                        title: 'Beneficiary',
                                        rows: [
                                            ['Name', form.beneficiaryName], ['Relation', form.beneficiaryRelation],
                                            ...(form.beneficiaryAge ? [['Age', form.beneficiaryAge]] : []),
                                        ],
                                    },
                                    {
                                        title: 'Campaign',
                                        rows: [
                                            ['Title', form.campaignTitle],
                                            ['Goal', `₹${Number(form.goalAmount).toLocaleString('en-IN')}`],
                                            ['End Date', form.endDate],
                                            ['Photos', `${photos.length} uploaded`],
                                        ],
                                    },
                                    {
                                        title: 'KYC',
                                        rows: [
                                            ['PAN', form.panNumber],
                                            ['Aadhaar', form.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')],
                                            ['Documents', Object.values(docs).filter(Boolean).length + ' uploaded'],
                                        ],
                                    },
                                ].map(({ title, rows }) => (
                                    <div key={title} className="mb-5">
                                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">{title}</p>
                                        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl overflow-hidden">
                                            {rows.map(([label, value]) => (
                                                <div key={label} className="flex justify-between px-4 py-2.5 border-b last:border-0 border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs text-gray-500">{label}</span>
                                                    <span className="text-xs font-semibold text-right max-w-[60%] truncate">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Story preview */}
                                <div className="mb-8">
                                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Story Preview</p>
                                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl px-4 py-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-5">{form.story}</p>
                                    </div>
                                </div>

                                {/* Photos preview */}
                                {photos.length > 0 && (
                                    <div className="flex gap-2 mb-8 flex-wrap">
                                        {photos.map((p, i) => (
                                            <img key={i} src={p.preview} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button onClick={back} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 text-sm">BACK</button>
                                    <button onClick={handleSubmit} disabled={loading}
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl tracking-widest text-sm flex items-center justify-center gap-2">
                                        {loading
                                            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> SUBMITTING...</>
                                            : 'SUBMIT'}
                                    </button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default StartCampaignPage;
