import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only intercept requests to /api/v1
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    
    // Construct the backend URL
    // Default to localhost for dev, but can be overridden by BACKEND_URL env var
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    
    // Create the destination URL
    // e.g. /api/v1/user -> http://127.0.0.1:8000/api/v1/user
    const targetUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, backendUrl);
    
    // Create headers to forward
    const requestHeaders = new Headers(request.headers);
    
    // Inject the secure API key
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        requestHeaders.set('x-api-key', apiKey);
    }
    
    // We are actually proxying here. Next.js Middleware 'rewrite' keeps the URL in the browser
    // but fetches from the target server-side.
    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: '/api/v1/:path*',
};
