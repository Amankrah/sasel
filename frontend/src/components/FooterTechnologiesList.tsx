'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import type { TechnologyAccent } from '@/sanity/lib/types';

interface FooterTech {
  _id: string;
  title: string;
  slug: { current: string };
  website?: string;
  accentColor?: TechnologyAccent;
}

const FOOTER_QUERY = `*[_type == "technology" && isFeatured == true] | order(featuredOrder asc) [0...5] {
  _id,
  title,
  slug,
  website,
  accentColor
}`;

const DOT_COLORS: Record<TechnologyAccent, string> = {
  emerald: 'bg-emerald-600',
  amber: 'bg-orange-600',
  indigo: 'bg-purple-600',
  blue: 'bg-blue-600',
  rose: 'bg-rose-600',
};

const HOVER_COLORS: Record<TechnologyAccent, string> = {
  emerald: 'hover:text-emerald-600',
  amber: 'hover:text-orange-600',
  indigo: 'hover:text-purple-600',
  blue: 'hover:text-blue-600',
  rose: 'hover:text-rose-600',
};

export default function FooterTechnologiesList() {
  const [items, setItems] = useState<FooterTech[]>([]);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<FooterTech[]>(FOOTER_QUERY)
      .then((data) => {
        if (!cancelled) setItems(data || []);
      })
      .catch((err) => console.error('Footer technologies fetch failed:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="space-y-2.5">
      {items.map((tech) => {
        const accent = tech.accentColor || 'emerald';
        const href = tech.website || `/technologies/${tech.slug.current}`;
        const external = Boolean(tech.website);
        const LinkEl = external ? 'a' : Link;
        const linkProps = external
          ? { href, target: '_blank', rel: 'noopener noreferrer' }
          : { href };
        return (
          <li key={tech._id}>
            <LinkEl
              {...linkProps}
              className={`group inline-flex items-center text-sm text-gray-800 font-medium ${HOVER_COLORS[accent]} transition-colors duration-200`}
            >
              <span className={`w-1 h-1 ${DOT_COLORS[accent]} rounded-full mr-2 group-hover:w-2 transition-all duration-200`}></span>
              {tech.title}
            </LinkEl>
          </li>
        );
      })}
      <li>
        <Link
          href="/technologies"
          className="group inline-flex items-center text-sm text-green-700 font-semibold hover:text-green-900 transition-colors duration-200"
        >
          <span className="w-1 h-1 bg-green-600 rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
          View all →
        </Link>
      </li>
    </ul>
  );
}
