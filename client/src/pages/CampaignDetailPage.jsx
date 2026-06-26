import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { formatCurrency, calculateProgress, formatDate, shareOnSocial } from '../utils/helpers';
import { FiHeart, FiShare2, FiCalendar, FiTarget, FiUsers } from 'react-icons/fi';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const CampaignDetailPage = () => {
    const { slug } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchCampaign();
    }, [slug]);

    const fetchCampaign = async () => {
        try {
            const data = await campaignService.getCampaignBySlug(slug);
            setCampaign(data.campaign);
            setSelectedImage(0);

            // Fetch donations
            const donationsData = await donationService.getCampaignDonations(data.campaign._id);
            setDonations(donationsData.donations);
        } catch (error) {
            console.error('Failed to fetch campaign:', error);
            toast.error('Campaign not found');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        shareOnSocial(platform, url, campaign.title);
    };

    if (loading) return <Loading fullScreen />;
    if (!campaign) return <div className="text-center py-12">Campaign not found</div>;

    const progress = calculateProgress(campaign.raisedAmount, campaign.goalAmount);
    const remaining = campaign.goalAmount - campaign.raisedAmount;

    return (
        <>
            <SEO
                title={campaign.title}
                description={campaign.shortDescription}
                ogImage={campaign.coverImage?.url || campaign.images[0]?.url}
                url={`/campaigns/${campaign.slug}`}
            />

            <div className="section-container section-padding">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="mb-6">
                            <div className="relative h-96 rounded-xl overflow-hidden mb-4">
                                <img
                                    src={campaign.images[selectedImage]?.url || '/placeholder.jpg'}
                                    alt={campaign.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {campaign.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {campaign.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative h-24 rounded-lg overflow-hidden ${selectedImage === index ? 'ring-4 ring-primary-600' : ''
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">{campaign.category.icon}</span>
                            <span className="text-lg text-primary-600 font-semibold">{campaign.category.name}</span>
                        </div>

                        {/* Title */}
                        <h1 className="heading-2 mb-4">{campaign.title}</h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <FiCalendar />
                                <span>Started {formatDate(campaign.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiUsers />
                                <span>{campaign.donationCount} donors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiTarget />
                                <span>{campaign.views} views</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">About This Campaign</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{campaign.story}</p>
                            </div>
                        </div>

                        {/* Organization Info */}
                        {campaign.organization && (
                            <div className="card p-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">Organization Details</h2>
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {campaign.organization.name}</p>
                                    {campaign.organization.contact && (
                                        <p><strong>Contact:</strong> {campaign.organization.contact}</p>
                                    )}
                                    {campaign.organization.email && (
                                        <p><strong>Email:</strong> {campaign.organization.email}</p>
                                    )}
                                    {campaign.organization.address && (
                                        <p><strong>Address:</strong> {campaign.organization.address}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Updates */}
                        {campaign.updates && campaign.updates.length > 0 && (
                            <div className="card p-6">
                                <h2 className="text-2xl font-bold mb-4">Campaign Updates</h2>
                                <div className="space-y-4">
                                    {campaign.updates.map((update, index) => (
                                        <div key={index} className="border-l-4 border-primary-600 pl-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                {formatDate(update.date)}
                                            </p>
                                            <h3 className="font-semibold mb-2">{update.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{update.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-20">
                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-semibold">{formatCurrency(campaign.raisedAmount)}</span>
                                    <span className="text-gray-600 dark:text-gray-400">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                                    <div
                                        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Goal:</span>
                                        <span className="font-semibold">{formatCurrency(campaign.goalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                                        <span className="font-semibold text-primary-600">{formatCurrency(remaining)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Donors:</span>
                                        <span className="font-semibold">{campaign.donationCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Donate Button */}
                            <Link
                                to={`/donate/${campaign._id}`}
                                className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
                            >
                                <FiHeart />
                                Donate Now
                            </Link>

                            {/* Share Button */}
                            <div className="relative">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                >
                                    <FiShare2 />
                                    Share Campaign
                                </button>
                            </div>
                        </div>

                        {/* Recent Donations */}
                        {donations.length > 0 && (
                            <div className="card p-6 mt-6">
                                <h3 className="text-xl font-bold mb-4">Recent Donations</h3>
                                <div className="space-y-4">
                                    {donations.slice(0, 5).map((donation, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                                <FiHeart className="text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{donation.donorName}</p>
                                                <p className="text-sm text-primary-600">{formatCurrency(donation.amount)}</p>
                                                <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignDetailPage;
