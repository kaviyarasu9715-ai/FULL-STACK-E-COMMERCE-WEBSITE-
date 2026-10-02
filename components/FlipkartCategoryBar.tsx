'use client';

import React from 'react';
import {
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  Armchair,
  Sparkles,
  ShoppingBasket,
  Trophy,
  Flame
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function FlipkartCategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const categories = [
    { name: 'Top Offers', slug: 'all', icon: Flame, color: 'text-rose-500' },
    { name: 'Mobiles', slug: 'mobiles', icon: Smartphone, color: 'text-blue-500' },
    { name: 'Electronics', slug: 'electronics', icon: Laptop, color: 'text-indigo-500' },
    { name: 'Appliances', slug: 'appliances', icon: Tv, color: 'text-amber-500' },
    { name: 'Fashion', slug: 'fashion', icon: Shirt, color: 'text-pink-500' },
    { name: 'Home & Furniture', slug: 'home', icon: Armchair, color: 'text-orange-500' },
    { name: 'Beauty & Toys', slug: 'beauty', icon: Sparkles, color: 'text-purple-500' },
    { name: 'Grocery', slug: 'grocery', icon: ShoppingBasket, color: 'text-emerald-500' },
    { name: 'Sports', slug: 'sports', icon: Trophy, color: 'text-cyan-500' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedCategory === c.slug;

          return (
            <button
              key={c.slug}
              onClick={() => onSelectCategory(c.slug)}
              className={`flex flex-col items-center min-w-[72px] sm:min-w-[85px] py-1 px-2 rounded hover:text-flipkart-blue transition-colors group cursor-pointer ${
                isSelected ? 'text-flipkart-blue font-bold' : 'text-gray-700 font-semibold'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${c.color}`} />
              </div>
              <span className="text-xs text-center leading-tight whitespace-nowrap">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
