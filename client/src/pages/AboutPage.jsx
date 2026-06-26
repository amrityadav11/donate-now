import SEO from '../components/SEO';
import { FiHeart, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

const AboutPage = () => {
    return (
        <>
            <SEO title="About Us" description="Learn about our mission and how we're making a difference" />

            <div className="section-container section-padding">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="heading-1 mb-4">About Our Mission</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        We connect generous donors with meaningful causes to create lasting positive change in communities worldwide.
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="card p-8 mb-12">
                    <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg mb-4">
                            Founded with a vision to make charitable giving accessible and transparent, our platform has grown into a trusted bridge between donors and impactful causes. We believe that every individual has the power to make a difference, and we're here to make that journey seamless and meaningful.
                        </p>
                        <p className="text-lg mb-4">
                            Over the years, we've helped thousands of donors support campaigns that matter to them, from education and healthcare to environmental conservation and disaster relief. Our commitment to transparency, accountability, and impact ensures that every donation makes a real difference.
                        </p>
                        <p className="text-lg">
                            Today, we continue to innovate and expand, always keeping our core values at the heart of everything we do: integrity, compassion, and the unwavering belief that together, we can create a better world.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-16">
                    <h2 className="heading-2 text-center mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card p-6 text-center">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiHeart className="text-primary-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Compassion</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We care deeply about the causes we support and the people we serve
                            </p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiUsers className="text-green-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Community</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Building a global community of donors united in making a difference
                            </p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiTarget className="text-blue-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Transparency</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Clear, honest communication about where donations go and their impact
                            </p>
                        </div>

                        <div className="card p-6 text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAward className="text-purple-600 text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Excellence</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Striving for the highest standards in everything we do
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="card p-8 text-center">
                    <h2 className="heading-2 mb-4">Join Our Movement</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                        Whether you're a donor looking to make an impact or an organization seeking support, we're here to help you achieve your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/campaigns" className="btn-primary">
                            Browse Campaigns
                        </a>
                        <a href="/contact" className="btn-outline">
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
