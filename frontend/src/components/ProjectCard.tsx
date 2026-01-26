'use client';

import Image from "next/image";
import Link from "next/link";
import type { SanityProject } from "@/sanity/lib/types";

interface ProjectCardProps {
  project: SanityProject;
  variant?: 'default' | 'compact';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const isActive = project.status === 'ACTIVE' || project.status === 'UPCOMING';
  const imageUrl = project.featuredImage?.asset?.url;

  if (variant === 'compact') {
    return (
      <div className={`backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${!isActive ? 'opacity-90' : ''}`}>
        {imageUrl ? (
          <div className="h-48 overflow-hidden relative">
            <Image
              src={imageUrl}
              alt={project.featuredImage?.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            {/* Status Badge on Image */}
            <div className="absolute top-3 right-3">
              {isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg backdrop-blur-sm">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg backdrop-blur-sm">
                  Completed
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 flex items-center justify-center relative">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {/* Status Badge on Placeholder */}
            <div className="absolute top-3 right-3">
              {isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                  Completed
                </span>
              )}
            </div>
          </div>
        )}
        <div className="p-6">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-xl font-bold mb-3 text-gray-900 leading-tight hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed">
            {project.shortDescription}
          </p>

          <div className="flex flex-col gap-3">
            {/* Timeline */}
            {(project.startDate || project.endDate) && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 font-medium">
                  {project.startDate && project.endDate ? (
                    `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`
                  ) : project.startDate ? (
                    `Started ${new Date(project.startDate).getFullYear()}`
                  ) : project.endDate ? (
                    `Ended ${new Date(project.endDate).getFullYear()}`
                  ) : ''}
                </span>
              </div>
            )}

            {/* Research Areas Tags */}
            {project.researchAreas && project.researchAreas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.researchAreas.slice(0, 3).map((area, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full"
                  >
                    {area}
                  </span>
                ))}
                {project.researchAreas.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{project.researchAreas.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {(project.website || project.githubRepo) && (
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Website
                  </a>
                )}
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm font-medium rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-md hover:shadow-lg"
                    title="View on GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - more detailed card
  return (
    <div className={`backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] ${!isActive ? 'opacity-90' : ''}`}>
      {imageUrl ? (
        <div className="h-64 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={project.featuredImage?.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Link href={`/projects/${project.slug}`}>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg hover:text-blue-200 transition-colors">
                {project.title}
              </h3>
            </Link>
            {isActive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
                Active Project
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                Completed
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 flex items-center justify-center relative">
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="absolute top-4 right-4">
            {isActive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg">
                Completed
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {!imageUrl && (
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
              {project.title}
            </h3>
          </Link>
        )}

        <p className="text-gray-700 mb-6 leading-relaxed">{project.shortDescription}</p>

        <div className="space-y-4">
          {(project.startDate || project.endDate) && (
            <div className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700 font-medium">
                {project.startDate && project.endDate ? (
                  `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`
                ) : project.startDate ? (
                  `Started: ${new Date(project.startDate).toLocaleDateString()}`
                ) : project.endDate ? (
                  `Ended: ${new Date(project.endDate).toLocaleDateString()}`
                ) : 'Date not available'}
              </span>
            </div>
          )}

          {/* Research Areas */}
          {project.researchAreas && project.researchAreas.length > 0 && (
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
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                title="Visit Website"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-md hover:shadow-lg"
                title="View on GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
