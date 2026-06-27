import api from './api';

const USER_TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export const userService = {
    register: async (data) => {
        const res = await api.post('/users/register', data);
        if (res.data.success) {
            localStorage.setItem(USER_TOKEN_KEY, res.data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        return res.data;
    },

    login: async (data) => {
        const res = await api.post('/users/login', data);
        if (res.data.success) {
            localStorage.setItem(USER_TOKEN_KEY, res.data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        return res.data;
    },

    logout: () => {
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getToken: () => localStorage.getItem(USER_TOKEN_KEY),

    getCurrentUser: () => {
        const u = localStorage.getItem(USER_KEY);
        return u ? JSON.parse(u) : null;
    },

    isLoggedIn: () => !!localStorage.getItem(USER_TOKEN_KEY),

    getProfile: async () => {
        const res = await api.get('/users/profile', {
            headers: { Authorization: `Bearer ${userService.getToken()}` },
        });
        return res.data;
    },

    updateProfile: async (data) => {
        const res = await api.put('/users/profile', data, {
            headers: { Authorization: `Bearer ${userService.getToken()}` },
        });
        if (res.data.success) {
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        }
        return res.data;
    },

    changePassword: async (data) => {
        const res = await api.put('/users/change-password', data, {
            headers: { Authorization: `Bearer ${userService.getToken()}` },
        });
        return res.data;
    },

    toggleSaveCampaign: async (campaignId) => {
        const res = await api.put(`/users/save-campaign/${campaignId}`, {}, {
            headers: { Authorization: `Bearer ${userService.getToken()}` },
        });
        return res.data;
    },
};
