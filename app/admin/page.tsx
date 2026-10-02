'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/seller');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f1f2f4] flex items-center justify-center text-xs text-gray-500">
      Redirecting to Flipkart Seller Hub...
    </div>
  );
}
