const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

// Validar que la URL esté configurada en producción
if (typeof window !== 'undefined' && !API_BASE_URL.includes('localhost') && !API_BASE_URL.includes('railway') && !API_BASE_URL.includes('vercel')) {
  console.error('⚠️ NEXT_PUBLIC_API_URL no está configurada correctamente. Configura la variable en Vercel.');
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Error HTTP: ${response.status} ${response.statusText}` 
        }));
        const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        (error as any).error = errorData;
        throw error;
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red al conectar con el servidor');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const authApi = {
  login: (data: { username: string; password: string }) => apiClient.post<{ access_token: string; user: any }>('/auth/login', data),
  me: () => apiClient.get('/auth/me'),
};

export const productsApi = {
  getAll: () => apiClient.get('/products'),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.patch(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const categoriesApi = {
  getAll: () => apiClient.get('/categories'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  create: (data: any) => apiClient.post('/categories', data),
  update: (id: string, data: any) => apiClient.patch(`/categories/${id}`, data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

export const ordersApi = {
  getAll: (filters?: { status?: string; paymentStatus?: string; customerId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    const query = params.toString();
    return apiClient.get(`/orders${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get(`/orders/${id}`),
  getByOrderNumber: (orderNumber: string) => apiClient.get(`/orders/number/${orderNumber}`),
  updateStatus: (id: string, data: { status: string; paymentStatus?: string }) => 
    apiClient.patch(`/orders/${id}/status`, data),
};

export const customersApi = {
  getAll: (filters?: { search?: string; isActive?: boolean; city?: string; region?: string; dateFrom?: string; dateTo?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.city) params.append('city', filters.city);
    if (filters?.region) params.append('region', filters.region);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    const query = params.toString();
    return apiClient.get(`/customers${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get(`/customers/${id}`),
  getStats: () => apiClient.get('/customers/stats'),
  update: (id: string, data: any) => apiClient.patch(`/customers/${id}`, data),
  updateStatus: (id: string, isActive: boolean) => apiClient.patch(`/customers/${id}/status`, { isActive }),
};

export const statsApi = {
  getDashboardStats: () => apiClient.get('/stats/dashboard'),
  getSalesByPeriod: (days?: number) => apiClient.get(`/stats/sales-by-period${days ? `?days=${days}` : ''}`),
  getTopProducts: (limit?: number) => apiClient.get(`/stats/top-products${limit ? `?limit=${limit}` : ''}`),
  getOrdersByMonth: (months?: number) => apiClient.get(`/stats/orders-by-month${months ? `?months=${months}` : ''}`),
  getCustomersByMonth: (months?: number) => apiClient.get(`/stats/customers-by-month${months ? `?months=${months}` : ''}`),
};
