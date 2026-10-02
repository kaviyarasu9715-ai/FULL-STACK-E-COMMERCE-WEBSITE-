import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 10 } },
      select: { id: true, title: true, stock: true, sku: true, price: true },
      take: 5,
    });

    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        shippingAddress: JSON.parse(o.shippingAddress || '{}'),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
