'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';
import { useSettings } from '@/contexts/SettingsContext';

export default function MaintenanceMode() {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-urbanist">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <Image 
              src="/logo/white.png" 
              alt="Dr iTunes Consult" 
              width={180} 
              height={60} 
              className="relative brightness-110"
              priority
            />
          </div>
        </div>

        {/* Animated Icon Container */}
        <div className="relative flex justify-center py-4">
          <div className="w-24 h-24 relative">
             {/* Spinning Gear / Maintenance Icon */}
             <div className="absolute inset-0 border-4 border-dashed border-red-600/30 rounded-full animate-[spin_10s_linear_infinite]" />
             <div className="absolute inset-2 border-4 border-dashed border-red-500/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
             <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 px-6">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Under <span className="text-red-600">Maintenance</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-light">
            {settings?.maintenance_message || "We're currently updating our system to provide you with a better trading experience. We'll be back shortly!"}
          </p>
        </div>

        {/* Footer / CTA Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="primary" 
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.open(`https://wa.me/${settings?.whatsapp_number || '233548434599'}`, '_blank')}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Contact Support
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto backdrop-blur-sm border-white/10 text-white hover:bg-white/5"
            onClick={() => window.location.reload()}
          >
            Check Status
          </Button>
        </div>

        {/* Social Links / Branding */}
        <div className="pt-12 text-gray-500 text-sm font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Dr iTunes Consult. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
