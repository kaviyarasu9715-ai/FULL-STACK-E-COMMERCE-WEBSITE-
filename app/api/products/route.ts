import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'featured';
    const featured = searchParams.get('featured') === 'true';

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (featured) {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { rating: 'desc' }];

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      attributes: p.attributes ? JSON.parse(p.attributes) : null,
    }));

    return NextResponse.json({ success: true, count: parsedProducts.length, products: parsedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, brand, description, price, originalPrice, stock, categoryId, images, attributes, sku } = body;

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        brand: brand || 'AURA',
        description,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice || price),
        discount: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
        stock: parseInt(stock) || 10,
        sku: sku || `SKU-${Date.now()}`,
        images: JSON.stringify(images || []),
        categoryId,
        attributes: attributes ? JSON.stringify(attributes) : null,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
