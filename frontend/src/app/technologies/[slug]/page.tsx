import { getTechnologyBySlug, getTechnologies } from '@/sanity/lib/fetch'
import { urlForImage } from '@/sanity/lib/image'
import PortableText from '@/components/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface TechnologyPageProps {
  params: Promise<{ slug: string }>
}

const STATUS_LABEL: Record<string, { label: string; classes: string }> = {
  LIVE: { label: 'Live', classes: 'bg-green-500 text-white' },
  BETA: { label: 'Beta', classes: 'bg-amber-500 text-white' },
  IN_DEVELOPMENT: { label: 'In Development', classes: 'bg-blue-500 text-white' },
  DEPRECATED: { label: 'Deprecated', classes: 'bg-gray-500 text-white' },
}

export async function generateStaticParams() {
  const technologies = await getTechnologies()
  return technologies.map((tech) => ({
    slug: tech.slug.current,
  }))
}

export async function generateMetadata({ params }: TechnologyPageProps) {
  const { slug } = await params
  const technology = await getTechnologyBySlug(slug)

  if (!technology) {
    return {
      title: 'Technology Not Found | SASEL Lab',
    }
  }

  return {
    title: `${technology.title} | SASEL Lab Technologies`,
    description: technology.tagline || technology.title,
  }
}

export default async function TechnologyDetailPage({ params }: TechnologyPageProps) {
  const { slug } = await params
  const technology = await getTechnologyBySlug(slug)

  if (!technology) {
    notFound()
  }

  const imageUrl = technology.featuredImage
    ? urlForImage(technology.featuredImage).width(1200).url()
    : null

  const statusConf = STATUS_LABEL[technology.status]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <article className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        <Link
          href="/technologies"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Technologies
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusConf.classes}`}>
              {statusConf.label}
            </span>
            {technology.isFeatured && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">
                ⭐ Featured
              </span>
            )}
            {technology.categories?.slice(0, 3).map((cat, i) => (
              <span key={i} className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {technology.title}
          </h1>

          {technology.tagline && (
            <p className="text-xl text-gray-700 leading-relaxed">
              {technology.tagline}
            </p>
          )}
        </header>

        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
            <div className="relative w-full aspect-video">
              <Image
                src={imageUrl}
                alt={technology.featuredImage?.alt || technology.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2 space-y-8">
            {technology.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">About</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={technology.description} />
                </div>
              </div>
            )}

            {technology.keyFeatures && technology.keyFeatures.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Key Features</h2>
                <ul className="space-y-2">
                  {technology.keyFeatures.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-gray-800">
                      <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-green-600"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {technology.methodology && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Methodology</h2>
                <div className="prose prose-lg max-w-none">
                  <PortableText value={technology.methodology} />
                </div>
              </div>
            )}

            {technology.targetUsers && technology.targetUsers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Who It&apos;s For</h2>
                <ul className="space-y-2">
                  {technology.targetUsers.map((u, i) => (
                    <li key={i} className="flex gap-3 text-gray-800">
                      <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Platform Details</h3>

              {(technology.launchDate || technology.lastMajorRelease) && (
                <div className="mb-4 text-sm space-y-1">
                  {technology.launchDate && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Launched:</span> {new Date(technology.launchDate).toLocaleDateString()}
                    </p>
                  )}
                  {technology.lastMajorRelease && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Last release:</span> {new Date(technology.lastMajorRelease).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {technology.techStack && technology.techStack.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {technology.techStack.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(technology.website || technology.githubRepo || technology.documentationUrl || technology.demoUrl) && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {technology.website && (
                    <a
                      href={technology.website}
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
                  {technology.githubRepo && (
                    <a
                      href={technology.githubRepo}
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
                  {technology.documentationUrl && (
                    <a
                      href={technology.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Documentation
                    </a>
                  )}
                  {technology.demoUrl && (
                    <a
                      href={technology.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-rose-600 hover:text-rose-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Demo
                    </a>
                  )}
                </div>
              )}
            </div>

            {technology.members && technology.members.length > 0 && (
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Team</h3>
                <div className="space-y-2">
                  {technology.members.map((member) => (
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

            {technology.relatedProjects && technology.relatedProjects.length > 0 && (
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Related Projects</h3>
                <div className="space-y-2">
                  {technology.relatedProjects.map((p) => (
                    <Link
                      key={p._id}
                      href={`/projects/${p.slug.current}`}
                      className="block text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/technologies"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Technologies
          </Link>
        </div>
      </article>
    </div>
  )
}
