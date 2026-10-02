'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function CustomerOrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-4">
      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center justify-between">
        <h1 className="text-base sm:text-lg font-bold text-gray-900">
          My Orders ({orders.length})
        </h1>
        <Link href="/" className="text-xs font-bold text-flipkart-blue hover:underline">
          Continue Shopping
        </Link>
      </div>

      {loading ? (
        <div className="bg-white p-12 text-center text-xs text-gray-500 rounded border border-gray-200">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-gray-200 shadow-sm space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500">Explore the Flipkart mega catalog and place your first order.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-flipkart-blue text-white font-bold text-xs uppercase rounded"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-flipkart-hover transition-all text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-gray-400 block text-[11px]">ORDER NUMBER</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{order.orderNumber}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-400 block text-[11px]">TOTAL AMOUNT</span>
                    <span className="font-bold text-gray-900">{formatINR(order.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">STATUS</span>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-green-50 text-flipkart-green border border-green-200 uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items row */}
              <div className="py-3 space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                      alt={item.product?.title}
                      className="w-12 h-12 object-contain bg-white border border-gray-200 rounded p-1"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-gray-900 truncate">{item.product?.title}</p>
                      <p className="text-[11px] text-gray-500">Qty: {item.quantity} • {formatINR(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-500 text-[11px]">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="font-bold text-flipkart-blue hover:underline flex items-center gap-1"
                >
                  Track Order & Invoice <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
