type BlogPaginationProps = {
  page: number;
  pageCount: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export default function BlogPagination({
  page,
  pageCount,
  isLoading = false,
  onPageChange,
}: BlogPaginationProps) {
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => hasPrevious && onPageChange(page - 1)}
        disabled={!hasPrevious || isLoading}
        className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Page <span className="font-semibold text-gray-900">{page}</span>
        </span>
        <span>of</span>
        <span className="font-semibold text-gray-900">{pageCount}</span>
      </div>

      <button
        type="button"
        onClick={() => hasNext && onPageChange(page + 1)}
        disabled={!hasNext || isLoading}
        className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}