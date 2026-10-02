'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-surface/90">
          <Search className="w-5 h-5 text-brand-cyan shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a product, brand (Aura, Titanium, Chronos) or spec..."
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-brand-cyan animate-pulse">
              Synthesizing catalog matches...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
                Products Found ({results.length})
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-white group-hover:text-brand-cyan transition-colors truncate">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {product.brand} • ★ {product.rating}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs font-black text-brand-cyan">
                      {formatINR(product.price)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-brand-cyan transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-bold text-gray-300">No hardware found matching "{query}"</p>
              <p className="text-xs text-gray-500">Try searching for "Headphones", "Phone", "Titanium", or "Keyboard"</p>
            </div>
          )}

          {!query && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-cyan" /> Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Titanium X1 Ultra', 'Spatial ANC Headphones', 'Chronos Smart Watch', 'Rapid Trigger Keyboard', 'RTX 4090 Battle Rig'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-secondary border border-white/5 text-gray-300 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
