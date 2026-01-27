import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblebox = 5;

        if (totalPages <= maxVisiblebox) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first
            pageNumbers.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                end = 4;
            }
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) {
                pageNumbers.push('...');
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (end < totalPages - 1) {
                pageNumbers.push('...');
            }

            // Always show last
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors ${currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'
                    }`}
            >
                Previous
            </button>

            <div className="flex gap-1">
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 py-1 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'
                    }`}
            >
                Next
            </button>
        </div>
    );
}
