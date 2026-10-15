import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-black selection:bg-red-500/30">
      {/* Creative Background Side */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),rgba(0,0,0,1))] z-0"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px] mix-blend-screen float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-900/30 rounded-full blur-[120px] mix-blend-screen float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-orange-600/20 rounded-full blur-[100px] mix-blend-screen pulse-red" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern with Perspective */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,transparent,black,transparent)] transform perspective-[1000px] rotate-x-[10deg] scale-150"></div>
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 p-12 text-white max-w-xl backdrop-blur-sm bg-black/10 rounded-3xl border border-white/5 shadow-2xl">
           <div className="mb-8 relative">
             <Link href="/" className="text-3xl font-bold tracking-tight flex items-center gap-3 group">
                 <div className="relative w-10 h-10">
                    <Image src="/logo/aqiran-xchange-logo.svg" alt="Logo" fill className="object-contain" />
                 </div>
                 <div className="relative">
                    <div className="absolute inset-0 bg-red-600 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative text-red-500">Dritunes</span>
                 </div>
                <span className="font-light tracking-widest text-white/80">Consult</span>
             </Link>
           </div>
           
           <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">
             Seamless Trading, <br />
             <span className="text-gradient">
               Limitless Possibilities.
             </span>
           </h1>
           
           <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
             Join thousands of users who trust <span className="text-white font-medium">Dritunes</span> for secure, fast, and reliable digital asset trading. Experience the future of exchange today.
           </p>

           <div className="flex gap-4">
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex-1 hover:bg-white/10 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-1">
                 <div className="text-3xl font-bold text-red-500 mb-1 group-hover:scale-110 transition-transform origin-left">24/7</div>
                 <div className="text-sm text-gray-400 group-hover:text-white transition-colors">Support Access Setup</div>
              </div>
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex-1 hover:bg-white/10 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-1">
                 <div className="text-3xl font-bold text-red-500 mb-1 group-hover:scale-110 transition-transform origin-left">100%</div>
                 <div className="text-sm text-gray-400 group-hover:text-white transition-colors">Secure Trades Guaranteed</div>
              </div>
           </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-3xl -z-10 lg:hidden"></div>
        
        {/* Back to Home Link */}
        <Link 
            href="/" 
            className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
        </Link>
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 flex flex-col items-center">
             <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative w-10 h-10">
                   <Image src="/logo/aqiran-xchange-logo.svg" alt="Logo" fill className="object-contain" />
                </div>
                <div className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <span className="text-red-600">Dritunes</span>
                    <span className="font-light dark:text-white">Consult</span>
                </div>
             </Link>
          </div>

          {children}
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            <p>&copy; {new Date().getFullYear()} Dritunes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
