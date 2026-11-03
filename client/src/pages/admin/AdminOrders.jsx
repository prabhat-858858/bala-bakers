import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Calendar,
  MapPin,
  Save,
  MessageCircle,
  Edit2,
  FileText,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatINR, BUSINESS_INFO } from '../../services/whatsapp';

const STATUS_LIST = [
  'enquiry',
  'contacted',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New manual order form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('Chocolate Truffle Cake');
  const [weight, setWeight] = useState('1 kg');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(850);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [initialStatus, setInitialStatus] = useState('enquiry');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // In-line note editing state
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNote, setTempNote] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load order records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Manual Order & Enquiry Ledger | Bela Bakers Owner';
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      await api.updateOrder(orderId, { orderStatus: newStatus });
      setSuccess(`Order marked as ${newStatus}.`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      loadOrders();
    }
  };

  const handleSaveNote = async (orderId) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, notes: tempNote } : o))
      );
      await api.updateOrder(orderId, { notes: tempNote });
      setEditingNoteId(null);
      setSuccess('Internal note updated.');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      alert(`Could not save note: ${err.message}`);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Customer Name and Phone number are required.');
      return;
    }

    setSubmitting(true);
    const estTotal = Number(price) * Number(quantity);

    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: [
        {
          productName: productName.trim(),
          selectedWeight: weight.trim(),
          weight: weight.trim(),
          quantity: Number(quantity),
          price: Number(price),
        },
      ],
      estimatedTotal: estTotal,
      deliveryAddress: deliveryAddress.trim(),
      requestedDeliveryDate: deliveryDate.trim(),
      orderStatus: initialStatus,
      notes: orderNotes.trim(),
    };

    try {
      const res = await api.createOrder(payload);
      if (res.order) {
        setOrders((prev) => [res.order, ...prev]);
      }
      setIsModalOpen(false);
      setSuccess('Order successfully recorded in bakery ledger.');
      setTimeout(() => setSuccess(''), 3000);

      // Reset
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setDeliveryDate('');
      setOrderNotes('');
    } catch (err) {
      alert(`Failed to record order: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q) ||
      (o.items || []).some((item) => item.productName?.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const map = {
      enquiry: 'bg-slate-100 text-slate-800 border-slate-300',
      contacted: 'bg-blue-100 text-blue-900 border-blue-300',
      confirmed: 'bg-purple-100 text-purple-900 border-purple-300',
      preparing: 'bg-amber-100 text-amber-900 border-amber-300',
      ready: 'bg-teal-100 text-teal-900 border-teal-300',
      delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
    };
    return map[status] || map.enquiry;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082B59]">
            Customer Order & Enquiry Ledger
          </h1>
          <p className="text-xs text-[#082B59]/75 mt-0.5">
            Manually track orders, update preparation stages, and store internal customer notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] text-xs font-bold shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#D8B46A]" />
          <span>Record New Order</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold">×</button>
        </div>
      )}

      {/* Channel Explanation Card */}
      <div className="p-4 rounded-2xl bg-[#FFF0D9] border border-[#D8B46A] text-[#082B59] flex items-start gap-3 shadow-sm">
        <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <p className="font-bold">
            WhatsApp Order Channel Architecture
          </p>
          <p className="text-[#082B59]/80 leading-relaxed">
            Customers communicate and negotiate directly through WhatsApp (+91 {BUSINESS_INFO.phoneDisplay}). The website does not ingest private WhatsApp chats; the owner logs and updates orders here to track kitchen baking stages and deliveries.
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#D8B46A]/35 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, or cake..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
            />
            <Search className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-2.5" />
          </div>

          <span className="text-xs text-[#082B59]/70 font-semibold self-end sm:self-center">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#D8B46A]/20 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#082B59] text-[#FFF0D9]'
                : 'bg-[#FFF0D9]/50 hover:bg-[#FFF0D9] text-[#082B59]'
            }`}
          >
            All ({orders.length})
          </button>
          {STATUS_LIST.map((st) => {
            const count = orders.filter((o) => o.orderStatus === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? 'bg-[#082B59] text-[#FFF0D9]'
                    : 'bg-[#FFF0D9]/50 hover:bg-[#FFF0D9] text-[#082B59]'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#D8B46A]/35 shadow-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#082B59]">Loading order records...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ClipboardList className="w-8 h-8 text-[#082B59]/30 mx-auto" />
            <p className="text-xs font-semibold text-[#082B59]">No orders found for this status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFBF4] border-b border-[#D8B46A]/30 text-[#082B59] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items & Weights</th>
                  <th className="py-3.5 px-4">Est. Total</th>
                  <th className="py-3.5 px-4">Delivery & Date</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">Internal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8B46A]/15">
                {filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FFFBF4]/80 transition-colors align-top">
                    {/* Customer */}
                    <td className="py-3.5 px-4 font-semibold text-[#082B59]">
                      <div className="font-bold text-sm">{ord.customerName}</div>
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="text-[#082B59]/70 hover:text-[#BC964B] flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-[#BC964B]" />
                        <span>{ord.customerPhone}</span>
                      </a>
                      <span className="text-[10px] text-[#082B59]/50 block mt-1">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 text-[#082B59]">
                      <div className="space-y-1">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold">{item.productName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#FFF0D9] text-[#082B59] text-[10px] font-semibold border border-[#D8B46A]/40">
                              {item.selectedWeight || item.weight} × {item.quantity}
                            </span>
                            <span className="text-[#082B59]/70 text-[11px]">
                              ({formatINR(item.price * item.quantity)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Est. Total */}
                    <td className="py-3.5 px-4 font-bold text-[#082B59] text-sm">
                      {formatINR(ord.estimatedTotal)}
                    </td>

                    {/* Delivery & Date */}
                    <td className="py-3.5 px-4 text-[#082B59]/80 max-w-xs">
                      {ord.requestedDeliveryDate && (
                        <div className="flex items-center gap-1 font-semibold text-[#082B59] text-[11px] mb-0.5">
                          <Calendar className="w-3 h-3 text-[#BC964B]" />
                          <span>{ord.requestedDeliveryDate}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-[#082B59]/70 line-clamp-2">
                        {ord.deliveryAddress || 'Store Pickup at Dayal Complex'}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${getStatusColor(
                          ord.orderStatus
                        )}`}
                      >
                        {STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Notes (Inline Editable) */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {editingNoteId === ord._id ? (
                        <div className="space-y-1.5">
                          <textarea
                            rows={2}
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Add internal kitchen or payment note..."
                            className="w-full p-2 text-xs border border-[#D8B46A]/40 rounded-xl focus:outline-none focus:border-[#082B59]"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveNote(ord._id)}
                              className="px-2.5 py-1 bg-[#082B59] text-[#FFF0D9] rounded-lg text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(null)}
                              className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNoteId(ord._id);
                            setTempNote(ord.notes || '');
                          }}
                          className="cursor-pointer hover:bg-[#FFF0D9]/50 p-2 rounded-xl text-[11px] text-[#082B59]/80 border border-transparent hover:border-[#D8B46A]/30 transition-colors"
                          title="Click to edit internal note"
                        >
                          {ord.notes ? (
                            <p className="line-clamp-2">{ord.notes}</p>
                          ) : (
                            <span className="text-[#082B59]/40 italic">+ Add note</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record New Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-[#D8B46A]/40">
            <div className="flex items-center justify-between border-b border-[#D8B46A]/20 pb-3">
              <h2 className="font-serif text-xl font-bold text-[#082B59]">
                Record Customer WhatsApp Order
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#082B59] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Alok Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#082B59] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., 98XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FFFBF4] rounded-2xl border border-[#D8B46A]/30 space-y-3">
                <span className="font-bold text-[#082B59] block uppercase tracking-wider text-[11px]">
                  Ordered Item & Portions
                </span>
                <div>
                  <label className="block font-medium text-[#082B59]/75 mb-1">
                    Cake Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Belgian Chocolate Truffle Cake"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-medium text-[#082B59]/75 mb-1">
                      Weight / Size
                    </label>
                    <input
                      type="text"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g., 1 kg"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#082B59]/75 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#082B59]/75 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8B46A]/30 bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="text-right font-serif font-bold text-sm text-[#082B59]">
                  Total: {formatINR(price * quantity)}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Requested Delivery Date & Time
                </label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="e.g., Today by 6:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#082B59] mb-1">
                  Delivery Address in Gopalganj
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street, Landmark, Gopalganj (or leave blank for Store Pickup)"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#082B59] mb-1">
                    Initial Status
                  </label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40 uppercase text-xs"
                  >
                    {STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#082B59] mb-1">
                    Internal Note / Message on Cake
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g., 'Happy 1st Birthday Anaya'"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8B46A]/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#D8B46A]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] font-bold"
                >
                  {submitting ? 'Recording...' : 'Save to Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
