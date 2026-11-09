import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MessageCircle,
  ShoppingBag,
  Award,
  HeartHandshake,
  Clock,
  CakeSlice,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import {
  BUSINESS_INFO,
  buildGeneralWhatsAppUrl,
  buildCustomCakeWhatsAppUrl,
} from '../services/whatsapp';
import ProductCard from '../components/ProductCard';

const CATEGORY_CARDS = [
  {
    name: 'Counter Cakes',
    tagline: 'Fresh celebration cakes ready daily',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Custom Cakes',
    tagline: 'Bespoke wedding, theme & tier cakes',
    image:
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pastries',
    tagline: 'Rich layered slices & boxes',
    image:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cupcakes',
    tagline: 'Hand-piped gourmet swirls',
    image:
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cookies',
    tagline: 'Small-batch buttery bakery cookies',
    image:
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Donuts',
    tagline: 'Glazed brioche rings & toppings',
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Desserts',
    tagline: 'Cheesecake jars & artisanal treats',
    image:
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick Custom Cake Enquiry State on Home Page
  const [customForm, setCustomForm] = useState({
    occasion: 'Birthday Celebration',
    desiredWeight: '2 Pounds (1 kg)',
    preferredFlavour: 'Belgian Chocolate Truffle',
    cakeMessage: '',
    deliveryDate: '',
    designDescription: '',
  });

  useEffect(() => {
    document.title = 'Bela Cakes & Deserts | Every Celebration Deserves a Beautiful Cake — Gopalganj';
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getProducts({ featured: 'true' });
        if (isMounted) {
          setFeaturedProducts((data.products || []).slice(0, 6));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load featured cakes right now.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const customCakeWhatsAppLink = buildCustomCakeWhatsAppUrl({
    productName: 'Custom Designer Cake Request',
    ...customForm,
  });

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#082B59] text-[#FFF0D9] border-b-4 border-[#D8B46A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D8B46A]/50 text-[#D8B46A] text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Bela Cakes & Deserts • Gopalganj, Bihar</span>
              </div>

              <h1 className="hero-headline font-serif font-bold text-white tracking-tight">
                Every Celebration Deserves a Beautiful Cake.
              </h1>

              <p className="text-lg sm:text-xl text-[#FFF0D9]/90 font-medium max-w-2xl leading-relaxed">
                Freshly baked happiness, made with love. Explore our signature counter cakes, custom designer tiers, pastries, cupcakes, cookies, donuts, and artisanal desserts.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#D8B46A] hover:bg-[#BC964B] text-[#082B59] px-7 py-4 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Cakes</span>
                </Link>

                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#FFF0D9] hover:bg-white text-[#082B59] px-7 py-4 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#082B59]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <p className="text-xs sm:text-sm text-[#FFF0D9]/80 bg-white/5 border border-[#D8B46A]/30 rounded-xl px-4 py-3 max-w-xl">
                  {BUSINESS_INFO.whatsappOrderNotice}
                </p>
              </div>
            </div>

            {/* Hero Showcase Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-4 border-[#D8B46A] shadow-2xl bg-[#051C3B]">
                <img
                  src="https://res.cloudinary.com/dk6gxpotq/image/upload/t_third/belaImage_z9gga1.jpg"
                  alt="Bela Cakes & Deserts Signature Chocolate Truffle Cake"
                  fetchpriority="high"
                  className="w-full h-[360px] sm:h-[440px] object-contain"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#082B59]/90 backdrop-blur-md border border-[#D8B46A]/50 rounded-2xl p-4 text-[#FFF0D9]">
                  <p className="font-serif text-lg font-bold text-white">
                    Handcrafted Fresh Every Morning
                  </p>
                  <p className="text-xs text-[#FFF0D9]/80 mt-0.5">
                   Gopalganj, Bihar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BC964B]">
              Explore by Category
            </span>
            <h2 className="section-heading font-serif font-bold text-[#082B59] mt-1">
              Our Bakery Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#082B59] hover:text-[#BC964B] transition-colors"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl border border-[#D8B46A]/35 p-3 shadow-sm hover:shadow-cardHover hover:border-[#D8B46A] transition-all text-center flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FFF0D9]/50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#082B59] group-hover:text-[#BC964B]">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#082B59]/65 mt-1 line-clamp-2">
                {cat.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES SECTION */}
      <section className="bg-[#FFF0D9]/45 border-y border-[#D8B46A]/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BC964B]">
                Customer Favourites
              </span>
              <h2 className="section-heading font-serif font-bold text-[#082B59] mt-1">
                Featured Cakes & Signature Creations
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082B59] text-[#FFF0D9] text-xs sm:text-sm font-bold hover:bg-[#051C3B] transition-colors"
            >
              <span>Browse All Cakes</span>
              <ArrowRight className="w-4 h-4 text-[#D8B46A]" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-2xl bg-white/80 animate-pulse border border-[#D8B46A]/20 p-5"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm">
              {error}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-[#D8B46A]/30 text-center">
              <p className="text-base font-semibold text-[#082B59]">
                No featured cakes currently selected. Browse our full shop catalogue!
              </p>
              <Link
                to="/shop"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082B59] text-[#FFF0D9] text-sm font-bold"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CUSTOM CAKE REQUEST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-[#082B59] text-[#FFF0D9] border-2 border-[#D8B46A] overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 space-y-5 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#D8B46A]">
                <CakeSlice className="w-4 h-4" />
                Bespoke Creations
              </span>
              <h2 className="section-heading font-serif font-bold text-white">
                Request a Custom Cake for Your Special Occasion
              </h2>
              <p className="text-sm sm:text-base text-[#FFF0D9]/85 leading-relaxed">
                Planning a wedding, milestone anniversary, engagement, or themed birthday party? Share your preferred weight, flavour, message, and design idea — our master bakers at Bela Bakers will craft it to perfection and confirm pricing with you directly on WhatsApp.
              </p>
              <div className="p-4 rounded-2xl bg-white/10 border border-[#D8B46A]/40 text-xs text-[#FFF0D9]/90 space-y-1">
                <p className="font-bold text-[#D8B46A]">How Custom Cake Requests Work:</p>
                <p>
                  Custom cake enquiries are treated as requests until our team confirms availability, design feasibility, final pricing, and delivery arrangements through WhatsApp.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-[#082B59] p-8 sm:p-10 lg:p-12">
              <h3 className="font-serif text-xl font-bold text-[#082B59] mb-4">
                Quick Custom Cake Enquiry
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={customForm.occasion}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, occasion: e.target.value })
                    }
                    placeholder="e.g., Birthday, Wedding, Anniversary"
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Desired Weight
                  </label>
                  <input
                    type="text"
                    value={customForm.desiredWeight}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, desiredWeight: e.target.value })
                    }
                    placeholder="e.g., 2 Pounds, 2 kg, Two-Tier"
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Preferred Flavour
                  </label>
                  <input
                    type="text"
                    value={customForm.preferredFlavour}
                    onChange={(e) =>
                      setCustomForm({
                        ...customForm,
                        preferredFlavour: e.target.value,
                      })
                    }
                    placeholder="e.g., Chocolate Truffle, Rasmalai, Red Velvet"
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Required Delivery Date
                  </label>
                  <input
                    type="date"
                    value={customForm.deliveryDate}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, deliveryDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Message on Cake
                  </label>
                  <input
                    type="text"
                    value={customForm.cakeMessage}
                    onChange={(e) =>
                      setCustomForm({ ...customForm, cakeMessage: e.target.value })
                    }
                    placeholder="e.g., Happy 1st Birthday Aarav!"
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#082B59]/75 mb-1">
                    Design Description
                  </label>
                  <textarea
                    rows={2}
                    value={customForm.designDescription}
                    onChange={(e) =>
                      setCustomForm({
                        ...customForm,
                        designDescription: e.target.value,
                      })
                    }
                    placeholder="Describe colours, theme, floral work, or tiers..."
                    className="w-full rounded-xl border border-[#D8B46A]/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#082B59]"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={customCakeWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#D8B46A]" />
                  <span>Request a Custom Cake on WhatsApp</span>
                </a>
                <Link
                  to="/shop?category=Custom+Cakes"
                  className="text-xs font-bold text-[#082B59] hover:text-[#BC964B] underline"
                >
                  Or view Custom Cake templates →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="bg-white border-y border-[#D8B46A]/25 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BC964B]">
              The Bela Bakers Promise
            </span>
            <h2 className="section-heading font-serif font-bold text-[#082B59] mt-1">
              Why Gopalganj Loves Bela Bakers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#FFF0D9]/35 border border-[#D8B46A]/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#082B59] text-[#D8B46A] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#082B59]">
                Finest Ingredients & Fresh Sponges
              </h3>
              <p className="text-sm text-[#082B59]/75 leading-relaxed">
                Every cake, pastry, and dessert is baked fresh in our Cinema Road kitchen using rich cocoa, real fruit compotes, and velvety dairy cream.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#FFF0D9]/35 border border-[#D8B46A]/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#082B59] text-[#D8B46A] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#082B59]">
                Personal WhatsApp Consultation
              </h3>
              <p className="text-sm text-[#082B59]/75 leading-relaxed">
                No confusing automated checkouts. Speak directly with our bakery team on WhatsApp to confirm flavours, custom messages, delivery timing, and payment.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#FFF0D9]/35 border border-[#D8B46A]/40 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#082B59] text-[#D8B46A] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#082B59]">
                Counter Ready & Bespoke Orders
              </h3>
              <p className="text-sm text-[#082B59]/75 leading-relaxed">
                Need a cake right away? Pick from our freshly stocked counter cakes or pre-book a custom multi-tier creation for your grand event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-[#FFF0D9]/60 border border-[#D8B46A]/50 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BC964B]">
                Visit or Message Us
              </span>
              <h2 className="section-heading font-serif font-bold text-[#082B59]">
                Bela Bakers — Gopalganj, Bihar
              </h2>
              <div className="space-y-2.5 text-sm sm:text-base text-[#082B59]/85">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#082B59] shrink-0 mt-0.5" />
                  <span>
                    <strong>Address:</strong> {BUSINESS_INFO.address}, {BUSINESS_INFO.location}
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-[#082B59] shrink-0" />
                  <span>
                    <strong>Phone / WhatsApp:</strong>{' '}
                    <a
                      href={`tel:+91${BUSINESS_INFO.phoneDisplay}`}
                      className="underline font-bold"
                    >
                      +91 {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D8B46A] text-xs font-bold text-[#082B59] hover:bg-[#082B59] hover:text-[#FFF0D9] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram (@bela.desserts)</span>
                </a>
                <a
                  href={BUSINESS_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D8B46A] text-xs font-bold text-[#082B59] hover:bg-[#082B59] hover:text-[#FFF0D9] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] px-6 py-4 rounded-2xl font-bold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#D8B46A]" />
                <span>Order on WhatsApp (+91 {BUSINESS_INFO.phoneDisplay})</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FFF0D9] text-[#082B59] border border-[#082B59]/20 px-6 py-4 rounded-2xl font-bold text-sm transition-colors"
              >
                <span>Contact the Shop</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
