import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  MessageCircle,
  Cake,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO, buildGeneralWhatsAppUrl } from '../services/whatsapp';

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors duration-200 px-3 py-2 rounded-lg ${
      isActive
        ? 'text-[#082B59] bg-[#FFF0D9]'
        : 'text-[#082B59]/80 hover:text-[#082B59] hover:bg-[#FFF0D9]/50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D8B46A]/30 shadow-sm">
      {/* Top Announcement Banner */}
      <div className="bg-[#082B59] text-[#FFF0D9] text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <p className="flex items-center justify-center sm:justify-start gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B46A] shrink-0" />
            <span>{BUSINESS_INFO.whatsappOrderNotice}</span>
          </p>
          <a
            href={`tel:+91${BUSINESS_INFO.phoneDisplay}`}
            className="hidden md:inline-flex items-center gap-1.5 text-[#D8B46A] hover:underline font-semibold shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 {BUSINESS_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <img
          src="https://res.cloudinary.com/dk6gxpotq/image/upload/t_firstLogo/BelaLogo_amdo6a.jpg"
          alt="Bela Cakes & Deserts Brand Logo"
          className="rounded-full w-16 h-16 object-contain"
        />
        <Link
          to="/"
          className=" flex items-center gap-3 group focus:outline-none"
          aria-label="Bela Bakers Home"
        >
          {/* <div className="w-11 h-11 rounded-full bg-[#082B59] border-2 border-[#D8B46A] flex items-center justify-center text-[#FFF0D9] shadow-md group-hover:scale-105 transition-transform">
            <Cake className="w-5 h-5 text-[#D8B46A]" />
          </div> */}
          <div>
            <span className="block font-serif text-2xl font-bold tracking-tight text-[#082B59] leading-none">
              <h1>Bela </h1><h5 className='small'>Cakes & Deserts</h5>
            </span>
            <span className="block text-[11px] uppercase tracking-[0.2em] text-[#BC964B] font-semibold mt-1">
              Gopalganj • Est. Artisanal Bakery
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClasses}>
            Products
          </NavLink>
          <NavLink to="/shop?category=Custom+Cakes" className={navLinkClasses}>
            Our Cake
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact
          </NavLink>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border border-[#D8B46A]/60 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-[#D8B46A]" />
            <span>Order on WhatsApp</span>
          </a>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 bg-[#FFF0D9] hover:bg-[#D8B46A]/30 text-[#082B59] border border-[#D8B46A] px-3.5 py-2.5 rounded-full text-sm font-semibold transition-colors"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#082B59]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-bold rounded-full bg-[#082B59] text-[#FFF0D9]">
              {totalItems}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-[#082B59] hover:bg-[#FFF0D9] focus:outline-none"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D8B46A]/40 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#082B59] hover:bg-[#FFF0D9]"
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#082B59] hover:bg-[#FFF0D9]"
          >
            Shop Catalogue
          </NavLink>
          <NavLink
            to="/shop?category=Custom+Cakes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#082B59] hover:bg-[#FFF0D9]"
          >
            Request a Custom Cake
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#082B59] hover:bg-[#FFF0D9]"
          >
            Contact the Shop
          </NavLink>
          <NavLink
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-base font-semibold text-[#082B59] hover:bg-[#FFF0D9]"
          >
            Shopping Cart ({totalItems})
          </NavLink>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#082B59] text-[#FFF0D9] py-3 rounded-xl font-semibold text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#D8B46A]" />
              <span>Order on WhatsApp ({BUSINESS_INFO.phoneDisplay})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
