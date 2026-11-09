import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cake,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Lock,
} from 'lucide-react';
import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../services/whatsapp';

export default function Footer() {
  return (
    <footer className="bg-[#082B59] text-[#FFF0D9] border-t-4 border-[#D8B46A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF0D9] flex items-center justify-center text-[#082B59]">
                <Cake className="w-5 h-5 text-[#082B59]" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                Bela Cakes & Deserts
              </span>
            </div>
            <p className="text-sm text-[#FFF0D9]/80 leading-relaxed">
              Freshly baked happiness, made with love in Gopalganj. Celebrating birthdays, weddings, anniversaries, and everyday moments with handcrafted cakes and desserts.
            </p>
            <div className="p-3.5 rounded-xl bg-white/5 border border-[#D8B46A]/30 text-xs text-[#FFF0D9]/90 leading-relaxed">
              {BUSINESS_INFO.whatsappOrderNotice}
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#D8B46A] mb-4">
              Our Bakery Menu
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'Counter Cakes',
                'Custom Cakes',
                'Pastries',
                'Cupcakes',
                'Cookies',
                'Donuts',
                'Desserts',
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="text-[#FFF0D9]/80 hover:text-[#D8B46A] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#D8B46A] mb-4">
              Customer Actions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-[#FFF0D9]/80 hover:text-[#D8B46A] transition-colors"
                >
                  Browse Full Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Custom+Cakes"
                  className="text-[#FFF0D9]/80 hover:text-[#D8B46A] transition-colors"
                >
                  Request a Custom Cake
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-[#FFF0D9]/80 hover:text-[#D8B46A] transition-colors"
                >
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#FFF0D9]/80 hover:text-[#D8B46A] transition-colors"
                >
                  Contact the Shop
                </Link>
              </li>
              <li>
                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D8B46A] hover:underline font-medium inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Visit & Social */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#D8B46A]">
              Visit Bela Cakes & Deserts
            </h3>
            <div className="space-y-3 text-sm text-[#FFF0D9]/85">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D8B46A] shrink-0 mt-1" />
                <span>
                  {BUSINESS_INFO.address}, {BUSINESS_INFO.location}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D8B46A] shrink-0" />
                <a
                  href={`tel:+91${BUSINESS_INFO.phoneDisplay}`}
                  className="hover:text-[#D8B46A] transition-colors font-semibold"
                >
                  +91 {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-[#D8B46A] font-semibold mb-2.5">
                Follow Our Creations
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#D8B46A] hover:text-[#082B59] text-xs font-semibold transition-colors"
                  aria-label="Bela Bakers on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@bela.desserts</span>
                </a>
                <a
                  href={BUSINESS_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-[#D8B46A] hover:text-[#082B59] text-xs font-semibold transition-colors"
                  aria-label="Bela Bakers on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF0D9]/60">
          <p>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}, Gopalganj, Bihar. All orders settled directly via WhatsApp.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-[#FFF0D9]/50 hover:text-[#D8B46A] transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
