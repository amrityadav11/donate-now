import api from './api';

const productService = {
    // Get all products
    getProducts: async (params = {}) => {
        const { data } = await api.get('/products', { params });
        return data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    // Get product categories
    getProductCategories: async () => {
        const { data } = await api.get('/products/categories/list');
        return data;
    },

    // Create product (Admin only)
    createProduct: async (productData) => {
        const { data } = await api.post('/products', productData);
        return data;
    },

    // Update product (Admin only)
    updateProduct: async (id, productData) => {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    },

    // Delete product (Admin only)
    deleteProduct: async (id) => {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    },
};

export default productService;
