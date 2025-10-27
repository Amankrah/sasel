'use client';

import { useApi } from "@/lib/api/ApiContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import PIShowcase from "@/components/PIShowcase";
import PublicationsShowcase from "@/components/PublicationsShowcase";

export default function Home() {
  const { 
    labMembers, 
    projects, 
    publications,
    loading, 
    error 
  } = useApi();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-4">
          There was an error loading the lab data. Please try again later.
        </p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  // Debug output for API data
  console.log("API Data Received:");
  console.log("Lab Members:", labMembers);
  console.log("Projects:", projects);
  console.log("Publications:", publications);

  return (
    <div className="min-h-screen">
      {/* Carousel Banner */}
      <div className="relative h-96 md:h-[550px] w-full overflow-hidden">
        {carouselImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
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
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
          <div className="mb-6 h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 relative bg-white rounded-full overflow-hidden">
            <Image 
              src="/images/logo.png" 
              alt="SASEL Logo" 
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center">
            Sustainable Agrifood Systems Engineering Lab
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-center mb-8">
            Research in Sustainable Food Systems
          </p>
          
          {/* Caption for current slide */}
          <div className="bg-black/30 px-6 py-3 rounded-lg mt-4">
            <p className="text-xl md:text-2xl font-semibold text-center">
              {carouselImages[currentImageIndex].caption}
            </p>
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Our Mission</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-md bg-white/40 border border-white/60 p-8 rounded-2xl border-l-4 border-blue-600 shadow-xl transform transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Research Excellence</h3>
              </div>
              <p className="text-gray-800 text-lg">
                Pioneering world-class research in food system eco-efficiency and sustainable healthy diets through rigorous life cycle assessments and innovative technology development.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/40 border border-white/60 p-8 rounded-2xl border-l-4 border-green-600 shadow-xl transform transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Industry Solutions</h3>
              </div>
              <p className="text-gray-800 text-lg">
                Delivering tailored, evidence-based sustainability solutions that create competitive advantages for organizations across the entire food value chain.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/40 border border-white/60 p-8 rounded-2xl border-l-4 border-amber-600 shadow-xl transform transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Strategic Partnerships</h3>
              </div>
              <p className="text-gray-800 text-lg">
                Forging powerful collaborations with industry leaders, NGOs, and government agencies to transform sustainability challenges into competitive market opportunities.
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/40 border border-white/60 p-8 rounded-2xl border-l-4 border-purple-600 shadow-xl transform transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-lg">
                  4
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Knowledge Transfer</h3>
              </div>
              <p className="text-gray-800 text-lg">
                Equipping organizations with actionable insights and cutting-edge methodologies to implement effective, research-backed sustainability strategies with measurable impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principal Investigator Showcase */}
      <PIShowcase />

      {/* Partners and Sponsors Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">OUR SPONSORS & PARTNERS</h2>
          
          {/* Main sponsors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-20">
            <a href="https://www.mitacs.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/mitacs.jpg" 
                alt="Mitacs" 
                width={200} 
                height={80} 
                className="object-contain h-16 md:h-20" 
              />
            </a>
            <a href="https://www.nserc-crsng.gc.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/nserc.jpg" 
                alt="NSERC CRSNG" 
                width={200} 
                height={80} 
                className="object-contain h-16 md:h-20" 
              />
            </a>
            <a href="https://nrc.canada.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/canada-nrc.jpg" 
                alt="Canada NRC CNRC" 
                width={200} 
                height={80} 
                className="object-contain h-16 md:h-20" 
              />
            </a>
            <a href="https://frq.gouv.qc.ca/en/nature-and-technologies/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/quebec.jpg" 
                alt="Fonds de recherche Nature et technologies Québec" 
                width={200} 
                height={80} 
                className="object-contain h-16 md:h-20" 
              />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-24">
            <a href="https://www.danone.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/danone.png" 
                alt="Danone" 
                width={200} 
                height={80} 
                className="object-contain h-12 md:h-16" 
              />
            </a>
            <a href="https://www.sshrc-crsh.gc.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/sshrc.png" 
                alt="SSHRC CRSH" 
                width={200} 
                height={80} 
                className="object-contain h-12 md:h-16" 
              />
            </a>
            <a href="https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe_en" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/horizon-europe.png" 
                alt="Horizon Europe" 
                width={200} 
                height={80} 
                className="object-contain h-12 md:h-16" 
              />
            </a>
            <a href="https://www.sshrc-crsh.gc.ca/funding-financement/nfrf-fnfr/index-eng.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Image 
                src="/images/partners/new-frontiers.jpg" 
                alt="New Frontiers in Research Fund" 
                width={200} 
                height={80} 
                className="object-contain h-12 md:h-16" 
              />
            </a>
          </div>
          
          {/* Three categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Academic Collaborators */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-10 text-center uppercase border-b pb-4 border-gray-200">
                Academic Collaborators
              </h3>
              <div className="space-y-8">
                <a href="https://www.knust.edu.gh/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/knust.jpg" 
                    alt="Kwame Nkrumah University of Science & Technology" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
                <a href="https://www.uark.edu/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/university-arkansas.jpg" 
                    alt="University of Arkansas" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
              </div>
            </div>
            
            {/* Government & Agencies */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-10 text-center uppercase border-b pb-4 border-gray-200">
                Government & Agencies
              </h3>
              <div className="space-y-8">
                <a href="https://www.ifpri.org/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/ifpri.jpg" 
                    alt="International Food Policy Research Institute" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
                <a href="https://agriculture.canada.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/agriculture-canada.png" 
                    alt="Agriculture and Agri-Food Canada" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
              </div>
            </div>
            
            {/* Industry */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-10 text-center uppercase border-b pb-4 border-gray-200">
                Industry
              </h3>
              <div className="space-y-8">
                <a href="https://jefo.ca/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/jefo.jpg" 
                    alt="Jefo" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
                <a href="https://www.ubuntoo.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  <Image 
                    src="/images/partners/ubuntoo.png" 
                    alt="Ubuntoo" 
                    width={180} 
                    height={100} 
                    className="object-contain h-20" 
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Showcase Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"></div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">Our Technologies</h2>
          <p className="text-lg text-center text-gray-700 mb-10 max-w-3xl mx-auto">
            Advanced platforms and tools developed by our lab to drive sustainable food systems research and innovation
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Project 1 - EcoDish365 */}
            <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20"></div>

              <div className="h-48 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Nutrition & Environment Icon */}
                  <div className="mb-3">
                    <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">EcoDish365</h3>
                  <span className="text-xs text-white/90 mt-1 font-medium">🌱 Nutrition • 🌍 Environment</span>
                </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Environmental Nutrition Decision System</h3>
                <p className="text-gray-700 mb-4">
                  The world's first environmental nutrition decision system integrating 5,000+ food database with 150+ nutrition metrics and 18 environmental impact categories.
                </p>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>📊 5,000+ Canadian Nutrient File food database</li>
                    <li>💪 150+ nutrition and health metrics</li>
                    <li>🌿 18 environmental impact categories</li>
                    <li>⭐ Health Star Rating (HSR)</li>
                    <li>🧭 Food Compass Score (FCS)</li>
                    <li>🥗 Healthy Eating Food Index (HEFI)</li>
                  </ul>
                </div>
                <a
                  href="https://ecodish365.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                >
                  Visit EcoDish365
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Project 2 - Pea Protein Extraction */}
            <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-yellow-400/20"></div>

              <div className="h-48 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Protein/Plant Icon */}
                  <div className="mb-3">
                    <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">ProteinProcess</h3>
                  <span className="text-xs text-white/90 mt-1 font-medium">🧪 Analysis • ♻️ Sustainability</span>
                </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Pea Protein Extraction Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Comprehensive platform comparing three extraction methods with multi-dimensional technical, economic, and environmental analysis.
                </p>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>🌾 Baseline Dry Fractionation analysis</li>
                    <li>⚡ RF & IR Pre-treatment comparison</li>
                    <li>🔬 Protein recovery & purity metrics</li>
                    <li>💰 Economic assessment (CAPEX, OPEX, NPV, ROI)</li>
                    <li>🌍 Environmental LCA (GWP, toxicity, water)</li>
                  </ul>
                </div>
                <a
                  href="https://proteinprocess.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                >
                  Access ProteinProcess
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Project 3 - FSFVI */}
            <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 via-purple-400/20 to-blue-400/20"></div>

              <div className="h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* AI/Data Analytics Icon */}
                  <div className="mb-3">
                    <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">FSFVI</h3>
                  <span className="text-xs text-white/90 mt-1 font-medium">🤖 AI-Powered • 📈 Analytics</span>
                </div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Food System Financing Vulnerability Index</h3>
                <p className="text-gray-700 mb-4">
                  AI-powered platform analyzing vulnerabilities across 8 food system components using the 3FS framework for optimal financial allocation.
                </p>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>🎯 8 food system component analysis</li>
                    <li>🤖 AI-powered recommendations</li>
                    <li>📊 Performance gap vs global benchmarks</li>
                    <li>🗓️ Strategic multi-year planning</li>
                    <li>🔒 Enterprise-grade security</li>
                  </ul>
                </div>
                <a
                  href="https://fsfvi.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  Explore FSFVI
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 backdrop-blur-md bg-white/40 border-2 border-green-600/50 text-green-700 font-semibold rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore All Technologies
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Publications Showcase */}
      <PublicationsShowcase publications={publications} />
    </div>
  );
}
