import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR, buildWhatsAppOrderUrl } from '../services/whatsapp';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const variants = product.variants || [];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const activeVariant = variants[selectedVariantIndex] || variants[0] || {
    weight: 'Standard',
    price: 0,
    pricingUnit: 'fixed',
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!product.isAvailable) return;
    addToCart({
      product,
      selectedVariant: activeVariant,
      quantity: 1,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  const whatsappDirectUrl = buildWhatsAppOrderUrl({
    items: [
      {
        name: product.name,
        weight: activeVariant.weight,
        quantity: 1,
        price: activeVariant.price,
      },
    ],
  });

  const unitBadgeText =
    activeVariant.pricingUnit === 'per_pound'
      ? 'Per Pound Rate'
      : activeVariant.pricingUnit === 'per_piece'
      ? 'Per Piece'
      : 'Fixed Weight Price';

  return (
    <article className="group bg-white rounded-2xl border border-[#D8B46A]/35 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Photograph */}
      <Link
        to={`/product/${product.slug || product._id}`}
        className="relative block overflow-hidden bg-[#FFF0D9]/40 product-image-aspect"
      >
        <img
          src={product.images?.[0]?.url}
          alt={product.images?.[0]?.alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#082B59]/90 text-[#FFF0D9] backdrop-blur-sm">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D8B46A] text-[#082B59]">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Availability Indicator */}
        <div className="absolute top-3 right-3">
          {product.isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-900/90 text-emerald-100 backdrop-blur-sm">
              Available Fresh
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-900/90 text-red-100 backdrop-blur-sm">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/product/${product.slug || product._id}`}
            className="block font-serif text-xl font-bold text-[#082B59] group-hover:text-[#BC964B] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="mt-1.5 text-xs sm:text-sm text-[#082B59]/70 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Weight Variant Selector Pills */}
          {variants.length > 0 && (
            <div className="mt-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#082B59]/60 mb-1.5">
                Select Weight / Pack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {variants.map((variant, idx) => (
                  <button
                    key={variant.weight + idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      idx === selectedVariantIndex
                        ? 'bg-[#082B59] text-[#FFF0D9] border-[#082B59]'
                        : 'bg-[#FFF0D9]/40 text-[#082B59] border-[#D8B46A]/40 hover:bg-[#FFF0D9]'
                    }`}
                  >
                    {variant.weight}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Customer Actions */}
        <div className="pt-3 border-t border-[#D8B46A]/25 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-[#082B59]">
                {formatINR(activeVariant.price)}
              </span>
              <span className="block text-[11px] text-[#082B59]/65 font-medium">
                {activeVariant.weight} • {unitBadgeText}
              </span>
            </div>
            <Link
              to={`/product/${product.slug || product._id}`}
              className="text-xs font-semibold text-[#BC964B] hover:text-[#082B59] underline"
            >
              View Details
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                addedToast
                  ? 'bg-emerald-700 text-white'
                  : product.isAvailable
                  ? 'bg-[#FFF0D9] hover:bg-[#D8B46A] text-[#082B59] border border-[#D8B46A]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D8B46A]" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
