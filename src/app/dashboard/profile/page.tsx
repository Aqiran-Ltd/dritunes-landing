'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import {
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  KeyIcon,
  CheckBadgeIcon,
  CameraIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function ProfileForm({ user }: { user: any }) {
    const { updateUser } = useAuth();
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone_number || '');
    const [country, setCountry] = useState(user.country || '');
    const [dob, setDob] = useState(user.date_of_birth || '');
    const [address, setAddress] = useState(user.address || '');
    const [city, setCity] = useState(user.city || '');
    const [state, setState] = useState(user.state || '');
    
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type.toLowerCase())) {
                toast.error('Only JPG, PNG, GIF, or WEBP images are allowed.');
                e.target.value = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Profile photo must be smaller than 2MB.');
                e.target.value = '';
                return;
            }
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (trimmedName.length < 2 || trimmedName.length > 255) {
            const msg = 'Full name must be between 2 and 255 characters.';
            toast.error(msg);
            setMessage(msg);
            return;
        }
        const normalizedPhone = phone.replace(/[\s()-]/g, '').trim();
        if (normalizedPhone && !/^\+?[0-9]{9,15}$/.test(normalizedPhone)) {
            const msg = 'Enter a valid phone number (9 to 15 digits, optional leading +).';
            toast.error(msg);
            setMessage(msg);
            return;
        }
        if (dob) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (dob > todayStr || dob < '1900-01-01') {
                const msg = 'Please enter a valid date of birth.';
                toast.error(msg);
                setMessage(msg);
                return;
            }
        }

        const phoneChanged = normalizedPhone !== (user.phone_number || '');
        const loadingToast = toast.loading('Updating profile...');
        setIsLoading(true);
        try {
            // Prepare FormData (for file upload support)
            const formData = new FormData();
            formData.append('name', name.trim());
            if (normalizedPhone) formData.append('phone_number', normalizedPhone);
            if (country) formData.append('country', country);
            if (dob) formData.append('date_of_birth', dob);
            if (address) formData.append('address', address.trim());
            if (city) formData.append('city', city.trim());
            if (state) formData.append('state', state.trim());

            if (photo) {
                formData.append('profile_picture', photo);
            }
            
            const token = localStorage.getItem('access_token');
            const data = await api.postForm<any>('/user/profile', formData, token || undefined);
            
            // If the request didn't throw (handled by api utility for non-2xx),
            // and status is not explicitly false, treat it as a success.
            if (data.status !== false) {
                 // The backend returns the updated user object in data.data or data
                 const updatedUser = data.data || data.user || data;
                 if (updatedUser && updatedUser.id) {
                     updateUser(updatedUser);
                     setPhone(updatedUser.phone_number || normalizedPhone);
                 }
                 
                 const successMsg =
                     phoneChanged && updatedUser?.phone_verified_at === null
                         ? 'Profile updated! Please verify your new phone number.'
                         : data.message || 'Profile updated successfully!';
                 toast.success(successMsg, { id: loadingToast });
                 setMessage(successMsg);
            } else {
                 throw new Error(data.message || 'Failed to update profile.');
            }
        } catch (error: any) {
            const msg = error.message || 'Failed to update profile.';
            toast.error(msg, { id: loadingToast });
            setMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpdate} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            
            {/* Photo Upload Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : user.profile_picture_url ? (
                             <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400" />
                        )}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-gold-500 text-ink rounded-full shadow-lg hover:bg-gold-600 transition-colors"
                    >
                        <CameraIcon className="w-3.5 h-3.5" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                        accept="image/jpeg,image/png,image/gif,image/webp"
                    />
                </div>
                <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</p>
                     <p className="text-xs text-gray-500 mt-1">Accepts JPG, PNG, GIF or WEBP. Max 2MB.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <Input value={name} autoComplete="name" minLength={2} maxLength={255} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <Input type="tel" inputMode="tel" autoComplete="tel" value={phone} minLength={9} maxLength={20} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0241234567 or +233241234567" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <Input type="date" min="1900-01-01" max={new Date().toISOString().split('T')[0]} value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <Input value={address} maxLength={500} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <Input value={city} maxLength={100} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Region</label>
                    <Input value={state} maxLength={100} onChange={(e) => setState(e.target.value)} placeholder="State or Region" />
                </div>

                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 focus:border-gold-500 dark:focus:border-gold-400 focus:ring-4 focus:ring-gold-500/15 dark:focus:ring-gold-500/20 text-gray-900 dark:text-white transition-all duration-200 ease-out focus:outline-none focus:bg-white dark:focus:bg-gray-950"
                    >
                        <option value="">Select Country</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Nigeria">Nigeria</option>
                    </select>
                </div>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                 <Input value={user.email} disabled className="bg-gray-50 dark:bg-gray-800 opacity-70 cursor-not-allowed" />
            </div>
            
             {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-gold-50 text-gold-700 dark:text-gold-400'}`}>
                    {message}
                </div>
            )}

            <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>Save Changes</Button>
            </div>
        </form>
    );
}

function SecurityForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8 || password.length > 256) {
            setMessage('New password must be at least 8 characters.');
            return;
        }
        if (password !== passwordConfirmation) {
            setMessage('Passwords do not match.');
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        const loadingToast = toast.loading('Updating password...');

        try {
            const token = localStorage.getItem('access_token');
            await api.post('/auth/change-password', { 
                current_password: currentPassword, 
                password, 
                password_confirmation: passwordConfirmation 
            }, token || undefined);
            toast.success('Password changed successfully!', { id: loadingToast });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setPassword('');
            setPasswordConfirmation('');
        } catch (error: any) {
            const msg = error.message || 'Failed to change password.';
            toast.error(msg, { id: loadingToast });
            setMessage(msg);
        } finally {
             setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleChangePassword} className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <KeyIcon className="w-5 h-5" />
                Security
             </h3>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <Input type="password" autoComplete="current-password" minLength={8} maxLength={256} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <Input type="password" autoComplete="new-password" minLength={8} maxLength={256} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <Input type="password" autoComplete="new-password" minLength={8} maxLength={256} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" required />
                     </div>
                 </div>
             </div>

             {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-gold-50 text-gold-700 dark:text-gold-400'}`}>
                    {message}
                </div>
            )}
             
             <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>Update Password</Button>
            </div>
        </form>
    );
}

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-slide-in-up">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-orange-500 flex items-center justify-center text-ink text-3xl font-bold shadow-xl shadow-gold-500/20 overflow-hidden border-2 border-white dark:border-gray-800">
                 {user.profile_picture_url ? (
                     <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                     user.name.charAt(0)
                 )}
             </div>
             <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-900 p-1 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                 {user.phone_verified_at && user.email_verified_at ? (
                     <CheckBadgeIcon className="w-6 h-6 text-blue-500" title="Verified Account" />
                 ) : (
                     <UserCircleIcon className="w-6 h-6 text-gray-400" />
                 )}
             </div>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
             <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-gray-500 dark:text-gray-400">
                 <div className="flex items-center gap-1">
                     <EnvelopeIcon className="w-4 h-4" />
                     {user.email}
                     {user.email_verified_at && <span className="text-emerald-500 text-xs bg-emerald-50 dark:bg-emerald-900/10 px-1.5 py-0.5 rounded-full ml-1">Verified</span>}
                 </div>
                 {user.phone_number && (
                    <div className="flex items-center gap-1">
                        <PhoneIcon className="w-4 h-4" />
                        {user.phone_number}
                        {user.phone_verified_at && <span className="text-emerald-500 text-xs bg-emerald-50 dark:bg-emerald-900/10 px-1.5 py-0.5 rounded-full ml-1">Verified</span>}
                    </div>
                 )}
             </div>
             <p className="pt-2 text-sm text-gray-400">
                Member since {new Date().getFullYear()}
             </p>
          </div>
      </div>

      {/* Main Form Area */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <ProfileForm user={user} />
          <SecurityForm />
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-red-200 dark:border-red-900/30">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <h3 className="text-lg font-bold">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Permanently delete your Aqiran Xchange account. All profile data, saved payout details, and transaction records will be purged.
          </p>
          <div className="pt-4 border-t border-red-100 dark:border-red-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Delete Account</h4>
                  <p className="text-xs text-gray-500">This action is permanent and cannot be undone.</p>
              </div>
              <Link
                  href="/auth/delete-account"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 font-semibold text-sm transition-colors shrink-0"
              >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete My Account</span>
              </Link>
          </div>
      </div>
    </div>
  );
}
