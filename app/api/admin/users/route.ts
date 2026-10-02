import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { orders: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
