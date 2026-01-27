'use client';

import Link from "next/link";
import { getFeaturedNews } from "@/sanity/lib/fetch";
import type { SanityNews } from "@/sanity/lib/types";
import NewsCard from "./NewsCard";
import { useEffect, useState } from "react";

export default function NewsSection() {
  const [news, setNews] = useState<SanityNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const featuredNews = await getFeaturedNews();
        setNews(featuredNews || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Latest News & Announcements
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Latest News & Announcements
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4">
            Stay updated with our latest achievements, publications, awards, and events
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto"></div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {news.slice(0, 6).map((item) => (
            <NewsCard key={item._id} news={item} variant="compact" />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            View All News
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
