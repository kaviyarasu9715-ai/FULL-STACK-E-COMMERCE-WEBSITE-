const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Open Source, Reliable Product Images from Wikimedia Commons, FakeStoreAPI & DummyJSON
const openSourceImages = {
  mobiles: [
    'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro-max/1.webp',
    'https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp',
    'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s21/1.webp',
    'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s22/1.webp',
    'https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp',
    'https://cdn.dummyjson.com/product-images/smartphones/realme-c35/1.webp',
  ],
  electronics: [
    'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14/1.webp',
    'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp',
    'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp',
    'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
    'https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/1.webp',
    'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
  ],
  appliances: [
    'https://cdn.dummyjson.com/product-images/kitchen-accessories/microwave-oven/1.webp',
    'https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-kettle/1.webp',
    'https://cdn.dummyjson.com/product-images/kitchen-accessories/blender/1.webp',
    'https://cdn.dummyjson.com/product-images/kitchen-accessories/coffee-maker/1.webp',
  ],
  fashion: [
    'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
  ],
  home: [
    'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp',
    'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp',
    'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp',
    'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp',
  ],
  beauty: [
    'https://cdn.dummyjson.com/product-images/fragrances/dior-j\'adore/1.webp',
    'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom/1.webp',
    'https://cdn.dummyjson.com/product-images/skin-care/attitude-sunscreen/1.webp',
    'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp',
  ],
  grocery: [
    'https://cdn.dummyjson.com/product-images/groceries/apple/1.webp',
    'https://cdn.dummyjson.com/product-images/groceries/kiwi/1.webp',
    'https://cdn.dummyjson.com/product-images/groceries/milk/1.webp',
    'https://cdn.dummyjson.com/product-images/groceries/mulberries/1.webp',
  ],
  sports: [
    'https://cdn.dummyjson.com/product-images/sports-accessories/badminton-racket/1.webp',
    'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/1.webp',
    'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/1.webp',
  ]
};

const brands = {
  mobiles: ['Apple', 'Samsung', 'OnePlus', 'Realme', 'Xiaomi', 'Motorola', 'Google', 'Poco', 'Vivo', 'Oppo'],
  electronics: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'boAt', 'Sony', 'JBL', 'Logitech'],
  appliances: ['LG', 'Samsung', 'Whirlpool', 'Voltas', 'Daikin', 'IFB', 'Godrej', 'Philips', 'Bosch'],
  fashion: ['Nike', 'Adidas', 'Puma', 'Levis', 'Allen Solly', 'Van Heusen', 'Zara', 'Roadster', 'Peter England'],
  home: ['Wakefit', 'Sleepwell', 'Nilkamal', 'Urban Ladder', 'IKEA', 'Prestige', 'Hawkins'],
  beauty: ['Maybelline', 'L\'Oreal', 'Nivea', 'Mamaearth', 'Garnier', 'The Body Shop', 'Biotique'],
  grocery: ['Tata Sampann', 'Fortune', 'Aashirvaad', 'Nestle', 'Cadbury', 'Amul', 'Saffola'],
  sports: ['Cosco', 'Nivia', 'Decathlon', 'Yonex', 'Vector X', 'Strauss', 'Cultsport']
};

const productArchetypes = {
  mobiles: [
    '5G Smartphone (128GB ROM, 8GB RAM)',
    'Ultra 5G Flagship Edition (256GB ROM)',
    'Pro Max 5G (512GB Storage, Triple Camera)',
    'Prime Edition (AMOLED Display, 5000mAh)',
    'Neo Gamer Phone (120Hz Fluid Screen)',
    'Lite Edition (64GB ROM, AI Quad Camera)',
    'Plus (Snapdragon Processor, 67W Charger)',
  ],
  electronics: [
    'Wireless Noise Cancelling Over-Ear Headphones',
    '15.6 inch FHD Core i5 16GB RAM Gaming Laptop',
    'Ultra-Slim 14 inch M2 512GB SSD Laptop',
    'True Wireless Earbuds with 40H Playtime',
    'Mechanical RGB Backlit Gaming Keyboard',
    'Ultra-Fast 1TB Portable External SSD',
    '27 inch 165Hz QHD Gaming Monitor',
    'High Precision Ergonomic Wireless Mouse',
  ],
  appliances: [
    'Smart 4K Ultra HD Dolby Vision LED TV (55 inch)',
    'Direct-Cool Inverter Double Door Refrigerator',
    'Fully Automatic Front Load Washing Machine',
    '1.5 Ton 5 Star Inverter Split Air Conditioner',
    'Multi-Stage Air Purifier with HEPA Filter',
    'Digital Microwave Oven with Auto Cook Menus',
  ],
  fashion: [
    'Slim Fit Cotton Casual Shirt',
    'Men Solid Round Neck Pure Cotton T-Shirt',
    'Men Regular Fit Stretchable Denim Jeans',
    'Running Shoes with Breathable Cushion Foam',
    'Water Resistant Multifunctional Chronograph Watch',
    'Lightweight Windbreaker Hooded Bomber Jacket',
  ],
  home: [
    'Orthopedic Memory Foam King Size Mattress',
    'Engineered Wood Queen Bed with Storage',
    'Ergonomic Mesh Office Executive Chair',
    'Stainless Steel Tri-Ply Induction Cookware Set',
    'Solid Teak Finish 4 Seater Dining Table',
  ],
  beauty: [
    'Hydrating Vitamin C Glow Face Serum (30ml)',
    'Long-Lasting Matte Liquid Lipstick',
    'Professional Hair Dryer with Diffuser Nozzle',
    'Cordless Waterproof Beard Trimmer for Men',
    'Sunscreen Gel SPF 50 PA+++ (100g)',
  ],
  grocery: [
    'Organic Extra Virgin Olive Oil (1 Litre)',
    'Premium California Whole Almonds Badam (500g)',
    'Pure Cow Desi Ghee Glass Jar (1 Litre)',
    '100% Arabica Roast & Ground Filter Coffee (250g)',
    'Organic Royal Basmati Rice Long Grain (5kg)',
  ],
  sports: [
    'Rubber Hex Dumbbells Set with Stand (20kg)',
    'Anti-Skid Extra Thick 10mm Yoga Mat',
    'Carbon Fiber Lightweight Badminton Racket with Cover',
    'Waterproof Outdoor Trekking Hiking Backpack',
  ]
};

async function main() {
  console.log('--- RESEEDING FLIPKART CATALOG WITH OPEN SOURCE CDN PRODUCT IMAGES ---');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const sellerPass = await bcrypt.hash('seller123', salt);
  const userPass = await bcrypt.hash('user123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Flipkart Admin Master',
      email: 'admin@flipkart.com',
      passwordHash: adminPass,
      role: 'ADMIN',
      phone: '+91 99999 11111',
    },
  });

  const seller = await prisma.user.create({
    data: {
      name: 'Flipkart Retail Merchant',
      email: 'seller@flipkart.com',
      passwordHash: sellerPass,
      role: 'ADMIN',
      phone: '+91 98888 22222',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'AN0N Customer',
      email: 'customer@flipkart.com',
      passwordHash: userPass,
      role: 'CUSTOMER',
      phone: '+91 98765 43210',
      addresses: {
        create: [
          {
            fullName: 'AN0N Customer',
            phone: '+91 98765 43210',
            street: 'Flat 402, Green Glen Layout, Bellandur Outer Ring Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            isDefault: true,
          },
        ],
      },
    },
  });

  const categoryDefs = [
    { name: 'Mobiles & Tablets', slug: 'mobiles', imgKey: 'mobiles' },
    { name: 'Electronics & Laptops', slug: 'electronics', imgKey: 'electronics' },
    { name: 'TVs & Appliances', slug: 'appliances', imgKey: 'appliances' },
    { name: 'Fashion & Apparel', slug: 'fashion', imgKey: 'fashion' },
    { name: 'Home & Furniture', slug: 'home', imgKey: 'home' },
    { name: 'Beauty & Personal Care', slug: 'beauty', imgKey: 'beauty' },
    { name: 'Grocery & Supermarket', slug: 'grocery', imgKey: 'grocery' },
    { name: 'Sports & Fitness', slug: 'sports', imgKey: 'sports' },
  ];

  const categoryMap = {};
  for (const c of categoryDefs) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        imageUrl: openSourceImages[c.imgKey][0],
        description: `Explore the widest collection of ${c.name} with Flipkart Assured quality.`,
      },
    });
    categoryMap[c.slug] = created.id;
  }

  const productsToInsert = [];
  let skuCounter = 1000;

  for (const c of categoryDefs) {
    const key = c.slug;
    const catId = categoryMap[key];
    const brandList = brands[key];
    const archetypes = productArchetypes[key];
    const imgList = openSourceImages[c.imgKey];

    for (let i = 1; i <= 128; i++) {
      skuCounter++;
      const brand = brandList[i % brandList.length];
      const archetype = archetypes[i % archetypes.length];
      const title = `${brand} ${archetype} (Series ${String.fromCharCode(65 + (i % 26))}${i})`;
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${skuCounter}`;

      let basePrice;
      if (key === 'mobiles') basePrice = 9999 + ((i * 1237) % 110000);
      else if (key === 'electronics') basePrice = 1499 + ((i * 1943) % 135000);
      else if (key === 'appliances') basePrice = 5999 + ((i * 2117) % 75000);
      else if (key === 'fashion') basePrice = 499 + ((i * 341) % 6500);
      else if (key === 'home') basePrice = 1299 + ((i * 871) % 45000);
      else if (key === 'beauty') basePrice = 299 + ((i * 153) % 4000);
      else if (key === 'grocery') basePrice = 199 + ((i * 117) % 2500);
      else basePrice = 499 + ((i * 611) % 18000);

      const discountPct = 10 + ((i * 7) % 65);
      const price = Math.round(basePrice * (1 - discountPct / 100));
      const originalPrice = basePrice;
      const stock = 5 + (i % 80);
      const rating = Number((3.9 + ((i % 11) * 0.1)).toFixed(1));
      const reviewCount = 25 + ((i * 47) % 3500);

      const mainImg = imgList[i % imgList.length];
      const secondImg = imgList[(i + 1) % imgList.length];

      productsToInsert.push({
        title,
        slug,
        brand,
        description: `Genuine ${brand} certified product. Includes official manufacturer warranty, 7-day replacement guarantee, and Flipkart Assured fast doorstep delivery.`,
        price,
        originalPrice,
        discount: discountPct,
        stock,
        sku: `FK-${c.slug.toUpperCase().slice(0, 3)}-${skuCounter}`,
        images: JSON.stringify([mainImg, secondImg]),
        categoryId: catId,
        rating,
        reviewCount,
        isFeatured: i % 12 === 0,
        isTrending: i % 7 === 0,
        isAssured: i % 10 !== 0,
        attributes: JSON.stringify({
          colors: ['Black', 'Blue', 'Silver', 'White'],
          sizes: key === 'fashion' ? ['S', 'M', 'L', 'XL'] : ['Standard Edition', 'Pro Bundle'],
          specs: {
            'Brand': brand,
            'Warranty': '1 Year Manufacturer Domestic Warranty',
            'Flipkart Assured': 'Yes',
            'Service Type': 'Doorstep Replacement / Repair',
          },
        }),
      });
    }
  }

  console.log(`Inserting ${productsToInsert.length} products with open-source images...`);
  const chunkSize = 150;
  for (let i = 0; i < productsToInsert.length; i += chunkSize) {
    const chunk = productsToInsert.slice(i, i + chunkSize);
    await prisma.product.createMany({ data: chunk });
  }

  await prisma.coupon.createMany({
    data: [
      { code: 'FLIPKART50', discountPct: 50, minOrder: 1000, isActive: true },
      { code: 'BIGBILLION20', discountPct: 20, minOrder: 500, isActive: true },
      { code: 'WELCOME10', discountPct: 10, minOrder: 200, isActive: true },
    ],
  });

  const sampleProd = await prisma.product.findFirst({ where: { isFeatured: true } });
  
  await prisma.order.create({
    data: {
      orderNumber: 'OD-2026-9812491',
      userId: customer.id,
      shippingAddress: JSON.stringify({
        fullName: 'AN0N Customer',
        phone: '+91 98765 43210',
        street: 'Flat 402, Green Glen Layout, Bellandur Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
      }),
      subtotal: sampleProd.price,
      discountAmount: Math.round(sampleProd.price * 0.1),
      taxAmount: 0,
      shippingFee: 0,
      totalAmount: Math.round(sampleProd.price * 0.9),
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      trackingNumber: 'FMPC-BLR-0049182',
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            productId: sampleProd.id,
            quantity: 1,
            price: sampleProd.price,
            selectedVar: JSON.stringify({ color: 'Black' }),
          },
        ],
      },
    },
  });

  console.log(`✅ DATABASE SEEDED WITH 1,024 OPEN-SOURCE PRODUCT IMAGES!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
