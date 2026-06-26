import { Link } from 'react-router-dom';
import { formatCurrency, calculateProgress } from '../utils/helpers';
import { FiHeart } from 'react-icons/fi';

const CampaignCard = ({ campaign }) => {
    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const remaining = campaign.goalAmount - campaign.raisedAmount;

    return (
        <Link to={`/campaigns/${campaign.slug}`} className="card overflow-hidden group block">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={campaign.coverImage?.url || campaign.images[0]?.url || '/placeholder.jpg'}
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {campaign.featured && (
                    <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{campaign.category.icon}</span>
                    <span className="text-sm text-primary-600 font-medium">{campaign.category.name}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {campaign.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {campaign.shortDescription}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(campaign.raisedAmount)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                            {progress}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400">Goal: </span>
                        <span className="font-semibold">{formatCurrency(campaign.goalAmount)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FiHeart size={16} />
                        <span>{campaign.donationCount} donors</span>
                    </div>
                </div>

                {/* Donate Button */}
                <button className="w-full mt-4 btn-primary">
                    Donate Now
                </button>
            </div>
        </Link>
    );
};

export default CampaignCard;
