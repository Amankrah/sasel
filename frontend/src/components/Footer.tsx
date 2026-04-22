'use client';

import { FaLinkedin, FaResearchgate, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FooterTechnologiesList from './FooterTechnologiesList';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60"></div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-6 md:pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Lab Info with Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-green-500/20 bg-white shadow-lg">
                <Image 
                  src="/images/logo.svg" 
                  alt="SASEL Logo" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  SASEL Lab
                </h3>
                <p className="text-xs text-gray-700 font-semibold">McGill University</p>
              </div>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed mb-4 font-medium">
              Pioneering sustainable food systems through innovative research, cutting-edge technology, and strategic collaboration.
            </p>
            
            {/* Social Media Links - Enhanced */}
            <div className="flex gap-3">
              <a 
                href="https://scholar.google.com/citations?user=QyKOR3oAAAAJ&hl=en&oi=ao" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Google Scholar"
                className="group relative backdrop-blur-sm bg-white/70 border border-blue-200/50 p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              >
                <SiGooglescholar size={20} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Google Scholar
                </span>
              </a>
              <a 
                href="https://www.researchgate.net/lab/Ebenezer-Miezah-Kwofie-Lab" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="ResearchGate"
                className="group relative backdrop-blur-sm bg-white/70 border border-green-200/50 p-2.5 rounded-xl text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaResearchgate size={20} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ResearchGate
                </span>
              </a>
              <a 
                href="https://www.linkedin.com/company/sasel-lab/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="group relative backdrop-blur-sm bg-white/70 border border-blue-200/50 p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
              >
                <FaLinkedin size={20} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="group inline-flex items-center text-sm text-gray-800 font-medium hover:text-green-600 transition-colors duration-200">
                  <span className="w-1 h-1 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/members" className="group inline-flex items-center text-sm text-gray-800 font-medium hover:text-green-600 transition-colors duration-200">
                  <span className="w-1 h-1 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/projects" className="group inline-flex items-center text-sm text-gray-800 font-medium hover:text-green-600 transition-colors duration-200">
                  <span className="w-1 h-1 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Research Projects
                </Link>
              </li>
              <li>
                <a href="/publications" className="group inline-flex items-center text-sm text-gray-800 font-medium hover:text-green-600 transition-colors duration-200">
                  <span className="w-1 h-1 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Publications
                </a>
              </li>
            </ul>
          </div>

          {/* Our Technologies */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Our Technologies
            </h3>
            <FooterTechnologiesList />
          </div>
          
          {/* Contact Information */}
                <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <address className="text-gray-800 text-sm not-italic space-y-3 font-medium">
              <div className="group flex gap-3 items-start">
                <div className="backdrop-blur-sm bg-green-50/50 border border-green-200/50 p-2 rounded-lg text-green-600 group-hover:bg-green-100 transition-all duration-200 shadow-sm">
                  <FaMapMarkerAlt className="flex-shrink-0" size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">McGill University</p>
                  <p>2111 Lakeshore Road</p>
                  <p>Sainte-Anne-de-Bellevue, QC</p>
                  <p>H9X 3V9, Canada</p>
                </div>
              </div>
              
              <div className="group flex gap-3 items-center">
                <div className="backdrop-blur-sm bg-blue-50/50 border border-blue-200/50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-all duration-200 shadow-sm">
                  <FaPhone className="flex-shrink-0" size={14} />
                </div>
                <a href="tel:+15143987776" className="text-gray-800 hover:text-green-600 transition-colors font-medium">
                  +1 (514) 398-7776
                </a>
              </div>
              
              <div className="group flex gap-3 items-center">
                <div className="backdrop-blur-sm bg-green-50/50 border border-green-200/50 p-2 rounded-lg text-green-600 group-hover:bg-green-100 transition-all duration-200 shadow-sm">
                  <FaEnvelope className="flex-shrink-0" size={14} />
                </div>
                <a 
                  href="mailto:sasel@mcgill.ca" 
                  className="text-green-600 hover:text-green-800 transition-colors font-semibold"
                >
                  sasel@mcgill.ca
                </a>
              </div>
            </address>
          </div>
          </div>
          
        {/* Divider with gradient */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
            </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-800 text-center md:text-left font-medium">
            © {currentYear} <span className="font-semibold">Sustainable Agrifood Systems Engineering Lab</span> at McGill University
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-700 font-medium">
            <span className="hidden md:inline">All rights reserved</span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold">SASE Lab</span>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 backdrop-blur-md bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white p-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <FaArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer; 