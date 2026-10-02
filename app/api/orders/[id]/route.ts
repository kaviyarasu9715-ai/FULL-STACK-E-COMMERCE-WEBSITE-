import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { orderNumber: id },
          { trackingNumber: id },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { title: true, slug: true, images: true, brand: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const parsedOrder = {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      items: order.items.map((i) => ({
        ...i,
        selectedVar: i.selectedVar ? JSON.parse(i.selectedVar) : null,
        product: {
          ...i.product,
          images: JSON.parse(i.product.images || '[]'),
        },
      })),
    };

    return NextResponse.json({ success: true, order: parsedOrder });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
