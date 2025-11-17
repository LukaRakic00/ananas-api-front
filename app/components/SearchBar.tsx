'use client';

import React, { useState } from 'react';
import type { SearchRequest } from '../types';

interface SearchBarProps {
  onSearch: (searchParams: SearchRequest) => void;
  onReset: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Tekstualni filteri
  const [merchantInventoryId, setMerchantInventoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [ean, setEan] = useState('');
  const [aCode, setACode] = useState('');
  const [sku, setSku] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [l1Category, setL1Category] = useState('');
  const [productType, setProductType] = useState('');
  
  // Numerički filteri (opseg)
  const [basePriceWithVatMin, setBasePriceWithVatMin] = useState('');
  const [basePriceWithVatMax, setBasePriceWithVatMax] = useState('');
  const [currentStockMin, setCurrentStockMin] = useState('');
  const [currentStockMax, setCurrentStockMax] = useState('');
  const [newBasePriceWithVatMin, setNewBasePriceWithVatMin] = useState('');
  const [newBasePriceWithVatMax, setNewBasePriceWithVatMax] = useState('');
  const [vatMin, setVatMin] = useState('');
  const [vatMax, setVatMax] = useState('');
  const [newVatMin, setNewVatMin] = useState('');
  const [newVatMax, setNewVatMax] = useState('');

  const handleSearch = () => {
    const searchParams: SearchRequest = {
      page: 0,
      size: 20,
    };

    if (search.trim()) {
      searchParams.search = search.trim();
    } else {
      // Tekstualni filteri
      if (merchantInventoryId.trim()) searchParams.merchantInventoryId = merchantInventoryId.trim();
      if (productName.trim()) searchParams.productName = productName.trim();
      if (ean.trim()) searchParams.ean = ean.trim();
      if (aCode.trim()) searchParams.aCode = aCode.trim();
      if (sku.trim()) searchParams.sku = sku.trim();
      if (tags.trim()) searchParams.tags = tags.trim();
      if (status.trim()) searchParams.status = status.trim();
      if (warehouse.trim()) searchParams.warehouse = warehouse.trim();
      if (l1Category.trim()) searchParams.l1Category = l1Category.trim();
      if (productType.trim()) searchParams.productType = productType.trim();
      
      // Numerički filteri
      if (basePriceWithVatMin.trim()) searchParams.basePriceWithVatMin = parseFloat(basePriceWithVatMin);
      if (basePriceWithVatMax.trim()) searchParams.basePriceWithVatMax = parseFloat(basePriceWithVatMax);
      if (currentStockMin.trim()) searchParams.currentStockMin = parseFloat(currentStockMin);
      if (currentStockMax.trim()) searchParams.currentStockMax = parseFloat(currentStockMax);
      if (newBasePriceWithVatMin.trim()) searchParams.newBasePriceWithVatMin = parseFloat(newBasePriceWithVatMin);
      if (newBasePriceWithVatMax.trim()) searchParams.newBasePriceWithVatMax = parseFloat(newBasePriceWithVatMax);
      if (vatMin.trim()) searchParams.vatMin = parseFloat(vatMin);
      if (vatMax.trim()) searchParams.vatMax = parseFloat(vatMax);
      if (newVatMin.trim()) searchParams.newVatMin = parseFloat(newVatMin);
      if (newVatMax.trim()) searchParams.newVatMax = parseFloat(newVatMax);
    }

    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearch('');
    setMerchantInventoryId('');
    setProductName('');
    setEan('');
    setACode('');
    setSku('');
    setTags('');
    setStatus('');
    setWarehouse('');
    setL1Category('');
    setProductType('');
    setBasePriceWithVatMin('');
    setBasePriceWithVatMax('');
    setCurrentStockMin('');
    setCurrentStockMax('');
    setNewBasePriceWithVatMin('');
    setNewBasePriceWithVatMax('');
    setVatMin('');
    setVatMax('');
    setNewVatMin('');
    setNewVatMax('');
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Pretraga</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Opšta pretraga (po svim poljima)
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pretražite po svim poljima..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {showFilters && (
          <>
            <div className="text-sm text-gray-600 mb-2 pt-4 border-t">Specifični filteri:</div>
            
            {/* Tekstualni filteri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="merchantInventoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Inventory ID
                </label>
                <input
                  id="merchantInventoryId"
                  type="text"
                  value={merchantInventoryId}
                  onChange={(e) => setMerchantInventoryId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po ID..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                  Ime proizvoda
                </label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po imenu..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="ean" className="block text-sm font-medium text-gray-700 mb-1">
                  EAN
                </label>
                <input
                  id="ean"
                  type="text"
                  value={ean}
                  onChange={(e) => setEan(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po EAN..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="aCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ā kod
                </label>
                <input
                  id="aCode"
                  type="text"
                  value={aCode}
                  onChange={(e) => setACode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po ā kodu..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  id="sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po SKU..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tagovi
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po tagovima..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status objave
                </label>
                <input
                  id="status"
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po statusu..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">
                  Skladište
                </label>
                <input
                  id="warehouse"
                  type="text"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po skladištu..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="l1Category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorija
                </label>
                <input
                  id="l1Category"
                  type="text"
                  value={l1Category}
                  onChange={(e) => setL1Category(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po kategoriji..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tip proizvoda
                </label>
                <input
                  id="productType"
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Filter po tipu..."
                  disabled={!!search}
                  className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    search ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Numerički filteri (opseg) */}
            <div className="pt-4 border-t">
              <div className="text-sm font-medium text-gray-700 mb-3">Numerički filteri (opseg):</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="basePriceWithVatMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (Min)
                  </label>
                  <input
                    id="basePriceWithVatMin"
                    type="number"
                    step="0.01"
                    value={basePriceWithVatMin}
                    onChange={(e) => setBasePriceWithVatMin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Min cena..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="basePriceWithVatMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (Max)
                  </label>
                  <input
                    id="basePriceWithVatMax"
                    type="number"
                    step="0.01"
                    value={basePriceWithVatMax}
                    onChange={(e) => setBasePriceWithVatMax(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Max cena..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="currentStockMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Količina (Min)
                  </label>
                  <input
                    id="currentStockMin"
                    type="number"
                    value={currentStockMin}
                    onChange={(e) => setCurrentStockMin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Min količina..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="currentStockMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Količina (Max)
                  </label>
                  <input
                    id="currentStockMax"
                    type="number"
                    value={currentStockMax}
                    onChange={(e) => setCurrentStockMax(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Max količina..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="newBasePriceWithVatMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Akcijska cena (Min)
                  </label>
                  <input
                    id="newBasePriceWithVatMin"
                    type="number"
                    step="0.01"
                    value={newBasePriceWithVatMin}
                    onChange={(e) => setNewBasePriceWithVatMin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Min akcijska cena..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="newBasePriceWithVatMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Akcijska cena (Max)
                  </label>
                  <input
                    id="newBasePriceWithVatMax"
                    type="number"
                    step="0.01"
                    value={newBasePriceWithVatMax}
                    onChange={(e) => setNewBasePriceWithVatMax(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Max akcijska cena..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="vatMin" className="block text-sm font-medium text-gray-700 mb-1">
                    PDV % (Min)
                  </label>
                  <input
                    id="vatMin"
                    type="number"
                    step="0.01"
                    value={vatMin}
                    onChange={(e) => setVatMin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Min PDV..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="vatMax" className="block text-sm font-medium text-gray-700 mb-1">
                    PDV % (Max)
                  </label>
                  <input
                    id="vatMax"
                    type="number"
                    step="0.01"
                    value={vatMax}
                    onChange={(e) => setVatMax(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Max PDV..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="newVatMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Novi PDV % (Min)
                  </label>
                  <input
                    id="newVatMin"
                    type="number"
                    step="0.01"
                    value={newVatMin}
                    onChange={(e) => setNewVatMin(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Min novi PDV..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="newVatMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Novi PDV % (Max)
                  </label>
                  <input
                    id="newVatMax"
                    type="number"
                    step="0.01"
                    value={newVatMax}
                    onChange={(e) => setNewVatMax(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Max novi PDV..."
                    disabled={!!search}
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      search ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700"
          >
            Pretraži
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50"
          >
            Resetuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
