import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';

const ShoppingCart = ({ isOpen, onClose, onCountChange }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadCart();
        }
    }, [isOpen]);

    const loadCart = async () => {
        try {
            const sessionId = localStorage.getItem('cartSessionId');
            if (!sessionId) {
                setCart(null);
                setLoading(false);
                return;
            }

            const response = await cartService.getCart(sessionId);
            setCart(response.cart);
            if (onCountChange) {
                onCountChange(response.cart ? response.cart.items.length : 0);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, campaignId, newQuantity) => {
        try {
            const sessionId = localStorage.getItem('cartSessionId');
            await cartService.updateCartItem({
                sessionId,
                productId,
                campaignId,
                quantity: newQuantity,
            });
            loadCart();
            toast.success('Cart updated');
        } catch (error) {
            toast.error('Failed to update cart');
        }
    };

    const removeItem = async (productId, campaignId) => {
        try {
            const sessionId = localStorage.getItem('cartSessionId');
            await cartService.removeFromCart({
                sessionId,
                productId,
                campaignId,
            });
            loadCart();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    />

                    {/* Cart Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween' }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FiShoppingBag className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Shopping Cart</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : !cart || cart.items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <FiShoppingBag className="w-16 h-16 mb-4" />
                                    <p className="text-lg">Your cart is empty</p>
                                    <p className="text-sm">Start adding items to donate!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.items.map((item) => (
                                        <div
                                            key={`${item.product._id}-${item.campaign._id}`}
                                            className="flex gap-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                                        >
                                            <img
                                                src={item.product.coverImage?.url || item.product.images[0]?.url}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm mb-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                    For: {item.campaign.title}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    item.campaign._id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300"
                                                        >
                                                            <FiMinus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-semibold">{item.quantity}</span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.product._id,
                                                                    item.campaign._id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300"
                                                        >
                                                            <FiPlus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <span className="font-bold text-blue-600">
                                                        ₹{item.price * item.quantity}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.product._id, item.campaign._id)
                                                    }
                                                    className="text-xs text-red-600 hover:text-red-700 mt-2"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart && cart.items.length > 0 && (
                            <div className="p-4 border-t dark:border-gray-700">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{cart.subtotal}</span>
                                    </div>
                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-₹{cart.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>₹{cart.total}</span>
                                    </div>
                                </div>
                                <Link
                                    to="/checkout"
                                    onClick={onClose}
                                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-semibold"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShoppingCart;
