'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-4">
      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
        <h1 className="text-base sm:text-lg font-bold text-gray-900">
          My Wishlist ({wishlist.length})
        </h1>
        <Link href="/" className="text-xs font-bold text-flipkart-blue hover:underline">
          Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-gray-200 shadow-sm space-y-3">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500">Tap the heart icon on any product to save it here for later.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-flipkart-blue text-white font-bold text-xs uppercase rounded"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded border border-gray-200 shadow-sm divide-y divide-gray-200">
          {wishlist.map((item) => (
            <div key={item.productId} className="p-4 sm:p-5 flex gap-4 text-xs items-center">
              <Link href={`/products/${item.slug}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain p-1 border border-gray-100 rounded"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-flipkart-blue truncate">
                    {item.title}
                  </h3>
                </Link>

                {item.rating && (
                  <div className="inline-flex items-center gap-0.5 bg-flipkart-green text-white text-[10px] font-bold px-1.5 py-0.2 rounded mt-1">
                    <span>{item.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-white" />
                  </div>
                )}

                <div className="mt-1">
                  <span className="font-bold text-gray-900 text-base">{formatINR(item.price)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => {
                    addToCart({
                      productId: item.productId,
                      title: item.title,
                      slug: item.slug,
                      price: item.price,
                      originalPrice: item.price,
                      image: item.image,
                      quantity: 1,
                    });
                  }}
                  className="px-4 py-2 bg-flipkart-cartYellow hover:bg-[#f09500] text-white font-bold rounded text-xs uppercase flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </button>

                <button
                  onClick={() =>
                    toggleWishlist({
                      productId: item.productId,
                      title: item.title,
                      slug: item.slug,
                      price: item.price,
                      image: item.image,
                    })
                  }
                  className="p-2 text-gray-400 hover:text-rose-500 rounded hover:bg-gray-50"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
