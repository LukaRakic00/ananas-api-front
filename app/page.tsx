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
} from './services/api';
import { downloadXmlFile } from './services/api';
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

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result: PageResponse<ExcelRow>;
      
      if (searchMode && Object.keys(searchParams).length > 0) {
        result = await searchExcelRowsGet({ ...searchParams, page: currentPage, size: pageSize });
      } else {
        result = await getExcelRows(currentPage, pageSize);
      }
      
      setData(result);
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Backend server nije dostupan. Proverite da li je server pokrenut na http://localhost:8080');
      } else {
        setError(err.response?.data?.message || 'Greška pri učitavanju podataka');
      }
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchMode, searchParams]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Excel Manager</h1>
              <p className="text-sm text-gray-600">Upravljanje Excel podacima</p>
            </div>
            <div className="flex gap-2">
              {data && (
                <div className="px-3 py-2 bg-gray-100 rounded text-sm">
                  <span className="font-medium">{data.totalElements}</span> redova
                </div>
              )}
              <button
                onClick={handleExportXml}
                disabled={loading || !data || data.totalElements === 0}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  loading || !data || data.totalElements === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Export XML
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={loading || !data || data.totalElements === 0}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  loading || !data || data.totalElements === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
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

        {/* Upload Section */}
        <div className="mb-6">
          <ExcelUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} onReset={handleResetSearch} />
        </div>

        {/* Table Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Lista Redova</h2>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            + Kreiraj Novi Red
          </button>
        </div>

        {data && (
          <ExcelTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onSizeChange={handleSizeChange}
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
