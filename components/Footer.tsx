import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, Store, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white text-xs mt-12 border-t border-gray-700">
      
      {/* Top Flipkart Pillars */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-flipkart-yellow shrink-0" />
          <div>
            <h4 className="font-bold text-white text-xs uppercase">Original Products</h4>
            <p className="text-[11px] text-gray-400">100% authentic Flipkart certified</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw className="w-6 h-6 text-flipkart-yellow shrink-0" />
          <div>
            <h4 className="font-bold text-white text-xs uppercase">7 Days Replacement</h4>
            <p className="text-[11px] text-gray-400">Hassle-free doorstep returns</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-flipkart-yellow shrink-0" />
          <div>
            <h4 className="font-bold text-white text-xs uppercase">Safe & Secure Payments</h4>
            <p className="text-[11px] text-gray-400">256-bit encrypted checkout</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Store className="w-6 h-6 text-flipkart-yellow shrink-0" />
          <div>
            <h4 className="font-bold text-white text-xs uppercase">Become a Seller</h4>
            <Link href="/seller" target="_blank" className="text-[11px] text-yellow-300 hover:underline">
              Join Flipkart Seller Hub →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-[11px] text-gray-400 leading-relaxed">
        <div>
          <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-3">ABOUT</h5>
          <ul className="space-y-1.5 text-white font-medium">
            <li><Link href="/" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/" className="hover:underline">About Us</Link></li>
            <li><Link href="/" className="hover:underline">Careers</Link></li>
            <li><Link href="/" className="hover:underline">Flipkart Stories</Link></li>
            <li><Link href="/" className="hover:underline">Press</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-3">HELP</h5>
          <ul className="space-y-1.5 text-white font-medium">
            <li><Link href="/orders" className="hover:underline">Payments</Link></li>
            <li><Link href="/orders" className="hover:underline">Shipping</Link></li>
            <li><Link href="/orders" className="hover:underline">Cancellation & Returns</Link></li>
            <li><Link href="/orders" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-3">CONSUMER POLICY</h5>
          <ul className="space-y-1.5 text-white font-medium">
            <li><span className="hover:underline cursor-pointer">Cancellation & Returns</span></li>
            <li><span className="hover:underline cursor-pointer">Terms Of Use</span></li>
            <li><span className="hover:underline cursor-pointer">Security</span></li>
            <li><span className="hover:underline cursor-pointer">Privacy</span></li>
            <li><span className="hover:underline cursor-pointer">Sitemap</span></li>
          </ul>
        </div>

        <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-8 space-y-3">
          <div>
            <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-1">Mail Us:</h5>
            <p className="text-gray-300">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>
          <div>
            <h5 className="font-bold text-gray-400 uppercase tracking-wider mb-1">Registered Office Address:</h5>
            <p className="text-gray-300">
              CIN : U51109KA2012PTC066107<br />
              Telephone: 044-45614700 / 044-67415800
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-[#121c2c] py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/seller" target="_blank" className="flex items-center gap-1.5 text-yellow-300 font-bold hover:underline">
              <Store className="w-3.5 h-3.5" /> Become a Seller
            </Link>
            <span className="hover:underline cursor-pointer">Advertise</span>
            <span className="hover:underline cursor-pointer">Gift Cards</span>
            <span className="hover:underline cursor-pointer">Help Center</span>
          </div>

          <p>© 2007-2026 Flipkart.com. Developed for AN0N.</p>
        </div>
      </div>

    </footer>
  );
}
