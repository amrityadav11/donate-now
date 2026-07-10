import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ItemCampaignCard = ({ campaign }) => {
    const daysLeft = campaign.deadline
        ? Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
            <Link to={`/item-campaigns/${campaign.slug}`}>
                <div className="relative">
                    <img
                        src={campaign.coverImage?.url || campaign.images[0]?.url}
                        alt={campaign.title}
                        className="w-full h-48 object-cover"
                    />
                    {campaign.urgent && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                            URGENT
                        </span>
                    )}
                    {campaign.featured && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <div className="mb-2">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            {campaign.category?.name}
                        </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                        {campaign.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {campaign.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <FiMapPin className="w-4 h-4" />
                        <span>{campaign.deliveryAddress.city}, {campaign.deliveryAddress.state}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-semibold text-blue-600">
                                {campaign.progressPercentage}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <FiPackage className="w-4 h-4" />
                            <span>{campaign.requiredItems?.length || 0} items needed</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <FiCalendar className="w-4 h-4" />
                            <span className={daysLeft < 7 ? 'text-red-600 font-semibold' : ''}>
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                            </span>
                        </div>
                    </div>

                    {campaign.organization && (
                        <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                By: <span className="font-semibold">{campaign.organization.name}</span>
                            </p>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export default ItemCampaignCard;
