'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-gray-500">
        <div className="w-8 h-8 rounded-full border-2 border-flipkart-blue border-t-transparent animate-spin mx-auto mb-2" />
        Loading Flipkart Order Tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center bg-white my-8 rounded border border-gray-200 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Order not found</h2>
        <Link href="/" className="px-5 py-2 bg-flipkart-blue text-white font-bold text-xs uppercase rounded">
          Back to Shopping
        </Link>
      </div>
    );
  }

  const milestones = [
    { label: 'Order Confirmed', status: 'CONFIRMED' },
    { label: 'Shipped', status: 'SHIPPED' },
    { label: 'Out for Delivery', status: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', status: 'DELIVERED' },
  ];

  const getStepCompleted = (mStatus: string) => {
    const list = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIdx = list.indexOf(order.status);
    const stepIdx = list.indexOf(mStatus);
    return currentIdx >= stepIdx;
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-4">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-flipkart-blue">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/orders" className="hover:text-flipkart-blue">My Orders</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 font-mono font-medium">{order.orderNumber}</span>
      </nav>

      {/* Main Order Card */}
      <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-200">
        
        {/* Top Info Banner */}
        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-gray-500 block">Order ID:</span>
            <span className="font-bold text-sm text-gray-900 font-mono">{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-500 block">Airway Bill / Tracking:</span>
              <span className="font-bold text-flipkart-blue font-mono">{order.trackingNumber || 'FMPC-BLR-0049182'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Total Amount:</span>
              <span className="font-bold text-gray-900">{formatINR(order.totalAmount)}</span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-flipkart-blue" /> Download Invoice
            </button>
          </div>
        </div>

        {/* Visual Flipkart Tracking Stepper */}
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Delivery Status
          </h3>

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-2">
            {milestones.map((m, idx) => {
              const completed = getStepCompleted(m.status);

              return (
                <div key={m.status} className="flex sm:flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      completed
                        ? 'bg-flipkart-green text-white shadow-sm'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {completed ? '✓' : idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <p className={`text-xs font-bold ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {m.label}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {completed ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50/60 rounded border border-blue-100 flex items-center justify-between text-xs text-flipkart-blue font-medium">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Delivery Partner: <strong>Ekart Logistics / BlueDart</strong>
            </span>
            <span className="text-flipkart-green font-bold">
              Estimated Delivery: Within 24-48 Hours
            </span>
          </div>
        </div>

        {/* Delivery Address & Manifest Items */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          {/* Address */}
          <div className="space-y-1">
            <span className="font-bold text-gray-500 uppercase tracking-wide block mb-1">
              Delivery Address
            </span>
            <p className="font-bold text-gray-900 text-sm">{order.shippingAddress?.fullName}</p>
            <p className="text-gray-700">{order.shippingAddress?.street}</p>
            <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
            <p className="text-gray-500 font-mono pt-1">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Items Preview */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-bold text-gray-500 uppercase tracking-wide block">
              Items Ordered ({order.items?.length || 0})
            </span>

            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-100">
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                  alt={item.product?.title}
                  className="w-16 h-16 object-contain bg-white border border-gray-200 rounded p-1"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.product?.title}</h4>
                  <p className="text-[11px] text-gray-500">Seller: RetailNet (Flipkart Assured)</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-gray-900">{formatINR(item.price)}</span>
                    <span className="text-gray-500">Qty: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
