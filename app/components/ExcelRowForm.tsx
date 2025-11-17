'use client';

import React, { useState, useEffect } from 'react';
import type { ExcelRow, ExcelRowFormData } from '../types';

interface ExcelRowFormProps {
  row?: ExcelRow | null;
  onSave: (data: ExcelRowFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const ExcelRowForm: React.FC<ExcelRowFormProps> = ({
  row,
  onSave,
  onClose,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ExcelRowFormData>({
    productName: '',
    merchantInventoryId: '',
    ean: '',
    aCode: '',
    sku: '',
    tags: '',
    status: '',
    warehouse: '',
    l1Category: '',
    productType: '',
    basePriceWithVat: undefined,
    currentStock: undefined,
    newBasePriceWithVat: undefined,
    vat: undefined,
    newVat: undefined,
    rowNumber: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (row) {
      setFormData({
        productName: row.productName || '',
        merchantInventoryId: row.merchantInventoryId || '',
        ean: row.ean || '',
        aCode: row.aCode || '',
        sku: row.sku || '',
        tags: row.tags || '',
        status: row.status || '',
        warehouse: row.warehouse || '',
        l1Category: row.l1Category || '',
        productType: row.productType || '',
        basePriceWithVat: row.basePriceWithVat,
        currentStock: row.currentStock,
        newBasePriceWithVat: row.newBasePriceWithVat,
        vat: row.vat,
        newVat: row.newVat,
        rowNumber: row.rowNumber || 1,
      });
    } else {
      setFormData({
        productName: '',
        merchantInventoryId: '',
        ean: '',
        aCode: '',
        sku: '',
        tags: '',
        status: '',
        warehouse: '',
        l1Category: '',
        productType: '',
        basePriceWithVat: undefined,
        currentStock: undefined,
        newBasePriceWithVat: undefined,
        vat: undefined,
        newVat: undefined,
        rowNumber: 1,
      });
    }
    setError(null);
  }, [row]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.productName.trim()) {
      setError('Ime proizvoda je obavezno');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('ERR_CONNECTION_REFUSED')) {
        setError('Backend server nije dostupan. Proverite da li je server pokrenut.');
      } else {
        setError(err.response?.data?.message || 'Greška pri čuvanju podataka');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: 
        name === 'basePriceWithVat' || name === 'currentStock' || name === 'newBasePriceWithVat' || 
        name === 'vat' || name === 'newVat' || name === 'rowNumber'
          ? (value === '' ? undefined : Number(value))
          : value,
    }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {row ? 'Izmeni Red' : 'Kreiraj Novi Red'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Osnovne informacije */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="merchantInventoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Inventory ID
                </label>
                <input
                  id="merchantInventoryId"
                  name="merchantInventoryId"
                  type="text"
                  value={formData.merchantInventoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite Merchant Inventory ID..."
                />
              </div>

              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                  Ime proizvoda <span className="text-red-500">*</span>
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite ime proizvoda..."
                />
              </div>

              <div>
                <label htmlFor="ean" className="block text-sm font-medium text-gray-700 mb-1">
                  EAN
                </label>
                <input
                  id="ean"
                  name="ean"
                  type="text"
                  value={formData.ean}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite EAN..."
                />
              </div>

              <div>
                <label htmlFor="aCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ā kod
                </label>
                <input
                  id="aCode"
                  name="aCode"
                  type="text"
                  value={formData.aCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite ā kod..."
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite SKU..."
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tagovi
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite tagove..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status objave
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite status..."
                />
              </div>

              <div>
                <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">
                  Skladište
                </label>
                <input
                  id="warehouse"
                  name="warehouse"
                  type="text"
                  value={formData.warehouse}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite skladište..."
                />
              </div>

              <div>
                <label htmlFor="l1Category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorija
                </label>
                <input
                  id="l1Category"
                  name="l1Category"
                  type="text"
                  value={formData.l1Category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite kategoriju..."
                />
              </div>

              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tip proizvoda
                </label>
                <input
                  id="productType"
                  name="productType"
                  type="text"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Unesite tip proizvoda..."
                />
              </div>
            </div>

            {/* Cene i količine */}
            <div className="pt-4 border-t">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Cene i količine</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="basePriceWithVat" className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (sa PDV-om)
                  </label>
                  <input
                    id="basePriceWithVat"
                    name="basePriceWithVat"
                    type="number"
                    step="0.01"
                    value={formData.basePriceWithVat ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Količina
                  </label>
                  <input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    value={formData.currentStock ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="newBasePriceWithVat" className="block text-sm font-medium text-gray-700 mb-1">
                    Akcijska cena (sa PDV-om)
                  </label>
                  <input
                    id="newBasePriceWithVat"
                    name="newBasePriceWithVat"
                    type="number"
                    step="0.01"
                    value={formData.newBasePriceWithVat ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="vat" className="block text-sm font-medium text-gray-700 mb-1">
                    PDV (%)
                  </label>
                  <input
                    id="vat"
                    name="vat"
                    type="number"
                    step="0.01"
                    value={formData.vat ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="newVat" className="block text-sm font-medium text-gray-700 mb-1">
                    Novi PDV (%)
                  </label>
                  <input
                    id="newVat"
                    name="newVat"
                    type="number"
                    step="0.01"
                    value={formData.newVat ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="rowNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Redni Broj
                  </label>
                  <input
                    id="rowNumber"
                    name="rowNumber"
                    type="number"
                    value={formData.rowNumber ?? 1}
                    onChange={handleChange}
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded font-medium ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Čuvanje...' : row ? 'Sačuvaj Izmene' : 'Kreiraj'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExcelRowForm;
