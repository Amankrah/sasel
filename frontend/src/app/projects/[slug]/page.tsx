import { getProjectBySlug, getProjects } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import PortableText from '@/components/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.slug.current,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found | SASEL Lab',
    }
  }

  return {
    title: `${project.title} | SASEL Lab Projects`,
    description: project.shortDescription || project.title,
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const imageUrl = project.featuredImage 
    ? urlForImage(project.featuredImage).width(1200).url() 
    : null

  const isActive = project.status === 'ACTIVE' || project.status === 'UPCOMING'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <article className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {isActive ? (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-500 text-white">
                Active Project
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white">
                Completed
              </span>
            )}
            {project.isFeatured && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">
                ⭐ Featured
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="text-xl text-gray-700 leading-relaxed">
              {project.shortDescription}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-2xl bg-white">
            <div className="relative w-full aspect-video">
              <Image
                src={imageUrl}
                alt={project.featuredImage?.alt || project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain p-6"
                priority
              />
            </div>
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            {project.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Project</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={project.description} />
                </div>
              </div>
            )}

            {/* Methodology */}
            {project.methodology && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Methodology</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={project.methodology} />
                </div>
              </div>
            )}

            {/* Outcomes */}
            {project.outcomes && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Key Outcomes</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={project.outcomes} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Project Details</h3>
              
              {/* Timeline */}
              {(project.startDate || project.endDate) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">Timeline</span>
                  </div>
                  <p className="text-gray-700">
                    {project.startDate && project.endDate ? (
                      `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`
                    ) : project.startDate ? (
                      `Started ${new Date(project.startDate).toLocaleDateString()}`
                    ) : project.endDate ? (
                      `Ended ${new Date(project.endDate).toLocaleDateString()}`
                    ) : 'Ongoing'}
                  </p>
                </div>
              )}

              {/* Research Areas */}
              {project.researchAreas && project.researchAreas.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-semibold">Research Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.researchAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.website || project.githubRepo) && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                  {project.githubRepo && (
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Team Members */}
            {project.members && project.members.length > 0 && (
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Team Members</h3>
                <div className="space-y-2">
                  {project.members.map((member) => (
                    <Link
                      key={member._id}
                      href={`/members/${member.slug?.current || '#'}`}
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {member.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Technologies */}
            {project.relatedTechnologies && project.relatedTechnologies.length > 0 && (
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Technologies</h3>
                <div className="space-y-3">
                  {project.relatedTechnologies.map((tech) => (
                    <Link
                      key={tech._id}
                      href={`/technologies/${tech.slug.current}`}
                      className="block group"
                    >
                      <div className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                        {tech.title}
                      </div>
                      {tech.tagline && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tech.tagline}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Publications */}
            {project.relatedPublications && project.relatedPublications.length > 0 && (
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Publications</h3>
                <div className="space-y-4">
                  {project.relatedPublications.map((pub) => {
                    const href = pub.doi
                      ? `https://doi.org/${pub.doi}`
                      : pub.url || (pub.slug ? `/publications#${pub.slug.current}` : undefined)
                    const external = Boolean(pub.doi || pub.url)
                    const titleBlock = (
                      <>
                        <div className="font-semibold text-sm text-blue-600 group-hover:text-blue-800 transition-colors leading-snug">
                          {pub.title}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {[pub.journal || pub.conference, pub.year].filter(Boolean).join(' | ')}
                        </p>
                      </>
                    )
                    return href ? (
                      <a
                        key={pub._id}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="block group"
                      >
                        {titleBlock}
                      </a>
                    ) : (
                      <div key={pub._id}>{titleBlock}</div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button Footer */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Projects
          </Link>
        </div>
      </article>
    </div>
  )
}
