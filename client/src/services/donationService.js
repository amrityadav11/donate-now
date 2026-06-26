import api from './api';

export const donationService = {
    // Create donation
    createDonation: async (data) => {
        const response = await api.post('/donations', data);
        return response.data;
    },

    // Get donation by ID
    getDonation: async (id) => {
        const response = await api.get(`/donations/${id}`);
        return response.data;
    },

    // Get donation receipt
    getDonationReceipt: async (id) => {
        const response = await api.get(`/donations/${id}/receipt`);
        return response.data;
    },

    // Get campaign donations
    getCampaignDonations: async (campaignId, params = {}) => {
        const response = await api.get(`/donations/campaign/${campaignId}`, { params });
        return response.data;
    },

    // Get all donations (Admin)
    getAllDonations: async (params = {}) => {
        const response = await api.get('/donations', { params });
        return response.data;
    },
};
