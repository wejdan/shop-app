function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center space-x-2 my-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
      >
        Previous
      </button>
      {/* Current Page Number */}
      <span>
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
