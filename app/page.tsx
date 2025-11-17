'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ExcelUpload from './components/ExcelUpload';
import ExcelTable from './components/ExcelTable';
import SearchBar from './components/SearchBar';
import ExcelRowForm from './components/ExcelRowForm';
import {
  getExcelRows,
  searchExcelRowsGet,
  createExcelRow,
  updateExcelRow,
  deleteExcelRow,
  deleteAllExcelRows,
  exportToXml,
  exportToExcel,
} from './services/api';
import { downloadXmlFile, downloadExcelFile } from './services/api';
import type { ExcelRow, PageResponse, UploadResponse, SearchRequest, ExcelRowFormData } from './types';

export default function Home() {
  const [data, setData] = useState<PageResponse<ExcelRow> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchRequest>({});
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState<ExcelRow | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result: PageResponse<ExcelRow>;
      
      const params: SearchRequest = {
        page: currentPage,
        size: pageSize,
      };
      
      if (sortField) {
        params.sort = sortField;
        params.direction = sortDirection;
      }
      
      if (searchMode && Object.keys(searchParams).length > 0) {
        result = await searchExcelRowsGet({ ...searchParams, ...params });
      } else {
        result = await searchExcelRowsGet(params);
      }
      
      setData(result);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('ERR_CONNECTION_REFUSED') || err.response?.status === 404) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
          (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
            ? 'https://ananas-api-back.onrender.com/api/excel'
            : 'http://localhost:8080/api/excel');
        setError(`Backend server nije dostupan na ${apiUrl}. Proverite da li je server pokrenut.`);
      } else if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Interna greška servera';
        const errorDetails = err.response?.data?.details || '';
        setError(`Server greška (500): ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}. Molimo kontaktirajte administratora.`);
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Greška pri učitavanju podataka');
      }
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchMode, searchParams, sortField, sortDirection]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUploadSuccess = (response: UploadResponse) => {
    setError(null);
    setSearchMode(false);
    setSearchParams({});
    setCurrentPage(0);
    loadData();
  };

  const handleSearch = (params: SearchRequest) => {
    setSearchMode(true);
    setSearchParams(params);
    setCurrentPage(0);
  };

  const handleResetSearch = () => {
    setSearchMode(false);
    setSearchParams({});
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Ako je već sortirano po tom polju, promeni smer
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Ako je novo polje, postavi ga i kreni sa ASC
      setSortField(field);
      setSortDirection('ASC');
    }
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setEditingRow(null);
    setShowForm(true);
  };

  const handleEdit = (row: ExcelRow) => {
    setEditingRow(row);
    setShowForm(true);
  };

  const handleSave = async (formData: ExcelRowFormData) => {
    setFormLoading(true);
    try {
      if (editingRow) {
        await updateExcelRow(editingRow.id, formData);
      } else {
        await createExcelRow(formData);
      }
      await loadData();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExcelRow(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri brisanju reda');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete sve redove? Ova akcija je nepovratna.')) {
      return;
    }

    try {
      await deleteAllExcelRows();
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri brisanju svih redova');
    }
  };

  const handleExportXml = async () => {
    try {
      setLoading(true);
      const xmlContent = await exportToXml(0, 1000);
      downloadXmlFile(xmlContent, 'excel_rows.xml');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri export-u u XML');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const blob = await exportToExcel(0, 1000);
      downloadExcelFile(blob, 'excel_rows.xlsx');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri export-u u Excel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Panel za upravljanje podacima koji se šalju ananasu</h1>
            </div>
            <div className="flex items-center gap-3">
              {data && (
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm text-white border border-white/30">
                  <span className="font-semibold">{data.totalElements}</span> redova
                </div>
              )}
              <button
                onClick={handleExportExcel}
                disabled={loading || !data || data.totalElements === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading || !data || data.totalElements === 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
              <button
                onClick={handleExportXml}
                disabled={loading || !data || data.totalElements === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading || !data || data.totalElements === 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                XML
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={loading || !data || data.totalElements === 0}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading || !data || data.totalElements === 0
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Obriši Sve
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center justify-between">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload and Actions Section */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <ExcelUpload onUploadSuccess={handleUploadSuccess} />
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Kreiraj Novi Red
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} onReset={handleResetSearch} />
        </div>

        {/* Table Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista Redova</h2>
        </div>

        {data && (
          <ExcelTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            loading={loading}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <ExcelRowForm
            row={editingRow}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingRow(null);
            }}
            loading={formLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            Excel Upload Manager © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
