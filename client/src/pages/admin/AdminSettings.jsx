import React, { useEffect, useState } from 'react';
import { Settings, Save, Check, AlertCircle, Clock, MapPin, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { BUSINESS_INFO } from '../../services/whatsapp';

export default function AdminSettings() {
  const [openingHours, setOpeningHours] = useState('');
  const [address, setAddress] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Shop Settings | Bela Bakers Owner';
    (async () => {
      try {
        setLoading(true);
        const data = await api.getSettings();
        if (data.settings) {
          setOpeningHours(data.settings.openingHours || 'Monday to Sunday: 9:00 AM – 10:00 PM');
          setAddress(data.settings.address || BUSINESS_INFO.address);
          setAnnouncement(data.settings.announcement || BUSINESS_INFO.whatsappOrderNotice);
          setMapEmbedUrl(data.settings.mapEmbedUrl || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load shop settings.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.updateSettings({
        openingHours,
        address,
        announcement,
        mapEmbedUrl,
      });
      setSuccess('Bakery settings updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#082B59]">Loading shop configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[#D8B46A]/30 pb-4">
        <h1 className="font-serif text-2xl font-bold text-[#082B59]">
          Bakery & Storefront Settings
        </h1>
        <p className="text-xs text-[#082B59]/75 mt-0.5">
          Configure shop operating hours, address announcements, and location map displayed to customers.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-8 shadow-card space-y-5 text-xs">
        <div>
          <label className="block font-semibold text-[#082B59] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#BC964B]" />
            <span>Bakery Opening Hours</span>
          </label>
          <input
            type="text"
            required
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="e.g. Monday to Sunday: 9:00 AM – 10:00 PM"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
          />
          <p className="text-[11px] text-[#082B59]/60 mt-1">
            Displayed on the Contact page and footer.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-[#082B59] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#BC964B]" />
            <span>Bakery Address</span>
          </label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59] resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#082B59] mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#BC964B]" />
            <span>Top Announcement / Notice Banner Text</span>
          </label>
          <input
            type="text"
            required
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#082B59] mb-1.5">
            Google Maps Embed URL
          </label>
          <input
            type="url"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="https://maps.google.com/maps?q=..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
          />
        </div>

        <div className="pt-3 border-t border-[#D8B46A]/20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] text-xs font-bold shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#D8B46A]" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
