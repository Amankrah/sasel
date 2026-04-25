import { getTechnologies } from '@/sanity/lib/fetch'
import type { SanityTechnology } from '@/sanity/lib/types'
import TechnologyCard from '@/components/TechnologyCard'

export const revalidate = 60

export const metadata = {
  title: 'Technologies | SASEL Lab',
  description: 'Software platforms and tools built by SASEL Lab for sustainable agrifood research.',
}

export default async function TechnologiesPage() {
  const technologies = await getTechnologies() as SanityTechnology[]

  const live = technologies?.filter((t) => t.status === 'LIVE') || []
  const beta = technologies?.filter((t) => t.status === 'BETA') || []
  const inDev = technologies?.filter((t) => t.status === 'IN_DEVELOPMENT') || []
  const deprecated = technologies?.filter((t) => t.status === 'DEPRECATED') || []

  const renderSection = (
    title: string,
    items: SanityTechnology[],
    badgeClasses: string,
    emoji: string,
    emptyMessage: string,
  ) => (
    <section className="mb-16 max-w-7xl mx-auto">
      <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900">
          <span className="inline-flex items-center gap-2">
            {title}
            {items.length > 0 && (
              <span className={`text-lg font-semibold px-3 py-1 rounded-full ${badgeClasses}`}>
                {items.length}
              </span>
            )}
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.length > 0 ? (
          items.map((tech) => (
            <TechnologyCard key={tech._id} technology={tech} variant="compact" />
          ))
        ) : (
          <div className="col-span-full">
            <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">{emoji}</div>
              <p className="text-lg font-medium text-gray-700 mb-2">{emptyMessage}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Our Technologies
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Software platforms and tools developed by SASEL Lab to advance sustainable agrifood systems research and decision-making.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mt-4"></div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {live.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Live</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                  {beta.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Beta</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {inDev.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">In Development</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {technologies?.length || 0}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Total</div>
              </div>
            </div>
          </div>
        </div>

        {renderSection('Live', live, 'bg-green-100 text-green-800', '🚀', 'No live technologies yet')}
        {beta.length > 0 && renderSection('Beta', beta, 'bg-amber-100 text-amber-800', '🧪', 'No beta technologies')}
        {inDev.length > 0 && renderSection('In Development', inDev, 'bg-blue-100 text-blue-800', '🛠️', 'Nothing in development')}
        {deprecated.length > 0 && renderSection('Deprecated', deprecated, 'bg-gray-200 text-gray-700', '📦', 'No deprecated technologies')}
      </div>
    </div>
  )
}
