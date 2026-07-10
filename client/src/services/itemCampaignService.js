import api from './api';
import { userService } from './userService';

const userAuth = () => ({
    headers: { Authorization: `Bearer ${userService.getToken()}` },
});

const itemCampaignService = {
    // Public — browse campaigns
    getItemCampaigns: async (params = {}) => {
        const { data } = await api.get('/item-campaigns', { params });
        return data;
    },

    // Public — campaign detail by slug
    getItemCampaignBySlug: async (slug) => {
        const { data } = await api.get(`/item-campaigns/${slug}`);
        return data;
    },

    // NGO — campaign detail by MongoDB ID (edit form)
    getItemCampaignById: async (id) => {
        const { data } = await api.get(`/item-campaigns/id/${id}`);
        return data;
    },

    // Public — campaign detail by ID (used in edit flow)
    getItemCampaignById: async (id) => {
        const { data } = await api.get(`/item-campaigns/id/${id}`);
        return data;
    },

    // NGO — create campaign (requires user token)
    createItemCampaign: async (campaignData) => {
        const { data } = await api.post('/item-campaigns', campaignData, userAuth());
        return data;
    },

    // NGO — update campaign (requires user token)
    updateItemCampaign: async (id, campaignData) => {
        const { data } = await api.put(`/item-campaigns/${id}`, campaignData, userAuth());
        return data;
    },

    // Admin — review campaign (uses admin token via api interceptor)
    reviewItemCampaign: async (id, reviewData) => {
        const { data } = await api.put(`/item-campaigns/${id}/review`, reviewData);
        return data;
    },

    // NGO / Admin — delete campaign
    deleteItemCampaign: async (id) => {
        const config = userService.getToken() ? userAuth() : {};
        const { data } = await api.delete(`/item-campaigns/${id}`, config);
        return data;
    },
};

export default itemCampaignService;
