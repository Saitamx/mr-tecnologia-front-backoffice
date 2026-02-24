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
