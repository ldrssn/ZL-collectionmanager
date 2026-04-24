
import React, { useState, useRef, useEffect } from 'react';
import { Filters, ItemType, ItemShape, SortBy } from '../types';
import { COLORS, COLOR_MAP } from '../constants';
import MaterialIcon from './MaterialIcon';

interface FilterControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, sortBy, setSortBy }) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = <K extends keyof Filters,>(key: K, value: any) => {
    if (key === 'soldStatus') {
      setFilters(prev => ({ ...prev, [key]: value }));
      return;
    }
    
    // For type, shape, color (array states)
    if (value === 'all') {
      setFilters(prev => ({ ...prev, [key]: [] }));
      return;
    }

    setFilters(prev => {
      const currentArray = prev[key] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setIsColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const FilterButton = ({ label, active, onClick, ...props }: { label: string; active: boolean; onClick: () => void;[key: string]: any }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${active ? 'bg-brand-pink text-brand-text' : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}
      {...props}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Type Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center px-1">
            Art
            {filters.type.length > 0 && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink" />}
          </h4>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Alle" active={filters.type.length === 0} onClick={() => handleFilterChange('type', 'all')} />
            {Object.values(ItemType).map(t => <FilterButton key={t} label={t} active={filters.type.includes(t)} onClick={() => handleFilterChange('type', t)} />)}
          </div>
        </div>
        {/* Shape Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center px-1">
            Form
            {filters.shape.length > 0 && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink" />}
          </h4>
          <div className="flex flex-wrap gap-2">
            <FilterButton label="Alle" active={filters.shape.length === 0} onClick={() => handleFilterChange('shape', 'all')} />
            {Object.values(ItemShape).map(s => <FilterButton key={s} label={s} active={filters.shape.includes(s)} onClick={() => handleFilterChange('shape', s)} />)}
          </div>
        </div>
        {/* Color Filter */}
        <div className="relative" ref={colorDropdownRef}>
          <label htmlFor="color-filter" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center px-1">
            Farbe
            {filters.color.length > 0 && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-brand-pink" />}
          </label>
          <button
            type="button"
            onClick={() => setIsColorOpen(!isColorOpen)}
            className={`relative w-full cursor-default rounded-md border bg-white dark:bg-zinc-700 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm ${filters.color.length > 0 ? 'border-brand-pink' : 'border-gray-300 dark:border-zinc-600'} focus:border-brand-pink`}
          >
            <span className="flex items-center">
              {filters.color.length === 1 && (
                <span style={{ background: COLOR_MAP[filters.color[0]] }} className="inline-block h-4 w-4 flex-shrink-0 rounded-full border border-gray-300"></span>
              )}
              <span className="ml-3 block truncate text-gray-900 dark:text-gray-100">{filters.color.length === 0 ? 'Alle Farben' : filters.color.length === 1 ? filters.color[0] : `${filters.color.length} ausgewählt`}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <MaterialIcon name="unfold_more" className="text-gray-400 text-xl" />
            </span>
          </button>

          {isColorOpen && (
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-zinc-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <li onClick={() => { handleFilterChange('color', 'all'); setIsColorOpen(false); }} className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-brand-pink hover:text-brand-text dark:hover:text-brand-text ${filters.color.length === 0 ? 'bg-brand-pink/10 text-brand-pink font-semibold' : 'text-gray-900 dark:text-gray-200'}`}>Alle Farben</li>
              {COLORS.map(c => (
                <li key={c} onClick={() => { handleFilterChange('color', c); }} className="text-gray-900 dark:text-gray-200 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-brand-pink hover:text-brand-text dark:hover:text-brand-text">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span style={{ background: COLOR_MAP[c] }} className="inline-block h-4 w-4 flex-shrink-0 rounded-full border border-gray-300"></span>
                      <span className="font-normal ml-3 block truncate">{c}</span>
                    </div>
                    {filters.color.includes(c) && <MaterialIcon name="check" className="text-brand-pink text-sm" />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Sorting and Status */}
        <div className="space-y-6">
          <div>
            <label htmlFor="sort-by" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Sortieren nach</label>
            <div className="relative w-full">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full appearance-none cursor-default rounded-md border border-gray-300 bg-white dark:bg-zinc-700 dark:border-zinc-600 py-2 pl-3 pr-10 text-left shadow-sm focus:border-brand-pink focus:outline-none sm:text-sm text-gray-900 dark:text-gray-100"
              >
                <option value={SortBy.Name}>Name</option>
                <option value={SortBy.PriceAsc}>Preis: aufsteigend</option>
                <option value={SortBy.PriceDesc}>Preis: absteigend</option>
                <option value={SortBy.Usage}>Nutzung</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <MaterialIcon name="unfold_more" className="text-gray-400 text-xl" />
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              <FilterButton label="In Sammlung" active={filters.soldStatus === 'in_collection'} onClick={() => handleFilterChange('soldStatus', 'in_collection')} />
              <FilterButton label="Verkauft" active={filters.soldStatus === 'sold'} onClick={() => handleFilterChange('soldStatus', 'sold')} />
              <FilterButton label="Alle" active={filters.soldStatus === 'all'} onClick={() => handleFilterChange('soldStatus', 'all')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;