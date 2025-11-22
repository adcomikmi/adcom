// src/components/common/Pagination.jsx
import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 bg-neum-bg text-sm font-medium text-gray-700 rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active disabled:opacity-50 disabled:shadow-neum-in"
      >
        <HiChevronLeft className="mr-2 h-5 w-5" />
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 bg-neum-bg text-sm font-medium text-gray-700 rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active disabled:opacity-50 disabled:shadow-neum-in"
      >
        Next
        <HiChevronRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );
}

export default Pagination;