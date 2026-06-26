import dotenv from 'dotenv';
import connectDB from './db.js';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import Homepage from '../models/Homepage.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting database seed...');

        // Create default admin
        const adminExists = await Admin.findOne({ email: 'admin@donation.com' });

        if (!adminExists) {
            await Admin.create({
                name: 'Admin',
                email: 'admin@donation.com',
                password: 'admin123',
                role: 'superadmin',
            });
            console.log('✅ Default admin created');
            console.log('   Email: admin@donation.com');
            console.log('   Password: admin123');
        } else {
            console.log('ℹ️  Admin already exists');
        }

        // Create default categories
        const categories = [
            {
                name: 'Old Age Homes',
                description: 'Support elderly care and old age homes providing shelter and care for senior citizens',
                icon: '👴',
            },
            {
                name: 'Animal Welfare',
                description: 'Help protect and care for animals in need, including shelters and wildlife conservation',
                icon: '🐾',
            },
            {
                name: 'Dog Rescue',
                description: 'Support dog rescue operations, shelters, and adoption programs',
                icon: '🐕',
            },
            {
                name: 'Child Welfare',
                description: 'Support children in need through education, healthcare, and basic necessities',
                icon: '👶',
            },
            {
                name: 'Education',
                description: 'Provide educational opportunities and resources to underprivileged students',
                icon: '📚',
            },
            {
                name: 'Poor Families',
                description: 'Help families in poverty with essential needs and economic support',
                icon: '🏠',
            },
            {
                name: 'Medical Help',
                description: 'Provide medical assistance and healthcare to those who cannot afford it',
                icon: '🏥',
            },
            {
                name: 'Disaster Relief',
                description: 'Emergency support for communities affected by natural disasters',
                icon: '🆘',
            },
            {
                name: 'Food Distribution',
                description: 'Fight hunger by providing meals to those in need',
                icon: '🍲',
            },
            {
                name: 'Environment',
                description: 'Support environmental conservation and sustainability projects',
                icon: '🌱',
            },
        ];

        for (let i = 0; i < categories.length; i++) {
            const categoryExists = await Category.findOne({ name: categories[i].name });
            if (!categoryExists) {
                await Category.create({
                    ...categories[i],
                    order: i + 1,
                });
                console.log(`✅ Category created: ${categories[i].name}`);
            }
        }

        // Create default homepage
        const homepageExists = await Homepage.findOne();

        if (!homepageExists) {
            await Homepage.create({
                hero: {
                    title: 'Make a Difference Today',
                    subtitle: 'Your donation can change lives. Support causes that matter to you and help create a better tomorrow.',
                    ctaText: 'Explore Campaigns',
                    ctaLink: '/campaigns',
                },
                about: {
                    title: 'About Our Mission',
                    content: 'We are dedicated to making a positive impact in the world by connecting generous donors with meaningful causes. Every donation, no matter the size, helps us create lasting change in communities that need it most.',
                },
                contact: {
                    email: 'contact@donation.com',
                    phone: '+91 1234567890',
                    address: '123 Charity Street, City, Country',
                    socialMedia: {
                        facebook: 'https://facebook.com',
                        twitter: 'https://twitter.com',
                        instagram: 'https://instagram.com',
                        linkedin: 'https://linkedin.com',
                    },
                },
                seo: {
                    title: 'Donation Platform - Make a Difference Today',
                    description: 'Join us in making a positive impact. Donate to verified campaigns and support causes that matter.',
                    keywords: ['donation', 'charity', 'fundraising', 'help', 'support'],
                },
            });
            console.log('✅ Default homepage created');
        } else {
            console.log('ℹ️  Homepage already exists');
        }

        console.log('');
        console.log('🎉 Database seeded successfully!');
        console.log('');
        console.log('📝 Important: Change default admin password after first login!');
        console.log('');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedDatabase();
