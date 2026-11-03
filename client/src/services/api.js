const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const qs = searchParams.toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductById: (id) => request(`/products/${encodeURIComponent(id)}`),
  createProduct: (formDataOrJson) =>
    request('/products', {
      method: 'POST',
      body: formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson),
    }),
  updateProduct: (id, formDataOrJson) =>
    request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson),
    }),
  deleteProduct: (id) =>
    request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Owner Authentication
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),
  getMe: () => request('/auth/me'),

  // Manual Order Tracking (Admin Only)
  getOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${encodeURIComponent(id)}`),
  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateOrder: (id, payload) =>
    request(`/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Shop Settings (Opening Hours & Map config)
  getSettings: () => request('/settings'),
  updateSettings: (payload) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
