'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  KeyIcon,
  CheckBadgeIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

function ProfileForm({ user }: { user: any }) {
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
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating profile...');
        try {
            // Prepare FormData (for file upload support)
            const formData = new FormData();
            formData.append('name', name);
            if (phone) formData.append('phone_number', phone);
            if (country) formData.append('country', country);
            if (dob) formData.append('date_of_birth', dob);
            if (address) formData.append('address', address);
            if (city) formData.append('city', city);
            if (state) formData.append('state', state);

            if (photo) {
                formData.append('profile_image', photo);
            }
            
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/user/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                 toast.success('Profile updated successfully!', { id: loadingToast });
                 setMessage('Profile updated successfully!');
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
                        ) : user.profile_image ? (
                             <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400" />
                        )}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    >
                        <CameraIcon className="w-3.5 h-3.5" />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
                <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Photo</p>
                     <p className="text-xs text-gray-500 mt-1">Accepts JPG, PNG or GIF. Max 2MB.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Region</label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State or Region" />
                </div>

                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country Code (e.g. GH)" />
                </div>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                 <Input value={user.email} disabled className="bg-gray-50 dark:bg-gray-800 opacity-70 cursor-not-allowed" />
            </div>
            
             {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <Input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="••••••••" required />
                     </div>
                 </div>
             </div>

             {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative">
             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-red-500/20">
                 {user.name.charAt(0)}
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
    </div>
  );
}
