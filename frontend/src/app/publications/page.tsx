'use client';

import { useApi } from "@/lib/api/ApiContext";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";

export default function PublicationsPage() {
  const { publications, loading, error } = useApi();
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterType, filterAuthor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-4">
          There was an error loading the publications. Please try again later.
        </p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  // Get unique years for filter
  const years = Array.isArray(publications)
    ? [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a)
    : [];

  // Get unique authors for filter
  const authors = Array.isArray(publications)
    ? [...new Set(publications.flatMap(pub => Array.isArray(pub.authors) ? pub.authors.map((a) => typeof a === 'number' ? '' : (a as LabMember).name).filter(Boolean) : []))].sort()
    : [];

  // Publication types for filter with colors
  const publicationTypes = [
    { key: 'JOURNAL', label: 'Journal Articles', color: 'blue' },
    { key: 'CONF', label: 'Conference Papers', color: 'purple' },
    { key: 'BOOK', label: 'Books', color: 'green' },
    { key: 'CHAPTER', label: 'Book Chapters', color: 'emerald' },
    { key: 'THESIS', label: 'Theses', color: 'indigo' },
    { key: 'REPORT', label: 'Technical Reports', color: 'amber' },
    { key: 'OTHER', label: 'Other Publications', color: 'gray' },
  ];

  // Function to get publication type color classes
  const getTypeColor = (type: string) => {
    const typeConfig = publicationTypes.find(t => t.key === type);
    const color = typeConfig?.color || 'gray';

    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return colorMap[color] || colorMap.gray;
  };

  // Format authors for display (lab members + external authors)
  const formatAuthors = (pub: Publication) => {
    const labAuthors = Array.isArray(pub.authors)
      ? pub.authors.map((a) => typeof a === 'number' ? '' : (a as LabMember).name).filter(Boolean).join(', ')
      : '';
    const extAuthors = pub.external_authors || '';

    if (labAuthors && extAuthors) {
      return `${labAuthors}, ${extAuthors}`;
    }
    return labAuthors || extAuthors || 'Authors information unavailable';
  };

  // Filter publications
  const filteredPublications = Array.isArray(publications)
    ? publications.filter(pub => {
      let matches = true;
      if (filterYear !== null) {
        matches = matches && pub.year === filterYear;
      }
      if (filterType !== null) {
        matches = matches && pub.publication_type === filterType;
      }
      if (filterAuthor !== null) {
        const hasAuthor = Array.isArray(pub.authors)
          ? pub.authors.some((a) => typeof a === 'number' ? false : (a as LabMember).name === filterAuthor)
          : false;
        matches = matches && hasAuthor;
      }
      return matches;
    })
    : [];

  // Sort publications: McGill priority (Published >= Joined Date) -> Year -> Month
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    // Determine if "McGill Era"
    // Since we don't strictly have joined dates for everyone yet, let's look for the author listed in the publication.
    // If ANY of the lab authors on this paper has a joined_date <= pub.year, we consider it Priority.
    // Fallback: If no joined_date, treat as standard (not priority) or rely on secondary sort.

    const isMcGill = (pub: Publication) => {
      if (!Array.isArray(pub.authors)) return false;
      return pub.authors.some((author) => {
        if (typeof author === 'number') return false;
        const labMember = author as LabMember;
        if (!labMember.joined_date) return false;
        const joinedYear = new Date(labMember.joined_date).getFullYear();
        return pub.year >= joinedYear;
      });
    };

    const aIsMcGill = isMcGill(a);
    const bIsMcGill = isMcGill(b);

    if (aIsMcGill && !bIsMcGill) return -1;
    if (!aIsMcGill && bIsMcGill) return 1;

    if (b.year !== a.year) return b.year - a.year;
    return (b.month || 0) - (a.month || 0);
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedPublications.length / itemsPerPage);
  const paginatedPublications = sortedPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"></div>
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Publications
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our research contributions in sustainable agrifood systems and environmental nutrition
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 max-w-5xl mx-auto">
          <div className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="flex-1">
                <label htmlFor="year-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                  📅 Filter by Year
                </label>
                <select
                  id="year-filter"
                  className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                  value={filterYear || ''}
                  onChange={e => setFilterYear(e.target.value ? Number(e.target.value) : null)}
                  aria-label="Filter by year"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="type-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                  📚 Filter by Type
                </label>
                <select
                  id="type-filter"
                  className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                  value={filterType || ''}
                  onChange={e => setFilterType(e.target.value || null)}
                  aria-label="Filter by publication type"
                >
                  <option value="">All Types</option>
                  {publicationTypes.map(type => (
                    <option key={type.key} value={type.key}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="author-filter" className="block text-sm font-semibold text-gray-800 mb-2">
                  👤 Filter by Author
                </label>
                <select
                  id="author-filter"
                  className="block w-full rounded-lg border-2 border-gray-300 bg-white/90 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-gray-900 font-medium transition-colors"
                  value={filterAuthor || ''}
                  onChange={e => setFilterAuthor(e.target.value || null)}
                  aria-label="Filter by author"
                >
                  <option value="">All Authors</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>

            {(filterYear !== null || filterType !== null || filterAuthor !== null) && (
              <div className="mt-4 flex justify-end">
                <button
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


            {/* Result Count */}
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-700">
                Showing <span className="font-bold text-indigo-600">{sortedPublications.length}</span> of {publications?.length || 0} publications
              </p>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="max-w-6xl mx-auto space-y-6">
          {Array.isArray(paginatedPublications) && paginatedPublications.length > 0 ? (
            <>
              {paginatedPublications.map(pub => (
                <div
                  key={pub.id}
                  className="backdrop-blur-md bg-white/60 border border-white/80 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Publication Type Badge */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(pub.publication_type)}`}>
                      {publicationTypes.find(t => t.key === pub.publication_type)?.label || pub.publication_type}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
                      {pub.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">
                    {pub.title}
                  </h2>

                  {/* Authors */}
                  <div className="mb-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {formatAuthors(pub)}
                    </p>
                  </div>

                  {/* Publication Details */}
                  <div className="space-y-2 mb-4">
                    {/* Journal/Conference */}
                    {(pub.journal || pub.conference) && (
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-gray-600 flex-shrink-0">
                          {pub.journal ? '📖' : '🎤'}
                        </span>
                        <p className="text-gray-700">
                          <span className="font-semibold">
                            {pub.journal || pub.conference}
                          </span>
                          {pub.volume && `, Vol. ${pub.volume}`}
                          {pub.issue && `, Issue ${pub.issue}`}
                          {pub.pages && `, pp. ${pub.pages}`}
                        </p>
                      </div>
                    )}

                    {/* Publisher */}
                    {pub.publisher && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">🏢</span>
                        <p className="text-gray-700">{pub.publisher}</p>
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  {(pub.doi || pub.url) && (
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
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
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Publication
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
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
      </div>
    </div>
  );
} 