import Image from 'next/image';
import { getPartners } from '@/sanity/lib/fetch';
import { urlForImage } from '@/sanity/lib/image';
import type { PartnerCategory, SanityPartner } from '@/sanity/lib/types';

export const revalidate = 60;

export const metadata = {
  title: 'Partners & Sponsors | SASEL Lab',
  description:
    'Full list of SASEL Lab academic, government, industry, and advisory partners, alongside the funders supporting our research.',
};

const CATEGORY_ORDER: PartnerCategory[] = [
  'FUNDER',
  'ACADEMIC',
  'GOVERNMENT',
  'INDUSTRY',
];

const CATEGORY_META: Record<
  PartnerCategory,
  { label: string; description: string; accent: string; dot: string }
> = {
  FUNDER: {
    label: 'Funders & Sponsors',
    description:
      'Public funding agencies and private sponsors that make the lab\u2019s research possible.',
    accent: 'from-amber-500 to-orange-600',
    dot: 'bg-amber-500',
  },
  ACADEMIC: {
    label: 'Academic & Research Institutions',
    description: 'Universities and research institutes collaborating on our active programs.',
    accent: 'from-blue-500 to-indigo-600',
    dot: 'bg-blue-500',
  },
  GOVERNMENT: {
    label: 'Government & Agencies',
    description:
      'Ministries, national agencies, and regional bodies embedded in our decision-support and policy work.',
    accent: 'from-green-500 to-emerald-600',
    dot: 'bg-green-500',
  },
  INDUSTRY: {
    label: 'Industry & NGOs',
    description:
      'Companies, NGOs, and sector associations that co-develop and deploy our technologies.',
    accent: 'from-purple-500 to-fuchsia-600',
    dot: 'bg-purple-500',
  },
};

function PartnerRow({ partner }: { partner: SanityPartner }) {
  const logoUrl = partner.logo ? urlForImage(partner.logo).width(320).url() : null;
  const content = (
    <div className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all h-full">
      <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={partner.logo?.alt || partner.name}
            width={56}
            height={56}
            className="object-contain w-full h-full p-1 filter grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <span className="text-xl font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
            {partner.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">
          {partner.name}
        </p>
        {partner.country && (
          <p className="text-xs text-gray-500 mt-0.5">{partner.country}</p>
        )}
        {partner.description && (
          <p className="text-sm text-gray-600 mt-2 leading-snug">{partner.description}</p>
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

export default async function PartnersPage() {
  const partners = await getPartners();
  const grouped: Record<PartnerCategory, SanityPartner[]> = {
    FUNDER: [],
    ACADEMIC: [],
    GOVERNMENT: [],
    INDUSTRY: [],
  };
  for (const p of partners) {
    grouped[p.category]?.push(p);
  }

  const countries = new Set<string>();
  for (const p of partners) {
    if (p.country) countries.add(p.country);
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/40 to-green-50/40"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
            Partners & Sponsors
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            The institutions, agencies, funders, and industry partners that make SASEL Lab’s research possible, across projects and technologies on three continents.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mt-4"></div>
        </header>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="backdrop-blur-md bg-white/70 border border-white/80 rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {partners.length}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Total partners</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {countries.size}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Countries represented</div>
              </div>
              {CATEGORY_ORDER.map((c) => (
                <div key={c}>
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${CATEGORY_META[c].accent} bg-clip-text text-transparent`}
                  >
                    {grouped[c].length}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mt-1">
                    {CATEGORY_META[c].label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {CATEGORY_ORDER.map((category) => {
          const items = grouped[category];
          if (items.length === 0) return null;
          const meta = CATEGORY_META[category];
          return (
            <section key={category} className="mb-16 max-w-7xl mx-auto">
              <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-xl p-5 mb-6 shadow-lg">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${meta.dot}`}></span>
                  <h2 className="text-2xl font-bold text-gray-900">{meta.label}</h2>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{meta.description}</p>
                <div className={`w-20 h-0.5 bg-gradient-to-r ${meta.accent} mt-3`}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((partner) => (
                  <PartnerRow key={partner._id} partner={partner} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
