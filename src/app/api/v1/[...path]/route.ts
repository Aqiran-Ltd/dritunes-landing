import { NextRequest, NextResponse } from 'next/server';

// Handle all HTTP methods
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params);
}

async function handleRequest(request: NextRequest, params: { path: string[] }) {
  // 1. Construct the Backend URL
  // Join the path segments (e.g., ['auth', 'login'] -> 'auth/login')
  const path = params.path.join('/');
  const queryString = request.nextUrl.search; // Includes '?'
  
  const backendBase = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
  const targetUrl = `${backendBase}/api/v1/${path}${queryString}`;

  // 2. Prepare Headers
  const headers = new Headers(request.headers);
  
  // Remove host header to avoid issues with backend
  headers.delete('host');
  
  // Inject Secure API Key
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    headers.set('x-api-key', apiKey);
  }

  // 3. Create Request Body (if applicable)
  // We need to read the body for POST/PUT/PATCH
  let body: BodyInit | null = null;
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
     // Be careful with body streams. 
     // For typical JSON/FormData, we can pass the blob or arrayBuffer.
     const blob = await request.blob();
     if (blob.size > 0) {
        body = blob;
     }
  }

  // 4. Forward the Request
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      // cache: 'no-store' // Do not cache API responses by default
    });

    // 5. Return the Response
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

  } catch (error) {
    console.error(`Proxy Error [${request.method} ${path}]:`, error);
    return NextResponse.json(
      { status: false, message: 'Internal Proxy Error' },
      { status: 500 }
    );
  }
}
