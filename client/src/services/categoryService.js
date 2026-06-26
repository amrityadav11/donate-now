import api from './api';

export const categoryService = {
    // Get all categories
    getCategories: async (params = {}) => {
        const response = await api.get('/categories', { params });
        return response.data;
    },

    // Get category by ID
    getCategory: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    // Get category by slug
    getCategoryBySlug: async (slug) => {
        const response = await api.get(`/categories/slug/${slug}`);
        return response.data;
    },

    // Create category (Admin)
    createCategory: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    // Update category (Admin)
    updateCategory: async (id, data) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    // Delete category (Admin)
    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    // Upload category image (Admin)
    uploadImage: async (id, image) => {
        const response = await api.post(`/categories/${id}/image`, { image });
        return response.data;
    },
};
