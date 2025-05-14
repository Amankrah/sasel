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
