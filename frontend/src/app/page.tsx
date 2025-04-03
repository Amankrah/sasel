'use client';

import { useApi } from "@/lib/api/ApiContext";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { 
    labMembers, 
    projects, 
    publications,
    loading, 
    error 
  } = useApi();

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
    <div className="min-h-screen p-4 md:p-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">SASEL Lab</h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          Research in Sensors and Systems for Environmental Learning
        </p>
      </section>

      {/* Lab Members Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Lab Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(labMembers) && labMembers.length > 0 ? (
              labMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    <p className="text-sm text-gray-500">{member.member_type}</p>
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Current Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(projects) && projects.filter(p => p.is_active).length > 0 ? (
              projects.filter(p => p.is_active).slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {project.image && (
                    <div className="h-48 overflow-hidden relative">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
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
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Publications</h2>
          <div className="space-y-4">
            {Array.isArray(publications) && publications.length > 0 ? (
              publications.slice(0, 5).map((pub) => (
                <div key={pub.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{pub.title}</h3>
                  <p className="text-gray-600 mb-1">{pub.journal || pub.conference}</p>
                  <p className="text-sm text-gray-500">
                    {pub.year}{pub.month ? `, ${pub.month}` : ''}
                  </p>
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
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Publications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
