import api from './api';

export const campaignService = {
    // Get all campaigns
    getCampaigns: async (params = {}) => {
        const response = await api.get('/campaigns', { params });
        return response.data;
    },

    // Get campaign by ID
    getCampaign: async (id) => {
        const response = await api.get(`/campaigns/${id}`);
        return response.data;
    },

    // Get campaign by slug
    getCampaignBySlug: async (slug) => {
        const response = await api.get(`/campaigns/slug/${slug}`);
        return response.data;
    },

    // Create campaign (Admin)
    createCampaign: async (data) => {
        const response = await api.post('/campaigns', data);
        return response.data;
    },

    // Update campaign (Admin)
    updateCampaign: async (id, data) => {
        const response = await api.put(`/campaigns/${id}`, data);
        return response.data;
    },

    // Delete campaign (Admin)
    deleteCampaign: async (id) => {
        const response = await api.delete(`/campaigns/${id}`);
        return response.data;
    },

    // Upload campaign images (Admin)
    uploadImages: async (id, images) => {
        const response = await api.post(`/campaigns/${id}/images`, { images });
        return response.data;
    },

    // Add campaign update (Admin)
    addUpdate: async (id, update) => {
        const response = await api.post(`/campaigns/${id}/updates`, update);
        return response.data;
    },

    // Submit public campaign request (pending approval)
    submitRequest: async (data) => {
        const response = await api.post('/campaigns/request', data);
        return response.data;
    },

    // Get campaign requests (Admin)
    getCampaignRequests: async (params = {}) => {
        const response = await api.get('/campaigns/admin/requests', { params });
        return response.data;
    },

    // Get all campaigns for admin (all statuses)
    getAdminCampaigns: async (params = {}) => {
        const response = await api.get('/campaigns/admin/all', { params });
        return response.data;
    },

    // Approve campaign (Admin)
    approveCampaign: async (id) => {
        const response = await api.put(`/campaigns/${id}/approve`);
        return response.data;
    },

    // Reject campaign (Admin)
    rejectCampaign: async (id, reason) => {
        const response = await api.put(`/campaigns/${id}/reject`, { reason });
        return response.data;
    },
};
