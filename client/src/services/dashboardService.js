import api from './api';

export const dashboardService = {
    // Get dashboard statistics
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },
};
