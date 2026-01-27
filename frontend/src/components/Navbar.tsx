'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Members', href: '/members' },
    { name: 'Projects', href: '/projects' },
    { name: 'Publications', href: '/publications' },
    { name: 'News', href: '/news' },
  ];

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Lab Name */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all duration-300">
                <Image 
                  src="/images/logo.svg" 
                  alt="SASEL Logo" 
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="hidden md:block">
                <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  SASEL Lab
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  McGill University
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50/50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="mailto:ebenezer.kwofie@mcgill.ca"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            {mobileMenuOpen ? (
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                aria-expanded="true"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } lg:hidden overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-md bg-white/95 border-t border-gray-200/60`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                isActive(item.href)
                  ? 'text-green-700 bg-green-50 shadow-sm'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50/50'
              }`}
            >
              {isActive(item.href) && (
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full mr-3"></span>
              )}
              {item.name}
            </Link>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <a
              href="mailto:ebenezer.kwofie@mcgill.ca"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white text-base font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 