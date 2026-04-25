import { getNews } from '@/sanity/lib/fetch'
import type { SanityNews } from '@/sanity/lib/types'
import NewsCard from '@/components/NewsCard'

export const revalidate = 60

export const metadata = {
  title: 'News & Announcements | SASEL Lab',
  description: 'Stay updated with the latest news, awards, publications, grants, and events from the SASEL Lab.',
}

export default async function NewsPage() {
  const allNews = await getNews() as SanityNews[]

  const featuredNews = allNews?.filter((news) => news.isFeatured) || []
  const regularNews = allNews?.filter((news) => !news.isFeatured) || []

  // Group news by type
  const newsByType = allNews?.reduce((acc, news) => {
    if (!acc[news.newsType]) {
      acc[news.newsType] = []
    }
    acc[news.newsType].push(news)
    return acc
  }, {} as Record<string, SanityNews[]>) || {}

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            News & Announcements
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stay updated with the latest news, awards, publications, grants, and events from our lab
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mt-4"></div>
        </div>

        {/* News Summary Stats */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {featuredNews.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Featured</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {allNews?.length || 0}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Total News</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Object.keys(newsByType).length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <section className="mb-16 max-w-7xl mx-auto">
            <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900">
                <span className="inline-flex items-center gap-2">
                  ⭐ Featured News
                  <span className="text-lg font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    {featuredNews.length}
                  </span>
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((news) => (
                <NewsCard key={news._id} news={news} />
              ))}
            </div>
          </section>
        )}

        {/* All News */}
        <section className="max-w-7xl mx-auto">
          <div className="backdrop-blur-md bg-white/50 border border-white/60 rounded-xl p-4 mb-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900">
              <span className="inline-flex items-center gap-2">
                All News
                <span className="text-lg font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {regularNews.length + featuredNews.length}
                </span>
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.length > 0 ? (
              allNews.map((news) => (
                <NewsCard key={news._id} news={news} />
              ))
            ) : (
              <div className="col-span-full">
                <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
                  <div className="text-6xl mb-4">📰</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">No news yet</p>
                  <p className="text-sm text-gray-600">Check back soon for updates</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
