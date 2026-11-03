import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Star,
  AlertTriangle,
  ExternalLink,
  Eye,
  Filter,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../services/whatsapp';

const CATEGORIES = [
  'All',
  'Counter Cakes',
  'Custom Cakes',
  'Pastries',
  'Cupcakes',
  'Cookies',
  'Donuts',
  'Desserts',
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all'); // all, available, soldout

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getProducts({
        category: category === 'All' ? '' : category,
        search: search.trim(),
        adminView: 'true',
      });
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch cake catalogue from MongoDB.');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    document.title = 'Cake & Price Management | Bela Bakers Owner';
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleAvailability = async (product) => {
    const updatedStatus = !product.isAvailable;
    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isAvailable: updatedStatus } : p
        )
      );

      await api.updateProduct(product._id, { isAvailable: updatedStatus });
      setSuccessMessage(`"${product.name}" marked as ${updatedStatus ? 'Available' : 'Sold Out'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
      fetchProducts();
    }
  };

  const handleToggleFeatured = async (product) => {
    const updatedFeatured = !product.isFeatured;
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, isFeatured: updatedFeatured } : p
        )
      );

      await api.updateProduct(product._id, { isFeatured: updatedFeatured });
      setSuccessMessage(`"${product.name}" ${updatedFeatured ? 'featured on homepage' : 'removed from featured'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to update featured flag: ${err.message}`);
      fetchProducts();
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}" from Bela Bakers database? This cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      setSuccessMessage(`"${product.name}" deleted successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterAvailability === 'available') return p.isAvailable === true;
    if (filterAvailability === 'soldout') return p.isAvailable === false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082B59]">
            Cake Catalogue & Price Management
          </h1>
          <p className="text-xs text-[#082B59]/75 mt-0.5">
            Modify cake prices, edit weight variants, upload fresh photographs, and control customer availability.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082B59] hover:bg-[#051C3B] text-[#FFF0D9] border-2 border-[#D8B46A] text-xs font-bold shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#D8B46A]" />
          <span>Add New Cake</span>
        </Link>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="font-bold">×</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold">×</button>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#D8B46A]/35 shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by cake or pastry name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8B46A]/40 text-xs text-[#082B59] focus:outline-none focus:border-[#082B59]"
            />
            <Search className="w-4 h-4 text-[#082B59]/40 absolute left-3 top-2.5" />
          </div>

          {/* Availability filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <span className="font-semibold text-[#082B59]/75">Availability:</span>
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#D8B46A]/40 bg-white font-medium text-xs focus:outline-none"
            >
              <option value="all">All Products</option>
              <option value="available">Available Only</option>
              <option value="soldout">Sold Out Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#D8B46A]/20 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-[#082B59] text-[#FFF0D9]'
                  : 'bg-[#FFF0D9]/50 hover:bg-[#FFF0D9] text-[#082B59]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#D8B46A]/35 shadow-card overflow-hidden">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#082B59] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#082B59]">Connecting to MongoDB Atlas...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-[#082B59]">No products found matching filters.</p>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setSearch('');
                setFilterAvailability('all');
              }}
              className="text-xs text-[#BC964B] font-bold underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFBF4] border-b border-[#D8B46A]/30 text-[#082B59] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Cake / Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Weight Variants & Live Prices</th>
                  <th className="py-3.5 px-4 text-center">Available</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8B46A]/15">
                {filteredProducts.map((p) => {
                  const isAvail = p.isAvailable !== false;
                  const isFeat = p.isFeatured === true;
                  const thumb = p.images?.[0]?.url;

                  return (
                    <tr key={p._id} className="hover:bg-[#FFFBF4]/80 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover bg-[#FFF0D9] shrink-0 border border-[#D8B46A]/30"
                          />
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-sm text-[#082B59] block truncate max-w-xs">
                              {p.name}
                            </span>
                            {p.needsOwnerReview && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>{p.reviewNote || 'Flagged for Owner Review'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#FFF0D9] text-[#082B59] text-[11px] font-semibold border border-[#D8B46A]/40">
                          {p.category}
                        </span>
                      </td>

                      {/* Weight Variants & Prices */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {(p.variants || []).map((v, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 text-[#082B59] text-[11px] font-medium border border-slate-200"
                            >
                              <strong>{v.weight}</strong>: {formatINR(v.price)}
                              {v.pricingUnit === 'per_pound' && ' /lb'}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all shadow-sm ${
                            isAvail
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                          }`}
                          title="Click to toggle availability"
                        >
                          {isAvail ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 text-rose-700" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFeat
                              ? 'text-[#BC964B] bg-[#FFF0D9]'
                              : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title="Toggle featured status"
                        >
                          <Star className={`w-4 h-4 ${isFeat ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/product/${p.slug || p._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#082B59]/60 hover:text-[#082B59] rounded-lg hover:bg-[#FFF0D9]"
                            title="View product on customer website"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${p._id}`}
                            className="p-1.5 text-[#082B59] hover:text-[#BC964B] rounded-lg hover:bg-[#FFF0D9]"
                            title="Edit product details & prices"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
