import { React, useState, useEffect, useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
import 'bootstrap/dist/css/bootstrap.css';

export default function Paginate({
  total = 0,
  itemPerPage = 10,
  currentPage = 1,
  onPageChange
}) {
  const [totalPages, SetTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemPerPage > 0) {
      SetTotalPages(Math.ceil(total / itemPerPage));
    }
  }, [total, itemPerPage]);

  const paginationItem = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pages;
  }, [totalPages, currentPage]);

  if (totalPages === 0) return null;

  return (
    <>
    <Pagination>
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {paginationItem}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
    </>
  );
}
