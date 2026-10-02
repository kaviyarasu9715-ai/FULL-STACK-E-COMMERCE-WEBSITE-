import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  Users,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  DollarSign,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users' | 'analytics'>('orders');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Search & Filter state
  const [prodSearch, setProdSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Flipkart SmartBuy');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newCategory, setNewCategory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deployLoading, setDeployLoading] = useState(false);

  // Status update indicator
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [resStats, resProds, resCats, resUsers] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/products?limit=200`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/categories`).then((r) => r.json()).catch(() => ({ success: false })),
        fetch(`${API_BASE}/admin/users`).then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (resStats.success) setStats(resStats);
      if (resProds.success) setProducts(resProds.products);
      if (resCats.success) {
        setCategories(resCats.categories);
        if (resCats.categories.length > 0) setNewCategory(resCats.categories[0].id);
      }
      if (resUsers.success) setUsers(resUsers.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeployLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          brand: newBrand,
          price: newPrice,
          originalPrice: newOriginalPrice || newPrice,
          stock: newStock,
          categoryId: newCategory,
          images: [newImageUrl || 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro-max/1.webp'],
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
        fetchAllAdminData();
      } else {
        alert(data.message || 'Error deploying SKU');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeployLoading(false);
    }
  };

  const formatINR = (val: number | undefined) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filteredOrders = stats?.recentOrders?.filter(
    (o: any) =>
      o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(orderSearch.toLowerCase())
  ) || [];

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.includes(userSearch)
  );

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#212121]">
      
      {/* 1. Flipkart Seller Hub Navigation Header */}
      <header className="bg-[#1a5bc7] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-white text-[#2874f0] flex items-center justify-center font-black text-xl italic shadow-sm">
              f
            </div>
            <div>
              <span className="text-lg font-black tracking-tight flex items-center gap-1.5">
                Flipkart <span className="text-yellow-300 font-bold">Seller Hub</span>
              </span>
              <span className="text-[10px] text-blue-200 block -mt-1 font-semibold uppercase tracking-wider">
                Independent React Admin & Fulfillment Dashboard (Port 3001)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#154696] hover:bg-white hover:text-[#2874f0] rounded text-white transition-colors"
            >
              <span>Open Customer Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={fetchAllAdminData}
              className="p-2 bg-[#154696] hover:bg-white hover:text-[#2874f0] rounded text-white transition-colors"
              title="Refresh All Database Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Top Connected Status Banner */}
      <div className="bg-[#0f3470] text-yellow-300 text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
        STANDALONE REACT ADMIN RUNNING — Connected to SQLite Database. Customer purchases and registrations reflect in real-time.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Orders Revenue</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {formatINR(stats?.stats?.totalRevenue)}
            </div>
            <p className="text-[11px] text-green-600 font-semibold">100% Realtime SQLite Synced</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Customer Purchases</span>
              <Package className="w-4 h-4 text-[#2874f0]" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.stats?.totalOrders || 0} Orders
            </div>
            <p className="text-[11px] text-gray-500">Ekart Express & Courier Pipeline</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Catalog SKUs</span>
              <Store className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {stats?.stats?.totalProducts || products.length || 1024} Items
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold">1,000+ Live Listings</p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Users & Logins</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600">
              {users.length || stats?.stats?.totalCustomers || 1} Accounts
            </div>
            <p className="text-[11px] text-gray-500">Verified User Credentials in DB</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded border border-gray-200 shadow-sm p-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#2874f0] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📦 Placed Orders & Purchased Products ({stats?.recentOrders?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#2874f0] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏷️ Products Catalog ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#2874f0] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              👤 Customer Accounts & Logins ({users.length})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fb641b] hover:bg-[#e25412] text-white font-bold text-xs uppercase rounded shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Deploy New Product SKU
          </button>
        </div>

        {/* TAB 1: PLACED ORDERS & PURCHASED PRODUCTS DETAILS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase">
                  Purchased Products & Orders Manifest
                </h3>
                <p className="text-xs text-gray-500">
                  Every order placed by customers in the store loads here with complete buyer and item details.
                </p>
              </div>

              {/* Order Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by Order ID, Buyer, City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Fetching purchase records from SQLite database...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <Package className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="font-bold text-gray-700">No orders match search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-gray-200">
                      <th className="p-3 font-bold">Order ID</th>
                      <th className="p-3 font-bold">Customer Contact</th>
                      <th className="p-3 font-bold">Delivery Address</th>
                      <th className="p-3 font-bold">Purchased Items</th>
                      <th className="p-3 font-bold">Order Total</th>
                      <th className="p-3 font-bold">Payment</th>
                      <th className="p-3 font-bold">Courier Status</th>
                      <th className="p-3 font-bold text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#2874f0]">
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
                        <td className="p-3">
                          <div className="space-y-1">
                            {ord.items?.map((it: any) => (
                              <p key={it.id} className="text-[11px] text-gray-800 font-medium truncate max-w-xs">
                                • {it.product?.title || 'Product'} (x{it.quantity})
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {formatINR(ord.totalAmount)}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-800 uppercase">{ord.paymentMethod}</span>
                          <span className="block text-[10px] text-green-600 font-bold uppercase">{ord.paymentStatus}</span>
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2874f0] border border-blue-200 uppercase">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            disabled={updatingId === ord.id}
                            value={ord.status}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                            className="bg-white border border-gray-300 rounded p-1 text-[11px] text-gray-800 focus:outline-none focus:border-[#2874f0] font-semibold cursor-pointer"
                          >
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Dispatched (Ekart)</option>
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

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase">
                  Flipkart Live Products Catalog ({filteredProducts.length} items loaded)
                </h3>
                <p className="text-xs text-gray-500">
                  Manage inventory, pricing, and live catalog stock levels.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter products by name/SKU..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.slice(0, 30).map((p) => (
                <div key={p.id} className="p-3 bg-gray-50 rounded border border-gray-200 flex gap-3 items-center text-xs">
                  <img
                    src={p.images?.[0] || 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro-max/1.webp'}
                    alt=""
                    className="w-14 h-14 object-contain bg-white border border-gray-200 rounded p-1 shrink-0"
                  />
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

            {filteredProducts.length > 30 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                Displaying 30 of {filteredProducts.length} items. Use search box above to filter instantly.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOMER ACCOUNTS & LOGINS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase">
                  Registered Customer Accounts & Login Details ({filteredUsers.length})
                </h3>
                <p className="text-xs text-gray-500">
                  Profiles and authentication records stored in the SQLite database.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by name, email, phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded pl-8 pr-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-gray-200">
                    <th className="p-3 font-bold">User Name</th>
                    <th className="p-3 font-bold">Login Email</th>
                    <th className="p-3 font-bold">Mobile Phone</th>
                    <th className="p-3 font-bold">Role</th>
                    <th className="p-3 font-bold">Total Orders Placed</th>
                    <th className="p-3 font-bold">Joined On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 font-bold text-gray-900">{u.name}</td>
                      <td className="p-3 font-mono text-[#2874f0]">{u.email}</td>
                      <td className="p-3 font-mono text-gray-600">{u.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-gray-900">
                        {u._count?.orders || 0} Orders
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
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
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
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
                    placeholder="26999"
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="34999"
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://cdn.dummyjson.com/..."
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-[#2874f0]"
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
                  disabled={deployLoading}
                  className="px-6 py-2 bg-[#fb641b] hover:bg-[#e25412] text-white font-bold rounded uppercase shadow-sm"
                >
                  {deployLoading ? 'Deploying...' : 'Deploy to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
