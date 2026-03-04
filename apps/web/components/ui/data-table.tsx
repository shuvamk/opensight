"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  sortKey?: string;
  align?: "left" | "right" | "center";
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (row: T) => string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  sortBy?: string;
  onSort?: (sortKey: string) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
}

const defaultPageSize = 10;

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  page = 1,
  pageSize = defaultPageSize,
  onPageChange,
  sortBy,
  onSort,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data",
  className,
  headerClassName,
  rowClassName,
}: DataTableProps<T>) {
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(start, start + pageSize);

  const handlePrev = () => onPageChange?.(currentPage - 1);
  const handleNext = () => onPageChange?.(currentPage + 1);

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="border-b p-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={cn("flex items-center justify-center h-48", className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <Table>
        <TableHeader className={cn("bg-muted/50", headerClassName)}>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.id}
                className={cn(
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.sortKey && "cursor-pointer hover:bg-muted/80 transition-colors",
                  col.className,
                )}
                onClick={
                  col.sortKey && onSort
                    ? () => onSort(col.sortKey!)
                    : undefined
                }
              >
                {col.header}
                {col.sortKey && sortBy === col.sortKey && (
                  <span className="ml-1 text-xs" aria-hidden>
                    ↓
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow
              key={keyExtractor(row)}
              className={cn(
                onRowClick && "cursor-pointer hover:bg-muted/50",
                rowClassName,
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className,
                  )}
                >
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && onPageChange && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {start + 1}–{Math.min(start + pageSize, total)} of {total}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  render={<button type="button" />}
                  onClick={handlePrev}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                  aria-disabled={currentPage <= 1}
                />
              </PaginationItem>
              {(() => {
                const pages: (number | "ellipsis")[] = [];
                const show = (p: number) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1);
                let addedEllipsis = false;
                for (let p = 1; p <= totalPages; p++) {
                  if (show(p)) {
                    pages.push(p);
                    addedEllipsis = false;
                  } else if (!addedEllipsis) {
                    pages.push("ellipsis");
                    addedEllipsis = true;
                  }
                }
                return pages.map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`e-${i}`}>
                      <span className="flex size-8 items-center justify-center text-muted-foreground" aria-hidden>
                        …
                      </span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        render={<button type="button" />}
                        isActive={p === currentPage}
                        onClick={() => onPageChange(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                );
              })()}
              <PaginationItem>
                <PaginationNext
                  render={<button type="button" />}
                  onClick={handleNext}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  aria-disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
