'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { client } from '@/sanity/lib/client';
import type { SanityProject } from '@/sanity/lib/types';

const FEATURED_QUERY = `*[_type == "project" && isFeatured == true] | order(featuredOrder asc, startDate desc) [0...3] {
  _id,
  _type,
  title,
  slug,
  shortDescription,
  featuredImage { asset, alt },
  status,
  isFeatured,
  startDate,
  endDate,
  researchAreas,
  website,
  githubRepo,
  members[]-> { _id, _type, name, slug }
}`;

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<SanityProject[]>(FEATURED_QUERY)
      .then((data) => {
        if (!cancelled) setProjects(data || []);
      })
      .catch((err) => {
        console.error('Failed to load featured projects:', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30"></div>

      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Featured Research Projects
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Active research programs advancing sustainable food systems, digital decision support, and international food-policy dialogue.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[0, 1, 2].map((i) => (
              <div key={i} className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-md mx-auto mb-16">
            <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🔬</div>
              <p className="text-lg font-medium text-gray-700 mb-2">Projects coming soon</p>
              <p className="text-sm text-gray-600">
                Mark projects as Featured in Sanity Studio to surface them here.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${projects.length >= 3 ? 'lg:grid-cols-3' : projects.length === 2 ? 'md:grid-cols-2' : ''} gap-8 mb-16 ${projects.length < 3 ? 'max-w-5xl mx-auto' : ''}`}
          >
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} variant="compact" />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            href="/projects"
            className="group inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Explore All Projects
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
