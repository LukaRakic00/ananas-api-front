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
    naziv: '',
    vrednost: '',
    napomena: '',
    rowNumber: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (row) {
      setFormData({
        naziv: row.naziv || '',
        vrednost: row.vrednost || '',
        napomena: row.napomena || '',
        rowNumber: row.rowNumber || 1,
      });
    } else {
      setFormData({
        naziv: '',
        vrednost: '',
        napomena: '',
        rowNumber: 1,
      });
    }
    setError(null);
  }, [row]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.naziv.trim()) {
      setError('Naziv je obavezan');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Greška pri čuvanju podataka');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rowNumber' ? Number(value) || 1 : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {row ? 'Izmeni Red' : 'Kreiraj Novi Red'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="naziv" className="block text-sm font-medium text-gray-700 mb-2">
              Naziv <span className="text-red-500">*</span>
            </label>
            <input
              id="naziv"
              name="naziv"
              type="text"
              value={formData.naziv}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Unesite naziv..."
            />
          </div>

          <div>
            <label htmlFor="vrednost" className="block text-sm font-medium text-gray-700 mb-2">
              Vrednost
            </label>
            <input
              id="vrednost"
              name="vrednost"
              type="text"
              value={formData.vrednost}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Unesite vrednost..."
            />
          </div>

          <div>
            <label htmlFor="napomena" className="block text-sm font-medium text-gray-700 mb-2">
              Napomena
            </label>
            <textarea
              id="napomena"
              name="napomena"
              value={formData.napomena}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              placeholder="Unesite napomenu..."
            />
          </div>

          <div>
            <label htmlFor="rowNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Redni Broj
            </label>
            <input
              id="rowNumber"
              name="rowNumber"
              type="number"
              value={formData.rowNumber}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {loading ? 'Čuvanje...' : row ? 'Sačuvaj Izmene' : 'Kreiraj'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

