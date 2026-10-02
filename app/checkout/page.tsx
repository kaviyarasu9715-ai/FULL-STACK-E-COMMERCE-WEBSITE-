'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  CheckCircle2,
  MapPin,
  Lock,
  ArrowRight,
  User,
  Plus
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    appliedCoupon,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    getCartSavings,
    customer,
  } = useAppStore();

  const [activeStep, setActiveStep] = useState<2 | 3 | 4>(2);
  const [submitting, setSubmitting] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    fullName: customer?.name || 'AN0N Customer',
    phone: customer?.phone || '+91 98765 43210',
    street: 'Flat 402, Green Glen Layout, Bellandur Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
  });

  // Payment Option
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();
  const totalSavings = getCartSavings() + discount;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-white my-8 rounded border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Flipkart cart is empty!</h2>
        <p className="text-xs text-gray-500">Please select items from the catalog before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-flipkart-blue text-white font-bold text-xs uppercase rounded"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customer?.id,
          items: cart,
          shippingAddress: address,
          subtotal,
          discountAmount: discount,
          taxAmount: 0,
          shippingFee: 0,
          totalAmount: total,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });

        clearCart();
        router.push(`/orders/${data.orderNumber}`);
      } else {
        alert(data.message || 'Error creating order');
      }
    } catch (err) {
      console.error(err);
      alert('Order placement failed. Check network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 4-Step Flipkart Checkout */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: LOGIN (Completed) */}
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-sm bg-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                  LOGIN
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {customer?.name || 'AN0N Customer'} ({customer?.phone || '+91 98765 43210'})
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-flipkart-green flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Verified
            </span>
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${activeStep === 2 ? 'bg-flipkart-blue text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-sm font-bold text-xs flex items-center justify-center ${activeStep === 2 ? 'bg-white text-flipkart-blue' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  DELIVERY ADDRESS
                </span>
              </div>
              {activeStep > 2 && (
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-bold text-flipkart-blue uppercase hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 2 ? (
              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-flipkart-blue text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">10-digit mobile number</label>
                    <input
                      type="text"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-flipkart-blue text-gray-900 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Address (Area and Street)</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-flipkart-blue text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">City / District / Town</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-flipkart-blue text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:border-flipkart-blue text-gray-900 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="px-6 py-2.5 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-xs uppercase rounded shadow-sm"
                  >
                    DELIVER HERE
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 text-xs text-gray-700">
                <span className="font-bold text-gray-900">{address.fullName}</span>, {address.street}, {address.city}, {address.state} - {address.postalCode}
                <span className="block text-gray-500 font-mono mt-0.5">Phone: {address.phone}</span>
              </div>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className={`p-4 flex items-center justify-between ${activeStep === 3 ? 'bg-flipkart-blue text-white' : 'bg-white text-gray-800'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-sm font-bold text-xs flex items-center justify-center ${activeStep === 3 ? 'bg-white text-flipkart-blue' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  ORDER SUMMARY ({cart.length} items)
                </span>
              </div>
              {activeStep > 3 && (
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs font-bold text-flipkart-blue uppercase hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 3 ? (
              <div className="p-5 space-y-4">
                <div className="divide-y divide-gray-100 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 flex gap-4 text-xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-contain border border-gray-100 rounded p-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Seller: RetailNet (Flipkart Assured)</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-bold text-sm text-gray-900">{formatINR(item.price)}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-[11px] text-gray-400 line-through">{formatINR(item.originalPrice)}</span>
                          )}
                          <span className="text-gray-600 font-semibold">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-600">
                        Delivery by <strong className="text-gray-900">Tomorrow</strong> | Free ₹40
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Order confirmation email will be sent to <strong>{customer?.email || 'customer@flipkart.com'}</strong>
                  </span>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="px-6 py-2.5 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-xs uppercase rounded shadow-sm"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            ) : (
              activeStep > 3 && (
                <div className="p-4 bg-gray-50 text-xs text-gray-700">
                  {cart.length} item(s) confirmed for delivery. Total: <strong>{formatINR(total)}</strong>
                </div>
              )
            )}
          </div>

          {/* STEP 4: PAYMENT OPTIONS */}
          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className={`p-4 flex items-center gap-3 ${activeStep === 4 ? 'bg-flipkart-blue text-white' : 'bg-white text-gray-800'}`}>
              <span className={`w-6 h-6 rounded-sm font-bold text-xs flex items-center justify-center ${activeStep === 4 ? 'bg-white text-flipkart-blue' : 'bg-gray-200 text-gray-600'}`}>
                4
              </span>
              <span className="text-xs font-bold uppercase tracking-wide">
                PAYMENT OPTIONS
              </span>
            </div>

            {activeStep === 4 && (
              <div className="p-5 space-y-4 text-xs">
                <div className="space-y-3">
                  
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'UPI' ? 'border-flipkart-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="accent-flipkart-blue"
                    />
                    <QrCode className="w-5 h-5 text-flipkart-blue" />
                    <div>
                      <strong className="text-gray-900 block">UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                      <span className="text-gray-500 text-[11px]">Instant UPI Autopay / QR payment</span>
                    </div>
                  </label>

                  {/* Card */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'CARD' ? 'border-flipkart-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="accent-flipkart-blue"
                    />
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <div>
                      <strong className="text-gray-900 block">Credit / Debit / ATM Card</strong>
                      <span className="text-gray-500 text-[11px]">Visa, MasterCard, RuPay, Maestro</span>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'NETBANKING' ? 'border-flipkart-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="accent-flipkart-blue"
                    />
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <strong className="text-gray-900 block">Net Banking</strong>
                      <span className="text-gray-500 text-[11px]">SBI, HDFC, ICICI, Axis and other major banks</span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                      paymentMethod === 'COD' ? 'border-flipkart-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-flipkart-blue"
                    />
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <div>
                      <strong className="text-gray-900 block">Cash on Delivery</strong>
                      <span className="text-gray-500 text-[11px]">Pay cash at the time of doorstep courier delivery</span>
                    </div>
                  </label>

                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className="px-8 py-3.5 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-sm uppercase rounded shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {submitting ? 'CONFIRMING ORDER...' : `CONFIRM ORDER & PAY ${formatINR(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Flipkart Price Details Card */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-white rounded border border-gray-200 shadow-sm divide-y divide-gray-200 text-xs">
            <div className="p-4">
              <h3 className="font-bold text-gray-500 uppercase tracking-wide">
                PRICE DETAILS
              </h3>
            </div>

            <div className="p-4 space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Price ({cart.length} items)</span>
                <span className="text-gray-900 font-medium">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-flipkart-green font-semibold">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-flipkart-green font-bold uppercase">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-dashed border-gray-200 pt-3">
                <span>Total Payable</span>
                <span className="text-flipkart-blue font-bold">{formatINR(total)}</span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div className="p-4 bg-green-50 text-flipkart-green font-bold text-xs">
                You will save {formatINR(totalSavings)} on this order
              </div>
            )}
          </div>

          <div className="p-4 flex items-center gap-2.5 text-xs text-gray-500 mt-4">
            <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
