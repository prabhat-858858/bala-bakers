const getApiBase = () => {
  let raw = import.meta.env.VITE_API_BASE_URL || '/api';
  raw = raw.trim().replace(/\/+$/, '');
  // If an external URL was provided without trailing /api, automatically append /api
  if (raw.startsWith('http') && !raw.endsWith('/api')) {
    raw = `${raw}/api`;
  }
  return raw;
};

const API_BASE = getApiBase();

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  // Support Bearer token header fallback alongside HTTP-only cookies
  const token = localStorage.getItem('bela_admin_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.toLowerCase().includes('fetch')) {
      throw new Error(
        `Unable to reach backend API at ${API_BASE}. If using Render free tier, the server may take 30-50 seconds to wake up from idle. Please check VITE_API_BASE_URL on Vercel and ensure Render is live.`
      );
    }
    throw error;
  }
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
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('bela_admin_token', data.token);
    }
    return data;
  },
  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('bela_admin_token');
    }
  },
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
