import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { code, cartAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, message: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (cartAmount < coupon.minOrder) {
      return NextResponse.json(
        { success: false, message: `Minimum cart value of ₹${coupon.minOrder} required for this coupon` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPct: coupon.discountPct,
      },
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
