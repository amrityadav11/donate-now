import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, calculateProgress } from '../utils/helpers';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const CampaignCard = ({ campaign }) => {
    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const user = userService.getCurrentUser();
    const [saved, setSaved] = useState(
        () => user?.savedCampaigns?.includes(campaign._id) || false
    );
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userService.isLoggedIn()) {
            toast('Login to save campaigns', { icon: '🔒' });
            return;
        }
        setSaving(true);
        try {
            const res = await userService.toggleSaveCampaign(campaign._id);
            setSaved(res.saved);
            toast.success(res.saved ? 'Campaign saved!' : 'Removed from saved');
        } catch {
            toast.error('Could not save campaign');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Link to={`/campaigns/${campaign.slug}`} className="card overflow-hidden group block">
            {/* Image */}
            <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                    src={campaign.coverImage?.url || campaign.images?.[0]?.url || '/placeholder.jpg'}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
                {campaign.featured && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        Featured
                    </div>
                )}
                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md ${saved
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-primary-600 hover:text-white'
                        }`}
                    title={saved ? 'Remove from saved' : 'Save campaign'}
                >
                    <FiBookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xl">{campaign.category?.icon}</span>
                    <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
                        {campaign.category?.name}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold mb-1.5 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                    {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {campaign.shortDescription}
                </p>

                {/* Progress */}
                <div className="mb-3">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs">
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                            {formatCurrency(campaign.raisedAmount)}
                        </p>
                        <p className="text-gray-400">of {formatCurrency(campaign.goalAmount)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <FiHeart size={12} className="text-red-400" />
                        <span>{campaign.donationCount} donors</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CampaignCard;
