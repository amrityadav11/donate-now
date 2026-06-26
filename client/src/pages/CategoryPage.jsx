import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import CampaignCard from '../components/CampaignCard';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const CategoryPage = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategory();
    }, [slug]);

    const fetchCategory = async () => {
        try {
            const data = await categoryService.getCategoryBySlug(slug);
            setCategory(data.category);
            setCampaigns(data.campaigns);
        } catch (error) {
            console.error('Failed to fetch category:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;
    if (!category) return <div>Category not found</div>;

    return (
        <>
            <SEO
                title={category.name}
                description={category.description}
            />

            <div className="section-container section-padding">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h1 className="heading-1 mb-4">{category.name}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {category.description}
                    </p>
                    <p className="text-primary-600 font-semibold mt-4">
                        {category.campaignCount} Active Campaign{category.campaignCount !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Campaigns */}
                {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <CampaignCard key={campaign._id} campaign={campaign} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No active campaigns in this category yet.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryPage;
