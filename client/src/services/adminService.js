import api from './api';

export const adminService = {
    // Get all admins (superadmin only)
    getAdmins: async () => {
        const response = await api.get('/admin/all');
        return response.data;
    },

    // Create new admin (superadmin only)
    createAdmin: async (data) => {
        const response = await api.post('/admin/create', data);
        return response.data;
    },

    // Toggle admin active/inactive status (superadmin only)
    toggleAdminStatus: async (id) => {
        const response = await api.put(`/admin/${id}/toggle-status`);
        return response.data;
    },

    // Delete admin (superadmin only)
    deleteAdmin: async (id) => {
        const response = await api.delete(`/admin/${id}`);
        return response.data;
    },
};
