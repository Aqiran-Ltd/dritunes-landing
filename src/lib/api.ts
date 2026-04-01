// In client-side, we now point to the Next.js API route (handled by middleware)
// which matches the path structure /api/v1...
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '/api/v1';
  // Server-side: use backend URL directly
  const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  return `${backendUrl}/api/v1`;
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
  const { token, headers, body, ...customConfig } = options;

  const requestHeaders: HeadersInit = {
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(body instanceof FormData)) {
    (requestHeaders as any)['Content-Type'] = 'application/json';
  }

  // Inject Secure API Key (Server-side only, as client uses proxy)
  if (typeof window === 'undefined' && process.env.API_KEY) {
    (requestHeaders as any)['x-api-key'] = process.env.API_KEY;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: requestHeaders,
    body,
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
  postForm: <T>(endpoint: string, formData: FormData, token?: string) => request<T>(endpoint, { method: 'POST', body: formData, token }),
  put: <T>(endpoint: string, body: any, token?: string) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), token }),
  delete: <T>(endpoint: string, token?: string, body?: any) => request<T>(endpoint, { method: 'DELETE', ...(body ? { body: JSON.stringify(body) } : {}), token }),
};
