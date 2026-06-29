"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, EyeOff, Search } from "lucide-react";
import { TableRowSkeleton } from "./skeleton";

export interface ColumnDef {
  accessor: string;
  header: string;
  sortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  columns: ColumnDef[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
  rowsPerPage?: number;
}

export function DataTable({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = "Cari data...",
  onRowClick,
  rowsPerPage = 5,
}: DataTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((c) => c.accessor));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 1. Column visibility toggler open state
  const [showColToggler, setShowColToggler] = useState(false);

  // 2. Search filter logic
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.keys(row).some((key) => {
        const val = row[key];
        return val ? val.toString().toLowerCase().includes(search.toLowerCase()) : false;
      })
    );
  }, [data, search]);

  // 3. Sort logic
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
    return sorted;
  }, [filteredData, sortField, sortOrder]);

  // 4. Pagination math
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((row) => row.id)));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleColumnVisibility = (accessor: string) => {
    setVisibleColumns((prev) =>
      prev.includes(accessor) ? prev.filter((acc) => acc !== accessor) : [...prev, accessor]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar + Column Filter toggles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary focus-ring"
          />
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowColToggler(!showColToggler)}
            className="px-3.5 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-caption font-semibold flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-all focus-ring"
          >
            <EyeOff className="h-4 w-4 text-neutral-400" />
            Kolom
          </button>
          
          {showColToggler && (
            <div className="absolute right-0 mt-2 z-20 w-44 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl shadow-premium-lg p-2 space-y-1">
              <div className="text-[10px] font-bold text-neutral-400 text-label-caps p-1">Pilih Kolom</div>
              {columns.map((c) => (
                <label
                  key={c.accessor}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/30 text-caption font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(c.accessor)}
                    onChange={() => toggleColumnVisibility(c.accessor)}
                    className="h-3.5 w-3.5 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                  {c.header}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Frame Container */}
      <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-soft-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-800/20 border-b border-neutral-200/60 dark:border-neutral-800/40">
                <th className="py-3 px-6 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                  />
                </th>
                {columns
                  .filter((c) => visibleColumns.includes(c.accessor))
                  .map((c) => (
                    <th
                      key={c.accessor}
                      onClick={() => c.sortable && handleSort(c.accessor)}
                      className={`py-3 px-4 text-caption font-bold text-neutral-500 uppercase tracking-wider select-none ${
                        c.sortable ? "cursor-pointer hover:text-neutral-800 dark:hover:text-white" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {c.header}
                        {c.sortable && <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            
            <tbody>
              {isLoading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 1}
                    className="py-12 text-center text-caption text-neutral-400"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`border-b border-neutral-100 dark:border-neutral-800/50 last:border-none transition-colors duration-150 ${
                        onRowClick ? "cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10" : ""
                      } ${isSelected ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                    >
                      <td
                        className="py-4 px-6 w-10"
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering row click
                          toggleSelectRow(row.id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Controlled by click wrapper
                          className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                        />
                      </td>
                      {columns
                        .filter((c) => visibleColumns.includes(c.accessor))
                        .map((c) => {
                          const val = row[c.accessor];
                          return (
                            <td key={c.accessor} className="py-4 px-4 text-caption text-neutral-700 dark:text-neutral-300 font-medium">
                              {c.render ? c.render(val, row) : val}
                            </td>
                          );
                        })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-200/50 dark:border-neutral-800/30 bg-neutral-50/30 dark:bg-neutral-800/10 text-caption text-neutral-500 font-semibold select-none">
          <div>
            Menampilkan {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)} sampai{" "}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} dari {sortedData.length} baris
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-all focus-ring"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-caption font-semibold">
              Halaman {currentPage} dari {totalPages}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="p-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-all focus-ring"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
