import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { title: true, slug: true, images: true, brand: true },
            },
          },
        },
      },
    });

    const parsedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress || '{}'),
      items: o.items.map((i) => ({
        ...i,
        selectedVar: i.selectedVar ? JSON.parse(i.selectedVar) : null,
        product: {
          ...i.product,
          images: JSON.parse(i.product.images || '[]'),
        },
      })),
    }));

    return NextResponse.json({ success: true, orders: parsedOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      items,
      shippingAddress,
      subtotal,
      discountAmount = 0,
      taxAmount = 0,
      shippingFee = 0,
      totalAmount,
      paymentMethod = 'UPI',
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart items cannot be empty' }, { status: 400 });
    }

    // Resilient Customer Resolution to guarantee DB persistence
    let existingUser = null;
    if (userId && userId !== 'user_default') {
      existingUser = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!existingUser) {
      existingUser = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    }
    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          name: shippingAddress?.fullName || 'Flipkart Customer',
          email: `customer_${Date.now()}@flipkart.com`,
          passwordHash: 'seeded_guest_hash',
          role: 'CUSTOMER',
          phone: shippingAddress?.phone || '+91 9876543210',
        },
      });
    }
    const finalUserId = existingUser.id;

    // Generate unique Flipkart/Amazon style order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${Date.now().toString().slice(-4)}-${randomSuffix}`;
    const trackingNumber = `TRK-${Date.now().toString().slice(-6)}`;
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days est

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: finalUserId,
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: parseFloat(subtotal),
        discountAmount: parseFloat(discountAmount),
        taxAmount: parseFloat(taxAmount),
        shippingFee: parseFloat(shippingFee),
        totalAmount: parseFloat(totalAmount),
        status: 'CONFIRMED',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentMethod,
        trackingNumber,
        deliveryDate,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            selectedVar: JSON.stringify({
              color: i.selectedColor || null,
              size: i.selectedSize || null,
            }),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock for each product
    for (const item of items) {
      try {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      } catch (err) {
        console.warn('Could not decrement stock for product:', item.productId);
      }
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      orderNumber: newOrder.orderNumber,
      trackingNumber: newOrder.trackingNumber,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
