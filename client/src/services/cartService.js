import api from './api';

const cartService = {
    // All cart operations are session-based — no auth required
    getCart: async (sessionId) => {
        const { data } = await api.get(`/cart/${sessionId}`);
        return data;
    },

    addToCart: async (cartData) => {
        const { data } = await api.post('/cart/add', cartData);
        return data;
    },

    updateCartItem: async (updateData) => {
        const { data } = await api.put('/cart/update', updateData);
        return data;
    },

    removeFromCart: async (removeData) => {
        const { data } = await api.delete('/cart/remove', { data: removeData });
        return data;
    },

    clearCart: async (sessionId) => {
        const { data } = await api.delete(`/cart/${sessionId}`);
        return data;
    },
};

export default cartService;
