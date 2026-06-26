import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, url }) => {
    const defaultTitle = 'Donation Platform - Make a Difference Today';
    const defaultDescription = 'Join us in making a positive impact. Donate to verified campaigns and support causes that matter.';
    const defaultKeywords = 'donation, charity, fundraising, help, support';
    const siteUrl = 'http://localhost:5173';

    const seoTitle = title ? `${title} | DonateNow` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoKeywords = keywords || defaultKeywords;
    const seoUrl = url ? `${siteUrl}${url}` : siteUrl;
    const seoImage = ogImage || `${siteUrl}/og-image.jpg`;

    return (
        <Helmet>
            <title>{seoTitle}</title>
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={seoKeywords} />

            {/* Open Graph */}
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoTitle} />
            <meta name="twitter:description" content={seoDescription} />
            <meta name="twitter:image" content={seoImage} />

            {/* Canonical */}
            <link rel="canonical" href={seoUrl} />
        </Helmet>
    );
};

export default SEO;
