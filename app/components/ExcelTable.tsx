'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import type { ExcelRow, PageResponse } from '../types';

interface ExcelTableProps {
  data: PageResponse<ExcelRow>;
  onEdit: (row: ExcelRow) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  loading?: boolean;
}

const ExcelTable: React.FC<ExcelTableProps> = ({
  data,
  onEdit,
  onDelete,
  onPageChange,
  onSizeChange,
  onSort,
  sortField,
  sortDirection,
  loading = false,
}) => {
  const formatPrice = (value?: number) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatStock = (stock?: number) => {
    if (stock === null || stock === undefined) return '-';
    return stock.toString();
  };

  const columns = useMemo<ColumnDef<ExcelRow>[]>(
    () => [
      {
        accessorKey: 'merchantInventoryId',
        header: 'Merchant Inventory ID',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'productName',
        header: ({ column }) => (
          <button
            onClick={() => onSort && onSort('productName')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Ime proizvoda
            {sortField === 'productName' && (
              <span className="text-blue-600">{sortDirection === 'ASC' ? '↑' : '↓'}</span>
            )}
            {sortField !== 'productName' && onSort && <span className="text-gray-400">↕</span>}
          </button>
        ),
        cell: (info) => (
          <span className="font-medium text-gray-900">{info.getValue() as string || '-'}</span>
        ),
      },
      {
        accessorKey: 'ean',
        header: 'EAN',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'aCode',
        header: 'ā kod',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'tags',
        header: 'Tagovi',
        cell: (info) => (
          <span className="max-w-xs truncate block">{info.getValue() as string || '-'}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status objave',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'warehouse',
        header: 'Skladište',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'l1Category',
        header: 'Kategorija',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'productType',
        header: 'Tip proizvoda',
        cell: (info) => info.getValue() || '-',
      },
      {
        accessorKey: 'basePriceWithVat',
        header: ({ column }) => (
          <button
            onClick={() => onSort && onSort('basePriceWithVat')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Cena
            {sortField === 'basePriceWithVat' && (
              <span className="text-blue-600">{sortDirection === 'ASC' ? '↑' : '↓'}</span>
            )}
            {sortField !== 'basePriceWithVat' && onSort && <span className="text-gray-400">↕</span>}
          </button>
        ),
        cell: (info) => formatPrice(info.getValue() as number),
      },
      {
        accessorKey: 'currentStock',
        header: ({ column }) => (
          <button
            onClick={() => onSort && onSort('currentStock')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            Količina
            {sortField === 'currentStock' && (
              <span className="text-blue-600">{sortDirection === 'ASC' ? '↑' : '↓'}</span>
            )}
            {sortField !== 'currentStock' && onSort && <span className="text-gray-400">↕</span>}
          </button>
        ),
        cell: (info) => formatStock(info.getValue() as number),
      },
      {
        accessorKey: 'newBasePriceWithVat',
        header: 'Akcijska cena',
        cell: (info) => formatPrice(info.getValue() as number),
      },
      {
        accessorKey: 'vat',
        header: 'PDV (%)',
        cell: (info) => {
          const value = info.getValue() as number;
          return value !== null && value !== undefined ? `${value}%` : '-';
        },
      },
      {
        accessorKey: 'newVat',
        header: 'Novi PDV (%)',
        cell: (info) => {
          const value = info.getValue() as number;
          return value !== null && value !== undefined ? `${value}%` : '-';
        },
      },
      {
        id: 'actions',
        header: 'Akcije',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(row)}
                className="text-blue-600 hover:text-blue-900 transition-colors"
                title="Izmeni"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Da li ste sigurni da želite da obrišete red sa ID ${row.id}?`)) {
                    onDelete(row.id);
                  }
                }}
                className="text-red-600 hover:text-red-900 transition-colors"
                title="Obriši"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        },
      },
    ],
    [onSort, sortField, sortDirection, onEdit, onDelete]
  );

  const table = useReactTable({
    data: data.content,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data.totalPages,
    state: {
      pagination: {
        pageIndex: data.number,
        pageSize: data.size,
      },
    },
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 font-medium">Učitavanje podataka...</p>
      </div>
    );
  }

  if (data.content.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-4 text-gray-600 text-lg font-medium">Nema podataka za prikaz</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginacija */}
      <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-medium">
            Prikazano <span className="font-semibold text-gray-900">{data.content.length}</span> od{' '}
            <span className="font-semibold text-gray-900">{data.totalElements}</span> redova
          </span>
          <select
            value={data.size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value={10}>10 po stranici</option>
            <option value={20}>20 po stranici</option>
            <option value={50}>50 po stranici</option>
            <option value={100}>100 po stranici</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(data.number - 1)}
            disabled={data.number === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              data.number === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Prethodna
          </button>

          <span className="text-sm text-gray-700 px-4 font-medium">
            Stranica {data.number + 1} od {data.totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(data.number + 1)}
            disabled={data.number >= data.totalPages - 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              data.number >= data.totalPages - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Sledeća
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelTable;
