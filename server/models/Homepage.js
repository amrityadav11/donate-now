import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema({
    bannerSlides: [{
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        image: {
            url: { type: String, default: '' },
            public_id: { type: String, default: '' },
        },
        url: { type: String, default: '/campaigns' },
        buttonText: { type: String, default: 'Donate Now' },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    }],
    hero: {
        title: {
            type: String,
            default: 'Make a Difference Today',
        },
        subtitle: {
            type: String,
            default: 'Your donation can change lives. Support causes that matter.',
        },
        backgroundImage: {
            url: String,
            public_id: String,
        },
        ctaText: {
            type: String,
            default: 'Donate Now',
        },
        ctaLink: {
            type: String,
            default: '/campaigns',
        },
    },
    statistics: {
        totalDonations: {
            type: Number,
            default: 0,
        },
        totalDonors: {
            type: Number,
            default: 0,
        },
        totalCampaigns: {
            type: Number,
            default: 0,
        },
        amountRaised: {
            type: Number,
            default: 0,
        },
    },
    about: {
        title: {
            type: String,
            default: 'About Our Mission',
        },
        content: {
            type: String,
            default: 'We are dedicated to making a positive impact in the world by connecting generous donors with meaningful causes.',
        },
        image: {
            url: String,
            public_id: String,
        },
    },
    testimonials: [{
        name: String,
        message: String,
        image: {
            url: String,
            public_id: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },
        designation: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    }],
    contact: {
        email: String,
        phone: String,
        address: String,
        website: String,
        socialMedia: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String,
            youtube: String,
        },
    },
    seo: {
        title: String,
        description: String,
        keywords: [String],
        ogImage: {
            url: String,
            public_id: String,
        },
    },
    appDownload: {
        isEnabled: { type: Boolean, default: false },
        title: { type: String, default: 'Donate on the Go' },
        subtitle: { type: String, default: 'Download our app and make a difference anytime, anywhere.' },
        playStoreUrl: { type: String, default: '' },
        appStoreUrl: { type: String, default: '' },
        appImage: {
            url: String,
            public_id: String,
        },
    },
}, {
    timestamps: true,
});

const Homepage = mongoose.model('Homepage', homepageSchema);

export default Homepage;
