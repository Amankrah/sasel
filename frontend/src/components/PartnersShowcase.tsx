'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import type { PartnerCategory, SanityPartner } from '@/sanity/lib/types';

const QUERY = `*[_type == "partner"] | order(category asc, featuredOrder asc, name asc) {
  _id,
  name,
  slug,
  category,
  country,
  website,
  logo { asset, alt },
  description,
  isFeatured,
  featuredOrder
}`;

const CATEGORY_META: Record<PartnerCategory, { label: string; accent: string; ring: string; iconColor: string; dot: string }> = {
  FUNDER: {
    label: 'Funders & Sponsors',
    accent: 'from-amber-500 to-orange-600',
    ring: 'hover:border-amber-300/60',
    iconColor: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  ACADEMIC: {
    label: 'Academic & Research',
    accent: 'from-blue-500 to-indigo-600',
    ring: 'hover:border-blue-300/60',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  GOVERNMENT: {
    label: 'Government & Agencies',
    accent: 'from-green-500 to-emerald-600',
    ring: 'hover:border-green-300/60',
    iconColor: 'text-green-600',
    dot: 'bg-green-500',
  },
  INDUSTRY: {
    label: 'Industry & NGOs',
    accent: 'from-purple-500 to-fuchsia-600',
    ring: 'hover:border-purple-300/60',
    iconColor: 'text-purple-600',
    dot: 'bg-purple-500',
  },
  ADVISORY: {
    label: 'Advisory Boards',
    accent: 'from-rose-500 to-pink-600',
    ring: 'hover:border-rose-300/60',
    iconColor: 'text-rose-600',
    dot: 'bg-rose-500',
  },
};

const DISPLAY_ORDER: PartnerCategory[] = [
  'ACADEMIC',
  'GOVERNMENT',
  'INDUSTRY',
  'ADVISORY',
];

function PartnerTile({ partner }: { partner: SanityPartner }) {
  const logoUrl = partner.logo ? urlForImage(partner.logo).width(320).url() : null;
  const content = (
    <div className="group flex items-start gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200/60 hover:shadow-md hover:border-gray-300 transition-all duration-200 h-full">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={partner.logo?.alt || partner.name}
            width={48}
            height={48}
            className="object-contain w-full h-full p-1 filter grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <span className="text-lg font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
            {partner.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
          {partner.name}
        </p>
        {partner.country && (
          <p className="text-xs text-gray-500 mt-0.5">{partner.country}</p>
        )}
      </div>
    </div>
  );
  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
      title={partner.name}
    >
      {content}
    </a>
  ) : (
    <div className="block h-full">{content}</div>
  );
}

function FunderLogo({ partner }: { partner: SanityPartner }) {
  const logoUrl = partner.logo ? urlForImage(partner.logo).width(400).url() : null;
  const body = logoUrl ? (
    <Image
      src={logoUrl}
      alt={partner.logo?.alt || partner.name}
      width={200}
      height={80}
      className="object-contain h-16 md:h-20 filter grayscale group-hover:grayscale-0 transition-all duration-300"
    />
  ) : (
    <div className="text-center">
      <p className="text-base font-bold text-gray-800">{partner.name}</p>
      {partner.country && <p className="text-xs text-gray-500 mt-1">{partner.country}</p>}
    </div>
  );
  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center p-6 backdrop-blur-sm bg-white/80 border border-gray-200/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
      title={partner.name}
    >
      {body}
    </a>
  ) : (
    <div className="flex items-center justify-center p-6 backdrop-blur-sm bg-white/80 border border-gray-200/60 rounded-xl shadow-lg">
      {body}
    </div>
  );
}

export default function PartnersShowcase() {
  const [partners, setPartners] = useState<SanityPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<SanityPartner[]>(QUERY)
      .then((data) => {
        if (!cancelled) setPartners(data || []);
      })
      .catch((err) => console.error('PartnersShowcase fetch failed:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const byCategory: Record<PartnerCategory, SanityPartner[]> = {
      FUNDER: [],
      ACADEMIC: [],
      GOVERNMENT: [],
      INDUSTRY: [],
      ADVISORY: [],
    };
    for (const p of partners) {
      byCategory[p.category]?.push(p);
    }
    return byCategory;
  }, [partners]);

  const featuredFunders = useMemo(
    () => grouped.FUNDER.filter((p) => p.isFeatured).slice(0, 8),
    [grouped],
  );

  const detailCategories = DISPLAY_ORDER.filter((c) => grouped[c].length > 0);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-green-500 to-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
            Our Sponsors &amp; Partners
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Collaborating with leading institutions, government agencies, industry, and funders across three continents to advance sustainable food systems research.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mt-4"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {featuredFunders.length > 0 && (
              <div className="mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {featuredFunders.map((partner) => (
                    <FunderLogo key={partner._id} partner={partner} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {detailCategories.map((category) => {
                const meta = CATEGORY_META[category];
                const items = grouped[category];
                return (
                  <div
                    key={category}
                    className="backdrop-blur-sm bg-white/90 border border-gray-200/60 p-6 rounded-2xl shadow-xl"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${meta.dot}`}></span>
                        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                          {meta.label}
                        </h3>
                        <span className="ml-auto text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      </div>
                      <div className={`w-16 h-0.5 bg-gradient-to-r ${meta.accent} mt-2`}></div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((partner) => (
                        <PartnerTile key={partner._id} partner={partner} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {partners.length === 0 && (
              <div className="max-w-md mx-auto">
                <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-4">🤝</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Partners coming soon</p>
                  <p className="text-sm text-gray-600">
                    Add partners in Sanity Studio to populate this section.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
