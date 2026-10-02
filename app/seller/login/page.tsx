'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SellerLoginPage() {
  const router = useRouter();
  const { setSeller } = useAppStore();

  const [email, setEmail] = useState('seller@flipkart.com');
  const [password, setPassword] = useState('seller123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.user.role === 'ADMIN') {
        setSeller(data.user);
        router.push('/seller');
      } else if (data.success && data.user.role !== 'ADMIN') {
        setError('This account does not have Seller / Admin administrative clearance.');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-flipkart-blue text-white shadow-md mb-2">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Flipkart Seller Hub
        </h2>
        <p className="text-xs text-gray-500">
          Dedicated Admin & Merchant Backoffice Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-flipkart-card rounded sm:px-10 border border-gray-200">
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Merchant / Admin Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-900 focus:outline-none focus:border-flipkart-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Security Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs text-gray-900 focus:outline-none focus:border-flipkart-blue"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-flipkart-blue hover:bg-flipkart-darkBlue text-white font-bold text-xs uppercase rounded shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Authenticating Merchant...' : 'Login to Seller Hub'}
            </button>
          </form>

          {/* Seed accounts notice */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-600 space-y-1">
            <span className="font-bold text-gray-800 block">Default Master Credentials:</span>
            <p className="font-mono text-[11px] text-flipkart-blue">seller@flipkart.com / seller123</p>
            <p className="font-mono text-[11px] text-flipkart-blue">admin@flipkart.com / admin123</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs font-bold text-flipkart-blue hover:underline">
              ← Switch back to Customer Store
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
