import { api } from '@/lib/api';

interface AuditProperties {
  [key: string]: any;
}

interface AuditPayload {
  event: string;
  url: string;
  user_agent: string;
  properties?: AuditProperties;
}

class AuditService {
  /**
   * Logs an event to the backend audit trail.
   * This is a fire-and-forget operation that will not throw errors to the UI.
   *
   * @param event - The name of the event (e.g., 'rate_check', 'whatsapp_click')
   * @param properties - Additional metadata to store
   */
  async log(event: string, properties?: AuditProperties): Promise<void> {
    try {
      // Basic checks for browser environment
      if (typeof window === 'undefined') return;

      // Use origin + pathname only so attacker-supplied query strings (e.g., SQLi probes
      // in URL parameters) or sensitive tokens (?token=...) are never written to audit_logs.
      const safeUrl = `${window.location.origin}${window.location.pathname}`.slice(0, 500);
      const safeEvent = event.replace(/[^a-zA-Z0-9_.: -]/g, '').slice(0, 64);
      if (!safeEvent) return;

      const payload: AuditPayload = {
        event: safeEvent,
        url: safeUrl,
        user_agent: (navigator.userAgent || '').slice(0, 300),
        properties,
      };

      const token = localStorage.getItem('access_token');
      
      // We use the existing API client which handles the x-api-key
      await api.post('/audit/log', payload, token || undefined);
    } catch (error) {
      // Fail silently in production, but warn in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Audit Log Failed:', error);
      }
    }
  }
}

export const audit = new AuditService();
