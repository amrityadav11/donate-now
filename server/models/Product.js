import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: [
            'Food Kit',
            'School Kit',
            'Blanket',
            'Medical Kit',
            'Wheelchair',
            'Books',
            'Shoes',
            'Sanitary Pads',
            'Baby Care Kit',
            'Water Filter',
            'Clothes',
            'Medicines',
            'Other'
        ],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        min: [0, 'Price cannot be negative'],
    },
    images: [{
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    }],
    coverImage: {
        url: String,
        public_id: String,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,   // allow null until pre-save generates it
    }, stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Stock cannot be negative'],
    },
    vendor: {
        name: String,
        contact: String,
        email: String,
    },
    specifications: {
        type: Map,
        of: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    weight: {
        type: Number,
        default: 0,
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
    tags: [String],
    totalOrdered: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Generate SKU before saving if not provided
productSchema.pre('save', function (next) {
    if (!this.sku) {
        const prefix = this.category.substring(0, 3).toUpperCase();
        this.sku = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

// Index for faster queries — sku unique already enforced in field definition
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
