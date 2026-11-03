import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// 1. RATE LIMITING (In-Memory Sliding Window per IP + Route Bucket)
// ─────────────────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 60_000;

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  // Strict limit for authentication, password resets, and OTP verification
  auth: { windowMs: 60_000, maxRequests: 10 },
  // Strict limit for public unauthenticated write endpoints (contact, newsletter)
  public_write: { windowMs: 60_000, maxRequests: 8 },
  // Moderate limit for client-side audit logging
  audit: { windowMs: 60_000, maxRequests: 25 },
  // Default limit for general API calls
  default: { windowMs: 60_000, maxRequests: 90 },
};

export function getRateLimitTier(path: string, method: string): { bucket: string; config: RateLimitConfig } {
  const cleanPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (cleanPath.startsWith('auth/')) {
    return { bucket: 'auth', config: RATE_LIMIT_TIERS.auth };
  }
  if (
    cleanPath === 'contact' ||
    cleanPath.startsWith('newsletter/')
  ) {
    return { bucket: 'public_write', config: RATE_LIMIT_TIERS.public_write };
  }
  if (cleanPath === 'audit/log') {
    return { bucket: 'audit', config: RATE_LIMIT_TIERS.audit };
  }
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    return { bucket: 'write', config: { windowMs: 60_000, maxRequests: 30 } };
  }
  return { bucket: 'default', config: RATE_LIMIT_TIERS.default };
}

function cleanupRateLimitStore(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  const maxWindow = 120_000;
  for (const [key, entry] of rateLimitStore.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < maxWindow);
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(
  ip: string,
  bucket: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  cleanupRateLimitStore(now);

  const key = `${ip}:${bucket}`;
  const entry = rateLimitStore.get(key) || { timestamps: [] };

  // Keep only timestamps within current sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((config.windowMs - (now - oldestInWindow)) / 1000));
    rateLimitStore.set(key, entry);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.timestamps.push(now);
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: Math.max(0, config.maxRequests - entry.timestamps.length),
    retryAfterSeconds: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAFE CLIENT IP EXTRACTION & VALIDATION (Prevents Header SQLi & Spoofing)
// ─────────────────────────────────────────────────────────────────────────────

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const IPV6_REGEX = /^[0-9a-fA-F:]{2,45}$/;

export function isValidIp(ip: string): boolean {
  const trimmed = ip.trim();
  if (!trimmed || trimmed.length > 45) return false;
  return IPV4_REGEX.test(trimmed) || IPV6_REGEX.test(trimmed);
}

export function getClientIp(request: NextRequest): string {
  // Prefer platform-verified headers first
  const candidates = [
    request.headers.get('x-vercel-forwarded-for'),
    request.headers.get('cf-connecting-ip'),
    request.headers.get('x-real-ip'),
    request.headers.get('x-forwarded-for'),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const firstHop = raw.split(',')[0]?.trim();
    if (firstHop && isValidIp(firstHop)) {
      return firstHop;
    }
  }

  return '127.0.0.1';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCANNER & BOT USER-AGENT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

const SCANNER_UA_PATTERNS = [
  /sqlmap/i,
  /havij/i,
  /pangolin/i,
  /nikto/i,
  /acunetix/i,
  /netsparker/i,
  /nessus/i,
  /nuclei/i,
  /zgrab/i,
  /masscan/i,
  /nmap/i,
  /dirbuster/i,
  /gobuster/i,
  /feroxbuster/i,
  /ffuf/i,
  /wfuzz/i,
  /commix/i,
  /xsser/i,
  /dalfox/i,
  /burpcollaborator/i,
  /hydra/i,
  /medusa/i,
  /patator/i,
  /w3af/i,
  /arachni/i,
  /openvas/i,
];

export function isScannerUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return SCANNER_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. API ROUTE ALLOWLIST & PATH VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_API_ROUTES: Array<{ pattern: RegExp; methods: string[] }> = [
  // Auth
  {
    pattern: /^auth\/(login|register|logout|change-password|verify-phone|resend-phone-otp|verify-email|resend-email-otp|forgot-password|verify-otp|reset-password)$/,
    methods: ['POST'],
  },
  {
    pattern: /^auth\/delete$/,
    methods: ['DELETE', 'POST'],
  },
  // User profile
  {
    pattern: /^user$/,
    methods: ['GET'],
  },
  {
    pattern: /^user\/profile$/,
    methods: ['POST', 'PUT'],
  },
  // Dashboard
  {
    pattern: /^dashboard\/stats$/,
    methods: ['GET'],
  },
  // Payment methods
  {
    pattern: /^user-payment-methods$/,
    methods: ['GET', 'POST'],
  },
  {
    pattern: /^user-payment-methods\/\d+$/,
    methods: ['PUT', 'PATCH', 'DELETE'],
  },
  {
    pattern: /^payment-methods$/,
    methods: ['GET'],
  },
  // Wallet
  {
    pattern: /^wallet$/,
    methods: ['GET'],
  },
  {
    pattern: /^wallet\/withdraw$/,
    methods: ['POST'],
  },
  // Gift cards & rates
  {
    pattern: /^gift-cards(\/\d+\/rates)?$/,
    methods: ['GET'],
  },
  {
    pattern: /^rates(\/history)?$/,
    methods: ['GET'],
  },
  // Socials & settings
  {
    pattern: /^socials$/,
    methods: ['GET'],
  },
  {
    pattern: /^settings$/,
    methods: ['GET'],
  },
  // KYC
  {
    pattern: /^kyc\/status$/,
    methods: ['GET'],
  },
  {
    pattern: /^kyc\/submit$/,
    methods: ['POST'],
  },
  // Trades & trade messages
  {
    pattern: /^trades$/,
    methods: ['GET', 'POST'],
  },
  {
    pattern: /^trades\/[A-Za-z0-9_-]{1,64}$/,
    methods: ['GET'],
  },
  {
    pattern: /^trades\/[A-Za-z0-9_-]{1,64}\/messages$/,
    methods: ['GET', 'POST'],
  },
  {
    pattern: /^trades\/[A-Za-z0-9_-]{1,64}\/messages\/read$/,
    methods: ['POST'],
  },
  {
    pattern: /^trades\/[A-Za-z0-9_-]{1,64}\/messages\/\d+$/,
    methods: ['DELETE'],
  },
  // Newsletter & contact
  {
    pattern: /^newsletter\/subscribe$/,
    methods: ['POST'],
  },
  {
    pattern: /^newsletter\/(verify|unsubscribe)$/,
    methods: ['GET'],
  },
  {
    pattern: /^contact$/,
    methods: ['POST'],
  },
  // Push notification devices
  {
    pattern: /^devices$/,
    methods: ['POST'],
  },
  {
    pattern: /^devices\/[A-Za-z0-9._:-]{1,128}$/,
    methods: ['DELETE'],
  },
  // Notifications & settings
  {
    pattern: /^notifications$/,
    methods: ['GET'],
  },
  {
    pattern: /^notifications\/read-all$/,
    methods: ['POST'],
  },
  {
    pattern: /^notifications\/[A-Za-z0-9_-]{1,64}\/read$/,
    methods: ['POST'],
  },
  {
    pattern: /^notification-settings$/,
    methods: ['GET', 'POST', 'PUT'],
  },
  // Audit log
  {
    pattern: /^audit\/log$/,
    methods: ['POST'],
  },
  // Analytics & trends
  {
    pattern: /^trends\/(summary|volume|distribution|rates)$/,
    methods: ['GET'],
  },
];

export function isAllowedApiRoute(pathSegments: string[], method: string): boolean {
  if (!pathSegments || pathSegments.length === 0 || pathSegments.length > 6) {
    return false;
  }

  // Reject any segment with path traversal, null bytes, or encoded slashes
  for (const segment of pathSegments) {
    if (
      !segment ||
      segment === '.' ||
      segment === '..' ||
      segment.includes('..') ||
      segment.includes('\\') ||
      segment.includes('\0') ||
      /%2e|%2f|%5c|%00/i.test(segment)
    ) {
      return false;
    }
  }

  const joined = pathSegments.join('/');
  const upperMethod = method.toUpperCase();

  return ALLOWED_API_ROUTES.some(
    (route) => route.pattern.test(joined) && route.methods.includes(upperMethod)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SQL INJECTION, XSS, SSTI, PATH TRAVERSAL & COMMAND INJECTION DETECTOR
// ─────────────────────────────────────────────────────────────────────────────

function normalizeVariantsForInspection(raw: string): string[] {
  let decoded = raw;
  // Decode up to 2 layers of URL encoding to catch double-encoded SQLi/XSS
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(decoded.replace(/\+/g, ' '));
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  // Variant 1: comments replaced with space (catches UNION/**/SELECT)
  const spaceCollapsed = decoded.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\s+/g, ' ');
  // Variant 2: comments stripped completely (catches UN/**/ION SEL/**/ECT)
  const emptyCollapsed = decoded.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ');
  return spaceCollapsed === emptyCollapsed ? [spaceCollapsed] : [spaceCollapsed, emptyCollapsed];
}

const SQLI_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  // UNION SELECT / UNION ALL SELECT
  {
    name: 'sqli_union_select',
    regex: /\bunion\s+(?:all\s+)?select\b/i,
  },
  // Classic boolean tautologies: ' OR 1=1, ' OR '1'='1, " OR "a"="a, OR TRUE--
  {
    name: 'sqli_tautology',
    regex: /(?:['"`\s)]|\b)(?:or|and)\s+(?:['"`]?(\w+)['"`]?\s*=\s*['"`]?\1['"`]?|true|false|1\s*=\s*1|0\s*=\s*0)(?:\s*(?:--+|#|\/\*|$|\)|;))/i,
  },
  // Quote followed immediately by boolean/SQL clause and comment/operator
  {
    name: 'sqli_quote_boolean',
    regex: /['"`]\s*(?:or|and|having|group\s+by|order\s+by|union|select|insert|update|delete|drop)\s+[\w'"`(=]+\s*(?:--+|#|\/\*|;)/i,
  },
  // Stacked queries with DDL / DML keywords
  {
    name: 'sqli_stacked_query',
    regex: /;\s*(?:select|insert\s+into|update\s+\w+\s+set|delete\s+from|drop\s+(?:table|database|user|view|procedure)|alter\s+table|truncate\s+table|create\s+(?:table|user)|exec(?:ute)?\b|declare\s+@)/i,
  },
  // Time-based blind SQLi functions
  {
    name: 'sqli_time_blind',
    regex: /\b(?:sleep\s*\(\s*\d+|pg_sleep\s*\(\s*\d+|waitfor\s+delay\s+['"`]|benchmark\s*\(\s*\d+\s*,|dbms_pipe\.receive_message)/i,
  },
  // Error-based / XML / Subquery extraction functions
  {
    name: 'sqli_error_based',
    regex: /\b(?:extractvalue\s*\(|updatexml\s*\(|gtid_subset\s*\(|gtid_subtract\s*\(|xmltype\s*\(|utl_inaddr\.|utl_http\.)/i,
  },
  // System schema / catalog reconnaissance
  {
    name: 'sqli_schema_enum',
    regex: /\b(?:information_schema|performance_schema|mysql\.user|pg_catalog|pg_shadow|sqlite_master|sys\.tables|sys\.objects|sysobjects|syscolumns)\b/i,
  },
  // File system read/write via SQL
  {
    name: 'sqli_file_access',
    regex: /\b(?:load_file\s*\(|into\s+(?:out|dump)file\b)/i,
  },
  // SQL globals & char-encoding functions commonly used in payloads
  {
    name: 'sqli_system_vars',
    regex: /(?:@@(?:version|datadir|hostname|basedir|tmpdir)|(?:\bchar|\bchr)\s*\(\s*\d+(?:\s*,\s*\d+){2,}\s*\)|\bconcat_ws\s*\(|\bgroup_concat\s*\()/i,
  },
  // Comment-terminated quote injection (e.g. admin'--, '/*, ')--)
  {
    name: 'sqli_comment_termination',
    regex: /['"`]\s*\)?\s*(?:--(?:\s|$|\+)|#|$)/m,
  },
];

// Note: `sqli_comment_termination` only triggers when a quote is immediately followed by `-- ` or `--+`
const STRICT_COMMENT_TERMINATION = /['"`]\s*\)?\s*--(?:\s|\+|$)/;

const XSS_AND_INJECTION_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  // Script tags & JS protocol
  {
    name: 'xss_script_tag',
    regex: /<\s*\/?\s*script\b/i,
  },
  {
    name: 'xss_js_protocol',
    regex: /(?:javascript|vbscript|data\s*:\s*text\/html)\s*:/i,
  },
  // Dangerous HTML embeds
  {
    name: 'xss_dangerous_tag',
    regex: /<\s*(?:iframe|object|embed|applet|meta|base|form|svg|math)\b[^>]*>/i,
  },
  // Inline DOM event handlers
  {
    name: 'xss_event_handler',
    regex: /\bon(?:error|load|click|mouseover|mouseenter|focus|blur|submit|change|input|keydown|keyup|animationstart|transitionend|toggle|pointerenter)\s*=/i,
  },
  // Path traversal & LFI probes
  {
    name: 'path_traversal',
    regex: /(?:(?:\.\.\/|\.\.\\){2,}|\/etc\/(?:passwd|shadow|hosts)|\/proc\/self\/|(?:c:|\\windows)\\(?:win\.ini|system32))/i,
  },
  // Null byte injection
  {
    name: 'null_byte',
    regex: /(?:\x00|%00)/i,
  },
  // Log4j / JNDI / Server-Side Template Injection
  {
    name: 'ssti_or_jndi',
    regex: /(?:\$\{\s*(?:jndi|env|sys|lower|upper)\s*:|\{\{\s*(?:_self|config|app|request|7\s*\*\s*7)\b)/i,
  },
  // Shell command injection probes
  {
    name: 'cmd_injection',
    regex: /(?:;|\||&&|\$\()\s*(?:cat|ls|whoami|id|uname|wget|curl|nc|bash|sh|python|perl|php|nslookup|ping)\b/i,
  },
];

export interface InspectionResult {
  safe: boolean;
  reason?: string;
  field?: string;
}

export function detectMaliciousString(value: string, fieldName = 'input'): InspectionResult {
  if (!value || typeof value !== 'string') return { safe: true };

  // Check raw string for null bytes first
  if (value.includes('\0') || /%00/i.test(value)) {
    return { safe: false, reason: 'null_byte', field: fieldName };
  }

  const variants = normalizeVariantsForInspection(value);

  for (const normalized of variants) {
    for (const pattern of SQLI_PATTERNS) {
      if (pattern.name === 'sqli_comment_termination') {
        if (STRICT_COMMENT_TERMINATION.test(normalized)) {
          return { safe: false, reason: pattern.name, field: fieldName };
        }
        continue;
      }
      if (pattern.regex.test(normalized)) {
        return { safe: false, reason: pattern.name, field: fieldName };
      }
    }

    for (const pattern of XSS_AND_INJECTION_PATTERNS) {
      if (pattern.regex.test(normalized) || pattern.regex.test(value)) {
        return { safe: false, reason: pattern.name, field: fieldName };
      }
    }
  }

  return { safe: true };
}

const DANGEROUS_OBJECT_KEYS = new Set([
  '__proto__',
  'prototype',
  'constructor',
  '$where',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$ne',
  '$nin',
  '$in',
  '$regex',
  '$or',
  '$and',
  '$expr',
]);

export function inspectPayload(
  payload: unknown,
  pathPrefix = 'body',
  depth = 0
): InspectionResult {
  if (depth > 6) {
    return { safe: false, reason: 'excessive_nesting_depth', field: pathPrefix };
  }

  if (payload === null || payload === undefined) {
    return { safe: true };
  }

  if (typeof payload === 'string') {
    if (payload.length > 10_000) {
      return { safe: false, reason: 'field_too_long', field: pathPrefix };
    }
    return detectMaliciousString(payload, pathPrefix);
  }

  if (typeof payload === 'number') {
    if (!Number.isFinite(payload)) {
      return { safe: false, reason: 'invalid_number', field: pathPrefix };
    }
    return { safe: true };
  }

  if (typeof payload === 'boolean') {
    return { safe: true };
  }

  if (Array.isArray(payload)) {
    if (payload.length > 100) {
      return { safe: false, reason: 'array_too_large', field: pathPrefix };
    }
    for (let i = 0; i < payload.length; i++) {
      const res = inspectPayload(payload[i], `${pathPrefix}[${i}]`, depth + 1);
      if (!res.safe) return res;
    }
    return { safe: true };
  }

  if (typeof payload === 'object') {
    const entries = Object.entries(payload as Record<string, unknown>);
    if (entries.length > 50) {
      return { safe: false, reason: 'too_many_fields', field: pathPrefix };
    }
    for (const [key, val] of entries) {
      if (DANGEROUS_OBJECT_KEYS.has(key) || key.startsWith('$')) {
        return { safe: false, reason: 'dangerous_operator_key', field: `${pathPrefix}.${key}` };
      }
      const keyCheck = detectMaliciousString(key, `${pathPrefix}.key(${key})`);
      if (!keyCheck.safe) return keyCheck;

      const valCheck = inspectPayload(val, `${pathPrefix}.${key}`, depth + 1);
      if (!valCheck.safe) return valCheck;
    }
    return { safe: true };
  }

  return { safe: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENDPOINT-SPECIFIC VALIDATION & SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_REGEX = /^[+\d\s()-]{6,24}$/;

export function sanitizeText(input: string, maxLength = 1000): string {
  return input
    // Strip non-printable ASCII control chars except newline (\n), carriage return (\r), and tab (\t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim());
}

export interface EndpointValidationResult {
  valid: boolean;
  message?: string;
  sanitizedBody?: Record<string, unknown>;
}

export function validateEndpointBody(
  endpointPath: string,
  body: Record<string, unknown>
): EndpointValidationResult {
  const cleanPath = endpointPath.replace(/^\/+|\/+$/g, '').toLowerCase();

  // 1. Check Honeypot fields across all public forms
  if (
    (typeof body._hp === 'string' && body._hp.trim() !== '') ||
    (typeof body.website === 'string' && body.website.trim() !== '') ||
    (typeof body.company_url === 'string' && body.company_url.trim() !== '')
  ) {
    return { valid: false, message: 'Spam submission rejected.' };
  }

  // Strip honeypot keys before forwarding to backend
  const sanitized: Record<string, unknown> = { ...body };
  delete sanitized._hp;
  delete sanitized.website;
  delete sanitized.company_url;

  // 2. Contact form validation (/contact)
  if (cleanPath === 'contact') {
    const name = typeof sanitized.name === 'string' ? sanitizeText(sanitized.name, 120) : '';
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    const subject = typeof sanitized.subject === 'string' ? sanitizeText(sanitized.subject, 200) : 'General Inquiry';
    const content = typeof sanitized.content === 'string'
      ? sanitizeText(sanitized.content, 4000)
      : typeof sanitized.message === 'string'
      ? sanitizeText(sanitized.message, 4000)
      : '';

    if (!name || name.length < 2) {
      return { valid: false, message: 'Please provide a valid name (2–120 characters).' };
    }
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please provide a valid email address.' };
    }
    if (!content || content.length < 3) {
      return { valid: false, message: 'Please enter a message.' };
    }

    return {
      valid: true,
      sanitizedBody: { name, email, subject, content },
    };
  }

  // 3. Newsletter subscription (/newsletter/subscribe)
  if (cleanPath === 'newsletter/subscribe') {
    const name = typeof sanitized.name === 'string' ? sanitizeText(sanitized.name, 120) : '';
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    const phone = typeof sanitized.phone === 'string' ? sanitizeText(sanitized.phone, 24) : '';

    if (!name || name.length < 2) {
      return { valid: false, message: 'Please provide a valid name.' };
    }
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please provide a valid email address.' };
    }
    if (phone && !isValidPhone(phone)) {
      return { valid: false, message: 'Please provide a valid phone number.' };
    }

    return {
      valid: true,
      sanitizedBody: { name, email, ...(phone ? { phone } : {}) },
    };
  }

  // 4. Audit log (/audit/log) — frequent target for log injection / SQLi
  if (cleanPath === 'audit/log') {
    const event = typeof sanitized.event === 'string' ? sanitizeText(sanitized.event, 64) : '';
    const url = typeof sanitized.url === 'string' ? sanitizeText(sanitized.url, 500) : '';
    const userAgent = typeof sanitized.user_agent === 'string' ? sanitizeText(sanitized.user_agent, 300) : '';

    if (!event || !/^[a-zA-Z0-9_.: -]{1,64}$/.test(event)) {
      return { valid: false, message: 'Invalid audit event name.' };
    }

    return {
      valid: true,
      sanitizedBody: {
        event,
        url,
        user_agent: userAgent,
        properties:
          sanitized.properties && typeof sanitized.properties === 'object' && !Array.isArray(sanitized.properties)
            ? sanitized.properties
            : {},
      },
    };
  }

  // 5. Auth Login (/auth/login)
  if (cleanPath === 'auth/login') {
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    const password = typeof sanitized.password === 'string' ? sanitized.password : '';

    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please enter a valid email address.' };
    }
    if (!password || password.length > 256) {
      return { valid: false, message: 'Invalid password.' };
    }

    return {
      valid: true,
      sanitizedBody: { email, password },
    };
  }

  // 6. Auth Register (/auth/register)
  if (cleanPath === 'auth/register') {
    const name = typeof sanitized.name === 'string' ? sanitizeText(sanitized.name, 120) : '';
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    const phone_number = typeof sanitized.phone_number === 'string' ? sanitizeText(sanitized.phone_number, 24) : '';
    const country = typeof sanitized.country === 'string' ? sanitizeText(sanitized.country, 64) : '';
    const password = typeof sanitized.password === 'string' ? sanitized.password : '';
    const password_confirmation = typeof sanitized.password_confirmation === 'string' ? sanitized.password_confirmation : '';

    if (!name || name.length < 2) {
      return { valid: false, message: 'Please provide a valid full name.' };
    }
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please provide a valid email address.' };
    }
    if (!isValidPhone(phone_number)) {
      return { valid: false, message: 'Please provide a valid phone number.' };
    }
    if (!['Ghana', 'Nigeria'].includes(country)) {
      return { valid: false, message: 'Please select a valid country.' };
    }
    if (!password || password.length < 8 || password.length > 256) {
      return { valid: false, message: 'Password must be between 8 and 256 characters.' };
    }

    return {
      valid: true,
      sanitizedBody: {
        name,
        email,
        phone_number,
        country,
        password,
        password_confirmation,
      },
    };
  }

  // 7. Forgot / Reset Password
  if (cleanPath === 'auth/forgot-password') {
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    if (!isValidEmail(email)) {
      return { valid: false, message: 'Please provide a valid email address.' };
    }
    return { valid: true, sanitizedBody: { email } };
  }

  if (cleanPath === 'auth/reset-password') {
    const email = typeof sanitized.email === 'string' ? sanitizeText(sanitized.email, 254) : '';
    const token = typeof sanitized.token === 'string' ? sanitizeText(sanitized.token, 64) : '';
    const password = typeof sanitized.password === 'string' ? sanitized.password : '';
    const password_confirmation = typeof sanitized.password_confirmation === 'string' ? sanitized.password_confirmation : '';

    if (!isValidEmail(email) || !/^[A-Za-z0-9_-]{4,64}$/.test(token)) {
      return { valid: false, message: 'Invalid reset token or email address.' };
    }
    if (!password || password.length < 8 || password.length > 256) {
      return { valid: false, message: 'Password must be at least 8 characters.' };
    }
    return {
      valid: true,
      sanitizedBody: { email, token, password, password_confirmation },
    };
  }

  return { valid: true, sanitizedBody: sanitized };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ORIGIN / CSRF VERIFICATION FOR STATE-CHANGING REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

export function isTrustedOrigin(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  // Check Sec-Fetch-Site header if sent by modern browsers
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site' && secFetchSite !== 'none') {
    return false;
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return false;

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      return refererHost === host;
    } catch {
      return false;
    }
  }

  // Block state-changing proxy requests that omit both Origin and Referer
  return false;
}
