import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildGeneralWhatsAppUrl, BUSINESS_INFO } from '../services/whatsapp';

export default function FloatingWhatsAppButton() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Order on WhatsApp at ${BUSINESS_INFO.phoneDisplay}`}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-all duration-200"
    >
      <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm">
        <MessageCircle className="w-4 h-4 fill-current" />
      </span>
      <span className="text-xs sm:text-sm font-bold tracking-wide pr-1">
        Order on WhatsApp
      </span>
    </a>
  );
}
