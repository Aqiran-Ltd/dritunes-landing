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

export type VerifyChannel = 'phone' | 'email';

/** A sign-up whose codes are out but whose account does not exist yet. */
export interface PendingRegistration {
  registration_id: string;
  email: string;
  phone_number: string;
  verified: Record<VerifyChannel, boolean>;
}

const PENDING_KEY = 'pending_registration';

function readPending(): PendingRegistration | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePending(value: PendingRegistration | null) {
  try {
    if (value) sessionStorage.setItem(PENDING_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable: the in-memory copy still works for this page */
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  needsVerification: boolean;
  pendingRegistration: PendingRegistration | null;
  verifyRegistration: (channel: VerifyChannel, token: string) => Promise<void>;
  resendRegistrationOtp: (channel: VerifyChannel) => Promise<void>;
  cancelRegistration: () => void;
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
  const [pendingRegistration, setPendingRegistration] = useState<PendingRegistration | null>(null);

  // Restore a sign-up in progress (survives a refresh, not a closed tab).
  useEffect(() => {
    setPendingRegistration(readPending());
  }, []);

  const setPending = (value: PendingRegistration | null) => {
    writePending(value);
    setPendingRegistration(value);
  };

  // Both the email and the phone must be verified. A property that is explicitly null is
  // unverified; undefined (backend didn't send it) is treated as verified so we never lock
  // someone out over a missing field.
  const needsVerification = React.useMemo(() => {
      if (!user) return false;
      return user.phone_verified_at === null || user.email_verified_at === null;
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
         // Accounts that still have an unverified email or phone must finish that first.
         const unverified = userData.phone_verified_at === null || userData.email_verified_at === null;
         router.push(unverified ? '/auth/otp' : '/dashboard');
      } else {
         console.error('Failed to parse user data:', response);
         throw new Error('Failed to fetch user details.');
      }

    } else {
       throw new Error(response.message || 'Login failed');
    }
  };

  // Signing up does not create an account. The backend validates the details, parks them and
  // sends a code to the email and the phone; the account (and the session) only exists once
  // both have been confirmed.
  const register = async (data: any) => {
    const response: any = await api.post('/auth/register', data);
    if (response.status && response.data?.registration_id) {
      setPending({
        registration_id: response.data.registration_id,
        email: response.data.email,
        phone_number: response.data.phone_number,
        verified: response.data.verified ?? { email: false, phone: false },
      });
      router.push('/auth/otp');
    } else {
        const error = new Error(response.message || 'Registration failed');
        (error as any).data = response.errors;
        throw error;
    }
  };

  const cancelRegistration = () => setPending(null);

  const verifyRegistration = async (channel: VerifyChannel, token: string) => {
    if (!pendingRegistration) throw new Error('Your sign-up has expired. Please start again.');

    let response: any;
    try {
      response = await api.post('/auth/register/verify', {
        registration_id: pendingRegistration.registration_id,
        channel,
        token,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 410) setPending(null);
      throw err;
    }

    if (!response.status) throw new Error(response.message || 'Verification failed');

    if (!response.data?.complete) {
      setPending({ ...pendingRegistration, verified: response.data?.verified ?? { ...pendingRegistration.verified, [channel]: true } });
      return;
    }

    // Both confirmed: the account now exists and we are signed in.
    const accessToken = response.data.access_token;
    localStorage.setItem('access_token', accessToken);

    let userData = response.data.user ?? null;
    try {
      const userResponse: any = await api.get('/user', accessToken);
      userData = userResponse.data ?? userResponse.user ?? (userResponse.id ? userResponse : userData);
    } catch (fetchErr) {
      console.warn('Could not fetch user profile after registration:', fetchErr);
    }

    setPending(null);
    if (userData) setUser(userData);
    toast.success('Account created successfully!');
    router.push('/dashboard');
  };

  const resendRegistrationOtp = async (channel: VerifyChannel) => {
    if (!pendingRegistration) throw new Error('Your sign-up has expired. Please start again.');
    await api.post('/auth/register/resend', { registration_id: pendingRegistration.registration_id, channel });
    toast.success('Code sent');
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, needsVerification, pendingRegistration, verifyRegistration, resendRegistrationOtp, cancelRegistration, isLoading, login, register, logout, updateUser, verifyOtp, resendOtp, forgotPassword, resetPassword }}>
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
