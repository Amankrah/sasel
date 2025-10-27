'use client';

import { useApi } from "@/lib/api/ApiContext";
import ProjectCard from "@/components/ProjectCard";

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
          {Array.isArray(projects) && projects.filter(project => project.is_active).length > 0 ? (
            projects
              .filter(project => project.is_active)
              .map(project => (
                <ProjectCard key={project.id} project={project} variant="compact" />
              ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No active projects found.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Past Projects */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Past Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(projects) && projects.filter(project => !project.is_active).length > 0 ? (
            projects
              .filter(project => !project.is_active)
              .map(project => (
                <ProjectCard key={project.id} project={project} variant="compact" />
              ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No past projects found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 