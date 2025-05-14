'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative h-10 w-10 overflow-hidden">
                  <Image 
                    src="/images/logo.png" 
                    alt="SASEL Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-medium text-green-600">SASEL Lab</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/members"
                className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Members
              </Link>
              <Link
                href="/projects"
                className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Projects
              </Link>
              <Link
                href="/publications"
                className="border-transparent text-gray-600 hover:border-green-500 hover:text-green-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Publications
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-gray-100"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="text-gray-600 hover:bg-green-50 hover:text-green-600 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/members"
            className="text-gray-600 hover:bg-green-50 hover:text-green-600 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
          >
            Members
          </Link>
          <Link
            href="/projects"
            className="text-gray-600 hover:bg-green-50 hover:text-green-600 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
          >
            Projects
          </Link>
          <Link
            href="/publications"
            className="text-gray-600 hover:bg-green-50 hover:text-green-600 block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
          >
            Publications
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 