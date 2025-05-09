import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MoviePagination({
  currentPage,
  totalPages,
  onPageChange,
}: MoviePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="my-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={
                currentPage > 1
                  ? () => onPageChange(currentPage - 1)
                  : undefined
              }
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* First page */}
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {/* Page numbers */}
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            // Calculate the page number to display
            let pageNum;
            if (totalPages <= 5) {
              // If we have 5 or fewer pages, show all pages
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // If we're near the beginning, show pages 1-5
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If we're near the end, show the last 5 pages
              pageNum = totalPages - 4 + i;
            } else {
              // Otherwise show 2 pages before and 2 pages after current page
              pageNum = currentPage - 2 + i;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Last page ellipsis */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={
                currentPage < totalPages
                  ? () => onPageChange(currentPage + 1)
                  : undefined
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
