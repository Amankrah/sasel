'use client';

import { useState } from 'react';
import Pagination from '@/components/Pagination';
import type { SanityPublication } from '@/sanity/lib/types';

interface Props {
  publications: SanityPublication[];
  itemsPerPage?: number;
}

export default function MemberPublicationsList({ publications, itemsPerPage = 10 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(publications.length / itemsPerPage);
  const paginated = publications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="space-y-4">
        {paginated.map((pub) => (
          <div key={pub._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{pub.title}</h3>
            <p className="text-gray-600 text-sm mb-3">
              {pub.journal || pub.conference || 'Publication'} • {pub.year}
            </p>
            <div className="flex gap-2">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                >
                  DOI
                </a>
              )}
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                >
                  Link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );
}
