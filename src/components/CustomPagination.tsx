import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { useState } from "react";

export type CustomPaginationProps = {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
};

const CustomPagination = ({
  totalPages,
  initialPage = 0,
  onPageChange,
}: CustomPaginationProps) => {
  const t = useTranslations("pagination");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirst}
          >
            {t("previous")}
          </PaginationPrevious>
        </PaginationItem>
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === currentPage - 1 ||
              page === currentPage ||
              page === currentPage + 1
          )
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLast}
          >
            {t("next")}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
