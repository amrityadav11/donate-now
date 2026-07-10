import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiMapPin, FiCalendar, FiUsers, FiPackage, FiHeart, FiShare2,
    FiClock, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import itemCampaignService from '../services/itemCampaignService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const ItemCampaignDetailPage = () => {
    const { slug } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('story');

    useEffect(() => {
        loadCampaign();
    }, [slug]);

    const loadCampaign = async () => {
        setLoading(true);
        try {
            const response = await itemCampaignService.getItemCampaignBySlug(slug);
            setCampaign(response.campaign);
        } catch (error) {
            toast.error('Failed to load campaign');
            console.error('Error loading campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: campaign.title,
                text: campaign.shortDescription,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleSave = () => {
        toast.success('Campaign saved to your wishlist!');
    };

    if (loading) return <Loading />;
    if (!campaign) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Campaign not found</h2>
                <Link to="/item-campaigns" className="text-blue-600 hover:underline">
                    Browse other campaigns
                </Link>
            </div>
        </div>
    );

    const daysLeft = campaign.deadline
        ? Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <>
            <SEO
                title={campaign.title}
                description={campaign.shortDescription}
                image={campaign.coverImage?.url}
            />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Hero Section */}
                <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
                    <img
                        src={campaign.coverImage?.url || campaign.images[0]?.url}
                        alt={campaign.title}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white"
                            >
                                <div className="flex gap-2 mb-4">
                                    {campaign.urgent && (
                                        <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                            URGENT
                                        </span>
                                    )}
                                    {campaign.featured && (
                                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                                            Featured
                                        </span>
                                    )}
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                                        {campaign.category?.name}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    {campaign.title}
                                </h1>
                                <p className="text-xl mb-6 max-w-3xl">
                                    {campaign.shortDescription}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition"
                                    >
                                        <FiHeart /> Save
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg transition"
                                    >
                                        <FiShare2 /> Share
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Progress Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        {campaign.progressPercentage}% Complete
                                    </h3>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {campaign.requiredItems?.reduce((sum, item) => sum + item.quantityDonated, 0)} of{' '}
                                        {campaign.requiredItems?.reduce((sum, item) => sum + item.quantityNeeded, 0)} items donated
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                                        style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <FiClock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                                        <p className="text-xl font-bold">{daysLeft > 0 ? daysLeft : 0}</p>
                                    </div>
                                    <div>
                                        <FiUsers className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Beneficiaries</p>
                                        <p className="text-xl font-bold">{campaign.beneficiaries?.count}</p>
                                    </div>
                                    <div>
                                        <FiPackage className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Items</p>
                                        <p className="text-xl font-bold">{campaign.requiredItems?.length}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tabs */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                                <div className="border-b dark:border-gray-700">
                                    <nav className="flex">
                                        {['story', 'items', 'updates'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-6 py-4 font-medium capitalize ${activeTab === tab
                                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'story' && (
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-line">{campaign.story}</p>

                                            {campaign.images && campaign.images.length > 0 && (
                                                <div className="grid grid-cols-2 gap-4 mt-6">
                                                    {campaign.images.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={image.url}
                                                            alt={image.caption || `Campaign image ${index + 1}`}
                                                            className="rounded-lg w-full h-48 object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'items' && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Required Items</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {campaign.requiredItems?.map((item) => (
                                                    <ProductCard
                                                        key={item._id}
                                                        product={item.product}
                                                        campaign={campaign}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'updates' && (
                                        <div className="space-y-6">
                                            {campaign.updates && campaign.updates.length > 0 ? (
                                                campaign.updates.map((update, index) => (
                                                    <div
                                                        key={index}
                                                        className="border-l-4 border-blue-600 pl-4 py-2"
                                                    >
                                                        <h4 className="font-bold text-lg mb-1">
                                                            {update.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            {new Date(update.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="whitespace-pre-line">
                                                            {update.content}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    No updates yet
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* NGO Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 sticky top-4"
                            >
                                <h3 className="font-bold text-lg mb-4">Campaign By</h3>
                                <div className="mb-4">
                                    <h4 className="font-semibold text-xl">
                                        {campaign.organization?.name}
                                    </h4>
                                    {campaign.organization?.contact && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {campaign.organization.contact}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-2">
                                        <FiMapPin className="w-5 h-5 text-gray-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Delivery Location</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {campaign.deliveryAddress?.city}, {campaign.deliveryAddress?.state}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <FiUsers className="w-5 h-5 text-gray-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Beneficiaries</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {campaign.beneficiaries?.count} {campaign.beneficiaries?.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <FiCalendar className="w-5 h-5 text-gray-600 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Deadline</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(campaign.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="#items"
                                    onClick={() => setActiveTab('items')}
                                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold"
                                >
                                    View Items & Donate
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemCampaignDetailPage;
