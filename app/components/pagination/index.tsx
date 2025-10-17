"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { getPaginationRange } from "../../utils/getPaginationRange";

type PaginationProps = {
  count: number | undefined;
  currentPage: number | undefined;
  nextPage: number | undefined | null;
  lastPage: number | undefined | null;
  prevPage: number | undefined | null;
};

export default function Pagination({
  count,
  currentPage,
  nextPage,
  lastPage,
  prevPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChangePage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  const current = currentPage ?? 1;
  const total = lastPage ?? 1;
  const paginationRange = getPaginationRange(current, total);

  return (
    <>
      {count !== 0 && (
        <nav aria-label="Page navigation">
          <ul className="flex items-center flex-wrap gap-1 h-10 text-base">
            {total > 1 && (
              <li>
                <button
                  disabled={!prevPage}
                  onClick={() => handleChangePage(prevPage!)}
                  className="flex items-center justify-center  px-1 md:px-4 h-8 md:h-10
               text-gray-500 bg-white border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 
               disabled:cursor-not-allowed cursor-pointer"
                >
                  <GrFormPrevious size={20} />
                  <span className="sr-only">Previous</span>
                </button>
              </li>
            )}

            {paginationRange.map((item, index) => {
              if (item === "...") {
                return (
                  <li key={`ellipsis-${index}`}>
                    <span className="px-3 text-gray-500 select-none cursor-pointer">
                      ...
                    </span>
                  </li>
                );
              }

              const pageNumber = item as number;
              const isActive = pageNumber === current;

              return (
                <li key={pageNumber}>
                  <button
                    onClick={() => handleChangePage(pageNumber)}
                    disabled={isActive}
                    aria-current={isActive ? "page" : undefined}
                    className={`${
                      isActive
                        ? "text-white bg-gray-700 border border-gray-700 cursor-not-allowed"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                    } px-2 md:px-4 h-8 md:h-10 rounded transition-all`}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            })}

            {total > 1 && (
              <li>
                <button
                  disabled={!nextPage}
                  onClick={() => handleChangePage(nextPage!)}
                  className="flex items-center justify-center px-1 md:px-4 h-8 md:h-10 
                      text-gray-500 bg-white border border-gray-300 rounded-r 
                      hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <GrFormNext size={20} />
                  <span className="sr-only">Next</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}
