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

      const payload: AuditPayload = {
        event,
        url: window.location.href,
        user_agent: navigator.userAgent,
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
