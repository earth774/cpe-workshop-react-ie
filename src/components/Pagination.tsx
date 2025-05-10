import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  pageSize = 10,
  onPageSizeChange,
  totalItems,
}: PaginationProps) => {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const pageNumbers: number[] = [];

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems
    ? Math.min(currentPage * pageSize, totalItems)
    : null;

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
      <div className="flex items-center text-xs text-gray-600 space-x-4">
        {startItem && endItem && (
          <div>
            แสดง {startItem}-{endItem} จาก {totalItems} รายการ
          </div>
        )}

        {onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-xs">แสดง</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="form-input text-xs py-1 px-2 text-sm rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-xs">รายการต่อหน้า</span>
          </div>
        )}
      </div>

      <nav className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiChevronLeft />
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiChevronRight />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
