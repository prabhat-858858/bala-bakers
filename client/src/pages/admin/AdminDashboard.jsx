import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cake,
  CheckCircle2,
  XCircle,
  ClipboardList,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../services/whatsapp';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const orderData = await api.getOrders();
      setData(orderData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard overview data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Owner Dashboard Overview | Bela Bakers';
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-[#082B59]">Loading Bela Bakers Dashboard Overview...</p>
      </div>
    );
  }

  const overview = data?.overview || {};
  const orders = data?.orders || [];
  const popularProducts = overview.popularProducts || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#082B59] via-[#0B356D] to-[#082B59] rounded-3xl p-6 sm:p-8 text-[#FFF0D9] border-2 border-[#D8B46A]/50 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[#D8B46A] text-xs font-bold uppercase tracking-widest block">
            Bela Bakers Operations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Bakery Control Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF0D9]/80 max-w-xl">
            Live management of cake catalogue prices, weight variants, availability switches, and manual WhatsApp enquiry tracking.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#D8B46A] hover:bg-[#BC964B] text-[#082B59] text-xs font-bold shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Cake</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF0D9] border border-[#D8B46A]/40 text-xs font-semibold transition-all"
          >
            <ClipboardList className="w-4 h-4 text-[#D8B46A]" />
            <span>Record Order</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadDashboard} className="font-bold underline">Retry</button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Active Products */}
        <div className="bg-white rounded-2xl p-5 border border-[#D8B46A]/35 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-[#082B59]/75">
              Active Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#082B59]">
            {overview.totalActiveProducts ?? 0}
          </div>
          <p className="text-[11px] text-[#082B59]/65">
            Currently available on customer shop page
          </p>
        </div>

        {/* Unavailable Products */}
        <div className="bg-white rounded-2xl p-5 border border-[#D8B46A]/35 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-[#082B59]/75">
              Marked Unavailable
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#082B59]">
            {overview.unavailableProducts ?? 0}
          </div>
          <p className="text-[11px] text-[#082B59]/65">
            Marked sold out in database (hidden from customers)
          </p>
        </div>

        {/* Recorded Orders */}
        <div className="bg-white rounded-2xl p-5 border border-[#D8B46A]/35 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-[#082B59]/75">
              Manually Recorded Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF0D9] text-[#082B59] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#082B59]">
            {overview.totalRecordedOrders ?? 0}
          </div>
          <p className="text-[11px] text-[#082B59]/65">
            Manual WhatsApp order records tracked by owner
          </p>
        </div>

        {/* Flagged For Review */}
        <div className="bg-white rounded-2xl p-5 border border-[#D8B46A]/35 shadow-card space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-[#082B59]/75">
              Catalogue Items For Review
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#082B59]">
            {overview.flaggedForReviewProducts ?? 0}
          </div>
          <p className="text-[11px] text-[#082B59]/65">
            Items flagged for price or recipe verification
          </p>
        </div>

      </div>

      {/* Main Grid: Recent Order Records & Popular Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#D8B46A]/35 p-6 sm:p-7 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#D8B46A]/20 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#082B59]">
                Recent Manually Recorded Orders
              </h2>
              <p className="text-xs text-[#082B59]/70">
                Customer orders received on WhatsApp and logged into the owner ledger.
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#082B59] hover:text-[#BC964B] inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Clock className="w-8 h-8 text-[#082B59]/30 mx-auto" />
              <p className="text-xs font-semibold text-[#082B59]">No orders manually recorded yet.</p>
              <p className="text-[11px] text-[#082B59]/65 max-w-sm mx-auto">
                When customers place an order through WhatsApp, you can log it into your ledger for preparation and delivery tracking.
              </p>
              <Link
                to="/admin/orders"
                className="inline-block mt-2 px-4 py-2 rounded-full bg-[#082B59] text-[#FFF0D9] text-xs font-bold"
              >
                Record an Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8B46A]/20 text-[#082B59]/65 uppercase tracking-wider font-bold">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items Summary</th>
                    <th className="pb-3">Est. Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Recorded Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8B46A]/15">
                  {orders.slice(0, 5).map((ord) => {
                    const statusBadgeColors = {
                      enquiry: 'bg-slate-100 text-slate-700',
                      contacted: 'bg-blue-100 text-blue-800',
                      confirmed: 'bg-purple-100 text-purple-800',
                      preparing: 'bg-amber-100 text-amber-800',
                      ready: 'bg-teal-100 text-teal-800',
                      delivered: 'bg-emerald-100 text-emerald-800',
                      cancelled: 'bg-rose-100 text-rose-800',
                    };

                    return (
                      <tr key={ord._id} className="hover:bg-[#FFFBF4] transition-colors">
                        <td className="py-3 font-semibold text-[#082B59]">
                          <div>{ord.customerName}</div>
                          <div className="text-[11px] text-[#082B59]/60">{ord.customerPhone}</div>
                        </td>
                        <td className="py-3 text-[#082B59]/80 max-w-[200px] truncate">
                          {(ord.items || []).map((i) => `${i.productName} (${i.selectedWeight || i.weight})`).join(', ')}
                        </td>
                        <td className="py-3 font-bold text-[#082B59]">
                          {formatINR(ord.estimatedTotal)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              statusBadgeColors[ord.orderStatus] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[#082B59]/60">
                          {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Popular Products (Only real data from recorded orders) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#D8B46A]/35 p-6 shadow-card space-y-4">
            <h3 className="font-serif text-base font-bold text-[#082B59] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#BC964B]" />
              <span>Popular Products (From Real Orders)</span>
            </h3>

            {popularProducts.length === 0 ? (
              <p className="text-xs text-[#082B59]/65 italic leading-relaxed">
                No orders recorded yet. Popular products will appear here dynamically as real customer orders are logged into the system.
              </p>
            ) : (
              <div className="space-y-3">
                {popularProducts.map((p, idx) => (
                  <div key={p.productName} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-[#082B59] truncate">
                      <span className="w-5 h-5 rounded-full bg-[#FFF0D9] text-[#082B59] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{p.productName}</span>
                    </div>
                    <span className="text-[#082B59]/65 font-semibold shrink-0">
                      {p.totalQuantity} ordered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick link box */}
          <div className="bg-[#FFF0D9] rounded-3xl border border-[#D8B46A] p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#082B59]">
              Instant Price & Availability Control
            </h3>
            <p className="text-xs text-[#082B59]/80 leading-relaxed">
              Updating prices or marking cakes as sold out updates MongoDB instantly without code changes or redeployments.
            </p>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#082B59] text-[#FFF0D9] text-xs font-bold hover:bg-[#051C3B] transition-colors"
            >
              <span>Manage Products</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D8B46A]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
