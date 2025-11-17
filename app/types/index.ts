export interface ExcelRow {
  id: number;
  merchantInventoryId?: string;
  productName: string;
  ean?: string;
  aCode?: string;
  sku?: string;
  tags?: string;
  status?: string;
  warehouse?: string;
  l1Category?: string;
  productType?: string;
  basePriceWithVat?: number;
  currentStock?: number;
  newBasePriceWithVat?: number;
  vat?: number;
  newVat?: number;
  uploadId?: string;
  rowNumber?: number;
  createdAt?: string;
  updatedAt?: string;
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
  // Opšta pretraga
  search?: string;
  
  // Specifični filteri
  merchantInventoryId?: string;
  productName?: string;
  ean?: string;
  aCode?: string;
  sku?: string;
  tags?: string;
  status?: string;
  warehouse?: string;
  l1Category?: string;
  productType?: string;
  
  // Numerički filteri (opseg)
  basePriceWithVatMin?: number;
  basePriceWithVatMax?: number;
  currentStockMin?: number;
  currentStockMax?: number;
  newBasePriceWithVatMin?: number;
  newBasePriceWithVatMax?: number;
  vatMin?: number;
  vatMax?: number;
  newVatMin?: number;
  newVatMax?: number;
  
  // Paginacija i sortiranje
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface ExcelRowFormData {
  merchantInventoryId?: string;
  productName: string;
  ean?: string;
  aCode?: string;
  sku?: string;
  tags?: string;
  status?: string;
  warehouse?: string;
  l1Category?: string;
  productType?: string;
  basePriceWithVat?: number;
  currentStock?: number;
  newBasePriceWithVat?: number;
  vat?: number;
  newVat?: number;
  rowNumber?: number;
}

