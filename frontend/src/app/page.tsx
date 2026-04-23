'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import PIShowcase from "@/components/PIShowcase";
import PublicationsShowcase from "@/components/PublicationsShowcase";
import NewsSection from "@/components/NewsSection";
import TechnologiesShowcase from "@/components/TechnologiesShowcase";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import PartnersShowcase from "@/components/PartnersShowcase";

export default function Home() {
  // State for image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Actual carousel images with captions
  const carouselImages = [
    {
      src: '/images/carousel/sustainability.png',
      caption: 'Advancing Sustainable Food Systems'
    },
    {
      src: '/images/carousel/Circular Bioeconomy.jpg',
      caption: 'Promoting Circular Bioeconomy'
    },
    {
      src: '/images/carousel/sustainable diet.jpg',
      caption: 'Research on Sustainable Diets'
    },
    {
      src: '/images/carousel/Environmental Impact Assessment.jpeg',
      caption: 'Environmental Impact Assessment'
    },
    {
      src: '/images/carousel/Nutrition sensity Agriculture.png',
      caption: 'Nutrition-Sensitive Agriculture'
    }
  ];

  // Auto-rotate carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen">
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:font-semibold"
      >
        Skip to main content
      </a>
      
      {/* Carousel Banner */}
      <div className="relative h-[500px] md:h-[650px] lg:h-[700px] w-full overflow-hidden">
        {carouselImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10"></div>
            <div className="h-full w-full relative">
              <Image 
                src={image.src} 
                alt={image.caption} 
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </div>
        ))}
        
        {/* Logo and Title Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4 py-8">
          {/* Logo with enhanced styling */}
          <div className="mb-6 h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 relative bg-white/95 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/30 backdrop-blur-sm">
            <Image 
              src="/images/logo.png" 
              alt="SASEL Logo" 
              fill
              priority
              className="object-contain p-2"
            />
          </div>
          
          {/* Main Title with improved hierarchy */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-center max-w-5xl leading-tight drop-shadow-lg">
            Sustainable Agrifood Systems Engineering Lab
          </h1>
          
          {/* Subtitle with better styling */}
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-center mb-6 text-white/95 drop-shadow-md font-medium">
            Research in Sustainable Food Systems
          </p>
          
          {/* Caption for current slide with glassmorphism */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 px-6 py-3 rounded-xl mb-8 shadow-lg">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-center text-white/95">
              {carouselImages[currentImageIndex].caption}
            </p>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/projects"
              className="group px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Explore Our Research
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/publications"
              className="px-8 py-3.5 backdrop-blur-md bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              View Publications
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Carousel indicators with improved styling */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentImageIndex 
                  ? 'w-10 h-3 bg-white shadow-lg' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentImageIndex}
            />
          ))}
        </div>
        
        {/* Navigation Arrows for Desktop */}
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/40 rounded-full items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-xl"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/40 rounded-full items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-xl"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* About Section */}
      <section id="main-content" className="py-16 md:py-24 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Transforming the future of sustainable food systems through cutting-edge research and strategic collaboration
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1 - Research Excellence */}
            <div className="group backdrop-blur-md bg-white/50 border border-white/70 p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-700 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Research Excellence</h3>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Pioneering world-class research in food system eco-efficiency and sustainable healthy diets through rigorous life cycle assessments and innovative technology development.
                </p>
              </div>
            </div>

            {/* Card 2 - Industry Solutions */}
            <div className="group backdrop-blur-md bg-white/50 border border-white/70 p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-700 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Industry Solutions</h3>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Delivering tailored, evidence-based sustainability solutions that create competitive advantages for organizations across the entire food value chain.
                </p>
              </div>
            </div>

            {/* Card 3 - Strategic Partnerships */}
            <div className="group backdrop-blur-md bg-white/50 border border-white/70 p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-700 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Strategic Partnerships</h3>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Forging powerful collaborations with industry leaders, NGOs, and government agencies to transform sustainability challenges into competitive market opportunities.
                </p>
              </div>
            </div>

            {/* Card 4 - Knowledge Transfer */}
            <div className="group backdrop-blur-md bg-white/50 border border-white/70 p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-fuchsia-700 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">Knowledge Transfer</h3>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  Equipping organizations with actionable insights and cutting-edge methodologies to implement effective, research-backed sustainability strategies with measurable impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal Investigator Showcase */}
      <PIShowcase />

      {/* Partners & Sponsors (Sanity-backed) */}
      <PartnersShowcase />

      {/* Technologies Showcase Section */}
      <TechnologiesShowcase />

      {/* Featured Research Projects */}
      <ProjectsShowcase />

      {/* Publications Showcase */}
      <PublicationsShowcase />

      {/* News Section */}
      <NewsSection />
    </div>
  );
}
