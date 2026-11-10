'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError, SESSION_ENDED_EVENT, type SessionEndReason } from '@/lib/api';
import { getDeviceId, getDeviceMeta } from '@/lib/device';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  country?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  phone_verified_at?: string | null;
  email_verified_at?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  needsVerification: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  verifyOtp: (token: string, type: 'phone' | 'email') => Promise<void>;
  resendOtp: (type: 'phone' | 'email') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const loggingOut = React.useRef(false);

  // Derived state for verification
  // If property is explicitly null, they need verification.
  // If property is undefined (backend doesn't send it), assume verified to avoid blocking.
  const needsVerification = React.useMemo(() => {
      if (!user) return false;
      return user.phone_verified_at === null; 
  }, [user]);

  // Load token and user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response: any = await api.get('/user', token);
          console.log('Load User Response:', response); // Debug log

          if (response.status && response.data) {
            setUser(response.data);
          } else if (response.data) {
             // Handle standard Laravel Resource { data: ... }
             setUser(response.data);
          } else if (response.user) {
             // Handle { user: ... } format
             setUser(response.user);
          } else if (response.id) {
             setUser(response);
          } else {
             console.error('Unexpected user response format:', response);
             localStorage.removeItem('access_token');
          }
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // The API client reports a dead session (expired token, suspended account):
  // drop the token and send the user to sign in again, once.
  useEffect(() => {
    const onSessionEnded = (e: Event) => {
      if (loggingOut.current || !localStorage.getItem('access_token')) return; // already signing out
      const reason = (e as CustomEvent<SessionEndReason>).detail;
      localStorage.removeItem('access_token');
      setUser(null);
      toast.error(
        reason === 'suspended'
          ? 'Your account has been suspended. Please contact support.'
          : 'Your session has expired. Please sign in again.',
        { id: 'session-ended' }
      );
      router.push('/auth/login');
    };
    window.addEventListener(SESSION_ENDED_EVENT, onSessionEnded);
    return () => window.removeEventListener(SESSION_ENDED_EVENT, onSessionEnded);
  }, [router]);

  const login = async (credentials: any) => {
    // Note: Toasts are handled in the components for login/register to allow for loading states
    const response: any = await api.post('/auth/login', credentials);
    if (response.status) {
      const token = response.data?.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
      }
      
      let userData = response.data?.user ?? null;
      if (token) {
        try {
          const userResponse: any = await api.get('/user', token);
          if (userResponse.status && userResponse.data) {
            userData = userResponse.data;
          } else if (userResponse.data) {
            userData = userResponse.data;
          } else if (userResponse.user) {
            userData = userResponse.user;
          } else if (userResponse.id) {
            userData = userResponse;
          }
        } catch (fetchErr) {
          console.warn('Could not fetch user profile after login:', fetchErr);
        }
      }

      if (userData) {
         setUser(userData);
         // Redirect to dashboard regardless of verification status
         // The VerificationBanner in the dashboard will warn them
         router.push('/dashboard');
      } else {
         console.error('Failed to parse user data:', response);
         throw new Error('Failed to fetch user details.');
      }

    } else {
       throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    // Note: Toasts are handled in the components
    const response: any = await api.post('/auth/register', data);
    if (response.status) {
      const token = response.data?.access_token;
      if (token) {
        localStorage.setItem('access_token', token);
      }
      
      let userData = response.data?.user ?? null;
      if (token) {
        try {
          const userResponse: any = await api.get('/user', token);
          if (userResponse.status && userResponse.data) {
            userData = userResponse.data;
          } else if (userResponse.data) {
            userData = userResponse.data;
          } else if (userResponse.user) {
            userData = userResponse.user;
          } else if (userResponse.id) {
            userData = userResponse;
          }
        } catch (fetchErr) {
          console.warn('Could not fetch user profile after registration:', fetchErr);
        }
      }

      if (userData) {
        setUser(userData);
      }

      // Redirect to verification page
      router.push('/auth/otp');
    } else {
        const error = new Error(response.message || 'Registration failed');
        (error as any).data = response.errors;
        throw error;
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    loggingOut.current = true;
    const token = localStorage.getItem('access_token');
    if (token) {
      // Stop pushes to this browser while signed out, but KEEP the device record and
      // the local device_id (needed for history / blocking): re-register the same
      // device with no push token instead of deleting it. The next login's
      // registration (NotificationContext) stores a token again.
      try {
        await api.post('/devices', {
          device_id: getDeviceId(),
          type: 'web',
          fcm_token: null,
          meta_data: getDeviceMeta(),
        }, token);
      } catch (error) {
        console.error('Failed to clear device push token', error);
      }
      try {
        await api.post('/auth/logout', {}, token);
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error('Logout failed', error);
        }
      }
    }
    localStorage.removeItem('access_token');
    setUser(null);
    toast.success('Logged out successfully');
    loggingOut.current = false;
    router.push('/auth/login');
  };

  const verifyOtp = async (token: string, type: 'phone' | 'email') => {
      // Correct endpoints based on type
      const endpoint = type === 'phone' ? '/auth/verify-phone' : '/auth/verify-email';
      const accessToken = localStorage.getItem('access_token');
      
      // Both endpoints expect just the token in the body (authentication is via Bearer)
      const payload = { token };
      
      const response: any = await api.post(endpoint, payload, accessToken || undefined);
      
      if (response.status) {
          // Refresh user data to update verification status
          const userResponse: any = await api.get('/user', accessToken || '');
           
           let validUser = null;
           if (userResponse.status && userResponse.data) {
               validUser = userResponse.data;
           } else if (userResponse.data) {
               validUser = userResponse.data;
           } else if (userResponse.user) {
               validUser = userResponse.user;
           } else if (userResponse.id) {
               validUser = userResponse;
           }

           if (validUser) {
               setUser(validUser);
               return validUser;
           }
           
           // Return nothing if parsing failed (tho setUser won't update)
           return;
      } else {
          throw new Error(response.message || 'Verification failed');
      }
  }

  const resendOtp = async (type: 'phone' | 'email') => {
       const endpoint = type === 'phone' ? '/auth/resend-phone-otp' : '/auth/resend-email-otp';
       const accessToken = localStorage.getItem('access_token');

       try {
           await api.post(endpoint, {}, accessToken || undefined);
           toast.success('OTP resent successfully');
       } catch (err: any) {
           toast.error(err.message || 'Failed to resend OTP');
       }
  }

  const forgotPassword = async (email: string) => {
      try {
          await api.post('/auth/forgot-password', { email });
          toast.success("If an account exists for that email, we've sent a reset code.");
      } catch (err: any) {
          toast.error(err.message || 'Failed to send reset code');
          throw err;
      }
  };

  const resetPassword = async (data: any) => {
      try {
          const response: any = await api.post('/auth/reset-password', data);
          if (response.status) {
             toast.success('Password reset successfully! You can now login.');
             router.push('/auth/login');
          } else {
             throw new Error(response.message || 'Failed to reset password');
          }
      } catch (err: any) {
          toast.error(err.message || 'Failed to reset password');
          throw err;
      }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, needsVerification, isLoading, login, register, logout, updateUser, verifyOtp, resendOtp, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
