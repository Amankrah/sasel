'use client';

import Image from "next/image";
import Link from "next/link";
import type { SanityTechnology, TechnologyAccent, TechnologyStatus } from "@/sanity/lib/types";
import { urlForImage } from "@/sanity/lib/image";

interface TechnologyCardProps {
  technology: SanityTechnology;
  variant?: 'default' | 'compact' | 'hero';
}

const ACCENT_GRADIENTS: Record<TechnologyAccent, { header: string; cta: string; ctaHover: string; dot: string; overlay: string }> = {
  emerald: {
    header: 'from-emerald-500 via-green-500 to-teal-600',
    cta: 'from-emerald-600 to-teal-600',
    ctaHover: 'hover:from-emerald-700 hover:to-teal-700',
    dot: 'bg-emerald-600',
    overlay: 'from-emerald-400/20 via-green-400/20 to-teal-400/20',
  },
  amber: {
    header: 'from-amber-500 via-orange-500 to-yellow-600',
    cta: 'from-amber-600 to-orange-600',
    ctaHover: 'hover:from-amber-700 hover:to-orange-700',
    dot: 'bg-orange-600',
    overlay: 'from-amber-400/20 via-orange-400/20 to-yellow-400/20',
  },
  indigo: {
    header: 'from-indigo-600 via-purple-600 to-blue-700',
    cta: 'from-indigo-600 to-purple-600',
    ctaHover: 'hover:from-indigo-700 hover:to-purple-700',
    dot: 'bg-purple-600',
    overlay: 'from-indigo-400/20 via-purple-400/20 to-blue-400/20',
  },
  blue: {
    header: 'from-blue-500 via-cyan-500 to-teal-600',
    cta: 'from-blue-600 to-cyan-600',
    ctaHover: 'hover:from-blue-700 hover:to-cyan-700',
    dot: 'bg-blue-600',
    overlay: 'from-blue-400/20 via-cyan-400/20 to-teal-400/20',
  },
  rose: {
    header: 'from-rose-500 via-pink-500 to-fuchsia-600',
    cta: 'from-rose-600 to-pink-600',
    ctaHover: 'hover:from-rose-700 hover:to-pink-700',
    dot: 'bg-rose-600',
    overlay: 'from-rose-400/20 via-pink-400/20 to-fuchsia-400/20',
  },
  slate: {
    header: 'from-slate-700 via-slate-600 to-zinc-700',
    cta: 'from-slate-700 to-zinc-700',
    ctaHover: 'hover:from-slate-800 hover:to-zinc-800',
    dot: 'bg-slate-700',
    overlay: 'from-slate-400/20 via-zinc-400/20 to-gray-400/20',
  },
};

const STATUS_CONFIG: Record<TechnologyStatus, { label: string; classes: string }> = {
  LIVE: { label: 'Live', classes: 'bg-green-500 text-white' },
  BETA: { label: 'Beta', classes: 'bg-amber-500 text-white' },
  IN_DEVELOPMENT: { label: 'In Development', classes: 'bg-blue-500 text-white' },
  DEPRECATED: { label: 'Deprecated', classes: 'bg-gray-500 text-white' },
};

export default function TechnologyCard({ technology, variant = 'default' }: TechnologyCardProps) {
  const accent = ACCENT_GRADIENTS[technology.accentColor || 'emerald'];
  const statusConf = STATUS_CONFIG[technology.status];
  const imageUrl = technology.featuredImage
    ? urlForImage(technology.featuredImage).width(800).url()
    : null;
  const detailHref = `/technologies/${technology.slug.current}`;

  if (variant === 'hero') {
    return (
      <div className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 flex flex-col">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent.overlay}`}></div>

        <div className={`h-48 bg-gradient-to-br ${accent.header} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={technology.featuredImage?.alt || technology.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover mix-blend-overlay opacity-60"
            />
          ) : null}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{technology.title}</h3>
            {technology.categories && technology.categories.length > 0 && (
              <span className="text-xs text-white/90 mt-1 font-medium">
                {technology.categories.slice(0, 2).join(' • ')}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${statusConf.classes}`}>
              {statusConf.label}
            </span>
          </div>
        </div>

        <div className="p-6 relative z-10 flex-1 flex flex-col">
          {technology.tagline && (
            <h4 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{technology.tagline}</h4>
          )}
          {technology.keyFeatures && technology.keyFeatures.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">Key Features</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                {technology.keyFeatures.slice(0, 6).map((feature, i) => (
                  <li key={i} className="flex gap-2">
                    <span className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${accent.dot}`}></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-auto flex flex-col gap-2">
            {technology.website && (
              <a
                href={technology.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r ${accent.cta} ${accent.ctaHover} text-white rounded-lg transition-all shadow-md hover:shadow-lg`}
              >
                Visit {technology.title}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            <Link
              href={detailHref}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/70 border border-gray-200 text-gray-800 font-medium rounded-lg hover:bg-white transition-all"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col">
        {imageUrl ? (
          <div className="h-48 overflow-hidden relative">
            <Image
              src={imageUrl}
              alt={technology.featuredImage?.alt || technology.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${statusConf.classes}`}>
                {statusConf.label}
              </span>
            </div>
          </div>
        ) : (
          <div className={`h-48 bg-gradient-to-br ${accent.header} flex items-center justify-center relative`}>
            <span className="text-3xl font-bold text-white drop-shadow-lg">{technology.title}</span>
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${statusConf.classes}`}>
                {statusConf.label}
              </span>
            </div>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <Link href={detailHref}>
            <h3 className="text-xl font-bold mb-2 text-gray-900 leading-tight hover:text-blue-600 transition-colors">
              {technology.title}
            </h3>
          </Link>
          {technology.tagline && (
            <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed">
              {technology.tagline}
            </p>
          )}
          <div className="mt-auto flex flex-col gap-3">
            {technology.categories && technology.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {technology.categories.slice(0, 3).map((cat, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <Link
                href={detailHref}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r ${accent.cta} ${accent.ctaHover} text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg`}
              >
                Learn more
              </Link>
              {technology.githubRepo && (
                <a
                  href={technology.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm font-medium rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-md"
                  title="View on GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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

  // Default variant
  return (
    <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
      {imageUrl ? (
        <div className="h-64 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={technology.featuredImage?.alt || technology.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Link href={detailHref}>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg hover:text-blue-200 transition-colors">
                {technology.title}
              </h3>
            </Link>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${statusConf.classes}`}>
              {statusConf.label}
            </span>
          </div>
        </div>
      ) : (
        <div className={`h-64 bg-gradient-to-br ${accent.header} flex items-center justify-center relative`}>
          <span className="text-4xl font-bold text-white drop-shadow-lg">{technology.title}</span>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${statusConf.classes}`}>
              {statusConf.label}
            </span>
          </div>
        </div>
      )}
      <div className="p-6">
        {technology.tagline && (
          <p className="text-gray-700 mb-6 leading-relaxed">{technology.tagline}</p>
        )}
        <div className="space-y-4">
          {technology.techStack && technology.techStack.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {technology.techStack.slice(0, 6).map((t, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {technology.keyFeatures && technology.keyFeatures.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Key Features</p>
              <ul className="text-sm space-y-1 text-gray-700">
                {technology.keyFeatures.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${accent.dot}`}></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <Link
              href={detailHref}
              className={`flex-1 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r ${accent.cta} ${accent.ctaHover} text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg`}
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            {technology.website && (
              <a
                href={technology.website}
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
            {technology.githubRepo && (
              <a
                href={technology.githubRepo}
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
