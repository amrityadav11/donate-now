import api from './api';

export const homepageService = {
    // Get homepage data
    getHomepage: async () => {
        const response = await api.get('/homepage');
        return response.data;
    },

    // Update hero section (Admin)
    updateHero: async (data) => {
        const response = await api.put('/homepage/hero', data);
        return response.data;
    },

    // Upload hero image (Admin)
    uploadHeroImage: async (image) => {
        const response = await api.post('/homepage/hero/image', { image });
        return response.data;
    },

    // Update about section (Admin)
    updateAbout: async (data) => {
        const response = await api.put('/homepage/about', data);
        return response.data;
    },

    // Add testimonial (Admin)
    addTestimonial: async (data) => {
        const response = await api.post('/homepage/testimonials', data);
        return response.data;
    },

    // Update testimonial (Admin)
    updateTestimonial: async (id, data) => {
        const response = await api.put(`/homepage/testimonials/${id}`, data);
        return response.data;
    },

    // Delete testimonial (Admin)
    deleteTestimonial: async (id) => {
        const response = await api.delete(`/homepage/testimonials/${id}`);
        return response.data;
    },

    // Update contact info (Admin)
    updateContact: async (data) => {
        const response = await api.put('/homepage/contact', data);
        return response.data;
    },
};
