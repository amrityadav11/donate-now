import { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiHeart } from 'react-icons/fi';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const UserAuthModal = ({ onClose, onSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [errors, setErrors] = useState({});

    const set = (f) => (e) => {
        setForm(p => ({ ...p, [f]: e.target.value }));
        setErrors(p => ({ ...p, [f]: '' }));
    };

    const validate = () => {
        const e = {};
        if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
        if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === 'login') {
                await userService.login({ email: form.email, password: form.password });
                toast.success('Welcome back!');
            } else {
                await userService.register(form);
                toast.success('Account created!');
            }
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

                {/* Header bar */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <FiHeart size={16} />
                            </div>
                            <span className="font-bold text-lg">DonateNow</span>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                            <FiX size={20} />
                        </button>
                    </div>
                    <h2 className="text-xl font-extrabold mt-3">
                        {mode === 'login' ? 'Welcome back' : 'Join us today'}
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">
                        {mode === 'login' ? 'Sign in to manage your donations & campaigns' : 'Create your free account in seconds'}
                    </p>
                </div>

                {/* Toggle tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {['login', 'register'].map((m) => (
                        <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors capitalize ${mode === m
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}>
                            {m === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                    {mode === 'register' && (
                        <div>
                            <div className={`flex items-center border-2 rounded-xl px-3 gap-2 transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500'}`}>
                                <FiUser className="text-gray-400 flex-shrink-0" size={16} />
                                <input type="text" placeholder="Full Name" value={form.name} onChange={set('name')}
                                    className="flex-1 py-3 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                        </div>
                    )}

                    <div>
                        <div className={`flex items-center border-2 rounded-xl px-3 gap-2 transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500'}`}>
                            <FiMail className="text-gray-400 flex-shrink-0" size={16} />
                            <input type="email" placeholder="Email Address" value={form.email} onChange={set('email')}
                                className="flex-1 py-3 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                    </div>

                    {mode === 'register' && (
                        <div className="flex items-center border-2 rounded-xl px-3 gap-2 border-gray-200 dark:border-gray-600 focus-within:border-primary-500 transition-colors">
                            <FiPhone className="text-gray-400 flex-shrink-0" size={16} />
                            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} maxLength={10}
                                className="flex-1 py-3 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" />
                        </div>
                    )}

                    <div>
                        <div className={`flex items-center border-2 rounded-xl px-3 gap-2 transition-colors ${errors.password ? 'border-red-400' : 'border-gray-200 dark:border-gray-600 focus-within:border-primary-500'}`}>
                            <FiLock className="text-gray-400 flex-shrink-0" size={16} />
                            <input type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={set('password')}
                                className="flex-1 py-3 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400" />
                            <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                        {loading
                            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                            : mode === 'login' ? 'Sign In' : 'Create Account'
                        }
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
                            className="text-primary-600 font-semibold hover:underline">
                            {mode === 'login' ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </form>

                {/* Skip */}
                <div className="px-6 pb-5 text-center">
                    <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 underline">
                        Continue without signing in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserAuthModal;
