'use client';

import { useApi } from "@/lib/api/ApiContext";
import { useState } from "react";

export default function PublicationsPage() {
  const { publications, loading, error } = useApi();
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

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
  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
  
  // Publication types for filter
  const publicationTypes = [
    { key: 'JOURNAL', label: 'Journal Articles' },
    { key: 'CONF', label: 'Conference Papers' },
    { key: 'BOOK', label: 'Books' },
    { key: 'CHAPTER', label: 'Book Chapters' },
    { key: 'THESIS', label: 'Theses' },
    { key: 'REPORT', label: 'Technical Reports' },
    { key: 'OTHER', label: 'Other Publications' },
  ];

  // Filter publications
  const filteredPublications = publications.filter(pub => {
    let matches = true;
    if (filterYear !== null) {
      matches = matches && pub.year === filterYear;
    }
    if (filterType !== null) {
      matches = matches && pub.publication_type === filterType;
    }
    return matches;
  });

  // Sort publications by year (newest first)
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return (b.month || 0) - (a.month || 0);
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Publications</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select 
            id="year-filter"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
        
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select 
            id="type-filter"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
      </div>
      
      {/* Publications List */}
      <div className="space-y-8">
        {sortedPublications.length > 0 ? (
          sortedPublications.map(pub => (
            <div key={pub.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{pub.title}</h2>
              
              <div className="text-gray-600 mb-3">
                {/* Authors */}
                <p className="mb-1">
                  {pub.external_authors || 'Authors information unavailable'}
                </p>
                
                {/* Journal/Conference */}
                <p className="mb-1">
                  <span className="font-medium">
                    {pub.journal || pub.conference || 'Publication venue not specified'}
                  </span>
                  {pub.volume && `, Volume ${pub.volume}`}
                  {pub.issue && `, Issue ${pub.issue}`}
                  {pub.pages && `, Pages ${pub.pages}`}
                </p>
                
                {/* Year, Publisher */}
                <p className="mb-1">
                  {pub.year}
                  {pub.publisher && ` · ${pub.publisher}`}
                </p>
              </div>
              
              {pub.abstract && (
                <div className="mt-4 mb-4">
                  <p className="text-gray-700 line-clamp-3">{pub.abstract}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-4">
                {pub.doi && (
                  <a 
                    href={`https://doi.org/${pub.doi}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    DOI: {pub.doi}
                  </a>
                )}
                
                {pub.url && (
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Publication
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No publications match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 