import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Flipkart — Online Shopping Site for Mobiles, Electronics, Furniture, Fashion & More',
  description: 'Enterprise full-stack marketplace featuring complete Flipkart functional components, 1000+ catalog items, isolated Customer and Seller portals, and real-time database order synchronization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-gray-900 antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
