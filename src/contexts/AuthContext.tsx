'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  country?: string;
  phone_verified_at?: string | null;
  email_verified_at?: string | null;
  kyc_status?: 'pending' | 'verified' | 'approved' | 'rejected' | 'unsubmitted';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  needsVerification: boolean;
  kycStatus: 'pending' | 'verified' | 'approved' | 'rejected' | 'unsubmitted';
  kycData: any | null;
  isLoading: boolean;
  checkKycStatus: () => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (token: string, type: 'phone' | 'email') => Promise<void>;
  resendOtp: (type: 'phone' | 'email') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'approved' | 'rejected' | 'unsubmitted'>('unsubmitted');
  const [kycData, setKycData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

    loadUser();    loadUser();
  }, []);

  const checkKycStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
          const response: any = await api.get('/kyc/status', token);
          console.log('KYC Status Response:', response); 

          // Check if response has the expected fields directly
          if (response && response.verification_status) {
             setKycStatus(response.verification_status);
             setKycData(response.verification_details || null);
          } else if (response && response.status && response.data) {
             // Fallback for wrapped response
             const data = response.data;
             setKycStatus(data.verification_status || 'unsubmitted');
             setKycData(data.verification_details || null);
          } else {
             // Implicitly unsubmitted or empty
             // setKycStatus('unsubmitted');
          }
      } catch (error) {
          console.error('Failed to check KYC status', error);
      }
  };

  useEffect(() => {
      if (user) {
          checkKycStatus();
      }
  }, [user]);

  const login = async (credentials: any) => {
    const response: any = await api.post('/auth/login', credentials);
    if (response.status) {
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      
      
      // Fetch user details immediately
      const userResponse: any = await api.get('/user', token);
      console.log('Login User Fetch Response:', userResponse); // Debug log
      
      let userData = null;
      if (userResponse.status && userResponse.data) {
         userData = userResponse.data;
      } else if (userResponse.data) {
         userData = userResponse.data;
      } else if (userResponse.user) {
         userData = userResponse.user;
      } else if (userResponse.id) {
         userData = userResponse;
      }

      if (userData) {
         setUser(userData);
         // Redirect to dashboard regardless of verification status
         // The VerificationBanner in the dashboard will warn them
         router.push('/dashboard');
      } else {
         console.error('Failed to parse user data:', userResponse);
         throw new Error('Failed to fetch user details.');
      }

    } else {
       throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    const response: any = await api.post('/auth/register', data);
    if (response.status) {
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      
       // Fetch user details
      const userResponse: any = await api.get('/user', token);
       console.log('Register User Fetch Response:', userResponse); // Debug log
      
      if (userResponse.status && userResponse.data) {
        setUser(userResponse.data);
      } else if (userResponse.data) {
        setUser(userResponse.data);
      } else if (userResponse.user) {
        setUser(userResponse.user);
      } else if (userResponse.id) {
        setUser(userResponse);
      }

      // Redirect to verification page
      router.push('/auth/otp');
    } else {
        const error = new Error(response.message || 'Registration failed');
        (error as any).data = response.errors;
        throw error;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await api.post('/auth/logout', {}, token);
      } catch (error) {
        console.error('Logout failed', error);
      }
    }
    localStorage.removeItem('access_token');
    setUser(null);
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

       await api.post(endpoint, {}, accessToken || undefined);
  }

  const forgotPassword = async (email: string) => {
      await api.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (data: any) => {
      const response: any = await api.post('/auth/reset-password', data);
      if (response.status) {
         router.push('/auth/login');
      } else {
         throw new Error(response.message || 'Failed to reset password');
      }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, needsVerification, kycStatus, kycData, isLoading, login, register, logout, verifyOtp, resendOtp, forgotPassword, resetPassword, checkKycStatus }}>
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
