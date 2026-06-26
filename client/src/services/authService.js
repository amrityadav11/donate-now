import api from './api';

export const authService = {
    // Admin login
    login: async (credentials) => {
        const response = await api.post('/admin/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('admin', JSON.stringify(response.data.admin));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
    },

    // Get current admin
    getCurrentAdmin: () => {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get admin profile
    getProfile: async () => {
        const response = await api.get('/admin/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await api.put('/admin/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await api.put('/admin/change-password', data);
        return response.data;
    },
};
