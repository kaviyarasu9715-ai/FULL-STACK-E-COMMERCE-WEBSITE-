'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingCart,
  Heart,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Tag,
  Share2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatINR, calculateSavings } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { handleImageError } from '@/lib/imageHelper';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart, toggleWishlist, isInWishlist } = useAppStore();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Variants
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Pincode Checker
  const [pincode, setPincode] = useState('560103');
  const [pincodeResult, setPincodeResult] = useState<string | null>(
    'Delivery by Tomorrow, 11:00 PM | Free ₹40'
  );

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          setRelated(data.relatedProducts || []);
          if (data.product.attributes?.colors?.length) {
            setSelectedColor(data.product.attributes.colors[0]);
          }
          if (data.product.attributes?.sizes?.length) {
            setSelectedSize(data.product.attributes.sizes[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white my-4 rounded border border-gray-200 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 aspect-square bg-gray-100 rounded" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-10 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center bg-white my-4 rounded border border-gray-200 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Product not found in Flipkart catalog</h2>
        <Link href="/" className="px-5 py-2 bg-flipkart-blue text-white font-bold text-xs uppercase rounded">
          Return to Home
        </Link>
      </div>
    );
  }

  const { amount: savingsAmount, percentage: savingsPct } = calculateSavings(
    product.originalPrice,
    product.price
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[activeImage] || product.images[0],
      quantity,
      selectedColor,
      selectedSize,
      brand: product.brand,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeResult(`Delivery to ${pincode}: Free Standard Delivery by Tomorrow`);
    } else {
      setPincodeResult('Please enter a valid 6-digit postal pincode');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) return;
    setReviewSubmitting(true);

    setTimeout(() => {
      product.reviews.unshift({
        id: `rev-${Date.now()}`,
        user: { name: 'Verified Flipkart Buyer' },
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verified: true,
        createdAt: new Date().toISOString(),
      });
      setReviewSubmitting(false);
      setReviewSuccess(true);
      setReviewTitle('');
      setReviewComment('');
    }, 400);
  };

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1">
        <Link href="/" className="hover:text-flipkart-blue">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href={`/?category=${product.category?.slug}`} className="hover:text-flipkart-blue">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 font-medium truncate max-w-sm">{product.title}</span>
      </nav>

      {/* Main PDP Container */}
      <div className="bg-white rounded border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Column: Media + CTA Buttons */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              
              {/* Vertical Thumbnail Strip */}
              {product.images?.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-96">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-14 h-14 border rounded p-1 shrink-0 transition-all ${
                        activeImage === idx
                          ? 'border-flipkart-blue shadow-sm'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Big Image Preview */}
              <div className="flex-1 relative aspect-square border border-gray-200 rounded p-4 flex items-center justify-center bg-white group">
                <img
                  src={product.images[activeImage] || product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, product.title)}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  onClick={() =>
                    toggleWishlist({
                      productId: product.id,
                      title: product.title,
                      slug: product.slug,
                      price: product.price,
                      image: product.images[0],
                      rating: product.rating,
                    })
                  }
                  className="absolute top-3 right-3 p-2 rounded-full bg-white shadow border border-gray-200 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Two Big Flipkart CTA Buttons (Add to Cart & Buy Now) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-flipkart-cartYellow hover:bg-[#f09500] text-white font-bold text-sm rounded uppercase shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 fill-white" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-flipkart-orange hover:bg-flipkart-darkOrange text-white font-bold text-sm rounded uppercase shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>BUY NOW</span>
              </button>
            </div>
          </div>

          {/* Right Column: Details, Offers & Specs */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {product.brand}
              </span>
              <h1 className="text-lg sm:text-xl font-medium text-gray-900 leading-snug mt-0.5">
                {product.title}
              </h1>

              {/* Rating & Assured Badge */}
              <div className="flex items-center gap-3 mt-2">
                <div className="inline-flex items-center gap-1 bg-flipkart-green text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  {product.reviewCount.toLocaleString()} Ratings & {product.reviews?.length || 14} Reviews
                </span>

                {product.isAssured !== false && (
                  <span className="text-xs font-black italic tracking-tighter text-flipkart-blue flex items-center ml-2">
                    <span className="bg-[#2874f0] text-white px-1.5 text-[10px] rounded-l not-italic font-bold">f</span>
                    <span className="text-flipkart-blue bg-blue-50 px-1.5 border border-flipkart-blue rounded-r text-[10px] font-bold">Assured</span>
                  </span>
                )}
              </div>
            </div>

            {/* Special Price Line */}
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <span className="text-xs font-bold text-flipkart-green block">Special Price</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-flipkart-green">
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Inclusive of all taxes • ₹40 Delivery fee waived for Flipkart Assured
              </p>
            </div>

            {/* Flipkart Available Offers */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Available Offers
              </h4>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-flipkart-green shrink-0 mt-0.5 fill-flipkart-green" />
                  <span>
                    <strong className="text-gray-900">Bank Offer:</strong> 5% Unlimited Cashback on Flipkart Axis Bank Card
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-flipkart-green shrink-0 mt-0.5 fill-flipkart-green" />
                  <span>
                    <strong className="text-gray-900">Special Price:</strong> Get extra ₹3,000 off with coupon code <strong className="font-mono text-flipkart-blue">FLIPKART50</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-flipkart-green shrink-0 mt-0.5 fill-flipkart-green" />
                  <span>
                    <strong className="text-gray-900">Partner Offer:</strong> Make a purchase and enjoy surprise coupons on next shopping
                  </span>
                </li>
              </ul>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-700">Delivery Options</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-xs">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Delivery Pincode"
                  className="border-b-2 border-flipkart-blue focus:outline-none py-1 px-2 text-xs font-medium w-full text-gray-900"
                />
                <button
                  type="submit"
                  className="text-xs font-bold text-flipkart-blue hover:underline whitespace-nowrap"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p className="text-xs text-gray-800 font-medium flex items-center gap-1.5 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-flipkart-green" />
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Highlights / Specs */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Highlights & Specifications
              </h4>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>1 Year Domestic Manufacturer Warranty</li>
                <li>Flipkart Assured Quality Check Passed</li>
                <li>7 Days Replacement Policy for Hardware Faults</li>
                <li>Cash on Delivery Available at Doorstep</li>
              </ul>
            </div>

            {/* Product Description */}
            <div className="pt-3 border-t border-gray-200 space-y-1.5">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Product Description
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ratings & Customer Reviews Section */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase">
                  Ratings & Customer Reviews
                </h3>
                <div className="flex items-center gap-1 bg-flipkart-green text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
              </div>

              {/* Review Submit Box */}
              <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-3">
                <h5 className="text-xs font-bold text-gray-800">Rate this product</h5>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Select Stars:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Review Title (e.g. Excellent battery and display)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder="Share your customer experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-900 focus:outline-none focus:border-flipkart-blue"
                  />

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-4 py-2 bg-flipkart-blue text-white font-bold text-xs rounded uppercase hover:bg-flipkart-darkBlue transition-colors"
                  >
                    {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>

                  {reviewSuccess && (
                    <p className="text-xs text-flipkart-green font-bold">
                      Your review has been verified and posted!
                    </p>
                  )}
                </form>
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {product.reviews?.map((r: any) => (
                  <div key={r.id} className="p-3 border-b border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                        <span>{r.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <strong className="text-gray-900">{r.title}</strong>
                    </div>
                    <p className="text-gray-700">{r.comment}</p>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2 pt-0.5">
                      <span>{r.user?.name}</span>
                      <span>•</span>
                      <span className="text-flipkart-green font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Certified Buyer
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <div className="bg-white rounded border border-gray-200 p-4 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900">
            Similar Products You Might Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
