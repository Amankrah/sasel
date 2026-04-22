'use client';

import { useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/Pagination';
import type { SanityPublication } from '@/sanity/lib/types';

interface Props {
  publications: SanityPublication[];
}

const PUBLICATION_TYPES = [
  { key: 'JOURNAL', label: 'Journal Articles', color: 'blue' },
  { key: 'CONF', label: 'Conference Papers', color: 'purple' },
  { key: 'BOOK', label: 'Books', color: 'green' },
  { key: 'CHAPTER', label: 'Book Chapters', color: 'emerald' },
  { key: 'THESIS', label: 'Theses', color: 'indigo' },
  { key: 'REPORT', label: 'Technical Reports', color: 'amber' },
  { key: 'PREPRINT', label: 'Preprints', color: 'pink' },
  { key: 'OTHER', label: 'Other Publications', color: 'gray' },
];

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
};

function getTypeColor(type: string): string {
  const t = PUBLICATION_TYPES.find((p) => p.key === type);
  return COLOR_MAP[t?.color || 'gray'];
}

function formatAuthors(pub: SanityPublication): string {
  const labAuthors = (pub.authors || []).map((a) => a.name).filter(Boolean).join(', ');
  const ext = pub.externalAuthors || '';
  if (labAuthors && ext) return `${labAuthors}, ${ext}`;
  return labAuthors || ext || 'Authors information unavailable';
}

export default function PublicationsList({ publications }: Props) {
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterType, filterAuthor]);

  const years = useMemo(
    () => [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a),
    [publications],
  );
  const authors = useMemo(
    () =>
      [
        ...new Set(
          publications.flatMap((p) => (p.authors || []).map((a) => a.name)).filter(Boolean),
        ),
      ].sort(),
    [publications],
  );

  const filtered = useMemo(() => {
    return publications.filter((pub) => {
      if (filterYear !== null && pub.year !== filterYear) return false;
      if (filterType !== null && pub.publicationType !== filterType) return false;
      if (filterAuthor !== null) {
        const has = (pub.authors || []).some((a) => a.name === filterAuthor);
        if (!has) return false;
      }
      return true;
    });
  }, [publications, filterYear, filterType, filterAuthor]);

  const sorted = useMemo(() => {
    const isMcGill = (pub: SanityPublication) =>
      (pub.authors || []).some((a) => {
        if (!a.joinedDate) return false;
        return pub.year >= new Date(a.joinedDate).getFullYear();
      });
    return [...filtered].sort((a, b) => {
      const aMcGill = isMcGill(a);
      const bMcGill = isMcGill(b);
      if (aMcGill && !bMcGill) return -1;
      if (!aMcGill && bMcGill) return 1;
      if (b.year !== a.year) return b.year - a.year;
      return (b.month || 0) - (a.month || 0);
    });
  }, [filtered]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="mb-8 max-w-5xl mx-auto">
        <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <label htmlFor="year-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                📅 Filter by Year
              </label>
              <select
                id="year-filter"
                className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                value={filterYear || ''}
                onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                📚 Filter by Type
              </label>
              <select
                id="type-filter"
                className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                value={filterType || ''}
                onChange={(e) => setFilterType(e.target.value || null)}
              >
                <option value="">All Types</option>
                {PUBLICATION_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="author-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                👤 Filter by Author
              </label>
              <select
                id="author-filter"
                className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                value={filterAuthor || ''}
                onChange={(e) => setFilterAuthor(e.target.value || null)}
              >
                <option value="">All Authors</option>
                {authors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(filterYear !== null || filterType !== null || filterAuthor !== null) && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setFilterYear(null);
                  setFilterType(null);
                  setFilterAuthor(null);
                }}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-indigo-600">{sorted.length}</span> of {publications.length} publications
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {paginated.length > 0 ? (
          <>
            {paginated.map((pub) => (
              <div
                key={pub._id}
                className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(pub.publicationType)}`}>
                    {PUBLICATION_TYPES.find((t) => t.key === pub.publicationType)?.label || pub.publicationType}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
                    {pub.year}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{pub.title}</h2>

                <div className="mb-3">
                  <p className="text-gray-700 text-sm leading-relaxed">{formatAuthors(pub)}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {(pub.journal || pub.conference) && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-600 flex-shrink-0">{pub.journal ? '📖' : '🎤'}</span>
                      <p className="text-gray-700">
                        <span className="font-semibold">{pub.journal || pub.conference}</span>
                        {pub.volume && `, Vol. ${pub.volume}`}
                        {pub.issue && `, Issue ${pub.issue}`}
                        {pub.pages && `, pp. ${pub.pages}`}
                      </p>
                    </div>
                  )}
                  {pub.publisher && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">🏢</span>
                      <p className="text-gray-700">{pub.publisher}</p>
                    </div>
                  )}
                </div>

                {(pub.doi || pub.url) && (
                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                      >
                        DOI
                      </a>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg font-medium text-gray-700 mb-2">No publications found</p>
              <p className="text-sm text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
