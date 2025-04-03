'use client';

import { useApi } from "@/lib/api/ApiContext";
import Image from "next/image";

export default function ProjectsPage() {
  const { projects, loading, error } = useApi();

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
          There was an error loading the projects. Please try again later.
        </p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Research Projects</h1>
      
      {/* Active Projects */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects
            .filter(project => project.is_active)
            .map(project => (
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                    {project.github_repo && (
                      <a 
                        href={project.github_repo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
      
      {/* Past Projects */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Past Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects
            .filter(project => !project.is_active)
            .map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden opacity-75">
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {project.start_date && project.end_date ? (
                        `${new Date(project.start_date).getFullYear()} - ${new Date(project.end_date).getFullYear()}`
                      ) : (
                        project.start_date ? `Started: ${new Date(project.start_date).toLocaleDateString()}` : ''
                      )}
                    </span>
                    {project.github_repo && (
                      <a 
                        href={project.github_repo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
} 