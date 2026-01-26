'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure loader is visible for at least 800ms
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 animate-fadeIn">
      {/* Subtle backdrop blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>
      
      {/* Minimal decorative elements for performance */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400 to-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative z-10 text-center">
        {/* Optimized logo animation */}
        <div className="relative mb-6 animate-scaleIn">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
            {/* Spinning border ring - optimized */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-blue-500 animate-spin" style={{ animationDuration: '1.2s' }}></div>
            
            {/* Logo container - reduced blur for performance */}
            <div className="absolute inset-2 bg-white/95 rounded-full shadow-2xl flex items-center justify-center ring-2 ring-white/50">
              <div className="relative w-20 h-20 md:w-24 md:h-24 animate-pulse" style={{ animationDuration: '2s' }}>
                <Image
                  src="/images/logo.svg"
                  alt="SASEL Logo"
                  fill
                  sizes="100px"
                  className="object-contain p-1.5"
                  priority
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Simplified loading indicator */}
        <div className="backdrop-blur-sm bg-white/70 border border-white/90 rounded-xl px-8 py-3 shadow-lg inline-block animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Loading
            </p>
          </div>
        </div>
        
        {/* SASEL Lab text */}
        <div className="mt-6 animate-fadeInDelay">
          <p className="text-sm text-gray-600 font-medium">
            SASEL Lab
          </p>
        </div>
      </div>
    </div>
  );
}

