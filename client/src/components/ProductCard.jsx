import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';

const ProductCard = ({ product, campaign }) => {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        if (!campaign) {
            toast.error('Please select a campaign to donate this item to');
            return;
        }
        setLoading(true);
        try {
            const sessionId = localStorage.getItem('cartSessionId') ||
                `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            localStorage.setItem('cartSessionId', sessionId);

            await cartService.addToCart({
                sessionId,
                productId: product._id,
                campaignId: campaign._id,
                quantity,
            });

            toast.success('Item added to cart!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
            <div className="relative">
                <img
                    src={product.coverImage?.url || product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.featured && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                        Featured
                    </span>
                )}
                <button
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                    onClick={() => toast.success('Added to wishlist!')}
                >
                    <FiHeart className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            <div className="p-4">
                <div className="mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {product.category}
                    </span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                        ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </span>
                </div>

                <div className="flex gap-2">
                    <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    >
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading || product.stock === 0}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FiShoppingCart />
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
