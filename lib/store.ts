'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id + variant
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  brand?: string;
}

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER';
  token?: string;
}

export interface SellerUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  token?: string;
}

interface AppStore {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  appliedCoupon: { code: string; discountPct: number } | null;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  applyCoupon: (coupon: { code: string; discountPct: number } | null) => void;

  // Cart Calculations
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
  getCartSavings: () => number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Dedicated Customer Auth (Separate from Seller)
  customer: CustomerUser | null;
  setCustomer: (user: CustomerUser | null) => void;
  customerLogout: () => void;

  // Dedicated Seller Auth (Isolated from Customer)
  seller: SellerUser | null;
  setSeller: (seller: SellerUser | null) => void;
  sellerLogout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      appliedCoupon: null,

      addToCart: (item) => {
        const id = `${item.productId}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
        const existing = get().cart.find((c) => c.id === id);
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.id === id ? { ...c, quantity: c.quantity + (item.quantity || 1) } : c
            ),
            isCartOpen: true,
          });
        } else {
          set({
            cart: [...get().cart, { ...item, id, quantity: item.quantity || 1 }],
            isCartOpen: true,
          });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((c) => c.id !== id) });
      },

      updateQuantity: (id, delta) => {
        set({
          cart: get()
            .cart.map((c) => {
              if (c.id === id) {
                const newQ = c.quantity + delta;
                return newQ > 0 ? { ...c, quantity: newQ } : null;
              }
              return c;
            })
            .filter(Boolean) as CartItem[],
        });
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      getCartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getCartSavings: () => {
        return get().cart.reduce(
          (sum, item) => sum + Math.max(0, (item.originalPrice - item.price) * item.quantity),
          0
        );
      },

      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        return Math.round((subtotal * coupon.discountPct) / 100);
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        return Math.max(0, subtotal - discount);
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (item) => {
        const exists = get().wishlist.some((w) => w.productId === item.productId);
        if (exists) {
          set({ wishlist: get().wishlist.filter((w) => w.productId !== item.productId) });
        } else {
          set({ wishlist: [...get().wishlist, item] });
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((w) => w.productId === productId);
      },

      // Search Query
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      isSearchOpen: false,
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),

      // Dedicated Customer Auth
      customer: {
        id: 'cust_seed_001',
        name: 'AN0N Customer',
        email: 'customer@flipkart.com',
        phone: '+91 98765 43210',
        role: 'CUSTOMER',
      },
      setCustomer: (customer) => set({ customer }),
      customerLogout: () => set({ customer: null }),

      // Dedicated Seller / Admin Auth (completely distinct)
      seller: {
        id: 'seller_seed_001',
        name: 'Flipkart Seller Hub Master',
        email: 'seller@flipkart.com',
        role: 'ADMIN',
      },
      setSeller: (seller) => set({ seller }),
      sellerLogout: () => set({ seller: null }),
    }),
    {
      name: 'flipkart-dual-portal-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        appliedCoupon: state.appliedCoupon,
        customer: state.customer,
        seller: state.seller,
      }),
    }
  )
);
