/**
 * Seed Products & Sample ItemCampaign
 * Run: node config/seedProducts.js
 */
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ItemCampaign from '../models/ItemCampaign.js';
import User from '../models/User.js';

await connectDB();

/* ─── Products ────────────────────────────────────────────── */
const PRODUCTS = [
    {
        name: 'Monthly Food Kit',
        sku: 'FOO-KIT-001',
        description: 'Complete food kit for a family of 4 for one month. Includes rice, dal, oil, salt, sugar, flour and spices.',
        category: 'Food Kit', price: 550, stock: 200,
        coverImage: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', public_id: 'food-kit-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', public_id: 'food-kit-1' }],
        vendor: { name: 'FoodBasket India', contact: '9000000001', email: 'vendor@foodbasket.in' },
        featured: true, isActive: true, tags: ['food', 'essential', 'family'],
    },
    {
        name: 'School Kit for Child',
        sku: 'SCH-KIT-001',
        description: 'Complete kit: 4 notebooks, pencils, pens, eraser, ruler, sharpener, geometry box, bag.',
        category: 'School Kit', price: 350, stock: 150,
        coverImage: { url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400', public_id: 'school-kit-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400', public_id: 'school-kit-1' }],
        vendor: { name: 'EduSupply Co.', contact: '9000000002', email: 'vendor@edusupply.in' },
        featured: true, isActive: true, tags: ['education', 'children', 'school'],
    },
    {
        name: 'Winter Blanket (Heavy)',
        sku: 'BLA-HEA-001',
        description: 'Thick fleece blanket suitable for cold winters. Size 60×80 inches, 2 kg weight.',
        category: 'Blanket', price: 450, stock: 100,
        coverImage: { url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400', public_id: 'blanket-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400', public_id: 'blanket-1' }],
        vendor: { name: 'WarmHome Textiles', contact: '9000000003', email: 'vendor@warmhome.in' },
        featured: false, isActive: true, tags: ['winter', 'warmth', 'homeless'],
    },
    {
        name: 'Basic Medical Kit',
        sku: 'MED-KIT-001',
        description: 'First aid kit: bandages, antiseptic, paracetamol, ORS packets, thermometer, cotton, plasters.',
        category: 'Medical Kit', price: 380, stock: 80,
        coverImage: { url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400', public_id: 'medical-kit-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400', public_id: 'medical-kit-1' }],
        vendor: { name: 'MediCare Supplies', contact: '9000000004', email: 'vendor@medicare.in' },
        featured: false, isActive: true, tags: ['health', 'medical', 'emergency'],
    },
    {
        name: "Children's Books Set (5)",
        sku: 'BOO-SET-001',
        description: 'Set of 5 age-appropriate educational picture books in Hindi & English for ages 5–12.',
        category: 'Books', price: 250, stock: 300,
        coverImage: { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', public_id: 'books-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', public_id: 'books-1' }],
        vendor: { name: 'LiteracyFirst Publishers', contact: '9000000005', email: 'vendor@literacy.in' },
        featured: true, isActive: true, tags: ['books', 'education', 'literacy'],
    },
    {
        name: 'School Shoes (Pair)',
        sku: 'SHO-SCH-001',
        description: 'Durable black canvas school shoes. Sizes available 1–8 (children) and 6–12 (adult).',
        category: 'Shoes', price: 280, stock: 120,
        coverImage: { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', public_id: 'shoes-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', public_id: 'shoes-1' }],
        vendor: { name: 'StepRight Footwear', contact: '9000000006', email: 'vendor@stepright.in' },
        featured: false, isActive: true, tags: ['shoes', 'children', 'school'],
    },
    {
        name: 'Sanitary Pads Pack (12)',
        sku: 'SAN-PAD-001',
        description: 'Pack of 12 high-quality sanitary pads. Biodegradable, rash-free, heavy-flow protection.',
        category: 'Sanitary Pads', price: 90, stock: 500,
        coverImage: { url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400', public_id: 'sanitary-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400', public_id: 'sanitary-1' }],
        vendor: { name: 'HerCare India', contact: '9000000007', email: 'vendor@hercare.in' },
        featured: false, isActive: true, tags: ['women', 'hygiene', 'health'],
    },
    {
        name: 'Baby Care Kit',
        sku: 'BAB-CAR-001',
        description: 'Kit for newborn: diapers (30), baby soap, lotion, powder, feeding bottle, onesie (2 pcs).',
        category: 'Baby Care Kit', price: 650, stock: 60,
        coverImage: { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', public_id: 'baby-kit-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', public_id: 'baby-kit-1' }],
        vendor: { name: 'BabyCare Essentials', contact: '9000000008', email: 'vendor@babycare.in' },
        featured: false, isActive: true, tags: ['baby', 'newborn', 'care'],
    },
    {
        name: 'Ceramic Water Filter',
        sku: 'WAT-FIL-001',
        description: 'Ceramic water filter that purifies 10–15 litres per day. No electricity needed. Lasts 6 months.',
        category: 'Water Filter', price: 320, stock: 75,
        coverImage: { url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', public_id: 'water-filter-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400', public_id: 'water-filter-1' }],
        vendor: { name: 'CleanWater Solutions', contact: '9000000009', email: 'vendor@cleanwater.in' },
        featured: false, isActive: true, tags: ['water', 'health', 'hygiene'],
    },
    {
        name: 'Clothes Bundle (5 pieces)',
        sku: 'CLO-BUN-001',
        description: 'Assorted 5-piece clothing bundle (mixed sizes). Includes t-shirts and trousers for men/women.',
        category: 'Clothes', price: 400, stock: 90,
        coverImage: { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400', public_id: 'clothes-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400', public_id: 'clothes-1' }],
        vendor: { name: 'ClothesForAll', contact: '9000000010', email: 'vendor@clothesforall.in' },
        featured: false, isActive: true, tags: ['clothes', 'winter', 'homeless'],
    },
    {
        name: 'Essential Medicines Pack',
        sku: 'MED-PAC-001',
        description: 'Monthly pack: Paracetamol, Antacid, ORS, Antihistamine, Bandages, Antiseptic lotion.',
        category: 'Medicines', price: 290, stock: 110,
        coverImage: { url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', public_id: 'medicines-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', public_id: 'medicines-1' }],
        vendor: { name: 'PharmaCare India', contact: '9000000011', email: 'vendor@pharmacare.in' },
        featured: false, isActive: true, tags: ['medicine', 'health', 'elderly'],
    },
    {
        name: 'Manual Wheelchair',
        sku: 'WHE-CHA-001',
        description: 'Foldable manual wheelchair with footrests, armrests and safety belt. Weight capacity: 100 kg.',
        category: 'Wheelchair', price: 4500, stock: 20,
        coverImage: { url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', public_id: 'wheelchair-1' },
        images: [{ url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', public_id: 'wheelchair-1' }],
        vendor: { name: 'MobiAid Healthcare', contact: '9000000012', email: 'vendor@mobiaid.in' },
        featured: true, isActive: true, tags: ['disabled', 'mobility', 'healthcare'],
    },
];

console.log('🌱 Seeding products…');
await Product.deleteMany({});
const inserted = await Product.insertMany(PRODUCTS);
console.log(`✅ ${inserted.length} products seeded.`);

/* ─── Sample ItemCampaign ──────────────────────────────────── */
try {
    const category = await Category.findOne({});
    const user = await User.findOne({});
    const foodKit = inserted.find(p => p.name.includes('Food'));
    const blanket = inserted.find(p => p.category === 'Blanket');
    const clothes = inserted.find(p => p.category === 'Clothes');

    if (category && user && foodKit && blanket) {
        await ItemCampaign.deleteMany({});
        await ItemCampaign.create({
            title: 'Winter Relief for 200 Homeless Families',
            shortDescription: 'Help us provide food, blankets and clothes to 200 homeless families before winter.',
            description: 'Every winter hundreds of families struggle to survive on the streets. Your donation of food kits, blankets and clothes will directly reach 200 identified homeless families in Mumbai.',
            story: 'With temperatures dropping to 10°C in Mumbai during peak winter (December–February), hundreds of homeless individuals and families are severely affected. Our NGO has been working since 2018 identifying these families in Dharavi, Kurla, and Thane areas. This year we need your help to reach 200 families before December 1st.',
            category: category._id,
            ngo: user._id,
            organization: { name: 'Helping Hands NGO', contact: '9888000001', email: 'help@helpinghands.org', address: 'Andheri East, Mumbai' },
            requiredItems: [
                { product: foodKit._id, quantityNeeded: 200, priority: 'urgent' },
                { product: blanket._id, quantityNeeded: 200, priority: 'high' },
                ...(clothes ? [{ product: clothes._id, quantityNeeded: 100, priority: 'medium' }] : []),
            ],
            beneficiaries: { count: 200, type: 'families', description: 'Homeless families in Mumbai suburbs' },
            deliveryAddress: { addressLine1: 'Dharavi Main Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400017', country: 'India' },
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'active',
            featured: true,
            urgent: true,
        });
        console.log('✅ Sample item campaign seeded.');
    } else {
        console.log('⚠️  Skipping item campaign seed — no category/user/products found. Run seed.js first.');
    }
} catch (e) {
    console.error('Item campaign seed error:', e.message);
}

console.log('🎉 Product seeding complete!');
process.exit(0);
