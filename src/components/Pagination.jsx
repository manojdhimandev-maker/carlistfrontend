import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable Pagination Component
 * 
 * @param {number} currentPage - 1-based active page number
 * @param {number} totalPages - Total number of pages
 * @param {number} totalRecords - Total count of records
 * @param {number} pageSize - Number of items displayed per page
 * @param {function} onPageChange - Callback when a new page is selected (receives page number)
 * @param {string} [itemName='items'] - Label for items (e.g. 'cars', 'vehicles', 'enquiries')
 * @param {boolean} [showSummary=true] - Whether to render summary info
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  pageSize = 10,
  onPageChange,
  itemName = 'items',
  showSummary = true,
}) {
  // If no records at all, do not render pagination
  if (totalRecords <= 0) {
    return null;
  }

  // Safe clamping
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

  // Range calculations for summary
  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalRecords);

  // Generate page numbers with intelligent ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (safeTotalPages <= 7) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (safeCurrentPage < safeTotalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(safeTotalPages)) {
        pages.push(safeTotalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page !== 'number') return;
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePrev = () => {
    if (safeCurrentPage > 1 && onPageChange) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < safeTotalPages && onPageChange) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      {showSummary && (
        <div className="pagination-summary">
          Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
          <strong>{totalRecords}</strong> {itemName}
          {safeTotalPages > 1 && (
            <span style={{ marginLeft: '6px', color: 'var(--muted-foreground)' }}>
              (Page {safeCurrentPage} of {safeTotalPages})
            </span>
          )}
        </div>
      )}

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-nav-btn"
          onClick={handlePrev}
          disabled={safeCurrentPage <= 1}
          aria-label="Previous page"
        >
          <FiChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination-page-btn ${page === safeCurrentPage ? 'active' : ''}`}
                onClick={() => handlePageClick(page)}
                disabled={page === safeCurrentPage}
                aria-label={`Page ${page}`}
                aria-current={page === safeCurrentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="pagination-nav-btn"
          onClick={handleNext}
          disabled={safeCurrentPage >= safeTotalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <FiChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}

