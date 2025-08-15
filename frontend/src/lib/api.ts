// API client utilities with automatic token handling

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Cookie utilities (same as in auth context)
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;
  
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if required and available
  if (requireAuth) {
    const token = getCookie('auth_token');
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  return fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });
}

// Convenience methods
export const api = {
  get: (endpoint: string, options?: ApiOptions) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: unknown, options?: ApiOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: unknown, options?: ApiOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: ApiOptions) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
    
  patch: (endpoint: string, data?: unknown, options?: ApiOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};