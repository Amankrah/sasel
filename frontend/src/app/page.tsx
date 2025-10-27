'use client';

import { useApi } from "@/lib/api/ApiContext";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Mission</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600 shadow-md transform transition hover:shadow-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold">Research Excellence</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Pioneering world-class research in food system eco-efficiency and sustainable healthy diets through rigorous life cycle assessments and innovative technology development.
              </p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-lg border-l-4 border-green-600 shadow-md transform transition hover:shadow-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold">Industry Solutions</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Delivering tailored, evidence-based sustainability solutions that create competitive advantages for organizations across the entire food value chain.
              </p>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-lg border-l-4 border-amber-600 shadow-md transform transition hover:shadow-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold">Strategic Partnerships</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Forging powerful collaborations with industry leaders, NGOs, and government agencies to transform sustainability challenges into competitive market opportunities.
              </p>
            </div>
            
            <div className="bg-purple-50 p-8 rounded-lg border-l-4 border-purple-600 shadow-md transform transition hover:shadow-lg">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold">Knowledge Transfer</h3>
              </div>
              <p className="text-gray-700 text-lg">
                Equipping organizations with actionable insights and cutting-edge methodologies to implement effective, research-backed sustainability strategies with measurable impact.
              </p>
            </div>
          </div>
        </div>
      </section>

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
      <section className="py-12 md:py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center">Our Technologies</h2>
          <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Advanced platforms and tools developed by our lab to drive sustainable food systems research and innovation
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Project 1 - DISH Research Platform */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-blue-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-blue-800">DISH</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">DISH Research Platform</h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive suite of nutrition and environmental impact assessment tools for research, providing multiple calculators to help researchers make informed decisions.
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Health Star Rating Calculator</li>
                    <li>• Food Consumption Score Calculator</li>
                    <li>• Health & Environmental Nutritional Index</li>
                    <li>• Environmental Impact Calculator</li>
                    <li>• Canadian Nutrient File Database Manager</li>
                  </ul>
                </div>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">React</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Material UI</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Django</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">PostgreSQL</span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">AWS</span>
                  </div>
                </div>
                <a 
                  href="https://research.ecodish365.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Visit DISH Platform
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Project 2 - FS-ROAS */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-green-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-green-800">FS-ROAS</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Life Expectancy & Water Share Predictor</h3>
                <p className="text-gray-600 mb-4">
                  Advanced ML platform for predicting life expectancy and agricultural water share based on food system indicators with interactive scenario building capabilities.
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Interactive life expectancy simulation</li>
                    <li>• Agricultural water share prediction</li>
                    <li>• Linear and exponential simulation capabilities</li>
                    <li>• Customizable time intervals and baselines</li>
                    <li>• Key feature impact visualization</li>
                  </ul>
                </div>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Next.js</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">TensorFlow</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">LSTM</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Django</span>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">TypeScript</span>
                  </div>
                </div>
                <a 
                  href="https://fsroas.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Try FS-ROAS Platform
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Project 3 - Pea Protein Analysis */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-amber-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-amber-800">PPAS</h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">Pea Protein Analysis System</h3>
                <p className="text-gray-600 mb-4">
                  Advanced pea protein extraction analysis platform integrating technical process optimization, economic feasibility assessment, and environmental impact evaluation.
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Protein recovery optimization</li>
                    <li>• Monte Carlo simulation for profitability</li>
                    <li>• Environmental impact assessment</li>
                    <li>• Separation efficiency monitoring</li>
                    <li>• Process performance tracking</li>
                  </ul>
                </div>
                <div className="mb-5">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Rust</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">React</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Python</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">TensorFlow</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Scikit-learn</span>
                  </div>
                </div>
                <a 
                  href="https://proteinprocess.io" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
                >
                  Access PPAS Platform
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
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
            >
              Explore All Technologies
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lab Members Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Lab Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(labMembers) && labMembers.length > 0 ? (
              labMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
                  {member.image && (
                    <div className="h-48 overflow-hidden relative">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-600 mb-2">{member.position}</p>
                    <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.member_type}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No lab members found.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Current Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(projects) && projects.filter(p => p.is_active).length > 0 ? (
              projects.filter(p => p.is_active).slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
                  {project.image && (
                    <div className="h-52 overflow-hidden relative">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <h3 className="absolute bottom-0 left-0 right-0 text-xl font-semibold mb-4 px-4 text-white">{project.title}</h3>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-gray-600 line-clamp-3">{project.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No active projects found.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/projects" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Recent Publications</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {Array.isArray(publications) && publications.length > 0 ? (
              publications.slice(0, 5).map((pub) => (
                <div key={pub.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-semibold mb-3">{pub.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pub.journal && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {pub.journal}
                      </span>
                    )}
                    {pub.conference && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {pub.conference}
                      </span>
                    )}
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {pub.year}{pub.month ? `, ${pub.month}` : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No publications found.</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/publications" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View All Publications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
