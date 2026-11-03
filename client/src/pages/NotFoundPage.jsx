import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#D8B46A]/40 shadow-card">
        <div className="w-20 h-20 rounded-full bg-[#FFF0D9] border-2 border-[#D8B46A] text-[#082B59] mx-auto flex items-center justify-center shadow-sm">
          <Cake className="w-10 h-10 text-[#082B59]" />
        </div>

        <div className="space-y-2">
          <span className="font-serif text-6xl font-extrabold text-[#082B59] block tracking-tight">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#082B59]">
            This Slice Has Crumbled Away
          </h1>
          <p className="text-xs sm:text-sm text-[#082B59]/75 leading-relaxed">
            The page you are looking for doesn't exist or has been moved. Let's get you back to our freshest bakes in Gopalganj!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] text-xs font-bold border border-[#D8B46A] shadow-md transition-all"
          >
            <Home className="w-4 h-4 text-[#D8B46A]" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FFF0D9] hover:bg-[#D8B46A]/30 text-[#082B59] text-xs font-bold border border-[#D8B46A] transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#082B59]" />
            <span>Browse Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
