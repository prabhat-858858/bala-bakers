import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Sparkles,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  buildGeneralWhatsAppUrl,
} from '../services/whatsapp';
import { api } from '../services/api';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [topic, setTopic] = useState('Custom Celebration Cake');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = 'Contact & Bakery Location | Bela Bakers Gopalganj';
    (async () => {
      try {
        const data = await api.getSettings();
        if (data.settings) setSettings(data.settings);
      } catch {
        // Fallback gracefully to default business info
      }
    })();
  }, []);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    let text = `Hello ${BUSINESS_INFO.name}!\n\n`;
    text += `*Topic:* ${topic}\n`;
    if (name.trim()) text += `*Name:* ${name.trim()}\n`;
    if (message.trim()) text += `*Enquiry:* ${message.trim()}\n\n`;
    text += `Please get in touch to confirm availability and pricing.\nThank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const openingHours = settings?.openingHours || 'Monday to Sunday: 9:00 AM – 10:00 PM';
  const addressText = settings?.address || BUSINESS_INFO.address;
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://maps.google.com/maps?q=Cinema+Road,+Near+Ambedkar+Chowk,+Gopalganj,+Bihar&t=&z=16&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0D9] text-[#082B59] text-xs font-semibold border border-[#D8B46A]/50">
          <Sparkles className="w-3.5 h-3.5 text-[#BC964B]" />
          <span>We'd Love to Bake for Your Celebration</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#082B59]">
          Contact the Shop
        </h1>
        <p className="text-xs sm:text-sm text-[#082B59]/75 leading-relaxed">
          Reach out directly to Bela Bakers in Gopalganj, Bihar. Whether you need a counter cake today or an elaborate custom tiered cake, speak directly with our team on WhatsApp.
        </p>
      </div>

      {/* Mandatory Business Notice Banner */}
      <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#FFF0D9] border border-[#D8B46A] text-[#082B59] flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-[#BC964B] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold">
            {BUSINESS_INFO.whatsappOrderNotice}
          </p>
          <p className="text-[#082B59]/80 font-medium italic">
            {BUSINESS_INFO.unconfirmedOrderNotice}
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Cards & WhatsApp Direct Message Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Official Shop Details */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#082B59] border-b border-[#D8B46A]/20 pb-4">
              Bela Bakers Shop Information
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0D9] text-[#082B59] flex items-center justify-center shrink-0 border border-[#D8B46A]/30">
                  <MapPin className="w-5 h-5 text-[#082B59]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#082B59]">Bakery Address</h3>
                  <p className="text-[#082B59]/80 mt-0.5 leading-relaxed">
                    {addressText}
                  </p>
                  <p className="text-[11px] text-[#BC964B] font-semibold mt-1">
                    Gopalganj, Bihar, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0D9] text-[#082B59] flex items-center justify-center shrink-0 border border-[#D8B46A]/30">
                  <Phone className="w-5 h-5 text-[#082B59]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#082B59]">Contact Number</h3>
                  <a
                    href={`tel:+91${BUSINESS_INFO.phoneDisplay}`}
                    className="text-[#082B59] hover:text-[#BC964B] font-bold text-sm block mt-0.5"
                  >
                    +91 {BUSINESS_INFO.phoneDisplay}
                  </a>
                  <p className="text-[11px] text-[#082B59]/65">Direct phone support during bakery hours</p>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/40">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#082B59]">WhatsApp Channel</h3>
                  <a
                    href={buildGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline font-bold text-sm mt-0.5"
                  >
                    <span>Chat on WhatsApp (+91 {BUSINESS_INFO.phoneDisplay})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-[#082B59]/65">For real-time enquiries, cake orders & payment discussion</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0D9] text-[#082B59] flex items-center justify-center shrink-0 border border-[#D8B46A]/30">
                  <Clock className="w-5 h-5 text-[#082B59]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#082B59]">Bakery Opening Hours</h3>
                  <p className="text-[#082B59]/80 font-semibold mt-0.5">
                    {openingHours}
                  </p>
                  <p className="text-[11px] text-[#082B59]/65">Open daily for counter cakes and custom pickups</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-[#D8B46A]/20">
              <h3 className="text-xs font-bold text-[#082B59] uppercase tracking-wider mb-3">
                Follow Bela Bakers Online
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF0D9] hover:bg-[#D8B46A]/40 text-[#082B59] text-xs font-bold border border-[#D8B46A]/40 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-rose-600" />
                  <span>Instagram (@bela.desserts)</span>
                </a>
                <a
                  href={BUSINESS_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF0D9] hover:bg-[#D8B46A]/40 text-[#082B59] text-xs font-bold border border-[#D8B46A]/40 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive WhatsApp Message Composer & Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-8 shadow-card space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#082B59]">
                Send a Message to the Owner
              </h2>
              <p className="text-xs text-[#082B59]/70 mt-1">
                Fill in what you'd like to ask or request. Clicking submit will open WhatsApp with your prefilled enquiry.
              </p>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Enquiry Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] font-medium focus:outline-none focus:border-[#082B59]"
                >
                  <option value="Custom Celebration Cake">Custom Celebration Cake Request</option>
                  <option value="Wedding / Multi-Tier Cake">Wedding / Multi-Tier Cake</option>
                  <option value="Same-Day Counter Cake Availability">Same-Day Counter Cake Availability</option>
                  <option value="Party & Bulk Dessert Box">Party & Bulk Dessert Box</option>
                  <option value="Delivery Confirmation & Timings">Delivery Confirmation & Timings</option>
                  <option value="General Bakery Question">General Bakery Question</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ananya Singh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Your Message / Cake Requirements
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about desired flavour, weight, delivery date, or design idea..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 bg-white text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 fill-current" />
                </span>
                <span>Send via WhatsApp (+91 {BUSINESS_INFO.phoneDisplay})</span>
              </button>
            </form>

            {/* Embedded Google Map */}
            <div className="pt-6 border-t border-[#D8B46A]/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#082B59]">
                  Shop Location in Gopalganj
                </h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dayal+Complex+Cinema+Road+Near+Ambedkar+Chowk+Gopalganj+Bihar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#BC964B] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#D8B46A]/30 h-64 bg-[#FFF0D9]/30 relative shadow-inner">
                <iframe
                  title="Bela Bakers Bakery Location"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
