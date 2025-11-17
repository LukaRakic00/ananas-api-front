export interface ExcelRow {
  id: number;
  uploadId: string;
  naziv: string;
  vrednost?: string;
  napomena?: string;
  rowNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  uploadId: string;
  totalRows: number;
  savedRows: number;
  message: string;
  rows: ExcelRow[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SearchRequest {
  search?: string;
  naziv?: string;
  vrednost?: string;
  napomena?: string;
  page?: number;
  size?: number;
}

export interface ExcelRowFormData {
  naziv: string;
  vrednost?: string;
  napomena?: string;
  rowNumber?: number;
}

