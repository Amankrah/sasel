import { getProjects } from '@/sanity/lib/fetch'
import type { SanityProject } from '@/sanity/lib/types'
import ProjectCard from '@/components/ProjectCard'

export const revalidate = 60

export const metadata = {
  title: 'Research Projects | SASEL Lab',
  description: 'Explore our innovative research projects advancing sustainable agrifood systems and environmental solutions.',
}

export default async function ProjectsPage() {
  const projects = await getProjects() as SanityProject[]

  const activeProjects = projects?.filter(
    (project) => project.status === 'ACTIVE' || project.status === 'UPCOMING'
  ) || []

  const completedProjects = projects?.filter(
    (project) => project.status === 'COMPLETED'
  ) || []

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Research Projects
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Innovative research initiatives advancing sustainable agrifood systems and environmental solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mt-4"></div>
        </div>

        {/* Project Summary Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {activeProjects.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Active Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {completedProjects.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Completed Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {projects?.length || 0}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Total Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <section className="mb-16 max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="inline-flex items-center gap-2">
                  Active Projects
                  {activeProjects.length > 0 && (
                    <span className="text-lg font-semibold px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {activeProjects.length}
                    </span>
                  )}
                </span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <ProjectCard key={project._id} project={project} variant="compact" />
              ))
            ) : (
              <div className="col-span-full">
                <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
                  <div className="text-6xl mb-4">🔬</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">No active projects</p>
                  <p className="text-sm text-gray-600">Check back soon for new research initiatives</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Completed Projects */}
        <section className="max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="inline-flex items-center gap-2">
                  Completed Projects
                  {completedProjects.length > 0 && (
                    <span className="text-lg font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {completedProjects.length}
                    </span>
                  )}
                </span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedProjects.length > 0 ? (
              completedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} variant="compact" />
              ))
            ) : (
              <div className="col-span-full">
                <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">No completed projects</p>
                  <p className="text-sm text-gray-600">Our past research projects will appear here</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
