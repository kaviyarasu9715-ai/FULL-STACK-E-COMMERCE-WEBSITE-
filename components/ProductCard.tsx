'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, ShoppingCart, Zap, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { handleImageError } from '@/lib/imageHelper';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    stock: number;
    images: string[];
    rating: number;
    reviewCount: number;
    isAssured?: boolean;
    attributes?: any;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useAppStore();
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      quantity: 1,
      brand: product.brand,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      quantity: 1,
      brand: product.brand,
    });

    router.push('/checkout');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      rating: product.rating,
    });
  };

  return (
    <div className="bg-white rounded border border-gray-200 hover:shadow-flipkart-hover transition-all p-3 sm:p-4 flex flex-col justify-between group relative">
      
      {/* Top Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 shadow-sm transition-all"
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          className={`w-4 h-4 ${
            wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
          }`}
        />
      </button>

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square mb-3 overflow-hidden bg-white flex items-center justify-center">
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, product.title)}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            {product.brand}
          </span>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-flipkart-blue line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating Pill & Flipkart Assured */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="inline-flex items-center gap-0.5 bg-flipkart-green text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-gray-500">
              ({product.reviewCount.toLocaleString()})
            </span>

            {/* Flipkart Assured Badge */}
            {product.isAssured !== false && (
              <span className="text-[11px] font-black italic tracking-tighter text-flipkart-blue flex items-center ml-auto">
                <span className="bg-[#2874f0] text-white px-1 text-[9px] rounded-l not-italic font-bold">f</span>
                <span className="text-flipkart-blue bg-blue-50 px-1 border border-flipkart-blue rounded-r text-[9px] font-bold">Assured</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing Line */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-500 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-flipkart-green">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-[10px] text-gray-500 mt-0.5">Free delivery</p>
        </div>

        {/* Action Buttons: Add to Cart and Buy Now */}
        <div className="pt-2 grid grid-cols-2 gap-1.5">
          <button
            onClick={handleQuickAdd}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-flipkart-cartYellow hover:bg-[#f09500] text-white font-bold text-[11px] rounded uppercase shadow-sm transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-[11px] rounded uppercase shadow-sm transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>

    </div>
  );
}
