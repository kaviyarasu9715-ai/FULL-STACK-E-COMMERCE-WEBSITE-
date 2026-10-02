'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    getCartSavings,
  } = useAppStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();
  const totalSavings = getCartSavings() + discount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, cartAmount: subtotal }),
      });
      const data = await res.json();

      if (data.success) {
        applyCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch (err: any) {
      setCouponError('Network error applying coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-gray-200">
          
          {/* Header */}
          <div className="bg-flipkart-blue text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-base font-bold tracking-wide">
                My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f1f2f4]">
            {cart.length === 0 ? (
              <div className="bg-white p-8 rounded text-center space-y-3 border border-gray-200 mt-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">Your Flipkart Cart is empty!</h3>
                <p className="text-xs text-gray-500">Explore our mega catalog and add products you love.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-flipkart-blue text-white font-bold text-xs uppercase rounded"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded border border-gray-200 flex gap-3 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain border border-gray-100 rounded p-1 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.title}
                      </h4>
                      {item.brand && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{item.brand}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatINR(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatINR(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-600 hover:text-black font-bold p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-600 hover:text-black font-bold p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Details & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200 space-y-3">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (FLIPKART50, WELCOME10)"
                    className="w-full border border-gray-300 rounded pl-8 pr-2 py-1.5 text-xs text-gray-800 uppercase focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-3 py-1.5 bg-gray-800 text-white font-bold text-xs rounded hover:bg-black uppercase"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>

              {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-flipkart-green font-bold flex items-center justify-between">
                  <span>Coupon '{appliedCoupon.code}' applied ({appliedCoupon.discountPct}% OFF)</span>
                  <button onClick={() => applyCoupon(null)} className="text-red-500 underline ml-2">Remove</button>
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2">
                <div className="flex justify-between">
                  <span>Price ({cart.length} items)</span>
                  <span className="text-gray-900 font-medium">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-flipkart-green font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-flipkart-green font-bold uppercase">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-dashed border-gray-200 pt-2">
                  <span>Total Amount</span>
                  <span className="text-flipkart-blue">{formatINR(total)}</span>
                </div>
                {totalSavings > 0 && (
                  <p className="text-xs font-bold text-flipkart-green pt-1">
                    You will save {formatINR(totalSavings)} on this order
                  </p>
                )}
              </div>

              {/* Place Order CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/checkout');
                }}
                className="w-full py-3 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-sm uppercase rounded shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>PLACE ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-flipkart-green" />
                <span>Safe and Secure Payments. 100% Authentic Products.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
