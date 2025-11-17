import axios from 'axios';
import type { ExcelRow, UploadResponse, PageResponse, SearchRequest, ExcelRowFormData } from '../types';

// Backend je u AnanasAPI/back folderu
// Lokalno: http://localhost:8080/api/excel (port 8080)
// Produkcija (Render): https://ananas-api-back.onrender.com/api/excel (port 10000 interno, ali Render rutira na HTTPS)

function getApiBaseUrl(): string {
  // Prvo proveri environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL.trim();
    // Osiguraj da URL završava bez trailing slash-a (axios će dodati)
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // Ako je client-side, proveri hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Ako nije localhost ili 127.0.0.1, koristi produkcijski URL
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.')) {
      return 'https://ananas-api-back.onrender.com/api/excel';
    }
  }
  
  // Default: lokalni razvoj
  return 'http://localhost:8080/api/excel';
}

// Kreiraj API instancu sa baseURL koji uvek sadrži /api/excel
const API_BASE_URL = getApiBaseUrl();

// Osiguraj da baseURL uvek završava tačno sa /api/excel (bez trailing slash-a ili dodatnih segmenata)
const ensureApiPath = (url: string): string => {
  let cleanUrl = url.trim();
  
  // Ukloni trailing slash ako postoji
  if (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  
  // Ako URL već završava sa /api/excel, vrati ga
  if (cleanUrl.endsWith('/api/excel')) {
    return cleanUrl;
  }
  
  // Ako URL sadrži /api/excel negde u sredini, izvuci deo do /api/excel
  const apiExcelIndex = cleanUrl.indexOf('/api/excel');
  if (apiExcelIndex !== -1) {
    return cleanUrl.substring(0, apiExcelIndex + '/api/excel'.length);
  }
  
  // Ako URL završava sa /api, dodaj /excel
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl + '/excel';
  }
  
  // Ako je samo domen (npr. https://ananas-api-back.onrender.com), dodaj /api/excel
  if (!cleanUrl.includes('/')) {
    return cleanUrl + '/api/excel';
  }
  
  // Inače dodaj /api/excel na kraj
  return cleanUrl + '/api/excel';
};

const finalApiUrl = ensureApiPath(API_BASE_URL);

// Debug log
if (typeof window !== 'undefined') {
  console.log('API Base URL configured:', finalApiUrl);
}

const api = axios.create({
  baseURL: finalApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug interceptor za logovanje requesta
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const fullUrl = (config.baseURL || '') + (config.url || '');
      console.log('API Request:', config.method?.toUpperCase(), fullUrl, config.params || config.data);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

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

