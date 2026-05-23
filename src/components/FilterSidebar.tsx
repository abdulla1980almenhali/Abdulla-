/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Layers, Check, Disc } from 'lucide-react';
import { FilterState, MotorcycleCategory } from '../types';
import { CATEGORIES, BRANDS } from '../data';

interface FilterSidebarProps {
  lang: 'Ar' | 'En';
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableBrands: string[];
}

export default function FilterSidebar({
  lang,
  filters,
  setFilters,
  availableBrands
}: FilterSidebarProps) {
  const isAr = lang === 'Ar';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const setCategory = (cat: MotorcycleCategory | 'all') => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => {
      const isSelected = prev.brand === brand;
      return { ...prev, brand: isSelected ? 'all' : brand };
    });
  };

  const setCondition = (cond: 'all' | 'new' | 'used') => {
    setFilters(prev => ({ ...prev, condition: cond }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFilters(prev => ({ ...prev, maxPrice: val }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      condition: 'all',
      minPrice: 10000,
      maxPrice: 250000,
      searchQuery: '',
      sortBy: 'price_desc'
    });
  };

  return (
    <div className="w-full space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl lg:sticky lg:top-28">
      {/* Search Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange-500" />
          <h3 className="text-md font-bold text-white">
            {isAr ? 'مرشحات البحث' : 'Refine Catalog'}
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 font-mono text-xs text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
        </button>
      </div>

      {/* Text Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400">
          {isAr ? 'البحث عن موديل أو اسم' : 'Search name or engine'}
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={isAr ? 'مثال: نينجا، هارلي، 500...' : 'e.g. Ninja, Harley...'}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-orange-500 focus:outline-none"
          />
          <Search className="absolute top-3 right-3 h-4.5 w-4.5 text-zinc-500" />
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-orange-500" />
          <span>{isAr ? 'ترتيب النتائج' : 'Sort Results'}</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white transition-colors focus:border-orange-500 focus:outline-none cursor-pointer"
        >
          <option value="price_desc">{isAr ? 'السعر: السعر الأعلى أولاً' : 'Price: High to Low'}</option>
          <option value="price_asc">{isAr ? 'السعر: السعر الأقل أولاً' : 'Price: Low to High'}</option>
          <option value="year_desc">{isAr ? 'السنة: الأحدث أولاً' : 'Year: Newest'}</option>
          <option value="cc_desc">{isAr ? 'المحرك: الأكبر حجماً' : 'Engine: Max CC'}</option>
        </select>
      </div>

      {/* Categories Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-orange-500" />
          <span>{isAr ? 'فئة الدراجة' : 'Motorcycle Type'}</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as any)}
                className={`rounded-2xl px-2.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/10'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Checklist */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 block pb-1 border-b border-zinc-850">
          {isAr ? 'العلامة التجارية' : 'Brand / Manufacturer'}
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {/* Brand Row All option */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, brand: 'all' }))}
            className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
              filters.brand === 'all'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <span>{isAr ? 'جميع الشركات' : 'All Brands'}</span>
            {filters.brand === 'all' && <Check className="h-3.5 w-3.5" />}
          </button>

          {availableBrands.map((brand) => {
            const isSelected = filters.brand === brand;
            return (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/25'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{brand}</span>
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditions (New / Used) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400">
          {isAr ? 'حالة الدراجة' : 'Condition'}
        </label>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-zinc-950 p-1">
          {(['all', 'new', 'used'] as const).map((cond) => {
            const active = filters.condition === cond;
            const labels = {
              all: isAr ? 'الكل' : 'All',
              new: isAr ? 'جديد 2026' : 'New',
              used: isAr ? 'مستعمل' : 'Used'
            };
            return (
              <button
                key={cond}
                onClick={() => setCondition(cond)}
                className={`rounded-xl py-1.5 text-center text-xs font-bold capitalize transition-all cursor-pointer ${
                  active
                    ? 'bg-zinc-800 text-orange-500 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {labels[cond]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-400">
            {isAr ? 'الحد الأقصى للسعر' : 'Max Budget'}
          </label>
          <span className="font-mono text-xs font-bold text-orange-400">
            {filters.maxPrice.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="250000"
          step="5000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-zinc-950 accent-orange-505"
        />
        <div className="flex justify-between font-mono text-[9px] text-zinc-500">
          <span>10,000 {isAr ? 'ر.س' : 'SAR'}</span>
          <span>250,000 {isAr ? 'ر.س' : 'SAR'}</span>
        </div>
      </div>
    </div>
  );
}
