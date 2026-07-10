import api from './api';
import { userService } from './userService';

// Helper — attaches user JWT header
const userAuth = () => ({
    headers: { Authorization: `Bearer ${userService.getToken()}` },
});

const orderService = {
    // Create order (public — guest or user)
    createOrder: async (orderData) => {
        const config = userService.getToken() ? userAuth() : {};
        const { data } = await api.post('/orders', orderData, config);
        return data;
    },

    // Verify Razorpay payment
    verifyPayment: async (paymentData) => {
        const { data } = await api.post('/orders/verify-payment', paymentData);
        return data;
    },

    // Get order by ID (public — for confirmation / receipt page)
    getOrderById: async (id) => {
        const { data } = await api.get(`/orders/${id}`);
        return data;
    },

    // Get user orders (requires user token)
    getUserOrders: async (userId) => {
        const { data } = await api.get(`/orders/user/${userId}`, userAuth());
        return data;
    },

    // Cancel order (requires user token)
    cancelOrder: async (id, reason) => {
        const { data } = await api.put(`/orders/${id}/cancel`, { reason }, userAuth());
        return data;
    },

    // Get ALL orders (Admin — uses admin token from api interceptor)
    getAllOrders: async (params = {}) => {
        const { data } = await api.get('/orders/admin/all', { params });
        return data;
    },

    // Update order status (Admin)
    updateOrderStatus: async (id, statusData) => {
        const { data } = await api.put(`/orders/${id}/status`, statusData);
        return data;
    },
};

export default orderService;
