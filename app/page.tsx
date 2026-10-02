'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, SlidersHorizontal, Sparkles, Zap, Flame, ShieldCheck } from 'lucide-react';
import FlipkartCategoryBar from '@/components/FlipkartCategoryBar';
import ProductCard from '@/components/ProductCard';
import FiltersDrawer from '@/components/FiltersDrawer';

function HomeContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Flipkart Banner Slider State
  const [activeBanner, setActiveBanner] = useState(0);
  const banners = [
    {
      title: 'BIG BILLION SAVINGS DAYS',
      subtitle: 'Up to 80% Off on Mobiles, Laptops & Appliances',
      badge: 'MEGA SALE IS LIVE',
      bg: 'from-blue-600 via-indigo-700 to-blue-900',
      tag: 'Special Bank Offer: Instant 10% Off on All Cards',
    },
    {
      title: 'FLAGSHIP SMARTPHONES EXTRAVAGANZA',
      subtitle: 'Apple, Samsung, OnePlus & Nothing with No Cost EMI',
      badge: 'LOWEST PRICES GUARANTEED',
      bg: 'from-amber-500 via-orange-600 to-rose-600',
      tag: 'Exchange Offer: Up to ₹18,000 Off on Old Device',
    },
    {
      title: 'GRAND FASHION & LIFESTYLE FESTIVAL',
      subtitle: 'Top Brands: Nike, Adidas, Puma, Levi\'s — 50-70% Off',
      badge: 'NEW SEASON TRENDS',
      bg: 'from-purple-600 via-pink-600 to-rose-700',
      tag: 'Buy 2 Get 1 Free on Top Apparel',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?sort=${selectedSort}&maxPrice=${maxPrice}`;
    if (selectedCategory !== 'all') {
      url += `&category=${selectedCategory}`;
    }
    if (initialSearch) {
      url += `&search=${encodeURIComponent(initialSearch)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
          setTotalCount(data.count || data.products.length);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, maxPrice, selectedSort, initialSearch]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(150000);
    setSelectedSort('featured');
  };

  return (
    <div className="space-y-4 pb-12">
      
      {/* 1. Flipkart Horizontal Category Strip */}
      <FlipkartCategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-4">
        
        {/* 2. Flipkart Main Offer Banner Carousel */}
        <div className="relative rounded overflow-hidden shadow-sm h-48 sm:h-72 md:h-80 transition-all">
          {banners.map((b, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-gradient-to-r ${b.bg} text-white p-6 sm:p-12 flex flex-col justify-center transition-opacity duration-700 ${
                activeBanner === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="max-w-2xl space-y-2 sm:space-y-3">
                <span className="inline-block bg-flipkart-yellow text-gray-900 text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded shadow">
                  {b.badge}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {b.title}
                </h2>
                <p className="text-xs sm:text-base text-blue-100 font-medium">
                  {b.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-yellow-300">
                  <Sparkles className="w-4 h-4 fill-yellow-300" />
                  <span>{b.tag}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeBanner === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. Deal of the Day Header Bar */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-rose-50 flex items-center justify-center text-rose-600">
              <Flame className="w-5 h-5 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                Flipkart Assured Mega Catalog
                <span className="text-xs bg-blue-100 text-flipkart-blue font-bold px-2 py-0.5 rounded">
                  {totalCount.toLocaleString()} Products Live
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                {selectedCategory !== 'all'
                  ? `Filtering by ${selectedCategory.toUpperCase()}`
                  : 'Displaying top deals across Mobiles, Electronics, Fashion & Appliances'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded border border-gray-300"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* 4. Main Body: Left Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-20">
            <FiltersDrawer
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              minPrice={500}
              maxPrice={maxPrice}
              onPriceChange={(_, max) => setMaxPrice(max)}
              selectedSort={selectedSort}
              onSelectSort={setSelectedSort}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Mobile Filter Modal */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 overflow-y-auto">
              <div className="max-w-md mx-auto my-6">
                <FiltersDrawer
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(slug) => {
                    setSelectedCategory(slug);
                    setMobileFilterOpen(false);
                  }}
                  minPrice={500}
                  maxPrice={maxPrice}
                  onPriceChange={(_, max) => setMaxPrice(max)}
                  selectedSort={selectedSort}
                  onSelectSort={(sort) => {
                    setSelectedSort(sort);
                    setMobileFilterOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-3 py-3 bg-flipkart-blue text-white font-bold text-xs uppercase rounded"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <main className="lg:col-span-9 space-y-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded border border-gray-200 h-80 p-4 space-y-3 animate-pulse">
                    <div className="aspect-square bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-6 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-12 text-center space-y-4">
                <p className="text-base font-bold text-gray-700">No products found matching current criteria</p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 bg-flipkart-blue text-white font-bold text-xs rounded uppercase"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-gray-500">Loading Flipkart Catalog...</div>}>
      <HomeContent />
    </Suspense>
  );
}
