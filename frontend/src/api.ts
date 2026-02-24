// ============================================================================
// API SERVICE
// ============================================================================

const API_BASE = 'https://craveo-backend.onrender.com/api';

export const api = {
    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    },

    // Auth
    login: (email: string, password: string) =>
        api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name: string, email: string, password: string, address?: string) =>
        api.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, address }),
        }),
    verifyOtp: (email: string, otp: string) =>
        api.request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        }),
    resendOtp: (email: string) =>
        api.request('/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    // Products
    getProducts: () => api.request('/products'),
    getProduct: (id: string) => api.request(`/products/${id}`),

    // Orders
    createOrder: (items: { productId: string; quantity: number }[], deliveryAddress?: string) =>
        api.request('/orders', {
            method: 'POST',
            body: JSON.stringify({ items, deliveryAddress }),
        }),

    // Payment methods
    createPaymentOrder: (orderId: string, amount: number, currency?: string) =>
        api.request('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ orderId, amount, currency }),
        }),

    verifyPayment: (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
        api.request('/payments/verify', {
            method: 'POST',
            body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
        }),
    getPaymentStatus: (orderId: string) => api.request(`/payments/order/${orderId}`),

    // Admin Orders
    getAllOrders: () => api.request('/admin/orders'),
    getAdminOrder: (id: string) => api.request(`/admin/orders/${id}`),
    updateOrderStatus: (id: string, status: string) =>
        api.request(`/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    // Admin Products
    createProduct: (productData: FormData) =>
        api.request('/products', {
            method: 'POST',
            body: productData,
        }),
    updateProduct: (id: string, productData: FormData) =>
        api.request(`/products/${id}`, {
            method: 'PUT',
            body: productData,
        }),
    deleteProduct: (id: string) =>
        api.request(`/products/${id}`, {
            method: 'DELETE',
        }),
    getOrders: () => api.request('/orders'),
    getOrder: (id: string) => api.request(`/orders/${id}`),

    // Admin
    getDashboardStats: () => api.request('/metrics'),
    getUsers: () => api.request('/admin/users'),
    getAllOrder: () => api.request('/admin/orders'),

    generateEmbeddings: () =>
        api.request('/ai/generate-all-embeddings', {
            method: 'POST',
        }),

    // AI Features
    getRecommendations: (query?: string, limit?: number) => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (limit) params.append('limit', limit.toString());
        return api.request(`/ai/recommendations?${params}`);
    },
};
