'use client';

import React from 'react';
import { RotateCcw, Check, Star } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface FiltersDrawerProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  onReset: () => void;
}

export default function FiltersDrawer({
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  selectedSort,
  onSelectSort,
  onReset,
}: FiltersDrawerProps) {
  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm divide-y divide-gray-200 text-xs">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-bold text-flipkart-blue hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> CLEAR ALL
        </button>
      </div>

      {/* Sort By */}
      <div className="p-4 space-y-2">
        <span className="font-bold text-gray-800 uppercase block tracking-wider text-[11px]">
          Sort By
        </span>
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-800 focus:outline-none focus:border-flipkart-blue font-medium"
        >
          <option value="featured">Relevance (Featured)</option>
          <option value="price_asc">Price -- Low to High</option>
          <option value="price_desc">Price -- High to Low</option>
          <option value="rating">Customer Rating</option>
        </select>
      </div>

      {/* Categories */}
      <div className="p-4 space-y-2">
        <span className="font-bold text-gray-800 uppercase block tracking-wider text-[11px]">
          Categories
        </span>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left py-1 px-1.5 rounded text-xs transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'text-flipkart-blue font-bold bg-blue-50'
                : 'text-gray-700 hover:text-flipkart-blue'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3 h-3 text-flipkart-blue" />}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.slug)}
              className={`w-full text-left py-1 px-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                selectedCategory === c.slug
                  ? 'text-flipkart-blue font-bold bg-blue-50'
                  : 'text-gray-700 hover:text-flipkart-blue'
              }`}
            >
              <span className="truncate">{c.name}</span>
              {selectedCategory === c.slug && <Check className="w-3 h-3 text-flipkart-blue" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800 uppercase text-[11px] tracking-wider">
            Price Range
          </span>
          <span className="text-flipkart-blue font-bold text-xs">{formatINR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="150000"
          step="1000"
          value={maxPrice}
          onChange={(e) => onPriceChange(minPrice, parseInt(e.target.value))}
          className="w-full accent-flipkart-blue h-1 bg-gray-300 rounded cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
          <span>Min: ₹500</span>
          <span>Max: ₹1,50,000+</span>
        </div>
      </div>

      {/* Flipkart Assured Guarantee Box */}
      <div className="p-4 bg-gray-50 flex items-center gap-3">
        <div className="bg-[#2874f0] text-white text-xs font-black px-1.5 py-0.5 rounded not-italic">
          f
        </div>
        <div className="leading-tight">
          <p className="text-[11px] font-bold text-flipkart-blue">Flipkart Assured</p>
          <p className="text-[10px] text-gray-500">Quality Checked & Speed Guaranteed</p>
        </div>
      </div>

    </div>
  );
}
