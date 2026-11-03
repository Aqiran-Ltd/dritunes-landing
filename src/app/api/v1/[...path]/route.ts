import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  detectMaliciousString,
  getClientIp,
  getRateLimitTier,
  inspectPayload,
  isAllowedApiRoute,
  isScannerUserAgent,
  isTrustedOrigin,
  isValidEmail,
  isValidPhone,
  normalizePhone,
  sanitizeText,
  validateEndpointBody,
} from '@/lib/security';

type Props = {
  params: Promise<{ path: string[] }>;
};

const MAX_JSON_BODY_BYTES = 64 * 1024; // 64 KB max for JSON payloads
const MAX_UPLOAD_BODY_BYTES = 25 * 1024 * 1024; // 25 MB max for multipart uploads

const ALLOWED_UPLOAD_PATHS = [
  /^trades$/,
  /^trades\/[A-Za-z0-9_-]{1,64}\/messages$/,
  /^user\/profile$/,
  /^kyc\/submit$/,
];

const ALLOWED_FILE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

const DANGEROUS_FILE_EXTENSIONS = /\.(?:php\d*|phtml|phar|htaccess|sh|bash|pl|py|rb|cgi|asp|aspx|jsp|exe|dll|bat|cmd|msi|js|mjs|html|htm|xhtml|svg|xml)(?:\.|$)/i;

export async function GET(request: NextRequest, props: Props) {
  const params = await props.params;
  return handleRequest(request, params);
}

export async function POST(request: NextRequest, props: Props) {
  const params = await props.params;
  return handleRequest(request, params);
}

export async function PUT(request: NextRequest, props: Props) {
  const params = await props.params;
  return handleRequest(request, params);
}

export async function PATCH(request: NextRequest, props: Props) {
  const params = await props.params;
  return handleRequest(request, params);
}

export async function DELETE(request: NextRequest, props: Props) {
  const params = await props.params;
  return handleRequest(request, params);
}

async function handleRequest(request: NextRequest, params: { path: string[] }) {
  const method = request.method.toUpperCase();
  const pathSegments = params.path || [];
  const path = pathSegments.join('/');
  const clientIp = getClientIp(request);
  const rawUserAgent = request.headers.get('user-agent') || '';

  // 1. Block automated vulnerability / SQLi scanners by User-Agent
  if (isScannerUserAgent(rawUserAgent)) {
    console.warn(`[Security] Blocked scanner User-Agent from ${clientIp} on ${method} /api/v1/${path}`);
    return NextResponse.json(
      { status: false, message: 'Forbidden' },
      { status: 403 }
    );
  }

  // 2. Enforce Origin / Referer verification on state-changing requests (CSRF & Bot defense)
  if (!isTrustedOrigin(request)) {
    console.warn(`[Security] Blocked untrusted origin from ${clientIp} on ${method} /api/v1/${path}`);
    return NextResponse.json(
      { status: false, message: 'Forbidden: Untrusted request origin.' },
      { status: 403 }
    );
  }

  // 3. Enforce strict API route and HTTP method allowlist (prevents path traversal & endpoint probing)
  if (!isAllowedApiRoute(pathSegments, method)) {
    console.warn(`[Security] Blocked disallowed route from ${clientIp}: ${method} /api/v1/${path}`);
    return NextResponse.json(
      { status: false, message: 'Endpoint not found.' },
      { status: 404 }
    );
  }

  // 4. Enforce per-IP & per-tier sliding-window rate limiting
  const { bucket, config: rateConfig } = getRateLimitTier(path, method);
  const rateLimit = checkRateLimit(clientIp, bucket, rateConfig);
  if (!rateLimit.allowed) {
    console.warn(`[Security] Rate limit exceeded (${bucket}) from ${clientIp} on ${method} /api/v1/${path}`);
    return NextResponse.json(
      { status: false, message: 'Too many requests. Please slow down and try again in a moment.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // 5. Inspect all URL query parameters for SQL injection, XSS, and path traversal
  const sanitizedSearchParams = new URLSearchParams();
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    if (key.length > 64 || value.length > 512) {
      return NextResponse.json(
        { status: false, message: 'Query parameter exceeds maximum length.' },
        { status: 400 }
      );
    }

    const keyCheck = detectMaliciousString(key, `query.key(${key})`);
    if (!keyCheck.safe) {
      console.warn(`[Security] Blocked malicious query key (${keyCheck.reason}) from ${clientIp} on /api/v1/${path}`);
      return NextResponse.json(
        { status: false, message: 'Invalid query parameter.' },
        { status: 400 }
      );
    }

    const valCheck = detectMaliciousString(value, `query.${key}`);
    if (!valCheck.safe) {
      console.warn(`[Security] Blocked malicious query value (${valCheck.reason} in ${key}) from ${clientIp} on /api/v1/${path}`);
      return NextResponse.json(
        { status: false, message: 'Invalid characters in query parameter.' },
        { status: 400 }
      );
    }

    // Specific validation for email query parameter on newsletter verify/unsubscribe
    if (key === 'email' && !isValidEmail(value)) {
      return NextResponse.json(
        { status: false, message: 'Invalid email parameter.' },
        { status: 400 }
      );
    }

    sanitizedSearchParams.append(key, sanitizeText(value, 512));
  }

  // 6. Inspect User-Agent for SQLi / XSS (protects backend audit logs that record User-Agent)
  const uaCheck = detectMaliciousString(rawUserAgent, 'header.user-agent');
  const safeUserAgent = uaCheck.safe ? sanitizeText(rawUserAgent, 300) : 'Mozilla/5.0 (compatible)';

  // 7. Validate & Inspect Request Body (for POST, PUT, PATCH, DELETE)
  let outboundBody: BodyInit | null = null;
  const contentType = (request.headers.get('content-type') || '').toLowerCase();
  const contentLength = Number(request.headers.get('content-length') || '0');

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const isMultipart = contentType.includes('multipart/form-data');

    if (isMultipart) {
      // Ensure multipart uploads are only permitted on designated upload routes
      const uploadAllowed = ALLOWED_UPLOAD_PATHS.some((rx) => rx.test(path));
      if (!uploadAllowed) {
        return NextResponse.json(
          { status: false, message: 'File uploads are not permitted on this endpoint.' },
          { status: 400 }
        );
      }

      if (contentLength > MAX_UPLOAD_BODY_BYTES) {
        return NextResponse.json(
          { status: false, message: 'Upload size exceeds the 25MB limit.' },
          { status: 413 }
        );
      }

      let incomingForm: FormData;
      try {
        incomingForm = await request.formData();
      } catch {
        return NextResponse.json(
          { status: false, message: 'Malformed multipart form data.' },
          { status: 400 }
        );
      }

      const outgoingForm = new FormData();
      let fileCount = 0;
      const isProfileRoute = path === 'user/profile';
      const isTradeStoreRoute = path === 'trades';

      for (const [fieldKey, fieldValue] of incomingForm.entries()) {
        const keyCheck = detectMaliciousString(fieldKey, `form.key(${fieldKey})`);
        if (!keyCheck.safe) {
          console.warn(`[Security] Blocked malicious FormData key (${keyCheck.reason}) from ${clientIp}`);
          return NextResponse.json(
            { status: false, message: 'Invalid form field.' },
            { status: 400 }
          );
        }

        if (typeof fieldValue === 'string') {
          const valCheck = detectMaliciousString(fieldValue, `form.${fieldKey}`);
          if (!valCheck.safe) {
            console.warn(`[Security] Blocked malicious FormData value (${valCheck.reason} in ${fieldKey}) from ${clientIp}`);
            return NextResponse.json(
              { status: false, message: 'Invalid input detected in form submission.' },
              { status: 400 }
            );
          }

          if (isProfileRoute && fieldKey === 'phone_number') {
            const normalizedPhone = normalizePhone(fieldValue);
            if (!isValidPhone(normalizedPhone)) {
              return NextResponse.json(
                { status: false, message: 'Phone number must be 9 to 15 digits (optional leading +).' },
                { status: 422 }
              );
            }
            outgoingForm.append(fieldKey, normalizedPhone);
          } else if (isProfileRoute && fieldKey === 'country') {
            const cleanCountry = sanitizeText(fieldValue, 64);
            if (!['Ghana', 'Nigeria'].includes(cleanCountry)) {
              return NextResponse.json(
                { status: false, message: 'Country must be Ghana or Nigeria.' },
                { status: 422 }
              );
            }
            outgoingForm.append(fieldKey, cleanCountry);
          } else {
            outgoingForm.append(fieldKey, sanitizeText(fieldValue, 4000));
          }
        } else if (fieldValue instanceof File) {
          fileCount++;
          if (isTradeStoreRoute && fileCount > 10) {
            return NextResponse.json(
              { status: false, message: 'A maximum of 10 image attachments is allowed per trade.' },
              { status: 422 }
            );
          }

          const maxFileSize = isProfileRoute
            ? 2 * 1024 * 1024 // 2MB for profile_picture
            : isTradeStoreRoute
            ? 5 * 1024 * 1024 // 5MB per trade attachment
            : 20 * 1024 * 1024; // 20MB for trade chat messages

          if (fieldValue.size > maxFileSize) {
            return NextResponse.json(
              {
                status: false,
                message: `Attached file exceeds the ${Math.round(maxFileSize / (1024 * 1024))}MB limit.`,
              },
              { status: 413 }
            );
          }

          const mime = fieldValue.type.toLowerCase();
          const imageOnlyRequired = isProfileRoute || isTradeStoreRoute;
          const isAllowedMime = imageOnlyRequired
            ? mime.startsWith('image/') && ALLOWED_FILE_MIME_TYPES.has(mime)
            : ALLOWED_FILE_MIME_TYPES.has(mime);

          if (DANGEROUS_FILE_EXTENSIONS.test(fieldValue.name) || !isAllowedMime) {
            console.warn(
              `[Security] Blocked disallowed file upload (${fieldValue.name}, ${fieldValue.type}) from ${clientIp}`
            );
            return NextResponse.json(
              { status: false, message: 'Unsupported or unsafe file type.' },
              { status: 400 }
            );
          }
          outgoingForm.append(fieldKey, fieldValue, sanitizeText(fieldValue.name, 120));
        }
      }

      outboundBody = outgoingForm;
    } else {
      // Standard JSON body handling
      if (contentLength > MAX_JSON_BODY_BYTES) {
        return NextResponse.json(
          { status: false, message: 'Request payload is too large.' },
          { status: 413 }
        );
      }

      const rawText = await request.text();
      if (Buffer.byteLength(rawText, 'utf8') > MAX_JSON_BODY_BYTES) {
        return NextResponse.json(
          { status: false, message: 'Request payload is too large.' },
          { status: 413 }
        );
      }

      if (rawText.trim().length > 0) {
        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(rawText);
        } catch {
          return NextResponse.json(
            { status: false, message: 'Invalid JSON payload.' },
            { status: 400 }
          );
        }

        // Deep WAF inspection for SQLi, XSS, NoSQLi, and prototype pollution
        const inspection = inspectPayload(parsedJson);
        if (!inspection.safe) {
          console.warn(
            `[Security] Blocked malicious payload (${inspection.reason} at ${inspection.field}) from ${clientIp} on ${method} /api/v1/${path}`
          );
          return NextResponse.json(
            { status: false, message: 'Request rejected due to invalid or unsafe input.' },
            { status: 400 }
          );
        }

        // Endpoint-specific schema validation & sanitization
        if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
          const validation = validateEndpointBody(path, parsedJson as Record<string, unknown>);
          if (!validation.valid) {
            return NextResponse.json(
              { status: false, message: validation.message || 'Invalid input.' },
              { status: 422 }
            );
          }
          outboundBody = JSON.stringify(validation.sanitizedBody ?? parsedJson);
        } else {
          outboundBody = JSON.stringify(parsedJson);
        }
      }
    }
  }

  // 8. Construct Clean, Minimal Outbound Headers (never forward spoofed client headers)
  const outboundHeaders = new Headers();
  outboundHeaders.set('Accept', 'application/json');
  outboundHeaders.set('User-Agent', safeUserAgent);
  outboundHeaders.set('X-Forwarded-For', clientIp);
  outboundHeaders.set('X-Real-IP', clientIp);

  const authHeader = request.headers.get('authorization');
  if (authHeader && /^Bearer\s+[A-Za-z0-9._~+/-]+=*$/i.test(authHeader.trim()) && authHeader.length < 2048) {
    outboundHeaders.set('Authorization', authHeader.trim());
  }

  // Set Content-Type only for JSON; fetch() sets multipart boundary automatically for FormData
  if (outboundBody && typeof outboundBody === 'string') {
    outboundHeaders.set('Content-Type', 'application/json');
  }

  const apiKey = process.env.API_KEY;
  if (apiKey) {
    outboundHeaders.set('x-api-key', apiKey);
  }

  // 9. Forward the Verified Request to the Backend
  const backendBase = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
  const queryString = sanitizedSearchParams.toString();
  const targetUrl = `${backendBase}/api/v1/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: outboundHeaders,
      body: outboundBody,
      cache: 'no-store',
      redirect: 'manual',
    });

    // Only forward safe response headers back to the client
    const responseHeaders = new Headers();
    const incomingContentType = response.headers.get('content-type');
    if (incomingContentType) {
      responseHeaders.set('Content-Type', incomingContentType);
    }
    responseHeaders.set('X-Content-Type-Options', 'nosniff');
    responseHeaders.set('X-Frame-Options', 'DENY');
    responseHeaders.set('Cache-Control', 'no-store, max-age=0');
    responseHeaders.set('X-RateLimit-Remaining', String(rateLimit.remaining));

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy Error [${method} /api/v1/${path}]:`, error);
    return NextResponse.json(
      { status: false, message: 'Service temporarily unavailable.' },
      { status: 502 }
    );
  }
}
