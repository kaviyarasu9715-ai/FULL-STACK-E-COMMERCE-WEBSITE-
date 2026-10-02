import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Related products in same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
    });

    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      attributes: product.attributes ? JSON.parse(product.attributes) : null,
    };

    const parsedRelated = related.map((r) => ({
      ...r,
      images: JSON.parse(r.images || '[]'),
      attributes: r.attributes ? JSON.parse(r.attributes) : null,
    }));

    return NextResponse.json({
      success: true,
      product: parsedProduct,
      relatedProducts: parsedRelated,
    });
  } catch (error: any) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
