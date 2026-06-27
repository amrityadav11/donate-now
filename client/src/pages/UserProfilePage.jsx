import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiHeart, FiBookmark, FiArrowRight } from 'react-icons/fi';
import { userService } from '../services/userService';
import { useUser } from '../hooks/useUser';
import CampaignCard from '../components/CampaignCard';
import SEO from '../components/SEO';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { user: localUser, isLoggedIn, logout, refresh } = useUser();
    const [tab, setTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '' });
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

    useEffect(() => {
        if (!isLoggedIn) { navigate('/'); return; }
        userService.getProfile()
            .then((d) => {
                setProfile(d.user);
                setForm({ name: d.user.name, phone: d.user.phone || '' });
            })
            .catch(() => toast.error('Failed to load profile'))
            .finally(() => setLoading(false));
    }, [isLoggedIn]);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userService.updateProfile(form);
            refresh();
            toast.success('Profile updated');
        } catch { toast.error('Failed to update'); }
        finally { setSaving(false); }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirm) { toast.error('Passwords do not match'); return; }
        if (passForm.newPassword.length < 6) { toast.error('Min 6 characters'); return; }
        setSaving(true);
        try {
            await userService.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
            toast.success('Password changed');
            setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    if (loading) return <Loading fullScreen />;

    const savedCampaigns = profile?.savedCampaigns || [];
    const initials = profile?.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <>
            <SEO title="My Profile" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                    {/* Profile header */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                            {profile?.avatar?.url
                                ? <img src={profile.avatar.url} alt="" className="w-full h-full rounded-full object-cover" />
                                : initials}
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl font-extrabold">{profile?.name}</h1>
                            <p className="text-gray-500 text-sm">{profile?.email}</p>
                            {profile?.phone && <p className="text-gray-500 text-sm">{profile.phone}</p>}
                        </div>
                        <Link to="/start-campaign"
                            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors flex-shrink-0">
                            <FiHeart size={14} /> Start a Campaign
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
                        {[
                            { key: 'profile', label: 'Profile', icon: FiUser },
                            { key: 'saved', label: `Saved (${savedCampaigns.length})`, icon: FiBookmark },
                            { key: 'password', label: 'Password', icon: FiLock },
                        ].map(({ key, label, icon: Icon }) => (
                            <button key={key} onClick={() => setTab(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === key
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}>
                                <Icon size={14} />{label}
                            </button>
                        ))}
                    </div>

                    {/* Profile tab */}
                    {tab === 'profile' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-5">Edit Profile</h2>
                            <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                                    <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 gap-2 focus-within:border-primary-500 transition-colors">
                                        <FiUser className="text-gray-400" size={15} />
                                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            className="flex-1 py-3 bg-transparent text-sm focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Email</label>
                                    <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 gap-2 bg-gray-50 dark:bg-gray-700/50">
                                        <FiMail className="text-gray-400" size={15} />
                                        <input type="email" value={profile?.email} disabled
                                            className="flex-1 py-3 bg-transparent text-sm text-gray-400 cursor-not-allowed" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Phone</label>
                                    <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 gap-2 focus-within:border-primary-500 transition-colors">
                                        <FiPhone className="text-gray-400" size={15} />
                                        <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} maxLength={10}
                                            className="flex-1 py-3 bg-transparent text-sm focus:outline-none" placeholder="10-digit phone" />
                                    </div>
                                </div>
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl text-sm disabled:opacity-60 transition-colors">
                                    <FiSave size={15} />{saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Saved campaigns tab */}
                    {tab === 'saved' && (
                        <div>
                            {savedCampaigns.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-12 text-center">
                                    <FiBookmark size={32} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 mb-4">No saved campaigns yet</p>
                                    <Link to="/campaigns" className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:underline">
                                        Browse campaigns <FiArrowRight size={14} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {savedCampaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password tab */}
                    {tab === 'password' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-bold mb-5">Change Password</h2>
                            <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                                {[
                                    { label: 'Current Password', key: 'currentPassword', placeholder: '••••••••' },
                                    { label: 'New Password', key: 'newPassword', placeholder: 'Min 6 characters' },
                                    { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
                                ].map(({ label, key, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-1.5">{label}</label>
                                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl px-3 gap-2 focus-within:border-primary-500 transition-colors">
                                            <FiLock className="text-gray-400" size={15} />
                                            <input type="password" value={passForm[key]}
                                                onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                                className="flex-1 py-3 bg-transparent text-sm focus:outline-none" />
                                        </div>
                                    </div>
                                ))}
                                <button type="submit" disabled={saving}
                                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl text-sm disabled:opacity-60 transition-colors">
                                    <FiLock size={15} />{saving ? 'Saving...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;
