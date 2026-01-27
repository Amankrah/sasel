'use client';

import Image from "next/image";
import Link from "next/link";
import type { SanityNews } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface NewsCardProps {
  news: SanityNews;
  variant?: 'default' | 'compact';
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

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const imageUrl = news.featuredImage 
    ? urlForImage(news.featuredImage).width(800).height(450).fit('crop').url() 
    : null;
  const publishedDate = news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  if (variant === 'compact') {
    return (
      <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <Link href={`/news/${news.slug.current}`}>
          <div className="flex flex-col md:flex-row">
            {imageUrl && (
              <div className="md:w-48 aspect-[16/9] md:aspect-square overflow-hidden relative flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={news.featuredImage?.alt || news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 200px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${newsTypeColors[news.newsType]}`}>
                  {newsTypeLabels[news.newsType]}
                </span>
                {news.isFeatured && (
                  <span className="text-yellow-500 text-sm">⭐</span>
                )}
                <span className="text-sm text-gray-500">{publishedDate}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                {news.title}
              </h3>
              {news.excerpt && (
                <p className="text-gray-700 line-clamp-2 text-sm">
                  {news.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default variant
  return (
    <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      {imageUrl ? (
        <div className="w-full aspect-[16/9] overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={news.featuredImage?.alt || news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${newsTypeColors[news.newsType]} backdrop-blur-sm`}>
              {newsTypeLabels[news.newsType]}
            </span>
          </div>
          {news.isFeatured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white backdrop-blur-sm">
                ⭐ Featured
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Link href={`/news/${news.slug.current}`}>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg hover:text-blue-200 transition-colors">
                {news.title}
              </h3>
            </Link>
            <p className="text-sm text-white/90 drop-shadow">{publishedDate}</p>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 flex items-center justify-center relative">
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${newsTypeColors[news.newsType]}`}>
              {newsTypeLabels[news.newsType]}
            </span>
          </div>
          {news.isFeatured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                ⭐ Featured
              </span>
            </div>
          )}
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      <div className="p-6">
        {!imageUrl && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${newsTypeColors[news.newsType]}`}>
                {newsTypeLabels[news.newsType]}
              </span>
              <span className="text-sm text-gray-500">{publishedDate}</span>
            </div>
            <Link href={`/news/${news.slug.current}`}>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                {news.title}
              </h3>
            </Link>
          </div>
        )}

        {news.excerpt && (
          <p className="text-gray-700 mb-4 leading-relaxed">{news.excerpt}</p>
        )}

        <Link
          href={`/news/${news.slug.current}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
