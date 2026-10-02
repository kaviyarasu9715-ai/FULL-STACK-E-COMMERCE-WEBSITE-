'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Package,
  Store,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, wishlist, setIsCartOpen, customer, customerLogout, setCustomer } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('customer@flipkart.com');
  const [loginPassword, setLoginPassword] = useState('user123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // If on /seller, don't show the customer navbar
  const isSellerPortal = pathname?.startsWith('/seller');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isSellerPortal) {
    return null; // Seller portal has its own dedicated Seller Navigation
  }

  const totalCartCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalWishlistCount = mounted ? wishlist.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.user);
        setLoginModalOpen(false);
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Login failed. Please check network.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      {/* Topmost Dual-Portal Tab Switcher */}
      <div className="bg-[#1b52a8] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
              Flipkart Dual-Portal Architecture
            </span>
            <div className="flex items-center gap-1 bg-[#153f82] rounded-lg p-0.5">
              <Link
                href="/"
                className="px-3 py-1 rounded bg-[#2874f0] text-white font-bold flex items-center gap-1 shadow-sm"
              >
                🛍️ Customer Store
              </Link>
              <Link
                href="/seller"
                target="_blank"
                className="px-3 py-1 rounded text-gray-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                title="Opens Seller Admin Hub in a separate dedicated tab"
              >
                🏢 Seller Hub (Admin Tab) <ExternalLink className="w-3 h-3 opacity-70" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-gray-200 text-[10px]">
            <span>100% Genuine Certified</span>
            <span>•</span>
            <span>Free Delivery on ₹500+</span>
            <span>•</span>
            <span>7-Day Replacement</span>
          </div>
        </div>
      </div>

      {/* Main Flipkart Blue Header */}
      <header className="bg-flipkart-blue sticky top-0 z-40 shadow-flipkart">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Flipkart Brand Logo */}
          <Link href="/" className="flex flex-col items-start leading-none group shrink-0">
            <span className="text-xl sm:text-2xl font-black italic text-white tracking-tight flex items-center">
              Flipkart
            </span>
            <div className="flex items-center gap-1 -mt-0.5 text-[11px] italic font-semibold text-white">
              <span>Explore</span>
              <span className="text-flipkart-yellow font-black">Plus</span>
              <Sparkles className="w-2.5 h-2.5 text-flipkart-yellow fill-flipkart-yellow -ml-0.5" />
            </div>
          </Link>

          {/* Flipkart Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for Products, Brands and More (e.g. iPhone, Dell, Sony, Nike)..."
                className="w-full bg-white text-flipkart-darkText text-sm px-4 py-2.5 pr-11 rounded-sm shadow-sm focus:outline-none placeholder-gray-500 font-normal"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-flipkart-blue hover:text-flipkart-darkBlue"
                title="Search"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Action Links */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            
            {/* Customer Login / Profile Button */}
            {customer ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-white font-bold text-sm hover:text-flipkart-yellow transition-colors py-2"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{customer.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl py-2 z-50 text-xs border border-gray-200"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <p className="font-bold text-gray-800">{customer.name}</p>
                      <p className="text-[11px] text-gray-500">{customer.email}</p>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-flipkart-badgeBg hover:text-flipkart-blue font-semibold transition-colors"
                    >
                      <Package className="w-4 h-4 text-flipkart-blue" />
                      Orders & Tracking
                    </Link>

                    <Link
                      href="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 hover:bg-flipkart-badgeBg hover:text-flipkart-blue font-semibold transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Wishlist ({totalWishlistCount})
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          customerLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-white text-flipkart-blue font-bold text-sm px-6 py-1.5 rounded-sm hover:bg-gray-100 transition-colors shadow-sm"
              >
                Login
              </button>
            )}

            {/* Become a Seller link */}
            <Link
              href="/seller"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 text-white font-semibold text-sm hover:text-flipkart-yellow transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Become a Seller</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative text-white hover:text-flipkart-yellow transition-colors p-1"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-flipkart-yellow text-flipkart-blue font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Slide Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-white font-bold text-sm hover:text-flipkart-yellow transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-flipkart-yellow text-flipkart-blue text-[10px] font-black px-1.5 py-0.2 rounded-full border border-flipkart-blue">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

          </div>
        </div>
      </header>

      {/* Customer Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full flex overflow-hidden relative animate-in zoom-in-95">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 z-10 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Blue Sidebar */}
            <div className="bg-flipkart-blue text-white p-8 w-2/5 flex flex-col justify-between hidden sm:flex">
              <div>
                <h3 className="text-2xl font-bold mb-3">Login</h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Get access to your Orders, Wishlist and Verified Flipkart Recommendations
                </p>
              </div>
              <div className="text-xs text-blue-200">
                <p className="font-semibold text-white">Sample Verified Customer:</p>
                <p className="font-mono mt-1">customer@flipkart.com</p>
                <p className="font-mono">Pass: user123</p>
              </div>
            </div>

            {/* Right Form */}
            <div className="p-8 flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-6 sm:hidden">Customer Login</h3>
              <form onSubmit={handleCustomerLogin} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Enter Email / Mobile Number
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full border-b-2 border-gray-300 focus:border-flipkart-blue py-2 text-sm text-gray-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border-b-2 border-gray-300 focus:border-flipkart-blue py-2 text-sm text-gray-800 focus:outline-none"
                  />
                </div>

                {loginError && <p className="text-xs text-red-500 font-semibold">{loginError}</p>}

                <p className="text-[11px] text-gray-500 leading-tight">
                  By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
                </p>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold py-3 rounded-sm text-sm uppercase shadow-sm transition-colors"
                >
                  {loginLoading ? 'Logging In...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
