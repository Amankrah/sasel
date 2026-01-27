import { getNewsBySlug, getNews } from '@/sanity/lib/fetch'
import type { SanityNews } from '@/sanity/lib/types'
import { urlForImage } from '@/sanity/lib/image'
import PortableText from '@/components/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface NewsPageProps {
  params: Promise<{ slug: string }>
}

const newsTypeColors: Record<SanityNews['newsType'], string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  AWARD: 'bg-yellow-100 text-yellow-700',
  PUBLICATION: 'bg-green-100 text-green-700',
  GRANT: 'bg-purple-100 text-purple-700',
  EVENT: 'bg-pink-100 text-pink-700',
  MEDIA: 'bg-indigo-100 text-indigo-700',
  TEAM: 'bg-orange-100 text-orange-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

const newsTypeLabels: Record<SanityNews['newsType'], string> = {
  NEWS: 'News',
  AWARD: 'Award',
  PUBLICATION: 'Publication',
  GRANT: 'Grant',
  EVENT: 'Event',
  MEDIA: 'Media',
  TEAM: 'Team Update',
  OTHER: 'Other',
};

export async function generateStaticParams() {
  const news = await getNews()
  return news.map((item) => ({
    slug: item.slug.current,
  }))
}

export async function generateMetadata({ params }: NewsPageProps) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    return {
      title: 'News Not Found | SASEL Lab',
    }
  }

  return {
    title: `${news.title} | SASEL Lab News`,
    description: news.excerpt || news.title,
  }
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const imageUrl = news.featuredImage 
    ? urlForImage(news.featuredImage).width(1200).height(675).fit('crop').url() 
    : null

  const publishedDate = news.publishedAt 
    ? new Date(news.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <article className="container mx-auto px-4 py-12 relative z-10 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${newsTypeColors[news.newsType]}`}>
              {newsTypeLabels[news.newsType]}
            </span>
            {news.isFeatured && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">
                ⭐ Featured
              </span>
            )}
            <span className="text-gray-600">{publishedDate}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {news.title}
          </h1>

          {news.excerpt && (
            <p className="text-xl text-gray-700 leading-relaxed">
              {news.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
            <div className="relative w-full aspect-[16/9] max-h-[600px]">
              <Image
                src={imageUrl}
                alt={news.featuredImage?.alt || news.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
            {news.featuredImage?.caption && (
              <p className="text-sm text-gray-600 text-center mt-3 px-4 italic">
                {news.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {news.body && (
          <div className="prose prose-lg max-w-none mb-8">
            <PortableText value={news.body} />
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* External Link */}
        {news.externalLink && (
          <div className="mb-8">
            <a
              href={news.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Read Full Article
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Back Button Footer */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All News
          </Link>
        </div>
      </article>
    </div>
  )
}
