'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  Plus,
  RefreshCw,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle2,
  Truck,
  Building,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { seller, sellerLogout } = useAppStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'customers' | 'stats'>('orders');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchProd, setSearchProd] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Flipkart SmartBuy');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newCategory, setNewCategory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  // Status Update State
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    // If no seller session, redirect to seller login
    if (!seller) {
      router.push('/seller/login');
      return;
    }
    fetchSellerData();
  }, [seller]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const [resStats, resProds, resCats] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/products?limit=100').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);

      if (resStats.success) setStats(resStats);
      if (resProds.success) setProducts(resProds.products);
      if (resCats.success) {
        setCategories(resCats.categories);
        if (resCats.categories.length > 0) setNewCategory(resCats.categories[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSellerData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          brand: newBrand,
          price: newPrice,
          originalPrice: newOriginalPrice || newPrice,
          stock: newStock,
          categoryId: newCategory,
          images: [newImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
          description: newDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewTitle('');
        setNewPrice('');
        setNewOriginalPrice('');
        setNewDescription('');
        fetchSellerData();
      } else {
        alert(data.message || 'Error deploying product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchProd.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchProd.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchProd.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f2f4] flex flex-col">
      
      {/* 1. Flipkart Seller Hub Navigation Header */}
      <header className="bg-[#1a5bc7] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white text-flipkart-blue flex items-center justify-center font-black text-xl italic shadow-sm">
              f
            </div>
            <div>
              <span className="text-lg font-black tracking-tight flex items-center gap-1.5">
                Flipkart <span className="text-yellow-300 font-bold">Seller Hub</span>
              </span>
              <span className="text-[10px] text-blue-200 block -mt-1 font-semibold uppercase tracking-wider">
                Merchant Operations & Order Dispatch Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Dedicated Switch to Customer Store */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#154696] hover:bg-white hover:text-flipkart-blue rounded text-white transition-colors"
              title="Open Customer Store in new tab"
            >
              <span>View Customer Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="text-right hidden md:block">
              <span className="block font-bold text-white">{seller?.name || 'Flipkart Retail Partner'}</span>
              <span className="text-[10px] text-yellow-300 font-mono">{seller?.email || 'seller@flipkart.com'}</span>
            </div>

            <button
              onClick={() => {
                sellerLogout();
                router.push('/seller/login');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Portal Mode Notice */}
      <div className="bg-[#0f3470] text-yellow-300 text-[11px] font-bold py-1.5 px-4 text-center">
        ⚡ SELLER ADMIN PORTAL ACTIVE — All orders placed by customers in the Store tab immediately reflect in this dashboard with persistent database synchronization.
      </div>

      {/* 3. Main Dashboard Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Sales Revenue</span>
              <TrendingUp className="w-4 h-4 text-flipkart-green" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {formatINR(stats?.stats?.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-flipkart-green font-semibold">100% Realtime Database Synced</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Customer Orders</span>
              <Package className="w-4 h-4 text-flipkart-blue" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.stats?.totalOrders || 0} Orders
            </div>
            <p className="text-[11px] text-gray-500">Ekart Express & Courier Shipments</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Catalog SKUs</span>
              <Store className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.stats?.totalProducts || 1024} Items
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold">1000+ Active Listings</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock Inventory</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">
              {stats?.stats?.lowStockCount || 0} Items
            </div>
            <p className="text-[11px] text-gray-500">Stock ≤ 10 units</p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-flipkart-blue text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📦 Order Fulfillment Center ({stats?.recentOrders?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-flipkart-blue text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏷️ Catalog & Inventory ({products.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSellerData}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-xs uppercase rounded shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Product SKU
            </button>
          </div>
        </div>

        {/* TAB 1: ORDER FULFILLMENT CENTER (LIVE ORDERS) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase">
                  Real-time Customer Shipments
                </h3>
                <p className="text-xs text-gray-500">
                  Manage orders, customer dispatch addresses, and update courier tracking status.
                </p>
              </div>
              <span className="text-xs font-bold text-flipkart-green bg-green-50 px-2.5 py-1 rounded border border-green-200">
                Live Orders Database Connected
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Synchronizing orders from database...
              </div>
            ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="font-bold text-gray-700">No customer orders recorded yet.</p>
                <p>When customers buy products from the Customer Store tab, they will appear here instantly.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-gray-200">
                      <th className="p-3 font-bold">Order ID</th>
                      <th className="p-3 font-bold">Buyer Details</th>
                      <th className="p-3 font-bold">Shipping Address</th>
                      <th className="p-3 font-bold">Order Amount</th>
                      <th className="p-3 font-bold">Payment</th>
                      <th className="p-3 font-bold">Courier Status</th>
                      <th className="p-3 font-bold text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-flipkart-blue">
                          {ord.orderNumber}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-gray-900">{ord.user?.name || ord.shippingAddress?.fullName}</p>
                          <p className="text-gray-500 font-mono text-[11px]">{ord.shippingAddress?.phone}</p>
                        </td>
                        <td className="p-3 max-w-xs text-gray-700">
                          <p className="truncate">{ord.shippingAddress?.street}</p>
                          <p className="text-gray-500 text-[11px]">
                            {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.postalCode}
                          </p>
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {formatINR(ord.totalAmount)}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-800 uppercase">{ord.paymentMethod}</span>
                          <span className="block text-[10px] text-flipkart-green font-bold uppercase">{ord.paymentStatus}</span>
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-flipkart-blue border border-blue-200 uppercase">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            disabled={updatingOrderId === ord.id}
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-white border border-gray-300 rounded p-1 text-[11px] text-gray-800 focus:outline-none focus:border-flipkart-blue font-semibold cursor-pointer"
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Dispatched (Air Courier)</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & CATALOG MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase">
                  Flipkart Live Inventory ({products.length} SKUs loaded)
                </h3>
                <p className="text-xs text-gray-500">
                  All items are directly accessible in the Customer Store tab.
                </p>
              </div>

              {/* Inventory Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter inventory by name/SKU..."
                  value={searchProd}
                  onChange={(e) => setSearchProd(e.target.value)}
                  className="w-full border border-gray-300 rounded pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-flipkart-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.slice(0, 36).map((p) => (
                <div key={p.id} className="p-3 bg-gray-50 rounded border border-gray-200 flex gap-3 items-center text-xs">
                  <img src={p.images[0]} alt="" className="w-14 h-14 object-contain bg-white border border-gray-200 rounded p-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{p.title}</h4>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{formatINR(p.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        p.stock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Stock: {p.stock}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length > 36 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                Showing 36 of {filteredProducts.length} items. Use search box above to find any specific product.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900 uppercase">
                Deploy New Product to Catalog
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)"
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="12999"
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="18999"
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-flipkart-blue"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold rounded uppercase shadow-sm"
                >
                  {createLoading ? 'Publishing...' : 'Publish to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
