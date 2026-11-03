import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Check,
  Minus,
  Plus,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import {
  BUSINESS_INFO,
  formatINR,
  buildWhatsAppOrderUrl,
  buildCustomCakeWhatsAppUrl,
} from '../services/whatsapp';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Custom Cake Request Fields
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [customDetails, setCustomDetails] = useState({
    occasion: '',
    desiredWeight: '',
    flavour: '',
    designDescription: '',
    cakeMessage: '',
    deliveryDate: '',
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getProductById(id);
        if (isMounted) {
          setProduct(data.product);
          setSelectedVariantIndex(0);
          const isCustomCat = data.product?.category === 'Custom Cakes';
          setShowCustomFields(isCustomCat);
          if (data.product?.variants?.[0]?.weight) {
            setCustomDetails((prev) => ({
              ...prev,
              desiredWeight: data.product.variants[0].weight,
            }));
          }
          document.title = `${data.product.name} | Bela Bakers Gopalganj`;
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Product not found.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 rounded-3xl bg-white animate-pulse border border-[#D8B46A]/30" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 rounded-xl bg-white animate-pulse" />
            <div className="h-24 w-full rounded-xl bg-white animate-pulse" />
            <div className="h-32 w-full rounded-xl bg-white animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#082B59]">
          Cake Not Available
        </h1>
        <p className="text-sm text-[#082B59]/75">
          {error || 'Could not find this product in our active catalogue.'}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#082B59] text-[#FFF0D9] text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop Catalogue</span>
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || variants[0] || {
    weight: 'Standard',
    price: 0,
    pricingUnit: 'fixed',
  };

  const hasCustomInput =
    showCustomFields &&
    (customDetails.occasion ||
      customDetails.flavour ||
      customDetails.designDescription ||
      customDetails.cakeMessage);

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    addToCart({
      product,
      selectedVariant: activeVariant,
      quantity,
      customDetails: hasCustomInput
        ? {
            occasion: customDetails.occasion,
            flavour: customDetails.flavour,
            designDescription: customDetails.designDescription,
            cakeMessage: customDetails.cakeMessage,
          }
        : null,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const whatsappDirectUrl =
    product.category === 'Custom Cakes' || showCustomFields
      ? buildCustomCakeWhatsAppUrl({
          productName: product.name,
          occasion: customDetails.occasion,
          desiredWeight: customDetails.desiredWeight || activeVariant.weight,
          preferredFlavour: customDetails.flavour,
          designDescription: customDetails.designDescription,
          cakeMessage: customDetails.cakeMessage,
          deliveryDate: customDetails.deliveryDate,
          estimatedPrice: activeVariant.price * quantity,
        })
      : buildWhatsAppOrderUrl({
          items: [
            {
              name: product.name,
              weight: activeVariant.weight,
              quantity,
              price: activeVariant.price,
            },
          ],
          deliveryDate: customDetails.deliveryDate,
        });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#082B59] hover:text-[#BC964B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cake Catalogue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Photograph */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden bg-white border-2 border-[#D8B46A]/50 shadow-card">
            <div className="product-image-aspect relative bg-[#FFF0D9]/30">
              <img
                src={product.images?.[0]?.url}
                alt={product.images?.[0]?.alt || product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#082B59] text-[#FFF0D9]">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#D8B46A] text-[#082B59]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Info, Variants, Custom Cake Fields & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {product.isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Available for Order
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900">
                  Sold Out
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#082B59]">
              {product.name}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#082B59]/80 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Selected Price Display */}
          <div className="p-5 rounded-2xl bg-[#FFF0D9]/55 border border-[#D8B46A]/60 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/70">
                Selected Variant Price
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#082B59]">
                  {formatINR(activeVariant.price)}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#082B59]/75">
                  for {activeVariant.weight}
                </span>
              </div>
              {activeVariant.description && (
                <p className="text-xs text-[#082B59]/70 mt-1">
                  {activeVariant.description}
                </p>
              )}
            </div>

            {quantity > 1 && (
              <div className="text-right">
                <span className="block text-xs font-semibold text-[#082B59]/70">
                  Estimated Subtotal ({quantity} items)
                </span>
                <span className="text-xl font-bold text-[#082B59]">
                  {formatINR(activeVariant.price * quantity)}
                </span>
              </div>
            )}
          </div>

          {/* Available Cake Weights */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/80 mb-2.5">
              Select Available Weight / Option:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {variants.map((variant, idx) => {
                const isSelected = idx === selectedVariantIndex;
                return (
                  <button
                    key={variant.weight + idx}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setCustomDetails((prev) => ({
                        ...prev,
                        desiredWeight: variant.weight,
                      }));
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#082B59] text-[#FFF0D9] border-[#082B59] shadow-sm'
                        : 'bg-white text-[#082B59] border-[#D8B46A]/50 hover:bg-[#FFF0D9]/50'
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-bold">{variant.weight}</span>
                      <span
                        className={`block text-[11px] ${
                          isSelected ? 'text-[#D8B46A]' : 'text-[#082B59]/60'
                        }`}
                      >
                        {variant.pricingUnit === 'per_pound'
                          ? 'Per pound rate'
                          : variant.pricingUnit === 'per_piece'
                          ? 'Per piece'
                          : 'Fixed weight price'}
                      </span>
                    </div>
                    <span className="text-base font-bold">
                      {formatINR(variant.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#D8B46A]/40">
            <span className="text-sm font-bold text-[#082B59]">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-[#FFF0D9] hover:bg-[#D8B46A] text-[#082B59] flex items-center justify-center font-bold transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-base text-[#082B59]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-[#FFF0D9] hover:bg-[#D8B46A] text-[#082B59] flex items-center justify-center font-bold transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Custom Cake Request Fields Toggle / Form */}
          <div className="bg-white rounded-2xl border border-[#D8B46A]/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#082B59]">
                  {product.category === 'Custom Cakes'
                    ? 'Custom Cake Specification Request'
                    : 'Add Cake Message or Custom Request (Optional)'}
                </h2>
                <p className="text-xs text-[#082B59]/70">
                  Custom cake requests are treated as requests until the owner confirms availability and pricing on WhatsApp.
                </p>
              </div>
              {product.category !== 'Custom Cakes' && (
                <button
                  type="button"
                  onClick={() => setShowCustomFields((s) => !s)}
                  className="text-xs font-bold text-[#BC964B] hover:text-[#082B59] underline shrink-0"
                >
                  {showCustomFields ? 'Hide Fields' : 'Customize'}
                </button>
              )}
            </div>

            {showCustomFields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={customDetails.occasion}
                    onChange={(e) =>
                      setCustomDetails({ ...customDetails, occasion: e.target.value })
                    }
                    placeholder="e.g., Birthday, Wedding, Anniversary"
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Desired Weight
                  </label>
                  <input
                    type="text"
                    value={customDetails.desiredWeight}
                    onChange={(e) =>
                      setCustomDetails({
                        ...customDetails,
                        desiredWeight: e.target.value,
                      })
                    }
                    placeholder="e.g., 2 Pounds, 1.5 kg"
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Preferred Flavour
                  </label>
                  <input
                    type="text"
                    value={customDetails.flavour}
                    onChange={(e) =>
                      setCustomDetails({ ...customDetails, flavour: e.target.value })
                    }
                    placeholder="e.g., Chocolate Truffle, Pineapple"
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={customDetails.deliveryDate}
                    onChange={(e) =>
                      setCustomDetails({
                        ...customDetails,
                        deliveryDate: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Cake Message (Written on Cake)
                  </label>
                  <input
                    type="text"
                    value={customDetails.cakeMessage}
                    onChange={(e) =>
                      setCustomDetails({
                        ...customDetails,
                        cakeMessage: e.target.value,
                      })
                    }
                    placeholder="e.g., Happy Birthday Riya!"
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#082B59]/80 mb-1">
                    Design Description
                  </label>
                  <textarea
                    rows={2}
                    value={customDetails.designDescription}
                    onChange={(e) =>
                      setCustomDetails({
                        ...customDetails,
                        designDescription: e.target.value,
                      })
                    }
                    placeholder="Describe any custom colours, toppers, or tier instructions..."
                    className="w-full rounded-xl border border-[#D8B46A]/50 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Primary Customer Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
              className={`py-4 px-6 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm ${
                addedFeedback
                  ? 'bg-emerald-700 text-white'
                  : product.isAvailable
                  ? 'bg-[#FFF0D9] hover:bg-[#D8B46A] text-[#082B59] border-2 border-[#D8B46A]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {addedFeedback ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl font-bold text-sm bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] inline-flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#D8B46A]" />
              <span>
                {product.category === 'Custom Cakes'
                  ? 'Request a Custom Cake'
                  : 'Order on WhatsApp'}
              </span>
            </a>
          </div>

          {/* Important Business Notices */}
          <div className="p-4 rounded-2xl bg-[#082B59]/5 border border-[#082B59]/15 space-y-1.5 text-xs text-[#082B59]/85">
            <p className="flex items-start gap-2 font-semibold">
              <Info className="w-4 h-4 text-[#082B59] shrink-0 mt-0.5" />
              <span>{BUSINESS_INFO.whatsappOrderNotice}</span>
            </p>
            <p className="pl-6 text-[#082B59]/70">
              {BUSINESS_INFO.unconfirmedOrderNotice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
