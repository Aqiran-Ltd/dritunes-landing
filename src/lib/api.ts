// In client-side, we now point to the Next.js API route (handled by middleware)
// which matches the path structure /api/v1...
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '/api/v1';
  // Server-side: use backend URL directly
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  return `${backendUrl}/api/v1`;
};

/**
 * Get the base URL of the backend (without /api/v1)
 * Used for resolving image paths
 */
export const getBackendBaseUrl = () => {
  // Use NEXT_PUBLIC_API_URL if available as it should be the source of truth for the API host
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  
  if (typeof window !== 'undefined') {
    if (apiUrl.startsWith('http')) {
      return apiUrl.split('/api/v1')[0].replace('://www.', '://');
    }
    // Robust fallback for production assets if env is missing or relative
    return 'https://admin.dritunesconsult.com';
  }
  
  // Server-side: use BACKEND_URL
  const backendUrl = process.env.BACKEND_URL || apiUrl || 'https://admin.dritunesconsult.com';
  return backendUrl.split('/api/v1')[0].replace('://www.', '://');
};

/**
 * Resolves a relative image path into an absolute URL
 */
export const resolveImageUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;
  
  const baseUrl = getBackendBaseUrl();
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

// We no longer need the key explicitly in client-side code, it's injected by middleware
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''; 

type RequestOptions = RequestInit & {
  token?: string;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...customConfig } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // On server side, we must inject the API key manually as we bypass middleware
  if (typeof window === 'undefined' && process.env.API_KEY) {
    (requestHeaders as any)['x-api-key'] = process.env.API_KEY;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: requestHeaders,
  };

  const response = await fetch(`${getBaseUrl()}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Something went wrong', data);
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, token?: string) => request<T>(endpoint, { method: 'GET', token }),
  post: <T>(endpoint: string, body: any, token?: string) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), token }),
  put: <T>(endpoint: string, body: any, token?: string) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), token }),
  delete: <T>(endpoint: string, token?: string, body?: any) => request<T>(endpoint, { method: 'DELETE', ...(body ? { body: JSON.stringify(body) } : {}), token }),
  postForm: async <T>(endpoint: string, formData: FormData, token?: string): Promise<T> => {
    const requestHeaders: any = {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (typeof window === 'undefined' && process.env.API_KEY) {
      requestHeaders['x-api-key'] = process.env.API_KEY;
    }
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Something went wrong', data);
    }
    return data as T;
  },
};
