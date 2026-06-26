import api from './api';

export const contactService = {
    // Submit contact form
    submitContact: async (data) => {
        const response = await api.post('/contact', data);
        return response.data;
    },

    // Get all contacts (Admin)
    getAllContacts: async (params = {}) => {
        const response = await api.get('/contact', { params });
        return response.data;
    },

    // Get contact by ID (Admin)
    getContact: async (id) => {
        const response = await api.get(`/contact/${id}`);
        return response.data;
    },

    // Update contact status (Admin)
    updateContactStatus: async (id, data) => {
        const response = await api.put(`/contact/${id}`, data);
        return response.data;
    },

    // Delete contact (Admin)
    deleteContact: async (id) => {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    },
};
