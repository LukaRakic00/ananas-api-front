import axios from 'axios';
import type { ExcelRow, UploadResponse, PageResponse, SearchRequest, ExcelRowFormData } from '../types';

// Backend je u AnanasAPI/back folderu i radi na portu 8080 (lokalno)
// Za produkciju koristiti: https://ananas-api-back.onrender.com/api/excel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/excel';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload Excel fajla
export const uploadExcelFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Pregled svih redova sa paginacijom
export const getExcelRows = async (page: number = 0, size: number = 20): Promise<PageResponse<ExcelRow>> => {
  const response = await api.get<PageResponse<ExcelRow>>('', {
    params: { page, size },
  });
  return response.data;
};

// Pregled reda po ID-u
export const getExcelRowById = async (id: number): Promise<ExcelRow> => {
  const response = await api.get<ExcelRow>(`/${id}`);
  return response.data;
};

// Pregled redova po upload ID-u
export const getExcelRowsByUploadId = async (uploadId: string): Promise<ExcelRow[]> => {
  const response = await api.get<ExcelRow[]>(`/upload/${uploadId}`);
  return response.data;
};

// Pretraga (POST)
export const searchExcelRowsPost = async (searchRequest: SearchRequest): Promise<PageResponse<ExcelRow>> => {
  const response = await api.post<PageResponse<ExcelRow>>('/search', searchRequest);
  return response.data;
};

// Pretraga (GET)
export const searchExcelRowsGet = async (params: SearchRequest): Promise<PageResponse<ExcelRow>> => {
  const response = await api.get<PageResponse<ExcelRow>>('/search', { params });
  return response.data;
};

// Kreiranje novog reda
export const createExcelRow = async (data: ExcelRowFormData): Promise<ExcelRow> => {
  const response = await api.post<ExcelRow>('', data);
  return response.data;
};

// Ažuriranje reda
export const updateExcelRow = async (id: number, data: ExcelRowFormData): Promise<ExcelRow> => {
  const response = await api.put<ExcelRow>(`/${id}`, data);
  return response.data;
};

// Brisanje reda
export const deleteExcelRow = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

// Brisanje svih redova
export const deleteAllExcelRows = async (): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>('');
  return response.data;
};

// Export kao XML (svi redovi)
export const exportToXml = async (page: number = 0, size: number = 1000): Promise<string> => {
  const response = await api.get<string>('/export/xml', {
    params: { page, size },
    responseType: 'text',
  });
  return response.data;
};

// Export kao XML (po upload ID-u)
export const exportToXmlByUploadId = async (uploadId: string): Promise<string> => {
  const response = await api.get<string>(`/export/xml/${uploadId}`, {
    responseType: 'text',
  });
  return response.data;
};

// Download XML fajl
export const downloadXmlFile = (xmlContent: string, filename: string = 'excel_rows.xml'): void => {
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

