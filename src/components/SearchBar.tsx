import React, { useState } from 'react';
import type { SearchRequest } from '../types';

interface SearchBarProps {
  onSearch: (searchParams: SearchRequest) => void;
  onReset: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const [search, setSearch] = useState('');
  const [naziv, setNaziv] = useState('');
  const [vrednost, setVrednost] = useState('');
  const [napomena, setNapomena] = useState('');

  const handleSearch = () => {
    const searchParams: SearchRequest = {
      page: 0,
      size: 20,
    };

    if (search.trim()) {
      searchParams.search = search.trim();
    } else {
      if (naziv.trim()) searchParams.naziv = naziv.trim();
      if (vrednost.trim()) searchParams.vrednost = vrednost.trim();
      if (napomena.trim()) searchParams.napomena = napomena.trim();
    }

    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearch('');
    setNaziv('');
    setVrednost('');
    setNapomena('');
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pretraga</h3>
      
      <div className="space-y-4">
        {/* Opšta pretraga */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>

        {/* Specifične pretrage */}
        <div className="text-sm text-gray-600 mb-2">Ili koristite specifične filtere:</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="naziv" className="block text-sm font-medium text-gray-700 mb-2">
              Naziv
            </label>
            <input
              id="naziv"
              type="text"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Filter po nazivu..."
              disabled={!!search}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                search ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label htmlFor="vrednost" className="block text-sm font-medium text-gray-700 mb-2">
              Vrednost
            </label>
            <input
              id="vrednost"
              type="text"
              value={vrednost}
              onChange={(e) => setVrednost(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Filter po vrednosti..."
              disabled={!!search}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                search ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label htmlFor="napomena" className="block text-sm font-medium text-gray-700 mb-2">
              Napomena
            </label>
            <input
              id="napomena"
              type="text"
              value={napomena}
              onChange={(e) => setNapomena(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Filter po napomeni..."
              disabled={!!search}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${
                search ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        {/* Dugmad */}
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Pretraži
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Resetuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

