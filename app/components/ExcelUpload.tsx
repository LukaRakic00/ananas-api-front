'use client';

import React, { useState, useRef } from 'react';
import { uploadExcelFile } from '../services/api';
import type { UploadResponse } from '../types';

interface ExcelUploadProps {
  onUploadSuccess: (response: UploadResponse) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError(null);
        // Automatski uploaduj fajl
        handleUpload(selectedFile);
      } else {
        setError('Molimo izaberite Excel fajl (.xlsx ili .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async (fileToUpload?: File) => {
    const fileToUse = fileToUpload || file;
    if (!fileToUse) {
      setError('Molimo izaberite fajl');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await uploadExcelFile(fileToUse);
      onUploadSuccess(response);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Backend server nije dostupan. Proverite da li je server pokrenut.');
      } else {
        setError(err.response?.data?.message || 'Greška pri upload-u fajla');
      }
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploadovanje...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Excel
          </>
        )}
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
      {file && !loading && (
        <span className="ml-2 text-sm text-gray-600">
          {file.name}
        </span>
      )}
    </div>
  );
};

export default ExcelUpload;
