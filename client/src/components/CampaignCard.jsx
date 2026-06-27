import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateProgress } from '../utils/helpers';
import { FiHeart, FiBookmark, FiUsers } from 'react-icons/fi';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const CampaignCard = ({ campaign }) => {
    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const user = userService.getCurrentUser();
    const [saved, setSaved] = useState(() => user?.savedCampaigns?.includes(campaign._id) || false);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userService.isLoggedIn()) {
            toast('Sign in to save campaigns', { icon: '🔒' });
            return;
        }
        setSaving(true);
        try {
            const res = await userService.toggleSaveCampaign(campaign._id);
            setSaved(res.saved);
            toast.success(res.saved ? 'Saved!' : 'Removed from saved');
        } catch { toast.error('Could not save'); }
        finally { setSaving(false); }
    };

    const coverImg = campaign.coverImage?.url || campaign.images?.[0]?.url;

    return (
        <Link
            to={`/campaigns/${campaign.slug}`}
            className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-card-hover transition-all duration-200"
        >
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {coverImg ? (
                    <img
                        src={coverImg}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiHeart className="text-gray-300 dark:text-gray-600" size={32} />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Category pill — bottom left */}
                <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 text-primary-600 dark:text-primary-400 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {campaign.category?.icon && <span>{campaign.category.icon}</span>}
                        {campaign.category?.name}
                    </span>
                </div>

                {/* Featured badge */}
                {campaign.featured && (
                    <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Featured
                    </div>
                )}

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    aria-label={saved ? 'Remove from saved' : 'Save campaign'}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${saved
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/95 dark:bg-gray-900/95 text-gray-500 hover:text-primary-600'
                        }`}
                >
                    <FiBookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
                    {campaign.shortDescription}
                </p>

                {/* Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(campaign.raisedAmount)}
                        </span>
                        <span className="text-gray-400 font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>of {formatCurrency(campaign.goalAmount)} goal</span>
                        <span className="flex items-center gap-1">
                            <FiUsers size={11} />
                            {campaign.donationCount} donors
                        </span>
                    </div>
                </div>

                {/* Donate CTA */}
                <div className="mt-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="w-full flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                        <FiHeart size={12} />
                        Donate Now
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CampaignCard;
