import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  FileText,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  BUSINESS_INFO,
  formatINR,
  buildWhatsAppOrderUrl,
} from '../services/whatsapp';

export default function CartPage() {
  const {
    items,
    totalItems,
    estimatedTotal,
    removeFromCart,
    updateQuantity,
    updateVariant,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const url = buildWhatsAppOrderUrl({
      items,
      customerName,
      deliveryDate,
      deliveryAddress,
      specialInstructions,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Breadcrumb & Heading */}
      <div className="border-b border-[#D8B46A]/30 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#082B59]/60 uppercase tracking-widest">
            <Link to="/" className="hover:text-[#082B59]">Home</Link>
            <span>/</span>
            <span className="text-[#082B59]">Shopping Cart</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#082B59] mt-1">
            Your Selected Celebrations
          </h1>
          <p className="text-xs sm:text-sm text-[#082B59]/75 mt-1">
            Review your chosen cakes and generate an itemised WhatsApp order for Bela Bakers.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#082B59] hover:text-[#BC964B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing Catalogue</span>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-10 sm:p-16 text-center space-y-5 shadow-card max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#FFF0D9] text-[#082B59] flex items-center justify-center mx-auto border border-[#D8B46A]/40">
            <ShoppingBag className="w-10 h-10 text-[#082B59]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#082B59]">
              Your Cart is Currently Empty
            </h2>
            <p className="text-sm text-[#082B59]/75 max-w-md mx-auto">
              You haven't added any bakes yet. Browse our freshly baked counter cakes, gourmet cupcakes, pastries, and artisanal cookies!
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border border-[#D8B46A] px-7 py-3 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all"
            >
              <span>Explore Bakery Catalogue</span>
              <Sparkles className="w-4 h-4 text-[#D8B46A]" />
            </Link>
          </div>
        </div>
      ) : (
        /* Active Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-7 shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-[#D8B46A]/20 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#082B59]">
                  Bela Bakers Selections ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#082B59]/60 hover:text-rose-600 transition-colors inline-flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              <div className="divide-y divide-[#D8B46A]/15">
                {items.map((item) => {
                  const itemSubtotal = item.price * item.quantity;
                  const availableVariants = item.variants || [];

                  return (
                    <div key={item.cartItemId} className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${item.slug || item.productId}`}
                        className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFF0D9]/40 border border-[#D8B46A]/30 shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Info & Variant Switcher */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <Link
                          to={`/product/${item.slug || item.productId}`}
                          className="font-serif font-bold text-base text-[#082B59] hover:text-[#BC964B] transition-colors block truncate"
                        >
                          {item.name}
                        </Link>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Weight variant dropdown if multiple variants exist */}
                          {availableVariants.length > 1 ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-[#082B59]/60 font-medium">Weight:</span>
                              <select
                                value={item.weight}
                                onChange={(e) => updateVariant(item.cartItemId, e.target.value)}
                                className="text-xs font-semibold bg-[#FFF0D9] border border-[#D8B46A] text-[#082B59] px-2 py-0.5 rounded-lg focus:outline-none"
                              >
                                {availableVariants.map((v) => (
                                  <option key={v.weight} value={v.weight}>
                                    {v.weight} ({formatINR(v.price)})
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#FFF0D9] text-[#082B59] text-xs font-semibold border border-[#D8B46A]/50">
                              {item.weight}
                            </span>
                          )}

                          <span className="text-xs text-[#082B59]/75 font-medium">
                            {formatINR(item.price)} each
                          </span>
                        </div>

                        {/* Custom details preview if present */}
                        {item.customDetails && (
                          <div className="p-2 rounded-lg bg-[#FFF0D9]/40 border border-[#D8B46A]/20 text-[11px] text-[#082B59]/80 space-y-0.5">
                            {item.customDetails.occasion && (
                              <p><strong>Occasion:</strong> {item.customDetails.occasion}</p>
                            )}
                            {item.customDetails.cakeMessage && (
                              <p><strong>Message on Cake:</strong> "{item.customDetails.cakeMessage}"</p>
                            )}
                            {item.customDetails.flavour && (
                              <p><strong>Flavour:</strong> {item.customDetails.flavour}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0">
                        <div className="flex items-center bg-[#FFF0D9] border border-[#D8B46A] rounded-xl p-0.5 shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 hover:bg-white rounded-lg text-[#082B59] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-[#082B59]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 hover:bg-white rounded-lg text-[#082B59] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <span className="font-serif font-bold text-base text-[#082B59] block">
                            {formatINR(itemSubtotal)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-[11px] text-rose-600 hover:underline mt-0.5 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Ordering Notice Banner */}
            <div className="p-4 rounded-2xl bg-[#FFF0D9] border border-[#D8B46A] text-[#082B59] space-y-1.5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#BC964B] shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-bold">
                    {BUSINESS_INFO.whatsappOrderNotice}
                  </p>
                  <p className="text-[#082B59]/80 font-medium italic">
                    {BUSINESS_INFO.unconfirmedOrderNotice}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: WhatsApp Checkout Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-7 shadow-card space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0D9] text-[#082B59] text-xs font-semibold border border-[#D8B46A]/40 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#BC964B]" />
                <span>Primary WhatsApp Order Gateway</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#082B59]">
                Order Details
              </h2>
              <p className="text-xs text-[#082B59]/70 mt-1">
                Provide optional celebration details. They will be formatted cleanly into your WhatsApp order message.
              </p>
            </div>

            <form onSubmit={handleWhatsAppCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Customer Name (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Rohit Verma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm"
                  />
                  <User className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Preferred Delivery / Pickup Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    placeholder="e.g., Tomorrow by 5:00 PM"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm"
                  />
                  <Calendar className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Delivery Address in Gopalganj (or 'Pickup')
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g., Cinema Road, Near Ambedkar Chowk, Gopalganj (or specify Store Pickup)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm resize-none"
                  />
                  <MapPin className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Special Instructions / Message on Cake
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Write 'Happy Birthday Riya' with chocolate drips"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] shadow-sm"
                  />
                  <FileText className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-3" />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-2xl bg-[#FFFBF4] border border-[#D8B46A]/30 space-y-2.5 pt-4">
                <div className="flex items-center justify-between text-xs text-[#082B59]/75">
                  <span>Catalogue Subtotal:</span>
                  <span className="font-semibold text-[#082B59]">{formatINR(estimatedTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#082B59]/75">
                  <span>Delivery Charges:</span>
                  <span className="text-[#BC964B] font-semibold italic">Agreed on WhatsApp</span>
                </div>
                <div className="border-t border-[#D8B46A]/30 pt-2 flex items-baseline justify-between">
                  <span className="font-serif text-sm font-bold text-[#082B59]">Estimated Total:</span>
                  <span className="font-serif text-2xl font-bold text-[#082B59]">
                    {formatINR(estimatedTotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#082B59]/65 italic">
                  *The cart total is an estimate based on the current catalogue. The owner will confirm final pricing, delivery availability, and payment arrangements on WhatsApp.
                </p>
              </div>

              {/* Primary Order on WhatsApp Action Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95"
              >
                <span className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>Order on WhatsApp (+91 {BUSINESS_INFO.phoneDisplay})</span>
              </button>

              {/* Safe Payment Clarification */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#082B59]/70 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BC964B]" />
                <span>Zero online payments on this website. Settle directly with the owner upon confirmation.</span>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
